import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';

// Telnyx Configuration
const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const TELNYX_PHONE_NUMBER = process.env.TELNYX_PHONE_NUMBER || '+13317177545';
const TELNYX_MESSAGING_PROFILE_ID = process.env.TELNYX_MESSAGING_PROFILE_ID || '40019c14-a962-41a6-8d90-976426c9299f';

// Rate limiting: 2 messages per minute for local numbers
const DELAY_BETWEEN_MESSAGES_MS = 30000; // 30 seconds = 2 per minute

/**
 * Format phone number to E.164
 */
function formatPhone(phone: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  return null;
}

/**
 * Send SMS via Telnyx
 */
async function sendSMS(to: string, message: string, mediaUrl?: string): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const response = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TELNYX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: TELNYX_PHONE_NUMBER,
        to,
        text: message,
        messaging_profile_id: TELNYX_MESSAGING_PROFILE_ID,
        ...(mediaUrl && { media_urls: [mediaUrl] }),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.errors?.[0]?.detail || 'Send failed' };
    }

    return { success: true, messageId: data.data?.id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Start a campaign - sends to all provided phone numbers
 * POST /api/sms/campaign
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, mediaUrl, recipients, sendToAll, filters } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!TELNYX_API_KEY) {
      return NextResponse.json({ error: 'Telnyx not configured' }, { status: 500 });
    }

    // Ensure opt-out language
    let finalMessage = message;
    const optOutPhrases = ['reply stop', 'text stop', 'opt out', 'unsubscribe', 'stop to'];
    const hasOptOut = optOutPhrases.some(phrase => message.toLowerCase().includes(phrase));
    if (!hasOptOut) {
      finalMessage = message + '\n\nReply STOP to unsubscribe.';
    }

    let phoneNumbers: string[] = [];

    // If specific recipients provided
    if (recipients && Array.isArray(recipients)) {
      phoneNumbers = recipients
        .map((r: string) => formatPhone(r))
        .filter((p): p is string => p !== null);
    }
    
    // If sendToAll, fetch from database
    if (sendToAll && isAdminConfigured()) {
      const supabase = createAdminSupabaseClient();
      
      // Get all clients with phone numbers who have opted IN to SMS marketing
      const { data: clients, error } = await supabase
        .from('clients')
        .select(`
          id,
          users!inner(phone, first_name, last_name)
        `)
        .eq('accepts_sms_marketing', true);

      if (error) {
        console.error('Error fetching clients:', error);
      } else if (clients) {
        const clientPhones = clients
          .map((c: any) => formatPhone(c.users?.phone))
          .filter((p): p is string => p !== null);
        phoneNumbers = [...phoneNumbers, ...clientPhones];
      }
    }

    // Remove duplicates
    phoneNumbers = [...new Set(phoneNumbers)];

    if (phoneNumbers.length === 0) {
      return NextResponse.json({ error: 'No valid phone numbers to send to' }, { status: 400 });
    }

    // Calculate estimated time
    const estimatedMinutes = Math.ceil(phoneNumbers.length / 2);
    const estimatedCost = (phoneNumbers.length * 0.004).toFixed(2);

    // For large campaigns, we'll process in background
    // For now, return the campaign info and start sending
    const campaignId = `campaign_${Date.now()}`;

    // Start sending in background (non-blocking)
    const results = {
      campaignId,
      totalRecipients: phoneNumbers.length,
      estimatedMinutes,
      estimatedCost: `$${estimatedCost}`,
      status: 'sending',
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send messages with rate limiting
    // Note: For production, this should be a background job
    (async () => {
      for (let i = 0; i < phoneNumbers.length; i++) {
        const phone = phoneNumbers[i];
        const result = await sendSMS(phone, finalMessage, mediaUrl);
        
        if (result.success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push(`${phone}: ${result.error}`);
        }

        // Rate limit: wait 30 seconds between messages (2 per minute)
        if (i < phoneNumbers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_MESSAGES_MS));
        }
      }
      results.status = 'completed';
      console.log(`Campaign ${campaignId} completed:`, results);
    })();

    return NextResponse.json({
      success: true,
      campaignId,
      totalRecipients: phoneNumbers.length,
      estimatedMinutes,
      estimatedCost: `$${estimatedCost}`,
      message: `Campaign started! Sending to ${phoneNumbers.length} recipients. Estimated time: ${estimatedMinutes} minutes.`,
      note: 'With local number rate limits (2/min), large campaigns run in background. Consider 10DLC registration for faster sending.',
    });

  } catch (error) {
    console.error('Campaign error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Get campaign cost estimate
 * GET /api/sms/campaign?count=3000
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '0');

  if (count <= 0) {
    return NextResponse.json({ error: 'Provide count parameter' }, { status: 400 });
  }

  const costPerSMS = 0.004;
  const costPerMMS = 0.015;
  const messagesPerMinute = 2;

  return NextResponse.json({
    recipients: count,
    smsCost: `$${(count * costPerSMS).toFixed(2)}`,
    mmsCost: `$${(count * costPerMMS).toFixed(2)}`,
    estimatedMinutes: Math.ceil(count / messagesPerMinute),
    estimatedHours: (count / messagesPerMinute / 60).toFixed(1),
    note: 'Upgrade to 10DLC registration for 15-60+ messages per second',
  });
}
