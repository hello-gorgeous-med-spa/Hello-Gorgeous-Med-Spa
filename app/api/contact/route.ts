// ============================================================
// API: CONTACT FORM
// Accepts website contact submissions; sends email via Resend when configured
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { assessContactSpam } from '@/lib/contact-spam-filter';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { recordLead, getUTMFromRequest } from '@/lib/leads';
import { emailStaffFormSubmission, notifyOwnerFormSubmission } from '@/lib/notifications/form-alert';
import {
  extractPhoneFromLeadMessage,
  leadEmailHtml,
  leadEmailSubject,
  parseLeadNotification,
} from '@/lib/notifications/lead-email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contact, message, website } = body;

    if (!name?.trim() || !contact?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Please provide name, email or phone, and message.' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedContact = contact.trim();
    const trimmedMessage = message.trim();

    const spamVerdict = assessContactSpam({
      name: trimmedName,
      contact: trimmedContact,
      message: trimmedMessage,
      website: typeof website === 'string' ? website : undefined,
    });
    if (spamVerdict.spam) {
      if (spamVerdict.reason === 'invalid_contact' || spamVerdict.reason === 'contact_equals_name') {
        return NextResponse.json(
          { error: 'Please enter a valid email address or phone number (not your name).' },
          { status: 400 }
        );
      }
      console.info('[contact] spam filtered:', spamVerdict.reason);
      return NextResponse.json({ success: true, message: 'Thank you. We’ll get back to you soon.' });
    }

    const emailBody = `Name: ${trimmedName}\nContact: ${trimmedContact}\n\nMessage:\n${trimmedMessage}`;
    const replyTo = trimmedContact.includes('@') ? trimmedContact.toLowerCase() : undefined;
    const { formLabel } = parseLeadNotification(trimmedMessage);
    const emailSubject = leadEmailSubject(formLabel, trimmedName);
    const phoneFromMessage = extractPhoneFromLeadMessage(trimmedMessage);

    if (process.env.RESEND_API_KEY) {
      const emailed = await emailStaffFormSubmission({
        subject: emailSubject,
        text: emailBody,
        html: leadEmailHtml({
          subjectLine: emailSubject,
          name: trimmedName,
          contact: trimmedContact,
          message: trimmedMessage,
        }),
        replyTo,
      });
      if (!emailed) {
        return NextResponse.json(
          { error: 'Failed to send message. Please try again or call us.' },
          { status: 502 }
        );
      }
    }

    notifyOwnerFormSubmission({
      formName: formLabel,
      lines: [
        trimmedName,
        phoneFromMessage ? `tel ${phoneFromMessage}` : trimmedContact,
        trimmedMessage.slice(0, 200),
      ],
    });

    const emailMatch = contact.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (emailMatch) {
      const supabase = createAdminSupabaseClient();
      if (supabase) {
        const url = request.url || '';
        const utm = getUTMFromRequest(url, request.headers.get('referer'));
        await recordLead(supabase, {
          email: contact.trim().toLowerCase(),
          phone: phoneFromMessage,
          full_name: name.trim(),
          source: 'website',
          lead_type: 'contact_form',
          ...utm,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Thank you. We’ll get back to you soon.' });
  } catch (e) {
    console.error('Contact API error:', e);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or call us.' },
      { status: 500 }
    );
  }
}
