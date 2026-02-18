// ============================================================
// SQUARE DEVICES API
// Get and pair Terminal devices
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getDevicesApiAsync, getSquareClientAsync, createSquareClientWithToken } from '@/lib/square/client';
import { getActiveConnection, getAccessToken } from '@/lib/square/oauth';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/hgos/supabase';

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
    
    const supabase = createAdminSupabaseClient() ?? createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }
    
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
 * - If square_device_id is provided: add device by Square ID (for already-paired terminals)
 * - Otherwise: create a device pairing code for a new terminal
 */
export async function POST(request: NextRequest) {
  let locationId: string | null = null;
  let name: string | undefined;
  try {
    const connection = await getActiveConnection();
    if (!connection) {
      return NextResponse.json(
        { error: 'Square not connected' },
        { status: 401 }
      );
    }
    
    const body = await request.json().catch(() => ({}));
    locationId = body?.locationId || connection.location_id;
    name = body?.name;
    
    // Add device by Square ID (already paired via Square app)
    const squareDeviceId = typeof body?.square_device_id === 'string'
      ? body.square_device_id.trim()
      : null;
    if (squareDeviceId) {
      if (!locationId) {
        return NextResponse.json(
          { error: 'Location required. Select a location first.' },
          { status: 400 }
        );
      }
      const supabase = createAdminSupabaseClient() ?? createServerSupabaseClient();
      if (!supabase) {
        return NextResponse.json(
          { error: 'Database not configured', details: 'Missing Supabase credentials' },
          { status: 500 }
        );
      }
      const displayName = name || `Terminal ${squareDeviceId.slice(-4)}`;
      const row = {
        connection_id: connection.id,
        location_id: locationId,
        square_device_id: squareDeviceId,
        name: displayName,
        product_type: 'TERMINAL_API',
        status: 'paired',
        paired_at: new Date().toISOString(),
      };

      let device: { id: string } | null = null;
      const { data: upserted, error: upsertError } = await supabase
        .from('square_devices')
        .upsert(row, { onConflict: 'location_id,square_device_id' })
        .select()
        .single();

      if (upsertError) {
        const { data: inserted, error: insertError } = await supabase
          .from('square_devices')
          .insert(row)
          .select()
          .single();
        if (insertError) {
          if (insertError.code === '23505') {
            const { data: existing } = await supabase
              .from('square_devices')
              .select('*')
              .eq('location_id', locationId)
              .eq('square_device_id', squareDeviceId)
              .single();
            device = existing;
          }
          if (!device) {
            const err = insertError || upsertError;
            const msg = err?.message || 'Unknown database error';
            const code = err?.code ? ` (code: ${err.code})` : '';
            console.error('[Add device by ID]', upsertError, insertError);
            return NextResponse.json(
              { error: 'Failed to add device', details: `${msg}${code}` },
              { status: 500 }
            );
          }
        } else {
          device = inserted;
        }
      } else {
        device = upserted;
      }

      const setAsDefault = body?.set_as_default !== false;
      if (setAsDefault && device) {
        await supabase.from('square_devices').update({ is_default: false }).eq('connection_id', connection.id);
        await supabase.from('square_devices').update({ is_default: true }).eq('id', device.id);
        await supabase.from('square_connections').update({ default_device_id: device.id }).eq('id', connection.id);
      }

      return NextResponse.json({
        device,
        added: true,
        message: 'Device added successfully',
      });
    }
    
    if (!locationId) {
      return NextResponse.json(
        { error: 'Location ID required' },
        { status: 400 }
      );
    }
    
    // Prefer personal access token for device pairing (has full access, no scope issues)
    const personalToken = process.env.SQUARE_ACCESS_TOKEN;
    let devicesApi: any = null;

    if (personalToken) {
      const personalClient = await createSquareClientWithToken(personalToken);
      devicesApi = personalClient?.devicesApi;
    }
    if (!devicesApi) {
      devicesApi = await getDevicesApiAsync();
    }

    if (!devicesApi) {
      return NextResponse.json(
        { 
          error: 'Square API not available. Add SQUARE_ACCESS_TOKEN to Vercel (Production token from Square Developer Console > Credentials).',
        },
        { status: 500 }
      );
    }

    const idempotencyKey = crypto.randomUUID();
    const deviceName = name || `Terminal ${Date.now().toString(36).toUpperCase()}`;
    const response = await devicesApi.createDeviceCode({
      idempotencyKey,
      deviceCode: { locationId, productType: 'TERMINAL_API', name: deviceName },
    });

    const result = response?.result;
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to create device code', details: 'Empty response from Square API' },
        { status: 500 }
      );
    }

    if (result.errors && result.errors.length > 0) {
      const sqErr = result.errors[0];
      let detail = sqErr.detail || sqErr.code || JSON.stringify(sqErr);
      const isAuthErr = String(detail).toLowerCase().includes('authorized');
      if (isAuthErr && !personalToken) {
        detail += ' Add SQUARE_ACCESS_TOKEN to Vercel (Production token from Square Developer Console > Credentials).';
      }
      return NextResponse.json(
        { error: 'Failed to create device code', details: detail },
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
    return NextResponse.json({
      deviceCodeId: deviceCode.id,
      code: deviceCode.code,
      status: deviceCode.status,
      expiresAt: deviceCode.statusChangedAt,
      name: deviceCode.name,
    });
    
  } catch (error: any) {
    console.error('[Devices POST] createDeviceCode error:', error);
    let details = error?.message || String(error);
    if (error?.errors?.[0]) {
      const sq = error.errors[0];
      details = sq.detail || sq.code || JSON.stringify(sq);
    } else if (error?.body?.errors?.[0]) {
      const sq = error.body.errors[0];
      details = sq.detail || sq.code || JSON.stringify(sq);
    }
    return NextResponse.json(
      { error: 'Failed to create device code', details },
      { status: 500 }
    );
  }
}
