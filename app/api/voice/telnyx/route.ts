// ============================================================
// TELNYX VOICE WEBHOOK — Incoming calls → answer, gather booking, create appointment
// Configure your Telnyx number's Voice webhook URL to: https://yoursite.com/api/voice/telnyx
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  telnyxAnswer,
  telnyxSpeak,
  telnyxGatherUsingAi,
  telnyxTransfer,
  resolvePreferredDate,
  resolvePreferredTime,
  pickBestSlot,
} from '@/lib/hgos/voice-telnyx';
import { verifyTelnyxWebhook } from '@/lib/hgos/voice-telnyx-verify';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BOOKING_GREETING = `Welcome to Hello Gorgeous Med Spa. I can help you book an appointment. I'll need your first and last name, email, the service you're interested in, and your preferred date and time. Let's get started.`;

// E.164 preferred (e.g. +16306366193). If using NEXT_PUBLIC_BUSINESS_PHONE like (630) 636-6193, set TELNYX_VOICE_TRANSFER_NUMBER instead.
const RAW_TRANSFER = process.env.TELNYX_VOICE_TRANSFER_NUMBER || process.env.NEXT_PUBLIC_BUSINESS_PHONE || '';
const TRANSFER_NUMBER = (() => {
  if (!RAW_TRANSFER) return '';
  const digits = RAW_TRANSFER.replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits;
  return RAW_TRANSFER.startsWith('+') ? RAW_TRANSFER : '+' + digits;
})();

function normalizePhoneFromCaller(from: string | undefined): string {
  if (!from) return '';
  const digits = from.replace(/\D/g, '');
  if (digits.length >= 10) return '+1' + digits.slice(-10);
  return from.startsWith('+') ? from : '+1' + from;
}

