'use client';

// ============================================================
// NEW CHART NOTE — Template-driven form (SOAP, Injection, IV, Hormone)
// PRD: lot/batch, consent check, follow-up, post-care
// ============================================================

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type Template = 'soap' | 'injection' | 'iv' | 'hormone' | 'general';

const TEMPLATE_LABELS: Record<Template, string> = {
  soap: 'SOAP Note',
  injection: 'Injection / Injectable',
  iv: 'IV / Vitamin',
  hormone: 'Hormone',
  general: 'General Note',
};

export default function NewChartNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const template = (searchParams.get('template') as Template) || 'general';
  const clientId = searchParams.get('client_id') || '';
  const appointmentId = searchParams.get('appointment_id') || '';

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state — one object for all template fields
  const [form, setForm] = useState<Record<string, string | boolean>>({
    title: '',
    status: 'draft',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    product: '',
    units_syringes: '',
    dilution: '',
    lot: '',
    expiration: '',
    areas: '',
    provider_name: '',
    consent_verified: false,
    complications: '',
    follow_up: '',
    route: '',
    site: '',
    needle: '',
    dosage: '',
    toleration: '',
    protocol: '',
    follow_up_interval: '',
    labs: '',
    response: '',
    post_care: '',
    before_after_notes: '',
  });

  useEffect(() => {
    const t = TEMPLATE_LABELS[template] || 'Note';
    setForm((f) => ({ ...f, title: f.title || `${t} — ${new Date().toLocaleDateString()}` }));
  }, [template]);

  const update = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError('Client is required. Open charting from Calendar or client profile.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        template_type: template,
        title: form.title,
        status: form.status,
      };
      if (template === 'soap') {
        payload.subjective = form.subjective;
        payload.objective = form.objective;
        payload.assessment = form.assessment;
        payload.plan = form.plan;
      }
      if (template === 'injection' || template === 'general') {
        payload.product = form.product;
        payload.units_syringes = form.units_syringes;
        payload.dilution = form.dilution;
        payload.lot = form.lot;
        payload.expiration = form.expiration;
        payload.areas = form.areas;
        payload.provider_name = form.provider_name;
        payload.consent_verified = form.consent_verified;
        payload.complications = form.complications;
        payload.follow_up = form.follow_up;
        payload.post_care = form.post_care;
        payload.before_after_notes = form.before_after_notes;
      }
      if (template === 'general') {
        payload.assessment = form.assessment;
        payload.consent_verified = form.consent_verified;
        payload.follow_up = form.follow_up;
      }
      if (template === 'iv') {
        payload.route = form.route;
        payload.site = form.site;
        payload.needle = form.needle;
        payload.dosage = form.dosage;
        payload.toleration = form.toleration;
        payload.lot = form.lot;
        payload.consent_verified = form.consent_verified;
        payload.follow_up = form.follow_up;
        payload.post_care = form.post_care;
      }
      if (template === 'hormone') {
        payload.protocol = form.protocol;
        payload.follow_up_interval = form.follow_up_interval;
        payload.labs = form.labs;
        payload.response = form.response;
        payload.consent_verified = form.consent_verified;
        payload.follow_up = form.follow_up;
      }

      const res = await fetch('/api/chart-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          appointment_id: appointmentId || null,
          template_type: template,
          title: form.title,
          status: form.status,
          payload: payload,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save');
      }
      const { note } = await res.json();
      router.push(`/admin/charting/${note.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  if (!clientId) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-black">
          <h2 className="font-semibold">Client required</h2>
          <p className="mt-2 text-sm">Open charting from Calendar or a client profile so the note is linked to a client.</p>
          <Link href="/admin/charting" className="inline-block mt-4 text-[#2D63A4] font-medium">← Back to Charting</Link>
        </div>
      </div>
    );
  }

  const backUrl = `/admin/charting?client=${clientId}${appointmentId ? `&appointment=${appointmentId}` : ''}`;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={backUrl} className="text-black hover:underline">← Charting</Link>
        <span className="text-black">/</span>
        <span className="font-semibold text-black">New {TEMPLATE_LABELS[template]}</span>
      </div>

      <h1 className="text-xl font-bold text-black">New chart note — {TEMPLATE_LABELS[template]}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-black mb-1">Title</label>
          <input
            type="text"
            value={form.title as string}
            onChange={(e) => update('title', e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Status</label>
          <select
            value={form.status as string}
            onChange={(e) => update('status', e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white"
          >
            <option value="draft">Draft</option>
            <option value="final">Final</option>
            <option value="locked">Locked</option>
            <option value="amended">Amended</option>
          </select>
        </div>

        {template === 'soap' && (
          <>
            <div><label className="block text-sm font-medium text-black mb-1">Subjective</label><textarea value={form.subjective as string} onChange={(e) => update('subjective', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" rows={2} /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Objective</label><textarea value={form.objective as string} onChange={(e) => update('objective', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" rows={2} /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Assessment</label><textarea value={form.assessment as string} onChange={(e) => update('assessment', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" rows={2} /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Plan</label><textarea value={form.plan as string} onChange={(e) => update('plan', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" rows={2} /></div>
          </>
        )}

        {template === 'general' && (
          <>
            <div><label className="block text-sm font-medium text-black mb-1">Clinical note</label><textarea value={form.assessment as string} onChange={(e) => update('assessment', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" rows={4} placeholder="Free-form note" /></div>
            <label className="flex items-center gap-2 text-black"><input type="checkbox" checked={form.consent_verified as boolean} onChange={(e) => update('consent_verified', e.target.checked)} /> Consent verified</label>
            <div><label className="block text-sm font-medium text-black mb-1">Follow-up</label><input type="text" value={form.follow_up as string} onChange={(e) => update('follow_up', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
          </>
        )}

        {template === 'injection' && (
          <>
            <div><label className="block text-sm font-medium text-black mb-1">Product</label><input type="text" value={form.product as string} onChange={(e) => update('product', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-black mb-1">Units / Syringes</label><input type="text" value={form.units_syringes as string} onChange={(e) => update('units_syringes', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
              <div><label className="block text-sm font-medium text-black mb-1">Dilution</label><input type="text" value={form.dilution as string} onChange={(e) => update('dilution', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-black mb-1">Lot</label><input type="text" value={form.lot as string} onChange={(e) => update('lot', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
              <div><label className="block text-sm font-medium text-black mb-1">Expiration</label><input type="text" value={form.expiration as string} onChange={(e) => update('expiration', e.target.value)} placeholder="MM/YYYY" className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            </div>
            <div><label className="block text-sm font-medium text-black mb-1">Areas</label><input type="text" value={form.areas as string} onChange={(e) => update('areas', e.target.value)} placeholder="e.g. Forehead, glabella" className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Provider</label><input type="text" value={form.provider_name as string} onChange={(e) => update('provider_name', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            <label className="flex items-center gap-2 text-black"><input type="checkbox" checked={form.consent_verified as boolean} onChange={(e) => update('consent_verified', e.target.checked)} /> Consent verified</label>
            <div><label className="block text-sm font-medium text-black mb-1">Complications / Notes</label><textarea value={form.complications as string} onChange={(e) => update('complications', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" rows={2} /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Follow-up</label><input type="text" value={form.follow_up as string} onChange={(e) => update('follow_up', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Post-care</label><textarea value={form.post_care as string} onChange={(e) => update('post_care', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" rows={2} /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Before/after notes</label><textarea value={form.before_after_notes as string} onChange={(e) => update('before_after_notes', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" rows={2} /></div>
          </>
        )}

        {template === 'iv' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-black mb-1">Route</label><input type="text" value={form.route as string} onChange={(e) => update('route', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
              <div><label className="block text-sm font-medium text-black mb-1">Site</label><input type="text" value={form.site as string} onChange={(e) => update('site', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-black mb-1">Needle</label><input type="text" value={form.needle as string} onChange={(e) => update('needle', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
              <div><label className="block text-sm font-medium text-black mb-1">Dosage</label><input type="text" value={form.dosage as string} onChange={(e) => update('dosage', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            </div>
            <div><label className="block text-sm font-medium text-black mb-1">Toleration</label><input type="text" value={form.toleration as string} onChange={(e) => update('toleration', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Lot</label><input type="text" value={form.lot as string} onChange={(e) => update('lot', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            <label className="flex items-center gap-2 text-black"><input type="checkbox" checked={form.consent_verified as boolean} onChange={(e) => update('consent_verified', e.target.checked)} /> Consent verified</label>
            <div><label className="block text-sm font-medium text-black mb-1">Follow-up</label><input type="text" value={form.follow_up as string} onChange={(e) => update('follow_up', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Post-care</label><textarea value={form.post_care as string} onChange={(e) => update('post_care', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" rows={2} /></div>
          </>
        )}

        {template === 'hormone' && (
          <>
            <div><label className="block text-sm font-medium text-black mb-1">Protocol</label><input type="text" value={form.protocol as string} onChange={(e) => update('protocol', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Follow-up interval</label><input type="text" value={form.follow_up_interval as string} onChange={(e) => update('follow_up_interval', e.target.value)} placeholder="e.g. 3 months" className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Labs</label><textarea value={form.labs as string} onChange={(e) => update('labs', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" rows={2} /></div>
            <div><label className="block text-sm font-medium text-black mb-1">Response</label><textarea value={form.response as string} onChange={(e) => update('response', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" rows={2} /></div>
            <label className="flex items-center gap-2 text-black"><input type="checkbox" checked={form.consent_verified as boolean} onChange={(e) => update('consent_verified', e.target.checked)} /> Consent verified</label>
            <div><label className="block text-sm font-medium text-black mb-1">Follow-up</label><input type="text" value={form.follow_up as string} onChange={(e) => update('follow_up', e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white" /></div>
          </>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#234a7a] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save note'}
          </button>
          <Link href={backUrl} className="px-5 py-2.5 bg-white border border-black text-black font-medium rounded-lg hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
