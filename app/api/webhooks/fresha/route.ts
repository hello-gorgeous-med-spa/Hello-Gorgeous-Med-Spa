// ============================================================
// FRESHA → SUPABASE WEBHOOK  (via Zapier)
// POST /api/webhooks/fresha
//
// Zapier fires this on: Appointment Booked / Updated / Cancelled
// Payload fields mapped from Fresha's Zapier integration.
//
// What this does:
//   1. Verify the shared secret (FRESHA_WEBHOOK_SECRET)
//   2. Find or create the client by fresha_client_id → email → phone → name
//   3. Fuzzy-match the service and provider by name
//   4. Upsert the appointment using fresha_appointment_id as the dedup key
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { syncFreshaAppointmentToRx } from '@/lib/rx-telehealth/sync';
import { isRxConsultServiceName } from '@/lib/rx-telehealth/requirement';

export const dynamic = 'force-dynamic';

const LOCATION_ID = '9262e614-2746-491a-a385-ee4e29641b31'; // Hello Gorgeous Med Spa - Oswego

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Normalize phone to digits only for matching
function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return digits;
  return digits.length >= 7 ? digits : null;
}

// Map Fresha status strings → our status enum
function mapStatus(freshaStatus: string): string {
  const s = freshaStatus.toLowerCase().trim();
  if (s === 'cancelled' || s === 'canceled') return 'cancelled';
  if (s === 'completed' || s === 'finished') return 'completed';
  if (s === 'no_show' || s === 'no-show' || s === 'noshow') return 'no_show';
  if (s === 'confirmed') return 'confirmed';
  if (s === 'checked_in' || s === 'checked-in') return 'checked_in';
  return 'confirmed'; // default for "booked"
}

// Fuzzy service name match — score by how many words overlap
function bestServiceMatch(
  name: string,
  services: { id: string; name: string }[],
): string | null {
  if (!name) return null;
  const needle = name.toLowerCase();
  let bestId: string | null = null;
  let bestScore = 0;

  for (const svc of services) {
    const hay = svc.name.toLowerCase();
    if (hay === needle) return svc.id; // exact
    // Word overlap score
    const needleWords = needle.split(/\s+/);
    const score = needleWords.filter((w) => w.length > 3 && hay.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      bestId = svc.id;
    }
  }
  return bestScore > 0 ? bestId : null;
}

