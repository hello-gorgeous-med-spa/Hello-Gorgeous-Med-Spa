'use client';

// ============================================================
// 5 AGENTS RUNBOOK — Weekly checklist so "agents" run without a full-time admin
// Use Square + FB + IG + Google; don't wait on Telnyx.
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="text-xs px-2 py-1 rounded bg-black text-white hover:bg-gray-700 transition-colors shrink-0"
    >
      {copied ? 'Copied!' : `Copy`}
    </button>
  );
}

const BOOK_URL = 'https://www.hellogorgeousmedspa.com/book';
const GLOW_URL = 'https://www.hellogorgeousmedspa.com/glow-event';
const VIP_URL = 'https://www.hellogorgeousmedspa.com/vip-skin-tightening';
const REVIEW_URL = 'https://g.page/r/CYQOWmT_HcwQEBM/review';
const SQUARE_MARKETING = 'https://squareup.com/dashboard/marketing';
const SQUARE_CUSTOMERS = 'https://squareup.com/dashboard/customers';
const GOOGLE_BUSINESS = 'https://business.google.com';

const AGENTS = [
  {
    id: 'social',
    name: 'Agent 1 — Social / Presence',
    job: 'Keep Hello Gorgeous visible on FB, IG, and Google.',
    tasks: [
      { label: 'Post 1–2 Google posts', link: GOOGLE_BUSINESS, note: 'Use Google Post Campaigns copy' },
      { label: 'Post 2–4x Facebook & Instagram', link: null, note: 'Same offers + BTS, client love' },
    ],
    time: '~15 min/week',
  },
  {
    id: 'inbox',
    name: 'Agent 2 — Inbox / Leads',
    job: 'Respond to DMs and contact form so no lead goes cold.',
    tasks: [
      { label: 'Check FB/IG DMs + contact form', link: null, note: 'Reply with template + book link' },
    ],
    time: '~5 min/day',
  },
  {
    id: 'reviews',
    name: 'Agent 3 — Reviews',
    job: 'Get more Google reviews and respond to every one.',
    tasks: [
      { label: 'Ask recent clients for review (email)', link: null, note: 'Use review link in email' },
      { label: 'Respond to new Google/FB reviews', link: GOOGLE_BUSINESS, note: 'Google Business → Reviews' },
    ],
    time: '~10 min/week',
  },
  {
    id: 'calendar',
    name: 'Agent 4 — Fill the Calendar',
    job: 'One Square email per week to drive bookings.',
    tasks: [
      { label: 'Send 1 Square Marketing email', link: SQUARE_MARKETING, note: 'Glow Event, openings, or offer' },
    ],
    time: '~20 min/week',
  },
  {
    id: 'promo',
    name: 'Agent 5 — Promo / Offers',
    job: 'One clear offer everywhere: Google, FB, IG, email.',
    tasks: [
      { label: 'Confirm offer of the week is on all channels', link: null, note: 'Right now: Glow Event' },
    ],
    time: '~5 min/week',
  },
];

