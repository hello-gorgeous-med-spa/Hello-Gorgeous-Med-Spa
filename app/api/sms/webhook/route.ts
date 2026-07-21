// ============================================================
// TWILIO SMS WEBHOOK
// Incoming messages (STOP opt-outs, HELP) + optional status callbacks
// Configure in Twilio: Messaging → your number → "A message comes in" → POST this URL
// Optional: Status callback URL on the Messaging Service for delivery updates
// Body: application/x-www-form-urlencoded (From, To, Body, MessageSid, MessageStatus, …)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { sendSMS } from '@/lib/hgos/sms-marketing';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { getTwilioSmsConfig } from '@/lib/hgos/twilio-config';
import { SITE } from '@/lib/seo';

export const dynamic = 'force-dynamic';

function normalizeE164(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let form: URLSearchParams;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const raw = await request.text();
      form = new URLSearchParams(raw);
    } else {
      // Twilio always sends form-urlencoded; tolerate JSON in tests
      try {
        const body = await request.json();
        form = new URLSearchParams(
          typeof body === 'object' && body !== null ? (body as Record<string, string>) : {},
        );
      } catch {
        return NextResponse.json({ error: 'Expected form body' }, { status: 400 });
      }
    }

    const messageSid = form.get('MessageSid') || form.get('SmsSid');
    const messageStatus = form.get('MessageStatus') || form.get('SmsStatus');
    const bodyText = form.get('Body');
    const fromRaw = form.get('From');
    const toRaw = form.get('To');
    const errorMessage = form.get('ErrorMessage');
    const hasInboundBody = form.has('Body');

    const supabase = createServerSupabaseClient();

    // Delivery / status callback (Twilio sends MessageStatus; inbound POST includes Body)
    if (messageStatus && messageSid && !hasInboundBody) {
      const status =
        messageStatus === 'delivered'
          ? 'delivered'
          : messageStatus === 'failed' || messageStatus === 'undelivered'
            ? 'failed'
            : messageStatus === 'sent' || messageStatus === 'queued' || messageStatus === 'accepted'
              ? 'sent'
              : messageStatus;

      if (supabase) {
        await supabase
          .from('sms_messages')
          .update({
            status,
            delivered_at: status === 'delivered' ? new Date().toISOString() : null,
            ...(status === 'failed' && errorMessage
              ? { error_message: errorMessage }
              : {}),
          })
          .eq('telnyx_message_id', messageSid);
      }

      return NextResponse.json({ received: true, kind: 'status' });
    }

    // Inbound SMS (Twilio includes Body in the POST)
    if (!hasInboundBody) {
      return NextResponse.json({ received: true, kind: 'ignored' });
    }

    const from = normalizeE164(fromRaw);
    const text = (bodyText ?? '').toUpperCase().trim();

    console.log('[sms/webhook] Twilio inbound message', { from: fromRaw, sid: messageSid });

    const optOutKeywords = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];
    const isOptOut = optOutKeywords.some(
      (keyword) => text === keyword || text?.startsWith(keyword + ' '),
    );

    if (isOptOut && from) {
      const admin = createAdminSupabaseClient();
      const phoneNorm = from;

      if (admin) {
        const { data: clientRow } = await admin
          .from('clients')
          .select('id')
          .eq('phone', phoneNorm)
          .limit(1)
          .maybeSingle();
        const clientId = clientRow?.id ?? null;
        try {
          await admin.from('unsubscribes').insert({
            client_id: clientId,
            phone: phoneNorm,
            channel: 'sms',
            source: 'twilio_stop',
            unsubscribed_at: new Date().toISOString(),
          });
        } catch {
          /* ignore duplicate unsubscribe */
        }
        await admin
          .from('clients')
          .update({ consent_sms: false, accepts_sms_marketing: false })
          .eq('phone', phoneNorm);
      }

      await supabase
        ?.from('sms_opt_outs')
        .upsert(
          {
            phone: phoneNorm,
            opt_out_method: 'STOP',
            opted_out_at: new Date().toISOString(),
          },
          { onConflict: 'phone' },
        );
      await supabase?.from('clients').update({ accepts_sms_marketing: false }).eq('phone', phoneNorm);
      await supabase?.from('sms_messages').insert({
        recipient_phone: phoneNorm,
        message_type: 'opt_out',
        message_content: bodyText,
        sender_phone: toRaw ?? undefined,
        telnyx_message_id: messageSid ?? undefined,
        status: 'received',
        sent_via: 'inbound',
      });

      console.log(`[sms/webhook] Opt-out recorded for: ${phoneNorm}`);
    }

    const optInKeywords = ['START', 'YES', 'SUBSCRIBE', 'UNSTOP', 'JOIN', 'GORGEOUS'];
    const isOptIn = optInKeywords.some(
      (keyword) => text === keyword || text.startsWith(keyword + ' '),
    );

    if (isOptIn && from) {
      const admin = createAdminSupabaseClient();
      const now = new Date().toISOString();
      if (admin) {
        await admin
          .from('sms_opt_outs')
          .update({ resubscribed_at: now })
          .eq('phone', from);
        // Match E.164 or last-10 digits stored formats
        const last10 = from.replace(/\D/g, '').slice(-10);
        const { data: byExact } = await admin
          .from('clients')
          .select('id')
          .eq('phone', from)
          .limit(5);
        const { data: byTail } = await admin
          .from('clients')
          .select('id')
          .ilike('phone', `%${last10}`)
          .limit(5);
        const matchedIds = new Set([
          ...(byExact || []).map((c) => c.id as string),
          ...(byTail || []).map((c) => c.id as string),
        ]);
        if (matchedIds.size) {
          for (const id of Array.from(matchedIds)) {
            await admin
              .from('clients')
              .update({ accepts_sms_marketing: true, consent_sms: true })
              .eq('id', id);
          }
        } else {
          await admin.from('clients').insert({
            phone: from,
            first_name: 'Text',
            last_name: 'Subscriber',
            accepts_sms_marketing: true,
            consent_sms: true,
            referral_source: 'sms_join',
          });
        }
      } else {
        await supabase
          ?.from('sms_opt_outs')
          .update({ resubscribed_at: now })
          .eq('phone', from);
        await supabase?.from('clients').update({ accepts_sms_marketing: true }).eq('phone', from);
      }

      const joinConfirm =
        'You are subscribed to Hello Gorgeous Med Spa texts (offers & reminders). Msg&data rates may apply. Reply STOP to unsubscribe anytime.';
      const cfg = getTwilioSmsConfig();
      const joinResult = await sendSMS({ to: from, body: joinConfirm }, cfg);
      if (!joinResult.success) {
        console.error('[sms/webhook] JOIN confirm failed:', joinResult.error);
      }
      console.log(`[sms/webhook] Opt-in/JOIN recorded for: ${from}`);
    }

    if (text === 'HELP' && from) {
      const helpMessage =
        `Hello Gorgeous Med Spa: For assistance call 630-636-6193 or visit ${SITE.url}/contact. Text JOIN for offers. Reply STOP to unsubscribe.`;
      const cfg = getTwilioSmsConfig();
      const result = await sendSMS({ to: from, body: helpMessage }, cfg);
      if (!result.success) {
        console.error('[sms/webhook] HELP Twilio send failed:', result.error);
      } else {
        console.log(`[sms/webhook] Help response sent to: ${from}`);
      }
    }

    // Hub Command Center unified thread (inbound SMS only; WhatsApp uses /api/hub/whatsapp/incoming)
    if (
      from &&
      !isOptOut &&
      (bodyText ?? '').trim() &&
      messageSid &&
      fromRaw &&
      !String(fromRaw).toLowerCase().startsWith('whatsapp:')
    ) {
      const adminHg = createAdminSupabaseClient();
      if (adminHg) {
        const { data: dup } = await adminHg
          .from('hg_messages')
          .select('id')
          .eq('twilio_sid', messageSid)
          .maybeSingle();
        if (!dup) {
          await adminHg.from('hg_messages').insert({
            client_phone: from,
            direction: 'inbound',
            channel: 'sms',
            body: bodyText ?? '',
            twilio_sid: messageSid,
            status: 'received',
            sent_at: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({ received: true, kind: 'inbound' });
  } catch (error) {
    console.error('[sms/webhook] Twilio webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Twilio SMS webhook endpoint',
    configure: 'POST with application/x-www-form-urlencoded (Twilio inbound)',
  });
}
