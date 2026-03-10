'use client';

// ============================================================
// WEBSITE / CONTENT — Phase 5 no-code editor
// PRD: Hero, promos, service blurbs, FAQs, membership copy,
//      provider bios, popups, booking CTAs, galleries, SEO
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SECTIONS: { key: string; label: string; type: 'text' | 'textarea'; placeholder?: string }[] = [
  { key: 'hero_headline', label: 'Hero headline', type: 'text', placeholder: 'Hello Gorgeous' },
  { key: 'hero_subhead', label: 'Hero subhead', type: 'text', placeholder: 'Med Spa & Aesthetics' },
  { key: 'hero_cta', label: 'Hero CTA button', type: 'text', placeholder: 'Book Now' },
  { key: 'promo_banner', label: 'Promo banner text', type: 'text', placeholder: 'Optional top banner' },
  { key: 'promo_offer', label: 'Promo / offer block', type: 'textarea', placeholder: 'Current promotion copy' },
  { key: 'membership_blurb', label: 'Membership blurb', type: 'textarea', placeholder: 'Membership benefits copy' },
  { key: 'booking_cta', label: 'Booking CTA text', type: 'text', placeholder: 'Schedule your visit' },
  { key: 'faqs', label: 'FAQs (one per line or JSON)', type: 'textarea', placeholder: 'FAQ content' },
  { key: 'seo_title', label: 'SEO title', type: 'text', placeholder: 'Site title for search' },
  { key: 'seo_description', label: 'SEO description', type: 'textarea', placeholder: 'Meta description' },
];

export default function AdminContentSitePage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/site-content')
      .then((r) => r.json())
      .then((data) => {
        setContent(data.content || {});
      })
      .catch(() => setContent({}))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: string, value: string) => {
    setContent((c) => ({ ...c, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: content }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Website / Content</h1>
          <p className="text-black mt-1">No-code edits: hero, promos, FAQs, membership copy, booking CTAs, SEO.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm text-green-600 font-medium">Saved</span>}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#234a7a] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>}

      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <div key={s.key}>
            <label className="block text-sm font-medium text-black mb-1">{s.label}</label>
            {s.type === 'textarea' ? (
              <textarea
                value={content[s.key] ?? ''}
                onChange={(e) => update(s.key, e.target.value)}
                className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white"
                rows={3}
                placeholder={s.placeholder}
              />
            ) : (
              <input
                type="text"
                value={content[s.key] ?? ''}
                onChange={(e) => update(s.key, e.target.value)}
                className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white"
                placeholder={s.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-black">
        <p className="text-black text-sm">Provider bios, popups, galleries: add in a future iteration or link from Staff / Media.</p>
        <Link href="/admin" className="inline-block mt-3 text-[#2D63A4] font-medium hover:underline">← Dashboard</Link>
      </div>
    </div>
  );
}
