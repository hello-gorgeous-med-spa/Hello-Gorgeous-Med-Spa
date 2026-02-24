"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

import { CTA } from "./CTA";
import { SITE } from "@/lib/seo";
import { BOOKING_URL, CHERRY_PAY_URL } from "@/lib/flows";

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
          { label: "Allē Rewards", href: "/alle-botox-rewards", icon: "💎" },
        ],
      },
      {
        title: "Skin & Face",
        links: [
          { label: "Solaria CO₂ Laser", href: "/stretch-mark-treatment-oswego-il", icon: "⚡", badge: "NEW" },
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
      title: "🔥 Solaria CO₂ Laser",
      description: "Our newest advanced treatment! VIP Early Access now open. $100 off for first 25 clients.",
      cta: { label: "Join VIP Waitlist", href: "/solaria-co2-vip" },
      image: "⚡",
    },
  },
  about: {
    label: "About",
    href: "/about",
    links: [
      { label: "About Hello Gorgeous", href: "/about", description: "Our story, mission & team", icon: "💗" },
      { label: "Meet Our Team", href: "/providers", description: "Danielle, Ryan & our experts", icon: "👩‍⚕️" },
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
      { label: "Explore Care", href: "/explore-care", description: "Discover treatments for you", icon: "🔍" },
      { label: "HG Face Blueprint™", href: "/face-blueprint", description: "AI-assisted aesthetic simulation", icon: "✨" },
      { label: "Virtual Consultation", href: "/virtual-consultation", description: "Get personalized treatment recommendations", icon: "🖥️", badge: "FREE" },
      { label: "Conditions We Treat", href: "/conditions", description: "Acne, wrinkles, hyperpigmentation & more", icon: "✨" },
      { label: "Your Treatment Journey", href: "/your-journey", description: "What to expect", icon: "🗺️" },
      { label: "Understand Your Body", href: "/understand-your-body", description: "Learn about aging & skin", icon: "📚" },
      { label: "Allē Rewards", href: "/alle-botox-rewards", description: "Earn points on Botox, Juvederm & more", icon: "💎" },
      { label: "Telehealth", href: "/telehealth", description: "Virtual consultations", icon: "🖥️" },
      { label: "Lip Enhancement Studio", href: "/lip-studio", description: "Visualize your perfect look", icon: "✨" },
      { label: "Botox Calculator", href: "/botox-calculator", description: "Estimate units for your areas", icon: "💉" },
      { label: "Supplement Dispensary", href: "/fullscript", description: "Professional-grade supplements & Fullscript", icon: "💊" },
    ],
  },
  providers: {
    label: "Providers",
    href: "/providers",
    links: [
      { label: "Meet Our Team", href: "/providers", description: "Licensed medical professionals", icon: "👩‍⚕️" },
      { label: "Danielle Alcala", href: "/providers/danielle", description: "Founder & Lead Injector", icon: "💗" },
      { label: "Ryan Kent, FNP-BC", href: "/providers/ryan", description: "Medical Director", icon: "🧑‍⚕️" },
    ],
  },
  specials: {
    label: "Specials",
    href: "/free-vitamin",
    highlight: true,
    links: [
      { label: "FREE Vitamin Shot", href: "/free-vitamin", description: "New clients only - $0", icon: "💉", badge: "FREE" },
      { label: "Allē Rewards", href: "/alle-botox-rewards", description: "Earn points on Botox, Juvederm & more", icon: "💎" },
      { label: "Memberships", href: "/memberships", description: "Save with a membership plan", icon: "🎁" },
      { label: "Give $25, Get $25", href: "/referral", description: "Refer a friend", icon: "💝" },
      { label: "Current Promotions", href: "/book", description: "This month's deals", icon: "🔥" },
      { label: "Financing Options", href: "/financing", description: "Cherry, Affirm & CareCredit", icon: "💳" },
    ],
  },
  shop: {
    label: "Shop",
    href: "/shop",
    links: [
      { label: "Supplement Dispensary", href: "/fullscript", description: "Professional-grade supplements (Fullscript)", icon: "💊" },
      { label: "Shop Skincare & More", href: "/shop", description: "Skinscript RX, in-office products", icon: "🧴" },
      { label: "Pay with Cherry", href: CHERRY_PAY_URL, description: "Financing for your care", icon: "💳", external: true },
    ],
  },
  more: {
    label: "More",
    href: "/contact",
    links: [
      { label: "Shop", href: "/shop", description: "Skincare, supplements & more", icon: "🧴" },
      { label: "Supplement Dispensary", href: "/fullscript", description: "Fullscript supplements", icon: "💊" },
      { label: "Patient Care", href: "/pre-post-care", description: "Pre & post treatment care", icon: "📋" },
      { label: "Contact", href: "/contact", description: "Location, hours & get in touch", icon: "📍" },
    ],
  },
  rx: {
    label: "RX",
    href: "/rx",
    links: [
      { label: "Hello Gorgeous RX™", href: "/rx", description: "Luxury Longevity Division", icon: "💊" },
      { label: "Hormone Optimization", href: "/rx/hormones", description: "Bio-identical hormone therapy", icon: "🧬" },
      { label: "Metabolic Optimization", href: "/rx/metabolic", description: "Medical weight loss programs", icon: "⚖️" },
      { label: "Peptides + Longevity", href: "/rx/peptides", description: "Cellular regeneration", icon: "🧪" },
      { label: "Sexual Wellness", href: "/rx/sexual-health", description: "Hormone-supported programs", icon: "🔥" },
      { label: "Clinical Dermatology", href: "/rx/dermatology", description: "Prescription skincare", icon: "🧴" },
      { label: "RX Membership", href: "/rx/membership", description: "Medical optimization programs", icon: "💎" },
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
                      {'badge' in link && link.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#FF2D8E] text-white rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Featured section - brand colors only */}
          <div className="bg-white border-2 border-black rounded-2xl p-6">
            <div className="text-4xl mb-3">{data.featured.image}</div>
            <h3 className="font-bold text-black mb-2">{data.featured.title}</h3>
            <p className="text-sm text-black mb-4">{data.featured.description}</p>
            <Link
              href={data.featured.cta.href}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF2D8E] hover:text-[#E6007E]"
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
          {data.links.map((link) => {
            const isExternal = 'external' in link && link.external;
            const linkProps = {
              key: link.href,
              onClick: onClose,
              className: "flex items-start gap-4 p-3 rounded-xl hover:bg-white transition-colors group",
            };
            const content = (
              <>
                <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">
                  {link.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black group-hover:text-[#FF2D8E] transition-colors">
                      {link.label}
                    </span>
                    {'badge' in link && link.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FF2D8E] text-white rounded-full">
                        {link.badge}
                      </span>
                    )}
                    {isExternal && (
                      <span className="text-black/60" aria-hidden>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-black mt-0.5">{link.description}</p>
                </div>
              </>
            );
            return isExternal ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer" {...linkProps}>
                {content}
              </a>
            ) : (
              <Link href={link.href} {...linkProps}>
                {content}
              </Link>
            );
          })}
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
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 overflow-visible">
        <div className="flex items-center justify-between gap-2 h-16 min-h-16">
          {/* Logo - never shrink */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-[#FF2D8E] text-white text-xs sm:text-sm font-bold shadow-md">
              HG
            </span>
            <div className="hidden sm:block">
              <span className="text-base sm:text-lg font-bold text-[#FF2D8E]">{SITE.name}</span>
              <span className="block text-[10px] text-black font-medium tracking-wider">MEDICAL AESTHETICS</span>
            </div>
          </Link>

          {/* Desktop Navigation - single row, aligned; dropdowns and Book Now visible */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-x-0 min-w-0 overflow-visible">
            {/* Services Dropdown */}
            <div 
              className="relative flex items-center"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/services"
                className={cx(
                  "flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg text-sm font-medium transition-all",
                  pathname?.startsWith('/services')
                    ? "text-white bg-[#FF2D8E]"
                    : "text-black hover:bg-[#FF2D8E]/10 hover:text-[#FF2D8E]"
                )}
              >
                Services
                <svg className={cx("w-3.5 h-3.5 transition-transform", activeDropdown === 'services' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <ServicesDropdown isOpen={activeDropdown === 'services'} onClose={() => setActiveDropdown(null)} onMouseEnter={() => handleMouseEnter('services')} />
            </div>

            {/* About Dropdown (includes providers) */}
            <div 
              className="relative flex items-center"
              onMouseEnter={() => handleMouseEnter('about')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/about"
                className={cx(
"flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg text-sm font-medium transition-all",
                  pathname?.startsWith('/about') || pathname?.startsWith('/providers') || pathname?.startsWith('/locations')
                    ? "text-white bg-[#FF2D8E]"
                    : "text-black hover:bg-[#FF2D8E]/10 hover:text-[#FF2D8E]"
                )}
              >
                About
                <svg className={cx("w-3.5 h-3.5 transition-transform", activeDropdown === 'about' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleDropdown data={navigation.about} isOpen={activeDropdown === 'about'} onClose={() => setActiveDropdown(null)} onMouseEnter={() => handleMouseEnter('about')} />
            </div>

            {/* Your Journey Dropdown */}
            <div 
              className="relative flex items-center"
              onMouseEnter={() => handleMouseEnter('journey')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/your-journey"
                className={cx(
"flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg text-sm font-medium transition-all",
                  pathname?.startsWith('/your-journey')
                    ? "text-white bg-[#FF2D8E]"
                    : "text-black hover:bg-[#FF2D8E]/10 hover:text-[#FF2D8E]"
                )}
              >
                Your Journey
                <svg className={cx("w-3.5 h-3.5 transition-transform", activeDropdown === 'journey' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleDropdown data={navigation.journey} isOpen={activeDropdown === 'journey'} onClose={() => setActiveDropdown(null)} onMouseEnter={() => handleMouseEnter('journey')} />
            </div>

            {/* RX Dropdown */}
            <div 
              className="relative flex items-center"
              onMouseEnter={() => handleMouseEnter('rx')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/rx"
                className={cx(
"flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg text-sm font-medium transition-all",
                  pathname?.startsWith('/rx')
                    ? "text-white bg-[#FF2D8E] border border-[#FF2D8E]"
                    : "text-black hover:bg-[#FF2D8E]/10 hover:text-[#FF2D8E] border border-black hover:border-[#FF2D8E]"
                )}
              >
                RX
                <svg className={cx("w-3.5 h-3.5 transition-transform", activeDropdown === 'rx' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleDropdown data={navigation.rx} isOpen={activeDropdown === 'rx'} onClose={() => setActiveDropdown(null)} onMouseEnter={() => handleMouseEnter('rx')} />
            </div>

            {/* More (Shop, Patient Care, Contact) */}
            <div 
              className="relative flex items-center"
              onMouseEnter={() => handleMouseEnter('more')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                className={cx(
"flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg text-sm font-medium transition-all",
                  activeDropdown === 'more'
                    ? "text-white bg-[#FF2D8E]"
                    : "text-black hover:bg-[#FF2D8E]/10 hover:text-[#FF2D8E]"
                )}
              >
                More
                <svg className={cx("w-3.5 h-3.5 transition-transform", activeDropdown === 'more' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <SimpleDropdown data={navigation.more} isOpen={activeDropdown === 'more'} onClose={() => setActiveDropdown(null)} onMouseEnter={() => handleMouseEnter('more')} align="right" />
            </div>

            {/* Specials Dropdown - Highlighted */}
            <div 
              className="relative flex items-center"
              onMouseEnter={() => handleMouseEnter('specials')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={navigation.specials.href}
                className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg text-sm font-medium transition-all text-black hover:text-[#FF2D8E] hover:bg-[#FF2D8E]/10 border border-black hover:border-[#FF2D8E]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D8E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2D8E]"></span>
                </span>
                Specials
                <svg className={cx("w-3.5 h-3.5 transition-transform", activeDropdown === 'specials' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <SimpleDropdown data={navigation.specials} isOpen={activeDropdown === 'specials'} onClose={() => setActiveDropdown(null)} onMouseEnter={() => handleMouseEnter('specials')} align="right" />
            </div>
          </nav>

          {/* Right side actions - never shrink so Book Now is always visible */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Social - Desktop: Instagram, Facebook, TikTok */}
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex w-9 h-9 rounded-full border border-black bg-white hover:bg-[#FF2D8E]/10 items-center justify-center text-black hover:text-[#FF2D8E] transition-all"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.265.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex w-9 h-9 rounded-full border border-black bg-white hover:bg-[#FF2D8E]/10 items-center justify-center text-black hover:text-[#FF2D8E] transition-all"
              aria-label="Follow us on Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={SITE.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex w-9 h-9 rounded-full border border-black bg-white hover:bg-[#FF2D8E]/10 items-center justify-center text-black hover:text-[#FF2D8E] transition-all"
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
              className="lg:hidden tap-target p-2 text-[#FF2D8E] hover:text-[#E6007E] hover:bg-[#FF2D8E]/10 rounded-lg transition-all duration-200"
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
        <div className="fixed inset-0 z-50 bg-white lg:hidden overflow-y-auto border-t-2 border-black">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-black px-4 py-4 flex items-center justify-between">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF2D8E] text-white text-sm font-bold border-2 border-black">
                HG
              </span>
              <span className="text-lg font-bold text-[#FF2D8E]">{SITE.name}</span>
            </Link>
            <button
              className="p-2 text-[#FF2D8E] hover:text-[#E6007E] hover:bg-[#FF2D8E]/10 rounded-lg"
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

            {/* More (Shop, Supplement Dispensary, Patient Care, Contact) */}
            <div className="border-b border-black pb-4">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'more' ? null : 'more')}
                className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-[#FF2D8E]"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">📌</span>
                  More
                </span>
                <svg className={cx("w-5 h-5 transition-transform", mobileSubmenu === 'more' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenu === 'more' && (
                <div className="mt-2 ml-4">
                  {navigation.more.links.map((link) => {
                    const isExternal = 'external' in link && link.external;
                    const item = (
                      <>
                        <span>{link.icon}</span>
                        <span>{link.label}</span>
                      </>
                    );
                    return isExternal ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#FF2D8E]/10 rounded-lg"
                      >
                        {item}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#FF2D8E]/10 rounded-lg"
                      >
                        {item}
                      </Link>
                    );
                  })}
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
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FF2D8E] text-white rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* RX Section */}
            <div className="border-b border-black pb-4">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'rx' ? null : 'rx')}
                className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-[#FF2D8E]"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">💊</span>
                  RX
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FF2D8E] text-white rounded-full">MEDICAL</span>
                </span>
                <svg className={cx("w-5 h-5 transition-transform", mobileSubmenu === 'rx' && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenu === 'rx' && (
                <div className="mt-2 ml-4">
                  {navigation.rx.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#FF2D8E]/10 rounded-lg"
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Phone */}
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-[#FF2D8E]"
            >
              <span className="text-xl">📞</span>
              (630) 636-6193
            </a>

            {/* Social - Mobile */}
            <div className="flex flex-wrap items-center gap-4 px-4 py-2">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#FF2D8E] font-semibold"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.265.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#FF2D8E] font-semibold"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a
                href={SITE.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#FF2D8E] font-semibold"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                TikTok
              </a>
            </div>
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
