'use client';

// ============================================================
// SERVICE BUILDER — Phase 4: DB-driven, owner-editable
// PRD: name, category, duration, price, deposit, online booking,
//      membership/package eligible, consent, intake, aftercare, upsells
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
};

type Service = {
  id: string;
  name: string;
  slug?: string;
  category?: string | null;
  category_id?: string | null;
  description?: string | null;
  duration_minutes: number;
  cleanup_minutes?: number;
  price_cents: number;
  price: number;
  deposit_cents?: number | null;
  online_booking?: boolean;
  allow_online_booking?: boolean;
  membership_eligible?: boolean;
  package_eligible?: boolean;
  consent_required?: boolean;
  requires_consent?: boolean;
  active?: boolean;
  is_active?: boolean;
  archived?: boolean;
  sort_order?: number;
  display_order?: number;
};

// Colorful category colors
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'botox': { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  'fillers': { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  'dermal-fillers': { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  'weight-loss': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  'weight-loss-injections': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  'bhrt': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  'bioidentical-hormone-therapy-bhrt': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  'anteage': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  'anteage-the-future-of-skin-regeneration-is-here': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  'facials': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  'skin-spa': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  'glowtox-facial-our-signature': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  'prp': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  'prp-injections': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  'iv-therapy': { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
  'iv-drip-package-deals': { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
  'vitamin-injections': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
  'lash': { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200' },
  'lash-spa': { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200' },
  'brow': { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800', border: 'border-fuchsia-200' },
  'brow-spa': { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800', border: 'border-fuchsia-200' },
  'trigger-point': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  'trigger-point-injections': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  'body-spa': { bg: 'bg-lime-100', text: 'text-lime-800', border: 'border-lime-200' },
  'consultations': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' },
  'medical-visit-with-ryan-kent-aprn-fnp-bc-fpa': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' },
  'laser-hair': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
};

const DEFAULT_COLOR = { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };

function getCategoryColor(slug: string | null | undefined) {
  if (!slug) return DEFAULT_COLOR;
  return CATEGORY_COLORS[slug.toLowerCase()] || DEFAULT_COLOR;
}

const defaultForm: Record<string, string | number | boolean> = {
  name: '',
  category: '',
  description: '',
  duration_minutes: 60,
  cleanup_minutes: 0,
  price: 0,
  deposit_cents: '',
  online_booking: true,
  membership_eligible: false,
  package_eligible: false,
  consent_required: false,
  active: true,
  archived: false,
  sort_order: 0,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, ServiceCategory>>({});
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modal, setModal] = useState<'closed' | 'new' | 'edit'>('closed');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string | number | boolean>>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/service-categories');
      const data = await res.json();
      const cats = data.categories || [];
      setCategories(cats);
      const map: Record<string, ServiceCategory> = {};
      cats.forEach((c: ServiceCategory) => { map[c.id] = c; });
      setCategoryMap(map);
    } catch {
      setCategories([]);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data.services || []);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, [fetchCategories, fetchServices]);

  const openNew = () => {
    setForm({ ...defaultForm });
    setEditingId(null);
    setModal('new');
    setError(null);
  };

  const openEdit = (s: Service) => {
    setForm({
      name: s.name,
      category: s.category || '',
      description: s.description || '',
      duration_minutes: s.duration_minutes ?? 60,
      cleanup_minutes: s.cleanup_minutes ?? 0,
      price: s.price ?? s.price_cents / 100,
      deposit_cents: s.deposit_cents ?? '',
      online_booking: s.online_booking !== false,
      membership_eligible: s.membership_eligible === true,
      package_eligible: s.package_eligible === true,
      consent_required: s.consent_required === true,
      active: s.active !== false,
      archived: s.archived === true,
      sort_order: s.sort_order ?? 0,
    });
    setEditingId(s.id);
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
        category: form.category || null,
        description: form.description || null,
        duration_minutes: Number(form.duration_minutes) || 60,
        cleanup_minutes: Number(form.cleanup_minutes) || 0,
        price: Number(form.price) || 0,
        deposit_cents: form.deposit_cents === '' ? null : Number(form.deposit_cents),
        online_booking: form.online_booking === true,
        membership_eligible: form.membership_eligible === true,
        package_eligible: form.package_eligible === true,
        consent_required: form.consent_required === true,
        active: form.active === true,
        archived: form.archived === true,
        sort_order: Number(form.sort_order) || 0,
      };
      if (editingId) {
        const res = await fetch(`/api/services/${editingId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || 'Failed to update');
        }
      } else {
        const res = await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || 'Failed to create');
        }
      }
      closeModal();
      fetchServices();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const archive = async (id: string) => {
    if (!confirm('Archive this service? It will be hidden from booking.')) return;
    try {
      await fetch(`/api/services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: false, archived: true }) });
      fetchServices();
    } catch {
      setError('Failed to archive');
    }
  };

  const filteredByArchive = showArchived ? services : services.filter((s) => !s.archived);
  const displayList = selectedCategory === 'all' 
    ? filteredByArchive 
    : filteredByArchive.filter((s) => s.category_id === selectedCategory || s.category === selectedCategory);
  
  // Get category info for a service
  const getCategoryInfo = (s: Service) => {
    const catId = s.category_id || s.category;
    if (!catId) return null;
    return categoryMap[catId] || null;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Services</h1>
          <p className="text-black mt-1">Manage bookable services. No code — edit here.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-black text-sm">
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
            Show archived
          </label>
          <button
            type="button"
            onClick={openNew}
            className="px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#234a7a]"
          >
            + Add service
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#2D63A4] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({services.filter(s => !s.archived || showArchived).length})
          </button>
          {categories.map((cat) => {
            const count = services.filter(s => 
              (s.category_id === cat.id || s.category === cat.id) && 
              (!s.archived || showArchived)
            ).length;
            if (count === 0) return null;
            const colors = getCategoryColor(cat.slug);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedCategory === cat.id
                    ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-offset-1 ring-current`
                    : `${colors.bg} ${colors.text} ${colors.border} hover:opacity-80`
                }`}
              >
                {cat.icon && <span className="mr-1">{cat.icon}</span>}
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="h-48 rounded-xl bg-gray-100 animate-pulse" />
      ) : displayList.length === 0 ? (
        <div className="bg-white rounded-xl border border-black p-8 text-center text-black">
          <p className="font-medium">No services yet</p>
          <p className="text-sm mt-1">Add your first service to use in Calendar and online booking.</p>
          <button type="button" onClick={openNew} className="mt-4 px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg">
            + Add service
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-black">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Name</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Category</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Duration</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Price</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Booking</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Status</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {displayList.map((s) => {
                const catInfo = getCategoryInfo(s);
                const catColors = catInfo ? getCategoryColor(catInfo.slug) : DEFAULT_COLOR;
                const isActive = s.is_active !== false && s.active !== false;
                const canBook = s.allow_online_booking !== false && s.online_booking !== false;
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-black">{s.name}</td>
                    <td className="px-4 py-3">
                      {catInfo ? (
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${catColors.bg} ${catColors.text} border ${catColors.border}`}>
                          {catInfo.icon && <span>{catInfo.icon}</span>}
                          {catInfo.name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-black text-sm">{s.duration_minutes} min</td>
                    <td className="px-4 py-3 text-black text-sm font-medium">${(s.price ?? s.price_cents / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {canBook ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Online</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {s.archived ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">Archived</span>
                      ) : isActive ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Active</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => openEdit(s)} className="text-[#2D63A4] font-medium text-sm hover:underline mr-2">Edit</button>
                      {!s.archived && <button type="button" onClick={() => archive(s.id)} className="text-gray-500 text-sm hover:underline">Archive</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: New / Edit */}
      {modal !== 'closed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-xl border border-black shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-black">
              <h2 className="text-lg font-bold text-black">{editingId ? 'Edit service' : 'New service'}</h2>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Name *</label>
                <input type="text" value={String(form.name)} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" placeholder="e.g. Botox - Forehead" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Category</label>
                <input type="text" value={String(form.category)} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" placeholder="e.g. Injectables" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Description</label>
                <textarea value={String(form.description)} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Duration (min)</label>
                  <input type="number" min={5} step={5} value={Number(form.duration_minutes)} onChange={(e) => setForm((f) => ({ ...f, duration_minutes: Number(e.target.value) || 60 }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Cleanup (min)</label>
                  <input type="number" min={0} value={Number(form.cleanup_minutes)} onChange={(e) => setForm((f) => ({ ...f, cleanup_minutes: Number(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Price ($)</label>
                  <input type="number" min={0} step={0.01} value={Number(form.price)} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Deposit (cents)</label>
                  <input type="number" min={0} value={form.deposit_cents === '' ? '' : Number(form.deposit_cents)} onChange={(e) => setForm((f) => ({ ...f, deposit_cents: e.target.value === '' ? '' : Number(e.target.value) }))} className="w-full px-3 py-2 border border-black rounded-lg text-black" placeholder="Optional" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-black"><input type="checkbox" checked={form.online_booking as boolean} onChange={(e) => setForm((f) => ({ ...f, online_booking: e.target.checked }))} /> Online booking</label>
                <label className="flex items-center gap-2 text-black"><input type="checkbox" checked={form.membership_eligible as boolean} onChange={(e) => setForm((f) => ({ ...f, membership_eligible: e.target.checked }))} /> Membership eligible</label>
                <label className="flex items-center gap-2 text-black"><input type="checkbox" checked={form.package_eligible as boolean} onChange={(e) => setForm((f) => ({ ...f, package_eligible: e.target.checked }))} /> Package eligible</label>
                <label className="flex items-center gap-2 text-black"><input type="checkbox" checked={form.consent_required as boolean} onChange={(e) => setForm((f) => ({ ...f, consent_required: e.target.checked }))} /> Consent required</label>
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
        <Link href="/admin/calendar" className="text-[#2D63A4] font-medium hover:underline">← Calendar</Link>
      </div>
    </div>
  );
}
