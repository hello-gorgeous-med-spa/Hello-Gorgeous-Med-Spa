'use client';

import { useState } from 'react';

interface PrescriptionRequest {
  id: string;
  patient: { name: string; email: string };
  product: string;
  strength: string;
  status: 'awaiting-review' | 'approved' | 'denied' | 'sent-to-pharmacy';
  submitted: string;
  notes?: string;
}

const STATUS_CONFIG = {
  'awaiting-review': { label: 'Awaiting Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: '⏳' },
  'approved': { label: 'Approved', color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: '✅' },
  'denied': { label: 'Denied', color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: '❌' },
  'sent-to-pharmacy': { label: 'Sent to Pharmacy', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30', icon: '💊' },
};

const SAMPLE_PRESCRIPTIONS: PrescriptionRequest[] = [
  { id: 'RX-001', patient: { name: 'Sarah Mitchell', email: 'sarah.m@email.com' }, product: 'Semaglutide / B6', strength: '4mL · 2.5mg/10mg/mL', status: 'awaiting-review', submitted: '1 hour ago' },
  { id: 'RX-002', patient: { name: 'Michael Rodriguez', email: 'mrodriguez@email.com' }, product: 'Tirzepatide / B6', strength: '2mL · 12.5mg/10mg/mL', status: 'awaiting-review', submitted: '3 hours ago' },
  { id: 'RX-003', patient: { name: 'Jennifer Lee', email: 'jlee@email.com' }, product: 'B12 + Biotin', strength: '10mL each', status: 'approved', submitted: '1 day ago' },
  { id: 'RX-004', patient: { name: 'David Kim', email: 'dkim@email.com' }, product: 'NAD+ Injection', strength: '10mL · 200mg/mL', status: 'sent-to-pharmacy', submitted: '2 days ago' },
  { id: 'RX-005', patient: { name: 'Emily Johnson', email: 'emily.j@email.com' }, product: 'Testosterone Cypionate', strength: '10mL · 200mg/mL', status: 'awaiting-review', submitted: '5 hours ago' },
];

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(SAMPLE_PRESCRIPTIONS);
  const [filter, setFilter] = useState<'all' | 'awaiting-review' | 'approved' | 'denied' | 'sent-to-pharmacy'>('awaiting-review');

  const filtered = prescriptions.filter((rx) => filter === 'all' || rx.status === filter);
  const awaitingCount = prescriptions.filter((rx) => rx.status === 'awaiting-review').length;

  const updateStatus = (id: string, status: PrescriptionRequest['status']) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === id ? { ...rx, status } : rx))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Prescriptions</h1>
          <p className="text-white/50">Rx queue for Ryan&apos;s review</p>
        </div>
        {awaitingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-xl border border-amber-500/30">
            <span className="animate-pulse text-amber-400">●</span>
            <span className="text-amber-300 font-medium">{awaitingCount} awaiting review</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 bg-white/5 rounded-xl p-1.5 overflow-x-auto">
        {[
          { id: 'all', label: 'All' },
          { id: 'awaiting-review', label: '⏳ Awaiting Review' },
          { id: 'approved', label: '✅ Approved' },
          { id: 'sent-to-pharmacy', label: '💊 Sent' },
          { id: 'denied', label: '❌ Denied' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-teal-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filtered.map((rx) => (
          <div
            key={rx.id}
            className={`bg-white/5 rounded-2xl p-6 border transition-all ${
              rx.status === 'awaiting-review' ? 'border-amber-500/30' : 'border-white/10'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {rx.patient.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-semibold">{rx.patient.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[rx.status].color}`}>
                      {STATUS_CONFIG[rx.status].icon} {STATUS_CONFIG[rx.status].label}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm">{rx.patient.email}</p>
                  <div className="mt-2 p-3 bg-white/5 rounded-lg">
                    <p className="text-white font-medium">{rx.product}</p>
                    <p className="text-white/50 text-sm">{rx.strength}</p>
                  </div>
                  <p className="text-white/40 text-xs mt-2">Submitted {rx.submitted}</p>
                </div>
              </div>

              {rx.status === 'awaiting-review' && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => updateStatus(rx.id, 'approved')}
                    className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-400 transition-colors"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => updateStatus(rx.id, 'sent-to-pharmacy')}
                    className="px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-400 transition-colors"
                  >
                    💊 Send to Pharmacy
                  </button>
                  <button
                    onClick={() => updateStatus(rx.id, 'denied')}
                    className="px-4 py-2 bg-red-500/20 text-red-300 text-sm font-medium rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    ✕ Deny
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50 text-lg">No prescriptions in this queue</p>
          <p className="text-white/30 text-sm mt-1">Check back later or view all prescriptions</p>
        </div>
      )}
    </div>
  );
}
