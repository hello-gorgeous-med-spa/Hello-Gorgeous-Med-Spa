'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const FILTERS = [
  { id: 'never_booked', label: 'Never booked' },
  { id: 'no_visit_90d', label: 'No visit 90 days' },
  { id: 'botox_filler', label: 'Botox / Filler interest' },
  { id: 'weight_loss', label: 'Weight loss' },
  { id: 'hormone', label: 'Hormone' },
  { id: 'birthday_month', label: 'Birthday month' },
  { id: 'vip', label: 'VIP' },
  { id: 'abandoned_booking', label: 'Abandoned booking' },
  { id: 'high_value', label: 'High value' },
];

function NewSegmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter') || '';
  const [name, setName] = useState('');
  const [filter_id, setFilterId] = useState(filterParam || FILTERS[0].id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (filterParam && FILTERS.some((f) => f.id === filterParam)) {
      setFilterId(filterParam);
      const f = FILTERS.find((x) => x.id === filterParam);
      if (f && !name) setName(f.label);
    }
  }, [filterParam, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/marketing/segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), filter_id }),
      });
      if (!res.ok) throw new Error('Failed to create');
      router.push('/admin/marketing?tab=segments');
    } catch {
      setError('Failed to create segment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/marketing" className="text-black hover:underline">← Marketing</Link>
        <span className="text-black">/</span>
        <span className="font-semibold text-black">New segment</span>
      </div>
      <h1 className="text-xl font-bold text-black mb-4">New audience segment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Segment name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black" placeholder="e.g. VIP clients" />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Audience filter</label>
          <select value={filter_id} onChange={(e) => setFilterId(e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white">
            {FILTERS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg disabled:opacity-50">{saving ? 'Creating…' : 'Create'}</button>
          <Link href="/admin/marketing" className="px-4 py-2 border border-black text-black font-medium rounded-lg hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default function NewSegmentPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <NewSegmentContent />
    </Suspense>
  );
}
