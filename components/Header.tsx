"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

import { CTA } from "./CTA";
import { SITE } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";

// Navigation structure with dropdowns
const navigation = {
  services: {
    label: "Services",
    href: "/services",
    columns: [
      {
        title: "Injectables",
        links: [
          { label: "Botox, Dysport & Jeuveau", href: "/services/botox-dysport-jeuveau", icon: "💉" },
          { label: "Dermal Fillers", href: "/services/dermal-fillers", icon: "💋" },
          { label: "Lip Filler", href: "/services/lip-filler", icon: "👄" },
          { label: "Lip Enhancement Studio", href: "/lip-studio", icon: "✨" },
          { label: "Kybella", href: "/services/kybella", icon: "✨" },
        ],
      },
      {
        title: "Skin & Face",
        links: [
          { label: "HydraFacial", href: "/services/hydra-facial", icon: "✨" },
          { label: "RF Microneedling", href: "/services/rf-microneedling", icon: "🎯" },
          { label: "IPL Photofacial", href: "/services/ipl-photofacial", icon: "💡" },
          { label: "Chemical Peels", href: "/services/chemical-peels", icon: "🧴" },
        ],
      },
      {
        title: "Body & Wellness",
        links: [
          { label: "Weight Loss (GLP-1)", href: "/services/weight-loss-therapy", icon: "⚡" },
          { label: "Hormone Therapy", href: "/services/biote-hormone-therapy", icon: "⚖️" },
          { label: "Peptide Therapy", href: "/peptides", icon: "🧬" },
          { label: "IV Therapy", href: "/services/iv-therapy", icon: "💧" },
          { label: "Laser Hair Removal", href: "/services/laser-hair-removal", icon: "✨" },
        ],
      },
      {
        title: "Regenerative",
        links: [
          { label: "PRP / PRF Treatments", href: "/services/prf-prp", icon: "🧬" },
          { label: "PRP Facial", href: "/services/prp-facial", icon: "✨" },
          { label: "EZ PRF Gel", href: "/services/ez-prf-gel", icon: "💎" },
          { label: "Vitamin Injections", href: "/services/vitamin-injections", icon: "💉" },
        ],
      },
      {
        title: "Lash Spa",
        links: [
          { label: "Lash Spa", href: "/services/lash-spa", icon: "✨" },
          { label: "Full Set", href: "/services/lash-spa#full-set", icon: "👁️" },
          { label: "Fill", href: "/services/lash-spa#fill", icon: "👁️" },
          { label: "Lash Perm and Tint", href: "/services/lash-spa#lash-perm-tint", icon: "👁️" },
          { label: "Mini Fill", href: "/services/lash-spa#mini-fill", icon: "👁️" },
        ],
      },
    ],
    featured: {
      title: "Most Popular",
      description: "Not sure where to start? Take our quick quiz to find your perfect treatment.",
      cta: { label: "Find My Treatment", href: "/quiz" },
      image: "✨",
    },
  },
  about: {
    label: "About",
    href: "/about",
    links: [
      { label: "About Hello Gorgeous", href: "/about", description: "Our story, mission & team", icon: "💗" },
      { label: "Danielle Glazier, RN, BSN", href: "/providers/danielle", description: "Lead Aesthetic Injector", icon: "👩‍⚕️" },
      { label: "Ryan Kent, FNP-BC", href: "/providers/ryan", description: "Medical Director & Wellness", icon: "🧑‍⚕️" },
      { label: "Our Location", href: "/locations", description: "Visit us in Oswego, IL", icon: "📍" },
      { label: "Clinical Standards", href: "/clinical-partners", description: "Safety & quality commitment", icon: "🏥" },
      { label: "The Care Engine™", href: "/care-engine", description: "Our personalized approach", icon: "⚙️" },
    ],
  },
  journey: {
    label: "Your Journey",
    href: "/your-journey",
    links: [
      { label: "Fix What Bothers Me", href: "/fix-what-bothers-me", description: "Share what's on your mind—we match you with options", icon: "💗" },
      { label: "Virtual Consultation", href: "/virtual-consultation", description: "Get personalized treatment recommendations", icon: "🖥️", badge: "FREE" },
      { label: "Conditions We Treat", href: "/conditions", description: "Acne, wrinkles, hyperpigmentation & more", icon: "✨" },
      { label: "Explore Care Options", href: "/explore-care", description: "Discover treatments for you", icon: "🔍" },
      { label: "Your Treatment Journey", href: "/your-journey", description: "What to expect", icon: "🗺️" },
      { label: "Understand Your Body", href: "/understand-your-body", description: "Learn about aging & skin", icon: "📚" },
      { label: "Care & Support", href: "/care-and-support", description: "Resources & aftercare", icon: "💝" },
      { label: "Telehealth", href: "/telehealth", description: "Virtual consultations", icon: "🖥️" },
      { label: "Lip Enhancement Studio", href: "/lip-studio", description: "Visualize your perfect look", icon: "✨" },
      { label: "Botox Calculator", href: "/botox-calculator", description: "Estimate units for your areas", icon: "💉" },
    ],
  },
  specials: {
    label: "Specials",
    href: "/free-vitamin",
    highlight: true,
    links: [
      { label: "FREE Vitamin Shot", href: "/free-vitamin", description: "New clients only - $0", icon: "💉", badge: "FREE" },
      { label: "Annual Membership", href: "/subscribe", description: "Save 10% on everything", icon: "🎁", badge: "SAVE" },
      { label: "Give $25, Get $25", href: "/referral", description: "Refer a friend", icon: "💝" },
      { label: "Current Promotions", href: "/book", description: "This month's deals", icon: "🔥" },
      { label: "Financing Options", href: "/financing", description: "Cherry, Affirm & CareCredit", icon: "💳" },
    ],
  },
};

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

