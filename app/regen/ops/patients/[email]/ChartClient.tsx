'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOpsStaff } from '@/lib/regen/ops-staff';
import { useOpsStaff } from '../../OpsShell';

export default function PatientChartClient({
  email,
  initialData,
}: {
  email: string;
  initialData: Record<string, unknown>;
}) {
  const [data, setData] = useState<Record<string, unknown> | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);
  const staffFromShell = useOpsStaff();
  const [staff, setStaff] = useState<ReturnType<typeof getOpsStaff>>(staffFromShell);

  useEffect(() => {
    setStaff(staffFromShell || getOpsStaff(sessionStorage.getItem('regen-ops-staff')));
  }, [staffFromShell]);

  async function sendMessage() {
    if (!staff || !msg.trim()) return;
    setSending(true);
    const intake = (data?.intakes as Array<{ name?: string }>)?.[0];
    const res = await fetch('/api/regen/ops/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name: intake?.name,
        content: msg,
        staff: { id: staff.id, name: staff.name, email: staff.email },
      }),
    });
    setSending(false);
    if (res.ok) {
      setMsg('');
      const j = await fetch(`/api/regen/ops/chart?email=${encodeURIComponent(email)}`).then((r) => r.json());
      setData(j);
    } else {
      const j = await res.json();
      alert(j.error || 'Send failed');
    }
  }

  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return <p className="text-white/40">Loading chart…</p>;

  const intakes = (data.intakes || []) as Array<Record<string, unknown>>;
  const patient = (data.patient || {}) as Record<string, unknown>;
  const primary = intakes[0] || {};
  const history = (primary.medical_history || {}) as Record<string, unknown>;
  const tirz = history.tirzepatide && typeof history.tirzepatide === 'object'
    ? (history.tirzepatide as Record<string, unknown>)
    : null;
  const shippingFromHistory = (history.shipping || {}) as Record<string, string>;
  const shipping = {
    street1: shippingFromHistory.street1 || String(patient.address_line1 || ''),
    street2: shippingFromHistory.street2 || String(patient.address_line2 || ''),
    city: shippingFromHistory.city || String(patient.city || ''),
    state: shippingFromHistory.state || String(patient.state || ''),
    zip: shippingFromHistory.zip || String(patient.zip || ''),
  };
  const displayName = String(primary.name || [patient.first_name, patient.last_name].filter(Boolean).join(' ') || email);
  const dob = String(history.dob || history.dateOfBirth || patient.date_of_birth || '');
  const consents = (data.consents || []) as Array<Record<string, unknown>>;
  const orders = (data.orders || []) as Array<Record<string, unknown>>;
  const labs = (data.labs || []) as Array<Record<string, unknown>>;
  const audit = (data.audit || []) as Array<Record<string, unknown>>;
  const messages = (data.messages || []) as Array<Record<string, unknown>>;
  const attestations = (data.attestations || []) as Array<Record<string, unknown>>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/ops/patients" className="text-teal-400 text-sm">← Patients</Link>
        <h1 className="text-3xl font-bold text-white mt-2">{displayName}</h1>
        <p className="text-white/50">{email} · {String(primary.phone || patient.phone || 'no phone')} · DOB {dob || '—'} · IL check: {primary.verified_illinois ? 'yes' : 'unknown'}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <h2 className="text-white font-semibold mb-3">Shipping</h2>
          <p className="text-white/70 text-sm">
            {shipping.street1 || 'No street on file'}<br />
            {[shipping.city, shipping.state, shipping.zip].filter(Boolean).join(', ') || 'Add address before Formulation can ship'}
          </p>
          {primary.amount_paid != null && (
            <p className="text-green-400 text-sm mt-3">Paid ${String(primary.amount_paid)} · {String(primary.stripe_payment_intent_id || '')}</p>
          )}
        </section>
        <section className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <h2 className="text-white font-semibold mb-3">Visit</h2>
          <p className="text-white/70 text-sm">Goal: {String(primary.goal || '—')}</p>
          <p className="text-white/70 text-sm">Program: {String(history.program || '—')}</p>
          <p className="text-white/70 text-sm">Status: {String(primary.status || '—').replace(/_/g, ' ')}</p>
          {tirz && (
            <p className="text-pink-300 text-sm mt-2">
              Requested tirz: {String(tirz.requestLabel || `${tirz.weeklyMg} mg/week · ${tirz.termDays} days`)}
              {tirz.vials != null ? ` · ${String(tirz.vials)} vial(s)` : ''}
              {tirz.retail != null ? ` · $${String(tirz.retail)}` : ''}
            </p>
          )}
          <Link href="/ops" className="inline-block mt-3 text-teal-400 text-sm">Act on Today queue →</Link>
        </section>
      </div>

      <section className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h2 className="text-white font-semibold mb-3">Screening</h2>
        {Object.keys(history).filter((k) => k !== 'shipping' && k !== 'tirzepatide' && k !== 'program').length === 0 && (
          <p className="text-white/40 text-sm">No screening answers stored.</p>
        )}
        <dl className="space-y-2 text-sm">
          {Object.entries(history).filter(([k]) => k !== 'shipping' && k !== 'tirzepatide').map(([k, v]) => (
            <div key={k}>
              <dt className="text-white/40">{k}</dt>
              <dd className="text-white">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h2 className="text-white font-semibold mb-3">Signed consent</h2>
        {consents.length === 0 && <p className="text-white/40 text-sm">No stored consent yet.</p>}
        {consents.map((c) => (
          <details key={String(c.id)} className="mb-3">
            <summary className="text-teal-300 cursor-pointer">
              {String(c.treatment_category)} · v{String(c.consent_version)} · {c.signed_at ? new Date(String(c.signed_at)).toLocaleString() : ''}
            </summary>
            <pre className="mt-2 text-xs text-white/70 whitespace-pre-wrap max-h-64 overflow-auto">{String(c.consent_document || '')}</pre>
          </details>
        ))}
      </section>

      <section className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h2 className="text-white font-semibold mb-3">Labs</h2>
        {labs.length === 0 && <p className="text-white/40 text-sm">No labs on file.</p>}
        {labs.map((l) => (
          <p key={String(l.id)} className="text-white/70 text-sm">{String(l.lab_type)} · {String(l.status)}</p>
        ))}
      </section>

      <section className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h2 className="text-white font-semibold mb-3">Orders</h2>
        {orders.length === 0 && <p className="text-white/40 text-sm">No pharmacy orders yet.</p>}
        {orders.map((o) => (
          <p key={String(o.id)} className="text-white/70 text-sm">
            {String(o.order_number)} · {String(o.status)}
            {o.pharmacy_order_id ? ` · Formulation ${o.pharmacy_order_id}` : ' · send in Formulation if needed'}
            {o.tracking_number ? ` · ${o.tracking_number}` : ''}
            {o.pharmacy_error ? ` · ${o.pharmacy_error}` : ''}
          </p>
        ))}
      </section>

      <section className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h2 className="text-white font-semibold mb-3">Message patient</h2>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white min-h-[90px] mb-2" placeholder="This emails the patient from provider@" />
        <button disabled={sending || !msg.trim()} onClick={sendMessage} className="px-4 py-2 rounded-lg bg-teal-500 text-white text-sm disabled:opacity-40">Send email</button>
        <div className="mt-4 space-y-2">
          {messages.map((m) => (
            <p key={String(m.id)} className="text-white/60 text-sm">{String(m.created_at || '')} · {String(m.sender_name || m.sender || m.direction)}: {String(m.content || m.message)}</p>
          ))}
        </div>
      </section>

      <section className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h2 className="text-white font-semibold mb-3">Timeline</h2>
        {attestations.map((a) => (
          <p key={String(a.id)} className="text-white/60 text-sm">Attestation by {String(a.provider_name)} · {String(a.action)} · {String(a.attested_at)}</p>
        ))}
        {audit.map((a) => (
          <p key={String(a.id)} className="text-white/50 text-xs">{String(a.created_at)} · {String(a.actor_email || a.actor_type)} · {String(a.action)}</p>
        ))}
        {audit.length === 0 && attestations.length === 0 && <p className="text-white/40 text-sm">No audit events yet.</p>}
      </section>
    </div>
  );
}
