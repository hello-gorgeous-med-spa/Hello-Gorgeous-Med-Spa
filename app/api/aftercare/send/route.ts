// ============================================================
// AFTERCARE SEND API
// Sends aftercare instructions to clients after treatment
// Called when appointment status changes to completed
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) return null;
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

// Process aftercare for a completed appointment
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { appointment_id, client_id, service_id } = body;

    if (!appointment_id || !client_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if we already sent aftercare for this appointment
    const { data: existingSent } = await supabase
      .from('aftercare_sent')
      .select('id')
      .eq('appointment_id', appointment_id)
      .maybeSingle();

    if (existingSent) {
      return NextResponse.json({ 
        message: 'Aftercare already sent for this appointment',
        skipped: true 
      });
    }

    // Find the appropriate template
    // 1. First try service-specific template
    // 2. Fall back to default (null service_id)
    let template = null;

    if (service_id) {
      const { data: serviceTemplate } = await supabase
        .from('aftercare_templates')
        .select('*')
        .eq('service_id', service_id)
        .eq('is_active', true)
        .maybeSingle();
      
      template = serviceTemplate;
    }

    // Fall back to default template
    if (!template) {
      const { data: defaultTemplate } = await supabase
        .from('aftercare_templates')
        .select('*')
        .is('service_id', null)
        .eq('is_active', true)
        .maybeSingle();
      
      template = defaultTemplate;
    }

    if (!template) {
      return NextResponse.json({ 
        message: 'No active aftercare template found',
        skipped: true 
      });
    }

    // Get client info
    const { data: client } = await supabase
      .from('clients')
      .select(`
        *,
        user_profiles:user_id(first_name, last_name, email, phone)
      `)
      .eq('id', client_id)
      .single();

    if (!client || !client.user_profiles) {
      return NextResponse.json({ 
        message: 'Client not found',
        skipped: true 
      });
    }

    const clientEmail = client.user_profiles.email;
    const clientPhone = client.user_profiles.phone;
    const clientName = `${client.user_profiles.first_name} ${client.user_profiles.last_name}`;

    // Get service name if applicable
    let serviceName = 'your treatment';
    if (service_id) {
      const { data: service } = await supabase
        .from('services')
        .select('name')
        .eq('id', service_id)
        .single();
      
      if (service) {
        serviceName = service.name;
      }
    }

    // Process template content with variables
    let processedContent = template.content
      .replace(/\{client_name\}/g, clientName)
      .replace(/\{service_name\}/g, serviceName)
      .replace(/\{provider_name\}/g, 'your provider');

    // Send based on template settings
    const results: { email?: boolean; sms?: boolean } = {};

    // SEND EMAIL
    if ((template.send_via === 'email' || template.send_via === 'both') && clientEmail) {
      // In a real implementation, integrate with email provider (SendGrid, Postmark, etc.)
      // For now, we'll log and mark as sent
      console.log(`[AFTERCARE] Would send email to ${clientEmail}`);
      console.log(`[AFTERCARE] Subject: Aftercare Instructions - ${serviceName}`);
      
      // TODO: Integrate with actual email service
      // await sendEmail({ to: clientEmail, subject: ..., body: processedContent });
      
      results.email = true;
    }

    // SEND SMS
    if ((template.send_via === 'sms' || template.send_via === 'both') && clientPhone) {
      // Create SMS-friendly version (shorter, no markdown)
      const smsContent = processedContent
        .replace(/^#+ /gm, '') // Remove markdown headers
        .replace(/\*\*/g, '')   // Remove bold
        .replace(/\n\n+/g, '\n') // Collapse multiple newlines
        .substring(0, 320);     // SMS length limit

      console.log(`[AFTERCARE] Would send SMS to ${clientPhone}`);
      console.log(`[AFTERCARE] Content: ${smsContent.substring(0, 100)}...`);
      
      // TODO: Integrate with Telnyx
      // await sendSMS({ to: clientPhone, body: smsContent });
      
      results.sms = true;
    }

    // Record the sent aftercare
    const { error: insertError } = await supabase
      .from('aftercare_sent')
      .insert({
        client_id,
        appointment_id,
        template_id: template.id,
        service_name: serviceName,
        sent_via: template.send_via,
        content_snapshot: processedContent,
        delivery_status: 'sent',
      });

    if (insertError) {
      console.error('Error recording aftercare sent:', insertError);
    }

    return NextResponse.json({
      success: true,
      message: `Aftercare instructions queued for delivery`,
      template_name: template.name,
      sent_via: template.send_via,
      results,
    });
  } catch (error) {
    console.error('Aftercare send API error:', error);
    return NextResponse.json({ error: 'Failed to send aftercare' }, { status: 500 });
  }
}
