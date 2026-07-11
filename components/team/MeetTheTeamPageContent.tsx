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
  TEAM_FOUNDERS_GROUP_IMAGE,
  TEAM_MEMBERS,
  type TeamMember,
} from "@/lib/team-members";

const TEXT_TEL = "sms:6302016867";
const TEXT_DISPLAY = "(630) 201-6867";

const JUMP_LINKS = [
  { label: "Michelle Colby", href: "#michelle-colby" },
  { label: "Marissa Murray", href: "#marissa-murray" },
  { label: "Laura Witt", href: "#laura-witt" },
  { label: "Jen Vokoun", href: "#jen-vokoun" },
  { label: "Dani & Ryan", href: "#leadership" },
  { label: "Book a visit", href: BOOKING_URL, external: true },
] as const;

function PinkBtn({ href, children }: { href: string; children: React.ReactNode }) {
  const cls =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#FF2D8E] px-7 py-3.5 text-base font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-white";
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

function GhostBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/45 px-7 py-3.5 text-base font-bold text-white transition hover:-translate-y-0.5 hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
    >
      {children}
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#FF2D8E]">
      {children}
    </p>
  );
}

/** Name in serif with the last word in hot pink — the Jen Vokoun treatment. */
function AccentName({ fullName }: { fullName: string }) {
  const parts = fullName.split(" ");
  const last = parts.pop();
  return (
    <h2 className="mt-3 font-serif text-[38px] font-bold leading-tight text-white lg:text-[52px]">
      {parts.join(" ")} <span className="text-[#FF2D8E]">{last}</span>
    </h2>
  );
}

