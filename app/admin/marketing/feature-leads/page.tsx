'use client';

// ============================================================
// FEATURE LEADS ADMIN PAGE
// List leads from Face Blueprint, Journey, Harmony AI, Lip Studio.
// Export CSV, add to Admin Contact Collection, sync to Square.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Breadcrumb, ExportButton } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

const SOURCES = [
  { value: '', label: 'All sources' },
  { value: 'face_blueprint', label: 'Face Blueprint' },
  { value: 'journey', label: 'Your Journey' },
  { value: 'hormone', label: 'Harmony AI' },
  { value: 'lip_studio', label: 'Lip Studio' },
] as const;

const SOURCE_LABEL: Record<string, string> = {
  face_blueprint: 'Face Blueprint',
  journey: 'Your Journey',
  hormone: 'Harmony AI',
  lip_studio: 'Lip Studio',
};

interface Lead {
  id: string;
  created_at: string;
  email: string;
  phone: string | null;
  source: string;
  marketing_opt_in: boolean;
}

export default function FeatureLeadsPage() {
  const toast = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('');
  const [syncingMarketing, setSyncingMarketing] = useState(false);
  const [syncingSquare, setSyncingSquare] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sourceFilter) params.set('source', sourceFilter);
      params.set('limit', '500');
      const res = await fetch(`/api/leads?${params}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to load leads');
      }
      const data = await res.json();
      setLeads(data.leads ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load leads');
      setLeads([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [sourceFilter, toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSyncMarketing = async () => {
    setSyncingMarketing(true);
    try {
      const res = await fetch('/api/leads/sync-marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      const { imported = 0, updated = 0, errors = [] } = data;
      toast.success(`Added to Contact Collection: ${imported} new, ${updated} updated.`);
      if (errors.length) toast.error(`${errors.length} errors — check console`);
      fetchLeads();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sync to Admin failed');
    } finally {
      setSyncingMarketing(false);
    }
  };

  const handleSyncSquare = async () => {
    setSyncingSquare(true);
    try {
      const res = await fetch('/api/leads/sync-square', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      const { created = 0, errors = [] } = data;
      toast.success(`Synced to Square: ${created} customers created/updated.`);
      if (errors.length) toast.error(`${errors.length} errors — check console`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sync to Square failed');
    } finally {
      setSyncingSquare(false);
    }
  };

  const exportColumns = [
    { key: 'created_at', label: 'Date', format: (v: string) => (v ? new Date(v).toLocaleString() : '') },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'source', label: 'Source', format: (v: string) => SOURCE_LABEL[v] || v },
    { key: 'marketing_opt_in', label: 'Opt-in', format: (v: boolean) => (v ? 'Yes' : 'No') },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <Breadcrumb />

      <div>
        <h1 className="text-2xl font-bold text-black">Feature Leads</h1>
        <p className="text-black">
          Leads captured from Face Blueprint, Your Journey, Harmony AI, and Lip Studio. Add them to Contact Collection or Square for email marketing.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="source" className="text-sm font-medium text-black">Source</label>
          <select
            id="source"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-black rounded-lg text-black bg-white"
          >
            {SOURCES.map((s) => (
              <option key={s.value || 'all'} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <ExportButton
          data={leads}
          filename="feature-leads"
          columns={exportColumns}
          label="Export CSV"
        />
        <button
          type="button"
          onClick={handleSyncMarketing}
          disabled={syncingMarketing || leads.length === 0}
          className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-xl hover:bg-black disabled:opacity-50"
        >
          {syncingMarketing ? 'Adding…' : 'Add to Contact Collection'}
        </button>
        <button
          type="button"
          onClick={handleSyncSquare}
          disabled={syncingSquare || leads.length === 0}
          className="px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-black disabled:opacity-50"
        >
          {syncingSquare ? 'Syncing…' : 'Sync to Square'}
        </button>
        <Link
          href="/admin/marketing/contacts"
          className="text-sm text-[#FF2D8E] hover:underline"
        >
          View Contact Collection →
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-black overflow-hidden">
        <div className="p-6 border-b border-black flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">
            Leads ({total})
          </h2>
          <button
            type="button"
            onClick={() => fetchLeads()}
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Opt-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-black">
                    Loading...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-black mb-2">📭</div>
                    <p className="text-black">No leads yet</p>
                    <p className="text-sm text-black">Leads will appear here when visitors use Face Blueprint, Journey, Harmony AI, or Lip Studio</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white">
                    <td className="px-6 py-4 text-sm text-black">
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-black">{lead.email}</td>
                    <td className="px-6 py-4 text-black">{lead.phone || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-white text-black text-xs rounded-full border border-black">
                        {SOURCE_LABEL[lead.source] || lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {lead.marketing_opt_in ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-black">No</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
        <strong>Tip:</strong> Use &quot;Add to Contact Collection&quot; to add these leads to your main marketing list (same as importing a CSV). Use &quot;Sync to Square&quot; to create them as Square customers so you can run email/SMS campaigns from Square Marketing.
      </div>
    </div>
  );
}
