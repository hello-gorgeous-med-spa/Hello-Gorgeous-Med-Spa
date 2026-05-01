"use client";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

type Block = {
  slug: string;
  title: string;
  summary?: string;
  body: React.ReactNode;
};

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "What is RF microneedling?",
    answer:
      "Radiofrequency microneedling combines ultra-fine needles with heat. The needles open thousands of microchannels; the RF heats deeper tissue. The result is the strongest collagen and elastin response any non-surgical device can produce — real lifting and tightening without a knife.",
  },
  {
    question: "How is RF microneedling different from regular microneedling?",
    answer:
      "Standard microneedling goes 1–2mm deep with no heat. RF microneedling reaches up to 8mm and adds bipolar RF — that's where actual lifting and fat-pad shrinking happen. Standard improves texture; RF reshapes face and body.",
  },
  {
    question: "Which device do you use?",
    answer:
      "Morpheus8 by InMode — including the deeper Morpheus8 Burst at up to 8mm for body. Want the technical breakdown? See our Morpheus8 deep-dive page.",
  },
  {
    question: "What can it treat?",
    answer:
      "Acne scars, fine lines, deep wrinkles, jowls, neck laxity, double chin, stretch marks, sun damage, large pores, body areas (abdomen, arms, knees). One of the few treatments that tightens AND dissolves unwanted fat in the right zones.",
  },
  {
    question: "How many sessions do I need?",
    answer:
      "Most patients book 3 sessions spaced 4–6 weeks apart. You'll see texture improvements after one; full collagen remodeling continues 3–6 months after the last session.",
  },
  {
    question: "Pricing?",
    answer:
      "Single-area sessions $600–$1,200 depending on size and depth. Full-face packages of 3 are $1,800–$2,800. Body areas quoted at consult. We bundle with PRP/PRF, peels, and Botox at preferred pricing.",
  },
  {
    question: "Does it hurt?",
    answer:
      "We numb you 45–60 minutes with medical-grade topical numbing. Most patients describe warmth and pressure. Body areas are more intense; we never push past your tolerance.",
  },
  {
    question: "Downtime?",
    answer:
      "2–5 days of redness and pinpoint marks (sunburn-like). Mild swelling day 1–2. Back to work in 24–48 hours. Makeup at 24h. Body areas: back to gym after 5 days.",
  },
  {
    question: "Safe for darker skin tones?",
    answer:
      "Yes — a major advantage over lasers. RF bypasses melanin, so RF microneedling is safe for Fitzpatrick types I through VI. We adjust depth and energy based on your skin, not a chart.",
  },
  {
    question: "Can I combine it with other treatments?",
    answer:
      "Yes. Common combos: Morpheus8 + PRP/PRF (faster healing, hair regrowth), + Botox (full facial reset), + chemical peel (tone), + CO₂ laser (max non-surgical reset over a longer plan).",
  },
  {
    question: "Who shouldn't get it?",
    answer:
      "Active pregnancy, active herpes outbreak in treatment area, active uncleared acne breakout, certain electronic implants, isotretinoin within 6 months, active infection. We screen at consult.",
  },
  {
    question: "How long do results last?",
    answer:
      "1–2 years on the face with healthy skincare. Body results last as long as your weight stays stable. Most book a single maintenance every 12–18 months.",
  },
];