function ArtistProfile({
  member,
  flip,
  index,
}: {
  member: TeamMember;
  flip?: boolean;
  index: number;
}) {
  const firstName = member.fullName.split(" ")[0];

  return (
    <section
      id={member.slug}
      className={`scroll-mt-24 px-6 py-16 lg:py-24 ${
        flip
          ? "bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)]"
          : "bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)]"
      }`}
    >
      <FadeUp delayMs={index * 40}>
        <div
          className={`mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 ${
            flip ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={member.image.src}
                alt={member.image.alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            </div>
          </div>
          <div>
            <Eyebrow>{member.badge}</Eyebrow>
            <AccentName fullName={member.fullName} />
            <p className="mt-2 text-[15px] font-bold uppercase tracking-[0.16em] text-white/60">
              {member.title}
            </p>
            {member.isNewHire ? (
              <p className="mt-3 inline-flex rounded-full border border-[#FF2D8E]/55 px-4 py-1.5 text-[13px] font-semibold text-[#FFB8DC]">
                New to the Hello Gorgeous team
              </p>
            ) : null}

            <div className="mt-5 flex max-w-xl flex-col gap-4">
              {member.bioParagraphs.map((para, i) => (
                <p
                  key={para.slice(0, 40)}
                  className={
                    i === 0
                      ? "text-lg leading-relaxed text-white/85"
                      : "text-[17px] leading-relaxed text-white/70"
                  }
                >
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {member.specialties.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold text-white"
                >
                  {chip}
                </span>
              ))}
            </div>

            {member.quote ? (
              <blockquote className="mt-7 max-w-xl border-l-[3px] border-[#FF2D8E] pl-5 font-serif text-xl italic leading-snug text-white">
                &ldquo;{member.quote}&rdquo;
              </blockquote>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-3.5">
              <PinkBtn href={BOOKING_URL}>Book with {firstName}</PinkBtn>
              <GhostBtn href={TEXT_TEL}>Text {TEXT_DISPLAY}</GhostBtn>
            </div>

            {member.profileHref ? (
              <p className="mt-5">
                <Link
                  href={member.profileHref}
                  className="text-sm font-bold text-[#FF2D8E] hover:underline"
                >
                  {member.profileLabel ?? "Full profile →"}
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}

export function MeetTheTeamPageContent() {
  return (
    <div className="min-h-[100dvh] bg-black text-white">
      {/* Hero */}
      <Section className="relative border-b border-white/10 py-16 lg:py-24 !px-0">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_78%_25%,#2a0820_0%,#12030c_55%,#000_100%)]" />
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-[#E6007E] animate-pulse" aria-hidden />
              Licensed · NP-directed · Family-owned
            </div>
            <p className="text-sm md:text-base text-[#FFB8DC] font-semibold mb-4 max-w-2xl mx-auto leading-relaxed">
              {HG_TAGLINE}
            </p>
            <p className="text-xs md:text-sm uppercase tracking-widest text-white/70 font-medium mb-4">
              Oswego · Naperville · Aurora · Plainfield
            </p>
            <h1 className="mb-6 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
              Meet the <span className="text-[#FF2D8E]">Team</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
              The people behind Hello Gorgeous — licensed, medically guided, and genuinely here for you.
              Get to know the team caring for you at every visit.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <PinkBtn href={BOOKING_URL}>Book a visit</PinkBtn>
              <GhostBtn href={TEXT_TEL}>Text {TEXT_DISPLAY}</GhostBtn>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Jump nav */}
      <nav
        aria-label="Team sections"
        className="sticky top-0 z-20 border-b border-white/10 bg-black/82 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2 px-4 py-3">
          {JUMP_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/25 px-4 py-2 text-xs font-bold text-white/80 transition hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Team profiles — Jen Vokoun editorial style */}
      {TEAM_MEMBERS.map((member, i) => (
        <ArtistProfile key={member.id} member={member} flip={i % 2 === 1} index={i} />
      ))}

      {/* Leadership */}
      <section
        id="leadership"
        className="scroll-mt-24 border-t border-white/10 bg-[radial-gradient(85%_95%_at_50%_0%,#12030c,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <FadeUp>
            <div className="mx-auto mb-10 max-w-[720px] text-center">
              <Eyebrow>Founders &amp; Medical Leadership</Eyebrow>
              <h2 className="mt-3 font-serif text-[34px] font-bold leading-[1.05] text-white lg:text-[46px]">
                Dani <span className="text-[#FF2D8E]">&amp;</span> Ryan
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Family-owned at 74 W. Washington St. — Danielle on aesthetics, Ryan on medical
                oversight, on site every week.
              </p>
            </div>
          </FadeUp>

          <FadeUp delayMs={40}>
            <div className="relative mx-auto mb-12 aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
              <Image
                src={TEAM_FOUNDERS_GROUP_IMAGE}
                alt="Danielle Alcala-Glazier and Ryan Kent, FNP-BC — founders of Hello Gorgeous Med Spa in Oswego, IL"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          </FadeUp>

          <div className="grid gap-8 lg:grid-cols-2">
            {LEADERSHIP_TEAM.map((member, i) => (
              <FadeUp key={member.id} delayMs={i * 50}>
                <article
                  id={member.slug}
                  className="scroll-mt-28 h-full rounded-3xl border border-[#FF2D8E]/25 bg-white/[0.03] p-6 md:p-8"
                >
                  <div className="grid gap-6 sm:grid-cols-[160px_1fr] sm:items-start">
                    <div className="relative aspect-[4/5] w-full max-w-[200px] overflow-hidden rounded-2xl border border-[#FF2D8E]/35">
                      <Image
                        src={member.image.src}
                        alt={member.image.alt}
                        fill
                        className="object-cover object-top"
                        sizes="200px"
                      />
                    </div>
                    <div className="min-w-0">
                      <Eyebrow>{member.badge}</Eyebrow>
                      <h3 className="mt-2 font-serif text-2xl font-bold text-white md:text-3xl">
                        {member.fullName}
                      </h3>
                      <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.16em] text-white/60">
                        {member.title}
                      </p>
                      {member.bioParagraphs.map((para) => (
                        <p key={para.slice(0, 40)} className="mt-4 text-[15px] leading-relaxed text-white/75">
                          {para}
                        </p>
                      ))}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {member.specialties.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                      {member.quote ? (
                        <blockquote className="mt-5 border-l-[3px] border-[#FF2D8E] pl-4 font-serif text-lg italic leading-snug text-white">
                          &ldquo;{member.quote}&rdquo;
                        </blockquote>
                      ) : null}
                      {member.profileHref ? (
                        <p className="mt-5">
                          <Link
                            href={member.profileHref}
                            className="text-sm font-bold text-[#FF2D8E] hover:underline"
                          >
                            {member.profileLabel ?? "Full profile →"}
                          </Link>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>

          <FadeUp delayMs={80}>
            <p className="mt-10 text-center">
              <Link href="/about" className="text-sm font-bold text-[#FF2D8E] hover:underline">
                Read the full Dani &amp; Ryan story →
              </Link>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <Section className="border-t border-white/10 bg-black py-14 md:py-16 !px-0">
        <div
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#FF2D8E]/40 px-6 py-12 text-center md:px-10"
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
                Book a visit
              </CTA>
              <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline">
                Call {SITE.phone}
              </CTA>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
