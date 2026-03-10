'use client';

// ============================================================
// MEMBERSHIP BUILDER — Phase 4: DB-driven recurring plans
// PRD: name, monthly price, initiation fee, benefits, credits,
//      rollover, discounts, eligible services, pause/cancel, contract, auto-billing
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type Membership = {
  id: string;
  name: string;
  slug?: string;
  monthly_price_cents: number;
  monthly_price: number;
  initiation_fee_cents?: number | null;
  benefits?: string | null;
  monthly_credits?: number | null;
  rollover?: boolean;
  discounts?: string | null;
  eligible_services?: unknown;
  pause_cancel_rules?: string | null;
  contract?: string | null;
  auto_billing: boolean;
  active: boolean;
};

const defaultForm: Record<string, string | number | boolean> = {
  name: '',
  monthly_price: 0,
  initiation_fee_cents: '',
  benefits: '',
  monthly_credits: '',
  rollover: false,
  discounts: '',
  pause_cancel_rules: '',
  contract: '',
  auto_billing: true,
  active: true,
};

export default function AdminMembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'closed' | 'new' | 'edit'>('closed');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string | number | boolean>>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMemberships = useCallback(async () => {
    try {
      const res = await fetch('/api/memberships');
      const data = await res.json();
      setMemberships(data.memberships || []);
    } catch {
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);

  const openNew = () => {
    setForm({ ...defaultForm });
    setEditingId(null);
    setModal('new');
    setError(null);
  };

  const openEdit = (m: Membership) => {
    setForm({
      name: m.name,
      monthly_price: m.monthly_price ?? m.monthly_price_cents / 100,
      initiation_fee_cents: m.initiation_fee_cents ?? '',
      benefits: m.benefits ?? '',
      monthly_credits: m.monthly_credits ?? '',
      rollover: m.rollover === true,
      discounts: m.discounts ?? '',
      pause_cancel_rules: m.pause_cancel_rules ?? '',
      contract: m.contract ?? '',
      auto_billing: m.auto_billing !== false,
      active: m.active !== false,
    });
    setEditingId(m.id);
    setModal('edit');
    setError(null);
  };

  const closeModal = () => {
    setModal('closed');
    setEditingId(null);
    setError(null);
  };

  const save = async () => {
    const name = String(form.name || '').trim();
    if (!name) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body = {
        name,
        monthly_price: Number(form.monthly_price) || 0,
        initiation_fee_cents: form.initiation_fee_cents === '' ? null : Number(form.initiation_fee_cents),
        benefits: form.benefits || null,
        monthly_credits: form.monthly_credits === '' ? null : Number(form.monthly_credits),
        rollover: form.rollover === true,
        discounts: form.discounts || null,
        pause_cancel_rules: form.pause_cancel_rules || null,
        contract: form.contract || null,
        auto_billing: form.auto_billing === true,
        active: form.active === true,
      };
      if (editingId) {
        const res = await fetch(`/api/memberships/${editingId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || 'Failed to update');
        }
      } else {
        const res = await fetch('/api/memberships', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || 'Failed to create');
        }
      }
      closeModal();
      fetchMemberships();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Memberships</h1>
          <p className="text-black mt-1">Recurring plans — benefits, credits, pricing. Per-client management in Client profile.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#234a7a]"
        >
          + Add membership plan
        </button>
      </div>

      {loading ? (
        <div className="h-48 rounded-xl bg-gray-100 animate-pulse" />
      ) : memberships.length === 0 ? (
        <div className="bg-white rounded-xl border border-black p-8 text-center text-black">
          <p className="font-medium">No membership plans yet</p>
          <p className="text-sm mt-1">Create plans for recurring benefits, credits, and discounts.</p>
          <button type="button" onClick={openNew} className="mt-4 px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg">
            + Add membership plan
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-black">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Name</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Monthly</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Initiation</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Credits</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Auto-billing</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Status</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {memberships.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-black">{m.name}</td>
                  <td className="px-4 py-3 text-black text-sm">${(m.monthly_price ?? m.monthly_price_cents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3 text-black text-sm">{m.initiation_fee_cents != null ? `$${(m.initiation_fee_cents / 100).toFixed(2)}` : '—'}</td>
                  <td className="px-4 py-3 text-black text-sm">{m.monthly_credits ?? '—'}</td>
                  <td className="px-4 py-3">{m.auto_billing ? <span className="text-xs text-green-700">Yes</span> : <span className="text-xs text-black">No</span>}</td>
                  <td className="px-4 py-3">{m.active ? <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">Active</span> : <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700">Inactive</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => openEdit(m)} className="text-[#2D63A4] font-medium text-sm hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal !== 'closed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-xl border border-black shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-black">
              <h2 className="text-lg font-bold text-black">{editingId ? 'Edit membership' : 'New membership plan'}</h2>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Name *</label>
                <input type="text" value={String(form.name)} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" placeholder="e.g. VIP Monthly" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Monthly price ($)</label>
                  <input type="number" min={0} step={0.01} value={Number(form.monthly_price)} onChange={(e) => setForm((f) => ({ ...f, monthly_price: Number(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Initiation fee (cents)</label>
                  <input type="number" min={0} value={form.initiation_fee_cents === '' ? '' : Number(form.initiation_fee_cents)} onChange={(e) => setForm((f) => ({ ...f, initiation_fee_cents: e.target.value === '' ? '' : Number(e.target.value) }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" placeholder="Optional" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Benefits</label>
                <textarea value={String(form.benefits)} onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" rows={2} placeholder="e.g. 10% off injectables" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Monthly credits</label>
                <input type="number" min={0} value={form.monthly_credits === '' ? '' : form.monthly_credits} onChange={(e) => setForm((f) => ({ ...f, monthly_credits: e.target.value === '' ? '' : Number(e.target.value) }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Discounts (description)</label>
                <input type="text" value={String(form.discounts)} onChange={(e) => setForm((f) => ({ ...f, discounts: e.target.value }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Pause / cancel rules</label>
                <textarea value={String(form.pause_cancel_rules)} onChange={(e) => setForm((f) => ({ ...f, pause_cancel_rules: e.target.value }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Contract (summary)</label>
                <textarea value={String(form.contract)} onChange={(e) => setForm((f) => ({ ...f, contract: e.target.value }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" rows={2} />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-black"><input type="checkbox" checked={form.rollover as boolean} onChange={(e) => setForm((f) => ({ ...f, rollover: e.target.checked }))} /> Credits rollover</label>
                <label className="flex items-center gap-2 text-black"><input type="checkbox" checked={form.auto_billing as boolean} onChange={(e) => setForm((f) => ({ ...f, auto_billing: e.target.checked }))} /> Auto-billing</label>
                <label className="flex items-center gap-2 text-black"><input type="checkbox" checked={form.active as boolean} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} /> Active</label>
              </div>
            </div>
            <div className="p-5 border-t border-black flex justify-end gap-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 border border-black text-black font-medium rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={save} disabled={saving} className="px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#234a7a] disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4">
        <Link href="/admin/clients" className="text-[#2D63A4] font-medium hover:underline">← Clients (per-client membership in profile)</Link>
      </div>
    </div>
  );
}
