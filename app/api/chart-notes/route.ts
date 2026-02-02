// ============================================================
// CHART NOTES API
// CRUD operations for SOAP clinical notes
// INCLUDES: Full audit logging for HIPAA compliance
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Audit logging helper for clinical notes
async function auditChartAction(
  supabase: any,
  action: string,
  noteId: string,
  userId?: string,
  clientId?: string,
  details?: any,
  request?: NextRequest
) {
  try {
    const ipAddress = request?.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request?.headers.get('x-real-ip') || 'unknown';
    const userAgent = request?.headers.get('user-agent') || 'unknown';
    
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        resource_type: 'clinical_note',
        resource_id: noteId,
        description: `Clinical note ${action}${clientId ? ` for client ${clientId}` : ''}`,
        new_values: details,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
  } catch (err) {
    console.error('Chart audit log error:', err);
  }
}

// GET /api/chart-notes - List chart notes
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const clientId = searchParams.get('clientId');
  const appointmentId = searchParams.get('appointmentId');
  const providerId = searchParams.get('providerId');
  const noteId = searchParams.get('id');
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    let query = supabase
      .from('chart_notes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (noteId) {
      query = query.eq('id', noteId);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    if (appointmentId) {
      query = query.eq('appointment_id', appointmentId);
    }

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ notes: data });
  } catch (error) {
    console.error('Error fetching chart notes:', error);
    return NextResponse.json({ error: 'Failed to fetch chart notes' }, { status: 500 });
  }
}

// POST /api/chart-notes - Create new chart note
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      client_id,
      appointment_id,
      provider_id,
      chief_complaint,
      subjective,
      objective,
      assessment,
      plan,
      treatment_performed,
      areas_treated,
      products_used,
      before_photos,
      after_photos,
      consent_obtained,
      adverse_reactions,
      patient_instructions,
      follow_up_date,
      created_by,
    } = body;

    if (!client_id || !provider_id) {
      return NextResponse.json(
        { error: 'Client ID and Provider ID are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('chart_notes')
      .insert({
        client_id,
        appointment_id,
        provider_id,
        chief_complaint,
        subjective,
        objective,
        assessment,
        plan,
        treatment_performed,
        areas_treated,
        products_used: products_used || [],
        before_photos,
        after_photos,
        consent_obtained: consent_obtained || false,
        adverse_reactions,
        patient_instructions,
        follow_up_date,
        created_by,
      })
      .select()
      .single();

    if (error) throw error;

    // AUDIT LOG: Chart note created
    await auditChartAction(
      supabase,
      'create',
      data.id,
      provider_id || created_by,
      client_id,
      { appointment_id, service_performed: treatment_performed },
      request
    );

    return NextResponse.json({ note: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating chart note:', error);
    return NextResponse.json({ error: 'Failed to create chart note' }, { status: 500 });
  }
}

// PUT /api/chart-notes - Update chart note
export async function PUT(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }

    // Check if note is locked
    const { data: existingNote, error: fetchError } = await supabase
      .from('chart_notes')
      .select('is_locked, signed_at')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (existingNote?.is_locked || existingNote?.signed_at) {
      return NextResponse.json(
        { error: 'Cannot modify a signed/locked chart note' },
        { status: 403 }
      );
    }

    // Update the note
    const { data, error } = await supabase
      .from('chart_notes')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ note: data });
  } catch (error) {
    console.error('Error updating chart note:', error);
    return NextResponse.json({ error: 'Failed to update chart note' }, { status: 500 });
  }
}

// PATCH /api/chart-notes - Sign/Lock chart note
export async function PATCH(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, action, signed_by } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Note ID and action required' }, { status: 400 });
    }

    if (action === 'sign') {
      // Sign and lock the note
      const { data, error } = await supabase
        .from('chart_notes')
        .update({
          signed_at: new Date().toISOString(),
          signed_by,
          is_locked: true,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Create version snapshot
      await supabase
        .from('chart_note_versions')
        .insert({
          chart_note_id: id,
          version_number: 1,
          content: data,
          changed_by: signed_by,
          change_reason: 'Initial signature',
        });

      // AUDIT LOG: Chart note signed and locked
      await auditChartAction(
        supabase,
        'sign',
        id,
        signed_by,
        data.client_id,
        { signed_at: data.signed_at, is_locked: true },
        request
      );

      return NextResponse.json({ note: data, message: 'Chart note signed and locked' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error signing chart note:', error);
    return NextResponse.json({ error: 'Failed to sign chart note' }, { status: 500 });
  }
}
