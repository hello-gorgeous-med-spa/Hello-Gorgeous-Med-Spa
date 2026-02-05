// ============================================================
// SQUARE SETTINGS API
// Save selected location and default device
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { getActiveConnection } from '@/lib/square/oauth';
import { getLocationsApiAsync } from '@/lib/square/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/square/settings
 * Get current Square settings
 */
export async function GET(request: NextRequest) {
  try {
    const connection = await getActiveConnection();
    
    if (!connection) {
      return NextResponse.json({
        connected: false,
        connection: null,
      });
    }
    
    const supabase = createServerSupabaseClient();
    
    // Get default device if set
    let defaultDevice = null;
    if (connection.default_device_id) {
      const { data: device } = await supabase
        .from('square_devices')
        .select('*')
        .eq('id', connection.default_device_id)
        .single();
      defaultDevice = device;
    }
    
    return NextResponse.json({
      connected: true,
      connection: {
        id: connection.id,
        merchant_id: connection.merchant_id,
        business_name: connection.business_name,
        location_id: connection.location_id,
        location_name: connection.location_name,
        default_device_id: connection.default_device_id,
        environment: connection.environment,
        status: connection.status,
        connected_at: connection.connected_at,
        last_webhook_at: connection.last_webhook_at,
      },
      defaultDevice,
    });
    
  } catch (error) {
    console.error('Error fetching Square settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/square/settings
 * Update Square settings (location, device)
 */
export async function POST(request: NextRequest) {
  try {
    const connection = await getActiveConnection();
    if (!connection) {
      return NextResponse.json(
        { error: 'Square not connected' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { location_id, default_device_id } = body;
    
    const supabase = createServerSupabaseClient();
    
    // Build update object
    const updates: Record<string, any> = {};
    
    // Validate and set location
    if (location_id !== undefined) {
      if (location_id) {
        // Fetch location name from Square
        const locationsApi = await getLocationsApiAsync();
        if (locationsApi) {
          try {
            const { result } = await locationsApi.retrieveLocation(location_id);
            updates.location_id = location_id;
            updates.location_name = result.location?.name || null;
          } catch (locError) {
            return NextResponse.json(
              { error: 'Invalid location ID' },
              { status: 400 }
            );
          }
        } else {
          updates.location_id = location_id;
        }
      } else {
        updates.location_id = null;
        updates.location_name = null;
      }
    }
    
    // Validate and set default device
    if (default_device_id !== undefined) {
      if (default_device_id) {
        // Verify device exists
        const { data: device } = await supabase
          .from('square_devices')
          .select('id')
          .eq('id', default_device_id)
          .single();
        
        if (!device) {
          return NextResponse.json(
            { error: 'Invalid device ID' },
            { status: 400 }
          );
        }
        
        updates.default_device_id = default_device_id;
        
        // Mark this device as default, unmark others
        await supabase
          .from('square_devices')
          .update({ is_default: false })
          .eq('connection_id', connection.id);
        
        await supabase
          .from('square_devices')
          .update({ is_default: true })
          .eq('id', default_device_id);
      } else {
        updates.default_device_id = null;
      }
    }
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }
    
    // Update connection
    const { data: updatedConnection, error } = await supabase
      .from('square_connections')
      .update(updates)
      .eq('id', connection.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Log to audit
    await supabase.from('audit_log').insert({
      entity_type: 'square_connection',
      entity_id: connection.id,
      action: 'update_settings',
      details: { updates },
    });
    
    return NextResponse.json({
      success: true,
      connection: updatedConnection,
    });
    
  } catch (error) {
    console.error('Error updating Square settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
