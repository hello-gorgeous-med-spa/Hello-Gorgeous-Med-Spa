import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/regen/formuconnect/webhook
 * Receive order status updates from FormuConnect
 * 
 * FormuConnect will call this endpoint when order status changes:
 * - Order received
 * - Compounding started
 * - Quality check complete
 * - Shipped (with tracking)
 * - Delivered
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[formuconnect-webhook] Received:', JSON.stringify(body, null, 2));

    const { 
      event,
      orderId,
      status,
      trackingNumber,
      carrier,
      shipDate,
      estimatedDelivery,
      metadata,
    } = body;

    // Log the webhook event
    console.log('[formuconnect-webhook] Event:', {
      event,
      orderId,
      status,
      trackingNumber,
    });

    // TODO: Update order status in Supabase
    // TODO: Notify patient via email if shipped
    // TODO: Update patient portal with tracking info

    switch (event) {
      case 'order.received':
        console.log(`[formuconnect] Order ${orderId} received by pharmacy`);
        break;
        
      case 'order.processing':
        console.log(`[formuconnect] Order ${orderId} is being compounded`);
        break;
        
      case 'order.shipped':
        console.log(`[formuconnect] Order ${orderId} shipped via ${carrier}: ${trackingNumber}`);
        // TODO: Send tracking email to patient
        // TODO: Update regen_orders table with tracking
        break;
        
      case 'order.delivered':
        console.log(`[formuconnect] Order ${orderId} delivered`);
        break;
        
      case 'order.cancelled':
        console.log(`[formuconnect] Order ${orderId} cancelled`);
        break;
        
      default:
        console.log(`[formuconnect] Unknown event: ${event}`);
    }

    // Acknowledge receipt
    return NextResponse.json({ 
      received: true,
      orderId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[formuconnect-webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Also handle GET for webhook verification if needed
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  // Some APIs send a verification challenge
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ 
    status: 'FormuConnect webhook endpoint active',
    timestamp: new Date().toISOString(),
  });
}
