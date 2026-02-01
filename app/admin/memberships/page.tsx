'use client';

// ============================================================
// ADMIN MEMBERSHIPS PAGE
// Manage VIP memberships - Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';


// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function AdminMembershipsPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, annual: 0, monthly: 0, revenue: 0 });

  // Fetch members from database
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/clients?limit=500');
        const data = await res.json();
        const clients = data.clients ?? [];
        const total = data.total ?? clients.length;
        setMembers(clients);
        setStats({
          total,
          annual: 0,
          monthly: 0,
          revenue: 0,
        });
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Memberships</h1>
          <p className="text-gray-500">Manage VIP membership program</p>
        </div>
        <Link
          href="/admin/memberships/manage"
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 inline-block"
        >
          + Add Member
        </Link>
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
            <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Annual</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{stats.annual}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Monthly</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{stats.monthly}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Est. Annual Revenue</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-green-600">${stats.revenue.toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* Membership Info */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">💎</span>
          <div>
            <h2 className="text-xl font-bold">VIP Annual Membership</h2>
            <p className="text-purple-100">$299/year - Premium benefits for loyal clients</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-purple-100">Free Service</p>
            <p className="font-semibold">Up to $75</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-purple-100">Botox Discount</p>
            <p className="font-semibold">$10/unit</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-purple-100">Filler Discount</p>
            <p className="font-semibold">15% off</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-purple-100">Priority</p>
            <p className="font-semibold">Booking</p>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">VIP Members</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Member</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Plan</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Since</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-3"><Skeleton className="w-32 h-4" /></td>
                  <td className="px-5 py-3"><Skeleton className="w-20 h-4" /></td>
                  <td className="px-5 py-3"><Skeleton className="w-24 h-4" /></td>
                  <td className="px-5 py-3"><Skeleton className="w-16 h-6 rounded-full" /></td>
                  <td className="px-5 py-3"><Skeleton className="w-16 h-8" /></td>
                </tr>
              ))
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                  No VIP members yet
                  <br />
                  <span className="text-sm">VIP status is assigned in client profiles</span>
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-500">💎</span>
                      <Link 
                        href={`/admin/clients/${member.id}`}
                        className="font-medium text-gray-900 hover:text-pink-600"
                      >
                        {member.user?.first_name || member.first_name} {member.user?.last_name || member.last_name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-900">Annual</td>
                  <td className="px-5 py-3 text-gray-600">
                    {member.created_at ? new Date(member.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/clients/${member.id}`}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
