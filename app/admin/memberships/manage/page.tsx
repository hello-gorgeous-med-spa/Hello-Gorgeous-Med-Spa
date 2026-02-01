'use client';

// ============================================================
// MEMBERSHIP MANAGEMENT PAGE
// Admin view for managing member subscriptions - Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';


interface Membership {
  id: string;
  client_id: string;
  client?: { first_name: string; last_name: string; email: string };
  plan_name: string;
  status: 'active' | 'cancelled' | 'past_due' | 'paused';
  price_per_month: number;
  start_date: string;
  next_billing_date: string;
  benefits: string[];
}

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

const MEMBERSHIP_PLANS = [
  {
    id: 'vip-annual',
    name: 'VIP Annual',
    price: 299,
    billingCycle: 'yearly',
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
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-600',
    past_due: 'bg-red-100 text-red-700',
    paused: 'bg-amber-100 text-amber-700',
  };

  // Fetch memberships from API
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/memberships');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        // Map API response to component format
        const members = (data.memberships || []).map((m: any) => ({
          id: m.id,
          client_id: m.client_id,
          client: {
            first_name: m.client?.user?.first_name,
            last_name: m.client?.user?.last_name,
            email: m.client?.user?.email,
          },
          plan_name: m.plan?.name || 'Unknown Plan',
          status: m.status,
          price_per_month: m.price_locked || m.plan?.price || 0,
          start_date: m.start_date,
          next_billing_date: m.next_billing_date,
          benefits: m.plan?.benefits || [],
        }));
        
        setMemberships(members);
      } catch (err) {
        console.error('Error loading memberships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberships();
  }, []);

  // Stats
  const totalActive = memberships.filter(m => m.status === 'active').length;
  const totalMRR = memberships.filter(m => m.status === 'active').reduce((sum, m) => sum + (m.price_per_month || 0), 0);
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
        <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600">
          + Add Member
        </button>
      </div>

      {/* Connection Status */}
      {false && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          Demo Mode - Connect Supabase to manage memberships
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Active Members</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-green-600">{totalActive}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Monthly Revenue (MRR)</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">${totalMRR.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Past Due</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className={`text-2xl font-bold ${pastDue > 0 ? 'text-red-600' : 'text-gray-900'}`}>{pastDue}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Members</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{memberships.length}</p>
          )}
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
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4"><Skeleton className="w-32 h-4" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-24 h-4" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-20 h-6 rounded-full" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-16 h-4" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-24 h-4" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-16 h-8" /></td>
                  </tr>
                ))
              ) : memberships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    No memberships yet
                    <br />
                    <span className="text-sm">Add your first member to get started</span>
                  </td>
                </tr>
              ) : (
                memberships.map((membership) => (
                  <tr key={membership.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {membership.client?.first_name?.[0]}{membership.client?.last_name?.[0]}
                        </div>
                        <div>
                          <Link
                            href={`/admin/clients/${membership.client_id}`}
                            className="font-medium text-gray-900 hover:text-pink-600"
                          >
                            {membership.client?.first_name} {membership.client?.last_name}
                          </Link>
                          <p className="text-sm text-gray-500">{membership.client?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{membership.plan_name}</p>
                      <p className="text-xs text-gray-500">
                        Since {new Date(membership.start_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[membership.status] || 'bg-gray-100'}`}>
                        {membership.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-gray-900">${membership.price_per_month}/mo</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-gray-600">
                        {membership.next_billing_date ? new Date(membership.next_billing_date).toLocaleDateString() : '-'}
                      </span>
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
                ))
              )}
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
                ${plan.price}<span className="text-sm text-gray-500 font-normal">/{plan.billingCycle}</span>
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
              <h2 className="text-xl font-bold text-gray-900">
                {selectedMembership.client?.first_name} {selectedMembership.client?.last_name}
              </h2>
              <p className="text-gray-500">{selectedMembership.plan_name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[selectedMembership.status] || 'bg-gray-100'}`}>
                    {selectedMembership.status?.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Price</p>
                  <p className="font-semibold text-gray-900">${selectedMembership.price_per_month}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {selectedMembership.start_date ? new Date(selectedMembership.start_date).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Billing</p>
                  <p className="font-medium text-gray-900">
                    {selectedMembership.next_billing_date ? new Date(selectedMembership.next_billing_date).toLocaleDateString() : '-'}
                  </p>
                </div>
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
