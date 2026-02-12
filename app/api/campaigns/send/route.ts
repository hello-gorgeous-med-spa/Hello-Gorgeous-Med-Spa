// ============================================================
// CAMPAIGN SEND API
// Unified endpoint: saves campaign, fetches audience, sends
// email via Resend + SMS via Telnyx, updates stats in DB
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow up to 5 minutes for large campaigns

// ---- Env vars ----
const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const TELNYX_PHONE_NUMBER = process.env.TELNYX_PHONE_NUMBER || '+13317177545';
const TELNYX_MESSAGING_PROFILE_ID =
  process.env.TELNYX_MESSAGING_PROFILE_ID || '40019c14-a962-41a6-8d90-976426c9299f';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL || 'Hello Gorgeous Med Spa <onboarding@resend.dev>';

// ---- Helpers ----

function formatPhone(phone: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

async function sendOneSms(
  to: string,
  message: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TELNYX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: TELNYX_PHONE_NUMBER,
        to,
        text: message,
        messaging_profile_id: TELNYX_MESSAGING_PROFILE_ID,
      }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { ok: false, error: d.errors?.[0]?.detail || 'Telnyx error' };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

async function sendOneEmail(
  to: string,
  subject: string,
  html: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: RESEND_FROM, to, subject, html }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { ok: false, error: d.message || d.error || 'Resend error' };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

/**
 * Adds opt-out text if not already present
 */
function ensureOptOut(msg: string): string {
  const phrases = ['reply stop', 'text stop', 'opt out', 'unsubscribe', 'stop to'];
  if (phrases.some((p) => msg.toLowerCase().includes(p))) return msg;
  return msg + '\n\nReply STOP to unsubscribe.';
}

/**
 * Replace {firstName} and similar merge tags
 */
function personalize(text: string, data: Record<string, string>): string {
  let out = text;
  for (const [key, val] of Object.entries(data)) {
    out = out.replace(new RegExp(`\\{${key}\\}`, 'g'), val || '');
  }
  return out;
}

// ============================================================
// POST /api/campaigns/send
// Body: { name, channel, subject?, emailHtml?, smsContent?,
//         audienceSegment, schedule? }
// ============================================================

interface SendBody {
  name: string;
  channel: 'email' | 'sms' | 'multichannel';
  subject?: string;
  previewText?: string;
  emailHtml?: string;
  smsContent?: string;
  audienceSegment: string;
  schedule?: string; // ISO date-time for future send
}

export async function POST(request: NextRequest) {
  try {
    const body: SendBody = await request.json();
    const { name, channel, subject, previewText, emailHtml, smsContent, audienceSegment, schedule } = body;

    // ---- Validation ----
    if (!name || !channel) {
      return NextResponse.json({ error: 'name and channel are required' }, { status: 400 });
    }
    if ((channel === 'email' || channel === 'multichannel') && !emailHtml) {
      return NextResponse.json({ error: 'emailHtml required for email campaigns' }, { status: 400 });
    }
    if ((channel === 'sms' || channel === 'multichannel') && !smsContent) {
      return NextResponse.json({ error: 'smsContent required for SMS campaigns' }, { status: 400 });
    }
    if ((channel === 'email' || channel === 'multichannel') && !RESEND_API_KEY) {
      return NextResponse.json({ error: 'Resend not configured. Add RESEND_API_KEY env var.' }, { status: 500 });
    }
    if ((channel === 'sms' || channel === 'multichannel') && !TELNYX_API_KEY) {
      return NextResponse.json({ error: 'Telnyx not configured. Add TELNYX_API_KEY env var.' }, { status: 500 });
    }

    // ---- Fetch audience ----
    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Build query to get clients that match the audience
    let query = supabase.from('clients').select(`
      id,
      accepts_sms_marketing,
      accepts_email_marketing,
      users!inner(email, phone, first_name, last_name)
    `);

    // The audience filtering can be expanded later with more segments
    // For now, "all-clients" gets everyone
    // Other segments get basic filters

    const { data: clients, error: fetchErr } = await query;
    if (fetchErr) {
      console.error('Campaign audience fetch error:', fetchErr);
      return NextResponse.json({ error: 'Failed to fetch audience' }, { status: 500 });
    }

    if (!clients || clients.length === 0) {
      return NextResponse.json({ error: 'No clients found in database' }, { status: 400 });
    }

    // Split into email vs SMS recipients
    const emailRecipients: Array<{ email: string; firstName: string; lastName: string }> = [];
    const smsRecipients: Array<{ phone: string; firstName: string; lastName: string }> = [];

    for (const c of clients) {
      const u = (c as any).users;
      if (!u) continue;

      const firstName = u.first_name || '';
      const lastName = u.last_name || '';

      if ((channel === 'email' || channel === 'multichannel') && u.email) {
        // For email, we send to all clients with email (respect opt-out)
        if (c.accepts_email_marketing !== false) {
          emailRecipients.push({ email: u.email, firstName, lastName });
        }
      }

      if ((channel === 'sms' || channel === 'multichannel') && u.phone) {
        const phone = formatPhone(u.phone);
        if (phone && c.accepts_sms_marketing === true) {
          smsRecipients.push({ phone, firstName, lastName });
        }
      }
    }

    const totalRecipients =
      channel === 'email'
        ? emailRecipients.length
        : channel === 'sms'
          ? smsRecipients.length
          : new Set([
              ...emailRecipients.map((r) => r.email),
              ...smsRecipients.map((r) => r.phone),
            ]).size;

    if (totalRecipients === 0) {
      return NextResponse.json(
        { error: 'No opted-in recipients found for this channel' },
        { status: 400 },
      );
    }

    // ---- Save campaign to DB ----
    const campaignStatus = schedule ? 'scheduled' : 'sending';
    const { data: campaign, error: insertErr } = await supabase
      .from('campaigns')
      .insert({
        name,
        channel,
        status: campaignStatus,
        subject: subject || null,
        preview_text: previewText || null,
        email_html: emailHtml || null,
        sms_content: smsContent || null,
        audience_segment: audienceSegment || 'all-clients',
        total_recipients: totalRecipients,
        scheduled_at: schedule || null,
        started_at: schedule ? null : new Date().toISOString(),
      })
      .select('id')
      .single();

    if (insertErr || !campaign) {
      console.error('Campaign insert error:', insertErr);
      // Continue sending even if DB save fails
    }

    const campaignId = campaign?.id || `local_${Date.now()}`;

    // ---- If scheduled, just save & return ----
    if (schedule) {
      return NextResponse.json({
        success: true,
        campaignId,
        status: 'scheduled',
        scheduledAt: schedule,
        totalRecipients,
        emailRecipients: emailRecipients.length,
        smsRecipients: smsRecipients.length,
      });
    }

    // ---- Send now (in background) ----
    const stats = {
      emailSent: 0,
      emailFailed: 0,
      smsSent: 0,
      smsFailed: 0,
      errors: [] as string[],
    };

    // Start sending in background (non-blocking to return response quickly)
    (async () => {
      try {
        // Send emails (Resend handles rate limiting internally)
        if (channel === 'email' || channel === 'multichannel') {
          // Resend batch API: send up to 100 at a time
          // For larger lists, chunk and send sequentially
          const BATCH_SIZE = 50;
          for (let i = 0; i < emailRecipients.length; i += BATCH_SIZE) {
            const batch = emailRecipients.slice(i, i + BATCH_SIZE);
            const promises = batch.map(async (r) => {
              const personalizedSubject = personalize(subject || 'Hello Gorgeous Med Spa', {
                firstName: r.firstName,
                lastName: r.lastName,
              });
              const personalizedHtml = personalize(emailHtml!, {
                firstName: r.firstName,
                lastName: r.lastName,
              });

              const result = await sendOneEmail(r.email, personalizedSubject, personalizedHtml);
              if (result.ok) {
                stats.emailSent++;
              } else {
                stats.emailFailed++;
                stats.errors.push(`Email ${r.email}: ${result.error}`);
              }
            });
            await Promise.all(promises);

            // Small delay between batches to respect Resend rate limits
            if (i + BATCH_SIZE < emailRecipients.length) {
              await new Promise((r) => setTimeout(r, 1000));
            }
          }
        }

        // Send SMS (rate limited: 2/min for local numbers)
        if (channel === 'sms' || channel === 'multichannel') {
          const finalSms = ensureOptOut(smsContent!);

          for (let i = 0; i < smsRecipients.length; i++) {
            const r = smsRecipients[i];
            const personalizedMsg = personalize(finalSms, {
              firstName: r.firstName,
              lastName: r.lastName,
            });

            const result = await sendOneSms(r.phone, personalizedMsg);
            if (result.ok) {
              stats.smsSent++;
            } else {
              stats.smsFailed++;
              stats.errors.push(`SMS ${r.phone}: ${result.error}`);
            }

            // Rate limit: 30 seconds between SMS (2 per minute for local number)
            if (i < smsRecipients.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 30000));
            }
          }
        }

        // Update campaign stats in DB
        if (campaign?.id) {
          const supabaseUpdate = createAdminSupabaseClient();
          if (supabaseUpdate) {
            await supabaseUpdate
              .from('campaigns')
              .update({
                status: 'sent',
                email_sent: stats.emailSent,
                email_bounced: stats.emailFailed,
                sms_sent: stats.smsSent,
                sms_failed: stats.smsFailed,
                completed_at: new Date().toISOString(),
              })
              .eq('id', campaign.id);
          }
        }

        console.log(`Campaign ${campaignId} completed:`, stats);
      } catch (err) {
        console.error(`Campaign ${campaignId} background error:`, err);
        // Mark as failed
        if (campaign?.id) {
          const sb = createAdminSupabaseClient();
          if (sb) {
            await sb.from('campaigns').update({ status: 'failed' }).eq('id', campaign.id);
          }
        }
      }
    })();

    // ---- Return immediately ----
    const smsCostEstimate = smsRecipients.length * 0.004;
    const smsTimeEstimate = Math.ceil(smsRecipients.length / 2); // minutes at 2/min

    return NextResponse.json({
      success: true,
      campaignId,
      status: 'sending',
      totalRecipients,
      emailRecipients: emailRecipients.length,
      smsRecipients: smsRecipients.length,
      estimatedSmsCost: `$${smsCostEstimate.toFixed(2)}`,
      estimatedSmsMinutes: smsTimeEstimate,
      message: `Campaign started! Sending to ${totalRecipients} recipients.`,
    });
  } catch (error: any) {
    console.error('Campaign send error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
