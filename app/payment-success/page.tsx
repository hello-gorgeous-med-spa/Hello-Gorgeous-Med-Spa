// ============================================================
// PAYMENT SUCCESS PAGE
// Shown after successful Stripe payment redirect
// ============================================================

import Link from 'next/link';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-black mb-2">Payment Successful!</h1>
        <p className="text-black mb-8">
          Thank you for your payment. A confirmation email has been sent to your email address.
        </p>

        {/* Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-black p-6 mb-8 text-left">
          <h3 className="font-semibold text-black mb-4">What happens next?</h3>
          <ul className="space-y-3 text-sm text-black">
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Your receipt has been emailed to you</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Your appointment is confirmed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Check your client portal for details</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/portal"
            className="block w-full py-3 bg-[#FF2D8E] text-white font-medium rounded-xl hover:bg-black transition-colors"
          >
            Go to Client Portal
          </Link>
          <Link
            href="/"
            className="block w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-white transition-colors"
          >
            Return to Homepage
          </Link>
        </div>

        {/* Support */}
        <p className="text-sm text-black mt-8">
          Questions? Contact us at{' '}
          <a href="tel:+16306366193" className="text-pink-600 hover:underline">
            (630) 636-6193
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