export async function POST(request: NextRequest) {
  if (!process.env.TELNYX_API_KEY) {
    console.error('[voice/telnyx] TELNYX_API_KEY not set');
    return NextResponse.json({ error: 'Voice not configured' }, { status: 503 });
  }

  // Read raw body first (required for signature verification)
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const timestampHeader = request.headers.get('telnyx-timestamp');
  const signatureHeader = request.headers.get('telnyx-signature-ed25519');
  const publicKey = process.env.TELNYX_WEBHOOK_PUBLIC_KEY;
  if (!verifyTelnyxWebhook(rawBody, timestampHeader, signatureHeader, publicKey)) {
    if (publicKey && (timestampHeader || signatureHeader)) {
      console.warn('[voice/telnyx] Webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let body: { data?: { event_type?: string; payload?: Record<string, unknown> } };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType = body?.data?.event_type;
  const payload = body?.data?.payload || {};
  const callControlId = payload.call_control_id as string | undefined;
  const from = payload.from as string | undefined;

  if (!callControlId) {
    console.warn('[voice/telnyx] No call_control_id in payload');
    return NextResponse.json({ received: true });
  }

  // ——— call.initiated: answer and start Gather Using AI for booking ———
  if (eventType === 'call.initiated') {
    try {
      await telnyxAnswer(callControlId);
      await telnyxGatherUsingAi(callControlId, {
        greeting: BOOKING_GREETING,
        voice: 'Polly.Joanna',
        parameters: {
          first_name: { description: 'The caller\'s first name.', type: 'string' },
          last_name: { description: 'The caller\'s last name.', type: 'string' },
          email: { description: 'The caller\'s email address for confirmation.', type: 'string' },
          phone: { description: 'The caller\'s phone number for confirmation and reminders.', type: 'string' },
          service_preference: { description: 'The service they want: e.g. Botox, filler, facial, lash, body contouring, weight loss, or general appointment.', type: 'string' },
          preferred_date: { description: 'When they want to come: e.g. tomorrow, next Monday, Tuesday, or a specific date.', type: 'string' },
          preferred_time: { description: 'Preferred time of day: e.g. morning, afternoon, 10am, 2pm.', type: 'string' },
        },
        required: ['first_name', 'last_name', 'email', 'phone', 'service_preference', 'preferred_date', 'preferred_time'],
      });
    } catch (err) {
      console.error('[voice/telnyx] call.initiated error:', err);
      try {
        await telnyxSpeak(callControlId, 'We\'re sorry, something went wrong. Please call back or book online at hello gorgeous med spa dot com.');
      } catch (_) {}
    }
    return NextResponse.json({ received: true });
  }

  // ——— call.ai_gather.ended: create booking and speak confirmation or transfer ———
  if (eventType === 'call.ai_gather.ended') {
    const result = (payload.result as Record<string, unknown>) || payload;
    const params = (result.parameters as Record<string, unknown>) || result;
    const firstName = String(params?.first_name ?? '').trim();
    const lastName = String(params?.last_name ?? '').trim();
    const email = String(params?.email ?? '').trim();
    const phone = String(params?.phone ?? '').trim() || normalizePhoneFromCaller(from);
    const servicePreference = String(params?.service_preference ?? '').trim();
    const preferredDateRaw = String(params?.preferred_date ?? '').trim();
    const preferredTimeRaw = String(params?.preferred_time ?? '').trim();

    if (!firstName || !lastName || !email || !phone) {
      try {
        await telnyxSpeak(callControlId, 'We didn\'t get all your details. Please call back or book online at hello gorgeous med spa dot com. Transferring you to our front desk now.');
        if (TRANSFER_NUMBER) await telnyxTransfer(callControlId, TRANSFER_NUMBER);
      } catch (e) {
        console.error('[voice/telnyx] speak/transfer after missing params:', e);
      }
      return NextResponse.json({ received: true });
    }

    const dateStr = resolvePreferredDate(preferredDateRaw);
    const timePref = resolvePreferredTime(preferredTimeRaw);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'https://www.hellogorgeousmedspa.com';

    if (!dateStr) {
      try {
        await telnyxSpeak(callControlId, `We couldn't understand the date you gave. Please call back or book online at hello gorgeous med spa dot com. Transferring you now.`);
        if (TRANSFER_NUMBER) await telnyxTransfer(callControlId, TRANSFER_NUMBER);
      } catch (_) {}
      return NextResponse.json({ received: true });
    }

    try {
      // Fetch bookable services and match service_preference to a slug
      const servicesRes = await fetch(`${baseUrl}/api/booking/services`, { cache: 'no-store' });
      const servicesData = await servicesRes.json();
      const services: Array<{ id: string; name: string; slug: string; duration_minutes: number }> = servicesData?.services || [];
      const slug = matchServiceToSlug(servicePreference, services);
      const service = services.find((s) => s.slug === slug) || services[0];
      if (!service) {
        await telnyxSpeak(callControlId, 'We don\'t have any bookable services right now. Please call back or visit our website. Transferring you to the front desk.');
        if (TRANSFER_NUMBER) await telnyxTransfer(callControlId, TRANSFER_NUMBER);
        return NextResponse.json({ received: true });
      }

      const duration = service.duration_minutes || 30;
      const providersRes = await fetch(
        `${baseUrl}/api/booking/providers?serviceSlug=${encodeURIComponent(service.slug)}`,
        { cache: 'no-store' }
      );
      const providersData = await providersRes.json();
      const providers: Array<{ id: string }> = providersData?.providers || [];
      const providerId = providers[0]?.id;
      if (!providerId) {
        await telnyxSpeak(callControlId, 'No provider is available for that service right now. Transferring you to the front desk.');
        if (TRANSFER_NUMBER) await telnyxTransfer(callControlId, TRANSFER_NUMBER);
        return NextResponse.json({ received: true });
      }

      const availRes = await fetch(
        `${baseUrl}/api/availability?provider_id=${encodeURIComponent(providerId)}&date=${dateStr}&duration=${duration}`,
        { cache: 'no-store' }
      );
      const availData = await availRes.json();
      const slots: Array<{ time: string; datetime: string; available: boolean }> = availData?.slots || [];
      const best = pickBestSlot(
        slots,
        timePref?.hours,
        timePref?.minutes
      );

      if (!best) {
        await telnyxSpeak(
          callControlId,
          `We don't have availability on that day. Please call back or book online at hello gorgeous med spa dot com. Transferring you to the front desk.`
        );
        if (TRANSFER_NUMBER) await telnyxTransfer(callControlId, TRANSFER_NUMBER);
        return NextResponse.json({ received: true });
      }

      const createRes = await fetch(`${baseUrl}/api/booking/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          serviceSlug: service.slug,
          providerId,
          date: best.date,
          time: best.time,
          firstName,
          lastName,
          email,
          phone,
          notes: 'Booked via voice assistant',
          agreeToTerms: true,
          agreeToSMS: true,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        const msg = createData?.error || 'Booking failed';
        console.error('[voice/telnyx] booking/create failed:', msg);
        await telnyxSpeak(
          callControlId,
          `We couldn't complete the booking: ${msg}. Transferring you to the front desk.`
        );
        if (TRANSFER_NUMBER) await telnyxTransfer(callControlId, TRANSFER_NUMBER);
        return NextResponse.json({ received: true });
      }

      const confirmMsg = `Your appointment is confirmed for ${best.date} at ${best.time} for ${service.name}. We'll send a confirmation to your phone and email. Thank you for calling Hello Gorgeous!`;
      await telnyxSpeak(callControlId, confirmMsg);
    } catch (err) {
      console.error('[voice/telnyx] ai_gather.ended error:', err);
      try {
        await telnyxSpeak(callControlId, 'Something went wrong on our end. Please call back or book online. Transferring you to the front desk now.');
        if (TRANSFER_NUMBER) await telnyxTransfer(callControlId, TRANSFER_NUMBER);
      } catch (_) {}
    }
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}

function matchServiceToSlug(preference: string, services: Array<{ name: string; slug: string }>): string | null {
  const p = preference.toLowerCase();
  for (const s of services) {
    if (s.slug && p.includes(s.slug.replace(/-/g, ' '))) return s.slug;
    if (s.name && p.includes(s.name.toLowerCase())) return s.slug;
  }
  if (p.includes('botox') || p.includes('filler') || p.includes('lash') || p.includes('facial') || p.includes('body') || p.includes('weight')) {
    for (const s of services) {
      const name = s.name.toLowerCase();
      if (p.includes('botox') && name.includes('botox')) return s.slug;
      if (p.includes('filler') && name.includes('filler')) return s.slug;
      if (p.includes('lash') && name.includes('lash')) return s.slug;
      if (p.includes('facial') && name.includes('facial')) return s.slug;
    }
  }
  return services[0]?.slug ?? null;
}
