'use client';

// ============================================================
// PUBLIC MEMBERSHIP SIGNUP PAGE
// Client-facing page to view and purchase memberships
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

const MEMBERSHIP_PLANS = [
  {
    id: 'vip-annual',
    name: 'VIP Annual',
    price: 99,
    billingCycle: 'monthly',
    commitment: '12 months',
    description: 'Our most popular membership for regular clients.',
    benefits: [
      '10% off all services',
      'Free vitamin injection every month ($25 value)',
      'Priority booking - book before non-members',
      'Birthday gift ($50 value)',
      'Exclusive member-only events',
      'Early access to new services',
    ],
    popular: true,
    savings: 'Save $300+/year',
  },
  {
    id: 'glow-monthly',
    name: 'Glow Monthly',
    price: 149,
    billingCycle: 'monthly',
    commitment: 'Cancel anytime',
    description: 'Perfect for skincare enthusiasts.',
    benefits: [
      '$150 treatment credit each month',
      '15% off all skincare products',
      'Free signature facial monthly ($175 value)',
      'Skincare consultations included',
    ],
    popular: false,
    savings: 'Save $200+/year',
  },
  {
    id: 'botox-club',
    name: 'Botox Club',
    price: 199,
    billingCycle: 'monthly',
    commitment: '6 months',
    description: 'For those who love their Botox.',
    benefits: [
      '20 units of Botox included monthly',
      '20% off additional units',
      'Free touch-ups within 14 days',
      'Priority booking with your favorite injector',
      'Exclusive Botox parties invites',
    ],
    popular: false,
    savings: 'Save $400+/year',
  },
];

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleSignup = async (planId: string) => {
    setSelectedPlan(planId);
    setShowSignupForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Create Stripe checkout session
    alert('This would redirect to Stripe Checkout to complete your membership signup.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* Hero */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Become a <span className="text-pink-500">VIP Member</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our exclusive membership program and enjoy premium perks, 
          priority booking, and significant savings on your favorite treatments.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
                plan.popular ? 'ring-2 ring-pink-500 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-pink-500 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-gray-500 mt-1">{plan.description}</p>
                
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/{plan.billingCycle}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{plan.commitment}</p>
                <p className="text-sm text-green-600 font-medium mt-2">{plan.savings}</p>

                <ul className="mt-6 space-y-3">
                  {plan.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-pink-500 mt-0.5">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSignup(plan.id)}
                  className={`w-full mt-8 py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-pink-500 text-white hover:bg-pink-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-medium text-gray-900 cursor-pointer">
                Can I cancel my membership?
              </summary>
              <p className="mt-3 text-gray-600">
                VIP Annual and Botox Club have commitment periods. After the commitment period, 
                you can cancel anytime. Glow Monthly can be cancelled at any time with 30 days notice.
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-medium text-gray-900 cursor-pointer">
                Do unused benefits roll over?
              </summary>
              <p className="mt-3 text-gray-600">
                Monthly treatment credits and included services do not roll over to the next month. 
                Use them or lose them! However, your discounts are always available.
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-medium text-gray-900 cursor-pointer">
                Can I share my membership with family?
              </summary>
              <p className="mt-3 text-gray-600">
                Memberships are individual and non-transferable. However, we offer family discounts 
                when multiple members of the same household join. Ask us for details!
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-medium text-gray-900 cursor-pointer">
                When will I be billed?
              </summary>
              <p className="mt-3 text-gray-600">
                You'll be billed on the same date each month as your signup date. 
                For example, if you sign up on the 15th, you'll be billed on the 15th of each month.
              </p>
            </details>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Have questions? We're here to help.</p>
          <div className="flex justify-center gap-4">
            <a
              href="tel:6306366193"
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800"
            >
              Call (630) 636-6193
            </a>
            <Link
              href="/book"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignupForm && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Join {MEMBERSHIP_PLANS.find(p => p.id === selectedPlan)?.name}
            </h2>
            <p className="text-gray-500 mb-6">
              Enter your details to get started
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly price</span>
                  <span className="font-medium">${MEMBERSHIP_PLANS.find(p => p.id === selectedPlan)?.price}/mo</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Due today</span>
                  <span className="font-bold text-gray-900">${MEMBERSHIP_PLANS.find(p => p.id === selectedPlan)?.price}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
              >
                Continue to Payment
              </button>
              <button
                type="button"
                onClick={() => setShowSignupForm(false)}
                className="w-full py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-4 text-center">
              By signing up, you agree to our membership terms and cancellation policy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
