"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

import { CTA } from "./CTA";
import { SITE } from "@/lib/seo";
import { SIGNATURE_MENU_POSTER } from "@/lib/signature-treatment-menu";
import { SPECIALS_PATH } from "@/lib/specials";
import {
  REGENERATIVE_MEDICINE_PATH,
  REGENERATIVE_NAV,
  REGENERATIVE_NAV_FLAT_LINKS,
} from "@/lib/regenerative-medicine-nav";
import { GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";
import { LADIES_CLUB_PATH } from "@/lib/ladies-club";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { FLOWWAVE_PATH } from "@/lib/flowwave-marketing";
import { BROW_MICROBLADING_NAV, isBrowMicrobladingNavActive } from "@/lib/brow-journey-marketing";
import { MORPHEUS8_PATH, isMorpheus8NavActive } from "@/lib/morpheus8-marketing";
import { SOLARIA_CO2_PATH, isSolariaNavActive } from "@/lib/solaria-marketing";
import { INJECTABLES_NAV, INJECTABLES_PATH, isInjectablesNavActive } from "@/lib/injectables-marketing";
import {
  ABOUT_NAV_EXTRA_LINKS,
  isAboutNavActive,
  SERVICES_EXPLORE_LINKS,
  SERVICES_RX_BRIDGE_LINKS,
  SPECIALS_NAV_EXTRA_LINKS,
} from "@/lib/site-primary-nav";
import { isMedicalNavActive } from "@/lib/medical-nav";
import { labsNavSection } from "@/lib/labs-nav";
import { medicalMegaMenuMobileGroups, SHOP_RX_NAV } from "@/lib/medical-mega-menu";
import { FlowWaveNavLogo } from "@/components/flowwave/FlowWaveLogo";
import { RegenNavLogo } from "@/components/regen/RegenLogo";
import { QUIZ_NAV } from "@/lib/quiz-nav";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { SKIN_101_NAV } from "@/lib/skin-101-nav";
import {
  trifectaAccent,
  trifectaButtonGradient,
  TRIFECTA_GRADIENT_TITLE,
} from "@/lib/trifecta-tokens";
import type { CSSProperties } from "react";

/* ─────────────────────────────────────────────────────────────
   NAV STRUCTURE — clean, client-first, no emojis
───────────────────────────────────────────────────────────── */

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
        heading: "Advanced Technology",
        links: [
          {
            label: "FlowWave Shockwave",
            href: FLOWWAVE_PATH,
            sub: "Deep-tissue pain & recovery — intro $49",
            badge: "NEW",
          },
          { label: "Quantum RF", href: "/quantum-rf-oswego", sub: "Subdermal body contouring without surgery" },
          { label: "InMode Trifecta", href: "/specials", sub: "Morpheus8 + Quantum RF + Solaria CO₂ packages" },
        ],
      },
      ...REGENERATIVE_NAV.sections,
      {
        heading: "Explore",
        links: [...SERVICES_EXPLORE_LINKS],
      },
      {
        heading: "Hello Gorgeous RX",
        links: [...SERVICES_RX_BRIDGE_LINKS],
      },
      {
        heading: "Browse",
        links: [{ label: "All Services", href: "/services", sub: "Full in-office treatment menu" }],
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
      ...ABOUT_NAV_EXTRA_LINKS,
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
      ...SPECIALS_NAV_EXTRA_LINKS,
    ],
  },
  skin101: SKIN_101_NAV,
  quiz: QUIZ_NAV,
  labs: labsNavSection(),
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
            href={PRIMARY_BOOKING_CTA.href}
            onClick={onClose}
            className="rounded-xl px-5 py-2 text-xs font-bold text-white transition hover:brightness-110"
            style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}
          >
            {PRIMARY_BOOKING_CTA.label}
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
    pathname === "/monthly-memberships" ||
    pathname === "/memberships" ||
    pathname === "/financing" ||
    pathname === GENTLEMENS_CLUB_PATH ||
    pathname === LADIES_CLUB_PATH ||
    (pathname?.startsWith(`${GENTLEMENS_CLUB_PATH}/`) ?? false) ||
    (pathname?.startsWith(`${LADIES_CLUB_PATH}/`) ?? false) ||
    NAV.specials.links.some(
      (link) =>
        !link.external &&
        link.href !== `${SPECIALS_PATH}#menu` &&
        (pathname === link.href || pathname?.startsWith(link.href + "/"))
    );

  const isFlowWaveNavActive =
    pathname === FLOWWAVE_PATH || (pathname?.startsWith(`${FLOWWAVE_PATH}/`) ?? false);

  const isMicrobladingNavActive = isBrowMicrobladingNavActive(pathname ?? null);
  const isMorpheus8NavActiveState = isMorpheus8NavActive(pathname ?? null);
  const isSolariaNavActiveState = isSolariaNavActive(pathname ?? null);
  const isInjectablesNavActiveState = isInjectablesNavActive(pathname ?? null);

  const isServicesNavActive =
    !isFlowWaveNavActive &&
    !isMicrobladingNavActive &&
    !isMorpheus8NavActiveState &&
    !isSolariaNavActiveState &&
    !isInjectablesNavActiveState &&
    (isActive("/services") ||
    pathname === "/gallery" ||
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
    ));

  const isMedicalNavActiveState = isMedicalNavActive(pathname ?? null);
  const isAboutNavActiveState = isAboutNavActive(pathname ?? null);
  const isBookNavActive = pathname === PRIMARY_BOOKING_CTA.href;

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
          <CTA href={PRIMARY_BOOKING_CTA.href} variant="gradient" className="hidden px-5 py-2 text-sm lg:flex">
            {PRIMARY_BOOKING_CTA.shortLabel}
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

            {/* FlowWave — focused shockwave therapy launch */}
            <div
              className="relative flex items-center"
              onMouseEnter={closeDropdown}
            >
              <Link
                href={FLOWWAVE_PATH}
                className={cx(NAV_LINK_BASE, "h-9 gap-1.5")}
                style={navPillStyle(0, isFlowWaveNavActive)}
                aria-label="FlowWave shockwave therapy"
              >
                <FlowWaveNavLogo />
                <span className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  New
                </span>
              </Link>
            </div>

            {/* Microblading — Your Brow Journey landing */}
            <div className="relative flex items-center" onMouseEnter={closeDropdown}>
              <Link
                href={BROW_MICROBLADING_NAV.href}
                className={NAV_LINK_BASE}
                style={navPillStyle(0, isMicrobladingNavActive)}
                aria-label="Microblading and brow PMU — Your Brow Journey"
              >
                Microblading
              </Link>
            </div>

            {/* Morpheus8 — InMode Trifecta flagship */}
            <div className="relative flex items-center" onMouseEnter={closeDropdown}>
              <Link href={MORPHEUS8_PATH} className={NAV_LINK_BASE} style={navPillStyle(0, isMorpheus8NavActiveState)} aria-label="Morpheus8 Burst RF microneedling">
                Morpheus8
              </Link>
            </div>

            {/* Solaria CO₂ — fractional laser flagship */}
            <div className="relative flex items-center" onMouseEnter={closeDropdown}>
              <Link href={SOLARIA_CO2_PATH} className={NAV_LINK_BASE} style={navPillStyle(0, isSolariaNavActiveState)} aria-label="Solaria CO2 laser resurfacing">
                Solaria CO₂
              </Link>
            </div>

            {/* Botox & Fillers — injectables flagship */}
            <div className="relative flex items-center" onMouseEnter={closeDropdown}>
              <Link
                href={INJECTABLES_PATH}
                className={NAV_LINK_BASE}
                style={navPillStyle(0, isInjectablesNavActiveState)}
                aria-label="Botox and dermal fillers — injectables menu"
              >
                {INJECTABLES_NAV.label}
              </Link>
            </div>

            {/* REGEN STORE — direct link to the RE GEN site (no hover mega menu) */}
            <div
              className="relative flex items-center"
              onMouseEnter={closeDropdown}
            >
              <Link
                href={SHOP_RX_NAV.href}
                className={cx(NAV_LINK_BASE, "h-9 shrink-0 gap-1.5")}
                style={navPillStyle(1, isMedicalNavActiveState)}
                aria-label="RE GEN — prescription care by Hello Gorgeous Med Spa"
              >
                <RegenNavLogo />
                <span className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  New
                </span>
              </Link>
            </div>

            {/* Supplements — Fullscript dispensary */}
            <div
              className="relative flex items-center"
              onMouseEnter={closeDropdown}
            >
              <Link
                href="/shop"
                className={NAV_LINK_BASE}
                style={navPillStyle(0, pathname === "/shop")}
              >
                Supplements
              </Link>
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

            {/* About — team, patient resources, Skin 101 & quizzes */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("about")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href="/about"
                className={NAV_LINK_BASE}
                style={navPillStyle(0, isAboutNavActiveState)}
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

            {/* Book — single primary conversion path */}
            <Link
              href={PRIMARY_BOOKING_CTA.href}
              className={NAV_LINK_BASE}
              style={{
                ...navPillStyle(0, isBookNavActive),
                ...(isBookNavActive
                  ? {}
                  : {
                      background: trifectaButtonGradient(trifectaAccent(0)),
                      border: `1px solid ${trifectaAccent(0).border}`,
                      color: "#ffffff",
                    }),
              }}
            >
              {PRIMARY_BOOKING_CTA.shortLabel}
            </Link>

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
              href={PRIMARY_BOOKING_CTA.href}
              onClick={() => setMobileOpen(false)}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white"
              style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}
            >
              {PRIMARY_BOOKING_CTA.label}
            </Link>

            <Link
              href={FLOWWAVE_PATH}
              onClick={() => setMobileOpen(false)}
              className="mb-4 flex w-full items-center justify-between gap-2 rounded-xl border border-[#E6007E]/40 bg-gradient-to-r from-[#2d1020] to-black px-4 py-3.5 text-sm font-bold text-white"
            >
              <span className="flex items-center gap-2">
                <FlowWaveNavLogo />
                <span className="text-xs font-bold uppercase tracking-wide text-[#FFB8DC]">
                  Shockwave
                </span>
              </span>
              <span className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                New
              </span>
            </Link>

            <Link
              href={BROW_MICROBLADING_NAV.href}
              onClick={() => setMobileOpen(false)}
              className="mb-4 flex w-full items-center justify-between gap-2 rounded-xl border border-[#E6007E]/40 bg-gradient-to-r from-[#2d1020] to-black px-4 py-3.5 text-sm font-bold text-white"
            >
              <span className="flex flex-col items-start gap-0.5">
                <span>Microblading</span>
                <span className="text-xs font-semibold text-[#FFB8DC]">Your Brow Journey</span>
              </span>
            </Link>

            <Link
              href={MORPHEUS8_PATH}
              onClick={() => setMobileOpen(false)}
              className="mb-3 flex w-full items-center justify-between gap-2 rounded-xl border border-[#E6007E]/40 bg-gradient-to-r from-[#2d1020] to-black px-4 py-3.5 text-sm font-bold text-white"
            >
              <span className="flex flex-col items-start gap-0.5">
                <span>Morpheus8 Burst</span>
                <span className="text-xs font-semibold text-[#FFB8DC]">RF microneedling · from $850</span>
              </span>
            </Link>

            <Link
              href={SOLARIA_CO2_PATH}
              onClick={() => setMobileOpen(false)}
              className="mb-3 flex w-full items-center justify-between gap-2 rounded-xl border border-[#E6007E]/40 bg-gradient-to-r from-[#2d1020] to-black px-4 py-3.5 text-sm font-bold text-white"
            >
              <span className="flex flex-col items-start gap-0.5">
                <span>Solaria CO₂</span>
                <span className="text-xs font-semibold text-[#FFB8DC]">Laser resurfacing · $899 launch</span>
              </span>
            </Link>

            <Link
              href={INJECTABLES_PATH}
              onClick={() => setMobileOpen(false)}
              className="mb-4 flex w-full items-center justify-between gap-2 rounded-xl border border-[#E6007E]/40 bg-gradient-to-r from-[#2d1020] to-black px-4 py-3.5 text-sm font-bold text-white"
            >
              <span className="flex flex-col items-start gap-0.5">
                <span>{INJECTABLES_NAV.label}</span>
                <span className="text-xs font-semibold text-[#FFB8DC]">Botox $10/unit · lip filler $450</span>
              </span>
            </Link>

            {/* Services accordion */}
            {[
              { key: "services", label: "Services", links: NAV.services.sections.flatMap((s) => s.links) },
              {
                key: "medical",
                label: SHOP_RX_NAV.label,
                groups: medicalMegaMenuMobileGroups(),
                highlight: true,
              },
              { key: "supplements", label: "Supplements", links: [{ label: "Fullscript Dispensary", href: "/shop", sub: "Professional-grade supplements shipped to your door" }] },
              { key: "specials", label: "Specials", links: NAV.specials.links, highlight: true },
              { key: "about", label: "About", links: NAV.about.links },
            ].map(({ key, label, links, groups, highlight }) => (
              <div key={key} className="border-b border-white/10 pb-1">
                {key === "medical" ? (
                  <Link
                    href={SHOP_RX_NAV.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-3.5 text-sm font-semibold"
                    style={{ color: trifectaAccent(0).subtitle }}
                    aria-label="REGEN Store — prescription care by Hello Gorgeous Med Spa"
                  >
                    <span className="flex shrink-0 items-center gap-2">
                      <RegenNavLogo />
                    </span>
                    <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase text-white" style={{ background: trifectaAccent(0).badgeBg }}>
                      NEW
                    </span>
                  </Link>
                ) : (
                <>
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
                  <div className="max-h-[min(55vh,24rem)] overflow-y-auto overscroll-contain pb-2">
                    {groups
                      ? groups.map((group) => (
                          <div key={group.heading} className="px-2 pt-2">
                            <p className="px-4 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFB8DC]/80">
                              {group.heading}
                            </p>
                            <div className="space-y-0.5">
                              {group.links.map((link) => (
                                <Link
                                  key={link.href + link.label}
                                  href={link.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="block rounded-lg px-6 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-[#f472b6]"
                                >
                                  {link.label}
                                  {link.sub ? (
                                    <span className="mt-0.5 block text-xs text-white/40">{link.sub}</span>
                                  ) : null}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))
                      : links?.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            target={"external" in link && link.external ? "_blank" : undefined}
                            rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                            className="block rounded-lg px-6 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-[#f472b6]"
                          >
                            {link.label}
                            {"sub" in link && link.sub ? (
                              <span className="mt-0.5 block text-xs text-white/40">{link.sub}</span>
                            ) : null}
                          </Link>
                        ))}
                  </div>
                )}
                </>
                )}
              </div>
            ))}

            <div className="pb-1 pt-4">
              <p className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Quick links</p>
            </div>
            {[
              { label: "Before & After Gallery", href: "/gallery" },
              { label: "FAQ", href: "/faq" },
              { label: "Blog", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center rounded-xl border-b border-white/10 px-4 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-[#f472b6]"
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
