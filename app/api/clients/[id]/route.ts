// ============================================================
// API: SINGLE CLIENT - GET, PUT, DELETE
// INCLUDES: HIPAA audit logging for PHI access and changes
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';
import { logRecordView, logRecordUpdate, logRecordDelete } from '@/lib/audit';
import { computeAuditDiff } from '@/lib/audit/diff';
import { getSessionFromRequest } from '@/lib/audit/middleware';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Use admin client when available so staff can read/update any client (avoids RLS blocking)
function getClientSupabase() {
  if (isAdminConfigured()) {
    const admin = createAdminSupabaseClient();
    if (admin) return admin;
  }
  return createServerSupabaseClient();
}

/** Resolve id (UUID or email/slug) to real client UUID so profile save works when URL uses email. */
async function resolveClientId(supabase: ReturnType<typeof getClientSupabase>, id: string): Promise<string | null> {
  if (UUID_REGEX.test(id)) {
    const { data } = await supabase.from('clients').select('id').eq('id', id).single();
    return data?.id ?? null;
  }
  const { data: byEmail } = await supabase.from('users').select('id').eq('email', id).limit(1);
  let userId = byEmail?.[0]?.id ?? null;
  if (!userId) {
    const { data: byPrefix } = await supabase.from('users').select('id').ilike('email', `${id}@%`).limit(1);
    userId = byPrefix?.[0]?.id ?? null;
  }
  if (!userId) return null;
  const { data: client } = await supabase.from('clients').select('id').eq('user_id', userId).single();
  return client?.id ?? null;
}

// GET /api/clients/[id] - Get single client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getClientSupabase();
    if (!supabase) return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    const { id: rawId } = await params;
    const session = await getSessionFromRequest(request);
    const id = (await resolveClientId(supabase, rawId)) ?? rawId;

    const { data: client, error } = await supabase
      .from('clients')
      .select(`
        *,
        users!inner(id, first_name, last_name, email, phone)
      `)
      .eq('id', id)
      .single();

    if (error || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Flatten the data
    const flatClient = {
      id: client.id,
      user_id: client.user_id,
      first_name: client.users?.first_name,
      last_name: client.users?.last_name,
      email: client.users?.email,
      phone: client.users?.phone,
      date_of_birth: client.date_of_birth,
      gender: client.gender,
      address_line1: client.address_line1,
      address_line2: client.address_line2,
      city: client.city,
      state: client.state,
      postal_code: client.postal_code,
      emergency_contact_name: client.emergency_contact_name,
      emergency_contact_phone: client.emergency_contact_phone,
      referral_source: client.referral_source,
      internal_notes: client.internal_notes,
      allergies_summary: client.allergies_summary,
      medications_summary: client.medications_summary,
      medical_conditions_summary: client.medical_conditions_summary,
      created_at: client.created_at,
      last_visit_at: client.last_visit_at,
      total_spent: client.lifetime_value_cents ? client.lifetime_value_cents / 100 : 0,
      visit_count: client.visit_count || 0,
    };

    // AUDIT LOG: Client profile viewed (PHI access)
    await logRecordView('client', id, session.userId);

    return NextResponse.json({ client: flatClient });
  } catch (error) {
    console.error('Client GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
  }
}