export default function AgentsRunbookPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/marketing" className="text-black hover:text-pink-600">← Marketing</Link>
        </div>

        <h1 className="text-2xl font-bold text-black mb-2">5 Agents Runbook</h1>
        <p className="text-black mb-6">
          Run these five &quot;agents&quot; every week with what you have: <strong>Square Marketing</strong>, <strong>Facebook</strong>, <strong>Instagram</strong>, and <strong>Google</strong>. Don&apos;t wait on Telnyx — get your name out there now.
        </p>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a href={GOOGLE_BUSINESS} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-black">
            Google Business
          </a>
          <Link href="/admin/marketing/google-posts" className="px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-sm font-medium text-black">
            Google Post Copy
          </Link>
          <a href={SQUARE_MARKETING} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg text-sm font-medium text-black">
            Square Marketing
          </a>
          <a href={SQUARE_CUSTOMERS} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg text-sm font-medium text-black">
            Square Customers
          </a>
        </div>

        {/* 5 Agents */}
        <div className="space-y-6 mb-10">
          {AGENTS.map((agent) => (
            <div key={agent.id} className="border rounded-xl p-5 bg-white">
              <h2 className="font-bold text-black mb-1">{agent.name}</h2>
              <p className="text-sm text-black mb-3">{agent.job}</p>
              <ul className="space-y-2 mb-3">
                {agent.tasks.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-pink-500 mt-0.5">•</span>
                    <span>
                      {t.link ? (
                        <a href={t.link} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline font-medium">
                          {t.label}
                        </a>
                      ) : (
                        <span className="text-black">{t.label}</span>
                      )}
                      {t.note && <span className="text-black"> — {t.note}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-black">{agent.time}</p>
            </div>
          ))}
        </div>

        {/* Weekly checklist */}
        <div className="border-2 border-violet-200 rounded-xl p-6 bg-violet-50/50">
          <h2 className="font-bold text-black mb-4">Weekly checklist (~1 hour total)</h2>
          <ul className="space-y-2 text-sm text-black">
            <li>□ Post 1–2 Google posts (use Google Post Campaigns)</li>
            <li>□ Post 2–4x on Facebook &amp; Instagram</li>
            <li>□ Reply to DMs and contact form (daily if you can)</li>
            <li>□ Email 5–10 recent clients: &quot;Leave us a Google review&quot; + <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">review link</a></li>
            <li>□ Respond to any new Google/FB reviews</li>
            <li>□ Send 1 Square Marketing email (Glow Event, openings, or offer)</li>
            <li>□ Confirm &quot;offer of the week&quot; is on Google + social + email</li>
          </ul>
        </div>

        {/* DM reply templates */}
        <div className="mt-8 p-6 bg-pink-50/50 border border-pink-100 rounded-xl">
          <h3 className="font-semibold text-black mb-2">DM / contact form reply templates</h3>
          <p className="text-sm text-black mb-4">Copy and paste into FB/IG DMs or email replies. Personalize the bracketed parts.</p>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-xs font-medium text-black mb-1">General inquiry</p>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-black flex-1">Hi! Thanks for reaching out. We&apos;d love to help. What are you most interested in — injectables, weight loss, or something else? You can also book a free consult here: {BOOK_URL}</p>
                <CopyButton text={`Hi! Thanks for reaching out. We'd love to help. What are you most interested in — injectables, weight loss, or something else? You can also book a free consult here: ${BOOK_URL}`} label="general" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-xs font-medium text-black mb-1">Glow Event / promo</p>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-black flex-1">So glad you&apos;re interested! Our Glow Event is running — Botox $10/unit, lip filler $499, free vitamin injection for new clients. Book here and mention Glow Event: {BOOK_URL}</p>
                <CopyButton text={`So glad you're interested! Our Glow Event is running — Botox $10/unit, lip filler $499, free vitamin injection for new clients. Book here and mention Glow Event: ${BOOK_URL}`} label="glow" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-xs font-medium text-black mb-1">Review request (email to recent client)</p>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-black flex-1">If you loved your visit, we&apos;d love a Google review — it helps others find us: {REVIEW_URL}</p>
                <CopyButton text={`If you loved your visit, we'd love a Google review — it helps others find us: ${REVIEW_URL}`} label="review" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA links */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-black mb-3">Links you need every day</h3>
          <div className="grid gap-2 text-sm">
            <p><strong>Book (use in every CTA):</strong> <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline break-all">{BOOK_URL}</a></p>
            <p><strong>Glow Event:</strong> <a href={GLOW_URL} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline break-all">{GLOW_URL}</a></p>
            <p><strong>VIP waitlist:</strong> <a href={VIP_URL} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline break-all">{VIP_URL}</a></p>
            <p><strong>Google review link:</strong> <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline break-all">{REVIEW_URL}</a></p>
          </div>
        </div>

        <p className="mt-6 text-sm text-black">
          Full runbook with templates and Telnyx notes: <code className="bg-gray-100 px-1 rounded">docs/FIVE_AGENTS_RUNBOOK.md</code>
        </p>
      </div>
    </div>
  );
}
