import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { ROLE_PERMISSIONS, type StaffRole } from '@/lib/regen/permissions';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ authenticated: false });
    }

    // Get staff record
    const { data: staff } = await supabase
      .from('regen_staff')
      .select('*')
      .eq('email', user.email.toLowerCase())
      .eq('active', true)
      .single();

    if (!staff) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      staff: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
        permissions: ROLE_PERMISSIONS[staff.role as StaffRole] || [],
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  try {
    const supabase = createServerSupabaseClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json({ error: 'Sign out failed' }, { status: 500 });
  }
}
