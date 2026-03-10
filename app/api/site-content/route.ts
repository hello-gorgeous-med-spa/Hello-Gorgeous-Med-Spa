// ============================================================
// API: SITE CONTENT — no-code website content (Phase 5)
// GET: return all keys, POST/PATCH: set key-value blocks
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const store = new Map<string, string | Record<string, unknown>>();

const DEFAULT_CONTENT: Record<string, string> = {
  hero_headline: 'Hello Gorgeous',
  hero_subhead: 'Med Spa & Aesthetics',
  hero_cta: 'Book Now',
  promo_banner: '',
  promo_offer: '',
  faqs: '',
  membership_blurb: '',
  booking_cta: 'Schedule your visit',
  seo_title: 'Hello Gorgeous Med Spa',
  seo_description: 'Med spa and aesthetics in your area.',
};

function getAll(): Record<string, string> {
  const out: Record<string, string> = { ...DEFAULT_CONTENT };
  for (const [k, v] of store) {
    out[k] = typeof v === 'string' ? v : JSON.stringify(v);
  }
  return out;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const all = getAll();
  if (key) {
    if (!(key in all)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ key, value: all[key] });
  }
  return NextResponse.json({ content: all });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const updates = body.updates as Record<string, string> | undefined;
  if (!updates || typeof updates !== 'object') {
    return NextResponse.json({ error: 'updates object required' }, { status: 400 });
  }
  for (const [k, v] of Object.entries(updates)) {
    if (v !== undefined) store.set(k, typeof v === 'string' ? v : JSON.stringify(v));
  }
  return NextResponse.json({ content: getAll() });
}

export async function PATCH(request: NextRequest) {
  return POST(request);
}
