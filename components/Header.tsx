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
          { label: "Lip Enhancement", href: "/book/per-syringe", icon: "👄" },
          { label: "Kybella", href: "/services", icon: "✨" },
        ],
      },
      {
        title: "Skin & Face",
        links: [
          { label: "Facials & Peels", href: "/services/facials", icon: "✨" },
          { label: "Microneedling", href: "/services/microneedling", icon: "🎯" },
          { label: "IPL Photofacial", href: "/book/photofacials-ipl", icon: "💡" },
          { label: "PRP/PRF Treatments", href: "/services/prp-prf", icon: "🩸" },
        ],
      },
      {
        title: "Body & Wellness",
        links: [
          { label: "Weight Loss (GLP-1)", href: "/services/weight-loss", icon: "⚡" },
          { label: "Hormone Therapy", href: "/services/hormone-therapy", icon: "⚖️" },
          { label: "IV Therapy", href: "/services/iv-therapy", icon: "💧" },
          { label: "Laser Hair Removal", href: "/book", icon: "✨" },
        ],
      },
      {
        title: "Lash & Brow",
        links: [
          { label: "Lash Extensions", href: "/book", icon: "👁️" },
          { label: "Lash Lift & Tint", href: "/book", icon: "✨" },
          { label: "Brow Lamination", href: "/book", icon: "🤨" },
          { label: "Brow Shaping", href: "/book", icon: "💅" },
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
      { label: "About Hello Gorgeous", href: "/about", description: "Our story and mission", icon: "💗" },
      { label: "Meet Your Care Team", href: "/meet-the-team", description: "Expert providers you can trust", icon: "👩‍⚕️" },
      { label: "Our Location", href: "/locations", description: "Visit us in Oswego, IL", icon: "📍" },
      { label: "Clinical Standards", href: "/clinical-partners", description: "Safety & quality commitment", icon: "🏥" },
      { label: "The Care Engine™", href: "/care-engine", description: "Our personalized approach", icon: "⚙️" },
    ],
  },
  journey: {
    label: "Your Journey",
    href: "/your-journey",
    links: [
      { label: "Explore Care Options", href: "/explore-care", description: "Discover treatments for you", icon: "🔍" },
      { label: "Your Treatment Journey", href: "/your-journey", description: "What to expect", icon: "🗺️" },
      { label: "Understand Your Body", href: "/understand-your-body", description: "Learn about aging & skin", icon: "📚" },
      { label: "Care & Support", href: "/care-and-support", description: "Resources & aftercare", icon: "💝" },
      { label: "Telehealth", href: "/telehealth", description: "Virtual consultations", icon: "🖥️" },
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
      className="fixed top-16 left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-5 gap-8">
          {/* Service columns */}
          {data.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors group"
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
            <h3 className="font-bold text-gray-900 mb-2">{data.featured.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{data.featured.description}</p>
            <Link
              href={data.featured.cta.href}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700"
            >
              {data.featured.cta.label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
          <Link
            href="/services"
            onClick={onClose}
            className="text-sm font-medium text-gray-600 hover:text-pink-600 flex items-center gap-2"
          >
            View All Services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href={BOOKING_URL}
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all"
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
  align = 'left'
}: { 
  data: typeof navigation.about;
  isOpen: boolean; 
  onClose: () => void;
  align?: 'left' | 'right';
}) {
  if (!isOpen) return null;
  
  return (
    <div 
      className={cx(
        "absolute top-full pt-2 z-50",
        align === 'right' ? 'right-0' : 'left-0'
      )}
      onMouseLeave={onClose}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-[320px]">
        <div className="p-2">
          {data.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {link.label}
                  </span>
                  {'badge' in link && link.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{link.description}</p>
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
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm font-bold shadow-lg shadow-pink-500/25">
              HG
            </span>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white">{SITE.name}</span>
              <span className="block text-[10px] text-pink-400/80 font-medium tracking-wider">MEDICAL AESTHETICS</span>
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
                    ? "text-pink-400 bg-white/5"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                )}
              >
                Services
                <svg className={cx("w-4 h-4 transition-transform", activeDropdown === 'services' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <ServicesDropdown isOpen={activeDropdown === 'services'} onClose={() => setActiveDropdown(null)} onMouseEnter={() => handleMouseEnter('services')} />
            </div>

            {/* About Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('about')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/about"
                className={cx(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname?.startsWith('/about') || pathname?.startsWith('/meet-the-team') || pathname?.startsWith('/locations')
                    ? "text-pink-400 bg-white/5"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                )}
              >
                About
                <svg className={cx("w-4 h-4 transition-transform", activeDropdown === 'about' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleDropdown data={navigation.about} isOpen={activeDropdown === 'about'} onClose={() => setActiveDropdown(null)} />
            </div>

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
                    ? "text-pink-400 bg-white/5"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                )}
              >
                Your Journey
                <svg className={cx("w-4 h-4 transition-transform", activeDropdown === 'journey' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleDropdown data={navigation.journey} isOpen={activeDropdown === 'journey'} onClose={() => setActiveDropdown(null)} />
            </div>

            {/* Specials Dropdown - Highlighted */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('specials')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 border border-pink-500/30"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                Specials
                <svg className={cx("w-4 h-4 transition-transform", activeDropdown === 'specials' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <SimpleDropdown data={navigation.specials} isOpen={activeDropdown === 'specials'} onClose={() => setActiveDropdown(null)} align="right" />
            </div>

            {/* Contact */}
            <Link
              href="/contact"
              className={cx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === '/contact'
                  ? "text-pink-400 bg-white/5"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Phone - Desktop only */}
            <a
              href={`tel:${SITE.phone}`}
              className="hidden xl:flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">(630) 636-6193</span>
            </a>

            {/* Book Now Button */}
            <CTA href={BOOKING_URL} variant="gradient" className="hidden md:flex px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-pink-500/25">
              Book Now
            </CTA>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
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
        <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-xl lg:hidden overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-black/95 border-b border-white/10 px-4 py-4 flex items-center justify-between">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm font-bold">
                HG
              </span>
              <span className="text-lg font-bold text-white">{SITE.name}</span>
            </Link>
            <button
              className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="px-4 py-6 space-y-2">
            {/* Services Section */}
            <div className="border-b border-white/10 pb-4">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'services' ? null : 'services')}
                className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-white"
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
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 mb-2">{column.title}</p>
                      {column.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-lg"
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

            {/* About Section */}
            <div className="border-b border-white/10 pb-4">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'about' ? null : 'about')}
                className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-white"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">💗</span>
                  About
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
                      className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Your Journey Section */}
            <div className="border-b border-white/10 pb-4">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'journey' ? null : 'journey')}
                className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-white"
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
                      className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Specials Section - Highlighted */}
            <div className="border-b border-white/10 pb-4">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'specials' ? null : 'specials')}
                className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-pink-400"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">🎁</span>
                  Specials & Offers
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-500 text-white rounded-full animate-pulse">NEW</span>
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
                      className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-lg"
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
              className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-white"
            >
              <span className="text-xl">📍</span>
              Contact Us
            </Link>

            {/* Phone */}
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-white"
            >
              <span className="text-xl">📞</span>
              (630) 636-6193
            </a>
          </div>

          {/* Mobile CTAs */}
          <div className="sticky bottom-0 bg-black/95 border-t border-white/10 px-4 py-4 space-y-3">
            <CTA href={BOOKING_URL} variant="gradient" className="w-full py-4 rounded-xl text-lg font-semibold">
              Book Your Appointment
            </CTA>
            <CTA href="/quiz" variant="outline" className="w-full py-3 rounded-xl">
              Find My Treatment
            </CTA>
          </div>
        </div>
      )}
    </header>
  );
}
