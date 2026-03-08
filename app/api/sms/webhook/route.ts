// ============================================================
// TELNYX SMS WEBHOOK
// Handles incoming messages (STOP opt-outs, HELP), delivery receipts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { sendSmsTelnyx } from '@/lib/notifications/telnyx';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createServerSupabaseClient();

    // Telnyx sends events in data.event_type format
    const eventType = body.data?.event_type;
    const payload = body.data?.payload;

    console.log('Telnyx webhook received:', eventType);

    switch (eventType) {
      // Incoming SMS message
      case 'message.received': {
        const from = payload?.from?.phone_number;
        const text = payload?.text?.toUpperCase().trim();
        const messageId = payload?.id;

        // Check for opt-out keywords (TCPA compliance)
        const optOutKeywords = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];
        const isOptOut = optOutKeywords.some(keyword => text === keyword || text?.startsWith(keyword + ' '));

        if (isOptOut && from) {
          const admin = createAdminSupabaseClient();
          const phoneNorm = from.startsWith('+') ? from : `+1${from.replace(/\D/g, '')}`;

          // Automation: unsubscribes + consent_sms (queue processor checks these)
          if (admin) {
            const { data: clientRow } = await admin.from('clients').select('id').eq('phone', phoneNorm).limit(1).maybeSingle();
            const clientId = clientRow?.id ?? null;
            await admin.from('unsubscribes').insert({
              client_id: clientId,
              phone: phoneNorm,
              channel: 'sms',
              source: 'telnyx_stop',
              unsubscribed_at: new Date().toISOString(),
            }).then(() => {}).catch(() => {}); // ignore duplicate
            await admin.from('clients').update({ consent_sms: false, accepts_sms_marketing: false }).eq('phone', phoneNorm);
          }

          // Legacy: sms_opt_outs + sms_messages
          await supabase?.from('sms_opt_outs').upsert({
            phone: phoneNorm,
            opt_out_method: 'STOP',
            opted_out_at: new Date().toISOString(),
          }, { onConflict: 'phone' });
          await supabase?.from('clients').update({ accepts_sms_marketing: false }).eq('phone', phoneNorm);
          await supabase?.from('sms_messages').insert({
            recipient_phone: phoneNorm,
            message_type: 'opt_out',
            message_content: text,
            sender_phone: payload?.to?.phone_number,
            telnyx_message_id: messageId,
            status: 'received',
            sent_via: 'inbound',
          });

          console.log(`Opt-out recorded for: ${phoneNorm}`);
        }

        // Check for opt-in (resubscribe) keywords
        const optInKeywords = ['START', 'YES', 'SUBSCRIBE', 'UNSTOP'];
        const isOptIn = optInKeywords.some(keyword => text === keyword);

        if (isOptIn && from) {
          // Update opt-out record to resubscribed
          await supabase
            .from('sms_opt_outs')
            .update({ resubscribed_at: new Date().toISOString() })
            .eq('phone', from);

          // Update client record if exists
          await supabase
            .from('clients')
            .update({ accepts_sms_marketing: true })
            .eq('phone', from);

          console.log(`Resubscribe recorded for: ${from}`);
        }

        // Check for HELP keyword - 10DLC compliance: auto-respond with support info
        if (text === 'HELP' && from) {
          const helpMessage = 'Hello Gorgeous Med Spa: For assistance call 630-636-6193 or visit https://hellogorgeousmedspa.com/contact';
          const toNumber = from.startsWith('+') ? from : `+1${from.replace(/\D/g, '')}`;
          await sendSmsTelnyx(toNumber, helpMessage);
          console.log(`Help response sent to: ${from}`);
        }

        break;
      }

      // Delivery receipt
      case 'message.sent':
      case 'message.delivered': {
        const messageId = payload?.id;
        const status = eventType === 'message.delivered' ? 'delivered' : 'sent';

        // Update message status
        if (messageId) {
          await supabase
            .from('sms_messages')
            .update({ 
              status,
              delivered_at: status === 'delivered' ? new Date().toISOString() : null,
            })
            .eq('telnyx_message_id', messageId);
        }
        break;
      }

      // Failed delivery
      case 'message.finalized': {
        const messageId = payload?.id;
        const finalStatus = payload?.to?.[0]?.status;
        
        if (messageId && finalStatus === 'delivery_failed') {
          await supabase
            .from('sms_messages')
            .update({ 
              status: 'failed',
              error_message: payload?.errors?.[0]?.detail || 'Delivery failed',
            })
            .eq('telnyx_message_id', messageId);
        }
        break;
      }

      default:
        console.log('Unhandled Telnyx event:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Telnyx webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Also handle GET for webhook verification
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Telnyx SMS webhook endpoint',
    supported_events: [
      'message.received',
      'message.sent', 
      'message.delivered',
      'message.finalized'
    ]
  });
}
