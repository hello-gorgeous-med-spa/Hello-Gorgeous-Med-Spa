'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getOpsStaff } from '@/lib/regen/ops-staff';
import { useOpsStaff } from './OpsShell';

interface Intake {
  id: string;
  name: string;
  email: string;
  phone?: string;
  goal: string;
  status: string;
  created_at: string;
  amount_paid?: number;
  medical_history?: Record<string, unknown>;
  review_notes?: string;
}

const STATUS_TABS = [
  { id: 'action', label: 'Needs action' },
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'New' },
  { id: 'needs_labs', label: 'Labs' },
  { id: 'needs_video', label: 'Video' },
  { id: 'approved', label: 'Approved' },
  { id: 'shipped', label: 'Shipped' },
];

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function TodayQueue({
  initialIntakes = [],
  initialShipped = [],
  initialStats,
}: {
  initialIntakes?: Intake[];
  initialShipped?: Array<{ id: string; order_number: string; status: string; pharmacy_order_id?: string | null; pharmacyError?: string | null; created_at: string }>;
  initialStats?: { revenue: { today: number; week: number; month: number }; intakeQueue: number; orders: { pending: number; total: number } };
}) {
  const [intakes, setIntakes] = useState<Intake[]>(initialIntakes);
  const [stats, setStats] = useState(initialStats || { revenue: { today: 0, week: 0, month: 0 }, intakeQueue: 0, orders: { pending: 0, total: 0 } });
  const [filter, setFilter] = useState('action');
  const [selected, setSelected] = useState<Intake | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [attest, setAttest] = useState({ history: false, contra: false, tele: false, sign: false });
  const staffFromShell = useOpsStaff();
  const [staff, setStaff] = useState<ReturnType<typeof getOpsStaff>>(staffFromShell);
  const [shipped, setShipped] = useState(initialShipped);

  useEffect(() => {
    setStaff(staffFromShell || getOpsStaff(sessionStorage.getItem('regen-ops-staff')));
  }, [staffFromShell]);

  const load = useCallback(async () => {
    setLoading(true);
    const [iRes, sRes] = await Promise.all([
      fetch('/api/regen/ops/intakes?status=all&limit=80'),
      fetch('/api/regen/ops/stats'),
    ]);
    if (iRes.ok) {
      const j = await iRes.json();
      setIntakes(j.intakes || []);
    }
    if (sRes.ok) setStats(await sRes.json());
    const oRes = await fetch('/api/regen/ops/orders?status=shipped&limit=40');
    if (oRes.ok) {
      const oj = await oRes.json();
      setShipped(oj.orders || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initialIntakes.length === 0) load();
  }, [load, initialIntakes.length]);

  const visible = intakes.filter((i) => {
    if (filter === 'all') return true;
    if (filter === 'action') return ['pending', 'awaiting_payment', 'needs_labs', 'needs_video'].includes(i.status);
    return i.status === filter;
  });

  async function act(intake: Intake, status: string) {
    if (!staff) {
      alert('Sign in as Danielle, Ryan, or Damara first.');
      return;
    }
    if (status === 'approved' && !Object.values(attest).every(Boolean)) {
      alert('Complete attestation checkboxes before approving.');
      return;
    }
    setBusy(true);
    const res = await fetch('/api/regen/ops/intakes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: intake.id,
        status,
        review_notes: note || undefined,
        staff: { id: staff.id, name: staff.name, email: staff.email },
        attestation: status === 'approved' ? {
          provider_npi: staff.id === 'ryan' ? '' : undefined,
          attestation_text: `I, ${staff.name}, reviewed this patient's history and contraindications and attest telehealth is appropriate.`,
        } : undefined,
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      alert(json.error || 'Update failed');
      return;
    }
    if (json.fulfillment?.pharmacyError) {
      alert(`Approved. Pharmacy note: ${json.fulfillment.pharmacyError}`);
    }
    setSelected(null);
    setNote('');
    setAttest({ history: false, contra: false, tele: false, sign: false });
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Today</h1>
        <p className="text-white/50">
          {staff ? `Signed in as ${staff.short}` : 'Not signed in'} · ${stats.revenue.today.toLocaleString()} today · {stats.intakeQueue} waiting
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white/40 text-xs">Today</p>
          <p className="text-white text-xl font-bold">${stats.revenue.today.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white/40 text-xs">This week</p>
          <p className="text-white text-xl font-bold">${stats.revenue.week.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white/40 text-xs">Open orders</p>
          <p className="text-white text-xl font-bold">{stats.orders.pending}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {STATUS_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${filter === t.id ? 'bg-teal-500 text-white' : 'bg-white/5 text-white/60'}`}
          >
            {t.label}
          </button>
        ))}
        <button onClick={load} className="px-3 py-2 rounded-lg text-sm bg-white/5 text-white/60">Refresh</button>
      </div>

      <p className="text-white/35 text-xs">
        Stripe leftovers (Dashboard only): support email provider@hellogorgeousmedspa.com · support URL https://tryregenrx.com · statement name REGEN RX.
        Resend: From is provider@hellogorgeousmedspa.com until tryregenrx.com is verified.
      </p>

      {loading && <p className="text-white/40">Loading…</p>}
      {!loading && filter === 'shipped' && shipped.length === 0 && (
        <div className="bg-white/5 rounded-2xl p-10 text-center text-white/50">No shipped orders yet.</div>
      )}
      {!loading && filter !== 'shipped' && visible.length === 0 && (
        <div className="bg-white/5 rounded-2xl p-10 text-center text-white/50">No visits in this list.</div>
      )}

      {filter === 'shipped' && (
        <div className="space-y-3">
          {shipped.map((o) => (
            <Link key={o.id} href="/ops/orders" className="block bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-white font-semibold">{o.order_number}</p>
              <p className="text-white/50 text-sm">{o.status}{o.pharmacy_order_id ? ` · Formulation ${o.pharmacy_order_id}` : ''}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filter !== 'shipped' && visible.map((i) => (
          <div key={i.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="text-white font-semibold text-lg">{i.name}</p>
                <p className="text-white/50 text-sm">{i.email} {i.phone ? `· ${i.phone}` : ''}</p>
                <p className="text-white/40 text-xs mt-1">{i.goal} · {i.status.replace(/_/g, ' ')} · {timeAgo(i.created_at)}{i.amount_paid != null ? ` · $${i.amount_paid}` : ''}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/ops/patients/${encodeURIComponent(i.email)}`} className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm">Chart</Link>
                <button onClick={() => setSelected(i)} className="px-3 py-2 rounded-lg bg-teal-500 text-white text-sm">Act</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full border border-white/20" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-white text-xl font-bold mb-1">{selected.name}</h2>
            <p className="text-white/50 text-sm mb-4">{selected.email} · {selected.goal}</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Clinical / ops notes"
              className="w-full mb-4 px-3 py-2 rounded-lg bg-white/10 text-white min-h-[80px]"
            />
            <div className="space-y-2 mb-4 text-sm text-white/80">
              {(['history', 'contra', 'tele', 'sign'] as const).map((k) => (
                <label key={k} className="flex gap-2 items-start">
                  <input type="checkbox" checked={attest[k]} onChange={(e) => setAttest({ ...attest, [k]: e.target.checked })} />
                  <span>
                    {k === 'history' && 'I reviewed medical history'}
                    {k === 'contra' && 'I reviewed contraindications'}
                    {k === 'tele' && 'Telehealth is appropriate'}
                    {k === 'sign' && `I am ${staff?.short || 'staff'} and this is my decision`}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button disabled={busy} onClick={() => act(selected, 'approved')} className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm">Approve</button>
              <button disabled={busy} onClick={() => act(selected, 'needs_labs')} className="px-3 py-2 rounded-lg bg-purple-600/40 text-purple-100 text-sm">Need labs</button>
              <button disabled={busy} onClick={() => act(selected, 'needs_video')} className="px-3 py-2 rounded-lg bg-cyan-600/40 text-cyan-100 text-sm">Video</button>
              <button disabled={busy} onClick={() => act(selected, 'declined')} className="px-3 py-2 rounded-lg bg-red-600/40 text-red-100 text-sm">Decline</button>
              <button onClick={() => setSelected(null)} className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
