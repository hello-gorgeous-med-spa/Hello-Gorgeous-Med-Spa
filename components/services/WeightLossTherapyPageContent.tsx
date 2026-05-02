"use client";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { SITE } from "@/lib/seo";

// Booking goes through /book → resolves the slug to the Square service ID
// and deep-links into the scheduler with that service preselected.
const BOOK_HREF = "/book?service=weight-loss-therapy";

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
    question: "What weight-loss medications do you offer?",
    answer:
      "Medically supervised GLP-1 therapy — semaglutide and tirzepatide (the molecules in Wegovy, Ozempic, Zepbound, Mounjaro). Compounded through licensed pharmacies, supervised by our medical team.",
  },
  {
    question: "How is your program different from buying it online?",
    answer:
      "You see a real medical provider — not a chatbot. In-person body composition scan, labs panel, side-effect coaching, monthly check-ins. Online-only programs skip all of that and ship vials. We don't.",
  },
  {
    question: "How much weight will I lose?",
    answer:
      "Clinical data: 15–22% total body weight on tirzepatide, 12–17% on semaglutide over 12–18 months. Real-world results depend on protein, sleep, dose adherence, and activity. We track and adjust monthly.",
  },
  {
    question: "How much does it cost?",
    answer:
      "GLP-1 programs typically $300–$500/month all-in (medication + visit + intake labs). We don't bill insurance for compounded therapy — the price you see is the price you pay.",
  },
  {
    question: "What does my first visit look like?",
    answer:
      "60-minute new-patient visit: history, vitals, body composition, screening labs if not on file, goal conversation, starting-dose decision. First injection at visit 2, ~1 week later, with in-person technique demo.",
  },
  {
    question: "Do I need labs before starting?",
    answer:
      "Yes. A1C, fasting glucose, lipids, thyroid, kidney + liver, lipase, pregnancy test where applicable. Recent labs (within 90 days) from your PCP are accepted; otherwise we order. Reviewed before any prescription.",
  },
  {
    question: "Side effects?",
    answer:
      "Most common: nausea, fatigue, mild constipation, occasional reflux — almost all resolve as your body adjusts. We coach dose-stepping to minimize side effects and adjust the protocol if anything isn't tolerable.",
  },
  {
    question: "Who is not a candidate?",
    answer:
      "Pregnancy, breastfeeding, personal/family history of medullary thyroid carcinoma or MEN2 syndrome, active pancreatitis. Type 1 diabetes is better managed by endocrinology. We screen at consult.",
  },
  {
    question: "How are injections given?",
    answer:
      "Once-weekly subcutaneous (abdomen, thigh, upper arm) using a fine insulin-style needle. Faster than a flu shot. We teach you in person and send a step-by-step video with your kit.",
  },
  {
    question: "What if I plateau?",
    answer:
      "Plateaus are normal around 6–9 and 12–14 months. We review protein, training, sleep, dose timing, and adjust if appropriate. We do not just keep raising the dose — the goal is the lowest effective amount.",
  },
  {
    question: "What happens when I stop?",
    answer:
      "Some regain is expected without a maintenance plan — this is treating a chronic condition. We taper, move you to a maintenance dose, or transition to a non-GLP-1 maintenance protocol. Plan it with us, not alone.",
  },
  {
    question: "Can I combine it with other treatments?",
    answer:
      "Yes. Common combos: GLP-1 + Morpheus8 (tighten skin during fat loss), + B12 / lipotropics (energy), + Biote hormone optimization (perimenopause). We schedule so nothing competes.",
  },
];

