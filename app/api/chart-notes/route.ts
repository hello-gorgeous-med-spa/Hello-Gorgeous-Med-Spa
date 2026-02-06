// ============================================================
// API: CHART NOTES - Clinical Documentation CRUD
// Supports appointment-optional charting with full audit trail
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }
  
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET /api/chart-notes - List notes with filters
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ notes: [], source: 'no_db' });
  }

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const appointmentId = searchParams.get('appointment_id');
    const status = searchParams.get('status');
    const noteType = searchParams.get('note_type');
    const createdBy = searchParams.get('created_by');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('chart_notes')
      .select(`
        *,
        client:clients(
          id,
          user_id,
          users(first_name, last_name, email, phone)
        ),
        appointment:appointments(
          id,
          starts_at,
          service:services(name)
        ),
        service:services(id, name),
        template:chart_templates(id, name),
        created_by_user:users!chart_notes_created_by_fkey(first_name, last_name),
        signed_by_user:users!chart_notes_signed_by_fkey(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (appointmentId) {
      query = query.eq('appointment_id', appointmentId);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (noteType) {
      query = query.eq('note_type', noteType);
    }
    if (createdBy) {
      query = query.eq('created_by', createdBy);
    }
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Chart notes fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Flatten nested data
    const notes = (data || []).map((note: any) => ({
      ...note,
      client_name: note.client?.users 
        ? `${note.client.users.first_name} ${note.client.users.last_name}` 
        : null,
      client_email: note.client?.users?.email,
      appointment_date: note.appointment?.starts_at,
      appointment_service: note.appointment?.service?.name,
      service_name: note.service?.name,
      template_name: note.template?.name,
      created_by_name: note.created_by_user 
        ? `${note.created_by_user.first_name} ${note.created_by_user.last_name}`
        : null,
      signed_by_name: note.signed_by_user
        ? `${note.signed_by_user.first_name} ${note.signed_by_user.last_name}`
        : null,
    }));

    // Get count for pagination
    const { count } = await supabase
      .from('chart_notes')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({ 
      notes, 
      total: count || notes.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Chart notes API error:', error);
    return NextResponse.json({ error: 'Failed to fetch chart notes' }, { status: 500 });
  }
}

// POST /api/chart-notes - Create new note
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      client_id,
      appointment_id,
      service_id,
      template_id,
      note_type = 'soap',
      title,
      subjective,
      objective,
      assessment,
      plan,
      procedure_details,
      icd10_codes,
      cpt_codes,
      created_by,
      status = 'draft',
    } = body;

    // Validate: Final notes require a client
    if (status === 'final' && !client_id) {
      return NextResponse.json(
        { error: 'Client is required for finalized notes' },
        { status: 400 }
      );
    }

    // Validate created_by
    if (!created_by) {
      return NextResponse.json(
        { error: 'created_by (user ID) is required' },
        { status: 400 }
      );
    }

    const insertData: any = {
      client_id: client_id || null,
      appointment_id: appointment_id || null,
      service_id: service_id || null,
      template_id: template_id || null,
      note_type,
      title: title || null,
      subjective: subjective || null,
      objective: objective || null,
      assessment: assessment || null,
      plan: plan || null,
      procedure_details: procedure_details || {},
      icd10_codes: icd10_codes || [],
      cpt_codes: cpt_codes || [],
      created_by,
      status,
    };

    // If finalizing immediately, add signature
    if (status === 'final') {
      insertData.signed_at = new Date().toISOString();
      insertData.signed_by = created_by;
    }

    const { data, error } = await supabase
      .from('chart_notes')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Chart note create error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ note: data, success: true });
  } catch (error) {
    console.error('Chart note create API error:', error);
    return NextResponse.json({ error: 'Failed to create chart note' }, { status: 500 });
  }
}

// PUT /api/chart-notes - Update existing note
export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }

    // Get current note to check status
    const { data: currentNote, error: fetchError } = await supabase
      .from('chart_notes')
      .select('status, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !currentNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Prevent editing locked/final notes (except status changes for amendments)
    if (currentNote.status === 'locked' || currentNote.status === 'final') {
      if (updateData.status !== 'amended') {
        return NextResponse.json(
          { error: 'Cannot edit finalized notes. Create an amendment instead.' },
          { status: 403 }
        );
      }
    }

    // Handle finalization
    if (updateData.status === 'final' && currentNote.status === 'draft') {
      // Require client for final notes
      if (!updateData.client_id) {
        const { data: noteWithClient } = await supabase
          .from('chart_notes')
          .select('client_id')
          .eq('id', id)
          .single();
        
        if (!noteWithClient?.client_id) {
          return NextResponse.json(
            { error: 'Client is required to finalize note' },
            { status: 400 }
          );
        }
      }
      
      updateData.signed_at = new Date().toISOString();
      updateData.signed_by = updateData.signed_by || currentNote.created_by;
    }

    // Update timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('chart_notes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Chart note update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ note: data, success: true });
  } catch (error) {
    console.error('Chart note update API error:', error);
    return NextResponse.json({ error: 'Failed to update chart note' }, { status: 500 });
  }
}

// DELETE /api/chart-notes - Delete draft note only
export async function DELETE(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }

    // Check if draft
    const { data: note, error: fetchError } = await supabase
      .from('chart_notes')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    if (note.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft notes can be deleted' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('chart_notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Chart note delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    console.error('Chart note delete API error:', error);
    return NextResponse.json({ error: 'Failed to delete chart note' }, { status: 500 });
  }
}
