"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { SITE } from "@/lib/seo";
import {
  LEADERSHIP_TEAM,
  NEW_TEAM_MEMBERS,
  TEAM_FOUNDERS_GROUP_IMAGE,
  type TeamMember,
} from "@/lib/team-members";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

const JUMP_LINKS = [
  { label: "Michelle Colby", href: "#michelle-colby" },
  { label: "Marissa Murray", href: "#marissa-murray" },
  { label: "Dani & Ryan", href: "#leadership" },
  { label: "Book a visit", href: BOOKING_URL, external: true },
] as const;

function SpecialtyChips({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border-2 border-black bg-gradient-to-b from-white to-rose-50 px-3 py-1 text-xs font-bold text-black/80"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function TeamMemberCard({
  member,
  index,
  variant = "featured",
}: {
  member: TeamMember;
  index: number;
  variant?: "featured" | "compact";
}) {
  const isFeatured = variant === "featured";

  return (
    <FadeUp delayMs={index * 50}>
      <article
        id={member.slug}
        className="scroll-mt-28 rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] overflow-hidden"
      >
        {member.isNewHire ? (
          <div className="border-b-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-2 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white">
              Welcome to the team
            </p>
          </div>
        ) : null}

        <div className={isFeatured ? "p-6 md:p-8" : "p-5 md:p-6"}>
          <div
            className={
              isFeatured
                ? "grid gap-6 md:grid-cols-[220px_1fr] md:items-start"
                : "grid gap-4 md:grid-cols-[140px_1fr] md:items-start"
            }
          >
            <div
              className={`relative overflow-hidden rounded-2xl border-4 border-black ${
                isFeatured ? "aspect-[4/5] w-full max-w-[260px]" : "aspect-[4/5] w-full max-w-[180px]"
              }`}
            >
              <Image
                src={member.image.src}
                alt={member.image.alt}
                fill
                className="object-cover object-top"
                sizes={isFeatured ? "(max-width: 768px) 260px, 220px" : "180px"}
              />
            </div>

            <div className="min-w-0">
              <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                {member.badge}
              </span>
              <h2
                className={`mt-3 font-black text-black tracking-tight ${
                  isFeatured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                }`}
              >
                {member.fullName}
              </h2>
              <p className="mt-1 text-sm font-bold uppercase tracking-wide text-[#E6007E]">
                {member.title}
              </p>

              <div className="mt-4 space-y-3">
                {member.bioParagraphs.map((para) => (
                  <p key={para.slice(0, 40)} className="text-sm md:text-base leading-relaxed text-black/85 font-medium">
                    {para}
                  </p>
                ))}
              </div>

              <SpecialtyChips items={member.specialties} />

              {member.profileHref ? (
                <Link
                  href={member.profileHref}
                  className="mt-5 inline-block text-sm font-bold text-[#E6007E] hover:underline"
                >
                  Full profile →
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </FadeUp>
  );
}

export function MeetTheTeamPageContent() {
  return (
    <div className="relative min-h-[100dvh]">
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
                Now welcoming Michelle &amp; Marissa
              </div>
              <p className="text-sm md:text-base text-[#FFB8DC] font-semibold mb-4 max-w-2xl mx-auto leading-relaxed">
                {HG_TAGLINE}
              </p>
              <p className="text-xs md:text-sm uppercase tracking-widest text-white/70 font-medium mb-4">
                Oswego · Naperville · Aurora · Plainfield
              </p>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white drop-shadow-lg">
                Meet the{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Team
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
                The people behind Hello Gorgeous — licensed, medically guided, and genuinely here for you.
                Get to know the team caring for you at every visit.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                <CTA href={BOOKING_URL} variant="gradient" className="!px-8 !py-4">
                  Book a visit
                </CTA>
                <CTA
                  href="/about"
                  variant="outline"
                  className="!border-white/40 !text-white hover:!bg-white/10 !px-8 !py-4"
                >
                  About Dani &amp; Ryan
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Jump nav */}
        <nav
          aria-label="Team sections"
          className="sticky top-0 z-20 border-b-4 border-black bg-white/70 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2 px-4 py-3">
            {JUMP_LINKS.map((link) =>
              "external" in link && link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full border-2 border-black bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-xs font-bold text-black/80 transition hover:border-[#E6007E] hover:text-[#E6007E]"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full border-2 border-black bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-xs font-bold text-black/80 transition hover:border-[#E6007E] hover:text-[#E6007E]"
                >
                  {link.label}
                </a>
              )
            )}
          </div>
        </nav>

        {/* New team members */}
        <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-12 md:py-16 !px-0">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <div className="mb-8 text-center">
                <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                  01
                </span>
                <h2 className="mt-4 text-2xl md:text-4xl font-black text-black">
                  New faces at Hello Gorgeous
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-base text-black/70 font-medium">
                  Please join us in welcoming Michelle and Marissa — here to make every visit feel personal,
                  comfortable, and expertly guided.
                </p>
              </div>
            </FadeUp>

            <div className="space-y-8">
              {NEW_TEAM_MEMBERS.map((member, i) => (
                <TeamMemberCard key={member.id} member={member} index={i} variant="featured" />
              ))}
            </div>
          </div>
        </Section>

        {/* Leadership */}
        <Section
          id="leadership"
          className="scroll-mt-24 border-b-4 border-black bg-white py-12 md:py-16 !px-0"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <div className="mb-8 text-center">
                <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                  02
                </span>
                <h2 className="mt-4 text-2xl md:text-4xl font-black text-black">
                  Founders &amp; medical leadership
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-base text-black/70 font-medium">
                  Family-owned at 74 W. Washington St. — Danielle on aesthetics, Ryan on medical oversight,
                  on site every week.
                </p>
              </div>
            </FadeUp>

            <FadeUp delayMs={40}>
              <div className="relative mx-auto mb-8 aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src={TEAM_FOUNDERS_GROUP_IMAGE}
                  alt="Danielle Alcala-Glazier and Ryan Kent, FNP-BC — founders of Hello Gorgeous Med Spa in Oswego, IL"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 448px"
                />
              </div>
            </FadeUp>

            <div className="grid gap-6 md:grid-cols-2">
              {LEADERSHIP_TEAM.map((member, i) => (
                <TeamMemberCard key={member.id} member={member} index={i} variant="compact" />
              ))}
            </div>

            <FadeUp delayMs={80}>
              <p className="mt-8 text-center">
                <Link href="/about" className="text-sm font-bold text-[#E6007E] hover:underline">
                  Read the full Dani &amp; Ryan story →
                </Link>
              </p>
            </FadeUp>
          </div>
        </Section>

        {/* CTA */}
        <Section className="border-t-4 border-black py-14 md:py-16 !px-0">
          <div
            className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border-4 border-black px-6 py-12 text-center md:px-10"
            style={{
              background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black text-white">Ready to meet us in person?</h2>
              <p className="mt-3 text-white/90 font-medium">
                {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL · {SITE.phone}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOKING_URL} variant="white">
                  Book on Fresha
                </CTA>
                <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline">
                  Call {SITE.phone}
                </CTA>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