// Dropdown component for mega menus
function ServicesDropdown({ isOpen, onClose, onMouseEnter }: { isOpen: boolean; onClose: () => void; onMouseEnter: () => void }) {
  const data = navigation.services;
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed top-16 left-0 right-0 bg-white shadow-2xl border-t border-black z-50 overflow-x-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
          {/* Service columns */}
          {data.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center gap-2 text-black hover:text-[#FF2D8E] transition-colors group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Featured section */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
            <div className="text-4xl mb-3">{data.featured.image}</div>
            <h3 className="font-bold text-black mb-2">{data.featured.title}</h3>
            <p className="text-sm text-black mb-4">{data.featured.description}</p>
            <Link
              href={data.featured.cta.href}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF2D8E] hover:text-pink-700"
            >
              {data.featured.cta.label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-black flex items-center justify-between">
          <Link
            href="/services"
            onClick={onClose}
            className="text-sm font-medium text-black hover:text-[#FF2D8E] flex items-center gap-2"
          >
            View All Services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href={BOOKING_URL}
            onClick={onClose}
            className="inline-flex items-center gap-2 px-10 py-4 bg-hg-pink hover:bg-hg-pinkDeep text-white uppercase tracking-widest text-sm font-semibold rounded-md transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

// Simple dropdown for About, Journey, Specials
function SimpleDropdown({ 
  data, 
  isOpen, 
  onClose,
  onMouseEnter: onEnter,
  align = 'left'
}: { 
  data: typeof navigation.about;
  isOpen: boolean; 
  onClose: () => void;
  onMouseEnter?: () => void;
  align?: 'left' | 'right';
}) {
  if (!isOpen) return null;
  
  return (
    <div 
      className={cx(
        "absolute top-full pt-2 z-50",
        align === 'right' ? 'right-0' : 'left-0'
      )}
      onMouseEnter={onEnter}
      onMouseLeave={onClose}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-black overflow-hidden min-w-[320px]">
        <div className="p-2">
          {data.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-white transition-colors group"
            >
              <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black group-hover:text-[#FF2D8E] transition-colors">
                    {link.label}
                  </span>
                  {'badge' in link && link.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-black mt-0.5">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-black">
      <div className="mx-auto max-w-7xl px-4 min-w-0 overflow-x-hidden">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm font-bold shadow-lg shadow-[#FF2D8E]/25">
              HG
            </span>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-[#FF2D8E]">{SITE.name}</span>
              <span className="block text-[10px] text-[#FF2D8E]/80 font-medium tracking-wider">MEDICAL AESTHETICS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/services"
                className={cx(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname?.startsWith('/services')
                    ? "text-[#FF2D8E] bg-[#FF2D8E]/10"
                    : "text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5"
                )}
              >
                Services
                <svg className={cx("w-4 h-4 transition-transform", activeDropdown === 'services' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <ServicesDropdown isOpen={activeDropdown === 'services'} onClose={() => setActiveDropdown(null)} onMouseEnter={() => handleMouseEnter('services')} />
            </div>

            {/* About Dropdown (includes providers) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('about')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/about"
                className={cx(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname?.startsWith('/about') || pathname?.startsWith('/providers') || pathname?.startsWith('/locations')
                    ? "text-[#FF2D8E] bg-[#FF2D8E]/10"
                    : "text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5"
                )}
              >
                About
                <svg className={cx("w-4 h-4 transition-transform", activeDropdown === 'about' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleDropdown data={navigation.about} isOpen={activeDropdown === 'about'} onClose={() => setActiveDropdown(null)} onMouseEnter={() => handleMouseEnter('about')} />
            </div>

            {/* Memberships */}
            <Link
              href="/memberships"
              className={cx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                pathname?.startsWith('/memberships')
                  ? "text-[#FF2D8E] bg-[#FF2D8E]/10"
                  : "text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5"
              )}
            >
              Memberships
            </Link>

            {/* Your Journey Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('journey')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/your-journey"
                className={cx(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname?.startsWith('/your-journey') || pathname?.startsWith('/explore-care')
                    ? "text-[#FF2D8E] bg-[#FF2D8E]/10"
                    : "text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5"
                )}
              >
                Your Journey
                <svg className={cx("w-4 h-4 transition-transform", activeDropdown === 'journey' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleDropdown data={navigation.journey} isOpen={activeDropdown === 'journey'} onClose={() => setActiveDropdown(null)} onMouseEnter={() => handleMouseEnter('journey')} />
            </div>

            {/* Specials Dropdown - Highlighted */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('specials')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all text-[#FF2D8E] hover:text-pink-300 hover:bg-[#FF2D8E]/10 border border-[#FF2D8E]/30"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2D8E]"></span>
                </span>
                Specials
                <svg className={cx("w-4 h-4 transition-transform", activeDropdown === 'specials' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <SimpleDropdown data={navigation.specials} isOpen={activeDropdown === 'specials'} onClose={() => setActiveDropdown(null)} onMouseEnter={() => handleMouseEnter('specials')} align="right" />
            </div>

            {/* Contact */}
            <Link
              href="/contact"
              className={cx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === '/contact'
                  ? "text-[#FF2D8E] bg-[#FF2D8E]/10"
                  : "text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5"
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* TikTok - Desktop */}
            <a
              href="https://www.tiktok.com/@daniellealcala12"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex w-9 h-9 rounded-full bg-black/5 hover:bg-[#FF2D8E]/20 items-center justify-center text-black hover:text-[#FF2D8E] transition-all"
              aria-label="Follow us on TikTok"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
            {/* Phone - Desktop only */}
            <a
              href={`tel:${SITE.phone}`}
              className="hidden xl:flex items-center gap-2 px-3 py-2 text-sm text-[#FF2D8E] hover:text-[#FF2D8E] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">(630) 636-6193</span>
            </a>

            {/* Book Now Button */}
            <CTA href={BOOKING_URL} variant="gradient" className="hidden md:flex px-8 py-3">
              Book Now
            </CTA>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden tap-target p-2 text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5 rounded-lg transition-all duration-200"
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-xl lg:hidden overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white/95 border-b border-black px-4 py-4 flex items-center justify-between">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm font-bold">
                HG
              </span>
              <span className="text-lg font-bold text-[#FF2D8E]">{SITE.name}</span>
            </Link>
            <button
              className="p-2 text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="px-4 py-6 space-y-2">
            {/* Fix What Bothers Me */}
            <Link
              href="/fix-what-bothers-me"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl bg-[#FF2D8E]/10 border border-[#FF2D8E]/20 text-[#FF2D8E] font-semibold"
            >
              <span className="text-xl">💗</span>
              Fix what bothers me
            </Link>

            {/* Services Section */}
            <div className="border-b border-black pb-4">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'services' ? null : 'services')}
                className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-[#FF2D8E]"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">💋</span>
                  Services
                </span>
                <svg className={cx("w-5 h-5 transition-transform", mobileSubmenu === 'services' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenu === 'services' && (
                <div className="mt-2 ml-4 space-y-4">
                  {navigation.services.columns.map((column) => (
                    <div key={column.title}>
                      <p className="text-xs font-bold text-black uppercase tracking-wider px-4 mb-2">{column.title}</p>
                      {column.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5 rounded-lg"
                        >
                          <span>{link.icon}</span>
                          <span>{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* About Section (includes providers) */}
            <div className="border-b border-black pb-4">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'about' ? null : 'about')}
                className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-[#FF2D8E]"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">💗</span>
                  About & Team
                </span>
                <svg className={cx("w-5 h-5 transition-transform", mobileSubmenu === 'about' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenu === 'about' && (
                <div className="mt-2 ml-4">
                  {navigation.about.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5 rounded-lg"
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Memberships */}
            <Link
              href="/memberships"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-[#FF2D8E]"
            >
              <span className="text-xl">💎</span>
              Memberships
            </Link>

            {/* Your Journey Section */}
            <div className="border-b border-black pb-4">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'journey' ? null : 'journey')}
                className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-[#FF2D8E]"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">🗺️</span>
                  Your Journey
                </span>
                <svg className={cx("w-5 h-5 transition-transform", mobileSubmenu === 'journey' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenu === 'journey' && (
                <div className="mt-2 ml-4">
                  {navigation.journey.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5 rounded-lg"
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Specials Section */}
            <div className="border-b border-black pb-4">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'specials' ? null : 'specials')}
                className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-[#FF2D8E]"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">🎁</span>
                  Specials & Offers
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FF2D8E] text-white rounded-full animate-pulse">NEW</span>
                </span>
                <svg className={cx("w-5 h-5 transition-transform", mobileSubmenu === 'specials' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenu === 'specials' && (
                <div className="mt-2 ml-4">
                  {navigation.specials.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5 rounded-lg"
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                      {'badge' in link && link.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-[#FF2D8E]"
            >
              <span className="text-xl">📍</span>
              Contact Us
            </Link>

            {/* Phone */}
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-[#FF2D8E]"
            >
              <span className="text-xl">📞</span>
              (630) 636-6193
            </a>

            {/* Social - Mobile */}
            <a
              href="https://www.tiktok.com/@daniellealcala12"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-[#FF2D8E]"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              Follow us on TikTok
            </a>
          </div>

          {/* Mobile CTAs */}
          <div className="sticky bottom-0 bg-white/95 border-t border-black px-4 py-4 space-y-3 safe-area-pb">
            <CTA href={BOOKING_URL} variant="gradient" className="w-full min-h-[48px] py-4 rounded-xl text-base font-semibold">
              Book Your Appointment
            </CTA>
            <CTA href="/quiz" variant="outline" className="w-full min-h-[48px] py-3 rounded-xl">
              Find My Treatment
            </CTA>
          </div>
        </div>
      )}
    </header>
  );
}
