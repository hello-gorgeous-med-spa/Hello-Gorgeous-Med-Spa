import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { GLP1_INTAKE_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { PEPTIDES_HUB_FAQS } from "@/lib/peptide-seo-faqs";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { protocolPath, isPublishedProtocolDrugKey } from "@/lib/regen/catalog/protocol-pages";
import { VITAMIN_SHOTS } from "@/lib/vitamin-bar";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

function learnHref(drugKey: string) {
  return isPublishedProtocolDrugKey(drugKey) ? protocolPath(drugKey) : undefined;
}

const LEARN_HREF = "/rx/learn/what-are-peptides";
const SHOP_HREF = "/rx?browse=all";

function peptideIntake(peptide: string) {
  const params = new URLSearchParams({
    peptide,
    type: "new",
    source: "peptide-landing",
  });
  return `${PEPTIDE_REQUEST_PATH}?${params.toString()}`;
}

function glp1Intake(productName: string) {
  const params = new URLSearchParams({
    type: "new",
    productName,
    source: "peptide-landing",
  });
  return `${GLP1_INTAKE_PATH}?${params.toString()}`;
}

const JUMP = [
  { href: "#peptides", label: "Peptides" },
  { href: "#program", label: "Your program" },
  { href: "#faq", label: "FAQ" },
  { href: SHOP_HREF, label: "Shop RE GEN" },
] as const;

const TYPES = [
  {
    n: "01",
    title: "Metabolic peptides",
    body: "Tirzepatide and semaglutide help regulate appetite and support metabolic health — the foundation of our weight-management programs.",
  },
  {
    n: "02",
    title: "Growth-hormone support",
    body: "Peptides like sermorelin encourage your body’s own growth-hormone production for recovery and lean body composition.",
  },
  {
    n: "03",
    title: "Repair & recovery",
    body: "BPC-157 supports tissue healing, joint comfort, and cellular repair after inflammation or injury.",
  },
  {
    n: "04",
    title: "Cognitive & sleep support",
    body: "Support for sleep cycles, mood, and mental clarity — matched at consult, not picked off a shelf.",
  },
  {
    n: "05",
    title: "Immune support",
    body: "Help balance immune function for clients dealing with frequent illness or chronic inflammation.",
  },
  {
    n: "06",
    title: "Anti-inflammatory peptides",
    body: "Calm inflammatory pathways and support healthier, longer-term recovery under NP supervision.",
  },
] as const;

const WEIGHT_LOSS = [
  {
    tag: "GLP-1",
    name: "Tirzepatide",
    body: "Dual GIP/GLP-1 agonist for appetite control, weight loss, and blood-sugar support. Weekly dosing, titrated by your provider.",
    href: glp1Intake("Tirzepatide"),
    learnHref: learnHref("tirzepatide"),
  },
  {
    tag: "GLP-1",
    name: "Semaglutide",
    body: "GLP-1 receptor agonist for appetite control, weight management, and metabolic health. Weekly dosing.",
    href: glp1Intake("Semaglutide"),
    learnHref: learnHref("semaglutide"),
  },
  {
    tag: "Provider-matched",
    name: "Additional options",
    body: "Other weight-loss and metabolic peptide protocols are available. Your provider matches the right option to your labs and goals.",
    href: "/rx?goal=lose-weight",
  },
] as const;

const RECOVERY = [
  {
    tag: "GH support",
    name: "Sermorelin",
    body: "Encourages your body’s own growth-hormone production — supports recovery, lean body composition, and sleep quality.",
    href: peptideIntake("sermorelin"),
    learnHref: learnHref("sermorelin"),
  },
  {
    tag: "Repair",
    name: "BPC-157",
    body: "Supports tissue healing, joint comfort, and recovery from inflammation or injury.",
    href: peptideIntake("bpc-157"),
    learnHref: learnHref("bpc157"),
  },
  {
    tag: "Vitality",
    name: "PT-141",
    body: "Supports sexual health and vitality as part of a broader wellness plan, for men and women.",
    href: peptideIntake("pt-141"),
    learnHref: learnHref("pt141"),
  },
] as const;

const WELLNESS_IDS = ["biotin", "glutathione", "vitamin-d", "tri-immune"] as const;

const PROGRAM_STEPS = [
  {
    n: "01",
    title: "Medical screening & labs",
    body: "A full intake and bloodwork review before any protocol is recommended.",
  },
  {
    n: "02",
    title: "Provider consult",
    body: `${MEDICAL_DIRECTOR.displayName} provides medical oversight; ${PRESCRIBING_NP.displayName} prescribes and manages your plan.`,
  },
  {
    n: "03",
    title: "Personalized protocol",
    body: "Peptides and dosing matched to your goals — recovery, fat loss, performance, or longevity.",
  },
  {
    n: "04",
    title: "Ongoing follow-up",
    body: "Regular check-ins and dose review to keep your protocol working for you.",
  },
] as const;

function ProtocolCard({
  tag,
  name,
  body,
  href,
  learnHref,
}: {
  tag: string;
  name: string;
  body: string;
  href: string;
  learnHref?: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:-translate-y-0.5">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#E6007E]">{tag}</p>
      <h3 className="mt-2 font-serif text-xl font-black text-black">{name}</h3>
      <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-black/70">{body}</p>
      <Link
        href={href}
        className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-black bg-white px-4 text-sm font-black text-black transition hover:bg-[#FF2D8E]"
      >
        Start intake →
      </Link>
      {learnHref ? (
        <Link
          href={learnHref}
          className="mt-2 text-center text-xs font-semibold text-black/50 hover:text-[#E6007E]"
        >
          How it works
        </Link>
      ) : null}
    </article>
  );
}

function GroupHeading({ children }: { children: string }) {
  return (
    <h3 className="mb-5 border-l-4 border-[#FF2D8E] pl-3.5 font-serif text-xl font-black text-black">
      {children}
    </h3>
  );
}

/**
 * Public peptide-therapy landing at `/peptides`.
 * Structure follows the Hello Gorgeous RX peptide landing mock: hero, trust,
 * what-is, shop-by-goal, program, FAQ, CTA — not a catalog dump.
 */
export function PeptideTherapyPageContent() {
  const wellness = WELLNESS_IDS.map((id) => VITAMIN_SHOTS.find((s) => s.id === id)).filter(
    (s): s is (typeof VITAMIN_SHOTS)[number] => !!s,
  );

  return (
    <div className="relative min-h-[100dvh]">
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
        <section className="relative overflow-hidden border-b-4 border-black py-16 lg:py-24">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <Image
            src="/images/shop-rx/rx-hero-team.png"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-40"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #000 28%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.15) 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 18% 30%, ${BRAND.pink} 0%, transparent 45%),
                radial-gradient(circle at 88% 18%, ${BRAND.pinkHot} 0%, transparent 40%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.45)_100%)]" />

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
                Oswego, IL · Hello Gorgeous RX
              </div>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#FFB8DC]">
                Medically supervised peptide therapy
              </p>
              <h1 className="mb-6 font-serif text-4xl font-black leading-tight text-white drop-shadow-lg md:text-6xl">
                Peptide Therapy,{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Medically Supervised
                </span>
              </h1>
              <p className="mb-10 max-w-lg text-lg leading-relaxed text-white/85">
                Custom peptide protocols for weight loss, recovery, growth-hormone support, and
                vitality — built around your labs and goals, and overseen by our medical team.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <CTA
                  href={PRIMARY_BOOKING_CTA.href}
                  variant="gradient"
                  className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]"
                >
                  Book a free consult
                </CTA>
                <CTA
                  href={LEARN_HREF}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-black"
                >
                  What are peptides?
                </CTA>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b-4 border-black bg-[#FFF5F9] px-6 py-8 md:px-12">
          <div className="mx-auto grid max-w-6xl gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "NP-directed care", sub: "Every client medically screened" },
              { title: MEDICAL_DIRECTOR.displayName, sub: "Medical oversight" },
              { title: PRESCRIBING_NP.displayName, sub: "Prescribing provider" },
              { title: "Oswego, IL", sub: "Serving the western suburbs" },
            ].map((item) => (
              <div key={item.title}>
                <p className="font-serif text-[15px] font-bold text-black">{item.title}</p>
                <p className="mt-1 text-xs font-medium text-black/55">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <Section className="!py-12 border-b-4 border-black bg-white/70 backdrop-blur-sm">
          <nav aria-label="Peptide therapy sections">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black">
              <span className="text-[#E6007E]" aria-hidden>
                ✦
              </span>
              Jump to
            </p>
            <ul className="flex flex-wrap gap-2">
              {JUMP.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-sm font-bold text-black shadow-sm transition hover:border-[#E6007E] hover:text-[#E6007E]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        <Section className="border-b-4 border-black bg-white">
          <FadeUp>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E6007E]">
                  A smarter approach
                </p>
                <h2 className="font-serif text-3xl font-black tracking-tight text-black md:text-4xl">
                  What is peptide therapy?
                </h2>
                <p className="mt-4 text-[15px] font-medium leading-relaxed text-black/80">
                  Peptides are short chains of amino acids that signal your cells to perform
                  specific functions — messengers that tell your body what to do, and when.
                  Different peptides target different systems: tissue repair, fat metabolism, and
                  growth hormone.
                </p>
                <p className="mt-4 text-[15px] font-medium leading-relaxed text-black/80">
                  Every protocol at Hello Gorgeous RX starts with a provider consult and medical
                  screening. From there, your peptides and dosing are tailored to your goal —
                  recovery, fat loss, performance, or longevity.
                </p>
                <Link
                  href={LEARN_HREF}
                  className="mt-6 inline-block text-sm font-bold text-[#E6007E] underline decoration-[#E6007E]/40 underline-offset-4 hover:text-[#FF2D8E]"
                >
                  Read our full guide to peptide therapy →
                </Link>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] lg:aspect-auto lg:min-h-[420px]">
                <Image
                  src="/images/team/dani-ryan-founders-portrait.png"
                  alt="Danielle Alcala-Glazier and Ryan Kent, FNP-BC at Hello Gorgeous Med Spa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </FadeUp>
        </Section>

        <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white">
          <FadeUp>
            <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-[#E6007E]">
              Six types we offer
            </p>
            <h2 className="mx-auto mt-2 max-w-2xl text-center font-serif text-3xl font-black text-black md:text-4xl">
              Targeted. Science-informed. Built for you.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TYPES.map((item) => (
                <div
                  key={item.n}
                  className="rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"
                >
                  <p className="text-[11px] font-black tracking-widest text-[#E6007E]">{item.n}</p>
                  <h3 className="mt-1 font-serif text-lg font-black text-black">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-black/70">{item.body}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </Section>

        <Section id="peptides" className="scroll-mt-24 border-b-4 border-black bg-white">
          <FadeUp>
            <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-[#E6007E]">
              Shop by goal
            </p>
            <h2 className="mx-auto mt-2 max-w-2xl text-center font-serif text-3xl font-black text-black md:text-4xl">
              Peptide protocols we offer
            </h2>

            <div className="mt-12">
              <GroupHeading>Weight loss & metabolic peptides</GroupHeading>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {WEIGHT_LOSS.map((card) => (
                  <ProtocolCard key={card.name} {...card} />
                ))}
              </div>
            </div>

            <div className="mt-14">
              <GroupHeading>Growth-hormone & recovery peptides</GroupHeading>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {RECOVERY.map((card) => (
                  <ProtocolCard key={card.name} {...card} />
                ))}
              </div>
            </div>

            <div className="mt-14">
              <GroupHeading>Everyday wellness add-ons</GroupHeading>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {wellness.map((shot) => (
                  <Link
                    key={shot.id}
                    href="/iv-shots"
                    className="rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] transition hover:-translate-y-0.5"
                  >
                    <p className="font-serif text-lg font-black text-black">{shot.name}</p>
                    <p className="mt-1 text-sm font-medium text-black/60">{shot.benefit}</p>
                    <p className="mt-3 text-sm font-black text-[#FF2D8E]">From ${shot.price}</p>
                  </Link>
                ))}
              </div>
              <p className="mt-5 text-center text-sm font-medium text-black/50">
                In-clinic Vitamin Bar shots. Pricing is confirmed at your visit — ask about stacking
                with a peptide protocol.
              </p>
            </div>
          </FadeUp>
        </Section>

        <section
          id="program"
          className="relative scroll-mt-24 overflow-hidden border-b-4 border-black px-6 py-20 md:px-12 md:py-28"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 45%, #2d1020 100%)`,
            }}
          />
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <FadeUp>
              <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-[#FF2D8E]">
                Your program
              </p>
              <h2 className="mx-auto mt-2 max-w-2xl text-center font-serif text-3xl font-black text-white md:text-4xl">
                Built around your biology — not guesswork
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-center text-[15px] font-medium leading-relaxed text-white/70">
                Every peptide protocol at Hello Gorgeous RX is medically supervised. Intake is free
                to submit. A ${PEPTIDE_CONSULT_FEE_USD} consult reserves your visit with{" "}
                {PRESCRIBING_NP.displayName}.
              </p>
              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {PROGRAM_STEPS.map((step) => (
                  <div key={step.n}>
                    <p className="font-serif text-4xl font-black text-[#FF2D8E]">{step.n}</p>
                    <h3 className="mt-2 font-serif text-lg font-black text-white">{step.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-white/60">{step.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex justify-center">
                <CTA href={PRIMARY_BOOKING_CTA.href} variant="gradient">
                  Book your consult
                </CTA>
              </div>
            </FadeUp>
          </div>
        </section>

        <Section id="faq" className="scroll-mt-24 border-b-4 border-black bg-white">
          <FadeUp>
            <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-[#E6007E]">
              Questions
            </p>
            <h2 className="mt-2 text-center font-serif text-3xl font-black text-black md:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mx-auto mt-11 flex max-w-[860px] flex-col gap-3">
              {PEPTIDES_HUB_FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="group overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.35)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-serif text-lg font-bold text-black marker:content-none group-open:text-[#E6007E]">
                    {faq.question}
                    <span className="text-2xl font-normal text-[#E6007E] group-open:hidden">+</span>
                    <span className="hidden text-2xl font-normal text-[#E6007E] group-open:inline">
                      –
                    </span>
                  </summary>
                  <p className="px-6 pb-5 text-[15px] font-medium leading-relaxed text-black/75">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </FadeUp>
        </Section>

        <section
          className="relative overflow-hidden border-b-4 border-black px-6 py-16 text-center md:px-12"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <h2 className="font-serif text-3xl font-black text-white md:text-4xl">
            Ready to build your protocol?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm font-medium text-white/85">
            Free consult. {PRESCRIBING_NP.displayName} sets your plan. Nothing ships until he
            approves it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTA href={PRIMARY_BOOKING_CTA.href} variant="white">
              Book a free consult
            </CTA>
            <CTA
              href={SHOP_HREF}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black"
            >
              Shop RE GEN
            </CTA>
          </div>
        </section>
      </main>
    </div>
  );
}
