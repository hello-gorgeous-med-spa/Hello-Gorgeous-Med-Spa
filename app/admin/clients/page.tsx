'use client';

// ============================================================
// ADMIN CLIENTS PAGE
// Full client management - Connected to Live Data
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useClients } from '@/lib/supabase/hooks';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import type { Client } from '@/lib/supabase/types';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function AdminClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterMembership, setFilterMembership] = useState('all');
  const [sortBy, setSortBy] = useState('lastName');
  const [page, setPage] = useState(1);
  const [totalStats, setTotalStats] = useState({ total: 0, vip: 0, revenue: 0, newThisMonth: 0 });
  const pageSize = 25;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch clients with search
  const { clients, loading, error, total, refetch } = useClients(debouncedSearch, pageSize);

  // Fetch stats
  useEffect(() => {
    async function fetchStats() {
      if (!isSupabaseConfigured()) {
        setTotalStats({ total: 3199, vip: 127, revenue: 485000, newThisMonth: 47 });
        return;
      }

      try {
        // Get total count
        const { count: totalCount } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });

        // Get VIP count
        const { count: vipCount } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('is_vip', true);

        // Get total revenue
        const { data: revenueData } = await supabase
          .from('clients')
          .select('total_spent');
        
        const totalRevenue = revenueData?.reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0;

        // Get new clients this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const { count: newCount } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString());

        setTotalStats({
          total: totalCount || 0,
          vip: vipCount || 0,
          revenue: totalRevenue,
          newThisMonth: newCount || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    }

    fetchStats();
  }, []);

  // Sort and filter clients locally
  const displayClients = useMemo(() => {
    let filtered = [...clients];

    // Filter by membership
    if (filterMembership === 'active') {
      filtered = filtered.filter(c => c.is_vip);
    } else if (filterMembership === 'none') {
      filtered = filtered.filter(c => !c.is_vip);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'lastName':
          return (a.last_name || '').localeCompare(b.last_name || '');
        case 'lastVisit':
          return (b.last_visit_at || '').localeCompare(a.last_visit_at || '');
        case 'totalSpent':
          return (b.total_spent || 0) - (a.total_spent || 0);
        case 'totalVisits':
          return (b.total_visits || 0) - (a.total_visits || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [clients, filterMembership, sortBy]);

  // Export handler
  const handleExport = () => {
    alert('Export functionality will download all client data as CSV. (Connect to backend to enable)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500">Manage client records and profiles</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Export
          </button>
          <Link
            href="/admin/clients/new"
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            + New Client
          </Link>
        </div>
      </div>

      {/* Connection Status */}
      {!isSupabaseConfigured() && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          Demo Mode - Connect Supabase to see real client data
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error loading clients</p>
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={refetch} className="mt-2 text-sm text-red-600 underline">
            Try again
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Clients</p>
          <p className="text-2xl font-bold text-gray-900">{totalStats.total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">VIP Members</p>
          <p className="text-2xl font-bold text-purple-600">{totalStats.vip}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Lifetime Revenue</p>
          <p className="text-2xl font-bold text-gray-900">${totalStats.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">New This Month</p>
          <p className="text-2xl font-bold text-green-600">{totalStats.newThisMonth}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
              {loading && searchQuery && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full"></div>
                </span>
              )}
            </div>
          </div>

          {/* Membership Filter */}
          <div>
            <select
              value={filterMembership}
              onChange={(e) => setFilterMembership(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="all">All Clients</option>
              <option value="active">VIP Members</option>
              <option value="none">Non-Members</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="lastName">Sort by Name</option>
              <option value="lastVisit">Sort by Last Visit</option>
              <option value="totalSpent">Sort by Total Spent</option>
              <option value="totalVisits">Sort by Total Visits</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Client</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Contact</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Last Visit</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Visits</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Total Spent</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && !clients.length ? (
                // Loading skeletons
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                          <Skeleton className="w-32 h-4 mb-1" />
                          <Skeleton className="w-20 h-3" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="w-40 h-4 mb-1" />
                      <Skeleton className="w-28 h-3" />
                    </td>
                    <td className="px-4 py-3"><Skeleton className="w-24 h-4" /></td>
                    <td className="px-4 py-3"><Skeleton className="w-12 h-4" /></td>
                    <td className="px-4 py-3"><Skeleton className="w-20 h-4" /></td>
                    <td className="px-4 py-3"><Skeleton className="w-16 h-6 rounded-full" /></td>
                    <td className="px-4 py-3"><Skeleton className="w-20 h-8" /></td>
                  </tr>
                ))
              ) : displayClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <p className="text-gray-500 mb-2">
                      {searchQuery ? `No clients found matching "${searchQuery}"` : 'No clients found'}
                    </p>
                    <Link href="/admin/clients/new" className="text-pink-600 hover:text-pink-700 font-medium">
                      + Add first client
                    </Link>
                  </td>
                </tr>
              ) : (
                displayClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {client.first_name?.[0]}{client.last_name?.[0]}
                        </div>
                        <div>
                          <Link
                            href={`/admin/clients/${client.id}`}
                            className="font-medium text-gray-900 hover:text-pink-600"
                          >
                            {client.first_name} {client.last_name}
                          </Link>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {client.tags?.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{client.email || '-'}</p>
                      <p className="text-sm text-gray-500">{client.phone || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      {client.last_visit_at ? (
                        <span className="text-gray-900">
                          {new Date(client.last_visit_at).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900">{client.total_visits || 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">
                        ${(client.total_spent || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {client.is_vip ? (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                          💎 VIP
                        </span>
                      ) : client.total_visits === 0 ? (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          New
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/appointments/new?client=${client.id}`}
                          className="px-3 py-1.5 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                        >
                          Book
                        </Link>
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {displayClients.length} of {total.toLocaleString()} clients
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1.5 text-sm font-medium ${
                page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
              } rounded-lg`}
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg">
              {page}
            </span>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={displayClients.length < pageSize}
              className={`px-3 py-1.5 text-sm font-medium ${
                displayClients.length < pageSize ? 'text-gray-400 cursor-not-allowed' : 'text-pink-600 hover:bg-pink-50'
              } rounded-lg`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
