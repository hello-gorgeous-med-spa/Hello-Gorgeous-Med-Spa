/**
 * REGEN RX SMS Notifications
 * 
 * Sends SMS notifications to patients using Twilio
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

interface SMSPayload {
  to: string;
  message: string;
}

/**
 * Send an SMS message
 */
export async function sendSMS(payload: SMSPayload): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.warn('Twilio not configured, skipping SMS');
    return false;
  }

  try {
    const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    
    await twilio.messages.create({
      body: payload.message,
      from: TWILIO_PHONE_NUMBER,
      to: payload.to,
    });

    return true;
  } catch (error) {
    console.error('SMS send failed:', error);
    return false;
  }
}

/**
 * Send patient notification SMS
 */
export async function sendPatientSMS(
  phone: string,
  type: 'rx_approved' | 'order_shipped' | 'order_delivered' | 'refill_reminder',
  data?: { trackingNumber?: string; program?: string }
): Promise<boolean> {
  const messages: Record<string, string> = {
    rx_approved: '✅ REGEN RX: Great news! Your prescription has been approved and sent to the pharmacy. Check your email for details.',
    order_shipped: `📦 REGEN RX: Your order has shipped! ${data?.trackingNumber ? `Track: ${data.trackingNumber}` : 'Check your email for tracking.'}`,
    order_delivered: '🎉 REGEN RX: Your order has been delivered! Questions? Reply to this text or call (630) 636-6193.',
    refill_reminder: `⏰ REGEN RX: Time to refill your ${data?.program || 'prescription'}! Visit tryregenrx.com/start to reorder.`,
  };

  const message = messages[type];
  if (!message) return false;

  return sendSMS({ to: phone, message });
}

/**
 * Send staff notification SMS
 */
export async function sendStaffSMS(
  type: 'new_intake' | 'urgent',
  data: { patientName?: string; message?: string }
): Promise<boolean> {
  const STAFF_PHONE = process.env.REGEN_STAFF_PHONE || '+16308813398';

  const messages: Record<string, string> = {
    new_intake: `🔔 REGEN RX: New intake from ${data.patientName}. Review at tryregenrx.com/ops`,
    urgent: `🚨 REGEN RX: ${data.message}`,
  };

  const message = messages[type];
  if (!message) return false;

  return sendSMS({ to: STAFF_PHONE, message });
}
