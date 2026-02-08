// ============================================================
// API: CONTACT FORM
// Accepts website contact submissions; sends email via Resend when configured
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { SITE } from '@/lib/seo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contact, message } = body;

    if (!name?.trim() || !contact?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Please provide name, email or phone, and message.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_FORM_TO_EMAIL || SITE.email;

    if (apiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Hello Gorgeous Contact <onboarding@resend.dev>',
          to: [toEmail],
          subject: `Website contact from ${name.trim()}`,
          text: `Name: ${name.trim()}\nContact: ${contact.trim()}\n\nMessage:\n${message.trim()}`,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Resend error:', res.status, err);
        return NextResponse.json(
          { error: 'Failed to send message. Please try again or call us.' },
          { status: 502 }
        );
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
