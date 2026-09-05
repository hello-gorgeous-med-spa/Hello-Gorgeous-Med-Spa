import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { getOpsStaff } from '@/lib/regen/ops-staff';
import {
  OPS_SESSION_COOKIE,
  getOpsSessionFromRequest,
  opsSessionCookieOptions,
  passwordMatches,
  signOpsSession,
} from '@/lib/regen/ops-session';

export async function GET(request: NextRequest) {
  const staff = await getOpsSessionFromRequest(request);
  return NextResponse.json({ staff: staff ? { id: staff.id, name: staff.name, short: staff.short, role: staff.role, email: staff.email } : null });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const staff = getOpsStaff(body.staffId);
    if (!staff || typeof body.password !== 'string') {
      return NextResponse.json({ error: 'Pick Danielle, Ryan, or Damara and enter your password' }, { status: 400 });
    }
    if (!passwordMatches(staff.id, body.password)) {
      return NextResponse.json({ error: 'Invalid password for that person' }, { status: 401 });
    }

    const token = await signOpsSession(staff.id);
    const res = NextResponse.json({
      staff: { id: staff.id, name: staff.name, short: staff.short, role: staff.role, email: staff.email },
    });
    res.cookies.set(OPS_SESSION_COOKIE, token, opsSessionCookieOptions());

    const supabase = getSupabase();
    if (supabase) {
      await supabase
        .from('regen_staff')
        .update({ last_login_at: new Date().toISOString() })
        .eq('email', staff.email);
      await supabase.from('regen_audit_log').insert({
        action: 'ops_login',
        resource_type: 'staff',
        actor_type: 'staff',
        actor_email: staff.email,
        details: { staffId: staff.id, staffName: staff.name },
      });
    }

    return res;
  } catch {
    return NextResponse.json({ error: 'Sign-in failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(OPS_SESSION_COOKIE, '', { ...opsSessionCookieOptions(), maxAge: 0 });
  return res;
}
