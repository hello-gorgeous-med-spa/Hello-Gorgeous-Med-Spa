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
    const { patient, email, name, items, memo, dueInDays = 7, autoSend = true } = body;

    // Normalize patient info (accept either patient object or direct email/name)
    const patientInfo = patient || { email, name };

    // Validate required fields
    if (!patientInfo?.email) {
      return NextResponse.json(
        { error: 'Patient email is required' },
        { status: 400 }
      );
    }
    
    // Use email as name if name not provided
    const patientName = patientInfo.name || patientInfo.email.split('@')[0];

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one invoice item is required' },
        { status: 400 }
      );
    }

    // Validate and normalize items - ensure amounts are valid numbers
    const normalizedItems = [];
    for (const item of items) {
      const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
      
      if (!item.description || item.description.trim() === '') {
        return NextResponse.json(
          { error: 'Each item must have a description' },
          { status: 400 }
        );
      }
      
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json(
          { error: `Invalid amount for "${item.description}". Please enter a valid dollar amount.` },
          { status: 400 }
        );
      }
      
      normalizedItems.push({
        description: item.description.trim(),
        amount: amount,
        quantity: item.quantity || 1,
      });
    }
    
    // Log for debugging
    console.log('[regen-invoice] Creating invoice:', {
      email: patientInfo.email,
      itemCount: normalizedItems.length,
      total: normalizedItems.reduce((sum, i) => sum + i.amount * i.quantity, 0),
    });

    // Get or create customer
    const customer = await getOrCreateRegenCustomer({
      email: patientInfo.email,
      name: patientName,
      phone: patientInfo.phone,
      metadata: {
        patientId: patientInfo.id,
        program: patientInfo.program,
      },
    });

    // Create and send invoice
    const dueDate = new Date(Date.now() + dueInDays * 24 * 60 * 60 * 1000);
    
    const invoice = await createRegenInvoice({
      customerId: customer.id,
      items: normalizedItems,
      dueDate,
      memo: memo || `Re Gen RX - Thank you for choosing Hello Gorgeous`,
      autoSend,
      metadata: {
        patientEmail: patientInfo.email,
        patientName: patientName,
        program: patientInfo.program || 'general',
      },
    });

    // Calculate total
    const total = normalizedItems.reduce(
      (sum, item) => sum + item.amount * item.quantity,
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
      message: `Invoice sent to ${patientInfo.email}`,
    });
  } catch (error) {
    console.error('Re Gen invoice error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
