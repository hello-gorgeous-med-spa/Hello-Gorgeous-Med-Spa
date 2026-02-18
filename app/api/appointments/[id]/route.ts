// ============================================================
// SINGLE APPOINTMENT API
// GET, PUT, DELETE for individual appointments
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

// GET /api/appointments/[id] - Get single appointment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        client:clients(*),
        provider:providers(*),
        service:services(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ appointment: data });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

// PUT /api/appointments/[id] - Update appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      scheduled_at,
      provider_id,
      service_id,
      duration_minutes,
      status,
      payment_status,
      notes,
      internal_notes,
      check_in_at,
      check_out_at,
      cancellation_reason,
      no_show_reason,
    } = body;

    // Get current appointment to check status change
    const { data: currentAppointment } = await supabase
      .from('appointments')
      .select('status, client_id, service_id')
      .eq('id', id)
      .single();

    // Build update object
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    
    if (scheduled_at !== undefined) updates.scheduled_at = scheduled_at;
    if (provider_id !== undefined) updates.provider_id = provider_id;
    if (service_id !== undefined) updates.service_id = service_id;
    if (duration_minutes !== undefined) updates.duration_minutes = duration_minutes;
    if (status !== undefined) updates.status = status;
    // Support both 'notes' and 'client_notes' column names
    if (notes !== undefined) {
      updates.notes = notes;
      updates.client_notes = notes;
    }
    if (internal_notes !== undefined) {
      updates.internal_notes = internal_notes;
      updates.provider_notes = internal_notes;
    }
    if (check_in_at !== undefined) {
      updates.check_in_at = check_in_at;
      updates.checked_in_at = check_in_at;
    }
    if (check_out_at !== undefined) updates.check_out_at = check_out_at;
    if (cancellation_reason !== undefined) {
      updates.cancellation_reason = cancellation_reason;
      updates.cancel_reason = cancellation_reason;
    }
    if (no_show_reason !== undefined) updates.no_show_reason = no_show_reason;
    if (payment_status !== undefined) updates.payment_status = payment_status;

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        client:clients(id, first_name, last_name),
        provider:providers(id, first_name, last_name),
        service:services(id, name, price)
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }
      throw error;
    }

    // AFTERCARE AUTO-SEND: Trigger when status changes to 'completed'
    if (
      status === 'completed' && 
      currentAppointment?.status !== 'completed' &&
      currentAppointment?.client_id
    ) {
      try {
        // Get base URL for internal API call
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        
        // Fire and forget - don't block the response
        fetch(`${baseUrl}/api/aftercare/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointment_id: id,
            client_id: currentAppointment.client_id,
            service_id: service_id || currentAppointment.service_id,
          }),
        }).catch(err => {
          console.error('Aftercare send error (non-blocking):', err);
        });
        // Queue review request for 24h delay (processed by cron)
        supabase.from('review_requests_pending').upsert(
          {
            appointment_id: id,
            client_id: currentAppointment.client_id,
            scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
          { onConflict: 'appointment_id', ignoreDuplicates: false }
        ).then(({ error }) => {
          if (error) console.error('Review pending insert error:', error);
        }).catch(err => console.error('Review pending insert error:', err));

        // AUTO-CREATE DRAFT INVOICE for completed appointments (if no invoice exists)
        const { data: existingInvoice } = await supabase
          .from('sales')
          .select('id')
          .eq('appointment_id', id)
          .maybeSingle();
        
        if (!existingInvoice) {
          // Get service price
          const { data: serviceData } = await supabase
            .from('services')
            .select('id, name, price, price_cents')
            .eq('id', service_id || currentAppointment.service_id)
            .single();
          
          if (serviceData) {
            const price = serviceData.price_cents || (serviceData.price ? serviceData.price * 100 : 0);
            
            // Create draft invoice
            const { data: newSale, error: saleErr } = await supabase
              .from('sales')
              .insert({
                client_id: currentAppointment.client_id,
                appointment_id: id,
                sale_type: 'service',
                status: 'draft',
                subtotal: price,
                discount_total: 0,
                tax_total: 0,
                tip_total: 0,
                gross_total: price,
                net_total: price,
                amount_paid: 0,
                balance_due: price,
              })
              .select()
              .single();
            
            if (newSale && !saleErr) {
              // Create sale item
              await supabase.from('sale_items').insert({
                sale_id: newSale.id,
                item_type: 'service',
                item_id: serviceData.id,
                item_name: serviceData.name,
                quantity: 1,
                unit_price: price,
                discount_amount: 0,
                tax_amount: 0,
                total_price: price,
              });
              console.log('Auto-created draft invoice for appointment:', id);
            }
          }
        }
      } catch (aftercareError) {
        // Don't fail the appointment update if aftercare fails
        console.error('Aftercare trigger error:', aftercareError);
      }
    }

    return NextResponse.json({ appointment: data });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/[id] - Cancel/delete appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const hardDelete = searchParams.get('hard') === 'true';

  try {
    if (hardDelete) {
      // Permanent delete (use with caution)
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ message: 'Appointment deleted' });
    } else {
      // Soft delete - mark as cancelled
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }
        throw error;
      }

      return NextResponse.json({ appointment: data, message: 'Appointment cancelled' });
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
