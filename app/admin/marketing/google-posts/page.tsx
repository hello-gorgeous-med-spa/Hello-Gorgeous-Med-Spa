'use client';

// ============================================================
// Google Post Campaigns — Ready-to-use copy for Google Business Profile
// Post 1–2x/week at business.google.com → Posts
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { BOOKING_URL } from '@/lib/flows';
const SPRING_SPECIAL_LASER_URL = 'https://www.hellogorgeousmedspa.com/spring-special-laser-hair';
const GLOW_EVENT_URL = 'https://www.hellogorgeousmedspa.com/glow-event';
const VIP_URL = 'https://www.hellogorgeousmedspa.com/vip-skin-tightening';
const WEIGHT_LOSS_URL = 'https://www.hellogorgeousmedspa.com/glp1-weight-loss';
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

const INJECTION_MENU_URL = 'https://www.hellogorgeousmedspa.com/injection-menu';
const PEPTIDE_BLOG_URL = 'https://www.hellogorgeousmedspa.com/blog/top-peptides-bpc157-sermorelin-ghk-cu-pt141-nad-49-consult-oswego-il';

const BOTOX_URL = 'https://www.hellogorgeousmedspa.com/botox-oswego';

const CAMPAIGNS: Campaign[] = [
  {
    id: 'botox-10-unit',
    title: 'Botox — $10/unit (Oswego)',
    type: 'Offer',
    headline: 'Botox in Oswego — $10/unit · #1 Best Med Spa',
    description: `💉 Honest, published pricing — $10/unit, same for everyone, no membership required.

Ryan Kent, FNP-BC on site 7 days a week · 10+ years injecting · same-day appointments often available. Botox · Dysport · Jeuveau.

Free consultation, every time. Oswego, IL — serving Naperville, Aurora & Plainfield.`,
    ctaText: 'Book consult',
    ctaUrl: BOOKING_URL,
  },
  {
    id: 'botox-ai-pick',
    title: 'Botox — Even AI Picks Us (Social Proof)',
    type: 'Update',
    headline: 'Ask AI Where to Get Botox in Oswego — It Picks Hello Gorgeous',
    description: 'Ask AI "where do I go for Botox in Oswego, IL?" and it points to Hello Gorgeous — licensed FNP-BC injector, authentic FDA-approved product, honest $10/unit pricing, natural results. When even the internet agrees, you know you\'re in good hands. Free consult. (Tip: attach a screenshot of the AI answer when posting.)',
    ctaText: 'Book consult',
    ctaUrl: BOTOX_URL,
  },
  {
    id: 'botox-natural',
    title: 'Botox — Natural, Not Frozen',
    type: 'Update',
    headline: 'Botox in Oswego That Looks Like You — Just Refreshed',
    description: 'We focus on facial balance, conservative dosing & customized plans — softening fine lines while keeping your expressions natural. Never frozen, never overdone. $10/unit, Ryan Kent FNP-BC, authentic FDA-approved product, free consult. Oswego, IL.',
    ctaText: 'Book consult',
    ctaUrl: BOTOX_URL,
  },
  {
    id: 'botox-authentic',
    title: 'Botox — Authentic Product, Real NP',
    type: 'Update',
    headline: 'Real Botox. Real Nurse Practitioner. Real Pricing.',
    description: 'We use only authentic, FDA-approved product from licensed distributors — and Ryan Kent, FNP-BC oversees every protocol on site. No revolving door of providers, no mystery pricing, no upsell pressure. $10/unit Botox in downtown Oswego.',
    ctaText: 'Learn more',
    ctaUrl: BOTOX_URL,
  },
  {
    id: 'botox-vs-dysport',
    title: 'Botox vs Dysport vs Jeuveau',
    type: 'Update',
    headline: 'Botox, Dysport, or Jeuveau — Which Is Right for You?',
    description: 'All three relax the muscles that cause expression lines — the difference is onset, spread & feel. We carry all three to match you to the best one. Botox $10/unit · Dysport $14/unit · Jeuveau $11/unit. Ryan Kent, FNP-BC, Oswego IL. Free consult.',
    ctaText: 'Book consult',
    ctaUrl: BOTOX_URL,
  },
  {
    id: 'botox-naperville',
    title: 'Botox Near Naperville',
    type: 'Update',
    headline: 'Botox Near Naperville — $10/unit, ~15 Min to Oswego',
    description: 'Looking for Botox near Naperville? Hello Gorgeous is just 15 minutes away in downtown Oswego — $10/unit, licensed NP, free consultation. Botox, Dysport & Jeuveau. Same-day often available.',
    ctaText: 'Book consult',
    ctaUrl: 'https://www.hellogorgeousmedspa.com/botox-naperville-il',
  },
  {
    id: 'peptide-49-consult',
    title: 'Peptide Therapy — $49 Consult (Oswego)',
    type: 'Offer',
    headline: 'Peptide Therapy in Oswego — $49 Consult · We Have It All',
    description: `🧬 BPC-157 · Sermorelin · GHK-Cu · Tesamorelin · PT-141 · NAD+ · glutathione & more.

Prescribed & supervised by Ryan Kent, FNP-BC — licensed US pharmacies only. Not internet research peptides.

$49 peptide consultation · medication priced separately. Oswego, IL — serving Naperville, Aurora & Plainfield.`,
    ctaText: 'Book consult',
    ctaUrl: BOOKING_URL,
  },
  {
    id: 'injection-menu',
    title: 'Injection Menu — Peptides & Vitamin Shots',
    type: 'Update',
    headline: 'New Injection Menu — Peptides & Wellness Shots',
    description: 'See our full in-spa injection menu: signature peptide therapies + vitamin wellness shots. PT-141, BPC-157, Sermorelin, NAD+, B12, biotin, MIC & more. Ryan Kent, FNP-BC on every Rx protocol. Download the menu & book your $49 consult.',
    ctaText: 'View menu',
    ctaUrl: INJECTION_MENU_URL,
  },
  {
    id: 'peptide-bpc157',
    title: 'BPC-157 — Recovery Peptide',
    type: 'Update',
    headline: 'BPC-157 — Recovery, Gut Health & Tissue Repair',
    description: 'One of our most-requested peptides for recovery & healing. Medical evaluation required. Prescribed by Ryan Kent, FNP-BC at Hello Gorgeous Oswego. $49 peptide consult — serving Naperville, Aurora & Plainfield.',
    ctaText: 'Learn more',
    ctaUrl: 'https://www.hellogorgeousmedspa.com/peptides/bpc-157',
  },
  {
    id: 'peptide-naperville',
    title: 'Peptide Therapy Near Naperville',
    type: 'Update',
    headline: 'Peptide Therapy Near Naperville — ~15 Min to Oswego',
    description: 'Full peptide menu at Hello Gorgeous: BPC-157, Sermorelin, GHK-Cu, PT-141, NAD+ & more. Ryan Kent, FNP-BC prescribes every protocol. $49 consult. Downtown Oswego at 74 W Washington St.',
    ctaText: 'Book consult',
    ctaUrl: 'https://www.hellogorgeousmedspa.com/peptide-therapy-naperville-il',
  },
  {
    id: 'peptide-top6-blog',
    title: 'Top 6 Peptides Guide (Blog)',
    type: 'Update',
    headline: 'Which Peptide Is Right for You? — Top 6 at Hello Gorgeous',
    description: 'BPC-157, Sermorelin, GHK-Cu, Tesamorelin, PT-141 & NAD+ — what each does and how our $49 consult works. Read the guide from Hello Gorgeous Med Spa Oswego.',
    ctaText: 'Read guide',
    ctaUrl: PEPTIDE_BLOG_URL,
  },
  {
    id: 'peptide-hub',
    title: 'Peptide Education Hub',
    type: 'Update',
    headline: 'Peptide Education Hub — 14 Topics + Handouts',
    description: 'Learn before you commit: our Peptides & Wellness hub covers BPC-157, semaglutide, sermorelin, NAD+ & more. Patient handouts, provider-guided care, Ryan Kent FNP-BC. Oswego · Naperville · Aurora.',
    ctaText: 'Explore hub',
    ctaUrl: 'https://www.hellogorgeousmedspa.com/peptides',
  },
  {
    id: 'our-story-blog',
    title: 'The Story Behind Hello Gorgeous',
    type: 'Update',
    headline: 'From Acne at 12 to Med Spa Owner — Danielle\'s Story',
    description: 'Passion for skin since age 12. Aunt who said "hello gorgeous." 10 years later, half a million in equipment. Get to know the person behind Hello Gorgeous in Oswego. Read the full story.',
    ctaText: 'Read Our Story',
    ctaUrl: 'https://www.hellogorgeousmedspa.com/blog/the-story-behind-hello-gorgeous-oswego-il',
  },
  {
    id: 'spring-special-laser',
    title: 'Spring Special — Laser Hair Removal',
    type: 'Offer',
    headline: 'Spring Special: Underarms $79 • Lip & Chin $59 • Bikini $129',
    description: 'Stop wasting money on packages. Pay per session. Most clients see results in 2–3 sessions. No commitment. Oswego, Aurora, Naperville, Plainfield. Book now.',
    ctaText: 'Claim Offer',
    ctaUrl: SPRING_SPECIAL_LASER_URL,
  },
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
    id: 'aurora-serve',
    title: 'Serving Aurora, IL — 10 Min Away',
    type: 'Update',
    headline: 'Med Spa Near Me? Hello Gorgeous Serves Aurora — 10 Min Away',
    description: 'Botox $10/unit. Fillers, weight loss, Morpheus8 Burst, laser. Free consultation. 74 W Washington St, Oswego. Easy drive from Aurora, North Aurora, Montgomery. Book now.',
    ctaText: 'Book now',
    ctaUrl: BOOKING_URL,
  },
  {
    id: 'botox-faq-blog',
    title: 'Botox vs Dysport vs Jeuveau — FAQ Blog',
    type: 'Update',
    headline: 'Botox vs Dysport vs Jeuveau: Which One Is Right for You?',
    description: 'We offer all three in Oswego. Compare onset, longevity, spread & cost. $10/unit Botox. Your provider helps you decide at your free consultation. Read the full FAQ.',
    ctaText: 'Read FAQ',
    ctaUrl: 'https://www.hellogorgeousmedspa.com/blog/botox-vs-dysport-vs-jeuveau-faq-oswego',
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
    id: 'vip-model-article',
    title: 'VIP Model Program — Complete Guide (Blog)',
    type: 'Update',
    headline: 'VIP Model Program: What\'s Included & How to Get Up to 50% Off',
    description: 'Only 20 spots. Morpheus8 $799, 3-pack $1,999. Solaria $899, Combo $1,499, Trifecta $1,999. $250 deposit secures your spot. Read the full guide to all 6 tiers.',
    ctaText: 'Read guide',
    ctaUrl: 'https://www.hellogorgeousmedspa.com/blog/vip-model-program-complete-guide',
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
    title: 'VIP Skin Tightening — Morpheus8 Burst & Solaria Now Booking',
    type: 'Update',
    headline: 'NEWEST Morpheus8 Burst — Face & Body. Only med spa in the area.',
    description: 'We have the newest Morpheus8 Burst — deepest RF at 8mm for face AND body. Arms, abdomen, thighs, neck. No other med spa in Oswego, Naperville, Aurora, Plainfield has Morpheus8 Burst. Book your consultation.',
    ctaText: 'Book now',
    ctaUrl: BOOKING_URL,
  },
  {
    id: 'morpheus8-burst',
    title: 'Morpheus8 Burst — Newest Technology Face & Body',
    type: 'Update',
    headline: 'Morpheus8 Burst — Newest RF Microneedling for Face & Body',
    description: 'Deepest RF at 8mm. Face, arms, abdomen, thighs, neck. Only Hello Gorgeous in Oswego, Naperville, Aurora, Plainfield has Morpheus8 Burst. Skin tightening, fat reduction, acne scars. Book free consultation.',
    ctaText: 'Learn more',
    ctaUrl: 'https://www.hellogorgeousmedspa.com/services/morpheus8',
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
  const [expandedId, setExpandedId] = useState<string | null>('botox-10-unit');

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
        <p className="text-black mb-6 text-sm bg-gray-50 border rounded-lg px-4 py-3">
          <strong>Google API in Vercel?</strong> Publish the same copy + photo through the app:{' '}
          <Link href="/admin/marketing/post-social" className="text-pink-600 font-semibold hover:underline">
            Post to social
          </Link>
          {' '}→ <em>Google Business — one-click presets</em> → <strong>Post now</strong> (uses{' '}
          <code className="bg-gray-200 px-1 rounded text-xs">/api/social/post</code>).
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
            <li>Use <strong>Event</strong> for one-time things — set start/end date & time to match the landing page.</li>
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
