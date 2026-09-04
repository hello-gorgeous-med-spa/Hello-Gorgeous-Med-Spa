/**
 * REGEN RX Notification System
 * 
 * Sends email and SMS notifications for key events:
 * - New intake submitted (to staff)
 * - Rx approved (to patient)
 * - Rx needs action (to patient)
 * - Order shipped (to patient)
 * - Order delivered (to patient)
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const STAFF_EMAIL = 'provider@hellogorgeousmedspa.com';
const STAFF_PHONE = '+16308813398';
const FROM_EMAIL = 'REGEN RX <hello@tryregenrx.com>';

// Brand colors for emails
const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
};

interface NotificationPayload {
  type: 
    | 'new_intake'
    | 'rx_approved'
    | 'rx_needs_labs'
    | 'rx_needs_video'
    | 'rx_declined'
    | 'order_shipped'
    | 'order_delivered'
    | 'welcome';
  patient: {
    name: string;
    email: string;
    phone?: string;
  };
  intake?: {
    id: string;
    goal: string;
  };
  order?: {
    id: string;
    number: string;
    trackingNumber?: string;
    trackingCarrier?: string;
  };
  notes?: string;
}

/**
 * Send notification based on event type
 */
export async function sendRegenNotification(payload: NotificationPayload): Promise<void> {
  const { type, patient, intake, order, notes } = payload;

  try {
    switch (type) {
      case 'new_intake':
        await sendStaffNewIntakeEmail(patient, intake!);
        await sendStaffNewIntakeSMS(patient, intake!);
        break;

      case 'rx_approved':
        await sendPatientRxApprovedEmail(patient, intake!);
        break;

      case 'rx_needs_labs':
        await sendPatientNeedsLabsEmail(patient, notes);
        break;

      case 'rx_needs_video':
        await sendPatientNeedsVideoEmail(patient);
        break;

      case 'rx_declined':
        await sendPatientRxDeclinedEmail(patient, notes);
        break;

      case 'order_shipped':
        await sendPatientOrderShippedEmail(patient, order!);
        break;

      case 'order_delivered':
        await sendPatientOrderDeliveredEmail(patient, order!);
        break;

      case 'welcome':
        await sendPatientWelcomeEmail(patient);
        break;
    }
  } catch (error) {
    console.error(`Notification error [${type}]:`, error);
    throw error;
  }
}

// ============================================================
// STAFF NOTIFICATIONS
// ============================================================

async function sendStaffNewIntakeEmail(
  patient: { name: string; email: string; phone?: string },
  intake: { id: string; goal: string }
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: STAFF_EMAIL,
    subject: `🔔 New Intake: ${patient.name} - ${intake.goal}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${BRAND.dark}; padding: 24px; border-radius: 12px;">
          <h1 style="color: ${BRAND.teal}; margin: 0 0 16px;">New Patient Intake</h1>
          <div style="background: #1A1A1A; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <p style="color: #fff; margin: 0 0 8px;"><strong>Patient:</strong> ${patient.name}</p>
            <p style="color: #fff; margin: 0 0 8px;"><strong>Email:</strong> ${patient.email}</p>
            <p style="color: #fff; margin: 0 0 8px;"><strong>Phone:</strong> ${patient.phone || 'Not provided'}</p>
            <p style="color: ${BRAND.teal}; margin: 0;"><strong>Program:</strong> ${intake.goal}</p>
          </div>
          <a href="https://tryregenrx.com/ops/intake" 
             style="display: inline-block; background: ${BRAND.teal}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Review Intake →
          </a>
        </div>
      </div>
    `,
  });
}

async function sendStaffNewIntakeSMS(
  patient: { name: string; phone?: string },
  intake: { goal: string }
) {
  // Only send if Twilio is configured
  if (!process.env.TWILIO_ACCOUNT_SID) return;

  const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await twilio.messages.create({
    body: `🔔 REGEN RX: New intake from ${patient.name} for ${intake.goal}. Review at tryregenrx.com/ops`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: STAFF_PHONE,
  });
}

// ============================================================
// PATIENT NOTIFICATIONS
// ============================================================

