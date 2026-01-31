import { NextResponse } from "next/server";

// ============================================================
// STRIPE CHECKOUT API - PLACEHOLDER
// ============================================================
// 
// This is a placeholder for Stripe integration. To enable payments:
// 
// 1. Create a Stripe account at https://stripe.com
// 2. Get your API keys from the Stripe Dashboard
// 3. Add these environment variables to your .env.local:
//    - STRIPE_SECRET_KEY=sk_live_xxx (or sk_test_xxx for testing)
//    - STRIPE_PUBLISHABLE_KEY=pk_live_xxx (or pk_test_xxx)
//    - NEXT_PUBLIC_BASE_URL=https://yourdomain.com
// 
// 4. Create Products and Prices in Stripe Dashboard:
//    - Monthly Membership: $49/month (recurring)
//    - Annual Membership: $399/year (recurring)
// 
// 5. Add the Price IDs to environment variables:
//    - STRIPE_MONTHLY_PRICE_ID=price_xxx
//    - STRIPE_ANNUAL_PRICE_ID=price_xxx
// 
// 6. Uncomment the Stripe code below and remove the placeholder logic
// 
// ============================================================

// Membership pricing configuration (keep in sync with SubscribeContent.tsx)
const MEMBERSHIP_PRICING = {
  monthly: {
    price: 49,
    interval: "month",
    freeService: false,
  },
  annual: {
    price: 399,
    interval: "year",
    freeService: true,
    freeServiceValue: 75,
  },
};

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, plan } = body;

    // Validate inputs
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (!plan || !["monthly", "annual"].includes(plan)) {
      return NextResponse.json(
        { error: "Please select a valid plan" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const selectedPlan = MEMBERSHIP_PRICING[plan as keyof typeof MEMBERSHIP_PRICING];

    // ============================================================
    // STRIPE INTEGRATION (uncomment when ready)
    // ============================================================
    // 
    // import Stripe from 'stripe';
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    //   apiVersion: '2023-10-16',
    // });
    //
    // const priceId = plan === 'annual' 
    //   ? process.env.STRIPE_ANNUAL_PRICE_ID 
    //   : process.env.STRIPE_MONTHLY_PRICE_ID;
    //
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   payment_method_types: ['card'],
    //   customer_email: normalizedEmail,
    //   line_items: [
    //     {
    //       price: priceId,
    //       quantity: 1,
    //     },
    //   ],
    //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe?canceled=true`,
    //   metadata: {
    //     plan: plan,
    //     freeService: plan === 'annual' ? 'true' : 'false',
    //   },
    // });
    //
    // return NextResponse.json({
    //   success: true,
    //   checkoutUrl: session.url,
    //   sessionId: session.id,
    // });
    // ============================================================

    // PLACEHOLDER RESPONSE (remove when Stripe is configured)
    // For now, we'll simulate a successful signup without actual payment
    console.log(`[CHECKOUT PLACEHOLDER] ${new Date().toISOString()}`);
    console.log(`  Email: ${normalizedEmail}`);
    console.log(`  Plan: ${plan}`);
    console.log(`  Price: $${selectedPlan.price}/${selectedPlan.interval}`);
    console.log(`  Free Service Eligible: ${selectedPlan.freeService}`);
    
    // Check if Stripe is configured
    if (process.env.STRIPE_SECRET_KEY) {
      // Stripe is configured but we haven't implemented it yet
      // Return an error to remind you to complete the integration
      return NextResponse.json(
        { 
          error: "Stripe is configured but checkout is not fully implemented. Please complete the Stripe integration in /api/checkout/route.ts" 
        },
        { status: 501 }
      );
    }

    // No Stripe configured - return placeholder success
    // This allows testing the flow without actual payments
    return NextResponse.json({
      success: true,
      message: "Checkout placeholder - Stripe not configured yet",
      checkoutUrl: null, // No URL means frontend will show success state
      plan: plan,
      price: selectedPlan.price,
      freeServiceEligible: selectedPlan.freeService,
      // This would normally come from Stripe
      placeholderMemberCode: `NPA-${Date.now().toString(36).toUpperCase()}`,
    });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// Webhook endpoint for Stripe events (uncomment when ready)
// This handles subscription events like successful payments, cancellations, etc.
// 
// export async function POST(req: Request) {
//   const body = await req.text();
//   const signature = req.headers.get('stripe-signature')!;
//   
//   const event = stripe.webhooks.constructEvent(
//     body,
//     signature,
//     process.env.STRIPE_WEBHOOK_SECRET!
//   );
//   
//   switch (event.type) {
//     case 'checkout.session.completed':
//       // Handle successful checkout
//       // - Create member record
//       // - Send welcome email
//       // - If annual, send free service code
//       break;
//     case 'customer.subscription.deleted':
//       // Handle cancellation
//       break;
//   }
// }
