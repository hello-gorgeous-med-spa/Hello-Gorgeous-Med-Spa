"use client";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { SITE } from "@/lib/seo";

// Booking goes through /book → resolves the slug to the Square service ID
// and deep-links into the scheduler with that service preselected.
const BOOK_HREF = "/book?service=botox";

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

const BOTOX_FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "How much does Botox cost in Oswego, IL?",
    answer:
      "We price Botox per unit so you only pay for what you actually need — most clients use 20–40 units. New patients get a complimentary 15-minute consult so we can quote you exactly before any needle moves.",
  },
  {
    question: "How long does Botox last?",
    answer:
      "Typically 3–4 months for first-time clients, longer with consistent maintenance. Active expressions and how much you exercise both shorten duration. We book a 12-week follow-up so we never let your last results fade fully.",
  },
  {
    question: "Will Botox make me look frozen or fake?",
    answer:
      "Not when it's dosed correctly. Our injectors train for nuance — softening dynamic lines while keeping every expression natural. The 'frozen' look comes from too many units in too few muscles. We do the opposite.",
  },
  {
    question: "Does Botox hurt?",
    answer:
      "Most clients describe a few quick pinches that take 5–10 minutes total. We use ultra-fine 32-gauge needles, ice for sensitive areas, and a topical option for first-timers. Numbing isn't usually necessary.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Subtle softening starts day 3–4. Full results land at day 10–14. We follow up at two weeks; if anything needs a touch-up to even out, it's free during that window.",
  },
  {
    question: "Can I exercise after Botox?",
    answer:
      "Skip strenuous workouts, hot yoga, and lying flat for 4 hours after your appointment. Walks and normal activity are fine. After 24 hours: back to anything.",
  },
  {
    question: "Is Botox safe?",
    answer:
      "Yes — Botox has been FDA-approved for cosmetic use since 2002. The biggest safety variable is who's injecting. Every injection at Hello Gorgeous is performed by a licensed Illinois medical professional.",
  },
  {
    question: "What does Botox treat besides forehead lines?",
    answer:
      "Forehead lines, '11s' between the brows, crow's feet, bunny lines, gummy smiles, lip flips, jaw slimming (masseter), neck bands, and underarm sweating. We also do preventative Botox for clients in their 20s and 30s.",
  },
  {
    question: "Botox vs. Dysport vs. Xeomin — what's the difference?",
    answer:
      "All three are neuromodulators. Botox is the most widely studied. Dysport spreads slightly more and may onset 1–2 days faster. Xeomin has no carrier protein, which helps patients who've developed Botox resistance. We carry all three and pick based on your face.",
  },
  {
    question: "Can I get Botox while pregnant or breastfeeding?",
    answer:
      "We don't inject during pregnancy or while nursing. We'll happily book you for after — and most clients say it's the best 'welcome back' gift.",
  },
  {
    question: "How is Hello Gorgeous different from a chain med spa?",
    answer:
      "Locally owned in Oswego, every injector is in-house and Illinois-licensed, and we never up-sell. You get the dose your face actually needs — not the biggest invoice. Plus same-week appointments, evening hours, and a real follow-up call.",
  },
  {
    question: "Do you offer Botox specials or memberships?",
    answer:
      "Ask about our preferred-pricing tier for clients on a 12-week maintenance schedule, plus seasonal promos via our Square mailing list. New clients can sign up at checkout.",
  },
];

