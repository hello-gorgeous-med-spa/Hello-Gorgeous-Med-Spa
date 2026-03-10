// ============================================================
// GET/PUT /api/settings — Business settings (single source of truth)
// No-code control: business name, contact, booking, hours
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const defaults = {
  settings: {
    business_name: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Your Med Spa',
    phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '',
    email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || '',
    address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || '',
    timezone: process.env.NEXT_PUBLIC_TIMEZONE || 'America/Chicago',
    online_booking_enabled: true,
    require_deposit: false,
    send_reminders: true,
    cancellation_hours: 24,
    cancellation_fee_percent: 50,
  },
  businessHours: {
    monday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    tuesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    wednesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    thursday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    friday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    saturday: { open: '', close: '', enabled: false },
    sunday: { open: '', close: '', enabled: false },
  },
};

let memory: { settings: Record<string, unknown>; businessHours: Record<string, unknown> } = { ...defaults };

export async function GET() {
  return NextResponse.json({
    settings: memory.settings,
    businessHours: memory.businessHours,
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.settings && typeof body.settings === 'object') {
      memory.settings = { ...memory.settings, ...body.settings };
    }
    if (body.businessHours && typeof body.businessHours === 'object') {
      memory.businessHours = { ...memory.businessHours, ...body.businessHours };
    }
    return NextResponse.json({
      settings: memory.settings,
      businessHours: memory.businessHours,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