async function sendPatientWelcomeEmail(patient: { name: string; email: string }) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: patient.email,
    subject: `Welcome to REGEN RX, ${patient.name.split(' ')[0]}! 🎉`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${BRAND.dark}; padding: 32px; border-radius: 12px;">
          <img src="https://tryregenrx.com/images/regen/regen-rx-logo.png" alt="REGEN RX" style="height: 40px; margin-bottom: 24px;" />
          <h1 style="color: #fff; margin: 0 0 16px;">Welcome to REGEN RX!</h1>
          <p style="color: #9CA3AF; line-height: 1.6;">
            Hi ${patient.name.split(' ')[0]},<br><br>
            Thank you for choosing REGEN RX for your health journey. We're excited to have you!
          </p>
          <div style="background: ${BRAND.teal}20; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid ${BRAND.teal};">
            <p style="color: ${BRAND.teal}; margin: 0; font-weight: bold;">What happens next?</p>
            <p style="color: #9CA3AF; margin: 8px 0 0;">
              Our provider, Ryan Kent FNP-BC, will review your intake within 24-48 hours. 
              You'll receive an email once your visit has been reviewed.
            </p>
          </div>
          <a href="https://tryregenrx.com/account" 
             style="display: inline-block; background: ${BRAND.pink}; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            View Your Portal →
          </a>
          <p style="color: #6B7280; font-size: 14px; margin-top: 24px;">
            Questions? Reply to this email or call us at (630) 636-6193.
          </p>
        </div>
      </div>
    `,
  });
}

async function sendPatientRxApprovedEmail(
  patient: { name: string; email: string },
  intake: { goal: string }
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: patient.email,
    subject: `✅ Great news! Your ${intake.goal} prescription is approved`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${BRAND.dark}; padding: 32px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 48px;">✅</span>
          </div>
          <h1 style="color: #22C55E; margin: 0 0 16px; text-align: center;">Prescription Approved!</h1>
          <p style="color: #9CA3AF; line-height: 1.6; text-align: center;">
            Hi ${patient.name.split(' ')[0]},<br><br>
            Great news! Your provider has approved your ${intake.goal} prescription.
          </p>
          <div style="background: #22C55E20; padding: 16px; border-radius: 8px; margin: 24px 0; text-align: center;">
            <p style="color: #22C55E; margin: 0; font-weight: bold;">Your prescription has been sent to the pharmacy</p>
            <p style="color: #9CA3AF; margin: 8px 0 0;">
              You'll receive tracking information once your order ships.
            </p>
          </div>
          <div style="text-align: center;">
            <a href="https://tryregenrx.com/account/orders" 
               style="display: inline-block; background: ${BRAND.teal}; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Track Your Order →
            </a>
          </div>
        </div>
      </div>
    `,
  });
}

async function sendPatientNeedsLabsEmail(patient: { name: string; email: string }, notes?: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: patient.email,
    subject: `🧪 Action needed: Lab work required for your visit`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${BRAND.dark}; padding: 32px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 48px;">🧪</span>
          </div>
          <h1 style="color: #8B5CF6; margin: 0 0 16px; text-align: center;">Lab Work Needed</h1>
          <p style="color: #9CA3AF; line-height: 1.6;">
            Hi ${patient.name.split(' ')[0]},<br><br>
            Your provider has reviewed your intake and needs some lab work before proceeding.
          </p>
          ${notes ? `
            <div style="background: #8B5CF620; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #8B5CF6;">
              <p style="color: #8B5CF6; margin: 0; font-weight: bold;">Provider notes:</p>
              <p style="color: #9CA3AF; margin: 8px 0 0;">${notes}</p>
            </div>
          ` : ''}
          <p style="color: #9CA3AF; line-height: 1.6;">
            Once you have your lab results, you can upload them through your patient portal or 
            message us directly.
          </p>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://tryregenrx.com/account/messages" 
               style="display: inline-block; background: #8B5CF6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Message Your Provider →
            </a>
          </div>
        </div>
      </div>
    `,
  });
}

async function sendPatientNeedsVideoEmail(patient: { name: string; email: string }) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: patient.email,
    subject: `📹 Action needed: Video visit required`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${BRAND.dark}; padding: 32px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 48px;">📹</span>
          </div>
          <h1 style="color: #3B82F6; margin: 0 0 16px; text-align: center;">Video Visit Required</h1>
          <p style="color: #9CA3AF; line-height: 1.6; text-align: center;">
            Hi ${patient.name.split(' ')[0]},<br><br>
            Your provider would like to meet with you via video before proceeding with treatment.
          </p>
          <div style="background: #3B82F620; padding: 16px; border-radius: 8px; margin: 24px 0; text-align: center;">
            <p style="color: #3B82F6; margin: 0; font-weight: bold;">Your provider's video room is ready</p>
            <p style="color: #9CA3AF; margin: 8px 0 0;">
              Click below to join when you're ready. No appointment needed.
            </p>
          </div>
          <div style="text-align: center;">
            <a href="https://doxy.me/ryankent" 
               style="display: inline-block; background: #3B82F6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Join Video Visit →
            </a>
          </div>
        </div>
      </div>
    `,
  });
}

