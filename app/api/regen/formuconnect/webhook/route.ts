import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { Resend } from 'resend';

/**
 * POST /api/regen/formuconnect/webhook
 * Receive order status updates from FormuConnect (Formulation Rx)
 * 
 * Events:
 * - order.received — Pharmacy received the order
 * - order.processing — Compounding started
 * - order.shipped — Shipped with tracking
 * - order.delivered — Delivered to patient
 * - order.cancelled — Order cancelled
 */

// Lazy init Resend to avoid build-time errors
let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  if (!resend) throw new Error('Resend not configured');
  return resend;
}

interface WebhookPayload {
  event: string;
  orderId: string;
  status?: string;
  trackingNumber?: string;
  carrier?: string;
  shipDate?: string;
  estimatedDelivery?: string;
  metadata?: Record<string, string>;
  reason?: string; // for cancellations
}

// Map FormuConnect events to our status
const EVENT_STATUS_MAP: Record<string, string> = {
  'order.received': 'pharmacy_received',
  'order.processing': 'compounding',
  'order.quality_check': 'quality_check',
  'order.shipped': 'shipped',
  'order.delivered': 'delivered',
  'order.cancelled': 'cancelled',
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json() as WebhookPayload;
    
    console.log('[formuconnect-webhook] Received:', JSON.stringify(body, null, 2));

    const { 
      event,
      orderId,
      trackingNumber,
      carrier,
      shipDate,
      estimatedDelivery,
      metadata,
      reason,
    } = body;

    if (!event || !orderId) {
      return NextResponse.json({ error: 'Missing event or orderId' }, { status: 400 });
    }

    const newStatus = EVENT_STATUS_MAP[event];
    if (!newStatus) {
      console.log(`[formuconnect-webhook] Unknown event: ${event}`);
      return NextResponse.json({ received: true, message: 'Unknown event type' });
    }

    const supabase = getSupabase();

    // Find the order by pharmacy_order_id
    const { data: order, error: findError } = await supabase
      .from('regen_orders')
      .select('id, order_number, status, patient_id')
      .eq('pharmacy_order_id', orderId)
      .single();

    if (findError || !order) {
      console.error('[formuconnect-webhook] Order not found:', orderId, findError);
      // Still acknowledge - pharmacy might send events for old orders
      return NextResponse.json({ 
        received: true, 
        warning: 'Order not found in our system',
        orderId,
      });
    }

    // Get patient email for notifications
    const { data: patient } = await supabase
      .from('regen_patients')
      .select('email, name')
      .eq('id', order.patient_id)
      .single();

    // Update the order
    const updateData: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }
    if (carrier) {
      updateData.tracking_carrier = carrier;
    }

    const { error: updateError } = await supabase
      .from('regen_orders')
      .update(updateData)
      .eq('id', order.id);

    if (updateError) {
      console.error('[formuconnect-webhook] Update failed:', updateError);
      throw updateError;
    }

    // Log to status history
    await supabase.from('regen_order_status_history').insert({
      order_id: order.id,
      status: newStatus,
      actor_type: 'pharmacy_webhook',
      notes: reason || `FormuConnect event: ${event}`,
      metadata: {
        event,
        trackingNumber,
        carrier,
        shipDate,
        estimatedDelivery,
        ...metadata,
      },
    });

    // Send email notifications for key events
    if (patient?.email) {
      try {
        await sendStatusEmail({
          event,
          email: patient.email,
          patientName: patient.name || 'Patient',
          orderNumber: order.order_number,
          trackingNumber,
          carrier,
          estimatedDelivery,
        });
      } catch (emailErr) {
        console.error('[formuconnect-webhook] Email failed:', emailErr);
        // Don't fail the webhook for email errors
      }
    }

    console.log(`[formuconnect-webhook] ✓ Order ${order.order_number} updated to ${newStatus} (${Date.now() - startTime}ms)`);

    return NextResponse.json({ 
      received: true,
      orderId,
      orderNumber: order.order_number,
      newStatus,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[formuconnect-webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

// Email templates by event
async function sendStatusEmail(params: {
  event: string;
  email: string;
  patientName: string;
  orderNumber: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
}) {
  const { event, email, patientName, orderNumber, trackingNumber, carrier, estimatedDelivery } = params;

  // Only send for specific events
  if (!['order.shipped', 'order.delivered'].includes(event)) {
    return;
  }

  const resend = getResend();
  const firstName = patientName.split(' ')[0];

  if (event === 'order.shipped') {
    // Build tracking URL
    let trackingUrl = '';
    if (trackingNumber && carrier) {
      const carrierLower = carrier.toLowerCase();
      if (carrierLower.includes('usps')) {
        trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
      } else if (carrierLower.includes('ups')) {
        trackingUrl = `https://www.ups.com/track?tracknum=${trackingNumber}`;
      } else if (carrierLower.includes('fedex')) {
        trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
      }
    }

    await resend.emails.send({
      from: 'REGEN RX <provider@hellogorgeousmedspa.com>',
      to: email,
      subject: `📦 Your REGEN RX Order Has Shipped! (${orderNumber})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📦 Your Order Has Shipped!</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151;">Hi ${firstName},</p>
            <p style="font-size: 16px; color: #374151;">Great news! Your REGEN RX order <strong>${orderNumber}</strong> is on its way.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">TRACKING INFO</p>
              ${carrier ? `<p style="margin: 0 0 5px 0; font-size: 16px;"><strong>Carrier:</strong> ${carrier}</p>` : ''}
              ${trackingNumber ? `<p style="margin: 0 0 5px 0; font-size: 16px;"><strong>Tracking #:</strong> ${trackingNumber}</p>` : ''}
              ${estimatedDelivery ? `<p style="margin: 0; font-size: 16px;"><strong>Est. Delivery:</strong> ${estimatedDelivery}</p>` : ''}
            </div>
            
            ${trackingUrl ? `
            <a href="${trackingUrl}" style="display: inline-block; background: #0d9488; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 10px 0;">
              Track Your Package →
            </a>
            ` : ''}
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #6b7280;">Questions? Reply to this email or call us at <a href="tel:+16306082222" style="color: #0d9488;">(630) 608-2222</a></p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">— The REGEN RX Team</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`[formuconnect-webhook] ✉️ Shipped email sent to ${email}`);
  }

  if (event === 'order.delivered') {
    await resend.emails.send({
      from: 'REGEN RX <provider@hellogorgeousmedspa.com>',
      to: email,
      subject: `✅ Your REGEN RX Order Was Delivered! (${orderNumber})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
          <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Your Order Was Delivered!</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151;">Hi ${firstName},</p>
            <p style="font-size: 16px; color: #374151;">Your REGEN RX order <strong>${orderNumber}</strong> has been delivered!</p>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 0; color: #065f46; font-weight: 600;">📋 Important Reminders:</p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #047857;">
                <li>Store your medication as directed on the label</li>
                <li>Follow your dosing instructions carefully</li>
                <li>Report any side effects: <a href="https://tryregenrx.com/report-issue" style="color: #059669;">tryregenrx.com/report-issue</a></li>
              </ul>
            </div>
            
            <a href="https://tryregenrx.com/login" style="display: inline-block; background: #059669; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 10px 0;">
              View Your Dashboard →
            </a>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #6b7280;">Questions? Reply to this email or call us at <a href="tel:+16306082222" style="color: #059669;">(630) 608-2222</a></p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">— The REGEN RX Team</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`[formuconnect-webhook] ✉️ Delivered email sent to ${email}`);
  }
}

// GET for webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ 
    status: 'FormuConnect webhook endpoint active',
    version: '2.0',
    events: Object.keys(EVENT_STATUS_MAP),
    timestamp: new Date().toISOString(),
  });
}
