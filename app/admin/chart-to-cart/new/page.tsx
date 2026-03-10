'use client';

// ============================================================
// NEW CHART-TO-CART SESSION — client, optional appointment, line items
// Integrates with Calendar (client + appointment from panel)
// ============================================================

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type LineItem = { name: string; quantity: number; unit_price: number };

function NewSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client') || searchParams.get('client_id') || '';
  const appointmentId = searchParams.get('appointment') || searchParams.get('appointment_id') || '';

  const [treatmentSummary, setTreatmentSummary] = useState('');
  const [provider, setProvider] = useState('');
  const [lines, setLines] = useState<LineItem[]>([{ name: '', quantity: 1, unit_price: 0 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLine = () => setLines((l) => [...l, { name: '', quantity: 1, unit_price: 0 }]);
  const removeLine = (i: number) => setLines((l) => l.filter((_, idx) => idx !== i));
  const updateLine = (i: number, field: keyof LineItem, value: string | number) => {
    setLines((l) => l.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  const total = lines.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.unit_price) || 0), 0);
  const validLines = lines.filter((l) => String(l.name).trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError('Select a client. Open this page from Calendar (Chart-to-Cart) or from a client profile.');
      return;
    }
    if (validLines.length === 0) {
      setError('Add at least one product or service.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const products = validLines.map((l) => ({
        name: String(l.name).trim(),
        quantity: Number(l.quantity) || 1,
        unit_price: Number(l.unit_price) || 0,
      }));
      const res = await fetch('/api/chart-to-cart/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          appointment_id: appointmentId || null,
          provider: provider || null,
          treatment_summary: treatmentSummary.trim() || products.map((p) => `${p.name} (${p.quantity})`).join(', '),
          products,
          status: 'ready_to_checkout',
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to create');
      }
      const { session } = await res.json();
      router.push(`/admin/chart-to-cart?created=${session.id}`);
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const backUrl = clientId ? `/admin/clients/${clientId}` : '/admin/chart-to-cart';

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={backUrl} className="text-black hover:underline">← Back</Link>
        <span className="text-black">/</span>
        <span className="font-semibold text-black">New Chart-to-Cart session</span>
      </div>

      <h1 className="text-xl font-bold text-black">New treatment session</h1>

      {!clientId && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-black text-sm">
          <p className="font-medium">No client selected</p>
          <p className="mt-1">Open this page from the Calendar (add Chart-to-Cart link to the appointment panel) or from a client profile → Charting → Chart-to-Cart.</p>
          <Link href="/admin/chart-to-cart" className="inline-block mt-2 text-[#2D63A4] font-medium">← Chart-to-Cart</Link>
        </div>
      )}

      {clientId && (
        <div className="bg-white rounded-xl border border-black p-4 flex items-center justify-between">
          <span className="text-black font-medium">Client</span>
          <Link href={`/admin/clients/${clientId}`} className="text-[#2D63A4] font-medium hover:underline">View profile →</Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-black mb-1">Treatment summary (optional)</label>
          <input
            type="text"
            value={treatmentSummary}
            onChange={(e) => setTreatmentSummary(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-lg text-black"
            placeholder="e.g. Botox - Forehead, Filler - Lips"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Provider (optional)</label>
          <input
            type="text"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-lg text-black"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-black">Products / services</label>
            <button type="button" onClick={addLine} className="text-sm text-[#2D63A4] font-medium">+ Add line</button>
          </div>
          <div className="space-y-2">
            {lines.map((line, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={line.name}
                  onChange={(e) => updateLine(i, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-black rounded-lg text-black text-sm"
                  placeholder="Product or service"
                />
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => updateLine(i, 'quantity', Number(e.target.value) || 1)}
                  className="w-16 px-2 py-2 border border-black rounded-lg text-black text-sm"
                />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={line.unit_price || ''}
                  onChange={(e) => updateLine(i, 'unit_price', Number(e.target.value) || 0)}
                  className="w-20 px-2 py-2 border border-black rounded-lg text-black text-sm"
                  placeholder="Price"
                />
                <button type="button" onClick={() => removeLine(i)} className="text-black hover:text-red-600 text-sm">×</button>
              </div>
            ))}
          </div>
          <p className="text-sm text-black mt-2 font-medium">Total: ${total.toFixed(2)}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || !clientId || validLines.length === 0}
            className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save & go to checkout'}
          </button>
          <Link href={backUrl} className="px-4 py-2 border border-black text-black font-medium rounded-lg hover:bg-gray-50">Cancel</Link>
        </div>
      </form>

      {clientId && (
        <p className="text-sm text-black">
          After saving, use <strong>Checkout</strong> in Chart-to-Cart or POS to complete payment.
        </p>
      )}
    </div>
  );
}

export default function NewChartToCartPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <NewSessionContent />
    </Suspense>
  );
}
