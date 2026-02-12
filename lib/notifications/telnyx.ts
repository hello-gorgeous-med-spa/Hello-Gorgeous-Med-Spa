// ============================================================
// TELNYX SMS SENDER MODULE
// Handles all outbound SMS via Telnyx
// ============================================================

// Validate required environment variables at module load
const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const TELNYX_MESSAGING_PROFILE_ID = process.env.TELNYX_MESSAGING_PROFILE_ID;
const TELNYX_FROM_NUMBER = process.env.TELNYX_PHONE_NUMBER || process.env.TELNYX_FROM_NUMBER;

// Check env vars - will fail hard if missing in production
function validateEnvVars() {
  const missing: string[] = [];
  if (!TELNYX_API_KEY) missing.push('TELNYX_API_KEY');
  if (!TELNYX_MESSAGING_PROFILE_ID) missing.push('TELNYX_MESSAGING_PROFILE_ID');
  if (!TELNYX_FROM_NUMBER) missing.push('TELNYX_FROM_NUMBER or TELNYX_PHONE_NUMBER');
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required Telnyx env vars: ${missing.join(', ')}`);
  }
  
  return missing.length === 0;
}

/**
 * Normalize phone number to E.164 format
 * Assumes US numbers if 10 digits
 */
export function normalizeE164(phone: string): string {
  if (!phone) {
    throw new Error('Phone number is required');
  }

  // Remove all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Already E.164 format
  if (cleaned.startsWith('+')) {
    // Validate it has enough digits
    const digits = cleaned.substring(1);
    if (digits.length >= 10 && digits.length <= 15) {
      return cleaned;
    }
    throw new Error(`Invalid E.164 phone number: ${phone}`);
  }
  
  // Extract only digits
  const digits = cleaned.replace(/\D/g, '');
  
  // US 10-digit number (e.g., 3125551234)
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // US 11-digit number starting with 1 (e.g., 13125551234)
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  throw new Error(`Phone must be E.164 format or US 10-digit. Got: ${phone}`);
}

/**
 * Send SMS via Telnyx API
 */
export async function sendSmsTelnyx(
  toRaw: string, 
  text: string
): Promise<{
  success: boolean;
  provider: 'telnyx';
  providerMessageId: string | null;
  to: string;
  error?: string;
}> {
  // Validate env vars
  if (!validateEnvVars()) {
    console.warn('Telnyx not configured - SMS not sent');
    return {
      success: false,
      provider: 'telnyx',
      providerMessageId: null,
      to: toRaw,
      error: 'Telnyx not configured',
    };
  }

  try {
    const to = normalizeE164(toRaw);
    
    // Call Telnyx API directly (no SDK dependency)
    const response = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TELNYX_API_KEY}`,
      },
      body: JSON.stringify({
        from: TELNYX_FROM_NUMBER,
        to,
        text,
        messaging_profile_id: TELNYX_MESSAGING_PROFILE_ID,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Telnyx API error:', data);
      return {
        success: false,
        provider: 'telnyx',
        providerMessageId: null,
        to,
        error: data.errors?.[0]?.detail || data.message || 'Telnyx API error',
      };
    }

    const messageId = data.data?.id || data.id;
    
    console.log(`📱 SMS sent via Telnyx to ${to}, messageId: ${messageId}`);
    
    return {
      success: true,
      provider: 'telnyx',
      providerMessageId: messageId,
      to,
    };
  } catch (error: any) {
    console.error('Telnyx send error:', error);
    return {
      success: false,
      provider: 'telnyx',
      providerMessageId: null,
      to: toRaw,
      error: error.message || 'Failed to send SMS',
    };
  }
}

/**
 * Send consent form SMS
 */
export async function sendConsentSms(
  phone: string,
  clientName: string,
  wizardLink: string
): Promise<ReturnType<typeof sendSmsTelnyx>> {
  const message = `Hello Gorgeous Med Spa: Hi ${clientName}! Please review & sign your consent forms before your appointment: ${wizardLink}`;
  
  return sendSmsTelnyx(phone, message);
}

/**
 * Send appointment reminder SMS
 */
export async function sendAppointmentReminderSms(
  phone: string,
  clientName: string,
  appointmentDate: string,
  serviceName: string
): Promise<ReturnType<typeof sendSmsTelnyx>> {
  const message = `Hello Gorgeous Med Spa: Hi ${clientName}! Reminder: Your ${serviceName} appointment is scheduled for ${appointmentDate}. See you soon!`;
  
  return sendSmsTelnyx(phone, message);
}

/**
 * Send appointment confirmation SMS
 */
export async function sendAppointmentConfirmationSms(
  phone: string,
  clientName: string,
  appointmentDate: string,
  serviceName: string,
  consentLink?: string,
  getAppUrl?: string
): Promise<ReturnType<typeof sendSmsTelnyx>> {
  let message = `Hello Gorgeous Med Spa: Hi ${clientName}! Your ${serviceName} appointment is confirmed for ${appointmentDate}.`;
  
  if (consentLink) {
    message += ` Please complete your consent forms: ${consentLink}`;
  }
  
  if (getAppUrl) {
    message += ` Add Hello Gorgeous to your home screen for 1-tap booking: ${getAppUrl}`;
  }
  
  return sendSmsTelnyx(phone, message);
}

// Export validation function for health checks
export { validateEnvVars as isTelnyxConfigured };
