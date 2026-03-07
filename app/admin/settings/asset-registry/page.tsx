// ============================================================
// Business assets registry — list, create, edit
// Owner entity defaults to Hello Gorgeous Med Spa
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ASSET_TYPES = [
  'device',
  'domain',
  'social_account',
  'vendor_account',
  'treatment_protocol',
  'website',
  'photography_library',
  'marketing_asset',
  'product_inventory_account',
];

interface Asset {
  id: string;
  asset_type: string;
  name: string;
  owner_entity: string;
  reference_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export default function AssetRegistryPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ asset_type: 'device', name: '', owner_entity: 'Hello Gorgeous Med Spa', reference_id: '' });
  const [saving, setSaving] = useState(false);

  const fetchList = () => {
    fetch('/api/business-assets')
      .then((r) => r.json())
      .then((json) => {
        if (json.assets) setAssets(json.assets);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, []);

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    fetch('/api/business-assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asset_type: form.asset_type,
        name: form.name.trim(),
        owner_entity: form.owner_entity.trim() || 'Hello Gorgeous Med Spa',
        reference_id: form.reference_id.trim() || undefined,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.asset) {
          setAssets((prev) => [...prev, json.asset]);
          setCreating(false);
          setForm({ asset_type: 'device', name: '', owner_entity: 'Hello Gorgeous Med Spa', reference_id: '' });
        }
      })
      .finally(() => setSaving(false));
  };

  const update = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const asset = editing!;
    setSaving(true);
    fetch(`/api/business-assets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asset_type: asset.asset_type,
        name: asset.name,
        owner_entity: asset.owner_entity,
        reference_id: asset.reference_id || '',
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.asset) {
          setAssets((prev) => prev.map((a) => (a.id === id ? json.asset : a)));
          setEditing(null);
        }
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-black">Loading asset registry…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/provider-governance" className="text-sm text-[#2D63A4] hover:underline">
          ← Provider Governance
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-black mb-2">Asset registry</h1>
      <p className="text-gray-600 text-sm mb-6">
        All assets default owner: Hello Gorgeous Med Spa. Register devices, domains, social accounts, and other business assets.
      </p>

      {!creating ? (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="mb-6 px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168]"
        >
          Add asset
        </button>
      ) : (
        <form onSubmit={create} className="mb-6 p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Type</label>
            <select
              value={form.asset_type}
              onChange={(e) => setForm((f) => ({ ...f, asset_type: e.target.value }))}
              className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-black"
            >
              {ASSET_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
              placeholder="e.g. Square terminal #1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Owner entity</label>
            <input
              type="text"
              value={form.owner_entity}
              onChange={(e) => setForm((f) => ({ ...f, owner_entity: e.target.value }))}
              className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Reference ID (optional)</label>
            <input
              type="text"
              value={form.reference_id}
              onChange={(e) => setForm((f) => ({ ...f, reference_id: e.target.value }))}
              className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-black"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving || !form.name.trim()}
              className="px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {assets.map((a) => (
          <li key={a.id} className="p-4 rounded-xl border border-gray-200 bg-white">
            {editing?.id === a.id ? (
              <form onSubmit={(e) => update(e, a.id)} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Type</label>
                  <select
                    value={editing.asset_type}
                    onChange={(e) => setEditing((x) => (x ? { ...x, asset_type: e.target.value } : null))}
                    className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-black"
                  >
                    {ASSET_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Name</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing((x) => (x ? { ...x, name: e.target.value } : null))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Owner entity</label>
                  <input
                    type="text"
                    value={editing.owner_entity}
                    onChange={(e) => setEditing((x) => (x ? { ...x, owner_entity: e.target.value } : null))}
                    className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Reference ID</label>
                  <input
                    type="text"
                    value={editing.reference_id || ''}
                    onChange={(e) => setEditing((x) => (x ? { ...x, reference_id: e.target.value } : null))}
                    className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-black"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168] disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-black">{a.name}</span>
                  <span className="text-sm text-gray-500">{a.asset_type}</span>
                  {a.owner_entity && (
                    <span className="text-sm text-gray-600">— {a.owner_entity}</span>
                  )}
                </div>
                {a.reference_id && (
                  <p className="text-sm text-gray-500 mt-1">Ref: {a.reference_id}</p>
                )}
                <button
                  type="button"
                  onClick={() => setEditing(a)}
                  className="mt-2 text-sm text-[#2D63A4] hover:underline"
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {assets.length === 0 && !creating && (
        <p className="text-gray-500 text-sm">No assets yet. Add one above.</p>
      )}
    </div>
  );
}
