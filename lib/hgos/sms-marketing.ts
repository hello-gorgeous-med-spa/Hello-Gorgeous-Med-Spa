// ============================================================
// HELLO GORGEOUS OS - SMS MARKETING SYSTEM
// Supports: SimpleTexting, Twilio
// ============================================================

export type SMSProvider = 'simpletexting' | 'twilio' | 'none';

export interface SMSConfig {
  provider: SMSProvider;
  // SimpleTexting
  simpleTextingApiKey?: string;
  simpleTextingAccountPhone?: string;
  // Twilio
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioPhoneNumber?: string;
}

export interface SMSMessage {
  to: string; // Phone number
  body: string;
  mediaUrl?: string; // For MMS
}

export interface SMSCampaign {
  id: string;
  name: string;
  type: 'promotional' | 'transactional';
  message: string;
  mediaUrl?: string; // MMS image
  scheduledAt?: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  audienceFilter?: AudienceFilter;
  stats?: CampaignStats;
}

export interface AudienceFilter {
  tags?: string[];
  lastVisitDays?: number; // Clients who visited within X days
  noVisitDays?: number; // Clients who haven't visited in X days
  membershipStatus?: 'active' | 'inactive' | 'all';
  hasUpcomingAppointment?: boolean;
  customList?: string[]; // Specific client IDs
}

export interface CampaignStats {
  totalRecipients: number;
  sent: number;
  delivered: number;
  failed: number;
  optOuts: number;
}

export interface SMSTemplate {
  id: string;
  name: string;
  category: 'appointment' | 'promotional' | 'reminder' | 'followup';
  message: string;
  variables: string[]; // e.g., ['firstName', 'appointmentDate']
}

// ============================================================
// PRE-BUILT SMS TEMPLATES
// ============================================================

export const SMS_TEMPLATES: SMSTemplate[] = [
  // === APPOINTMENT TEMPLATES ===
  {
    id: 'appt_confirmation',
    name: 'Appointment Confirmation',
    category: 'appointment',
    message: 'Hi {{firstName}}! Your appointment at Hello Gorgeous Med Spa is confirmed for {{appointmentDate}} at {{appointmentTime}}. See you soon! Reply STOP to unsubscribe.',
    variables: ['firstName', 'appointmentDate', 'appointmentTime'],
  },
  {
    id: 'appt_reminder_24h',
    name: '24-Hour Reminder',
    category: 'reminder',
    message: 'Hi {{firstName}}, reminder: Your appointment is tomorrow at {{appointmentTime}}. Please arrive 5-10 mins early. Need to reschedule? Call (630) 636-6193. Reply STOP to opt out.',
    variables: ['firstName', 'appointmentTime'],
  },
  {
    id: 'appt_reminder_2h',
    name: '2-Hour Reminder',
    category: 'reminder',
    message: '{{firstName}}, see you in 2 hours for your appointment at Hello Gorgeous! Address: 74 W. Washington St, Oswego. Reply STOP to unsubscribe.',
    variables: ['firstName'],
  },

  // === PROMOTIONAL TEMPLATES ===
  {
    id: 'flash_sale',
    name: 'Flash Sale',
    category: 'promotional',
    message: '🔥 FLASH SALE! {{discount}}% OFF {{service}} this week only at Hello Gorgeous Med Spa! Book now: {{bookingLink}} Reply STOP to opt out.',
    variables: ['discount', 'service', 'bookingLink'],
  },
  {
    id: 'new_service',
    name: 'New Service Announcement',
    category: 'promotional',
    message: '✨ NEW at Hello Gorgeous: {{serviceName}}! {{description}} Book your appointment: {{bookingLink}} Reply STOP to unsubscribe.',
    variables: ['serviceName', 'description', 'bookingLink'],
  },
  {
    id: 'birthday',
    name: 'Birthday Offer',
    category: 'promotional',
    message: '🎂 Happy Birthday {{firstName}}! Enjoy {{discount}}% off your next treatment at Hello Gorgeous Med Spa! Valid this month. Book now: {{bookingLink}} Reply STOP to opt out.',
    variables: ['firstName', 'discount', 'bookingLink'],
  },
  {
    id: 'loyalty_reward',
    name: 'Loyalty Reward',
    category: 'promotional',
    message: '🌟 {{firstName}}, you\'ve earned {{points}} Gorgeous Rewards points! That\'s ${{value}} toward your next treatment! Book: {{bookingLink}} Reply STOP to unsubscribe.',
    variables: ['firstName', 'points', 'value', 'bookingLink'],
  },
  {
    id: 'miss_you',
    name: 'We Miss You',
    category: 'promotional',
    message: 'Hey {{firstName}}! We miss you at Hello Gorgeous! ❤️ Come back for {{discount}}% off your next visit. Book: {{bookingLink}} Reply STOP to opt out.',
    variables: ['firstName', 'discount', 'bookingLink'],
  },
  {
    id: 'referral_thank_you',
    name: 'Referral Thank You',
    category: 'promotional',
    message: '{{firstName}}, THANK YOU for referring a friend! 🙏 Your ${{reward}} credit has been added to your account. Book your next visit: {{bookingLink}} Reply STOP to opt out.',
    variables: ['firstName', 'reward', 'bookingLink'],
  },

  // === FOLLOW-UP TEMPLATES ===
  {
    id: 'post_treatment',
    name: 'Post-Treatment Check-In',
    category: 'followup',
    message: 'Hi {{firstName}}! How are you feeling after your {{treatment}} yesterday? Any questions, just call us at (630) 636-6193. We\'re here for you! Reply STOP to opt out.',
    variables: ['firstName', 'treatment'],
  },
  {
    id: 'review_request',
    name: 'Review Request',
    category: 'followup',
    message: '{{firstName}}, thank you for visiting Hello Gorgeous! ⭐ We\'d love your feedback: {{reviewLink}} It means the world to us! Reply STOP to unsubscribe.',
    variables: ['firstName', 'reviewLink'],
  },
  {
    id: 'restock_reminder',
    name: 'Product Restock Reminder',
    category: 'followup',
    message: 'Hi {{firstName}}! Time to restock your {{productName}}? Order online or grab it at your next visit! Book: {{bookingLink}} Reply STOP to opt out.',
    variables: ['firstName', 'productName', 'bookingLink'],
  },
];