// Fuzzy provider name match
function bestProviderMatch(
  name: string,
  providers: { id: string; display_name: string; first_name: string; last_name: string }[],
): string | null {
  if (!name) return null;
  const needle = name.toLowerCase();
  for (const p of providers) {
    const full = `${p.first_name} ${p.last_name}`.toLowerCase();
    const display = (p.display_name || '').toLowerCase();
    if (
      full === needle ||
      display.includes(needle) ||
      needle.includes(p.last_name.toLowerCase())
    ) {
      return p.id;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  // ── 1. Auth ──────────────────────────────────────────────
  const secret = process.env.FRESHA_WEBHOOK_SECRET;
  if (secret) {
    const provided =
      req.headers.get('x-webhook-secret') ||
      req.headers.get('x-fresha-secret') ||
      req.nextUrl.searchParams.get('secret');
    if (provided !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── 2. Parse payload ──────────────────────────────────────
  let body: Record<string, string | null>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Zapier field names from Fresha integration
  // These are the fields Fresha exposes — Zapier passes them as-is
  const freshaAppointmentId = body.id || body.appointment_id || body.fresha_id;
  const freshaClientId      = body.client_id || body.customer_id;
  const clientFirstName     = body.client_first_name || body.first_name || '';
  const clientLastName      = body.client_last_name  || body.last_name  || '';
  const clientEmail         = body.client_email || body.email || null;
  const clientPhone         = body.client_phone || body.phone || null;
  const serviceName         = body.service_name || body.service || null;
  const telehealthLink      = body.telehealth_link || body.video_link || body.meeting_url || null;
  const providerName        = body.provider_name || body.staff_name || body.employee || null;
  const startTime           = body.start_time || body.starts_at || body.start || null;
  const endTime             = body.end_time   || body.ends_at   || body.end   || null;
  const freshaStatus        = body.status || 'confirmed';
  const clientNotes         = body.notes || body.client_notes || null;
  const bookingRef          = body.booking_number || body.booking_ref || body.reference || freshaAppointmentId;
  const priceRaw            = body.price || body.total || body.amount || null;
  const servicePriceCents   = priceRaw ? Math.round(parseFloat(priceRaw) * 100) : null;

  if (!freshaAppointmentId) {
    return NextResponse.json({ error: 'Missing appointment id' }, { status: 400 });
  }

  if (!startTime) {
    return NextResponse.json({ error: 'Missing start_time' }, { status: 400 });
  }

  const supabase = getSupabase();

  // ── 3. Load lookup tables once ────────────────────────────
  const [{ data: services }, { data: providers }] = await Promise.all([
    supabase.from('services').select('id, name'),
    supabase.from('providers').select('id, display_name, first_name, last_name'),
  ]);

  const serviceId  = serviceName  ? bestServiceMatch(serviceName, services || [])  : null;
  const providerId = providerName ? bestProviderMatch(providerName, providers || []) : null;

  // ── 4. Find or create client ──────────────────────────────
  let clientId: string | null = null;

  // Try fresha_client_id first (fastest, most reliable)
  if (freshaClientId) {
    const { data: existing } = await supabase
      .from('clients')
      .select('id')
      .eq('fresha_client_id', freshaClientId)
      .maybeSingle();
    if (existing) clientId = existing.id;
  }

  // Fall back: match by email
  if (!clientId && clientEmail) {
    const { data: existing } = await supabase
      .from('clients')
      .select('id')
      .ilike('email', clientEmail.trim())
      .maybeSingle();
    if (existing) clientId = existing.id;
  }

  // Fall back: match by normalized phone
  if (!clientId && clientPhone) {
    const normPhone = normalizePhone(clientPhone);
    if (normPhone) {
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .ilike('phone', `%${normPhone.slice(-10)}`)
        .maybeSingle();
      if (existing) clientId = existing.id;
    }
  }

  // Create new client if still not found
  if (!clientId && (clientFirstName || clientLastName || clientEmail)) {
    const { data: created, error: createErr } = await supabase
      .from('clients')
      .insert({
        first_name: clientFirstName || 'Unknown',
        last_name:  clientLastName  || '',
        full_name:  `${clientFirstName} ${clientLastName}`.trim() || 'Unknown',
        email:      clientEmail  || null,
        phone:      clientPhone  || null,
        fresha_client_id: freshaClientId || null,
        booking_source: 'fresha',
        source: 'fresha',
        is_new_client: true,
        accepts_email_marketing: true,
        accepts_sms_marketing: true,
        country: 'USA',
      })
      .select('id')
      .single();

    if (createErr) {
      console.error('[fresha-webhook] client create error:', createErr.message);
    } else {
      clientId = created?.id || null;
    }
  }

  // Stamp fresha_client_id on existing client if we just learned it
  if (clientId && freshaClientId) {
    await supabase
      .from('clients')
      .update({ fresha_client_id: freshaClientId })
      .eq('id', clientId)
      .is('fresha_client_id', null)
      .then(() => {});
  }

  // ── 5. Upsert appointment ─────────────────────────────────
  const status = mapStatus(freshaStatus);
  const noteText = [
    bookingRef ? `Fresha Ref: #${String(bookingRef).replace(/^#/, '')}` : null,
    clientNotes,
  ].filter(Boolean).join(' — ');

  const appointmentRow: Record<string, unknown> = {
    fresha_appointment_id: String(freshaAppointmentId),
    client_id:     clientId,
    provider_id:   providerId,
    service_id:    serviceId,
    location_id:   LOCATION_ID,
    starts_at:     new Date(startTime).toISOString(),
    ends_at:       endTime ? new Date(endTime).toISOString() : null,
    status,
    booking_source: 'fresha',
    source: 'fresha',
    client_notes:  noteText || null,
    service_price: servicePriceCents,
    updated_at:    new Date().toISOString(),
  };

  if (isRxConsultServiceName(serviceName)) {
    appointmentRow.type = 'telehealth';
    if (telehealthLink) {
      appointmentRow.telehealth_link = telehealthLink;
    }
  }

  if (status === 'cancelled') {
    appointmentRow.cancelled_at = new Date().toISOString();
  }

  // Try to upsert on fresha_appointment_id (requires the column to exist)
  const { data: upserted, error: upsertErr } = await supabase
    .from('appointments')
    .upsert(appointmentRow, { onConflict: 'fresha_appointment_id' })
    .select('id')
    .single();

  if (upsertErr) {
    console.error('[fresha-webhook] upsert error:', upsertErr.message);
    return NextResponse.json(
      { error: 'Failed to save appointment', detail: upsertErr.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    appointmentId: upserted?.id,
    clientId,
    serviceId,
    providerId,
    status,
    rxSync: await syncFreshaAppointmentToRx({
      freshaAppointmentId: String(freshaAppointmentId),
      appointmentId: upserted?.id ?? null,
      clientId,
      clientEmail,
      clientPhone,
      serviceName,
      status,
      startTime,
    }),
  });
}

// Zapier sends a GET to verify the webhook URL is alive
export async function GET() {
  return NextResponse.json({ ok: true, service: 'fresha-webhook', version: '1' });
}