async function sendPatientRxDeclinedEmail(patient: { name: string; email: string }, notes?: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: patient.email,
    subject: `Update on your REGEN RX visit`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${BRAND.dark}; padding: 32px; border-radius: 12px;">
          <h1 style="color: #fff; margin: 0 0 16px;">Visit Update</h1>
          <p style="color: #9CA3AF; line-height: 1.6;">
            Hi ${patient.name.split(' ')[0]},<br><br>
            After careful review, your provider has determined that this treatment is not 
            recommended for you at this time.
          </p>
          ${notes ? `
            <div style="background: #1A1A1A; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="color: #9CA3AF; margin: 0; font-weight: bold;">Provider notes:</p>
              <p style="color: #9CA3AF; margin: 8px 0 0;">${notes}</p>
            </div>
          ` : ''}
          <p style="color: #9CA3AF; line-height: 1.6;">
            If you have questions or would like to discuss alternatives, please don't hesitate 
            to message us or schedule a consultation.
          </p>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://tryregenrx.com/account/messages" 
               style="display: inline-block; background: ${BRAND.teal}; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Message Your Provider →
            </a>
          </div>
        </div>
      </div>
    `,
  });
}

async function sendPatientOrderShippedEmail(
  patient: { name: string; email: string },
  order: { number: string; trackingNumber?: string; trackingCarrier?: string }
) {
  const trackingUrl = order.trackingNumber 
    ? `https://www.google.com/search?q=${order.trackingCarrier || 'USPS'}+tracking+${order.trackingNumber}`
    : null;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: patient.email,
    subject: `📦 Your order ${order.number} has shipped!`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${BRAND.dark}; padding: 32px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 48px;">📦</span>
          </div>
          <h1 style="color: ${BRAND.teal}; margin: 0 0 16px; text-align: center;">Your Order Has Shipped!</h1>
          <p style="color: #9CA3AF; line-height: 1.6; text-align: center;">
            Hi ${patient.name.split(' ')[0]},<br><br>
            Great news! Your order is on its way.
          </p>
          ${order.trackingNumber ? `
            <div style="background: ${BRAND.teal}20; padding: 16px; border-radius: 8px; margin: 24px 0; text-align: center;">
              <p style="color: ${BRAND.teal}; margin: 0; font-weight: bold;">${order.trackingCarrier || 'USPS'} Tracking</p>
              <p style="color: #fff; font-family: monospace; margin: 8px 0 0; font-size: 18px;">${order.trackingNumber}</p>
            </div>
            <div style="text-align: center;">
              <a href="${trackingUrl}" 
                 style="display: inline-block; background: ${BRAND.teal}; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Track Your Package →
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    `,
  });
}

async function sendPatientOrderDeliveredEmail(
  patient: { name: string; email: string },
  order: { number: string }
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: patient.email,
    subject: `✅ Your order ${order.number} has been delivered!`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${BRAND.dark}; padding: 32px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 48px;">🎉</span>
          </div>
          <h1 style="color: #22C55E; margin: 0 0 16px; text-align: center;">Delivered!</h1>
          <p style="color: #9CA3AF; line-height: 1.6; text-align: center;">
            Hi ${patient.name.split(' ')[0]},<br><br>
            Your REGEN RX order has been delivered. We hope you love it!
          </p>
          <div style="background: #22C55E20; padding: 16px; border-radius: 8px; margin: 24px 0; text-align: center;">
            <p style="color: #22C55E; margin: 0; font-weight: bold;">Questions about your medication?</p>
            <p style="color: #9CA3AF; margin: 8px 0 0;">
              Your provider is here to help. Message us anytime.
            </p>
          </div>
          <div style="text-align: center;">
            <a href="https://tryregenrx.com/account" 
               style="display: inline-block; background: ${BRAND.pink}; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              View Your Portal →
            </a>
          </div>
        </div>
      </div>
    `,
  });
}