// ============================================================
// COMPLIANCE HELPERS
// ============================================================

/**
 * Validates phone number format (US)
 */
export function validatePhoneNumber(phone: string): { valid: boolean; formatted: string; error?: string } {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Check length
  if (digits.length === 10) {
    // Format as +1XXXXXXXXXX
    return { valid: true, formatted: `+1${digits}` };
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return { valid: true, formatted: `+${digits}` };
  } else {
    return { valid: false, formatted: phone, error: 'Invalid phone number. Must be 10 digits.' };
  }
}

/**
 * Ensures message includes opt-out language (required by TCPA)
 */
export function ensureOptOutLanguage(message: string): string {
  const optOutPhrases = ['reply stop', 'text stop', 'opt out', 'unsubscribe', 'stop to'];
  const hasOptOut = optOutPhrases.some(phrase => message.toLowerCase().includes(phrase));
  
  if (!hasOptOut) {
    return message + ' Reply STOP to unsubscribe.';
  }
  return message;
}

/**
 * Validates SMS message length
 */
export function validateSMSLength(message: string): { 
  valid: boolean; 
  length: number; 
  segments: number; 
  warning?: string 
} {
  const length = message.length;
  
  // Standard SMS is 160 chars, but with Unicode can be less
  const hasUnicode = /[^\x00-\x7F]/.test(message);
  const segmentSize = hasUnicode ? 70 : 160;
  const segments = Math.ceil(length / segmentSize);
  
  if (length > 1600) {
    return { valid: false, length, segments, warning: 'Message too long. Max 1600 characters.' };
  }
  
  if (segments > 1) {
    return { 
      valid: true, 
      length, 
      segments, 
      warning: `Message will be sent as ${segments} segments (${hasUnicode ? 'Unicode detected' : 'standard'}).` 
    };
  }
  
  return { valid: true, length, segments };
}

/**
 * Replace template variables with actual values
 */