// PUT /api/clients/[id] - Update client
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getClientSupabase();
    if (!supabase) return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    const { id: rawId } = await params;
    const body = await request.json();
    const session = await getSessionFromRequest(request);
    const id = (await resolveClientId(supabase, rawId)) ?? rawId;

    // Get the client to find the user_id AND capture old values for audit
    const { data: existingClient, error: fetchError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Track changed fields for audit
    const changedFields: string[] = [];
    const oldValues: Record<string, unknown> = {};
    const newValues: Record<string, unknown> = {};

    // Update user table (name, email, phone)
    if (body.first_name || body.last_name || body.email || body.phone) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userUpdate: any = {};
      if (body.first_name !== undefined) userUpdate.first_name = body.first_name;
      if (body.last_name !== undefined) userUpdate.last_name = body.last_name;
      if (body.email !== undefined) userUpdate.email = body.email.toLowerCase();
      if (body.phone !== undefined) userUpdate.phone = body.phone;

      const { error: userError } = await supabase
        .from('users')
        .update(userUpdate)
        .eq('id', existingClient.user_id);

      if (userError) {
        console.error('User update error:', userError);
        return NextResponse.json({ error: 'Failed to update user info' }, { status: 500 });
      }
    }

    // Update clients table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientUpdate: any = {};
    
    // Helper to track changes
    const trackChange = (field: string, newValue: unknown) => {
      const oldValue = existingClient[field];
      if (oldValue !== newValue) {
        changedFields.push(field);
        oldValues[field] = oldValue;
        newValues[field] = newValue;
      }
    };
    
    if (body.date_of_birth !== undefined) {
      clientUpdate.date_of_birth = body.date_of_birth || null;
      trackChange('date_of_birth', clientUpdate.date_of_birth);
    }
    if (body.address_line1 !== undefined) {
      clientUpdate.address_line1 = body.address_line1 || null;
      trackChange('address_line1', clientUpdate.address_line1);
    }
    if (body.address_line2 !== undefined) {
      clientUpdate.address_line2 = body.address_line2 || null;
      trackChange('address_line2', clientUpdate.address_line2);
    }
    if (body.city !== undefined) {
      clientUpdate.city = body.city || null;
      trackChange('city', clientUpdate.city);
    }
    if (body.state !== undefined) {
      clientUpdate.state = body.state || null;
      trackChange('state', clientUpdate.state);
    }
    if (body.postal_code !== undefined) {
      clientUpdate.postal_code = body.postal_code || null;
      trackChange('postal_code', clientUpdate.postal_code);
    }
    if (body.emergency_contact_name !== undefined) {
      clientUpdate.emergency_contact_name = body.emergency_contact_name || null;
      trackChange('emergency_contact_name', clientUpdate.emergency_contact_name);
    }
    if (body.emergency_contact_phone !== undefined) {
      clientUpdate.emergency_contact_phone = body.emergency_contact_phone || null;
      trackChange('emergency_contact_phone', clientUpdate.emergency_contact_phone);
    }
    if (body.allergies_summary !== undefined) {
      clientUpdate.allergies_summary = body.allergies_summary || null;
      trackChange('allergies_summary', '[modified]'); // PHI - don't log content
    }
    if (body.medications_summary !== undefined) {
      clientUpdate.medications_summary = body.medications_summary || null;
      trackChange('medications_summary', '[modified]'); // PHI - don't log content
    }
    if (body.medical_conditions_summary !== undefined) {
      clientUpdate.medical_conditions_summary = body.medical_conditions_summary || null;
      trackChange('medical_conditions_summary', '[modified]'); // PHI - don't log content
    }
    if (body.internal_notes !== undefined) {
      clientUpdate.internal_notes = body.internal_notes || null;
      trackChange('internal_notes', '[modified]'); // PHI - don't log content
    }
    if (body.referral_source !== undefined) {
      clientUpdate.referral_source = body.referral_source || null;
      trackChange('referral_source', clientUpdate.referral_source);
    }

    if (Object.keys(clientUpdate).length > 0) {
      clientUpdate.updated_at = new Date().toISOString();
      
      const { error: clientError } = await supabase
        .from('clients')
        .update(clientUpdate)
        .eq('id', id);

      if (clientError) {
        console.error('Client update error:', clientError);
        return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
      }
    }

    // AUDIT LOG: Client record updated (PHI change)
    if (changedFields.length > 0) {
      await logRecordUpdate('client', id, oldValues, newValues, changedFields, session.userId);
    }

    return NextResponse.json({ success: true, message: 'Client updated successfully' });
  } catch (error) {
    console.error('Client PUT error:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

// DELETE /api/clients/[id] - Delete client
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getClientSupabase();
    if (!supabase) return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    const { id } = await params;
    const session = await getSessionFromRequest(request);

    // Soft delete - just mark as inactive rather than actually deleting
    // This preserves historical data for appointments, payments, etc.
    const { error } = await supabase
      .from('clients')
      .update({ 
        is_active: false,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Client delete error:', error);
      return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
    }

    // AUDIT LOG: Client record archived/deleted
    await logRecordDelete('client', id, session.userId);

    return NextResponse.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Client DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
