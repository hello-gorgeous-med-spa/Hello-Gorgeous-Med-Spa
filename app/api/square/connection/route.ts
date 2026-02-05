// ============================================================
// SQUARE CONNECTION API
// Get connection status, disconnect
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getActiveConnection, disconnectSquare } from '@/lib/square/oauth';
import { getMerchantsApiAsync } from '@/lib/square/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/square/connection
 * Get current connection status
 */
export async function GET(request: NextRequest) {
  try {
    const connection = await getActiveConnection();
    
    if (!connection) {
      return NextResponse.json({
        connected: false,
      });
    }
    
    // Optionally verify connection is still valid by calling Square API
    const verify = request.nextUrl.searchParams.get('verify') === 'true';
    
    if (verify) {
      const merchantsApi = await getMerchantsApiAsync();
      if (merchantsApi) {
        try {
          const { result } = await merchantsApi.retrieveMerchant(connection.merchant_id);
          // Connection is valid
          return NextResponse.json({
            connected: true,
            verified: true,
            connection: {
              id: connection.id,
              merchant_id: connection.merchant_id,
              business_name: result.merchant?.businessName || connection.business_name,
              location_id: connection.location_id,
              location_name: connection.location_name,
              environment: connection.environment,
              status: connection.status,
              connected_at: connection.connected_at,
              last_webhook_at: connection.last_webhook_at,
            },
          });
        } catch (apiError) {
          // Connection may be invalid
          return NextResponse.json({
            connected: true,
            verified: false,
            error: 'Could not verify connection with Square',
            connection: {
              id: connection.id,
              merchant_id: connection.merchant_id,
              business_name: connection.business_name,
              status: 'unverified',
            },
          });
        }
      }
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
    });
    
  } catch (error) {
    console.error('Error fetching connection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connection status' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/square/connection
 * Disconnect Square account
 */
export async function DELETE(request: NextRequest) {
  try {
    const connection = await getActiveConnection();
    
    if (!connection) {
      return NextResponse.json(
        { error: 'No active Square connection' },
        { status: 404 }
      );
    }
    
    const success = await disconnectSquare(connection.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to disconnect' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Square account disconnected',
    });
    
  } catch (error) {
    console.error('Error disconnecting Square:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect' },
      { status: 500 }
    );
  }
}
