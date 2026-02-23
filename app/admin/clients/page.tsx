'use client';

// ============================================================
// ADMIN CLIENTS PAGE
// Full client management - Uses API to bypass RLS
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Breadcrumb, Pagination, ExportButton, NoClientsEmptyState } from '@/components/ui';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white rounded ${className}`} />;
}

interface Client {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  created_at: string;
  last_visit?: string;
  total_spent: number;
  visit_count: number;
  source?: string | null;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch clients via API with pagination
  const fetchClients = async (search?: string, page = 1, limit = 25) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (sourceFilter) params.set('source', sourceFilter);
      params.set('limit', limit.toString());
      params.set('offset', ((page - 1) * limit).toString());
      
      const response = await fetch(`/api/clients?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch clients');
      }

      setClients(data.clients || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(debouncedSearch, currentPage, pageSize);
  }, [debouncedSearch, currentPage, pageSize, sourceFilter]);

  const totalPages = Math.ceil(total / pageSize);

  // Export columns configuration
  const exportColumns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'source', label: 'Source' },
    { key: 'visit_count', label: 'Visits' },
    { key: 'total_spent', label: 'Total Spent', format: (v: number) => `$${v || 0}` },
    { key: 'created_at', label: 'Joined', format: (v: string) => new Date(v).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Clients</h1>
          <p className="text-black">{total.toLocaleString()} total clients</p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={clients}
            filename="clients"
            columns={exportColumns}
          />
          <Link
            href="/admin/clients/new"
            className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
          >
            + Add Client
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-black shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E]"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="w-full sm:w-48">
            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E] bg-white text-black"
            >
              <option value="">All sources</option>
              <option value="website">Website</option>
              <option value="booking">Booking</option>
              <option value="square">Square</option>
              <option value="pos">POS</option>
              <option value="face-blueprint">Face Blueprint</option>
              <option value="hormone-AI">Hormone AI</option>
              <option value="AI-roadmap">AI Roadmap</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button onClick={() => fetchClients()} className="ml-4 underline">Retry</button>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-black">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Client</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Contact</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Source</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Visits</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">LTV</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Joined</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4"><Skeleton className="w-32 h-4" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-40 h-4" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-20 h-4" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-12 h-4" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-20 h-4" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-24 h-4" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-16 h-8" /></td>
                  </tr>
                ))
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12">
                    {searchQuery ? (
                      <div className="text-center text-black">
                        No clients match your search
                        <br />
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="text-pink-600 hover:text-pink-700 mt-2"
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      <NoClientsEmptyState />
                    )}
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-white">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {client.first_name?.[0]}{client.last_name?.[0]}
                        </div>
                        <div>
                          <Link
                            href={`/admin/clients/${client.id}`}
                            className="font-medium text-black hover:text-pink-600"
                          >
                            {client.first_name} {client.last_name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-black">{client.email}</p>
                      <p className="text-sm text-black">{client.phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-black">{client.source || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-black">{client.visit_count || 0}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-black">
                        ${(client.total_spent || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-black">
                        {new Date(client.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="px-3 py-1.5 text-sm font-medium text-black hover:bg-white rounded-lg"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/appointments/new?client=${client.id}`}
                          className="px-3 py-1.5 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-lg"
                        >
                          Book
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
        {total > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}
