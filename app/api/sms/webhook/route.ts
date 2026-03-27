// ============================================================
// TWILIO SMS WEBHOOK
// Incoming messages (STOP opt-outs, HELP) + optional status callbacks
// Configure in Twilio: Messaging → your number → "A message comes in" → POST this URL
// Optional: Status callback URL on the Messaging Service for delivery updates
// Body: application/x-www-form-urlencoded (From, To, Body, MessageSid, MessageStatus, …)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { sendSms } from '@/lib/notifications/sms-outbound';

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
        await admin
          .from('unsubscribes')
          .insert({
            client_id: clientId,
            phone: phoneNorm,
            channel: 'sms',
            source: 'twilio_stop',
            unsubscribed_at: new Date().toISOString(),
          })
          .then(() => {})
          .catch(() => {});
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

    const optInKeywords = ['START', 'YES', 'SUBSCRIBE', 'UNSTOP'];
    const isOptIn = optInKeywords.some((keyword) => text === keyword);

    if (isOptIn && from) {
      await supabase
        ?.from('sms_opt_outs')
        .update({ resubscribed_at: new Date().toISOString() })
        .eq('phone', from);
      await supabase?.from('clients').update({ accepts_sms_marketing: true }).eq('phone', from);
      console.log(`[sms/webhook] Resubscribe recorded for: ${from}`);
    }

    if (text === 'HELP' && from) {
      const helpMessage =
        'Hello Gorgeous Med Spa: For assistance call 630-636-6193 or visit https://hellogorgeousmedspa.com/contact';
      await sendSms(from, helpMessage);
      console.log(`[sms/webhook] Help response sent to: ${from}`);
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
