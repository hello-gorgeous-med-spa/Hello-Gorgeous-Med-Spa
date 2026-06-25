"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

import { CTA } from "./CTA";
import { SITE } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";
import { SIGNATURE_MENU_POSTER } from "@/lib/signature-treatment-menu";
import { SPECIALS_PATH } from "@/lib/specials";
import {
  REGENERATIVE_MEDICINE_PATH,
  REGENERATIVE_NAV,
  REGENERATIVE_NAV_FLAT_LINKS,
} from "@/lib/regenerative-medicine-nav";
import { GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";
import { LADIES_CLUB_PATH } from "@/lib/ladies-club";
import { isMedicalNavActive, MEDICAL_NAV, type MedicalNavLink } from "@/lib/medical-nav";
import { isQuizNavActive, QUIZ_NAV, type QuizNavLink } from "@/lib/quiz-nav";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { isSkin101Active, SKIN_101_NAV } from "@/lib/skin-101-nav";
import {
  trifectaAccent,
  trifectaButtonGradient,
  TRIFECTA_GRADIENT_TITLE,
} from "@/lib/trifecta-tokens";
import type { CSSProperties } from "react";

/* ─────────────────────────────────────────────────────────────
   NAV STRUCTURE — clean, client-first, no emojis
───────────────────────────────────────────────────────────── */

const MICROBLADING_SERVICE_LINKS = [
  {
    label: "Brow PMU results (Oswego)",
    href: "/microblading-brow-pmu-oswego-il",
    sub: "Microblading, powder, combo & nano — before & after",
    badge: "PMU",
  },
  {
    label: "Your Brow Journey",
    href: "/education/your-brow-journey",
    sub: "Client-friendly step-by-step consult guide",
  },
  {
    label: "Brow consultation intake",
    href: "/forms/brow-intake",
    sub: "Digital PMU health history and consent",
  },
  {
    label: "Pre & post care guide",
    href: "/pre-post-care/microblading",
    sub: "Healing timeline, do's & don'ts",
  },
  {
    label: "Your Brow Journey (PDF)",
    href: "/handouts/education/your-brow-journey.pdf",
    sub: "Print or AirDrop for clients",
  },
  {
    label: "Consultation packet (PDF)",
    href: "/handouts/education/brow-consultation-packet.pdf",
    sub: "Full printable packet",
    external: true,
  },
] as const;

const NAV = {
  services: {
    label: "Services",
    href: "/services",
    sections: [
      {
        heading: "Skin & Aesthetics",
        links: [
          {
            label: "Microneedling Menu",
            href: "/services/microneedling",
            sub: "Classic · Baby Tox · Exosomes · Morpheus8",
            badge: "NEW",
          },
          {
            label: "Facials & Peels Menu",
            href: "/services/facials-and-peels",
            sub: "HydraFacial · dermaplaning · VI Peel · IPL",
            badge: "NEW",
          },
          {
            label: "Laser Hair Removal Menu",
            href: "/services/laser-hair-removal",
            sub: "Pay-per-session · memberships · spring specials",
            badge: "NEW",
          },
        ],
      },
      {
        heading: "Brow PMU & Microblading",
        links: [...MICROBLADING_SERVICE_LINKS],
      },
      {
        heading: "Injectables",
        links: [
          {
            label: "Injectables Menu",
            href: "/services/injectables",
            sub: "Botox $10 · lip filler · dermal fillers · Sculptra · all 5 neurotoxins",
            badge: "MENU",
          },
          { label: "Botox Oswego", href: "/botox-oswego", sub: "From $10/unit · NP on site · free consult" },
          { label: "Daxxify — 6-Month Neurotoxin", href: "/daxxify-oswego-il", sub: "Longest-lasting · only Fox Valley with all 5 brands", badge: "NEW" },
          { label: "Compare All 5 Neurotoxins", href: "/botox-vs-dysport-vs-jeuveau", sub: "Botox · Dysport · Jeuveau · Xeomin · Daxxify" },
          { label: "Lip Studio", href: "/lip-studio", sub: "AI preview · natural lip filler consult" },
        ],
      },
      {
        heading: "Advanced Technology",
        links: [
          { label: "Morpheus8 Burst", href: "/morpheus8-burst-oswego", sub: "Deep RF microneedling — skin tightening" },
          { label: "Quantum RF", href: "/quantum-rf-oswego", sub: "Subdermal body contouring without surgery" },
          { label: "Solaria CO₂", href: "/solaria-co2-oswego", sub: "Fractional laser resurfacing" },
          { label: "InMode Trifecta", href: "/specials", sub: "Morpheus8 + Quantum RF + Solaria CO₂ packages" },
        ],
      },
      ...REGENERATIVE_NAV.sections,
      {
        heading: "Medical & Wellness",
        links: [
          {
            label: "Medical Optimization Hub",
            href: "/medical",
            sub: "All NP-supervised programs — hormones, GLP-1, peptides, IV",
            badge: "NEW",
          },
          { label: "All Services", href: "/services", sub: "Browse the full treatment menu" },
        ],
      },
    ],
  },
  about: {
    label: "About",
    href: "/about",
    links: [
      { label: "About Hello Gorgeous", href: "/about", sub: "Our story, mission & values" },
      { label: "Meet the Team", href: "/about", sub: "Dani & Ryan — founders on site every week" },
      {
        label: "Male + Female Team Advantage",
        href: "/blog/male-female-practitioners-med-spa-advantage-oswego-il",
        sub: "Why having both providers helps every client",
      },
      { label: "Our Location", href: "/locations", sub: "74 W. Washington St, Oswego, IL" },
      { label: "Why Choose Us", href: "/why-choose-us", sub: "#1 Best Med Spa in Oswego" },
      { label: "FAQ", href: "/faq", sub: "Common questions answered" },
      { label: "Blog & Resources", href: "/blog", sub: "Tips, guides & med spa news" },
    ],
  },
  specials: {
    label: "Specials",
    href: SPECIALS_PATH,
    links: [
      {
        label: "View all specials",
        href: SPECIALS_PATH,
        sub: "Signature menu poster + every current offer",
        badge: "NEW",
      },
      {
        label: "Signature Treatment Menu",
        href: `${SPECIALS_PATH}#menu`,
        sub: "Botox $10 · Lip filler · Morpheus8 · Solaria · Trifecta",
      },
      {
        label: "Daxxify — Now Available",
        href: "/daxxify-oswego-il",
        sub: "6-month neurotoxin · only Fox Valley provider with all 5 brands",
        badge: "NEW",
      },
      {
        label: "Injection Menu",
        href: "/injection-menu",
        sub: "PT-141 · BPC-157 · NAD+ · B12 · biotin & more",
        badge: "NEW",
      },
      { label: "Spring Laser Hair Special", href: "/spring-special-laser-hair", sub: "Underarms $79 · Bikini $129 · No packages", badge: "SPRING" },
      { label: "VIP Model Program", href: "/vip-model", sub: "Up to 50% off advanced treatments — limited spots", badge: "50% OFF" },
      { label: "Memberships", href: "/monthly-memberships", sub: "Peptides, hormones, wellness & Vitamin Bar" },
      { label: "Free Vitamin Shot", href: "/free-vitamin", sub: "New clients only", badge: "FREE" },
      { label: "Alle Rewards", href: "/alle-botox-rewards", sub: "Earn points on Botox & Juvederm" },
    ],
  },
  patient: {
    label: "Patient Info",
    href: "/pre-post-care",
    links: [
      { label: "Pre & Post Care", href: "/pre-post-care", sub: "Treatment care guides" },
      { label: "Microblading Pre/Post", href: "/pre-post-care/microblading", sub: "Brow PMU healing guide" },
      { label: "Brow Consultation Intake", href: "/forms/brow-intake", sub: "PMU health history & consent" },
      { label: "Client Intake Form", href: "/forms/client-intake", sub: "Complete before your visit" },
      { label: "Hello Gorgeous App", href: "/app", sub: "Add to home screen — book, Vitamin Bar & more", badge: "APP" },
      { label: "Consent & Documents", href: "/patient-documents", sub: "Forms, PDFs & consent" },
      { label: "Book Online", href: BOOKING_URL, sub: "Schedule via Fresha", external: true },
      { label: "Contact Us", href: "/contact", sub: "Hours, location & phone" },
    ],
  },
  skin101: SKIN_101_NAV,
  medical: MEDICAL_NAV,
  quiz: QUIZ_NAV,
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

const NAV_LINK_BASE =
  "flex items-center justify-center gap-1 h-8 px-2.5 xl:px-3 rounded-lg text-xs xl:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 backdrop-blur-sm hover:brightness-110";

const MEGA_MENU_TOP = "top-[7.75rem]";

function navPillStyle(accentIndex: number, active: boolean): CSSProperties {
  const accent = trifectaAccent(accentIndex);
  if (active) {
    return {
      background: trifectaButtonGradient(accent),
      border: `1px solid ${accent.border}`,
      color: "#ffffff",
    };
  }
  return {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${accent.border}`,
    color: accent.subtitle,
  };
}

/* ─────────────────────────────────────────────────────────────
   SERVICES MEGA-DROPDOWN
───────────────────────────────────────────────────────────── */

function ServicesMenu({
  isOpen,
  onClose,
  onMouseEnter,
}: {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div
      className={`fixed left-0 right-0 z-50 border-t border-white/10 shadow-2xl backdrop-blur-md ${MEGA_MENU_TOP}`}
      style={{ backgroundColor: "rgba(24, 24, 27, 0.97)" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-6xl px-6 py-8 max-h-[calc(100vh-5.5rem)] overflow-y-auto overscroll-contain">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {NAV.services.sections.map((section) => (
            <div key={section.heading}>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "#f472b6" }}>
                {section.heading}
              </p>
              <div className="space-y-0.5">
                {section.links.map((link) => (
                  <Link
                    key={`${section.heading}-${link.href}`}
                    href={link.href}
                    onClick={onClose}
                    className="group block rounded-lg px-3 py-2.5 transition hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white group-hover:text-[#f472b6]">
                        {link.label}
                      </p>
                      {"badge" in link && link.badge ? (
                        <span className="rounded-full bg-[#E6007E] px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                          {link.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-white/50">{link.sub}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-white/10 pt-5 flex items-center justify-between">
          <p className="text-xs text-white/40 max-w-md">
            {HG_TAGLINE} · Oswego, IL
          </p>
          <Link
            href={BOOKING_URL}
            onClick={onClose}
            className="rounded-xl px-5 py-2 text-xs font-bold text-white transition hover:brightness-110"
            style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}
          >
            Book a Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SIMPLE DROPDOWN (About, Specials, Patient Info)
───────────────────────────────────────────────────────────── */

type SimpleNavSection = {
  label: string;
  href: string;
  links: Array<{
    label: string;
    href: string;
    sub: string;
    badge?: string;
    external?: boolean;
  }>;
};

function SpecialsMenu({
  data,
  isOpen,
  onClose,
  onMouseEnter,
}: {
  data: SimpleNavSection;
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div
      className="absolute top-full right-0 pt-2 z-[100]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div
        className="w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md"
        style={{ backgroundColor: "rgba(24, 24, 27, 0.97)", borderColor: "rgba(255,255,255,0.12)" }}
      >
        <Link
          href={SPECIALS_PATH}
          onClick={onClose}
          className="block border-b p-3 transition hover:bg-white/5"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(236, 72, 153, 0.08)" }}
        >
          <div className="overflow-hidden rounded-lg border" style={{ borderColor: "rgba(236, 72, 153, 0.35)" }}>
            <Image
              src={SIGNATURE_MENU_POSTER.src}
              alt=""
              width={280}
              height={360}
              className="h-auto w-full"
              sizes="280px"
            />
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider" style={{ color: "#f472b6" }}>
            Signature Treatment Menu
          </p>
          <p className="text-[11px] font-medium text-white/55">
            Tap to view full poster &amp; pricing
          </p>
        </Link>
        <div className="max-h-[min(70vh,28rem)] overflow-y-auto overscroll-contain p-1.5">
          {data.links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group block rounded-lg px-4 py-3 transition hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white group-hover:text-[#f472b6]">
                    {link.label}
                  </span>
                  {link.badge && (
                    <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-white/50">{link.sub}</p>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="group block rounded-lg px-4 py-3 transition hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white group-hover:text-[#f472b6]">
                    {link.label}
                  </span>
                  {link.badge && (
                    <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-white/50">{link.sub}</p>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function QuizMenu({
  isOpen,
  onClose,
  onMouseEnter,
}: {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
}) {
  if (!isOpen) return null;

  const renderLink = (link: QuizNavLink) => {
    const className = cx(
      "group block rounded-lg px-4 py-2.5 transition hover:bg-white/5",
      link.overview && "py-3",
    );
    const inner = (
      <>
        <div className="flex items-center gap-2">
          <span
            className={cx(
              "text-sm text-white group-hover:text-[#f472b6]",
              link.overview ? "font-bold uppercase tracking-wider text-xs" : "font-semibold",
            )}
          >
            {link.label}
          </span>
          {link.badge ? (
            <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
              {link.badge}
            </span>
          ) : null}
        </div>
        {link.sub ? (
          <p
            className={cx(
              "mt-0.5 text-xs leading-snug text-white/45",
              link.overview && "mt-1 normal-case font-normal text-white/50",
            )}
          >
            {link.sub}
          </p>
        ) : null}
      </>
    );

    return (
      <Link key={link.href + link.label} href={link.href} onClick={onClose} className={className}>
        {inner}
      </Link>
    );
  };

  return (
    <div className="absolute top-full left-0 z-[100] pt-2" onMouseEnter={onMouseEnter} onMouseLeave={onClose}>
      <div
        className="min-w-[min(280px,calc(100vw-2rem))] max-w-[320px] overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md"
        style={{ backgroundColor: "rgba(24, 24, 27, 0.97)", borderColor: "rgba(255,255,255,0.12)" }}
      >
        <div className="max-h-[min(75vh,32rem)] overflow-y-auto overscroll-contain p-1.5">
          {QUIZ_NAV.links.map((link) => (
            <React.Fragment key={link.href + link.label}>
              {link.dividerBefore ? <div className="mx-3 my-1 border-t border-white/10" aria-hidden /> : null}
              {renderLink(link)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function MedicalMenu({
  isOpen,
  onClose,
  onMouseEnter,
}: {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
}) {
  if (!isOpen) return null;

  const renderLink = (link: MedicalNavLink) => {
    const className = cx(
      "group block rounded-lg px-4 py-2.5 transition hover:bg-white/5",
      link.overview && "py-3",
    );
    const inner = (
      <>
        <div className="flex items-center gap-2">
          <span
            className={cx(
              "text-sm text-white group-hover:text-[#f472b6]",
              link.overview ? "font-bold uppercase tracking-wider text-xs" : "font-semibold",
            )}
          >
            {link.label}
          </span>
          {link.badge ? (
            <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
              {link.badge}
            </span>
          ) : null}
        </div>
        {link.sub && !link.overview ? (
          <p className="mt-0.5 text-xs text-white/45 leading-snug">{link.sub}</p>
        ) : link.sub && link.overview ? (
          <p className="mt-1 text-xs text-white/50 leading-snug normal-case font-normal">{link.sub}</p>
        ) : null}
      </>
    );

    if (link.external) {
      return (
        <a
          key={link.href + link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={className}
        >
          {inner}
        </a>
      );
    }

    return (
      <Link key={link.href + link.label} href={link.href} onClick={onClose} className={className}>
        {inner}
      </Link>
    );
  };

  return (
    <div className="absolute top-full left-0 z-[100] pt-2" onMouseEnter={onMouseEnter} onMouseLeave={onClose}>
      <div
        className="min-w-[min(280px,calc(100vw-2rem))] max-w-[320px] overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md"
        style={{ backgroundColor: "rgba(24, 24, 27, 0.97)", borderColor: "rgba(255,255,255,0.12)" }}
      >
        <div className="max-h-[min(75vh,32rem)] overflow-y-auto overscroll-contain p-1.5">
          {MEDICAL_NAV.links.map((link) => (
            <React.Fragment key={link.href + link.label}>
              {link.dividerBefore ? <div className="mx-3 my-1 border-t border-white/10" aria-hidden /> : null}
              {renderLink(link)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function SimpleMenu({
  data,
  isOpen,
  onClose,
  onMouseEnter,
  align = "left",
}: {
  data: SimpleNavSection;
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  align?: "left" | "right";
}) {
  if (!isOpen) return null;
  return (
    <div
      className={cx("absolute top-full pt-2 z-[100]", align === "right" ? "right-0" : "left-0")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div
        className="min-w-[min(300px,calc(100vw-2rem))] max-w-[360px] overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md"
        style={{ backgroundColor: "rgba(24, 24, 27, 0.97)", borderColor: "rgba(255,255,255,0.12)" }}
      >
        <div className="max-h-[min(70vh,28rem)] overflow-y-auto overscroll-contain p-1.5">
          {data.links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group block rounded-lg px-4 py-3 transition hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white group-hover:text-[#f472b6]">
                    {link.label}
                  </span>
                  {link.badge && (
                    <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-white/50 leading-snug">{link.sub}</p>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="group block rounded-lg px-4 py-3 transition hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white group-hover:text-[#f472b6]">
                    {link.label}
                  </span>
                  {link.badge && (
                    <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-white/50 leading-snug">{link.sub}</p>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────────────── */

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const openDropdown = (key: string) => {
    if (timeout.current) clearTimeout(timeout.current);
    setActiveDropdown(key);
  };

  const closeDropdown = () => {
    timeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  const isSpecialsActive =
    pathname === SPECIALS_PATH ||
    pathname === "/signature-treatment-menu" ||
    NAV.specials.links.some(
      (link) =>
        !link.external &&
        link.href !== `${SPECIALS_PATH}#menu` &&
        (pathname === link.href || pathname?.startsWith(link.href + "/"))
    );

  const isGentlemensClubActive =
    pathname === GENTLEMENS_CLUB_PATH || (pathname?.startsWith(`${GENTLEMENS_CLUB_PATH}/`) ?? false);
  const isLadiesClubActive =
    pathname === LADIES_CLUB_PATH || (pathname?.startsWith(`${LADIES_CLUB_PATH}/`) ?? false);
  const isFinancingActive = pathname === "/financing" || pathname?.startsWith("/financing/");

  const isServicesNavActive =
    isActive("/services") ||
    pathname === REGENERATIVE_MEDICINE_PATH ||
    REGENERATIVE_NAV_FLAT_LINKS.some(
      (link) =>
        pathname === link.href.split("#")[0] ||
        pathname?.startsWith(link.href.split("#")[0] + "/")
    ) ||
    NAV.services.sections.some((section) =>
      section.links.some(
        (link) =>
          pathname === link.href.split("#")[0] ||
          pathname?.startsWith(link.href.split("#")[0] + "/")
      )
    );

  const isMedicalNavActiveState = isMedicalNavActive(pathname ?? null);
  const isQuizNavActiveState = isQuizNavActive(pathname ?? null);

  const isSkin101NavActive = isSkin101Active(pathname ?? null);

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-white/10 bg-black">
      {/* Top bar */}
      <div className="relative border-b border-white/10 bg-black px-4 py-1.5 text-center">
        <p className="text-xs tracking-wide text-white/70">
          <span
            className="bg-clip-text font-semibold text-transparent"
            style={{ backgroundImage: TRIFECTA_GRADIENT_TITLE }}
          >
            #1 Best Med Spa in Oswego
          </span>
          <span className="mx-2 text-white/30">·</span>
          <span className="text-white/90">{HG_TAGLINE}</span>
          <span className="mx-2 hidden text-white/30 sm:inline">·</span>
          <a href={`tel:${SITE.phone}`} className="text-white transition-colors hover:text-[#f472b6]">
            (630) 636-6193
          </a>
        </p>
      </div>

      {/* Brand row: logo + book */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 flex-shrink-0 items-center gap-2.5">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white shadow-lg"
            style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}
          >
            HG
          </span>
          <div className="hidden sm:block">
            <span
              className="block bg-clip-text text-sm font-bold leading-tight text-transparent"
              style={{ backgroundImage: TRIFECTA_GRADIENT_TITLE }}
            >
              {SITE.name}
            </span>
            <span className="block max-w-[11rem] text-[10px] font-semibold uppercase leading-tight tracking-wide text-white/45">
              Medical Aesthetics
            </span>
          </div>
        </Link>

        <div className="flex flex-shrink-0 items-center gap-2">
          <CTA href={BOOKING_URL} variant="gradient" className="hidden px-5 py-2 text-sm lg:flex">
            Book Now
          </CTA>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-[#f472b6] transition-all hover:bg-white/5 lg:hidden"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop nav row — centered, Trifecta accent pills */}
      <div className="hidden overflow-visible border-t border-white/5 bg-zinc-950/90 backdrop-blur-md lg:block">
        <nav className="mx-auto flex max-w-7xl flex-nowrap items-center justify-center gap-1 overflow-visible px-3 py-2">
            {/* Services */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("services")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href="/services"
                className={NAV_LINK_BASE}
                style={navPillStyle(0, isServicesNavActive)}
              >
                Services
                <svg className={cx("h-3 w-3 transition-transform", activeDropdown === "services" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <ServicesMenu
                isOpen={activeDropdown === "services"}
                onClose={() => setActiveDropdown(null)}
                onMouseEnter={() => openDropdown("services")}
              />
            </div>

            {/* Medical */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("medical")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href={NAV.medical.href}
                className={NAV_LINK_BASE}
                style={navPillStyle(1, isMedicalNavActiveState)}
              >
                Medical
                <svg className={cx("h-3 w-3 transition-transform", activeDropdown === "medical" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <MedicalMenu
                isOpen={activeDropdown === "medical"}
                onClose={() => setActiveDropdown(null)}
                onMouseEnter={() => openDropdown("medical")}
              />
            </div>

            {/* Quiz */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("quiz")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href={NAV.quiz.href}
                className={NAV_LINK_BASE}
                style={navPillStyle(2, isQuizNavActiveState)}
              >
                Quiz
                <svg className={cx("h-3 w-3 transition-transform", activeDropdown === "quiz" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <QuizMenu
                isOpen={activeDropdown === "quiz"}
                onClose={() => setActiveDropdown(null)}
                onMouseEnter={() => openDropdown("quiz")}
              />
            </div>

            {/* Specials */}
            <div
              className={cx("relative flex items-center", activeDropdown === "specials" && "z-[110]")}
              onMouseEnter={() => openDropdown("specials")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href={SPECIALS_PATH}
                className={NAV_LINK_BASE}
                style={navPillStyle(0, isSpecialsActive)}
                onFocus={() => openDropdown("specials")}
              >
                Specials
                <svg className={cx("h-3 w-3 transition-transform", activeDropdown === "specials" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SpecialsMenu
                data={NAV.specials}
                isOpen={activeDropdown === "specials"}
                onClose={closeDropdown}
                onMouseEnter={() => openDropdown("specials")}
              />
            </div>

            {/* Memberships */}
            <Link
              href="/monthly-memberships"
              className={NAV_LINK_BASE}
              style={navPillStyle(2, pathname === "/memberships" || pathname === "/monthly-memberships")}
            >
              Memberships ⭐
            </Link>

            {/* Gentlemen's Club */}
            <Link
              href={GENTLEMENS_CLUB_PATH}
              className={NAV_LINK_BASE}
              style={navPillStyle(1, isGentlemensClubActive)}
            >
              Gentlemen&apos;s Club 👑
            </Link>

            {/* Ladies' Club */}
            <Link
              href={LADIES_CLUB_PATH}
              className={NAV_LINK_BASE}
              style={navPillStyle(0, isLadiesClubActive)}
            >
              Ladies&apos; Club 👑
            </Link>

            {/* 0% Financing */}
            <Link
              href="/financing"
              className={NAV_LINK_BASE}
              style={navPillStyle(1, isFinancingActive)}
            >
              0% Financing
            </Link>

            {/* Before & After */}
            <Link
              href="/gallery"
              className={NAV_LINK_BASE}
              style={navPillStyle(2, pathname === "/gallery")}
            >
              Before &amp; After
            </Link>

            {/* Skin 101 */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("skin101")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href={NAV.skin101.href}
                className={NAV_LINK_BASE}
                style={navPillStyle(0, isSkin101NavActive)}
              >
                Skin 101
                <svg className={cx("h-3 w-3 transition-transform", activeDropdown === "skin101" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleMenu
                data={NAV.skin101}
                isOpen={activeDropdown === "skin101"}
                onClose={() => setActiveDropdown(null)}
                onMouseEnter={() => openDropdown("skin101")}
              />
            </div>

            {/* About */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("about")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href="/about"
                className={NAV_LINK_BASE}
                style={navPillStyle(0, isActive("/about"))}
              >
                About
                <svg className={cx("h-3 w-3 transition-transform", activeDropdown === "about" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleMenu
                data={NAV.about}
                isOpen={activeDropdown === "about"}
                onClose={() => setActiveDropdown(null)}
                onMouseEnter={() => openDropdown("about")}
              />
            </div>

            {/* Patient Info */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("patient")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href="/pre-post-care"
                className={NAV_LINK_BASE}
                style={navPillStyle(1, isActive("/pre-post-care") || isActive("/forms") || isActive("/patient-documents"))}
              >
                Patient Info
                <svg className={cx("h-3 w-3 transition-transform", activeDropdown === "patient" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleMenu
                data={NAV.patient}
                isOpen={activeDropdown === "patient"}
                onClose={() => setActiveDropdown(null)}
                onMouseEnter={() => openDropdown("patient")}
              />
            </div>

        </nav>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black lg:hidden">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-black px-4 py-4">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}
              >
                HG
              </span>
              <span className="font-bold text-white">{SITE.name}</span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-white/60 hover:bg-white/5"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-1 px-4 py-6 pb-[max(7rem,env(safe-area-inset-bottom))]">

            {/* Quick actions */}
            <Link
              href={BOOKING_URL}
              onClick={() => setMobileOpen(false)}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white"
              style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}
            >
              Book an Appointment
            </Link>

            {/* Before & After */}
            <Link
              href="/gallery"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-white backdrop-blur-sm"
              style={{ background: "rgba(24,24,27,0.8)", border: "1px solid rgba(59, 130, 246, 0.35)" }}
            >
              Before &amp; After Gallery
              <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white" style={{ background: "#3b82f6" }}>NEW</span>
            </Link>

            <div className="pb-1 pt-2">
              <p className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Navigation</p>
            </div>

            {/* Services accordion */}
            {[
              { key: "services", label: "Services", links: NAV.services.sections.flatMap((s) => s.links) },
              { key: "medical", label: "Medical", links: NAV.medical.links, highlight: true },
              { key: "quiz", label: "Quiz", links: NAV.quiz.links, highlight: true },
              { key: "specials", label: "Specials", links: NAV.specials.links, highlight: true },
              { key: "skin101", label: "Skin 101", links: NAV.skin101.links, highlight: true },
              { key: "about", label: "About", links: NAV.about.links },
              { key: "patient", label: "Patient Info", links: NAV.patient.links },
            ].map(({ key, label, links, highlight }) => (
              <div key={key} className="border-b border-white/10 pb-1">
                <button
                  type="button"
                  onClick={() => setMobileSection(mobileSection === key ? null : key)}
                  className="flex w-full items-center gap-2 px-4 py-3.5 text-sm font-semibold text-white"
                  style={highlight ? { color: trifectaAccent(0).subtitle } : undefined}
                >
                  <span className="flex-1 text-left">{label}</span>
                  {highlight ? (
                    <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase text-white" style={{ background: trifectaAccent(0).badgeBg }}>
                      NEW
                    </span>
                  ) : null}
                  <svg
                    className={cx("h-4 w-4 flex-shrink-0 text-white/40 transition-transform", mobileSection === key && "rotate-180")}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileSection === key && (
                  <div className="max-h-[min(50vh,20rem)] space-y-0.5 overflow-y-auto overscroll-contain pb-2">
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        target={"external" in link && link.external ? "_blank" : undefined}
                        rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                        className="block rounded-lg px-6 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-[#f472b6]"
                      >
                        {link.label}
                        {"sub" in link && <span className="mt-0.5 block text-xs text-white/40">{link.sub}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Standalone links */}
            {[
              { label: "Memberships ⭐", href: "/monthly-memberships", highlight: true },
              { label: "Gentlemen's Club 👑", href: GENTLEMENS_CLUB_PATH, highlight: true },
              { label: "Ladies' Club 👑", href: LADIES_CLUB_PATH, highlight: true },
              { label: "0% Financing", href: "/financing", highlight: true },
              { label: "Skin 101", href: "/skin-101", highlight: true },
              { label: "FAQ", href: "/faq" },
              { label: "Blog & Resources", href: "/blog" },
              { label: "Contact Us", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cx(
                  "flex items-center justify-between rounded-xl border-b border-white/10 px-4 py-3.5 text-sm font-semibold transition-colors",
                  "highlight" in link && link.highlight
                    ? "text-white backdrop-blur-sm"
                    : "text-white/80 hover:bg-white/5 hover:text-[#f472b6]"
                )}
                style={
                  link.href === LADIES_CLUB_PATH
                    ? { background: "rgba(24,24,27,0.8)", border: "1px solid rgba(236, 72, 153, 0.45)" }
                    : "highlight" in link && link.highlight
                      ? { background: "rgba(24,24,27,0.8)", border: "1px solid rgba(59, 130, 246, 0.35)" }
                      : undefined
                }
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4">
              <a
                href={`tel:${SITE.phone}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white backdrop-blur-sm"
                style={{ border: "1px solid rgba(236, 72, 153, 0.35)", background: "rgba(255,255,255,0.04)" }}
              >
                Call (630) 636-6193
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
