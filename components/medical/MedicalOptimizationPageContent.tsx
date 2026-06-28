import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { DANI_FULL_NAME, RYAN_FULL_NAME } from "@/lib/founder-credentials";
import {
  MEDICAL_HOW_IT_WORKS,
  MEDICAL_OPTIMIZATION_FAQS,
  MEDICAL_PRICING_TIERS,
  MEDICAL_SERVICES,
  MEDICAL_TEAM_IMAGE,
  MEDICAL_TEAM_IMAGE_ALT,
  MEDICAL_TEAM_QUOTE,
} from "@/lib/medical-optimization";
import { SITE } from "@/lib/seo";

function formatHours(): string[] {
  const weekday = SITE.openingHours.find((h) =>
    h.dayOfWeek.includes("Monday"),
  );
  const saturday = SITE.openingHours.find((h) => h.dayOfWeek.includes("Saturday"));
  const sunday = SITE.openingHours.find((h) => h.dayOfWeek.includes("Sunday"));

  const fmt = (opens: string, closes: string) => {
    const to12 = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      const suffix = h >= 12 ? "pm" : "am";
      const hour = h % 12 || 12;
      return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
    };
    return `${to12(opens)} – ${to12(closes)}`;
  };

  return [
    weekday ? `Mon–Fri: ${fmt(weekday.opens, weekday.closes)}` : "",
    saturday ? `Saturday: ${fmt(saturday.opens, saturday.closes)}` : "",
    sunday ? `Sunday: ${fmt(sunday.opens, sunday.closes)} (by appointment)` : "",
  ].filter(Boolean);
}

function ServiceCard({
  eyebrow,
  title,
  description,
  bullets,
  href,
  cta,
}: (typeof MEDICAL_SERVICES)[number]) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-[#E6007E]/40 hover:shadow-md">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-bold text-neutral-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">{description}</p>
      <ul className="mt-4 flex-1 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2 text-sm text-neutral-700">
            <span className="text-[#E6007E] shrink-0">•</span>
            {b}
          </li>
        ))}
      </ul>
      <Link href={href} className="mt-5 text-sm font-semibold text-[#E6007E] hover:underline">
        {cta}
      </Link>
    </article>
  );
}

