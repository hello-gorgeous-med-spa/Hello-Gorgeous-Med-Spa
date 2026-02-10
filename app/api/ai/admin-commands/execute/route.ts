// ============================================================
// AI ADMIN COMMANDS — Execute (owner-only)
// Applies approved proposal to site content; logs to watchdog
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getOwnerSession } from '@/lib/get-owner-session';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';
import { applySiteContentUpdate, isAllowedLocation } from '@/lib/site-content-update';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const owner = await getOwnerSession();
  if (!owner) {
    return NextResponse.json({ error: 'Owner access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const proposal = body.proposal;
    if (!proposal || typeof proposal.location !== 'string' || proposal.new === undefined) {
      return NextResponse.json({ error: 'Invalid proposal' }, { status: 400 });
    }

    if (!isAllowedLocation(proposal.location)) {
      return NextResponse.json({ error: 'Location not allowed' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    let value: string | boolean | null = proposal.new;
    if (proposal.location === 'site.booking_enabled') {
      value = value === true || value === 'true' || value === '1';
    } else if (proposal.location === 'homepage.banner.enabled') {
      value = value === true || value === 'true' || value === '1';
    } else if (value !== null && value !== undefined && typeof value !== 'string' && typeof value !== 'boolean') {
      value = String(value);
    }

    const result = await applySiteContentUpdate(supabase, proposal.location, value as string | boolean | null);

    if (!result.ok) {
      return NextResponse.json({ error: result.error || 'Update failed' }, { status: 500 });
    }

    if (isAdminConfigured()) {
      const admin = createAdminSupabaseClient();
      if (admin) {
        await admin.from('ai_watchdog_logs').insert({
          source: 'ai_admin_commands',
          channel: 'admin',
          request_summary: `Execute: ${proposal.location}`,
          response_summary: `Applied: ${proposal.location}`,
          full_response_preview: JSON.stringify({ location: result.location, old: result.old, new: result.new }).slice(0, 500),
          flagged: false,
          metadata: {
            action: proposal.action || 'update_site_content',
            confidence: 'high',
            approved_by_owner: true,
            changes: {
              location: result.location,
              old: result.old,
              new: result.new,
            },
          },
        }).then(() => {}).catch((err) => console.error('Admin execute watchdog log:', err));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Change applied.',
      changes: { location: result.location, old: result.old, new: result.new },
    });
  } catch (e) {
    console.error('Admin execute error:', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
