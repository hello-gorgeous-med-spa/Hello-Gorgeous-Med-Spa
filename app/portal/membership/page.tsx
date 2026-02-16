'use client';

// ============================================================
// CLIENT PORTAL - MEMBERSHIP
// View membership status and benefits
// ============================================================

import Link from 'next/link';

export default function PortalMembershipPage() {
  const hasMembership = false; // Toggle this to show member view

  if (!hasMembership) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black">VIP Membership</h1>
          <p className="text-black">Exclusive benefits for our most valued clients</p>
        </div>

        {/* Join CTA */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">Become a VIP Member</h2>
          <p className="text-white/90 mb-6">
            Join our exclusive membership program and enjoy special pricing, priority booking, 
            and members-only perks.
          </p>
          <Link
            href="/subscribe"
            className="inline-block px-6 py-3 bg-white text-pink-500 font-semibold rounded-lg hover:bg-white transition-colors"
          >
            View Membership Plans
          </Link>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl border border-black p-6">
          <h3 className="font-semibold text-black mb-4">Membership Benefits</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '💉', title: 'Botox Savings', desc: 'Special member pricing on all injectables' },
              { icon: '📅', title: 'Priority Booking', desc: 'First access to appointments' },
              { icon: '🎁', title: 'Monthly Perks', desc: 'Exclusive discounts and free add-ons' },
              { icon: '💎', title: 'Rewards Points', desc: '2x points on all services' },
              { icon: '📞', title: 'Direct Line', desc: 'Personal concierge access' },
              { icon: '🎉', title: 'Member Events', desc: 'Invite-only experiences' },
            ].map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <span className="text-2xl">{benefit.icon}</span>
                <div>
                  <p className="font-medium text-black">{benefit.title}</p>
                  <p className="text-sm text-black">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Member View
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">My Membership</h1>
        <p className="text-black">Manage your VIP membership</p>
      </div>

      {/* Membership Card */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium opacity-90">VIP GOLD MEMBER</span>
          <span className="text-2xl">👑</span>
        </div>
        <p className="text-2xl font-bold mb-1">Jennifer Martinez</p>
        <p className="text-sm opacity-90">Member since December 2025</p>
        <div className="mt-6 pt-4 border-t border-white/20">
          <p className="text-sm opacity-90">Next billing: February 1, 2026</p>
          <p className="font-semibold">$199/month</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-black p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">2,450</p>
          <p className="text-sm text-black">Reward Points</p>
        </div>
        <div className="bg-white rounded-xl border border-black p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">$340</p>
          <p className="text-sm text-black">Saved This Year</p>
        </div>
        <div className="bg-white rounded-xl border border-black p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">3</p>
          <p className="text-sm text-black">Months Active</p>
        </div>
      </div>

      {/* Manage */}
      <div className="bg-white rounded-xl border border-black p-6">
        <h3 className="font-semibold text-black mb-4">Manage Membership</h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 bg-white hover:bg-white rounded-lg flex items-center justify-between">
            <span>Update Payment Method</span>
            <span>→</span>
          </button>
          <button className="w-full text-left px-4 py-3 bg-white hover:bg-white rounded-lg flex items-center justify-between">
            <span>View Billing History</span>
            <span>→</span>
          </button>
          <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
            Cancel Membership
          </button>
        </div>
      </div>
    </div>
  );
}
