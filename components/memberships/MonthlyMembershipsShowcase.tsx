"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { appMembershipUrl } from "@/lib/monthly-memberships-marketing";
import { VITAMIN_MEMBERSHIPS } from "@/lib/vitamin-bar";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

const JUMP_LINKS = [
  { href: "#vitamin-bar-plans", label: "Vitamin Bar" },
  { href: "#facial-lash-plans", label: "Facial & Lashes" },
  { href: "#membership-faq", label: "FAQ" },
] as const;

const vitaminPlans = VITAMIN_MEMBERSHIPS.filter((m) => !m.category);
const aestheticPlans = VITAMIN_MEMBERSHIPS.filter((m) => m.category);

export function MonthlyMembershipsShowcase() {
  const joinUrl = appMembershipUrl();

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

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-[#E6007E] animate-pulse" aria-hidden />
                Monthly memberships
              </div>
              <p className="text-sm md:text-base text-[#FFB8DC] font-semibold mb-4 max-w-2xl mx-auto leading-relaxed">
                {HG_TAGLINE}
              </p>
              <p className="text-xs md:text-sm uppercase tracking-widest text-white/70 font-medium mb-4">
                Oswego · Naperville · Aurora · Plainfield · Montgomery · Yorkville
              </p>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white drop-shadow-lg">
                Med Spa{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Memberships
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-8">
                Five monthly plans — Vitamin Bar shots, HydraFacials, and lash fills — with member pricing,
                drive-thru priority, and Square billing. Join in the{" "}
                <Link
                  href={joinUrl}
                  className="text-[#FFB8DC] font-semibold underline decoration-[#E6007E] underline-offset-4 hover:text-white"
                >
                  Hello Gorgeous app
                </Link>{" "}
                or call{" "}
                <a
                  href={`tel:${SITE.phone}`}
                  className="font-bold text-[#FFB8DC] hover:text-white underline decoration-[#E6007E]"
                >
                  {SITE.phone}
                </a>
                .
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <CTA href={joinUrl} variant="gradient">
                  Join in the app
                </CTA>
                <CTA href={BOOKING_URL} variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-black">
                  Book a visit
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        <nav
          className="sticky top-0 z-20 border-b-4 border-black bg-white/70 backdrop-blur-md"
          aria-label="Membership sections"
        >
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-2">
            {JUMP_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border-2 border-black bg-gradient-to-b from-white to-rose-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <MembershipSection
          id="vitamin-bar-plans"
          index={1}
          title="Vitamin Bar memberships"
          subtitle="Drive-thru wellness shots · member pricing · skip-the-line priority"
          stripe="white"
          plans={vitaminPlans}
          joinUrl={joinUrl}
        />

        <MembershipSection
          id="facial-lash-plans"
          index={2}
          title="Facial & lash memberships"
          subtitle="Monthly HydraFacials and lash fills — bundled with Biotin for inside-out glow"
          stripe="rose"
          plans={aestheticPlans}
          joinUrl={joinUrl}
        />

        <Section id="membership-faq" className="scroll-mt-24 border-t-4 border-black bg-white py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-4">
            <FadeUp>
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-sm font-black text-white">
                  ?
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-black">Membership FAQ</h2>
              </div>
              <div className="space-y-6">
                {[
                  {
                    q: "Where is Hello Gorgeous Med Spa?",
                    a: `${SITE.name} is at 74 W Washington St, Oswego, IL 60543 — convenient for Naperville, Aurora, Plainfield, Montgomery, and Yorkville.`,
                  },
                  {
                    q: "Who oversees treatments?",
                    a: "Ryan Kent, FNP-BC, is on site seven days a week. Vitamin Bar shots and aesthetic memberships are provided under medical supervision at our downtown Oswego location.",
                  },
                  {
                    q: "How does billing work?",
                    a: "Memberships bill monthly through Square. Enroll in the Hello Gorgeous app (Membership tab) for a secure checkout link, or ask our front desk to help you join in person.",
                  },
                ].map((item) => (
                  <div key={item.q}>
                    <h3 className="font-bold text-[#E6007E] text-lg">
                      <span aria-hidden className="mr-1">
                        ▸
                      </span>
                      {item.q}
                    </h3>
                    <p className="mt-2 text-black/85 font-medium leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        <section
          className="relative border-t-4 border-black py-16 md:py-20 overflow-hidden"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to join?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Pick your plan in the app — or book a visit and we&apos;ll walk you through every perk.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <CTA href={joinUrl} variant="white">
                Open Membership tab
              </CTA>
              <CTA href={`tel:${SITE.phone}`} variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-black">
                Call {SITE.phone}
              </CTA>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MembershipSection({
  id,
  index,
  title,
  subtitle,
  stripe,
  plans,
  joinUrl,
}: {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  stripe: "white" | "rose";
  plans: typeof VITAMIN_MEMBERSHIPS;
  joinUrl: string;
}) {
  const bg =
    stripe === "rose"
      ? "bg-gradient-to-b from-[#FFF0F7] via-white to-[#FFF0F7]"
      : "bg-white";

  return (
    <Section id={id} className={`scroll-mt-24 border-t-4 border-black ${bg} py-14 md:py-20`}>
      <div className="max-w-6xl mx-auto px-4">
        <FadeUp>
          <div className="flex items-start gap-3 mb-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-sm font-black text-white">
              {index}
            </span>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-black">{title}</h2>
              <p className="mt-1 text-black/70 font-medium">{subtitle}</p>
            </div>
          </div>
        </FadeUp>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {plans.map((m, i) => (
            <FadeUp key={m.id} delayMs={i * 80}>
              <article className="h-full rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] overflow-hidden flex flex-col">
                {m.image ? (
                  <div className="relative aspect-[3/4] w-full border-b-4 border-black bg-black">
                    <Image
                      src={m.image}
                      alt={`${m.name} membership flyer — Hello Gorgeous Med Spa Oswego IL`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={i === 0}
                    />
                  </div>
                ) : null}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {m.highlight ? (
                      <span className="rounded-full border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-0.5 text-[10px] font-bold uppercase text-white">
                        Most popular
                      </span>
                    ) : null}
                    {m.category ? (
                      <span className="rounded-full border-2 border-black bg-[#FFF0F7] px-3 py-0.5 text-[10px] font-bold uppercase text-[#E6007E]">
                        {m.category}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl md:text-2xl font-black text-black">{m.name}</h3>
                    <p className="shrink-0 text-right">
                      <span className="text-3xl font-black text-[#E6007E]">${m.pricePerMonth}</span>
                      <span className="text-sm font-bold text-black/50">/mo</span>
                    </p>
                  </div>
                  <p className="mt-2 text-black/80 font-medium">{m.summary}</p>
                  <ul className="mt-4 space-y-2 flex-1">
                    {m.perks.map((perk) => (
                      <li key={perk} className="flex gap-2 text-sm text-black/85 font-medium">
                        <span className="text-[#E6007E] font-bold" aria-hidden>
                          ✓
                        </span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                  {m.rolloverNote ? (
                    <p className="mt-4 text-xs text-black/65 font-medium border-l-4 border-[#FF2D8E] pl-3">
                      {m.rolloverNote}
                    </p>
                  ) : null}
                  <div className="mt-6 flex flex-col sm:flex-row gap-2">
                    <CTA href={joinUrl} variant="gradient" className="!px-6 !py-3 !text-xs">
                      Join in app
                    </CTA>
                    {m.squarePayUrl ? (
                      <CTA href={m.squarePayUrl} variant="outline" className="!px-6 !py-3 !text-xs">
                        Square checkout
                      </CTA>
                    ) : null}
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  );
}
