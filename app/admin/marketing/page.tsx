'use client';

// ============================================================
// MARKETING HUB — In-house SMS & campaign management
// Everything runs here; no need to hire an agency or outside partner
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const TIERS = [
  {
    id: 'tier1',
    title: 'Tier 1: Basic SMS Blast',
    description: 'Send text campaigns to all clients with SMS opt-in or a custom list. Quick templates, low cost per message.',
    href: '/admin/sms',
    cta: 'Send SMS Campaign',
    icon: '📱',
  },
  {
    id: 'tier2',
    title: 'Tier 2: Premium SMS + Images',
    description: 'Same as Basic plus MMS: attach a promo image or graphic to your message for higher engagement.',
    href: '/admin/sms',
    cta: 'Send MMS Campaign',
    icon: '🖼️',
  },
  {
    id: 'tier3',
    title: 'Tier 3: Full Service Campaign',
    description: 'Automations, segments, templates, and ROI tracking. Reminders, birthdays, win-backs, and one-off blasts.',
    href: '/admin/marketing/automation',
    cta: 'Open Campaigns & Automation',
    icon: '⚡',
  },
  {
    id: 'tier4',
    title: 'Tier 4: Contact Collection',
    description: 'Build your list: import CSV, share sign-up link, manage preferences. Contacts feed into SMS and email.',
    href: '/admin/marketing/contacts',
    cta: 'Manage Contacts',
    icon: '📋',
  },
];

export default function MarketingHubPage() {
  const [expandedTier, setExpandedTier] = useState<string | null>(TIERS[0].id);
  const [stats, setStats] = useState<{
    smsOptInCount: number;
    totalWithPhone: number;
    totalClients: number;
    optInRate: string;
  } | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/sms/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch SMS stats:', err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">
      {/* Hero — dark navy, value prop + Hello Gorgeous mascot */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/characters/hello-gorgeous-mascot.png"
              alt="Hello Gorgeous"
              width={120}
              height={120}
              className="rounded-2xl object-contain drop-shadow-lg"
              priority
            />
        </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-amber-300/95 drop-shadow-sm">
            Hello Gorgeous Marketing
          </h1>
          <p className="mt-4 text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto">
            Run your entire SMS marketing here. Add contacts, write your message, and send—all in this system. No need to hire an agency or outside partner.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            All of this lives in your app. No Boots AI or third-party marketing agency required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/admin/sms"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition-colors shadow-lg"
            >
              🚀 Send SMS Campaign
            </Link>
            <Link
              href="/admin/marketing/contacts"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-amber-400/60 text-amber-300 font-medium hover:bg-amber-400/10 transition-colors"
            >
              📋 Contact Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Tiers — accordion on dark */}
      <section className="flex-1 bg-slate-800 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-slate-200 mb-6">What you can do</h2>
          <div className="space-y-0 rounded-xl overflow-hidden border border-slate-600/50 bg-slate-800/80">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className="border-b border-slate-600/50 last:border-0"
              >
                    <button
                  onClick={() => setExpandedTier(expandedTier === tier.id ? null : tier.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-700/40 transition-colors"
                >
                  <span className="text-lg text-slate-100 font-medium flex items-center gap-3">
                    <span className="text-2xl opacity-90">{tier.icon}</span>
                    {tier.title}
                        </span>
                  <span className="text-slate-400 text-2xl leading-none">
                    {expandedTier === tier.id ? '−' : '+'}
                        </span>
                </button>
                {expandedTier === tier.id && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-slate-400 text-sm mb-4">{tier.description}</p>
                    <Link
                      href={tier.href}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium text-sm hover:bg-amber-400 transition-colors"
                    >
                      {tier.cta} →
                    </Link>
        </div>
      )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign performance — “Client Dashboard” style */}
      <section className="bg-slate-900 px-4 py-10 border-t border-slate-700">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">SMS campaign performance</h2>
          <p className="text-slate-400 text-sm mb-6">
            View your reach and opt-in stats. Send blasts from SMS Campaigns; track results here.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-300">
                {stats ? stats.smsOptInCount.toLocaleString() : '—'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Clients with SMS opt-in</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-200">
                {stats ? stats.totalWithPhone.toLocaleString() : '—'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Clients with phone</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-200">
                {stats ? stats.totalClients.toLocaleString() : '—'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Total clients</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-200">
                {stats ? `${stats.optInRate}%` : '—'}
              </p>
              <p className="text-xs text-slate-400 mt-1">SMS opt-in rate</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/sms"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-900 font-medium text-sm hover:bg-amber-400 transition-colors"
            >
              Send campaign
            </Link>
            <Link
              href="/admin/marketing/automation"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-500 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors"
            >
              Campaigns & automation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
