"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { SITE } from "@/lib/seo";
import {
  XEOMIN_AREAS,
  XEOMIN_COMPARE_ROWS,
  XEOMIN_HOW_STEPS,
  XEOMIN_INTRO,
  XEOMIN_INTRO_FAQS,
  XEOMIN_ISI,
  XEOMIN_NAV,
  XEOMIN_PERKS,
  XEOMIN_PLANS,
  XEOMIN_PRICE_LINE,
  XEOMIN_REWARDS_PERKS,
  XEOMIN_TEAM,
  XEOMIN_VISIT_STEPS,
} from "@/lib/xeomin-intro";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

const TEL = `tel:${SITE.phone.replace(/-/g, "")}`;
const PHONE_DISPLAY = "(630) 636-6193";

function StampCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white text-lg font-black border-2 border-black"
      aria-hidden
    >
      {n}
    </span>
  );
}

export function XeominIntroPageContent() {
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

          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
                New at Hello Gorgeous
              </div>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/70 md:text-sm">
                Oswego · Naperville · Aurora · Plainfield
              </p>
              <h1 className="mb-6 text-4xl font-black leading-tight text-white drop-shadow-lg md:text-6xl">
                Meet{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Xeomin
                </span>
                , the purified toxin
              </h1>
              <p className="mb-4 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
                Double-filtered with XTRACT Technology™ — just the active toxin, no extra proteins. Made to enhance
                your look, not change it. {XEOMIN_PRICE_LINE}.
              </p>
              <p className="mb-8 max-w-xl text-sm font-medium leading-relaxed text-[#FFB8DC]">{HG_TAGLINE}</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <CTA href={XEOMIN_INTRO.bookHref} variant="gradient" className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]">
                  Book Xeomin
                </CTA>
                <a
                  href={TEL}
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-md border-2 border-white px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-black md:w-auto"
                >
                  Call {PHONE_DISPLAY}
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.45)]">
                <Image
                  src={XEOMIN_INTRO.heroImage}
                  alt={XEOMIN_INTRO.heroImageAlt}
                  fill
                  className="object-cover object-[center_35%]"
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-4 w-32 overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(0,0,0,0.35)] md:w-40">
                <Image
                  src={XEOMIN_INTRO.vialImage}
                  alt={XEOMIN_INTRO.vialAlt}
                  width={320}
                  height={320}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </Section>

        <section className="border-b-4 border-black bg-[#0a0a0a] py-10 text-white md:py-14">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4 md:px-6">
            {[
              { n: `${SITE.reviewRating}★`, l: `${SITE.reviewCount}+ Google reviews` },
              { n: `${SITE.visitReviewRating}★`, l: `${Number(SITE.visitReviewCount).toLocaleString()} visit reviews` },
              { n: "#1", l: "Best Med Spa in Oswego" },
              { n: "5", l: "neurotoxin brands on one menu" },
            ].map((s) => (
              <div key={s.l}>
                <p className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-3xl font-black text-transparent md:text-5xl">
                  {s.n}
                </p>
                <p className="mt-2 text-xs font-medium text-white/70 md:text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <Section className="!py-12 border-b-4 border-black bg-white/70 backdrop-blur-sm">
          <nav aria-label="On this page" className="mx-auto max-w-5xl px-4 md:px-6">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black">
              <span className="text-[#E6007E]" aria-hidden>
                ✦
              </span>
              Jump to a section
            </p>
            <ul className="flex flex-wrap gap-2">
              {XEOMIN_NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-sm font-medium text-black shadow-sm transition-all hover:border-[#E6007E] hover:text-[#E6007E] hover:shadow-md"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        <Section id="what" className="scroll-mt-28 !py-16 md:!py-20 bg-gradient-to-b from-white to-[#FFF5FA]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
            <FadeUp>
              <StampCard className="p-8 md:p-10">
                <div className="mb-6 flex items-start gap-3">
                  <Badge n={1} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">The Xeomin difference</p>
                    <h2 className="mt-1 text-2xl font-black leading-tight text-black md:text-3xl">
                      Beauty with intention. Double filtered.
                    </h2>
                  </div>
                </div>
                <p className="text-base font-medium leading-relaxed text-black/85">
                  Xeomin (incobotulinumtoxinA) by Merz is FDA-approved to temporarily improve moderate to severe
                  frown lines, forehead lines, and crow’s feet — together or one area at a time. It is the first and
                  only double-purified neuromodulator, using XTRACT Technology™ to strip away unnecessary complexing
                  proteins.
                </p>
                <ul className="mt-6 space-y-4">
                  {XEOMIN_PERKS.map((perk) => (
                    <li key={perk.title} className="flex gap-3">
                      <span className="mt-0.5 text-lg font-black text-[#E6007E]" aria-hidden>
                        ▸
                      </span>
                      <span>
                        <span className="font-bold text-[#E6007E]">{perk.title}.</span>{" "}
                        <span className="font-medium text-black/85">{perk.body}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </StampCard>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src={XEOMIN_INTRO.vialImage}
                  alt={XEOMIN_INTRO.vialAlt}
                  fill
                  className="object-contain bg-[#fff7fb] p-8"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section id="how" className="scroll-mt-28 !py-16 md:!py-20 bg-white/50">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">How Xeomin works</p>
              <h2 className="mt-2 text-3xl font-black text-black md:text-4xl">
                Smooth the lines. Keep the face.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl font-medium text-black/70">
                Xeomin relaxes the muscles that cause dynamic wrinkles — the ones that show when you smile, frown, or
                squint — so upper-face lines look softer without looking done.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {XEOMIN_HOW_STEPS.map((step, i) => (
                <StampCard key={step.title} className="p-7">
                  <Badge n={i + 1} />
                  <h3 className="mt-4 text-xl font-black text-[#E6007E]">{step.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-black/80">{step.body}</p>
                </StampCard>
              ))}
            </div>
            <p className="mt-8 text-center text-sm font-medium text-black/55">
              Science from Merz Aesthetics.{" "}
              <a
                href={XEOMIN_INTRO.manufacturerHowItWorksUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#E6007E] underline underline-offset-2"
              >
                How Xeomin works on XeominAesthetic.com
              </a>
            </p>
          </div>
        </Section>

        <Section id="compare" className="scroll-mt-28 !py-16 md:!py-20 bg-gradient-to-b from-white to-[#FFF5FA]">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <FadeUp>
              <div className="mb-8 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Xeomin vs. other toxins</p>
                <h2 className="mt-2 text-3xl font-black text-black md:text-4xl">
                  How it{" "}
                  <span
                    className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                    style={{ WebkitBackgroundClip: "text" }}
                  >
                    compares
                  </span>
                </h2>
              </div>
              <StampCard className="overflow-x-auto p-0">
                <table className="w-full min-w-[560px] text-left text-sm md:text-base">
                  <thead>
                    <tr className="border-b-4 border-black">
                      <th className="px-4 py-4 font-black md:px-6" />
                      <th className="bg-[#FFF0F7] px-4 py-4 font-black text-[#E6007E] md:px-6">Xeomin</th>
                      <th className="px-4 py-4 font-black text-black/70 md:px-6">Botox / Dysport</th>
                    </tr>
                  </thead>
                  <tbody>
                    {XEOMIN_COMPARE_ROWS.map((row) => (
                      <tr key={row.label} className="border-b border-black/10 last:border-b-0">
                        <th className="px-4 py-4 align-top font-bold text-black md:px-6">{row.label}</th>
                        <td className="bg-[#FFF0F7] px-4 py-4 align-top font-medium text-black/85 md:px-6">
                          {row.xeomin}
                        </td>
                        <td className="px-4 py-4 align-top font-medium text-black/70 md:px-6">{row.others}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </StampCard>
              <p className="mx-auto mt-5 max-w-2xl text-center text-sm font-medium text-black/55">
                Individual results and duration vary. Ryan will help you pick the brand that fits your face — we
                carry all five. See the{" "}
                <Link href="/blog/neurotoxin-comparison" className="font-bold text-[#E6007E] underline underline-offset-2">
                  six-way wrinkle-relaxer comparison
                </Link>
                .
              </p>
            </FadeUp>
          </div>
        </Section>

        <Section id="areas" className="scroll-mt-28 !py-16 md:!py-20 bg-gradient-to-b from-white to-[#FFF5FA]">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Treatment map</p>
              <h2 className="mt-2 text-3xl font-black text-black md:text-4xl">Areas we treat with Xeomin</h2>
              <p className="mx-auto mt-3 max-w-2xl font-medium text-black/70">
                FDA-approved for frown lines, forehead lines, and crow’s feet — treated together or one at a time.
                Ryan can also map other expression lines when it’s clinically appropriate. Nothing is injected until
                you approve the units.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {XEOMIN_AREAS.map((area) => {
                const inner = (
                  <StampCard className="h-full p-6 transition hover:-translate-y-0.5">
                    <h3 className="text-lg font-black text-[#E6007E]">{area.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-black/80">{area.blurb}</p>
                  </StampCard>
                );
                return area.href ? (
                  <Link key={area.title} href={area.href} className="block">
                    {inner}
                  </Link>
                ) : (
                  <div key={area.title}>{inner}</div>
                );
              })}
            </div>
          </div>
        </Section>

        <Section id="pricing" className="scroll-mt-28 !py-16 md:!py-20 bg-white/50">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Treatment options</p>
              <h2 className="mt-2 text-3xl font-black text-black md:text-4xl">
                Pick your{" "}
                <span
                  className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  plan
                </span>
              </h2>
              <p className="mt-3 font-medium text-black/70">Every visit is directed by a full-authority nurse practitioner.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {XEOMIN_PLANS.map((plan, i) => {
                const card = (
                  <StampCard className="flex h-full flex-col p-8">
                    <Badge n={i + 1} />
                    <h3 className="mt-4 text-2xl font-black text-[#E6007E]">{plan.name}</h3>
                    <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-black/75">{plan.detail}</p>
                    <p className="mt-5 text-3xl font-black text-black">{plan.price}</p>
                    <p className="mt-1 text-xs font-medium text-black/55">{plan.note}</p>
                  </StampCard>
                );
                if (!("href" in plan) || !plan.href) return <div key={plan.name}>{card}</div>;
                const external = plan.href.startsWith("http");
                return external ? (
                  <a key={plan.name} href={plan.href} target="_blank" rel="noopener noreferrer" className="block">
                    {card}
                  </a>
                ) : (
                  <Link key={plan.name} href={plan.href} className="block">
                    {card}
                  </Link>
                );
              })}
            </div>
          </div>
        </Section>

        <Section className="!py-16 md:!py-20 bg-gradient-to-b from-white to-[#FFF5FA]">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Your visit</p>
              <h2 className="mt-2 text-3xl font-black text-black md:text-4xl">What happens at Hello Gorgeous</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {XEOMIN_VISIT_STEPS.map((step) => (
                <StampCard key={step.n} className="p-7">
                  <p className="text-sm font-black tracking-widest text-[#E6007E]">{step.n}</p>
                  <h3 className="mt-2 text-xl font-black text-black">{step.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-black/80">{step.body}</p>
                </StampCard>
              ))}
            </div>
            <p className="mt-6 text-center text-sm font-medium text-black/55">
              Aftercare matches our other neuromodulators.{" "}
              <Link href="/pre-post-care/botox" className="font-bold text-[#E6007E] underline underline-offset-2">
                Read the care guide
              </Link>
              .
            </p>
          </div>
        </Section>

        <Section id="team" className="scroll-mt-28 !py-16 md:!py-20 bg-white/50">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Meet your providers</p>
              <h2 className="mt-2 text-3xl font-black text-black md:text-4xl">Directed by Dr. Arora, Dani &amp; Ryan</h2>
              <p className="mt-3 font-medium text-black/70">{HG_TAGLINE}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {XEOMIN_TEAM.map((person) => (
                <Link key={person.name} href={person.href} className="block">
                  <StampCard className="h-full overflow-hidden p-0 text-center">
                    <div className="relative mx-auto mt-8 h-36 w-36 overflow-hidden rounded-full border-4 border-black">
                      <Image src={person.image} alt={person.imageAlt} fill className="object-cover" sizes="144px" />
                    </div>
                    <div className="p-6 pt-5">
                      <h3 className="text-xl font-black text-black">{person.name}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#E6007E]">{person.role}</p>
                      <p className="mt-3 text-sm font-medium leading-relaxed text-black/75">{person.body}</p>
                    </div>
                  </StampCard>
                </Link>
              ))}
            </div>
          </div>
        </Section>

        <Section id="rewards" className="scroll-mt-28 !py-16 md:!py-20 bg-gradient-to-b from-white to-[#FFF5FA]">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Xperience+</p>
              <h2 className="mt-2 text-3xl font-black text-black md:text-4xl">
                Rewarded,{" "}
                <span
                  className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  pure &amp; simple
                </span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl font-medium text-black/70">
                Looking good should feel rewarding. Join Merz’s Xperience+ loyalty program — Hello Gorgeous is a
                participating provider, so we apply your savings at the visit.
              </p>
            </div>
            <div className="mb-8 grid gap-6 md:grid-cols-3">
              {XEOMIN_REWARDS_PERKS.map((perk, i) => (
                <StampCard key={perk.title} className="p-7">
                  <Badge n={i + 1} />
                  <h3 className="mt-4 text-xl font-black text-[#E6007E]">{perk.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-black/80">{perk.body}</p>
                </StampCard>
              ))}
            </div>
            <StampCard className="overflow-hidden p-0 md:grid md:grid-cols-2">
              <div className="relative min-h-[240px] bg-black md:min-h-full">
                <Image
                  src={XEOMIN_INTRO.teamImage}
                  alt="Danielle Alcala-Glazier and Ryan Kent, FNP-BC at Hello Gorgeous Med Spa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8 md:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">At your visit</p>
                <h3 className="mt-2 text-2xl font-black text-black">Enroll once. We apply it here.</h3>
                <p className="mt-4 font-medium leading-relaxed text-black/80">
                  Create a free Xperience+ account before you come in — or we’ll walk you through it at the desk.
                  After Xeomin, we look you up by phone or email and apply eligible points and the $50 instant save.
                </p>
                <ul className="mt-4 space-y-2 text-sm font-medium text-black/75">
                  <li>▸ Bonus points for signup, birthday month, and coming back to the same provider</li>
                  <li>▸ Points expire 12 months from the date earned</li>
                  <li>▸ $50 instant save and points once every 90 days, at provider discretion</li>
                </ul>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <CTA href={XEOMIN_INTRO.xperienceUrl} variant="gradient">
                    Join Xperience+
                  </CTA>
                  <a
                    href={XEOMIN_INTRO.manufacturerRewardsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-md border-2 border-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
                  >
                    Merz rewards details
                  </a>
                </div>
                <p className="mt-4 text-xs font-medium text-black/50">
                  Terms, instant-savings eligibility, and annual caps set by Merz Xperience+.{" "}
                  <a
                    href={XEOMIN_INTRO.manufacturerRewardsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#E6007E] underline underline-offset-2"
                  >
                    XeominAesthetic.com/rewards
                  </a>
                </p>
              </div>
            </StampCard>
          </div>
        </Section>

        <Section id="faq" className="scroll-mt-28 !py-16 md:!py-20 bg-white/50">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <StampCard className="p-8 md:p-10">
              <div className="mb-6 flex items-start gap-3">
                <Badge n={7} />
                <div>
                  <h2 className="text-2xl font-black leading-tight text-black md:text-3xl">Good to know</h2>
                  <p className="mt-2 font-medium leading-relaxed text-black/65">Common questions about Xeomin in Oswego.</p>
                </div>
              </div>
              <dl className="mt-6 space-y-0 border-t-2 border-black/10">
                {XEOMIN_INTRO_FAQS.map((item) => (
                  <div key={item.question} className="border-b border-black/10 last:border-b-0">
                    <dt className="pb-2 pt-6">
                      <span className="flex items-start gap-2 text-lg font-bold text-[#E6007E]">
                        <span className="mt-0.5 text-black" aria-hidden>
                          ▸
                        </span>
                        {item.question}
                      </span>
                    </dt>
                    <dd className="pb-6 pl-6 font-medium leading-relaxed text-black/85">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </StampCard>
          </div>
        </Section>

        <Section id="book" className="relative !py-20 overflow-hidden border-t-4 border-black">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(125deg, ${BRAND.pinkHot} 0%, ${BRAND.pink} 45%, #9b0a4d 100%)`,
            }}
          />
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
            <h2 className="mb-4 text-3xl font-black text-white drop-shadow-md md:text-4xl">Ready to try Xeomin?</h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-white/95">
              Free consult — same-day appointments often available in downtown Oswego. {XEOMIN_PRICE_LINE}, mapped
              at the visit.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <CTA href={XEOMIN_INTRO.bookHref} variant="white" className="shadow-xl">
                Book Xeomin
              </CTA>
              <a
                href={TEL}
                className="inline-flex items-center justify-center rounded-xl border-2 border-white px-8 py-4 font-bold text-white shadow-lg transition hover:bg-white hover:text-[#E6007E]"
              >
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </Section>

        <section className="border-t-4 border-black bg-[#111] px-4 py-10 text-white/80 md:px-6">
          <div className="mx-auto max-w-3xl text-xs leading-relaxed font-medium md:text-sm">
            <p className="font-black uppercase tracking-widest text-[#FFB8DC]">Important safety information</p>
            <p className="mt-3">{XEOMIN_ISI.uses}</p>
            <p className="mt-3">{XEOMIN_ISI.warning}</p>
            <p className="mt-3">{XEOMIN_ISI.common}</p>
            <p className="mt-3">{XEOMIN_ISI.doses}</p>
            <p className="mt-3">
              This is not the full risk information. Read the Medication Guide and Full Prescribing Information at{" "}
              <a
                href={XEOMIN_INTRO.manufacturerHowItWorksUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#FFB8DC] underline underline-offset-2"
              >
                XeominAesthetic.com
              </a>
              , or call 1-866-862-1211. Talk with Ryan Kent, FNP-BC before treatment.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
