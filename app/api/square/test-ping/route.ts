// ============================================================
// SQUARE TEST PING API
// Send a test checkout to verify terminal connectivity
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getTerminalApiAsync } from '@/lib/square/client';
import { getActiveConnection } from '@/lib/square/oauth';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/square/test-ping
 * Send a test checkout to the terminal to verify connectivity
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
    const deviceId = body.device_id || connection.default_device_id;
    
    if (!deviceId) {
      return NextResponse.json(
        { error: 'No device specified and no default device set' },
        { status: 400 }
      );
    }
    
    // Get the Square device ID from our database
    const supabase = createServerSupabaseClient();
    const { data: device } = await supabase
      .from('square_devices')
      .select('square_device_id')
      .eq('id', deviceId)
      .single();
    
    if (!device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }
    
    const terminalApi = await getTerminalApiAsync();
    if (!terminalApi) {
      return NextResponse.json(
        { error: 'Terminal API not available' },
        { status: 500 }
      );
    }
    
    // Create a minimal test checkout ($0.01) that we'll immediately cancel
    // This verifies the terminal is reachable and configured correctly
    const idempotencyKey = crypto.randomUUID();
    
    try {
      const { result } = await terminalApi.createTerminalCheckout({
        idempotencyKey,
        checkout: {
          amountMoney: {
            amount: BigInt(1), // $0.01
            currency: 'USD',
          },
          deviceOptions: {
            deviceId: device.square_device_id,
            skipReceiptScreen: true,
            tipSettings: {
              allowTipping: false,
            },
          },
          paymentType: 'CARD_PRESENT',
          referenceId: 'TEST_PING_' + Date.now(),
          note: 'Test ping - will be cancelled',
        },
      });
      
      if (!result.checkout) {
        return NextResponse.json({
          success: false,
          error: 'Failed to create test checkout',
        });
      }
      
      const checkoutId = result.checkout.id!;
      
      // Immediately cancel the test checkout
      try {
        await terminalApi.cancelTerminalCheckout(checkoutId);
      } catch (cancelError) {
        // If cancel fails (e.g., already processing), that's OK for a test
        console.warn('Could not cancel test checkout:', cancelError);
      }
      
      // Update device last_seen_at
      await supabase
        .from('square_devices')
        .update({ 
          last_seen_at: new Date().toISOString(),
          status: 'paired',
        })
        .eq('id', deviceId);
      
      return NextResponse.json({
        success: true,
        message: 'Terminal is reachable and responsive',
        checkout_id: checkoutId,
        device_id: deviceId,
      });
      
    } catch (checkoutError: any) {
      console.error('Test ping failed:', checkoutError);
      
      // Parse error to give helpful message
      let errorMessage = 'Unknown error';
      if (checkoutError.errors) {
        const errors = checkoutError.errors;
        if (errors.some((e: any) => e.code === 'DEVICE_NOT_ONLINE')) {
          errorMessage = 'Terminal is offline or not connected';
        } else if (errors.some((e: any) => e.code === 'DEVICE_NOT_FOUND')) {
          errorMessage = 'Terminal not found - check device pairing';
        } else {
          errorMessage = errors.map((e: any) => e.detail || e.code).join(', ');
        }
      } else if (checkoutError.message) {
        errorMessage = checkoutError.message;
      }
      
      // Update device status
      await supabase
        .from('square_devices')
        .update({ status: 'offline' })
        .eq('id', deviceId);
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        device_id: deviceId,
      });
    }
    
  } catch (error: any) {
    console.error('Test ping error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to test terminal',
      },
      { status: 500 }
    );
  }
}
