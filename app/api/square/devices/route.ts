// ============================================================
// SQUARE DEVICES API
// Get and pair Terminal devices
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getDevicesApiAsync, getSquareClientAsync } from '@/lib/square/client';
import { getActiveConnection, getAccessToken } from '@/lib/square/oauth';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/square/devices
 * List devices for a location (from DB and optionally refresh from Square)
 */
export async function GET(request: NextRequest) {
  try {
    const connection = await getActiveConnection();
    if (!connection) {
      return NextResponse.json(
        { error: 'Square not connected' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId') || connection.location_id;
    const refresh = searchParams.get('refresh') === 'true';
    
    if (!locationId) {
      return NextResponse.json(
        { error: 'Location ID required' },
        { status: 400 }
      );
    }
    
    const supabase = createServerSupabaseClient();
    
    // If refresh requested, fetch from Square API
    if (refresh) {
      const devicesApi = await getDevicesApiAsync();
      if (devicesApi) {
        try {
          // List device codes to find paired devices
          const { result } = await devicesApi.listDeviceCodes({
            locationId,
          });
          
          // Update database with Square data
          const deviceCodes = result.deviceCodes || [];
          for (const code of deviceCodes) {
            if (code.status === 'PAIRED' && code.deviceId) {
              await supabase.from('square_devices').upsert({
                connection_id: connection.id,
                location_id: locationId,
                square_device_id: code.deviceId,
                device_code_id: code.id,
                name: code.name || `Terminal ${code.deviceId.slice(-4)}`,
                product_type: code.productType,
                status: 'paired',
                paired_at: code.pairedAt,
              }, {
                onConflict: 'location_id,square_device_id',
              });
            }
          }
        } catch (apiError) {
          console.error('Error fetching devices from Square:', apiError);
          // Continue to return DB devices even if API fails
        }
      }
    }
    
    // Get devices from database
    const { data: devices, error } = await supabase
      .from('square_devices')
      .select('*')
      .eq('location_id', locationId)
      .order('is_default', { ascending: false })
      .order('name', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      devices: devices || [],
      defaultDeviceId: connection.default_device_id,
    });
    
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/square/devices
 * Create a device pairing code for a new terminal
 */
export async function POST(request: NextRequest) {
  try {
    const connection = await getActiveConnection();
    console.log('[Devices POST] Connection:', connection ? connection.id : 'null');
    
    if (!connection) {
      return NextResponse.json(
        { error: 'Square not connected' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { locationId, name } = body;
    console.log('[Devices POST] Location ID:', locationId);
    
    if (!locationId) {
      return NextResponse.json(
        { error: 'Location ID required' },
        { status: 400 }
      );
    }
    
    // Check if we can get a token
    const token = await getAccessToken();
    console.log('[Devices POST] Token available:', !!token);
    
    // Get client and API
    const client = await getSquareClientAsync();
    console.log('[Devices POST] Client:', client ? 'OK' : 'null');
    
    const devicesApi = await getDevicesApiAsync();
    console.log('[Devices POST] Devices API:', devicesApi ? 'OK' : 'null');
    
    if (!devicesApi) {
      return NextResponse.json(
        { 
          error: 'Square API not available',
          debug: {
            hasConnection: !!connection,
            hasToken: !!token,
            hasClient: !!client,
          }
        },
        { status: 500 }
      );
    }
    
    // Create device code for pairing
    console.log('[Devices POST] Creating device code for location:', locationId);
    const response = await devicesApi.createDeviceCode({
      idempotencyKey: crypto.randomUUID(),
      deviceCode: {
        locationId,
        productType: 'TERMINAL_API',
        name: name || `Terminal ${Date.now().toString(36).toUpperCase()}`,
      },
    });

    const { result } = response;
    
    if (result.errors && result.errors.length > 0) {
      const sqErr = result.errors[0];
      console.error('[Devices POST] Square API error:', sqErr);
      return NextResponse.json(
        { 
          error: 'Failed to create device code',
          details: sqErr.detail || sqErr.code || JSON.stringify(sqErr),
        },
        { status: 400 }
      );
    }
    
    if (!result.deviceCode) {
      return NextResponse.json(
        { error: 'Failed to create device code', details: 'No device code in response' },
        { status: 500 }
      );
    }
    
    const deviceCode = result.deviceCode;
    console.log('[Devices POST] Device code created:', deviceCode.code);
    
    return NextResponse.json({
      deviceCodeId: deviceCode.id,
      code: deviceCode.code, // The code to enter on the terminal
      status: deviceCode.status,
      expiresAt: deviceCode.statusChangedAt, // When the code expires
      name: deviceCode.name,
    });
    
  } catch (error: any) {
    console.error('[Devices POST] createDeviceCode error:', error);
    console.error('[Devices POST] error.errors:', error?.errors);
    console.error('[Devices POST] error.body:', error?.body);
    let details = error?.message || String(error);
    if (error?.errors?.[0]) {
      const sq = error.errors[0];
      details = sq.detail || sq.code || JSON.stringify(sq);
    } else if (error?.body?.errors?.[0]) {
      const sq = error.body.errors[0];
      details = sq.detail || sq.code || JSON.stringify(sq);
    }
    return NextResponse.json(
      { 
        error: 'Failed to create device code',
        details,
      },
      { status: 500 }
    );
  }
}
