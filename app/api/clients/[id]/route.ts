// ============================================================
// API: SINGLE CLIENT - GET, PUT, DELETE
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// GET /api/clients/[id] - Get single client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = await params;

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
    const supabase = createServerSupabaseClient();
    const { id } = await params;
    const body = await request.json();

    // Get the client to find the user_id
    const { data: existingClient, error: fetchError } = await supabase
      .from('clients')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Update user table (name, email, phone)
    if (body.first_name || body.last_name || body.email || body.phone) {
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
    const clientUpdate: any = {};
    if (body.date_of_birth !== undefined) clientUpdate.date_of_birth = body.date_of_birth || null;
    if (body.address_line1 !== undefined) clientUpdate.address_line1 = body.address_line1 || null;
    if (body.address_line2 !== undefined) clientUpdate.address_line2 = body.address_line2 || null;
    if (body.city !== undefined) clientUpdate.city = body.city || null;
    if (body.state !== undefined) clientUpdate.state = body.state || null;
    if (body.postal_code !== undefined) clientUpdate.postal_code = body.postal_code || null;
    if (body.emergency_contact_name !== undefined) clientUpdate.emergency_contact_name = body.emergency_contact_name || null;
    if (body.emergency_contact_phone !== undefined) clientUpdate.emergency_contact_phone = body.emergency_contact_phone || null;
    if (body.allergies_summary !== undefined) clientUpdate.allergies_summary = body.allergies_summary || null;
    if (body.medications_summary !== undefined) clientUpdate.medications_summary = body.medications_summary || null;
    if (body.medical_conditions_summary !== undefined) clientUpdate.medical_conditions_summary = body.medical_conditions_summary || null;
    if (body.internal_notes !== undefined) clientUpdate.internal_notes = body.internal_notes || null;
    if (body.referral_source !== undefined) clientUpdate.referral_source = body.referral_source || null;

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
    const supabase = createServerSupabaseClient();
    const { id } = await params;

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

    return NextResponse.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Client DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
