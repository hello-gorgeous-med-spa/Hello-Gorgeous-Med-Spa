// ============================================================
// BOOKING HEALTH CHECK
// Use this to verify your booking system is ready (env, DB, providers, services).
// Hit: GET /api/health/booking
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

export async function GET() {
  const start = Date.now();
  const checks: Record<string, { status: 'ok' | 'warn' | 'error'; message: string; detail?: unknown }> = {};

  // 1. Admin Supabase (required to create bookings)
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    checks.adminSupabase = {
      status: 'error',
      message: 'SUPABASE_SERVICE_ROLE_KEY (or URL) missing. Bookings cannot be created.',
    };
  } else {
    checks.adminSupabase = { status: 'ok', message: 'Admin Supabase configured' };
  }

  // 2. Services and providers (only if we have DB)
  if (supabase) {
    try {
      const [
        { count: serviceCount = 0, error: servicesError },
        { count: providerCount = 0, error: providersError },
      ] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('allow_online_booking', true),
        supabase.from('providers').select('id', { count: 'exact', head: true }),
      ]);
      if (servicesError) {
        checks.bookableServices = { status: 'error', message: servicesError.message, detail: servicesError };
      } else if (serviceCount === 0) {
        checks.bookableServices = { status: 'warn', message: 'No bookable services found. Check services table and allow_online_booking.', detail: { count: 0 } };
      } else {
        checks.bookableServices = { status: 'ok', message: `${serviceCount} bookable service(s)`, detail: { count: serviceCount } };
      }
      if (providersError) {
        checks.providers = { status: 'error', message: providersError.message, detail: providersError };
      } else if (providerCount === 0) {
        checks.providers = { status: 'warn', message: 'No providers found. Booking page may show no one to choose.', detail: { count: 0 } };
      } else {
        checks.providers = { status: 'ok', message: `${providerCount} provider(s)`, detail: { count: providerCount } };
      }
    } catch (e: unknown) {
      checks.dbQuery = {
        status: 'error',
        message: e instanceof Error ? e.message : 'Database query failed',
        detail: String(e),
      };
    }
  }

  // 3. Confirmations (env only — we don't send)
  const hasResend = !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
  const hasTwilio = !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
  if (!hasResend && !hasTwilio) {
    checks.confirmations = {
      status: 'warn',
      message: 'No Resend or Twilio configured. Clients will not get email/SMS confirmations.',
    };
  } else {
    checks.confirmations = {
      status: 'ok',
      message: [hasResend && 'email', hasTwilio && 'SMS'].filter(Boolean).join(' + ') + ' confirmations',
      detail: { resend: hasResend, twilio: hasTwilio },
    };
  }

  const hasError = Object.values(checks).some((c) => c.status === 'error');
  const hasWarn = Object.values(checks).some((c) => c.status === 'warn');

  const body = {
    ok: !hasError,
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - start,
    checks,
    summary: hasError ? 'Booking has critical issues — fix before accepting online bookings.' : hasWarn ? 'Booking may work; review warnings.' : 'Booking system looks ready.',
  };

  return NextResponse.json(body, { status: hasError ? 503 : 200 });
}
