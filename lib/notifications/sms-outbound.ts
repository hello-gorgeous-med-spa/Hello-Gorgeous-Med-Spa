// ============================================================
// OUTBOUND SMS (Twilio)
// All transactional / automated SMS — same stack as /api/sms/send
// Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
// ============================================================

import { sendSMS } from '@/lib/hgos/sms-marketing';
import { getTwilioSmsConfig, isTwilioConfigured } from '@/lib/hgos/twilio-config';

export type SendSmsResult = {
  success: boolean;
  provider: 'twilio';
  providerMessageId: string | null;
  to: string;
  error?: string;
};

/**
 * Send a single SMS via Twilio (validates phone, adds opt-out line via sendSMS).
 */
export async function sendSms(toRaw: string, text: string): Promise<SendSmsResult> {
  if (!isTwilioConfigured()) {
    console.warn('[sms-outbound] Twilio not configured — SMS not sent');
    return {
      success: false,
      provider: 'twilio',
      providerMessageId: null,
      to: toRaw,
      error:
        'Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER.',
    };
  }

  try {
    const config = getTwilioSmsConfig();
    const result = await sendSMS({ to: toRaw, body: text }, config);

    if (result.success) {
      console.log(`[sms-outbound] SMS sent via Twilio to ${toRaw}, sid: ${result.messageId}`);
      return {
        success: true,
        provider: 'twilio',
        providerMessageId: result.messageId ?? null,
        to: toRaw,
      };
    }

    return {
      success: false,
      provider: 'twilio',
      providerMessageId: null,
      to: toRaw,
      error: result.error || 'Twilio send failed',
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[sms-outbound] Twilio send error:', error);
    return {
      success: false,
      provider: 'twilio',
      providerMessageId: null,
      to: toRaw,
      error: message,
    };
  }
}

export function isSmsOutboundConfigured(): boolean {
  return isTwilioConfigured();
}

export async function sendConsentSms(
  phone: string,
  clientName: string,
  wizardLink: string
): Promise<SendSmsResult> {
  const message = `Hello Gorgeous Med Spa: Hi ${clientName}! Please review & sign your consent forms before your appointment: ${wizardLink}`;
  return sendSms(phone, message);
}

export async function sendAppointmentReminderSms(
  phone: string,
  clientName: string,
  appointmentDate: string,
  serviceName: string
): Promise<SendSmsResult> {
  const message = `Hello Gorgeous Med Spa: Hi ${clientName}! Reminder: Your ${serviceName} appointment is scheduled for ${appointmentDate}. See you soon!`;
  return sendSms(phone, message);
}

export async function sendAppointmentConfirmationSms(
  phone: string,
  clientName: string,
  appointmentDate: string,
  serviceName: string,
  consentLink?: string,
  getAppUrl?: string
): Promise<SendSmsResult> {
  let message = `Hello Gorgeous Med Spa: Hi ${clientName}! Your ${serviceName} appointment is confirmed for ${appointmentDate}.`;
  if (consentLink) {
    message += ` Please complete your consent forms: ${consentLink}`;
  }
  if (getAppUrl) {
    message += ` Add Hello Gorgeous to your home screen for 1-tap booking: ${getAppUrl}`;
  }
  return sendSms(phone, message);
}

export async function sendSmsOptInConfirmation(phone: string): Promise<SendSmsResult> {
  const message = `Hello Gorgeous Med Spa: You have agreed to receive SMS updates including appointment reminders and promotional offers. Msg frequency varies. Msg & data rates apply. Reply STOP to opt out, HELP for help.`;
  return sendSms(phone, message);
}
