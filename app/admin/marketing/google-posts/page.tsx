'use client';

// ============================================================
// Google Post Campaigns — Ready-to-use copy for Google Business Profile
// Post 1–2x/week at business.google.com → Posts
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

const BOOKING_URL = 'https://www.hellogorgeousmedspa.com/book';
const GLOW_EVENT_URL = 'https://www.hellogorgeousmedspa.com/glow-event';
const VIP_URL = 'https://www.hellogorgeousmedspa.com/vip-skin-tightening';
const WEIGHT_LOSS_URL = 'https://www.hellogorgeousmedspa.com/services/weight-loss-therapy';
const REVIEW_URL = 'https://g.page/r/CYQOWmT_HcwQEBM/review';

type Campaign = {
  id: string;
  title: string;
  type: 'Offer' | 'Update' | 'Event';
  headline: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
};

const CAMPAIGNS: Campaign[] = [
  {
    id: 'glow-up',
    title: 'Glow-Up Event',
    type: 'Offer',
    headline: 'Glow-Up Event — Limited-Time Specials',
    description: `✨ FREE vitamin injection when you book your consultation
✨ Botox $10/unit (40 units = 10 FREE)
✨ Lip filler $499/syringe
✨ Medical weight loss from $600 for 10 weeks

Mention "Glow Event" when you book. Oswego, IL — serving Naperville, Aurora, Plainfield.`,
    ctaText: 'Book now',
    ctaUrl: BOOKING_URL,
  },
  {
    id: 'botox',
    title: 'Botox $10/unit',
    type: 'Offer',
    headline: 'Botox $10/Unit — 40 Units = 10 FREE',
    description: 'Natural-looking Botox, Dysport & Jeuveau in Oswego. Book 40 units, get 50 total. Limited-time offer. Book online or call (630) 636-6193.',
    ctaText: 'Book now',
    ctaUrl: BOOKING_URL,
  },
  {
    id: 'lip-filler',
    title: 'Lip Filler',
    type: 'Offer',
    headline: 'Lip Filler $499/Syringe — Plump & Natural',
    description: 'Premium dermal fillers for lips that look full and natural. Experienced injectors, personalized results. Book your consultation in Oswego — we serve Naperville, Aurora & Plainfield.',
    ctaText: 'Book now',
    ctaUrl: BOOKING_URL,
  },
  {
    id: 'weight-loss',
    title: 'Weight Loss / GLP-1',
    type: 'Update',
    headline: 'Medical Weight Loss — GLP-1 Programs from $600',
    description: 'Physician-supervised weight loss with tirzepatide. Same-day visits, next-day labs. Start your transformation in Oswego — serving the western suburbs.',
    ctaText: 'Learn more',
    ctaUrl: WEIGHT_LOSS_URL,
  },
  {
    id: 'weight-loss-article',
    title: 'Should I Start Medical Weight Loss? (Blog)',
    type: 'Update',
    headline: 'How Do I Know If I Should Start Medical Weight Loss?',
    description: 'Signs you may benefit from GLP-1 weight loss — plus why Morpheus8 Burst for body (arms, belly, thighs) should be part of your plan. One team for weight loss + skin tightening. Read the full article.',
    ctaText: 'Read article',
    ctaUrl: 'https://www.hellogorgeousmedspa.com/blog/should-i-start-medical-weight-loss-morpheus8-body',
  },
  {
    id: 'vip',
    title: 'VIP Skin Tightening — Morpheus8 & Solaria Now Booking',
    type: 'Update',
    headline: 'Now Booking: Morpheus8 Burst & Solaria CO₂ — Quantum RF Coming Soon',
    description: 'We are officially taking clients for Morpheus8 Burst (face & body) and Solaria CO₂ laser. Quantum RF subdermal contouring coming soon — join the waitlist for priority access.',
    ctaText: 'Book now',
    ctaUrl: BOOKING_URL,
  },
  {
    id: 'hormone',
    title: 'Hormone Therapy',
    type: 'Update',
    headline: 'Hormone Optimization — Energy, Sleep & Mood',
    description: 'Precision hormone therapy with prescriptions, IV therapy, and blood work. Same-day visits, next-day lab results. Serving Oswego, Naperville, Aurora & Plainfield.',
    ctaText: 'Book consultation',
    ctaUrl: BOOKING_URL,
  },
  {
    id: 'first-time',
    title: 'First-Time Client',
    type: 'Offer',
    headline: 'New Here? Free Vitamin Injection When You Book',
    description: "Book your first consultation and get a FREE vitamin injection (B12, Vitamin D, Biotin, or Glutathione). We're in Oswego — easy from Naperville, Aurora & Plainfield.",
    ctaText: 'Book now',
    ctaUrl: BOOKING_URL,
  },
  {
    id: 'reviews',
    title: 'Thank You / Reviews',
    type: 'Update',
    headline: 'Thank You — 5-Star Reviews from Our Clients',
    description: "We're grateful for every review. If you've visited us, we'd love your feedback on Google. It helps others find us when they search for med spa near Oswego, Naperville & Aurora.",
    ctaText: 'Leave a review',
    ctaUrl: REVIEW_URL,
  },
  {
    id: 'fillers',
    title: 'Dermal Fillers',
    type: 'Update',
    headline: 'Dermal Fillers — Cheeks, Lips, Jawline & More',
    description: 'Restore volume and refine contours with expert injectables. Natural results, personalized to you. Book a consultation in Oswego — serving the western suburbs.',
    ctaText: 'Book now',
    ctaUrl: BOOKING_URL,
  },
  {
    id: 'glow-flyer',
    title: 'Glow-Up Event Flyer',
    type: 'Update',
    headline: 'Download Our Glow-Up Event Flyer',
    description: 'Limited-time specials: FREE vitamin injection, Botox $10/unit, lip filler $499, weight loss from $600. Download the flyer and share with a friend. Mention "Glow Event" when you book.',
    ctaText: 'See event',
    ctaUrl: GLOW_EVENT_URL,
  },
];

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
      className="text-xs px-2 py-1 rounded bg-black text-white hover:bg-gray-700 transition-colors"
    >
      {copied ? 'Copied!' : `Copy ${label}`}
    </button>
  );
}

