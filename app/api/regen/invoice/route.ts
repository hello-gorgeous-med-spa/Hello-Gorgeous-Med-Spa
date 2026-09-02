import { NextRequest, NextResponse } from 'next/server';
import {
  getOrCreateRegenCustomer,
  createRegenInvoice,
  isRegenStripeConfigured,
} from '@/lib/regen-stripe';

// POST /api/regen/invoice
// Create and send an invoice to a Re Gen patient
export async function POST(request: NextRequest) {
  try {
    // Check Stripe is configured
    if (!isRegenStripeConfigured()) {
      return NextResponse.json(
        { error: 'Re Gen Stripe not configured. Add REGEN_STRIPE_SECRET_KEY to environment.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { patient, items, memo, dueInDays = 7 } = body;

    // Validate required fields
    if (!patient?.email || !patient?.name) {
      return NextResponse.json(
        { error: 'Patient email and name are required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one invoice item is required' },
        { status: 400 }
      );
    }

    // Validate items have description and amount
    for (const item of items) {
      if (!item.description || typeof item.amount !== 'number' || item.amount <= 0) {
        return NextResponse.json(
          { error: 'Each item must have a description and positive amount' },
          { status: 400 }
        );
      }
    }

    // Get or create customer
    const customer = await getOrCreateRegenCustomer({
      email: patient.email,
      name: patient.name,
      phone: patient.phone,
      metadata: {
        patientId: patient.id,
        program: patient.program,
      },
    });

    // Create and send invoice
    const dueDate = new Date(Date.now() + dueInDays * 24 * 60 * 60 * 1000);
    
    const invoice = await createRegenInvoice({
      customerId: customer.id,
      items: items.map((item: { description: string; amount: number; quantity?: number }) => ({
        description: item.description,
        amount: item.amount,
        quantity: item.quantity || 1,
      })),
      dueDate,
      memo: memo || `Re Gen RX - Thank you for choosing Hello Gorgeous`,
      autoSend: true,
      metadata: {
        patientEmail: patient.email,
        patientName: patient.name,
        program: patient.program || 'general',
      },
    });

    // Calculate total
    const total = items.reduce(
      (sum: number, item: { amount: number; quantity?: number }) => 
        sum + item.amount * (item.quantity || 1),
      0
    );

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        number: invoice.number,
        status: invoice.status,
        total: total,
        hostedUrl: invoice.hosted_invoice_url,
        pdfUrl: invoice.invoice_pdf,
        dueDate: dueDate.toISOString(),
      },
      customer: {
        id: customer.id,
        email: customer.email,
      },
      message: `Invoice sent to ${patient.email}`,
    });
  } catch (error) {
    console.error('Re Gen invoice error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
