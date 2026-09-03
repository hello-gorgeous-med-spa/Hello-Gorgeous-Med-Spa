import { NextRequest, NextResponse } from 'next/server';
import { 
  isFormuConnectConfigured, 
  submitFormuConnectOrder,
  getFormuConnectOrderStatus,
  type FormuConnectOrder 
} from '@/lib/formuconnect';

/**
 * POST /api/regen/formuconnect/order
 * Submit a new prescription order to FormuConnect
 */
export async function POST(request: NextRequest) {
  if (!isFormuConnectConfigured()) {
    return NextResponse.json({
      success: false,
      error: 'FormuConnect API not configured',
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const { patient, prescriptions } = body;
    
    if (!patient || !patient.firstName || !patient.lastName || !patient.address) {
      return NextResponse.json({
        success: false,
        error: 'Patient information required (firstName, lastName, address)',
      }, { status: 400 });
    }

    if (!prescriptions || !Array.isArray(prescriptions) || prescriptions.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'At least one prescription required',
      }, { status: 400 });
    }

    // Build order object
    const order: FormuConnectOrder = {
      patient: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        email: patient.email,
        phone: patient.phone,
        address: {
          street1: patient.address.street1,
          street2: patient.address.street2,
          city: patient.address.city,
          state: patient.address.state,
          zip: patient.address.zip,
        },
      },
      prescriptions: prescriptions.map((rx: {
        productId: string;
        productName?: string;
        quantity: number;
        sig?: string;
        refills?: number;
        daysSupply?: number;
      }) => ({
        productId: rx.productId,
        productName: rx.productName,
        quantity: rx.quantity || 1,
        sig: rx.sig,
        refills: rx.refills || 0,
        daysSupply: rx.daysSupply || 30,
      })),
      prescriberId: body.prescriberId,
      notes: body.notes,
      metadata: {
        regenOrderId: body.regenOrderId,
        patientEmail: patient.email,
        ...body.metadata,
      },
    };

    // Submit to FormuConnect
    const result = await submitFormuConnectOrder(order);

    console.log('[formuconnect] Order submitted:', {
      orderId: result.orderId,
      patientEmail: patient.email,
      prescriptionCount: prescriptions.length,
    });

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      status: result.status,
      message: result.message || 'Order submitted successfully',
      estimatedShipDate: result.estimatedShipDate,
    });

  } catch (error) {
    console.error('[formuconnect] Order submission error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit order',
    }, { status: 500 });
  }
}

/**
 * GET /api/regen/formuconnect/order?orderId=xxx
 * Get order status from FormuConnect
 */
export async function GET(request: NextRequest) {
  if (!isFormuConnectConfigured()) {
    return NextResponse.json({
      success: false,
      error: 'FormuConnect API not configured',
    }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({
      success: false,
      error: 'orderId parameter required',
    }, { status: 400 });
  }

  try {
    const status = await getFormuConnectOrderStatus(orderId);

    return NextResponse.json({
      success: true,
      ...status,
    });

  } catch (error) {
    console.error('[formuconnect] Status check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get order status',
    }, { status: 500 });
  }
}