export default function GooglePostsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(CAMPAIGNS[0].id);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/marketing" className="text-black hover:text-pink-600">← Marketing</Link>
        </div>
        <h1 className="text-2xl font-bold text-black mb-2">Google Post Campaigns</h1>
        <p className="text-black mb-6">
          Copy the text below and paste into your{' '}
          <a
            href="https://business.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:underline"
          >
            Google Business Profile
          </a>
          {' '}→ Posts. Post 1–2 times per week for best visibility.
        </p>

        <div className="space-y-4">
          {CAMPAIGNS.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl overflow-hidden bg-white"
            >
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <span className="font-semibold text-black">{c.title}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-black">{c.type}</span>
              </button>
              {expandedId === c.id && (
                <div className="px-4 pb-4 pt-0 border-t space-y-4">
                  <div>
                    <p className="text-xs font-medium text-black mb-1">Headline (for Google)</p>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-black bg-gray-50 p-3 rounded text-sm flex-1">{c.headline}</p>
                      <CopyButton text={c.headline} label="headline" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-black mb-1">Description</p>
                    <div className="flex items-start justify-between gap-2">
                      <pre className="text-black bg-gray-50 p-3 rounded text-sm flex-1 whitespace-pre-wrap font-sans">{c.description}</pre>
                      <CopyButton text={c.description} label="description" />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-black">Button:</span>
                    <span className="text-sm font-medium text-black">{c.ctaText}</span>
                    <span className="text-xs text-black">→</span>
                    <span className="text-sm text-pink-600 break-all">{c.ctaUrl}</span>
                    <CopyButton text={c.ctaUrl} label="URL" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <h2 className="font-semibold text-amber-900 mb-2">Posting tips</h2>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>Use <strong>Offer</strong> for promos (Botox, lip filler, first-time free vitamin). Add an end date if you want.</li>
            <li>Use <strong>Update</strong> for education or news (weight loss, hormone, VIP coming soon, reviews).</li>
            <li>Use <strong>Event</strong> for one-time things like the Glow-Up Event.</li>
            <li>Always set the button link to the URL above so people can book or learn more.</li>
          </ul>
          <p className="mt-4 text-sm text-amber-800">
            Full guide with calendar: <code className="bg-amber-100 px-1 rounded">docs/GOOGLE_POST_CAMPAIGNS.md</code>
          </p>
        </div>
      </div>
    </div>
  );
}