export function MedicalOptimizationPageContent() {
  const hoursLines = formatHours();

  return (
    <>
      {/* Hero */}
      <Section className="relative overflow-hidden border-b border-neutral-200 !py-0 !px-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a12 45%, #2d1020 100%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(230,0,126,0.12)_0%,transparent_50%)]" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
              Hello Gorgeous RX™ · Medical Services
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
              Medical Optimization Services
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
              Data-driven care through hormone optimization, GLP-1 weight loss, peptide therapy, and
              targeted wellness — NP-supervised in Oswego, IL.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <CTA href={BOOKING_URL} variant="gradient" className="px-8 py-4">
                Book Consultation
              </CTA>
              <CTA
                href={`tel:${SITE.phone}`}
                variant="outline"
                className="border-white/30 px-8 py-4 text-white hover:bg-white hover:text-black"
              >
                Call {SITE.phone}
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Medical team */}
      <Section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <FadeUp>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
              Meet your medical team
            </h2>
            <p className="mt-4 text-2xl font-black text-neutral-900 md:text-3xl">
              {RYAN_FULL_NAME} leads every prescription
            </p>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Ryan is our Medical Director and Board-Certified Family Nurse Practitioner with full
              prescriptive authority in Illinois — on site 7 days a week. {DANI_FULL_NAME} founded
              Hello Gorgeous and leads aesthetics, IV, and client experience alongside Ryan&apos;s
              medical programs.
            </p>
            <blockquote className="mt-6 border-l-4 border-[#E6007E] pl-4 text-lg font-medium italic text-neutral-800">
              &ldquo;{MEDICAL_TEAM_QUOTE}&rdquo;
            </blockquote>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
              <Link href="/providers" className="text-[#E6007E] hover:underline">
                Meet the full team →
              </Link>
              <Link href="/gallery" className="text-neutral-600 hover:text-[#E6007E]">
                See real results →
              </Link>
            </div>
          </FadeUp>
          <FadeUp delayMs={80}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-200 shadow-lg">
              <Image
                src={MEDICAL_TEAM_IMAGE}
                alt={MEDICAL_TEAM_IMAGE_ALT}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Services grid */}
      <Section id="medical-services" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-3xl font-black text-neutral-900 md:text-4xl">Our medical services</h2>
            <p className="mt-3 max-w-2xl text-neutral-600">
              Each service is part of a comprehensive approach — stack peptides with GLP-1, pair
              hormones with IV therapy, or start with labs and build from there.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MEDICAL_SERVICES.map((service, idx) => (
              <FadeUp key={service.id} delayMs={idx * 40}>
                <ServiceCard {...service} />
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={280}>
            <p className="mt-8 text-center">
              <Link
                href="/understand-your-body"
                className="text-sm font-semibold text-[#E6007E] hover:underline"
              >
                Explore lab-guided hormone insights →
              </Link>
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Philosophy */}
      <Section className="bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <h2 className="text-2xl font-black text-neutral-900 md:text-3xl">From the clinic</h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-700">
              Hello Gorgeous is a family-owned NP-directed med spa — not a corporate chain or
              telehealth-only script mill. Whether you&apos;re here for hormones, GLP-1, peptides, or
              IV wellness, the same philosophy applies: understand the person, use real data, and
              follow up until it works.
            </p>
            <Link href="/about" className="mt-6 inline-block font-semibold text-[#E6007E] hover:underline">
              Our story →
            </Link>
          </FadeUp>
        </div>
      </Section>

      {/* How it works */}
      <Section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-center text-3xl font-black text-neutral-900">How it works</h2>
          </FadeUp>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {MEDICAL_HOW_IT_WORKS.map((step, idx) => (
              <FadeUp key={step.step} delayMs={idx * 50}>
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E6007E] text-lg font-black text-white">
                    {step.step}
                  </div>
                  <h3 className="mt-4 text-sm font-bold uppercase tracking-wider text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section id="medical-pricing" className="bg-white">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-3xl font-black text-neutral-900 md:text-4xl">Transparent pricing</h2>
            <p className="mt-3 text-neutral-600">No hidden fees. Published starting points — final quote at consult.</p>
          </FadeUp>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MEDICAL_PRICING_TIERS.map((tier, idx) => (
              <FadeUp key={tier.label} delayMs={idx * 40}>
                <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                  {tier.badge ? (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-[#E6007E]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#E6007E]">
                      {tier.badge}
                    </span>
                  ) : null}
                  <h3 className="text-lg font-bold text-neutral-900">{tier.label}</h3>
                  <p className="mt-2 text-3xl font-black text-[#E6007E]">{tier.price}</p>
                  {tier.subtitle ? (
                    <p className="mt-2 text-sm text-neutral-600">{tier.subtitle}</p>
                  ) : null}
                  <ul className="mt-4 flex-1 space-y-2">
                    {tier.bullets.map((b) => (
                      <li key={b} className="text-sm text-neutral-700">
                        • {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.href}
                    className="mt-5 text-sm font-semibold text-[#E6007E] hover:underline"
                  >
                    Learn more →
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Visit us */}
      <Section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-4xl">
          <FadeUp>
            <h2 className="text-center text-2xl font-black text-neutral-900 md:text-3xl">Visit us</h2>
          </FadeUp>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <FadeUp delayMs={40}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Address</p>
                <p className="mt-2 font-medium text-neutral-900">
                  {SITE.address.streetAddress}
                  <br />
                  {SITE.address.addressLocality}, {SITE.address.addressRegion}{" "}
                  {SITE.address.postalCode}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.name} ${SITE.address.streetAddress} ${SITE.address.addressLocality} ${SITE.address.addressRegion}`)}`}
                  className="mt-3 inline-block text-sm font-semibold text-[#E6007E] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions →
                </a>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Phone</p>
                <a href={`tel:${SITE.phone}`} className="mt-2 block text-lg font-bold text-neutral-900">
                  {SITE.phone}
                </a>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Hours</p>
                <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                  {hoursLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="medical-faqs" className="bg-white">
        <FadeUp>
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h2 className="text-2xl font-black text-neutral-900 md:text-3xl">Common questions</h2>
          </div>
        </FadeUp>
        <div className="mx-auto max-w-3xl space-y-3">
          {MEDICAL_OPTIMIZATION_FAQS.map((faq, idx) => (
            <FadeUp key={faq.question} delayMs={idx * 30}>
              <details className="group rounded-xl border border-neutral-200 bg-white open:shadow-sm">
                <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-neutral-900 flex items-center justify-between gap-3">
                  <span>{faq.question}</span>
                  <span className="text-neutral-400 text-lg shrink-0 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-0 text-neutral-600 leading-relaxed">{faq.answer}</div>
              </details>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="relative overflow-hidden border-t-4 border-black">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <FadeUp>
            <h2 className="text-3xl font-black text-white md:text-4xl">Ready to optimize?</h2>
            <p className="mt-4 text-lg text-white/90">
              Start with a consultation. We&apos;ll discuss your goals and build a plan based on real
              data — hormones, GLP-1, peptides, or wellness IV.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <CTA
                href={BOOKING_URL}
                variant="outline"
                className="border-2 border-white bg-white px-10 py-4 text-lg font-bold text-[#E6007E] hover:bg-white/90"
              >
                Book Consultation
              </CTA>
              <CTA
                href={`tel:${SITE.phone}`}
                variant="outline"
                className="border-2 border-white/60 px-10 py-4 text-lg text-white hover:bg-white/10"
              >
                Call {SITE.phone}
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
