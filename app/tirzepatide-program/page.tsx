import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd, faqJsonLd, breadcrumbJsonLd, SITE } from "@/lib/seo";

// ============================================================
// 10-WEEK TIRZEPATIDE PROGRAM — $600 offer landing page
// Built to convert the program email + GBP/social traffic, and to
// carry the at-home subcutaneous injection instructions (booklet).
// ============================================================

export const revalidate = 3600;

const PROGRAM_PATH = "/tirzepatide-program";

// Direct Fresha service link for the program consultation.
const PROGRAM_BOOKING_URL =
  "https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "The 10-Week Tirzepatide Program — $600 | Oswego, IL | Hello Gorgeous",
    description:
      "A medically guided 10-week tirzepatide weight-loss program in Oswego, IL — $600 all-in. One easy weekly dose, provider on site 7 days a week, at-home self-injection with simple training. Free consultation.",
    path: PROGRAM_PATH,
  }),
  keywords: [
    "tirzepatide program Oswego",
    "10 week tirzepatide Oswego IL",
    "tirzepatide weight loss Oswego",
    "tirzepatide $600 program",
    "compounded tirzepatide Oswego",
    "GLP-1 weight loss Oswego",
    "Mounjaro alternative Illinois",
    "Zepbound alternative Oswego",
    "at home tirzepatide injection",
    "medical weight loss Naperville Aurora",
  ],
};

// What's included in the flat $600 program.
const INCLUDED = [
  "Private consultation & medical eligibility review",
  "Your 10-week supply of tirzepatide",
  "Simple at-home injection training",
  "Provider-guided dosing & check-ins throughout",
];

// "Why women love it" — mirrors the program email.
const BENEFITS = [
  {
    title: "Calms the food noise",
    body:
      "Tirzepatide works with your body's own appetite signals, so cravings quiet down and you feel full sooner — without white-knuckling it.",
  },
  {
    title: "Steady, sustainable progress",
    body: "A ten-week structure built for real change you can feel, not a crash.",
  },
  {
    title: "One dose a week",
    body: "A simple weekly routine that fits a busy life.",
  },
  {
    title: "Self-administered at home",
    body:
      "After a few minutes of easy training, you do your weekly dose in the privacy of your own home — no weekly drive in.",
  },
  {
    title: "Provider-guided the whole way",
    body:
      "Your dose is determined and adjusted by Ryan Kent, FNP-BC — never guesswork — with check-ins across your ten weeks.",
  },
  {
    title: "Care that knows your name",
    body: "Family-owned, ten years in Oswego — you're a person here, not a chart.",
  },
];

// At-home subcutaneous injection instructions (from the patient booklet),
// reorganized into four clear stages.
const INJECTION_STEPS = [
  {
    n: "1",
    title: "Choose your injection site",
    points: [
      "Belly: at least 2 inches away from your belly button.",
      "Upper arm: the back of the arm, halfway between elbow and shoulder.",
      "Thigh: the upper, outer-front portion of the thigh.",
      "Rotate sites each week so the same spot isn't used twice in a row.",
    ],
  },
  {
    n: "2",
    title: "Prepare your dose",
    points: [
      "Wash your hands thoroughly before you begin.",
      "Allow the vial to thaw, then wipe the rubber stopper with an alcohol swab and discard the swab.",
      "Remove the plastic cover from the needle. Hold the vial steady and push the needle through the center of the stopper at a 90° angle.",
      "Flip the vial over (needle still inserted) and pull the plunger just past your prescribed amount.",
      "Gently tap the syringe so air bubbles rise to the top, then push the bubbles and any extra fluid back into the vial until you reach your exact prescribed dose. Remove the needle from the vial.",
    ],
  },
  {
    n: "3",
    title: "Give the injection",
    points: [
      "Wipe the injection site with a fresh alcohol swab and let it dry.",
      "With your non-dominant hand, gently pinch 1–2 inches of skin (don't touch the cleaned area).",
      "With a steady, continuous motion, insert the needle at a 90° angle until it's fully in.",
      "Press the plunger down with your thumb until the entire dose is injected.",
      "Remove the needle and press gently on the site with a swab for 3–5 minutes, or until any bleeding stops.",
    ],
  },
  {
    n: "4",
    title: "Dispose safely",
    points: [
      "Place used needles and syringes in a sharps or other puncture-proof safety container — never in household trash.",
      "For medication disposal guidance, visit safe.pharmacy/drug-disposal.",
    ],
  },
];

