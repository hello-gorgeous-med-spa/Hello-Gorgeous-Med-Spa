'use client';

// ============================================================
// MARKETING CENTER — Phase 5
// PRD: SMS/email campaigns, segments, promos, lead capture,
//      referral, review requests, reactivation. Audience filters.
// ============================================================

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const AUDIENCE_FILTERS = [
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

type Campaign = { id: string; name: string; channel: string; status: string; created_at: string };
type Segment = { id: string; name: string; filter_id: string; count_estimate?: number };

function MarketingContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'overview' | 'campaigns' | 'segments' | 'promos' | null;
  const [tab, setTab] = useState<'overview' | 'campaigns' | 'segments' | 'promos'>(tabParam && ['overview', 'campaigns', 'segments', 'promos'].includes(tabParam) ? tabParam : 'overview');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tabParam && ['overview', 'campaigns', 'segments', 'promos'].includes(tabParam)) setTab(tabParam);
  }, [tabParam]);

  const fetchData = useCallback(async () => {
    try {
      const [cRes, sRes] = await Promise.all([
        fetch('/api/marketing/campaigns').then((r) => r.json()),
        fetch('/api/marketing/segments').then((r) => r.json()),
      ]);
      setCampaigns(cRes.campaigns || []);
      setSegments(sRes.segments || []);
    } catch {
      setCampaigns([]);
      setSegments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Marketing</h1>
        <p className="text-black mt-1">Campaigns, segments, promos, lead capture, referral, reviews, reactivation.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-black pb-2">
        <Link
          href="/admin/marketing/post-social"
          className="ml-auto px-3 py-1.5 text-sm font-medium rounded-lg bg-[#2D63A4] text-white hover:bg-[#234a7a] order-last sm:order-none"
        >
          Post to Social →
        </Link>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'campaigns', label: 'Campaigns' },
          { id: 'segments', label: 'Segments' },
          { id: 'promos', label: 'Promos' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t.id ? 'bg-[#2D63A4] text-white' : 'bg-white text-black border border-black hover:bg-gray-50'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: '/admin/marketing/post-social', icon: '📲', title: 'Post to Social', desc: 'Google Business, Facebook, Instagram from one screen' },
            { onClick: () => setTab('campaigns'), icon: '📧', title: 'SMS / Email campaigns', desc: 'Create and send campaigns to segments' },
            { onClick: () => setTab('segments'), icon: '👥', title: 'Audience segments', desc: 'Never booked, no visit 90d, VIP, birthday, and more' },
            { onClick: () => setTab('promos'), icon: '🏷️', title: 'Promos & offers', desc: 'Banners, landing promos, seasonal offers' },
            { icon: '📥', title: 'Lead capture', desc: 'Forms, waitlist, feature leads' },
            { icon: '🤝', title: 'Referral', desc: 'Refer-a-friend programs' },
            { icon: '⭐', title: 'Review requests', desc: 'Post-visit review prompts' },
            { icon: '🔄', title: 'Reactivation', desc: 'Re-engage lapsed clients' },
            { icon: '📞', title: 'Missed-call text-back', desc: 'Auto reply to missed calls' },
          ].map((card) => {
            const cardClass =
              'group text-left rounded-xl border-2 border-black p-4 bg-white hover:bg-[#2D63A4] hover:text-white hover:border-[#2D63A4] transition-colors block w-full';
            const inner = (
              <>
                <span className="text-2xl block mb-2">{card.icon}</span>
                <div className="font-semibold text-black group-hover:text-white">{card.title}</div>
                <div className="text-sm mt-1 opacity-90">{card.desc}</div>
              </>
            );
            if ('href' in card && card.href) {
              return (
                <Link key={card.title} href={card.href} className={cardClass}>
                  {inner}
                </Link>
              );
            }
            return (
              <button key={card.title} type="button" onClick={card.onClick} className={cardClass}>
                {inner}
              </button>
            );
          })}
        </div>
      )}

      {tab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-black">Campaigns</h2>
            <Link href="/admin/sms" className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700">Send SMS (Twilio)</Link>
            <Link href="/admin/marketing/campaigns/new" className="px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#234a7a]">+ New campaign</Link>
          </div>
          {loading ? (
            <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ) : campaigns.length === 0 ? (
            <div className="bg-white rounded-xl border border-black p-8 text-center text-black">
              <p>No campaigns yet. Create one to send SMS or email to a segment.</p>
              <Link href="/admin/marketing/campaigns/new" className="inline-block mt-3 text-[#2D63A4] font-medium">+ New campaign</Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-black overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-black">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-black">Name</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-black">Channel</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-black">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-black">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-black">{c.name}</td>
                      <td className="px-4 py-3 text-black text-sm">{c.channel}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-black">{c.status}</span></td>
                      <td className="px-4 py-3 text-black text-sm">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'segments' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-black">Audience segments</h2>
            <Link href="/admin/marketing/segments/new" className="px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#234a7a]">+ New segment</Link>
          </div>
          <p className="text-black text-sm">Audience filters: never booked, no visit 90d, Botox/filler/weight/hormone, birthday, VIP, abandoned booking, high-value.</p>
          {loading ? (
            <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AUDIENCE_FILTERS.map((f) => {
                const seg = segments.find((s) => s.filter_id === f.id);
                return (
                  <div key={f.id} className="bg-white rounded-xl border border-black p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-black">{f.label}</div>
                      {seg && <div className="text-sm text-black">Segment: {seg.name}</div>}
                    </div>
                    {seg ? <span className="text-xs text-gray-600">Saved</span> : <Link href={`/admin/marketing/segments/new?filter=${f.id}`} className="text-sm text-[#2D63A4] font-medium">Create segment →</Link>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'promos' && (
        <div className="bg-white rounded-xl border border-black p-8 text-center text-black">
          <span className="text-4xl block mb-2">🏷️</span>
          <h2 className="font-semibold">Promos & offers</h2>
          <p className="text-sm mt-1">Banners, landing promos, seasonal pricing. Configure in Website/Content or a future Promos builder.</p>
          <Link href="/admin/content/site" className="inline-block mt-4 text-[#2D63A4] font-medium">Website / Content →</Link>
        </div>
      )}

      <div className="pt-4">
        <Link href="/admin" className="text-[#2D63A4] font-medium hover:underline">← Dashboard</Link>
      </div>
    </div>
  );
}

export default function AdminMarketingPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <MarketingContent />
    </Suspense>
  );
}
