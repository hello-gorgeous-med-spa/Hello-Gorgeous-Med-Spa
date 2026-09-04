import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, date_of_birth, address } = body;

    // Get existing patient record
    const { data: existingPatient } = await supabase
      .from('regen_patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!existingPatient) {
      // Create patient record if doesn't exist
      const { data: newPatient, error: createError } = await supabase
        .from('regen_patients')
        .insert({
          user_id: user.id,
          email: user.email,
          name,
          phone,
          date_of_birth,
          address,
          state: address?.state || 'IL',
        })
        .select()
        .single();

      if (createError) throw createError;
      return NextResponse.json({ patient: newPatient, created: true });
    }

    // Update existing patient
    const { data: patient, error } = await supabase
      .from('regen_patients')
      .update({
        name,
        phone,
        date_of_birth,
        address,
        state: address?.state || 'IL',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingPatient.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ patient, updated: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