const PROGRAM_FAQS = [
  {
    question: "What is the 10-week tirzepatide program?",
    answer:
      "It's a medically guided weight-loss program at Hello Gorgeous Med Spa in Oswego, IL for a flat $600. You get a private consultation and eligibility review, a 10-week supply of tirzepatide, simple at-home injection training, and provider-guided dosing with check-ins throughout. One easy weekly dose, with Ryan Kent, FNP-BC on site 7 days a week.",
  },
  {
    question: "How much does it cost?",
    answer:
      "$600 for the full ten weeks — that includes your consultation and medical eligibility review, your 10-week supply of tirzepatide, at-home injection training, and provider-guided dosing and check-ins. No insurance required.",
  },
  {
    question: "How often do I take it, and do I inject myself?",
    answer:
      "Tirzepatide is one subcutaneous injection per week. After a few minutes of easy in-office training, you give your weekly dose at home. Your dose is determined and adjusted by your provider — never guesswork.",
  },
  {
    question: "Where do I inject it?",
    answer:
      "Into the fatty (subcutaneous) tissue of the belly (at least 2 inches from the belly button), the back of the upper arm, or the upper-outer thigh. Rotate sites each week and clean the area with an alcohol swab before each injection.",
  },
  {
    question: "Is tirzepatide safe, and is it right for me?",
    answer:
      "Tirzepatide is a prescription medication. Eligibility is determined during a medical consultation with our provider, and it is not suitable for everyone — including those who are pregnant or who have a personal or family history of medullary thyroid carcinoma or MEN 2. Common side effects can include nausea and other digestive changes. Individual results vary. Your free consultation is where we make sure it's a fit for you.",
  },
  {
    question: "Where are you located?",
    answer:
      "Hello Gorgeous Med Spa is at 74 W Washington St in downtown Oswego, IL — serving Naperville, Aurora, Plainfield, Yorkville and the Fox Valley. Call 630-636-6193 or book a free consultation online.",
  },
];

