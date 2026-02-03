// ============================================================
// STRIPE CHECKOUT - DEPRECATED
// ============================================================
// 
// ⚠️  STRIPE IS NO LONGER USED FOR HELLO GORGEOUS MED SPA
// 
// Decision: FINAL (Owner Decision)
// Primary Processor: SQUARE
// 
// This component shows a deprecation notice.
// Use Square Web Payments SDK for card processing.
// ============================================================

'use client';

export default function StripeCheckout() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-amber-800">Payment Method Unavailable</h3>
      <p className="text-amber-700 mt-2">
        This payment method is no longer available. 
        Please use Square for card payments.
      </p>
      <p className="text-sm text-amber-600 mt-4">
        Contact staff for assistance with payment.
      </p>
    </div>
  );
}

// Also export as named for any imports
export { StripeCheckout };
