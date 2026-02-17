// ============================================================
// SQUARE DEVICE MANAGEMENT API
// Update or delete individual devices
// ============================================================
// NOTE: DELETE removes device from OUR database only.
// It does NOT unpair the device in Square (API may not support this).
// To unpair from Square, user must use Square Dashboard.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { getActiveConnection } from '@/lib/square/oauth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/square/devices/[id]
 * Get a specific device
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connection = await getActiveConnection();
    if (!connection) {
      return NextResponse.json(
        { error: 'Square not connected' },
        { status: 401 }
      );
    }
    
    const supabase = createServerSupabaseClient();
    
    const { data: device, error } = await supabase
      .from('square_devices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ device });
    
  } catch (error) {
    console.error('Error fetching device:', error);
    return NextResponse.json(
      { error: 'Failed to fetch device' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/square/devices/[id]
 * Update device (set default, rename, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connection = await getActiveConnection();
    if (!connection) {
      return NextResponse.json(
        { error: 'Square not connected' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { is_default, name, status } = body;
    
    const supabase = createServerSupabaseClient();
    
    // Build update object
    const updates: Record<string, any> = {};
    if (typeof is_default === 'boolean') updates.is_default = is_default;
    if (name) updates.name = name;
    if (status) updates.status = status;
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }
    
    // Update device
    const { data: device, error } = await supabase
      .from('square_devices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // If setting as default, also update the connection's default_device_id
    if (is_default === true && device) {
      await supabase
        .from('square_connections')
        .update({ default_device_id: id })
        .eq('id', connection.id);
    }
    
    return NextResponse.json({ device });
    
  } catch (error) {
    console.error('Error updating device:', error);
    return NextResponse.json(
      { error: 'Failed to update device' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/square/devices/[id]
 * Remove a device from OUR database only
 * 
 * IMPORTANT: This does NOT unpair the device in Square.
 * Square API may not support programmatic unpair.
 * To fully unpair, user must use Square Dashboard.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connection = await getActiveConnection();
    if (!connection) {
      return NextResponse.json(
        { error: 'Square not connected' },
        { status: 401 }
      );
    }
    
    const supabase = createServerSupabaseClient();
    
    // Remove the device
    const { error } = await supabase
      .from('square_devices')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    // If this was the default device, clear it from the connection
    if (connection.default_device_id === id) {
      await supabase
        .from('square_connections')
        .update({ default_device_id: null })
        .eq('id', connection.id);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting device:', error);
    return NextResponse.json(
      { error: 'Failed to delete device' },
      { status: 500 }
    );
  }
}