const SECTIONS: Block[] = [
  {
    slug: "what-it-treats",
    title: "What RF microneedling treats",
    summary: "The most-requested concerns we treat with Morpheus8 every week.",
    body: (
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-black/85 font-medium">
        {[
          "Acne scars (boxcar, ice-pick, rolling)",
          "Fine lines & wrinkles",
          "Sagging jowls & jawline",
          "Neck laxity (tech neck, turkey neck)",
          "Double chin (submental fat)",
          "Stretch marks (abdomen, hips, thighs)",
          "Sun damage & uneven texture",
          "Enlarged pores",
          "Skin laxity on knees, arms, elbows",
          "Loose abdominal skin (post-baby)",
          "Body contouring (abdomen, flanks)",
          "Hormonal melasma (carefully selected)",
        ].map((item) => (
          <li key={item} className="flex gap-2 leading-relaxed">
            <span className="text-[#E6007E]" aria-hidden>
              ▸
            </span>
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    slug: "how-it-works",
    title: "How RF microneedling actually works",
    summary: "What's happening at the cellular level — in plain English.",
    body: (
      <ol className="space-y-3 list-decimal pl-5 text-black/85 font-medium leading-relaxed">
        <li>
          <strong className="text-black">Step 1 — micro-injuries.</strong> Ultra-fine, gold-coated needles create thousands of controlled channels in your skin. Skin treats this as injury → triggers wound-healing response.
        </li>
        <li>
          <strong className="text-black">Step 2 — RF heat.</strong> Bipolar radiofrequency travels between the needle tips, heating tissue at depths up to 8mm. Heat denatures old collagen and signals fibroblasts to make new collagen + elastin.
        </li>
        <li>
          <strong className="text-black">Step 3 — adipose response.</strong> At deeper settings, RF heat shrinks fat cells in the treatment zone — useful for jowls, double chin, lower abdomen.
        </li>
        <li>
          <strong className="text-black">Step 4 — remodeling (3–6 months).</strong> New collagen weaves underneath your existing skin. Skin tightens, scars fill in, texture refines. Photos at every visit prove it.
        </li>
        <li>
          <strong className="text-black">Step 5 — maintenance.</strong> One session every 12–18 months keeps you ahead of the aging curve.
        </li>
      </ol>
    ),
  },
  {
    slug: "vs-alternatives",
    title: "RF microneedling vs. the alternatives",
    summary: "Why we pick Morpheus8 over lasers, threads, or fillers for these concerns.",
    body: (
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <table className="w-full text-sm text-black/85 min-w-[640px]">
          <thead className="bg-[#FFF0F7] text-black">
            <tr>
              <th className="text-left p-3 font-bold">Treatment</th>
              <th className="text-left p-3 font-bold">Best for</th>
              <th className="text-left p-3 font-bold">Downtime</th>
              <th className="text-left p-3 font-bold">Skin tone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            <tr className="bg-white">
              <td className="p-3 font-bold text-[#E6007E]">RF microneedling (Morpheus8)</td>
              <td className="p-3">Tightening, scars, jowls, body contour</td>
              <td className="p-3">2–5 days</td>
              <td className="p-3">All (I–VI)</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Standard microneedling</td>
              <td className="p-3">Texture, light scarring</td>
              <td className="p-3">1–2 days</td>
              <td className="p-3">All</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">CO₂ laser (Solaria)</td>
              <td className="p-3">Deep wrinkles, sun damage, pigment</td>
              <td className="p-3">5–10 days</td>
              <td className="p-3">Lighter (with care)</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">PDO threads</td>
              <td className="p-3">Immediate lift</td>
              <td className="p-3">2–4 days</td>
              <td className="p-3">All</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Filler</td>
              <td className="p-3">Volume loss</td>
              <td className="p-3">1 day</td>
              <td className="p-3">All</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-black/60 mt-3 px-1">
          We carry every option above. We pick based on your face — not the device we're trying to sell.
        </p>
      </div>
    ),
  },
  {
    slug: "what-to-expect",
    title: "Your first RF microneedling appointment",
    summary: "Walk-in to walk-out. No surprises at the chair.",
    body: (
      <ol className="space-y-3 list-decimal pl-5 text-black/85 font-medium leading-relaxed">
        <li>
          <strong className="text-black">Consultation.</strong> 20 minutes. We map zones, discuss depth, set realistic expectations, photograph baseline. You leave with a written quote.
        </li>
        <li>
          <strong className="text-black">Numbing.</strong> 45–60 minutes of medical-grade topical. Some clients add nitrous (Pronox) for extra comfort.
        </li>
        <li>
          <strong className="text-black">Treatment.</strong> 30–60 minutes depending on zones. We sweep the device in passes; depth changes with the area.
        </li>
        <li>
          <strong className="text-black">Soothing protocol.</strong> Cool compresses, hyaluronic acid serum, post-care kit you take home (cleanser + recovery balm + SPF).
        </li>
        <li>
          <strong className="text-black">Follow-up call.</strong> 48h later — we make sure healing is on track.
        </li>
        <li>
          <strong className="text-black">Photos at every visit.</strong> Standardized lighting. The progress is measurable, not vibes.
        </li>
      </ol>
    ),
  },
  {
    slug: "service-area",
    title: "Where we are · who we serve",
    summary:
      "Morpheus8 patients drive in from across the western suburbs. Free parking, evening + Saturday hours, and a calendar that opens on Sundays.",
    body: (
      <div className="space-y-3 text-black/85 font-medium leading-relaxed">
        <p>
          We see RF microneedling patients from <strong>Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery, Sugar Grove, Geneva, and Bolingbrook</strong>. Most clients are within a 15-minute drive.
        </p>
        <p>
          Coming from further out? We block back-to-back appointments together so you can do Morpheus8 + Botox + a peel in one visit and recover at home in peace.
        </p>
        <p className="text-sm text-black/70">
          Want the deepest technical breakdown? See our <Link href="/services/morpheus8" className="underline decoration-[#E6007E]">Morpheus8 deep-dive page</Link>.
        </p>
        <p className="text-sm text-black/70">
          Address: see <Link href="/contact" className="underline decoration-[#E6007E]">contact page</Link>. Phone:{" "}
          <a href={`tel:${SITE.phone}`} className="font-bold underline decoration-[#E6007E]">
            {SITE.phone}
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    slug: "pricing",
    title: "Pricing & payment",
    summary: "Transparent quoted at consult — no upsell at the chair.",
    body: (
      <div className="space-y-3 text-black/85 font-medium leading-relaxed">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {[
            "Single-area session: $600–$1,200",
            "Full-face package of 3: $1,800–$2,800",
            "Body areas (abdomen, neck, arms): consult quote",
            "Add PRP/PRF: $250 per session",
            "Add chemical peel same visit: bundled",
            "Maintenance session 12–18 mo: preferred pricing",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-[#E6007E]" aria-hidden>
                ▸
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p>We accept:</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {[
            "Visa / Mastercard / Amex",
            "FSA / HSA cards (eligible)",
            "Apple Pay / Google Pay",
            "CareCredit & Cherry financing",
            "Square gift cards",
            "Cash or check",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-[#E6007E]" aria-hidden>
                ▸
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    slug: "faq",
    title: "Frequently asked questions",
    summary: "Twelve straight answers we wish every chain spa would publish.",
    body: (
      <dl className="space-y-0 border-t-2 border-black/10 mt-2">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} className="border-b border-black/10 last:border-b-0">
            <dt className="pt-6 pb-2">
              <span className="text-lg font-bold text-[#E6007E] flex items-start gap-2">
                <span className="text-black mt-0.5" aria-hidden>
                  ▸
                </span>
                {item.question}
              </span>
            </dt>
            <dd className="pb-6 pl-6 text-black/85 leading-relaxed font-medium">{item.answer}</dd>
          </div>
        ))}
      </dl>
    ),
  },
];

export function MicroneedlingRfPageContent() {
  return (
    <div className="relative min-h-[100dvh] touch-pan-y">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 0% 70%, ${BRAND.pink}18 0%, transparent 45%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <main className="min-w-0">
        <Section className="relative border-b-4 border-black py-16 lg:py-24 !px-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${BRAND.pink} 0%, transparent 45%),
                radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, ${BRAND.pink}33 0%, transparent 35%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-[#E6007E] animate-pulse" aria-hidden />
                Morpheus8 · Burst · Quantum
              </div>
              <p className="text-sm md:text-base uppercase tracking-widest text-[#FFB8DC] font-semibold mb-4">
                Oswego · Naperville · Aurora · Plainfield · Yorkville
              </p>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white drop-shadow-lg">
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  RF microneedling
                </span>{" "}
                in Oswego
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
                Real skin tightening, acne-scar repair, and body contouring with Morpheus8 — up to 8mm deep, safe for every skin tone, no scalpel. Free 20-minute consult and a written quote before any device touches your skin. Call{" "}
                <a href={`tel:${SITE.phone}`} className="font-bold text-[#FFB8DC] hover:text-white underline decoration-[#E6007E]">
                  {SITE.phone}
                </a>
                .
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOKING_URL} variant="gradient" className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]">
                  Book a free consult
                </CTA>
                <CTA href="#faq" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black">
                  See FAQ
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section className="!py-12 border-b-4 border-black bg-white/70 backdrop-blur-sm">
          <nav aria-label="Page topics" className="max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-sm font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#E6007E]" aria-hidden>
                ✦
              </span>
              Jump to a topic
            </p>
            <ul className="flex flex-wrap gap-2">
              {SECTIONS.map((sec) => (
                <li key={sec.slug}>
                  <a
                    href={`#${sec.slug}`}
                    className="inline-block text-sm px-4 py-2 rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 text-black font-medium shadow-sm hover:border-[#E6007E] hover:text-[#E6007E] hover:shadow-md transition-all"
                  >
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        {SECTIONS.map((sec, idx) => (
          <Section
            key={sec.slug}
            id={sec.slug}
            className={`scroll-mt-28 !py-16 md:!py-20 ${idx % 2 === 1 ? "bg-white/50" : "bg-gradient-to-b from-white to-[#FFF5FA]"}`}
          >
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <div className="rounded-3xl border-4 border-black p-8 md:p-10 bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <FadeUp>
                  <div className="flex items-start gap-3 mb-6">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white text-lg font-black border-2 border-black"
                      aria-hidden
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-black leading-tight">{sec.title}</h2>
                      {sec.summary && <p className="text-black/65 mt-2 leading-relaxed font-medium">{sec.summary}</p>}
                    </div>
                  </div>
                </FadeUp>
                <div className="border-t-2 border-black/10 mt-6 pt-6">{sec.body}</div>
              </div>
            </div>
          </Section>
        ))}

        <Section className="relative !py-20 overflow-hidden border-t-4 border-black">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(125deg, ${BRAND.pinkHot} 0%, ${BRAND.pink} 45%, #9b0a4d 100%)`,
            }}
          />
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 drop-shadow-md">
              Stop scrolling. Start tightening.
            </h2>
            <p className="text-white/95 text-lg mb-10 max-w-xl mx-auto">
              Free 20-minute consult, written quote, real photos at every visit. We&apos;ll tell you whether RF microneedling is the right call — or if something else fits better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="white" className="shadow-xl">
                Book online
              </CTA>
              <Link
                href="/services/morpheus8"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-[#E6007E] transition shadow-lg"
              >
                Morpheus8 deep-dive →
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
