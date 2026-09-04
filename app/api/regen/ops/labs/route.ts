import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

/**
 * Ops Lab Review API
 * 
 * GET - List all lab records for review
 * PATCH - Update lab status after review
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const patientEmail = searchParams.get('patient_email');
    
    const supabase = getSupabase();
    
    let query = supabase
      .from('regen_lab_requirements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (patientEmail) {
      query = query.eq('patient_email', patientEmail);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ labs: data });
  } catch (error) {
    console.error('Error fetching labs:', error);
    return NextResponse.json({ error: 'Failed to fetch labs' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, review_notes, values_within_range } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Lab ID required' }, { status: 400 });
    }
    
    const supabase = getSupabase();
    
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    
    if (review_notes !== undefined) {
      updateData.review_notes = review_notes;
    }
    
    if (values_within_range !== undefined) {
      updateData.values_within_range = values_within_range;
    }
    
    if (status === 'approved' || status === 'reviewed') {
      updateData.reviewed_at = new Date().toISOString();
      // TODO: Set reviewed_by from authenticated user
    }
    
    const { data, error } = await supabase
      .from('regen_lab_requirements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // If approved, notify patient they can proceed
    if (status === 'approved' && data?.patient_email) {
      // TODO: Send email/SMS notification
      console.log(`Labs approved for ${data.patient_email} - notification queued`);
    }
    
    return NextResponse.json({ success: true, lab: data });
  } catch (error) {
    console.error('Error updating lab:', error);
    return NextResponse.json({ error: 'Failed to update lab' }, { status: 500 });
  }
}
