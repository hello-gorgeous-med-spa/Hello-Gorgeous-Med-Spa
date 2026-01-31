'use client';

// ============================================================
// MEMBERSHIP MANAGEMENT PAGE
// Admin view for managing member subscriptions
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface Membership {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'past_due' | 'paused';
  pricePerMonth: number;
  startDate: string;
  nextBillingDate: string;
  stripeSubscriptionId?: string;
  benefits: string[];
  totalSpent: number;
  monthsActive: number;
}

// Mock data
const MOCK_MEMBERSHIPS: Membership[] = [
  {
    id: 'm1',
    clientId: 'c1',
    clientName: 'Jennifer Martinez',
    clientEmail: 'jennifer@email.com',
    planId: 'vip-annual',
    planName: 'VIP Annual',
    status: 'active',
    pricePerMonth: 99,
    startDate: '2025-06-15',
    nextBillingDate: '2026-02-15',
    benefits: ['10% off all services', 'Free vitamin injection monthly', 'Priority booking', 'Birthday gift'],
    totalSpent: 891,
    monthsActive: 9,
  },
  {
    id: 'm2',
    clientId: 'c2',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@email.com',
    planId: 'glow-monthly',
    planName: 'Glow Monthly',
    status: 'active',
    pricePerMonth: 149,
    startDate: '2025-11-01',
    nextBillingDate: '2026-02-01',
    benefits: ['$150 treatment credit', '15% off products', 'Free facial monthly'],
    totalSpent: 447,
    monthsActive: 3,
  },
  {
    id: 'm3',
    clientId: 'c3',
    clientName: 'Michelle Williams',
    clientEmail: 'michelle@email.com',
    planId: 'vip-annual',
    planName: 'VIP Annual',
    status: 'past_due',
    pricePerMonth: 99,
    startDate: '2025-08-01',
    nextBillingDate: '2026-01-01',
    benefits: ['10% off all services', 'Free vitamin injection monthly', 'Priority booking', 'Birthday gift'],
    totalSpent: 495,
    monthsActive: 5,
  },
];

const MEMBERSHIP_PLANS = [
  {
    id: 'vip-annual',
    name: 'VIP Annual',
    price: 99,
    billingCycle: 'monthly',
    commitment: '12 months',
    benefits: [
      '10% off all services',
      'Free vitamin injection monthly',
      'Priority booking',
      'Birthday gift ($50 value)',
      'Exclusive member events',
    ],
  },
  {
    id: 'glow-monthly',
    name: 'Glow Monthly',
    price: 149,
    billingCycle: 'monthly',
    commitment: 'month-to-month',
    benefits: [
      '$150 treatment credit (use it or lose it)',
      '15% off skincare products',
      'Free signature facial monthly',
    ],
  },
  {
    id: 'botox-club',
    name: 'Botox Club',
    price: 199,
    billingCycle: 'monthly',
    commitment: '6 months',
    benefits: [
      '20 units Botox monthly',
      '20% off additional units',
      'Free touch-ups within 14 days',
    ],
  },
];

export default function MembershipManagePage() {
  const [memberships, setMemberships] = useState(MOCK_MEMBERSHIPS);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-600',
    past_due: 'bg-red-100 text-red-700',
    paused: 'bg-amber-100 text-amber-700',
  };

  // Stats
  const totalActive = memberships.filter(m => m.status === 'active').length;
  const totalMRR = memberships.filter(m => m.status === 'active').reduce((sum, m) => sum + m.pricePerMonth, 0);
  const pastDue = memberships.filter(m => m.status === 'past_due').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/memberships" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← Back to Memberships
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Membership Management</h1>
          <p className="text-gray-500">Manage active subscriptions and member benefits</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
        >
          + Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Active Members</p>
          <p className="text-2xl font-bold text-green-600">{totalActive}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Monthly Revenue (MRR)</p>
          <p className="text-2xl font-bold text-gray-900">${totalMRR.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Past Due</p>
          <p className={`text-2xl font-bold ${pastDue > 0 ? 'text-red-600' : 'text-gray-900'}`}>{pastDue}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Avg Lifetime Value</p>
          <p className="text-2xl font-bold text-gray-900">
            ${Math.round(memberships.reduce((sum, m) => sum + m.totalSpent, 0) / memberships.length).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Member</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Plan</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Price</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Next Billing</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Months</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {memberships.map((membership) => (
                <tr key={membership.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {membership.clientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <Link
                          href={`/admin/clients/${membership.clientId}`}
                          className="font-medium text-gray-900 hover:text-pink-600"
                        >
                          {membership.clientName}
                        </Link>
                        <p className="text-sm text-gray-500">{membership.clientEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{membership.planName}</p>
                    <p className="text-xs text-gray-500">Since {new Date(membership.startDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[membership.status]}`}>
                      {membership.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-gray-900">${membership.pricePerMonth}/mo</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-gray-600">
                      {new Date(membership.nextBillingDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-gray-900">{membership.monthsActive}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedMembership(membership)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Available Membership Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900">{plan.name}</h3>
              <p className="text-2xl font-bold text-pink-500 mt-1">
                ${plan.price}<span className="text-sm text-gray-500 font-normal">/mo</span>
              </p>
              <p className="text-xs text-gray-500 mb-3">{plan.commitment}</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {plan.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMembership && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{selectedMembership.clientName}</h2>
              <p className="text-gray-500">{selectedMembership.planName}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[selectedMembership.status]}`}>
                    {selectedMembership.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Price</p>
                  <p className="font-semibold text-gray-900">${selectedMembership.pricePerMonth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">{new Date(selectedMembership.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Billing</p>
                  <p className="font-medium text-gray-900">{new Date(selectedMembership.nextBillingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="font-semibold text-green-600">${selectedMembership.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Months Active</p>
                  <p className="font-medium text-gray-900">{selectedMembership.monthsActive}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Benefits</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {selectedMembership.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 space-y-2">
              {selectedMembership.status === 'active' && (
                <>
                  <button className="w-full px-4 py-2 bg-amber-100 text-amber-700 font-medium rounded-lg hover:bg-amber-200">
                    Pause Membership
                  </button>
                  <button className="w-full px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200">
                    Cancel Membership
                  </button>
                </>
              )}
              {selectedMembership.status === 'past_due' && (
                <button className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600">
                  Retry Payment
                </button>
              )}
              {selectedMembership.status === 'paused' && (
                <button className="w-full px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600">
                  Resume Membership
                </button>
              )}
              <button
                onClick={() => setSelectedMembership(null)}
                className="w-full px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
