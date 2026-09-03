import { NextResponse } from 'next/server';
import { alertStaffOnFormSubmission } from '@/lib/notifications/form-alert';

const TOPICS: Record<string, string> = {
  general: 'General Question',
  'weight-loss': 'Weight Loss / GLP-1',
  peptides: 'Peptide Therapy',
  hormones: 'Hormone Therapy',
  skincare: 'Prescription Skincare',
  hair: 'Hair Restoration',
  'sexual-health': 'Sexual Wellness',
  pricing: 'Pricing / Insurance',
  other: 'Other',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, topic, message } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const topicLabel = TOPICS[topic] || 'General Question';
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Send notification to staff
    await alertStaffOnFormSubmission({
      formName: 'REGEN RX Contact',
      emailSubject: `[REGEN RX] New inquiry: ${topicLabel}`,
      emailBody: `
REGEN RX Contact Form Submission
================================

Name: ${name.trim()}
Email: ${email.trim()}
Phone: ${phone?.trim() || 'Not provided'}
Topic: ${topicLabel}

Message:
${message.trim()}

--------------------------------
Submitted: ${timestamp}
Source: tryregenrx.com/contact
      `.trim(),
      smsLines: [
        `From: ${name.trim()}`,
        `Topic: ${topicLabel}`,
        message.trim().slice(0, 100) + (message.length > 100 ? '...' : ''),
      ],
      replyTo: email.trim(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been sent. We\'ll get back to you within 24-48 hours.' 
    });
  } catch (error) {
    console.error('[regen-contact] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}
