import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get patient
    const { data: patient } = await supabase
      .from('regen_patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!patient) {
      return NextResponse.json({ entries: [] });
    }

    // Get weight entries
    const { data: entries } = await supabase
      .from('regen_weight_entries')
      .select('*')
      .eq('patient_id', patient.id)
      .order('date', { ascending: false });

    return NextResponse.json({ entries: entries || [] });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { weight, notes, date } = await request.json();

    if (!weight || typeof weight !== 'number') {
      return NextResponse.json({ error: 'Valid weight required' }, { status: 400 });
    }

    // Get patient
    const { data: patient } = await supabase
      .from('regen_patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Create entry
    const { data: entry, error } = await supabase
      .from('regen_weight_entries')
      .insert({
        patient_id: patient.id,
        weight,
        notes,
        date: date || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Create entry error:', error);
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
  }
}
