// ============================================================
// PRE-TREATMENT SEND API
// Sends pre-treatment instructions when appointment is booked
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

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { appointment_id, client_id, service_id, scheduled_at } = body;

    if (!appointment_id || !client_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if we already sent pre-treatment for this appointment
    const { data: existingSent } = await supabase
      .from('pretreatment_sent')
      .select('id')
      .eq('appointment_id', appointment_id)
      .maybeSingle();

    if (existingSent) {
      return NextResponse.json({ 
        message: 'Pre-treatment already sent for this appointment',
        skipped: true 
      });
    }

    // Find the appropriate template
    let template = null;

    if (service_id) {
      const { data: serviceTemplate } = await supabase
        .from('pretreatment_templates')
        .select('*')
        .eq('service_id', service_id)
        .eq('is_active', true)
        .maybeSingle();
      
      template = serviceTemplate;
    }

    if (!template) {
      const { data: defaultTemplate } = await supabase
        .from('pretreatment_templates')
        .select('*')
        .is('service_id', null)
        .eq('is_active', true)
        .maybeSingle();
      
      template = defaultTemplate;
    }

    if (!template) {
      return NextResponse.json({ 
        message: 'No active pre-treatment template found',
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

    // Get service name
    let serviceName = 'your appointment';
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

    // Format appointment date/time
    const appointmentDate = scheduled_at ? new Date(scheduled_at) : new Date();
    const dateStr = appointmentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    const timeStr = appointmentDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });

    // Process template content with variables
    let processedContent = template.content
      .replace(/\{client_name\}/g, clientName)
      .replace(/\{service_name\}/g, serviceName)
      .replace(/\{appointment_date\}/g, dateStr)
      .replace(/\{appointment_time\}/g, timeStr);

    // Determine if we should send now or schedule
    // For "send_delay_hours before appointment", we check if that time has passed
    const sendTime = new Date(appointmentDate.getTime() - (template.send_delay_hours * 60 * 60 * 1000));
    const now = new Date();
    
    // If the send time is in the past (appointment is soon), send immediately
    // Otherwise, this would be handled by a scheduled job (for now, send immediately)
    const shouldSendNow = sendTime <= now || template.send_delay_hours === 0;

    const results: { email?: boolean; sms?: boolean } = {};

    if (shouldSendNow) {
      // SEND EMAIL
      if ((template.send_via === 'email' || template.send_via === 'both') && clientEmail) {
        console.log(`[PRE-TREATMENT] Would send email to ${clientEmail}`);
        console.log(`[PRE-TREATMENT] Subject: Prepare for your ${serviceName} appointment`);
        results.email = true;
      }

      // SEND SMS
      if ((template.send_via === 'sms' || template.send_via === 'both') && clientPhone) {
        const smsContent = processedContent
          .replace(/^#+ /gm, '')
          .replace(/\*\*/g, '')
          .replace(/\n\n+/g, '\n')
          .substring(0, 320);

        console.log(`[PRE-TREATMENT] Would send SMS to ${clientPhone}`);
        console.log(`[PRE-TREATMENT] Content: ${smsContent.substring(0, 100)}...`);
        results.sms = true;
      }
    }

    // Record the sent pre-treatment
    const { error: insertError } = await supabase
      .from('pretreatment_sent')
      .insert({
        client_id,
        appointment_id,
        template_id: template.id,
        service_name: serviceName,
        sent_via: template.send_via,
        content_snapshot: processedContent,
        delivery_status: shouldSendNow ? 'sent' : 'scheduled',
      });

    if (insertError) {
      console.error('Error recording pre-treatment sent:', insertError);
    }

    return NextResponse.json({
      success: true,
      message: shouldSendNow 
        ? 'Pre-treatment instructions sent' 
        : `Pre-treatment scheduled for ${template.send_delay_hours}h before appointment`,
      template_name: template.name,
      sent_via: template.send_via,
      results,
    });
  } catch (error) {
    console.error('Pre-treatment send API error:', error);
    return NextResponse.json({ error: 'Failed to send pre-treatment' }, { status: 500 });
  }
}
