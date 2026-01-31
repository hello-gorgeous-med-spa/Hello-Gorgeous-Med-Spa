// ============================================================
// APPOINTMENT REMINDERS SYSTEM
// Automated email/SMS notifications for appointments
// ============================================================

export interface ReminderConfig {
  enabled: boolean;
  // Reminder schedule (hours before appointment)
  reminders: {
    hours: number;
    channels: ('email' | 'sms')[];
    template: string;
  }[];
  // Post-appointment follow-up
  followUp: {
    enabled: boolean;
    hoursAfter: number;
    includeReviewRequest: boolean;
    reviewUrl: string;
  };
}

export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  enabled: true,
  reminders: [
    {
      hours: 24,
      channels: ['email', 'sms'],
      template: 'reminder_24h',
    },
    {
      hours: 2,
      channels: ['sms'],
      template: 'reminder_2h',
    },
  ],
  followUp: {
    enabled: true,
    hoursAfter: 2,
    includeReviewRequest: true,
    reviewUrl: 'https://g.page/r/CYQOWmT_HcwQEBM/review',
  },
};

// Email templates
export const EMAIL_TEMPLATES = {
  reminder_24h: {
    subject: 'Appointment Tomorrow at Hello Gorgeous Med Spa',
    body: `Hi {{clientName}},

This is a friendly reminder that you have an appointment tomorrow:

📅 {{appointmentDate}}
🕐 {{appointmentTime}}
💆 {{serviceName}}
👩‍⚕️ {{providerName}}
📍 Hello Gorgeous Med Spa, Oswego, IL

Please arrive 5-10 minutes early. If you need to reschedule or cancel, please do so at least 24 hours in advance to avoid a cancellation fee.

Manage your appointment: {{portalLink}}

See you soon!
Hello Gorgeous Med Spa
(630) 636-6193`,
  },
  
  reminder_2h: {
    subject: 'See You Soon! Appointment in 2 Hours',
    body: `Hi {{clientName}},

Your appointment is coming up in 2 hours:

🕐 {{appointmentTime}}
💆 {{serviceName}}

📍 Hello Gorgeous Med Spa
123 Main St, Oswego, IL

See you soon!`,
  },

  confirmation: {
    subject: 'Appointment Confirmed - Hello Gorgeous Med Spa',
    body: `Hi {{clientName}},

Your appointment has been confirmed!

📅 {{appointmentDate}}
🕐 {{appointmentTime}}
💆 {{serviceName}}
👩‍⚕️ {{providerName}}

📍 Hello Gorgeous Med Spa
Oswego, IL

Add to your calendar: {{calendarLink}}

Need to make changes? {{portalLink}}

We look forward to seeing you!
Hello Gorgeous Med Spa`,
  },

  followUp: {
    subject: 'Thank You for Visiting Hello Gorgeous Med Spa! 💕',
    body: `Hi {{clientName}},

Thank you for visiting us today! We hope you had a wonderful experience.

Your treatment: {{serviceName}}
Provider: {{providerName}}

{{#if includeReviewRequest}}
We'd love to hear about your experience! Your feedback helps us serve you better and helps others discover Hello Gorgeous.

⭐ Leave a Review: {{reviewUrl}}
{{/if}}

Book your next appointment: {{bookingLink}}

Questions about your treatment? Reply to this email or call us at (630) 636-6193.

With love,
Hello Gorgeous Med Spa`,
  },

  cancellation: {
    subject: 'Appointment Cancelled - Hello Gorgeous Med Spa',
    body: `Hi {{clientName}},

Your appointment has been cancelled:

📅 {{appointmentDate}}
🕐 {{appointmentTime}}
💆 {{serviceName}}

{{#if hasFee}}
A cancellation fee of \${{feeAmount}} has been charged due to late cancellation.
{{/if}}

Ready to rebook? {{bookingLink}}

Hello Gorgeous Med Spa
(630) 636-6193`,
  },

  reschedule: {
    subject: 'Appointment Rescheduled - Hello Gorgeous Med Spa',
    body: `Hi {{clientName}},

Your appointment has been rescheduled to:

📅 {{newDate}}
🕐 {{newTime}}
💆 {{serviceName}}
👩‍⚕️ {{providerName}}

Previous appointment: {{oldDate}} at {{oldTime}}

Add to your calendar: {{calendarLink}}

See you then!
Hello Gorgeous Med Spa`,
  },
};

// SMS templates (shorter)
export const SMS_TEMPLATES = {
  reminder_24h: `Hello Gorgeous Med Spa: Reminder - You have an appointment tomorrow at {{appointmentTime}} for {{serviceName}}. Reply HELP for assistance or manage at {{shortLink}}`,
  
  reminder_2h: `Hello Gorgeous: See you in 2 hours for your {{serviceName}} appointment at {{appointmentTime}}! 📍 Oswego, IL`,
  
  confirmation: `Hello Gorgeous Med Spa: Confirmed! {{serviceName}} on {{appointmentDate}} at {{appointmentTime}}. Manage: {{shortLink}}`,
  
  followUp: `Thank you for visiting Hello Gorgeous! 💕 We'd love your feedback: {{reviewUrl}}`,
  
  cancellation: `Hello Gorgeous: Your {{appointmentDate}} appointment has been cancelled. Rebook: {{shortLink}}`,
  
  waitlistNotification: `Hello Gorgeous: Great news! A spot opened up for {{serviceName}} on {{appointmentDate}} at {{appointmentTime}}. Book now: {{shortLink}} (expires in 30 min)`,
};

// Template variable replacement
export function renderTemplate(
  template: string,
  variables: Record<string, string | boolean | undefined>
): string {
  let result = template;
  
  // Handle conditionals {{#if variable}}content{{/if}}
  result = result.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, varName, content) => {
      return variables[varName] ? content : '';
    }
  );
  
  // Replace simple variables {{variable}}
  result = result.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
    return String(variables[varName] || '');
  });
  
  return result;
}

// Generate calendar links
export function generateCalendarLinks(appointment: {
  title: string;
  startTime: Date;
  endTime: Date;
  location: string;
  description: string;
}): { google: string; ical: string; outlook: string } {
  const { title, startTime, endTime, location, description } = appointment;
  
  const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  // Google Calendar
  const googleParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
    location,
    details: description,
  });
  const google = `https://calendar.google.com/calendar/render?${googleParams.toString()}`;
  
  // iCal format (works for Apple Calendar)
  const ical = `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(startTime)}
DTEND:${formatDate(endTime)}
SUMMARY:${title}
LOCATION:${location}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

  // Outlook
  const outlookParams = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title,
    startdt: startTime.toISOString(),
    enddt: endTime.toISOString(),
    location,
    body: description,
  });
  const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?${outlookParams.toString()}`;
  
  return { google, ical, outlook };
}

// Schedule reminder job (would connect to a job queue like Bull/Redis in production)
export interface ScheduledReminder {
  id: string;
  appointmentId: string;
  clientId: string;
  scheduledFor: Date;
  channels: ('email' | 'sms')[];
  template: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
  error?: string;
}

// Helper to calculate when reminders should be sent
export function calculateReminderTimes(
  appointmentTime: Date,
  config: ReminderConfig = DEFAULT_REMINDER_CONFIG
): { sendAt: Date; channels: ('email' | 'sms')[]; template: string }[] {
  if (!config.enabled) return [];
  
  return config.reminders.map((reminder) => ({
    sendAt: new Date(appointmentTime.getTime() - reminder.hours * 60 * 60 * 1000),
    channels: reminder.channels,
    template: reminder.template,
  }));
}
