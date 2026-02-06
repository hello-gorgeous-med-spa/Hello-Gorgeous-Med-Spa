// ============================================================
// API: CHART NOTES - Single Note Operations
// Get, amend, attach to client/appointment
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

// GET /api/chart-notes/[id] - Get single note with full details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from('chart_notes')
      .select(`
        *,
        client:clients(
          id,
          user_id,
          date_of_birth,
          users(first_name, last_name, email, phone)
        ),
        appointment:appointments(
          id,
          starts_at,
          ends_at,
          status,
          service:services(id, name, price_cents)
        ),
        service:services(id, name, category),
        template:chart_templates(id, name, note_type),
        created_by_user:users!chart_notes_created_by_fkey(id, first_name, last_name, email),
        signed_by_user:users!chart_notes_signed_by_fkey(id, first_name, last_name),
        amended_from:chart_notes!chart_notes_amended_from_id_fkey(id, signed_at, status),
        attachments:chart_attachments(*),
        photos:chart_photos(*),
        voice_captures:chart_voice_captures(*)
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Chart note fetch error:', error);
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Also get any amendments to this note
    const { data: amendments } = await supabase
      .from('chart_notes')
      .select('id, created_at, signed_at, amendment_reason')
      .eq('amended_from_id', params.id)
      .order('created_at', { ascending: true });

    return NextResponse.json({ 
      note: {
        ...data,
        client_name: data.client?.users 
          ? `${data.client.users.first_name} ${data.client.users.last_name}` 
          : null,
        amendments: amendments || [],
      }
    });
  } catch (error) {
    console.error('Chart note API error:', error);
    return NextResponse.json({ error: 'Failed to fetch chart note' }, { status: 500 });
  }
}

// POST /api/chart-notes/[id]/amend - Create amendment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { amendment_reason, created_by, ...updates } = body;

    if (!amendment_reason) {
      return NextResponse.json(
        { error: 'Amendment reason is required' },
        { status: 400 }
      );
    }

    // Get original note
    const { data: original, error: fetchError } = await supabase
      .from('chart_notes')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !original) {
      return NextResponse.json({ error: 'Original note not found' }, { status: 404 });
    }

    // Only final/locked notes can be amended
    if (original.status !== 'final' && original.status !== 'locked') {
      return NextResponse.json(
        { error: 'Only finalized notes can be amended. Edit the draft directly.' },
        { status: 400 }
      );
    }

    // Mark original as amended
    await supabase
      .from('chart_notes')
      .update({ status: 'amended' })
      .eq('id', params.id);

    // Create amendment (new note referencing original)
    const amendmentData = {
      client_id: original.client_id,
      appointment_id: original.appointment_id,
      service_id: original.service_id,
      template_id: original.template_id,
      note_type: original.note_type,
      title: original.title ? `Amendment: ${original.title}` : 'Amendment',
      subjective: updates.subjective ?? original.subjective,
      objective: updates.objective ?? original.objective,
      assessment: updates.assessment ?? original.assessment,
      plan: updates.plan ?? original.plan,
      procedure_details: updates.procedure_details ?? original.procedure_details,
      icd10_codes: updates.icd10_codes ?? original.icd10_codes,
      cpt_codes: updates.cpt_codes ?? original.cpt_codes,
      amended_from_id: params.id,
      amendment_reason,
      created_by,
      status: 'draft', // Amendments start as draft
    };

    const { data: amendment, error: createError } = await supabase
      .from('chart_notes')
      .insert(amendmentData)
      .select()
      .single();

    if (createError) {
      console.error('Amendment create error:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      amendment, 
      success: true,
      message: 'Amendment created. Review and finalize when ready.',
    });
  } catch (error) {
    console.error('Amendment API error:', error);
    return NextResponse.json({ error: 'Failed to create amendment' }, { status: 500 });
  }
}
