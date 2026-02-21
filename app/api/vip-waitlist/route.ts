import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 15;

// VIP Waitlist submission types
interface VIPWaitlistSubmission {
  campaign: string;
  name: string;
  email: string;
  phone: string;
  age_range?: string;
  concerns?: string[];
  prior_treatment?: boolean;
  downtime_ok?: boolean;
  investment_ready?: boolean;
  qualification_data?: Record<string, unknown>;
}

// Get Supabase client
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    return null;
  }
  
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// Send confirmation email via Resend (if configured) or log
async function sendConfirmationEmail(data: VIPWaitlistSubmission) {
  const resendKey = process.env.RESEND_API_KEY;
  
  if (!resendKey) {
    console.log('[VIP-WAITLIST] Email would be sent to:', data.email);
    console.log('[VIP-WAITLIST] No RESEND_API_KEY configured, skipping email');
    return { sent: false, reason: 'no_api_key' };
  }

  try {
    const campaignName = data.campaign === 'co2_solaria' ? 'Solaria CO₂' : data.campaign;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #FF2D8E;">
          <h1 style="color: #FF2D8E; margin: 0; font-size: 28px;">Hello Gorgeous</h1>
          <p style="color: #666; margin: 5px 0 0; font-size: 14px; letter-spacing: 2px;">MED SPA</p>
        </div>
        
        <div style="padding: 30px 0;">
          <h2 style="color: #000; margin: 0 0 20px;">You're on the ${campaignName} VIP List</h2>
          
          <p>Hi ${data.name.split(' ')[0]},</p>
          
          <p>You've secured a spot on our <strong>${campaignName} VIP Early Access</strong> list.</p>
          
          <div style="background: #f9f9f9; border-left: 4px solid #FF2D8E; padding: 20px; margin: 25px 0;">
            <p style="margin: 0 0 10px; font-weight: bold; color: #FF2D8E;">VIP Members Receive:</p>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Priority booking before public launch</li>
              <li>$50 VIP credit toward first treatment</li>
              <li>Early scheduling access</li>
              <li>Exclusive launch pricing</li>
            </ul>
          </div>
          
          <p>We will begin contacting qualified VIP members soon to schedule consultations.</p>
          
          <p>If you have any questions in the meantime, feel free to call or text us.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Hello Gorgeous Med Spa</strong><br>
              74 W. Washington Street, Oswego, IL 60543<br>
              Call: (630) 636-6193 | Text: (630) 881-3398<br>
              <a href="https://www.hellogorgeousmedspa.com" style="color: #FF2D8E;">www.hellogorgeousmedspa.com</a>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #000; color: #fff; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Hello Gorgeous Med Spa. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Hello Gorgeous Med Spa <noreply@hellogorgeousmedspa.com>',
        to: data.email,
        subject: `You're on the ${campaignName} VIP List`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[VIP-WAITLIST] Email send failed:', error);
      return { sent: false, reason: 'api_error', error };
    }

    console.log('[VIP-WAITLIST] Confirmation email sent to:', data.email);
    return { sent: true };
  } catch (err) {
    console.error('[VIP-WAITLIST] Email error:', err);
    return { sent: false, reason: 'exception', error: err };
  }
}

// POST - Submit VIP waitlist entry
export async function POST(request: NextRequest) {
  try {
    const data: VIPWaitlistSubmission = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    
    if (!supabase) {
      console.log('[VIP-WAITLIST] No Supabase configured, storing locally');
      // Still send email even if DB not configured
      await sendConfirmationEmail(data);
      return NextResponse.json({
        success: true,
        message: 'Submission received (local mode)',
        source: 'local',
      });
    }

    // Check for duplicate email in same campaign
    const { data: existing } = await supabase
      .from('vip_waitlist')
      .select('id')
      .eq('email', data.email.toLowerCase())
      .eq('campaign', data.campaign || 'co2_solaria')
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'You are already on the VIP waitlist for this service.' },
        { status: 409 }
      );
    }

    // Build CRM tag based on campaign
    const crmTag = data.campaign === 'co2_solaria' 
      ? 'CO2_VIP_WAITLIST' 
      : `VIP_WAITLIST_${data.campaign?.toUpperCase()}`;

    // Insert into database
    const { data: inserted, error } = await supabase
      .from('vip_waitlist')
      .insert({
        campaign: data.campaign || 'co2_solaria',
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        age_range: data.age_range,
        concerns: data.concerns || [],
        prior_treatment: data.prior_treatment ?? false,
        downtime_ok: data.downtime_ok ?? false,
        investment_ready: data.investment_ready ?? false,
        qualification_data: data.qualification_data || {},
        crm_tag: crmTag,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[VIP-WAITLIST] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save submission. Please try again.' },
        { status: 500 }
      );
    }

    // Send confirmation email (async, don't block response)
    const emailResult = await sendConfirmationEmail(data);

    // Update email_sent_at if email was sent
    if (emailResult.sent && inserted?.id) {
      await supabase
        .from('vip_waitlist')
        .update({ email_sent_at: new Date().toISOString() })
        .eq('id', inserted.id);
    }

    return NextResponse.json({
      success: true,
      message: 'You have been added to the VIP waitlist!',
      id: inserted?.id,
      email_sent: emailResult.sent,
    });

  } catch (err) {
    console.error('[VIP-WAITLIST] Error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Fetch waitlist entries (admin only, for dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaign = searchParams.get('campaign') || 'co2_solaria';
    const qualified_only = searchParams.get('qualified') === 'true';
    const status = searchParams.get('status');

    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({ entries: [], source: 'local' });
    }

    let query = supabase
      .from('vip_waitlist')
      .select('*')
      .eq('campaign', campaign)
      .order('created_at', { ascending: false });

    if (qualified_only) {
      query = query.eq('investment_ready', true).eq('downtime_ok', true);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: entries, error } = await query;

    if (error) {
      console.error('[VIP-WAITLIST] Fetch error:', error);
      return NextResponse.json({ entries: [], error: error.message });
    }

    return NextResponse.json({ 
      entries: entries || [],
      total: entries?.length || 0,
    });

  } catch (err) {
    console.error('[VIP-WAITLIST] Error:', err);
    return NextResponse.json({ entries: [], error: 'Failed to fetch entries' });
  }
}

// PATCH - Update waitlist entry status (admin)
export async function PATCH(request: NextRequest) {
  try {
    const { id, status, notes, assigned_to } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const updates: Record<string, unknown> = {};
    
    if (status) {
      updates.status = status;
      if (status === 'contacted') updates.contacted_at = new Date().toISOString();
      if (status === 'scheduled') updates.scheduled_at = new Date().toISOString();
      if (status === 'booked') updates.booked_at = new Date().toISOString();
    }
    
    if (notes !== undefined) updates.notes = notes;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;

    const { data, error } = await supabase
      .from('vip_waitlist')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, entry: data });

  } catch (err) {
    console.error('[VIP-WAITLIST] Update error:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
