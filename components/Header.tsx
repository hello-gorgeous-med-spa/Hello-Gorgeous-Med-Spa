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
import {
  isPeptideTherapyNavActive,
  PEPTIDE_THERAPY_NAV,
  PEPTIDE_THERAPY_NAV_FLAT_LINKS,
  PEPTIDE_THERAPY_PATH,
} from "@/lib/peptide-therapy-nav";
import { NAD_PLUS_INJECTIONS_PATH } from "@/lib/nad-plus-injections";
import { HG_TAGLINE } from "@/lib/brand-tagline";

/* ─────────────────────────────────────────────────────────────
   NAV STRUCTURE — clean, client-first, no emojis
───────────────────────────────────────────────────────────── */

const NAV = {
  services: {
    label: "Services",
    href: "/services",
    sections: [
      {
        heading: "Advanced Technology",
        links: [
          { label: "Morpheus8 Burst", href: "/morpheus8-burst-oswego", sub: "Deep RF microneedling — skin tightening" },
          { label: "Quantum RF", href: "/quantum-rf-oswego", sub: "Subdermal body contouring without surgery" },
          { label: "Solaria CO₂", href: "/solaria-co2-oswego", sub: "Fractional laser resurfacing" },
          { label: "InMode Trifecta", href: "/trifecta-vip", sub: "3 technologies combined — exclusive package" },
        ],
      },
      {
        heading: "Injectables",
        links: [
          { label: "Botox & Neurotoxins", href: "/botox-oswego", sub: "From $10/unit · Oswego" },
          { label: "Dermal Fillers", href: "/dermal-fillers-oswego", sub: "Lip, cheek & facial volume" },
          { label: "Lip Filler", href: "/lip-filler-oswego", sub: "Natural lip enhancement · Oswego" },
        ],
      },
      {
        heading: "Medical & Wellness",
        links: [
          { label: "NAD+ Injections", href: NAD_PLUS_INJECTIONS_PATH, sub: "$40 per visit · cellular energy · Oswego", badge: "NEW" },
          { label: "Medical Weight Loss", href: "/rx/metabolic", sub: "GLP-1 & supervised programs" },
          { label: "Hormone Therapy", href: "/rx/hormones", sub: "Bio-identical hormone optimization" },
          { label: "IV & Vitamin Therapy", href: "/services/iv-therapy", sub: "Hydration, energy & wellness" },
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
      { label: "Spring Laser Hair Special", href: "/spring-special-laser-hair", sub: "Underarms $79 · Bikini $129 · No packages", badge: "SPRING" },
      { label: "VIP Model Program", href: "/vip-model", sub: "Up to 50% off advanced treatments — limited spots", badge: "50% OFF" },
      { label: "Memberships", href: "/memberships", sub: "Monthly plans for ongoing care" },
      { label: "Free Vitamin Shot", href: "/free-vitamin", sub: "New clients only", badge: "FREE" },
      { label: "Financing", href: "/financing", sub: "CareCredit, Cherry & Affirm available" },
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
      { label: "Consent & Documents", href: "/patient-documents", sub: "Forms, PDFs & consent" },
      { label: "Book Online", href: BOOKING_URL, sub: "Schedule via Fresha", external: true },
      { label: "Contact Us", href: "/contact", sub: "Hours, location & phone" },
    ],
  },
  microblading: {
    label: "Microblading",
    href: "/pre-post-care/microblading",
    links: [
      { label: "Microblading hub", href: "/admin/pmu-brows", sub: "All brow tools in one place (staff)", external: false },
      { label: "Your Brow Journey", href: "/education/your-brow-journey", sub: "Client-friendly step-by-step consult guide" },
      { label: "Brow consultation intake", href: "/forms/brow-intake", sub: "Digital PMU health history and consent" },
      { label: "Pre & post care guide", href: "/pre-post-care/microblading", sub: "Healing timeline, do's & don'ts" },
      { label: "Your Brow Journey (PDF)", href: "/handouts/education/your-brow-journey.pdf", sub: "Print or AirDrop for clients" },
      { label: "Consultation packet (PDF)", href: "/handouts/education/brow-consultation-packet.pdf", sub: "Full printable packet", external: true },
    ],
  },
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

const NAV_LINK_BASE =
  "flex items-center justify-center gap-1 h-9 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap";
const NAV_LINK_ACTIVE = "text-white bg-[#FF2D8E]";
const NAV_LINK_IDLE = "text-black hover:bg-[#FF2D8E]/10 hover:text-[#FF2D8E]";

/* ─────────────────────────────────────────────────────────────
   SERVICES MEGA-DROPDOWN
───────────────────────────────────────────────────────────── */

function RegenerativeMedicineMenu({
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
      className="fixed top-16 left-0 right-0 z-50 border-t-2 border-black bg-white shadow-2xl"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {REGENERATIVE_NAV.sections.map((section) => (
            <div key={section.heading}>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                {section.heading}
              </p>
              <div className="space-y-0.5">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="group block rounded-lg px-3 py-2.5 transition hover:bg-[#FFF0F7]"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-black group-hover:text-[#E6007E]">
                        {link.label}
                      </p>
                      {link.badge ? (
                        <span className="rounded-full bg-[#E6007E] px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                          {link.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-black/50">{link.sub}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-black/10 pt-5 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={REGENERATIVE_MEDICINE_PATH}
            onClick={onClose}
            className="text-sm font-bold text-[#E6007E] hover:underline"
          >
            View regenerative medicine hub →
          </Link>
          <Link
            href={BOOKING_URL}
            onClick={onClose}
            className="rounded-full bg-[#E6007E] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#c9006e]"
          >
            Book Regenerative Consult
          </Link>
        </div>
      </div>
    </div>
  );
}

function PeptideTherapyMenu({
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
      className="fixed top-16 left-0 right-0 z-50 border-t-2 border-black bg-white shadow-2xl"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {PEPTIDE_THERAPY_NAV.sections.map((section) => (
            <div key={section.heading}>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                {section.heading}
              </p>
              <div className="space-y-0.5">
                {section.links.map((link) => (
                  <Link
                    key={`${section.heading}-${link.href}`}
                    href={link.href}
                    onClick={onClose}
                    target={"external" in link && link.external ? "_blank" : undefined}
                    rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                    className="group block rounded-lg px-3 py-2.5 transition hover:bg-[#FFF0F7]"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-black group-hover:text-[#E6007E]">
                        {link.label}
                      </p>
                      {link.badge ? (
                        <span className="rounded-full bg-[#E6007E] px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                          {link.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-black/50">{link.sub}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-black/10 pt-5 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={PEPTIDE_THERAPY_PATH}
            onClick={onClose}
            className="text-sm font-bold text-[#E6007E] hover:underline"
          >
            View all →
          </Link>
          <Link
            href={BOOKING_URL}
            onClick={onClose}
            className="rounded-full bg-[#E6007E] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#c9006e]"
          >
            Book Peptide Consult
          </Link>
        </div>
      </div>
    </div>
  );
}

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
      className="fixed top-16 left-0 right-0 z-50 border-t-2 border-black bg-white shadow-2xl"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {NAV.services.sections.map((section) => (
            <div key={section.heading}>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                {section.heading}
              </p>
              <div className="space-y-0.5">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="group block rounded-lg px-3 py-2.5 transition hover:bg-[#FFF0F7]"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-black group-hover:text-[#E6007E]">
                        {link.label}
                      </p>
                      {"badge" in link && link.badge ? (
                        <span className="rounded-full bg-[#E6007E] px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                          {link.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-black/50">{link.sub}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-black/10 pt-5 flex items-center justify-between">
          <p className="text-xs text-black/40 max-w-md">
            {HG_TAGLINE} · Oswego, IL
          </p>
          <Link
            href={BOOKING_URL}
            onClick={onClose}
            className="rounded-full bg-[#E6007E] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#c9006e]"
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
      className="absolute top-full right-0 pt-2 z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="w-[320px] overflow-hidden rounded-xl border-2 border-black bg-white shadow-2xl">
        <Link
          href={SPECIALS_PATH}
          onClick={onClose}
          className="block border-b-2 border-black bg-gradient-to-br from-[#FFF0F7] to-white p-3 transition hover:from-[#FFE0F0]"
        >
          <div className="overflow-hidden rounded-lg border-2 border-black">
            <Image
              src={SIGNATURE_MENU_POSTER.src}
              alt=""
              width={280}
              height={360}
              className="h-auto w-full"
              sizes="280px"
            />
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#E6007E]">
            Signature Treatment Menu
          </p>
          <p className="text-[11px] text-black/55 font-medium">
            Tap to view full poster &amp; pricing
          </p>
        </Link>
        <div className="p-1.5">
          {data.links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group block rounded-lg px-4 py-3 transition hover:bg-[#FFF0F7]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-black group-hover:text-[#E6007E]">
                    {link.label}
                  </span>
                  {link.badge && (
                    <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-black/50">{link.sub}</p>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="group block rounded-lg px-4 py-3 transition hover:bg-[#FFF0F7]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-black group-hover:text-[#E6007E]">
                    {link.label}
                  </span>
                  {link.badge && (
                    <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-black/50">{link.sub}</p>
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
      className={cx("absolute top-full pt-2 z-50", align === "right" ? "right-0" : "left-0")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="min-w-[260px] overflow-hidden rounded-xl border-2 border-black bg-white shadow-2xl">
        <div className="p-1.5">
          {data.links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group block rounded-lg px-4 py-3 transition hover:bg-[#FFF0F7]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-black group-hover:text-[#E6007E]">
                    {link.label}
                  </span>
                  {link.badge && (
                    <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-black/50">{link.sub}</p>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="group block rounded-lg px-4 py-3 transition hover:bg-[#FFF0F7]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-black group-hover:text-[#E6007E]">
                    {link.label}
                  </span>
                  {link.badge && (
                    <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-black/50">{link.sub}</p>
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

  const isRegenerativeActive =
    pathname === REGENERATIVE_MEDICINE_PATH ||
    pathname === NAD_PLUS_INJECTIONS_PATH ||
    pathname === "/services/regenerative" ||
    pathname === "/nad-iv-oswego" ||
    REGENERATIVE_NAV_FLAT_LINKS.some(
      (link) =>
        pathname === link.href.split("#")[0] ||
        pathname?.startsWith(link.href.split("#")[0] + "/")
    ) ||
    (pathname?.startsWith("/services/anteage") ?? false) ||
    (pathname?.startsWith("/services/pr") ?? false);

  const isPeptideTherapyActive = isPeptideTherapyNavActive(pathname);
  const isMicrobladingActive =
    pathname === "/education/your-brow-journey" ||
    pathname === "/forms/brow-intake" ||
    pathname === "/pre-post-care/microblading" ||
    pathname === "/handouts/education/your-brow-journey.pdf" ||
    pathname === "/handouts/education/brow-consultation-packet.pdf" ||
    pathname === "/admin/pmu-brows";

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      {/* Top bar */}
      <div className="bg-black py-1.5 px-4 text-center">
          <p className="text-xs text-white/70 tracking-wide">
          <span className="font-semibold text-[#FFD700]">#1 Best Med Spa in Oswego</span>
          <span className="mx-2 text-white/30">·</span>
          <span className="text-white/90">{HG_TAGLINE}</span>
          <span className="mx-2 text-white/30 hidden sm:inline">·</span>
          <a href={`tel:${SITE.phone}`} className="text-white hover:text-[#FF2D8E] transition-colors">
            (630) 636-6193
          </a>
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF2D8E] text-white text-xs font-bold shadow-md">
              HG
            </span>
            <div className="hidden sm:block">
              <span className="block text-sm font-bold text-[#FF2D8E] leading-tight">
                {SITE.name}
              </span>
              <span className="block text-[10px] font-semibold text-black/50 tracking-wide uppercase max-w-[11rem] leading-tight">
                Medical Aesthetics
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 overflow-visible">

            {/* Services */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("services")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href="/services"
                className={cx(NAV_LINK_BASE, isActive("/services") ? NAV_LINK_ACTIVE : NAV_LINK_IDLE)}
              >
                Services
                <svg className={cx("w-3 h-3 transition-transform", activeDropdown === "services" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <ServicesMenu
                isOpen={activeDropdown === "services"}
                onClose={() => setActiveDropdown(null)}
                onMouseEnter={() => openDropdown("services")}
              />
            </div>

            {/* Regenerative Medicine */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("regenerative")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href={REGENERATIVE_MEDICINE_PATH}
                className={cx(
                  NAV_LINK_BASE,
                  "border border-[#E6007E]/40",
                  isRegenerativeActive ? NAV_LINK_ACTIVE : NAV_LINK_IDLE
                )}
              >
                Regenerative
                <svg className={cx("w-3 h-3 transition-transform", activeDropdown === "regenerative" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <RegenerativeMedicineMenu
                isOpen={activeDropdown === "regenerative"}
                onClose={() => setActiveDropdown(null)}
                onMouseEnter={() => openDropdown("regenerative")}
              />
            </div>

            {/* Peptides & Wellness */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("peptides")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href={PEPTIDE_THERAPY_PATH}
                className={cx(
                  NAV_LINK_BASE,
                  "border border-[#d99021]/50",
                  isPeptideTherapyActive ? NAV_LINK_ACTIVE : NAV_LINK_IDLE
                )}
              >
                Peptides & Wellness
                <svg className={cx("w-3 h-3 transition-transform", activeDropdown === "peptides" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <PeptideTherapyMenu
                isOpen={activeDropdown === "peptides"}
                onClose={() => setActiveDropdown(null)}
                onMouseEnter={() => openDropdown("peptides")}
              />
            </div>

            {/* Specials */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("specials")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href={SPECIALS_PATH}
                className={cx(
                  NAV_LINK_BASE,
                  "border border-[#FF2D8E]",
                  isSpecialsActive ? NAV_LINK_ACTIVE : NAV_LINK_IDLE
                )}
              >
                Specials
                <svg className={cx("w-3 h-3 transition-transform", activeDropdown === "specials" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SpecialsMenu
                data={NAV.specials}
                isOpen={activeDropdown === "specials"}
                onClose={() => setActiveDropdown(null)}
                onMouseEnter={() => openDropdown("specials")}
              />
            </div>

            {/* Before & After */}
            <Link
              href="/gallery"
              className={cx(NAV_LINK_BASE, pathname === "/gallery" ? NAV_LINK_ACTIVE : NAV_LINK_IDLE)}
            >
              Before &amp; After
            </Link>

            {/* About */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("about")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href="/about"
                className={cx(NAV_LINK_BASE, isActive("/about") ? NAV_LINK_ACTIVE : NAV_LINK_IDLE)}
              >
                About
                <svg className={cx("w-3 h-3 transition-transform", activeDropdown === "about" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className={cx(NAV_LINK_BASE, isActive("/pre-post-care") || isActive("/forms") || isActive("/patient-documents") ? NAV_LINK_ACTIVE : NAV_LINK_IDLE)}
              >
                Patient Info
                <svg className={cx("w-3 h-3 transition-transform", activeDropdown === "patient" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Microblading */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => openDropdown("microblading")}
              onMouseLeave={closeDropdown}
            >
              <Link
                href={NAV.microblading.href}
                className={cx(
                  NAV_LINK_BASE,
                  "border border-[#E6007E]/35",
                  isMicrobladingActive ? NAV_LINK_ACTIVE : NAV_LINK_IDLE
                )}
              >
                Microblading
                <svg className={cx("w-3 h-3 transition-transform", activeDropdown === "microblading" && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleMenu
                data={NAV.microblading}
                isOpen={activeDropdown === "microblading"}
                onClose={() => setActiveDropdown(null)}
                onMouseEnter={() => openDropdown("microblading")}
                align="right"
              />
            </div>

            {/* FAQ */}
            <Link
              href="/faq"
              className={cx(NAV_LINK_BASE, pathname === "/faq" ? NAV_LINK_ACTIVE : NAV_LINK_IDLE)}
            >
              FAQ
            </Link>

            {/* Blog */}
            <Link
              href="/blog"
              className={cx(NAV_LINK_BASE, isActive("/blog") ? NAV_LINK_ACTIVE : NAV_LINK_IDLE)}
            >
              Blog
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <CTA href={BOOKING_URL} variant="gradient" className="hidden lg:flex px-5 py-2 text-sm">
              Book Now
            </CTA>
            {/* Mobile burger */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#FF2D8E] hover:bg-[#FF2D8E]/10 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-black px-4 py-4 flex items-center justify-between">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF2D8E] text-white text-xs font-bold">
                HG
              </span>
              <span className="font-bold text-[#FF2D8E]">{SITE.name}</span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-black/60 hover:bg-black/5"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 py-6 space-y-1">

            {/* Quick actions */}
            <Link
              href={BOOKING_URL}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#E6007E] px-4 py-3.5 text-sm font-bold text-white mb-4"
            >
              Book an Appointment
            </Link>

            {/* Before & After */}
            <Link
              href="/gallery"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-[#E6007E]/30 bg-[#FFF0F7] text-[#E6007E] font-semibold text-sm"
            >
              Before &amp; After Gallery
              <span className="rounded-full bg-[#E6007E] px-2.5 py-0.5 text-[10px] font-bold text-white">NEW</span>
            </Link>

            <div className="pt-2 pb-1">
              <p className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">Navigation</p>
            </div>

            {/* Services accordion */}
            {[
              { key: "services", label: "Services", links: NAV.services.sections.flatMap(s => s.links) },
              { key: "regenerative", label: "Regenerative Medicine", links: REGENERATIVE_NAV_FLAT_LINKS },
              { key: "peptides", label: "Peptides & Wellness", links: PEPTIDE_THERAPY_NAV_FLAT_LINKS, highlight: true },
              { key: "specials", label: "Specials", links: NAV.specials.links, highlight: true },
              { key: "about", label: "About", links: NAV.about.links },
              { key: "patient", label: "Patient Info", links: NAV.patient.links },
              { key: "microblading", label: "Microblading", links: NAV.microblading.links, highlight: true },
            ].map(({ key, label, links, highlight }) => (
              <div key={key} className="border-b border-black/10 pb-1">
                <button
                  type="button"
                  onClick={() => setMobileSection(mobileSection === key ? null : key)}
                  className={cx(
                    "w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold",
                    highlight ? "text-[#E6007E]" : "text-black"
                  )}
                >
                  {label}
                  {highlight ? (
                    <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                      NEW
                    </span>
                  ) : null}
                  <svg
                    className={cx("w-4 h-4 text-black/40 transition-transform", mobileSection === key && "rotate-180")}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileSection === key && (
                  <div className="pb-2 space-y-0.5">
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        target={"external" in link && link.external ? "_blank" : undefined}
                        rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                        className="block px-6 py-2.5 rounded-lg text-sm text-black/80 hover:bg-[#FFF0F7] hover:text-[#E6007E] transition-colors"
                      >
                        {link.label}
                        {"sub" in link && <span className="block text-xs text-black/40 mt-0.5">{link.sub}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Standalone links */}
            {[
              { label: "FAQ", href: "/faq" },
              { label: "Blog & Resources", href: "/blog" },
              { label: "Contact Us", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold text-black hover:bg-[#FFF0F7] hover:text-[#E6007E] transition-colors border-b border-black/10"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4">
              <a
                href={`tel:${SITE.phone}`}
                className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-black px-4 py-3.5 text-sm font-bold text-black"
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
