// ============================================================
// SINGLE CLIENT API
// GET, PUT, DELETE for individual clients
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/clients/[id] - Get single client with all details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const { id } = await params;

  try {
    // Get client
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }
      throw error;
    }

    // Get recent appointments
    const { data: appointments } = await supabase
      .from('appointments')
      .select(`
        *,
        provider:staff(id, first_name, last_name),
        service:services(id, name, price)
      `)
      .eq('client_id', id)
      .order('scheduled_at', { ascending: false })
      .limit(10);

    // Get recent transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      client,
      appointments: appointments || [],
      transactions: transactions || [],
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id] - Update client
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    
    // Filter out undefined values
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    
    const allowedFields = [
      'first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'gender',
      'address_line1', 'address_line2', 'city', 'state', 'postal_code',
      'emergency_contact_name', 'emergency_contact_phone', 'notes', 'tags',
      'is_vip', 'status', 'client_type'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ client: data });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Soft delete client
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const { id } = await params;

  try {
    // Soft delete - mark as inactive
    const { data, error } = await supabase
      .from('clients')
      .update({ status: 'inactive', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ client: data, message: 'Client deactivated' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
