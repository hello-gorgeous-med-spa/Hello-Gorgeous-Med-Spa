'use client';

// ============================================================
// FINANCING OPTIONS PAGE
// Show available financing and payment plans
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

const FINANCING_OPTIONS = [
  {
    id: 'cherry',
    name: 'Cherry',
    logo: '🍒',
    tagline: 'Apply in minutes, get approved instantly',
    features: [
      'No hard credit check to apply',
      'Instant approval decisions',
      'Plans from 3-24 months',
      'Rates as low as 0% APR',
      'Pay off early with no penalty',
    ],
    applyUrl: 'https://withcherry.com/apply',
    popular: true,
  },
  {
    id: 'carecredit',
    name: 'CareCredit',
    logo: '💳',
    tagline: 'The healthcare credit card',
    features: [
      '0% promotional financing available',
      'Use at 250,000+ locations',
      'Special financing on purchases $200+',
      'Accepted nationwide',
      'Manage payments in app',
    ],
    applyUrl: 'https://www.carecredit.com/apply',
    popular: false,
  },
  {
    id: 'affirm',
    name: 'Affirm',
    logo: '✓',
    tagline: 'Pay over time, your way',
    features: [
      'Split into 4 payments (0% APR)',
      'Or monthly payments 6-36 months',
      'No hidden fees',
      'See your rate without impacting credit',
      'Easy checkout integration',
    ],
    applyUrl: 'https://www.affirm.com',
    popular: false,
  },
];

const PAYMENT_EXAMPLES = [
  { total: 500, monthly: 45, months: 12, treatment: 'Botox Session' },
  { total: 1200, monthly: 100, months: 12, treatment: 'Filler Package' },
  { total: 2500, monthly: 105, months: 24, treatment: 'Full Face Refresh' },
  { total: 4000, monthly: 167, months: 24, treatment: 'Body Contouring' },
];

export default function FinancingPage() {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [selectedMonths, setSelectedMonths] = useState(12);

  const monthlyPayment = Math.ceil(selectedAmount / selectedMonths);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Look Gorgeous Now, <span className="text-green-600">Pay Over Time</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Don't let budget hold you back from feeling your best. 
          We offer flexible financing options with instant approval.
        </p>
        
        {/* Quick Calculator */}
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Payment Estimator</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Treatment Cost</label>
              <input
                type="range"
                min="200"
                max="5000"
                step="100"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(parseInt(e.target.value))}
                className="w-full accent-pink-500"
              />
              <p className="text-2xl font-bold text-gray-900">${selectedAmount.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Payment Term</label>
              <div className="flex gap-2">
                {[3, 6, 12, 18, 24].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMonths(m)}
                    className={`flex-1 py-2 rounded-lg font-medium ${
                      selectedMonths === m
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {m}mo
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-gray-600">Estimated Monthly Payment</p>
              <p className="text-4xl font-bold text-green-600">
                ${monthlyPayment}<span className="text-lg text-gray-400">/mo</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">*Actual rate depends on credit approval</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financing Options */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Choose Your Financing Partner
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {FINANCING_OPTIONS.map((option) => (
            <div
              key={option.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                option.popular ? 'ring-2 ring-green-500 relative' : ''
              }`}
            >
              {option.popular && (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className={`p-6 ${option.popular ? 'pt-10' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{option.logo}</span>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">{option.name}</h3>
                    <p className="text-sm text-gray-500">{option.tagline}</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={option.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3 rounded-lg font-medium text-center ${
                    option.popular
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Examples */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="font-bold text-xl text-gray-900 mb-6 text-center">
            Sample Payment Plans
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Treatment</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-medium">Total</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-medium">Term</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-medium">Monthly</th>
                </tr>
              </thead>
              <tbody>
                {PAYMENT_EXAMPLES.map((ex, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{ex.treatment}</td>
                    <td className="py-4 px-4 text-center text-gray-700">${ex.total.toLocaleString()}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{ex.months} months</td>
                    <td className="py-4 px-4 text-center font-bold text-green-600">${ex.monthly}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            *Payment amounts are estimates. Actual rates vary based on credit approval and selected financing option.
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="font-bold text-xl text-gray-900 mb-6 text-center">Financing FAQ</h3>
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-medium text-gray-900 cursor-pointer">
                Will applying hurt my credit score?
              </summary>
              <p className="mt-3 text-gray-600">
                Cherry and Affirm perform a soft credit check that doesn't impact your score. 
                CareCredit does a hard inquiry, but only after you choose to proceed with the full application.
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-medium text-gray-900 cursor-pointer">
                How quickly can I get approved?
              </summary>
              <p className="mt-3 text-gray-600">
                Most applications are approved within 2 minutes. You can apply right here in our office 
                and use your financing immediately for your treatment.
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-medium text-gray-900 cursor-pointer">
                What if I want to pay off early?
              </summary>
              <p className="mt-3 text-gray-600">
                All our financing partners allow early payoff with no penalties. Pay off your balance 
                whenever you're ready at no extra cost.
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-medium text-gray-900 cursor-pointer">
                Can I use financing for any treatment?
              </summary>
              <p className="mt-3 text-gray-600">
                Yes! Financing can be used for any service or package at Hello Gorgeous Med Spa, 
                including injectables, facials, body treatments, and skincare products.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-green-100 mb-8 text-lg">
            Apply now and you could be approved in minutes. Our team is here to help you through the process.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://withcherry.com/apply"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-green-50"
            >
              Apply with Cherry
            </a>
            <Link
              href="/book"
              className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
