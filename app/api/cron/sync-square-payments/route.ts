// ============================================================
// CRON: Sync Square Payments → hg_square_transactions
// Keeps Supabase revenue data current with actual Square payments.
// Schedule: Every 6 hours (0 */6 * * *)
// Manual backfill: GET /api/cron/sync-square-payments?days=90
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SQUARE_API_VERSION = '2025-04-16';
const TZ = 'America/Chicago';

function getSquareBase(): string {
  const env = (process.env.SQUARE_ENVIRONMENT ?? '').toLowerCase();
  return env === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';
}

async function resolveAccessToken(): Promise<string | null> {
  // Try OAuth token stored in Supabase first
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('square_connections')
        .select('access_token')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data?.access_token) return data.access_token as string;
    }
  } catch {
    // fall through to env
  }
  return process.env.SQUARE_ACCESS_TOKEN?.trim() || null;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function dateInChicago(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));
}

type SquarePayment = {
  id: string;
  created_at: string;
  updated_at?: string;
  status: string;
  total_money?: { amount?: number; currency?: string };
  tip_money?: { amount?: number };
  processing_fee?: { effective_at?: string; amount_money?: { amount?: number } }[];
  source_type?: string;
  card_details?: { card?: { card_brand?: string; last_4?: string } };
  order_id?: string;
  customer_id?: string;
  location_id?: string;
  note?: string;
  receipt_url?: string;
};

async function fetchSquarePayments(
  token: string,
  beginIso: string,
  endIso: string,
): Promise<SquarePayment[]> {
  const base = getSquareBase();
  const all: SquarePayment[] = [];
  let cursor: string | undefined;

  for (;;) {
    const params = new URLSearchParams({
      begin_time: beginIso,
      end_time: endIso,
      limit: '100',
      sort_order: 'DESC',
    });
    if (cursor) params.set('cursor', cursor);

    const res = await fetch(`${base}/v2/payments?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Square-Version': SQUARE_API_VERSION,
      },
      cache: 'no-store',
    });

    const json = await res.json();
    if (!res.ok) {
      const msg = json?.errors?.[0]?.detail || json?.errors?.[0]?.code || 'Square error';
      throw new Error(msg);
    }

    for (const p of json.payments || []) {
      if (p.status === 'COMPLETED' || p.status === 'APPROVED') {
        all.push(p as SquarePayment);
      }
    }

    cursor = json.cursor as string | undefined;
    if (!cursor) break;
    await new Promise((r) => setTimeout(r, 100));
  }

  return all;
}

export async function GET(req: NextRequest) {
  // Auth: Vercel cron, CRON_SECRET, or internal admin trigger
  const authHeader = req.headers.get('authorization');
  const isVercelCron = req.headers.get('x-vercel-cron') === '1' ||
    (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`);

  // Check owner session for manual admin trigger
  let isAdminTrigger = false;
  if (!isVercelCron) {
    try {
      const cookie = req.headers.get('cookie') || '';
      const sessionCookie = cookie.match(/hgos_session=([^;]+)/)?.[1];
      if (sessionCookie) {
        const supabase = getSupabase();
        if (supabase) {
          const { data } = await supabase
            .from('admin_sessions')
            .select('role')
            .eq('token', sessionCookie)
            .eq('role', 'owner')
            .maybeSingle();
          isAdminTrigger = !!data;
        }
      }
    } catch { /* fall through */ }
  }

  if (!isVercelCron && !isAdminTrigger) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const daysParam = parseInt(req.nextUrl.searchParams.get('days') || '3', 10);
  const days = Math.min(Math.max(daysParam, 1), 365);

  const token = await resolveAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'No Square access token configured' }, { status: 500 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const end = new Date();
  const begin = new Date(Date.now() - days * 86400000);

  const startedAt = Date.now();

  try {
    const payments = await fetchSquarePayments(token, begin.toISOString(), end.toISOString());

    const now = new Date().toISOString();
    const rows = payments.map((p) => ({
      id: p.id,
      date: dateInChicago(p.created_at),
      description: p.note || p.source_type || 'Card payment',
      amount: (p.total_money?.amount ?? 0) / 100,
      status: p.status,
      synced_at: now,
    }));

    let upserted = 0;
    let upsertError: string | null = null;

    if (rows.length > 0) {
      const BATCH = 100;
      for (let i = 0; i < rows.length; i += BATCH) {
        const { error } = await supabase
          .from('hg_square_transactions')
          .upsert(rows.slice(i, i + BATCH), { onConflict: 'id' });
        if (error) {
          upsertError = error.message;
          break;
        }
        upserted += Math.min(BATCH, rows.length - i);
      }
    }

    // Log the sync (best-effort — ignore unknown column errors)
    await supabase.from('square_sync_log').insert({
      synced_at: new Date().toISOString(),
      records_synced: upserted,
      status: upsertError ? 'error' : 'ok',
      notes: upsertError || `${payments.length} fetched, ${upserted} upserted`,
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      days,
      fetched: payments.length,
      upserted,
      error: upsertError,
      durationMs: Date.now() - startedAt,
      syncedAt: new Date().toISOString(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Sync failed';

    await supabase.from('square_sync_log').insert({
      synced_at: new Date().toISOString(),
      records_synced: 0,
      status: 'error',
      notes: msg,
    }).catch(() => {});

    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
