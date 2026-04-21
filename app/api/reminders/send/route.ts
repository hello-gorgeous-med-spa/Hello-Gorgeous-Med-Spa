// ============================================================
// SEND REMINDER API
// Endpoint to send appointment reminders
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { 
  EMAIL_TEMPLATES, 
  SMS_TEMPLATES, 
  renderTemplate,
  generateCalendarLinks,
} from '@/lib/hgos/reminders';
import { sendSms } from '@/lib/notifications/sms-outbound';
import { SITE } from '@/lib/seo';

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
      portalLink: `${process.env.NEXT_PUBLIC_SITE_URL || SITE.url}/portal/appointments`,
      bookingLink: `${process.env.NEXT_PUBLIC_SITE_URL || SITE.url}/book`,
      calendarLink: calendarLinks.google,
      shortLink: `${process.env.NEXT_PUBLIC_SITE_URL || SITE.url}/p/${appointmentId}`,
      reviewUrl: 'https://g.page/r/CYQOWmT_HcwQEBM/review',
      includeReviewRequest: template === 'followUp',
    };

    const results: { channel: string; success: boolean; error?: string }[] = [];

    // Send email (Resend)
    const clientEmail = appointment.client?.email ?? (appointment as any).client?.email;
    if (channels.includes('email') && clientEmail) {
      const emailTemplate = EMAIL_TEMPLATES[template as keyof typeof EMAIL_TEMPLATES];
      if (emailTemplate) {
        const subject = renderTemplate(emailTemplate.subject, variables);
        const bodyText = renderTemplate(emailTemplate.body, variables);
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
          const fromEmail = process.env.RESEND_FROM_EMAIL || 'Hello Gorgeous <onboarding@resend.dev>';
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
              from: fromEmail,
              to: [clientEmail.trim().toLowerCase()],
              subject,
              text: bodyText,
            }),
          });
          results.push({ channel: 'email', success: res.ok });
        } else {
          console.log('[reminders/send] Resend not configured, skipping email');
          results.push({ channel: 'email', success: false, error: 'Resend not configured' });
        }
      }
    }

    // Send SMS via Twilio
    if (channels.includes('sms') && appointment.client?.phone) {
      const smsTemplate = SMS_TEMPLATES[template as keyof typeof SMS_TEMPLATES];
      if (smsTemplate) {
        const message = renderTemplate(smsTemplate, variables);
        try {
          const smsResult = await sendSms(appointment.client.phone, message);
          results.push({
            channel: 'sms',
            success: smsResult.success,
            error: smsResult.success ? undefined : smsResult.error || 'SMS send failed',
          });
        } catch (e) {
          console.error('[reminders/send] SMS error:', e);
          results.push({ channel: 'sms', success: false, error: 'SMS send failed' });
        }
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