export default function TirzepatideProgramPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "10-Week Tirzepatide Program", url: `${SITE.url}${PROGRAM_PATH}` },
  ];

  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: "10-Week Tirzepatide Weight-Loss Program",
    description:
      "Medically guided 10-week tirzepatide program: consultation & eligibility review, 10-week supply of tirzepatide, at-home injection training, and provider-guided dosing with check-ins.",
    price: "600",
    priceCurrency: "USD",
    url: `${SITE.url}${PROGRAM_PATH}`,
    availability: "https://schema.org/InStock",
    category: "Medical Weight Loss",
    seller: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(PROGRAM_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />

      <main className="bg-white">
        {/* Hero */}
        <Section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a12] to-black opacity-95" />
          <div className="relative max-w-4xl mx-auto text-center">
            <FadeUp>
              <p className="uppercase tracking-[0.3em] text-xs text-[#FFB8DC] mb-4">
                The 10-Week Program · Oswego, IL
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Tirzepatide,{" "}
                <span className="text-[#E6007E]">made simple.</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
                Ten weeks. One easy weekly dose. A medically guided path to feeling confident in your
                body again — with a provider on site 7 days a week.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm mb-10">
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ $600 all-in</span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ One dose a week</span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ Self-dose at home</span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ FNP-BC on site 7 days</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={PROGRAM_BOOKING_URL} variant="gradient">
                  Book Your Consultation
                </CTA>
                <CTA href="/glp1-weight-loss" variant="outline">
                  Explore Medical Weight Loss
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* The offer — what's included */}
        <Section className="bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="rounded-3xl border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] text-center">
                <p className="text-[#E6007E] font-bold uppercase tracking-wider text-xs mb-2">
                  The 10-Week Self-Dose Program
                </p>
                <div className="text-6xl md:text-7xl font-black text-[#E6007E] leading-none mb-2">$600</div>
                <p className="text-black/70 font-medium italic mb-6">
                  everything you need for your full ten weeks
                </p>
                <ul className="text-left max-w-md mx-auto space-y-3">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-black/85 font-medium">
                      <span className="text-[#E6007E] font-black">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <CTA href={PROGRAM_BOOKING_URL} variant="gradient">
                    Book Your Consultation
                  </CTA>
                </div>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Why women love it */}
        <Section className="bg-white">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-12">
                Why women love it
              </h2>
            </FadeUp>
            <div className="grid gap-6 md:grid-cols-2">
              {BENEFITS.map((b, idx) => (
                <FadeUp key={b.title} delayMs={idx * 50}>
                  <div className="h-full rounded-3xl border-4 border-black bg-white p-6 md:p-7 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                    <h3 className="text-xl font-black text-[#E6007E] mb-2">{b.title}</h3>
                    <p className="text-black/80 font-medium leading-relaxed">{b.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* A letter from our founder */}
        <Section className="bg-gradient-to-b from-white to-[#FFF0F7]">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-10 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="shrink-0">
                    <Image
                      src="/images/team/danielle.png"
                      alt="Danielle Alcala, founder of Hello Gorgeous Med Spa in Oswego, IL"
                      width={160}
                      height={160}
                      className="h-36 w-36 md:h-40 md:w-40 rounded-2xl border-2 border-black object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-[#E6007E] font-bold uppercase tracking-wider text-xs mb-3">
                      A letter from our founder
                    </p>
                    <p className="text-lg md:text-xl text-black/85 font-medium leading-relaxed italic mb-4">
                      &ldquo;I didn&apos;t add this program to chase a trend. I added it because the women I
                      love deserve real help, delivered by people who actually know them.&rdquo;
                    </p>
                    <p className="text-black/70 font-medium mb-5">
                      The honest truth about what our 10-week tirzepatide program is, what it isn&apos;t,
                      and why we built it this way. — Danielle Alcala
                    </p>
                    <Link
                      href="/blog/a-letter-about-our-tirzepatide-program"
                      className="inline-block text-[#E6007E] font-bold underline decoration-2 underline-offset-2 hover:no-underline"
                    >
                      Read the full letter →
                    </Link>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* At-home injection instructions (booklet) */}
        <Section className="bg-gradient-to-b from-white to-[#FFF0F7]">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-4">
                Your at-home injection, step by step
              </h2>
              <p className="text-center text-black/70 font-medium max-w-2xl mx-auto mb-12">
                We walk you through this in person before you ever inject at home. Keep this as your
                quick reference — and always follow the specific instructions from your provider.
              </p>
            </FadeUp>
            <div className="space-y-6">
              {INJECTION_STEPS.map((step, idx) => (
                <FadeUp key={step.n} delayMs={idx * 50}>
                  <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                    <div className="flex items-start gap-4">
                      <span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white font-black">
                        {step.n}
                      </span>
                      <div>
                        <h3 className="text-xl font-black text-black mb-3">{step.title}</h3>
                        <ul className="space-y-2">
                          {step.points.map((p) => (
                            <li key={p} className="flex items-start gap-2 text-black/80 font-medium leading-relaxed">
                              <span className="text-[#E6007E] mt-0.5">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
            <FadeUp>
              <p className="text-center text-sm text-black/60 mt-8">
                See also our full{" "}
                <Link
                  href="/pre-post-care/weight-loss"
                  className="text-[#E6007E] underline decoration-2 underline-offset-2 font-semibold"
                >
                  weight-loss pre &amp; post care guide
                </Link>
                .
              </p>
            </FadeUp>
          </div>
        </Section>

        {/* FAQ */}
        <Section className="bg-white">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl font-black text-black text-center mb-10">
                Common questions
              </h2>
            </FadeUp>
            <div className="space-y-5">
              {PROGRAM_FAQS.map((f, idx) => (
                <FadeUp key={f.question} delayMs={idx * 40}>
                  <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
                    <h3 className="font-bold text-[#E6007E] mb-2">▸ {f.question}</h3>
                    <p className="text-black/85 font-medium leading-relaxed">{f.answer}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* Safety / disclaimer */}
        <Section className="bg-gradient-to-b from-[#FFF0F7] to-white py-12">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border-2 border-black/15 bg-white/70 p-6">
              <p className="text-xs text-black/60 leading-relaxed">
                Tirzepatide is a prescription medication. Eligibility is determined during a medical
                consultation with our provider, and this program is not suitable for everyone —
                including those who are pregnant or who have a personal or family history of medullary
                thyroid carcinoma or MEN&nbsp;2. Common side effects may include nausea and other
                digestive changes. Individual results vary. This page is informational only and is not
                medical advice.
              </p>
            </div>
          </div>
        </Section>

        {/* CTA band */}
        <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Let&apos;s find out if it&apos;s right for you — gorgeous.
            </h2>
            <p className="text-white/90 text-lg mb-8 font-medium">
              Free consultation with a provider on site 7 days a week. 74 W Washington St, Oswego, IL ·{" "}
              {SITE.phone}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={PROGRAM_BOOKING_URL} variant="white">
                Book Your Consultation
              </CTA>
              <CTA href="/glp1-weight-loss" variant="outline">
                Medical Weight Loss Details
              </CTA>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
