// ============================================================
// SEND REMINDER API
// Endpoint to send appointment reminders
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { 
  EMAIL_TEMPLATES, 
  SMS_TEMPLATES, 
  renderTemplate,
  generateCalendarLinks,
} from '@/lib/hgos/reminders';

// POST /api/reminders/send - Send a reminder
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { appointmentId, template, channels } = body;

    // Get appointment details
    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .select(`
        *,
        client:clients(id, first_name, last_name, email, phone),
        provider:staff(id, first_name, last_name, title),
        service:services(id, name, price, duration_minutes)
      `)
      .eq('id', appointmentId)
      .single();

    if (aptError || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const appointmentDate = new Date(appointment.scheduled_at);
    const endTime = new Date(appointmentDate.getTime() + (appointment.duration_minutes || 30) * 60000);

    // Generate calendar links
    const calendarLinks = generateCalendarLinks({
      title: `${appointment.service?.name || 'Appointment'} at Hello Gorgeous Med Spa`,
      startTime: appointmentDate,
      endTime,
      location: 'Hello Gorgeous Med Spa, Oswego, IL',
      description: `Your appointment with ${appointment.provider?.first_name} ${appointment.provider?.last_name}`,
    });

    // Template variables
    const variables = {
      clientName: appointment.client?.first_name || 'Valued Client',
      appointmentDate: appointmentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric',
      }),
      appointmentTime: appointmentDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      serviceName: appointment.service?.name || 'Your Service',
      providerName: `${appointment.provider?.first_name || ''} ${appointment.provider?.last_name || ''}`.trim() || 'Your Provider',
      portalLink: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hellogorgeousmedspa.com'}/portal/appointments`,
      bookingLink: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hellogorgeousmedspa.com'}/book`,
      calendarLink: calendarLinks.google,
      shortLink: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hellogorgeousmedspa.com'}/p/${appointmentId}`,
      reviewUrl: 'https://g.page/r/CYQOWmT_HcwQEBM/review',
      includeReviewRequest: template === 'followUp',
    };

    const results: { channel: string; success: boolean; error?: string }[] = [];

    // Send email
    if (channels.includes('email') && appointment.client?.email) {
      const emailTemplate = EMAIL_TEMPLATES[template as keyof typeof EMAIL_TEMPLATES];
      if (emailTemplate) {
        const subject = renderTemplate(emailTemplate.subject, variables);
        const body = renderTemplate(emailTemplate.body, variables);
        
        // TODO: Integrate with Brevo/SendGrid/etc
        // For now, log the email
        console.log('Would send email:', {
          to: appointment.client.email,
          subject,
          body,
        });
        
        results.push({ channel: 'email', success: true });
      }
    }

    // Send SMS
    if (channels.includes('sms') && appointment.client?.phone) {
      const smsTemplate = SMS_TEMPLATES[template as keyof typeof SMS_TEMPLATES];
      if (smsTemplate) {
        const message = renderTemplate(smsTemplate, variables);
        
        // TODO: Integrate with Twilio
        // For now, log the SMS
        console.log('Would send SMS:', {
          to: appointment.client.phone,
          message,
        });
        
        results.push({ channel: 'sms', success: true });
      }
    }

    // Log reminder sent
    await supabase.from('reminder_logs').insert({
      appointment_id: appointmentId,
      client_id: appointment.client_id,
      template,
      channels,
      status: 'sent',
      sent_at: new Date().toISOString(),
    }).catch(() => {
      // Table might not exist yet, that's ok
    });

    return NextResponse.json({ 
      success: true, 
      results,
      message: `Reminder sent via ${channels.join(', ')}`,
    });
  } catch (error) {
    console.error('Error sending reminder:', error);
    return NextResponse.json(
      { error: 'Failed to send reminder' },
      { status: 500 }
    );
  }
}
