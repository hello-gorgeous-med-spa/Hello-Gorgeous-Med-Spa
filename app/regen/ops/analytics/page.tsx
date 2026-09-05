'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Stats = {
  revenue?: { today: number; week: number; month: number };
  orders?: { pending: number; shipped: number; total: number };
  patients?: { total: number; new: number };
  intakeQueue?: number;
  prescriptionQueue?: number;
  messages?: number;
};

const LINKS = [
  { href: '/ops', label: 'Today queue', desc: 'Approve, request labs, or decline visits' },
  { href: '/ops/patients', label: 'Patients', desc: 'Charts, screening, consent, shipping' },
  { href: '/ops/orders', label: 'Orders', desc: 'Formulation ids and pharmacy errors' },
  { href: '/ops/labs', label: 'Labs', desc: 'Required panels and uploads' },
  { href: '/ops/payments', label: 'Payments', desc: 'Paid visits and Stripe totals' },
  { href: '/ops/catalog', label: 'Catalog', desc: 'What we can send to pharmacy' },
];

export default function OpsDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/regen/ops/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats({}));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">Owner dashboard</p>
        <h1 className="text-3xl font-bold text-white">REGEN RX backend</h1>
        <p className="text-white/50 mt-1">Live numbers only. Zero means nobody has paid or queued yet.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Today" value={`$${(stats?.revenue?.today || 0).toLocaleString()}`} />
        <Stat label="This week" value={`$${(stats?.revenue?.week || 0).toLocaleString()}`} />
        <Stat label="This month" value={`$${(stats?.revenue?.month || 0).toLocaleString()}`} />
        <Stat label="Waiting intake" value={String(stats?.intakeQueue || 0)} />
        <Stat label="Approved" value={String(stats?.prescriptionQueue || 0)} />
        <Stat label="Open orders" value={String(stats?.orders?.pending || 0)} />
        <Stat label="Patients" value={String(stats?.patients?.total || 0)} />
        <Stat label="Inbound messages" value={String(stats?.messages || 0)} />
      </div>

      <div>
        <h2 className="text-white font-semibold mb-3">Open a module</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-teal-400/40"
            >
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-white/45 text-sm mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-white/40 text-xs">{label}</p>
      <p className="text-white text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
