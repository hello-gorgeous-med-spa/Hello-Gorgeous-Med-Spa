// ============================================================
// CAMPAIGN AUDIENCE API
// Returns real audience counts from database
// GET /api/campaigns/audience
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        email: 0,
        sms: 0,
        total: 0,
        configured: false,
      });
    }

    // Fetch all clients with user data
    const { data: clients, error } = await supabase
      .from('clients')
      .select(`
        id,
        accepts_sms_marketing,
        accepts_email_marketing,
        users!inner(email, phone)
      `);

    if (error) {
      console.error('Audience count error:', error);
      return NextResponse.json({ email: 0, sms: 0, total: 0, configured: true });
    }

    let withEmail = 0;
    let withSms = 0;
    const uniqueIds = new Set<string>();

    for (const c of clients || []) {
      const u = (c as any).users;
      if (!u) continue;

      let counted = false;

      if (u.email && c.accepts_email_marketing !== false) {
        withEmail++;
        counted = true;
      }

      if (u.phone && c.accepts_sms_marketing === true) {
        withSms++;
        counted = true;
      }

      if (counted) {
        uniqueIds.add(c.id);
      }
    }

    return NextResponse.json({
      email: withEmail,
      sms: withSms,
      total: uniqueIds.size,
      configured: true,
    });
  } catch (error: any) {
    console.error('Audience API error:', error);
    return NextResponse.json({ email: 0, sms: 0, total: 0, configured: true });
  }
}
