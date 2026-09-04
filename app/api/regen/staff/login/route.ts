import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { ROLE_PERMISSIONS, type StaffRole } from '@/lib/regen/permissions';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Attempt sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify they're in the staff table
    const { data: staff } = await supabase
      .from('regen_staff')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('active', true)
      .single();

    if (!staff) {
      // Not a staff member - sign them out
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Update last login
    await supabase
      .from('regen_staff')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', staff.id);

    // Log the login
    await supabase.from('regen_audit_log').insert({
      action: 'staff_login',
      actor_id: staff.id,
      actor_type: 'staff',
      actor_email: staff.email,
      details: { role: staff.role },
    });

    return NextResponse.json({
      success: true,
      staff: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
        permissions: ROLE_PERMISSIONS[staff.role as StaffRole] || [],
      },
    });
  } catch (error) {
    console.error('Staff login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
