import { NextRequest, NextResponse } from 'next/server';
import {
  createRegenPaymentLink,
  createQuickPaymentLink,
  listRegenPaymentLinks,
  isRegenStripeConfigured,
  REGEN_QUICK_PRODUCTS,
} from '@/lib/regen-stripe';

// POST /api/regen/payment-link
// Create a shareable payment link
export async function POST(request: NextRequest) {
  try {
    if (!isRegenStripeConfigured()) {
      return NextResponse.json(
        { error: 'Re Gen Stripe not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { productKey, custom, name, amount, description, patientName, patientEmail, program } = body;

    // Normalize: accept either custom object or direct name/amount
    const customProduct = custom || (name && amount ? { name, amount, description } : null);

    let result: { url: string; id: string };

    if (productKey && productKey in REGEN_QUICK_PRODUCTS) {
      // Quick link for predefined product
      result = await createQuickPaymentLink(
        productKey as keyof typeof REGEN_QUICK_PRODUCTS,
        {
          patientName: patientName || '',
          patientEmail: patientEmail || '',
          program: program || '',
        }
      );
    } else if (customProduct) {
      // Custom payment link
      if (!customProduct.name || typeof customProduct.amount !== 'number' || customProduct.amount <= 0) {
        return NextResponse.json(
          { error: 'Payment link requires name and positive amount' },
          { status: 400 }
        );
      }

      result = await createRegenPaymentLink({
        name: customProduct.name,
        amount: customProduct.amount,
        description: customProduct.description,
        collectPhone: true,
        metadata: {
          patientName: patientName || '',
          patientEmail: patientEmail || '',
          program: program || '',
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Provide name and amount for payment link' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      id: result.id,
      paymentLink: {
        id: result.id,
        url: result.url,
      },
    });
  } catch (error) {
    console.error('Payment link error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment link' },
      { status: 500 }
    );
  }
}

// GET /api/regen/payment-link
// List active payment links
export async function GET() {
  try {
    if (!isRegenStripeConfigured()) {
      return NextResponse.json(
        { error: 'Re Gen Stripe not configured' },
        { status: 503 }
      );
    }

    const links = await listRegenPaymentLinks(50);

    return NextResponse.json({
      success: true,
      links,
    });
  } catch (error) {
    console.error('List payment links error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list payment links' },
      { status: 500 }
    );
  }
}