const SECTIONS: Block[] = [
  {
    slug: "treatments",
    title: "What Botox treats",
    summary: "Twelve common requests our injectors handle every week.",
    body: (
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-black/85 font-medium">
        {[
          "Forehead lines",
          "Frown lines (the '11s')",
          "Crow's feet",
          "Bunny lines on the nose",
          "Lip flip for a fuller-looking upper lip",
          "Gummy smile reduction",
          "Brow lift (chemical)",
          "Jawline slimming (masseter)",
          "Neck bands (platysmal)",
          "Underarm sweating (hyperhidrosis)",
          "TMJ pain reduction",
          "Preventative Botox (20s–30s)",
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
    slug: "what-to-expect",
    title: "Your first appointment",
    summary: "From walk-in to walk-out, plus what we do that chains skip.",
    body: (
      <ol className="space-y-3 list-decimal pl-5 text-black/85 font-medium leading-relaxed">
        <li>
          <strong className="text-black">15-minute consult.</strong> We map your facial movements, listen to your goals, and tell you the exact unit count and price.
        </li>
        <li>
          <strong className="text-black">Photos.</strong> Standardized lighting, neutral and active expressions. These are private — only used for your two-week follow-up comparison.
        </li>
        <li>
          <strong className="text-black">Injection.</strong> 5–10 minutes total. We use 32-gauge needles, ice for sensitive zones, and walk you through every injection in real time.
        </li>
        <li>
          <strong className="text-black">Aftercare card.</strong> Printed and texted. The next 24 hours matter; we make sure you have the rules.
        </li>
        <li>
          <strong className="text-black">Two-week follow-up.</strong> Photos again, free touch-up if needed, and your next 12-week visit on the books.
        </li>
      </ol>
    ),
  },
  {
    slug: "service-area",
    title: "Where we are · who we serve",
    summary:
      "Hello Gorgeous Med Spa is in Oswego, IL — a 15-minute drive from most Naperville, Aurora, and Plainfield zip codes.",
    body: (
      <div className="space-y-3 text-black/85 font-medium leading-relaxed">
        <p>
          We see Botox patients from <strong>Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery, Sugar Grove, Geneva, and Bolingbrook</strong>. Free street parking, evening + Saturday hours, and a calendar that opens on Sundays.
        </p>
        <p>
          Coming from further out? We block back-to-back appointments together so you can do Botox + a facial or chemical peel in one visit and not feel rushed.
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
    summary: "Per-unit transparency. No hidden fees, no high-pressure packages.",
    body: (
      <div className="space-y-3 text-black/85 font-medium leading-relaxed">
        <p>
          We price Botox <strong>by the unit</strong> — never by area. Most clients use 20–40 units per visit; the average bill is a fraction of what aggressive packages quote.
        </p>
        <p>We accept:</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {[
            "Visa / Mastercard / Amex",
            "FSA / HSA cards (eligible procedures)",
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
        <p className="text-sm text-black/70">
          Save preferred pricing by joining our maintenance tier — book a consultation and we&apos;ll set you up.
        </p>
      </div>
    ),
  },
  {
    slug: "faq",
    title: "Frequently asked questions",
    summary: "Twelve straight answers we wish every chain spa would publish.",
    body: (
      <dl className="space-y-0 border-t-2 border-black/10 mt-2">
        {BOTOX_FAQ_ITEMS.map((item) => (
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

export function BotoxPageContent() {
  return (
    <div className="relative min-h-[100dvh] touch-pan-y">
      {/* Ambient brand wash */}
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
        {/* Hero */}
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
                Botox · Dysport · Xeomin
              </div>
              <p className="text-sm md:text-base uppercase tracking-widest text-[#FFB8DC] font-semibold mb-4">
                Oswego · Naperville · Aurora · Plainfield · Yorkville
              </p>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white drop-shadow-lg">
                Natural{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Botox
                </span>{" "}
                in Oswego
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
                Per-unit pricing, licensed Illinois injectors, never up-sold. Subtle softening that keeps every expression — book a free 15-minute consult and we&apos;ll quote you exactly before a needle moves. Call{" "}
                <a href={`tel:${SITE.phone}`} className="font-bold text-[#FFB8DC] hover:text-white underline decoration-[#E6007E]">
                  {SITE.phone}
                </a>
                .
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOK_HREF} variant="gradient" className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]">
                  Book a free Botox consult
                </CTA>
                <CTA href="#faq" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black">
                  See FAQ
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Topic chips */}
        <Section className="!py-12 border-b-4 border-black bg-white/70 backdrop-blur-sm">
          <nav aria-label="Botox topics" className="max-w-5xl mx-auto px-4 md:px-6">
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

        {/* Sections */}
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

        {/* Closing CTA */}
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
              Ready when you are.
            </h2>
            <p className="text-white/95 text-lg mb-10 max-w-xl mx-auto">
              Same-week openings most weeks. Book your free 15-minute Botox consult and we&apos;ll show you exactly what your face needs — and what it doesn&apos;t.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOK_HREF} variant="white" className="shadow-xl">
                Book online
              </CTA>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-[#E6007E] transition shadow-lg"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