const SECTIONS: Block[] = [
  {
    slug: "what-it-is",
    title: "What we mean by medical weight loss",
    summary: "Real provider, real labs, real plan — not a vial dropped on your porch.",
    body: (
      <div className="space-y-3 text-black/85 font-medium leading-relaxed">
        <p>
          Our weight-loss program is built around <strong>GLP-1 therapy</strong> (semaglutide / tirzepatide) supervised by a licensed medical provider. The same molecule as Wegovy, Ozempic, Zepbound, and Mounjaro — dispensed through compounding pharmacies in Illinois.
        </p>
        <p>
          Every patient gets: an in-person consult, screening labs, a body composition scan, written dose protocol, side-effect coaching, monthly check-ins, and a maintenance plan when you&apos;re ready to step down. <strong>We never just ship vials.</strong>
        </p>
        <p>
          We treat obesity (BMI ≥ 30) and overweight (BMI ≥ 27) with weight-related conditions. If you&apos;re not a fit, we&apos;ll tell you that at consult — and route you to whatever does fit.
        </p>
      </div>
    ),
  },
  {
    slug: "how-it-works",
    title: "How GLP-1 therapy works",
    summary: "What's actually happening — in plain English, no marketing fluff.",
    body: (
      <ol className="space-y-3 list-decimal pl-5 text-black/85 font-medium leading-relaxed">
        <li>
          <strong className="text-black">Slows gastric emptying.</strong> Food stays in your stomach longer. You feel full earlier and stay full for hours.
        </li>
        <li>
          <strong className="text-black">Quiets food noise.</strong> The constant background chatter about food, snacks, and rewards drops dramatically. Most patients notice this within 2 weeks.
        </li>
        <li>
          <strong className="text-black">Improves insulin response.</strong> Glucose handling improves, A1C tends to drop, and energy stabilizes (after the early adjustment phase).
        </li>
        <li>
          <strong className="text-black">Preserves lean mass — if protein is right.</strong> We push 0.8–1.0 g protein per pound of target body weight. Without this, you lose muscle. With it, you lose fat.
        </li>
        <li>
          <strong className="text-black">Sustainable rate.</strong> Aim is ~1–2 lb / week — fast enough to feel real, slow enough that skin and muscle catch up.
        </li>
      </ol>
    ),
  },
  {
    slug: "your-program",
    title: "Your program — visit by visit",
    summary: "Exactly what to expect, with no hidden upsells later.",
    body: (
      <ol className="space-y-3 list-decimal pl-5 text-black/85 font-medium leading-relaxed">
        <li>
          <strong className="text-black">Visit 1 — consult (60 min).</strong> History, vitals, body composition, labs ordered (if not on file), goal conversation, dose decision. You leave with a written plan and a price.
        </li>
        <li>
          <strong className="text-black">Visit 2 — start (30 min).</strong> Labs reviewed. First injection in-office with technique demo. Take-home kit, dose calendar, side-effect playbook.
        </li>
        <li>
          <strong className="text-black">Monthly check-ins.</strong> Weight, body composition, side effects, protein intake, sleep, training. We adjust dose only when warranted.
        </li>
        <li>
          <strong className="text-black">Quarterly labs.</strong> A1C, kidney + liver, lipids. We catch issues early.
        </li>
        <li>
          <strong className="text-black">Maintenance phase.</strong> When you&apos;re ready, we taper to a maintenance dose (or off entirely). Some patients stay on low-dose long-term; some come off. Either is fine — we plan it together.
        </li>
      </ol>
    ),
  },
  {
    slug: "vs-online",
    title: "Hello Gorgeous vs. online-only programs",
    summary: "What you actually get when you pay $300+ at our place.",
    body: (
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <table className="w-full text-sm text-black/85 min-w-[640px]">
          <thead className="bg-[#FFF0F7] text-black">
            <tr>
              <th className="text-left p-3 font-bold"></th>
              <th className="text-left p-3 font-bold text-[#E6007E]">Hello Gorgeous</th>
              <th className="text-left p-3 font-bold">Online-only programs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            <tr>
              <td className="p-3 font-bold">In-person provider visit</td>
              <td className="p-3">Yes — every month if needed</td>
              <td className="p-3">Rare; chat-based</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Labs reviewed before Rx</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Often skipped</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Body composition tracking</td>
              <td className="p-3">Yes — every visit</td>
              <td className="p-3">No</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Side-effect coaching</td>
              <td className="p-3">Real conversation</td>
              <td className="p-3">Email FAQ</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Skin-tightening + body combos</td>
              <td className="p-3">Morpheus8, hormones, B12</td>
              <td className="p-3">No</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Maintenance plan</td>
              <td className="p-3">Personalized taper</td>
              <td className="p-3">You&apos;re on your own</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-black/60 mt-3 px-1">
          We&apos;re not the cheapest option — we&apos;re the safest one within an hour of Oswego.
        </p>
      </div>
    ),
  },
  {
    slug: "pricing",
    title: "Pricing & payment",
    summary: "Per-month transparency — no surprise pharmacy bills.",
    body: (
      <div className="space-y-3 text-black/85 font-medium leading-relaxed">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {[
            "GLP-1 program: $300–$500 / month all-in",
            "Initial labs (if needed): ~$80",
            "Body composition scan: included",
            "Combo with Morpheus8: preferred pricing",
            "Combo with hormone optimization: preferred pricing",
            "Cancel any time, no contracts",
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
        <p className="text-sm text-black/70">
          Branded coverage (Wegovy / Zepbound through insurance)? We&apos;ll route you correctly at consult — no charge to find out.
        </p>
      </div>
    ),
  },
  {
    slug: "service-area",
    title: "Where we are · who we serve",
    summary:
      "Hello Gorgeous Med Spa is in Oswego, IL — patients drive in from across Kendall, Kane, Will, and DuPage counties.",
    body: (
      <div className="space-y-3 text-black/85 font-medium leading-relaxed">
        <p>
          We see weight-loss patients from <strong>Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery, Sugar Grove, Geneva, and Bolingbrook</strong>. Free parking, evening + Saturday hours, and a calendar that opens on Sundays.
        </p>
        <p>
          We coordinate with your PCP, your endocrinologist, and your gynecologist when needed — your weight-loss program shouldn&apos;t exist in a vacuum.
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
    slug: "faq",
    title: "Frequently asked questions",
    summary: "Twelve straight answers about GLP-1 therapy.",
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

export function WeightLossTherapyPageContent() {
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
                Semaglutide · Tirzepatide · Maintenance
              </div>
              <p className="text-sm md:text-base uppercase tracking-widest text-[#FFB8DC] font-semibold mb-4">
                Oswego · Naperville · Aurora · Plainfield · Yorkville
              </p>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white drop-shadow-lg">
                Medical{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  weight loss
                </span>
                ,<br className="hidden md:inline" /> with a real provider
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
                GLP-1 therapy programs from $300/month — supervised, body-comp tracked, lab-checked, and built to be sustainable. No chatbots, no shipped vials with a quiz attached. Call{" "}
                <a href={`tel:${SITE.phone}`} className="font-bold text-[#FFB8DC] hover:text-white underline decoration-[#E6007E]">
                  {SITE.phone}
                </a>
                .
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOK_HREF} variant="gradient" className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]">
                  Book a free 15-min consult
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
              Ready to actually lose it — and keep it off?
            </h2>
            <p className="text-white/95 text-lg mb-10 max-w-xl mx-auto">
              Free 15-minute consult, real provider, written plan, no contract. We&apos;ll tell you whether GLP-1 is the right call for your body — or what is.
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