export function renderTemplate(template: string, variables: Record<string, string>): string {
  let rendered = template;
  Object.entries(variables).forEach(([key, value]) => {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return rendered;
}

// ============================================================
// SEND FUNCTIONS (Provider-specific implementations)
// ============================================================

/**
 * Send SMS via SimpleTexting API
 */
export async function sendViaSimpleTexting(
  message: SMSMessage,
  config: SMSConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!config.simpleTextingApiKey) {
    return { success: false, error: 'SimpleTexting API key not configured' };
  }
  
  try {
    const response = await fetch('https://api.simpletexting.com/v2/api/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.simpleTextingApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactPhone: message.to,
        mode: 'SINGLE_SMS',
        text: message.body,
        ...(message.mediaUrl && { mediaUrl: message.mediaUrl }),
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, messageId: data.id };
    } else {
      return { success: false, error: data.message || 'Failed to send' };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Send SMS via Twilio
 */
export async function sendViaTwilio(
  message: SMSMessage,
  config: SMSConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!config.twilioAccountSid || !config.twilioAuthToken || !config.twilioPhoneNumber) {
    return { success: false, error: 'Twilio credentials not configured' };
  }
  
  try {
    const auth = Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString('base64');
    
    const body = new URLSearchParams({
      To: message.to,
      From: config.twilioPhoneNumber,
      Body: message.body,
      ...(message.mediaUrl && { MediaUrl: message.mediaUrl }),
    });
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, messageId: data.sid };
    } else {
      const code = data.code != null ? ` [${data.code}]` : "";
      const more = data.more_info ? ` — ${data.more_info}` : "";
      return {
        success: false,
        error: `${data.message || "Twilio request failed"}${code}${more}`.trim(),
      };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Universal send function - routes to configured provider
 */
export async function sendSMS(
  message: SMSMessage,
  config: SMSConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Validate and format phone number
  const phoneValidation = validatePhoneNumber(message.to);
  if (!phoneValidation.valid) {
    return { success: false, error: phoneValidation.error };
  }
  
  // Ensure opt-out language
  const compliantMessage = {
    ...message,
    to: phoneValidation.formatted,
    body: ensureOptOutLanguage(message.body),
  };
  
  // Route to provider
  switch (config.provider) {
    case 'simpletexting':
      return sendViaSimpleTexting(compliantMessage, config);
    case 'twilio':
      return sendViaTwilio(compliantMessage, config);
    default:
      return { success: false, error: 'No SMS provider configured' };
  }
}

/**
 * Send bulk campaign
 */
export async function sendCampaign(
  campaign: SMSCampaign,
  recipients: Array<{ phone: string; variables?: Record<string, string> }>,
  config: SMSConfig
): Promise<{ total: number; sent: number; failed: number; errors: string[] }> {
  const results = { total: recipients.length, sent: 0, failed: 0, errors: [] as string[] };
  
  for (const recipient of recipients) {
    const message = campaign.message;
    const renderedMessage = recipient.variables 
      ? renderTemplate(message, recipient.variables)
      : message;
    
    const result = await sendSMS(
      { to: recipient.phone, body: renderedMessage, mediaUrl: campaign.mediaUrl },
      config
    );
    
    if (result.success) {
      results.sent++;
    } else {
      results.failed++;
      results.errors.push(`${recipient.phone}: ${result.error}`);
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

// ============================================================
// COST CALCULATOR
// ============================================================

export interface SMSCostEstimate {
  provider: SMSProvider;
  messageCount: number;
  segmentsPerMessage: number;
  totalSegments: number;
  costPerSegment: number;
  totalCost: number;
  monthlyFee: number;
  totalWithFee: number;
}

export function estimateSMSCost(
  provider: SMSProvider,
  messageCount: number,
  averageSegments: number = 1
): SMSCostEstimate {
  const pricing: Record<SMSProvider, { perSegment: number; monthlyFee: number }> = {
    simpletexting: { perSegment: 0.05, monthlyFee: 29 }, // Included in plan up to limit
    twilio: { perSegment: 0.0079, monthlyFee: 0 },
    none: { perSegment: 0, monthlyFee: 0 },
  };
  
  const { perSegment, monthlyFee } = pricing[provider];
  const totalSegments = messageCount * averageSegments;
  const totalCost = totalSegments * perSegment;
  
  return {
    provider,
    messageCount,
    segmentsPerMessage: averageSegments,
    totalSegments,
    costPerSegment: perSegment,
    totalCost,
    monthlyFee,
    totalWithFee: totalCost + monthlyFee,
  };
}
