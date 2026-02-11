import Link from "next/link";

import { BOOKING_URL } from "@/lib/flows";
import { SITE, SERVICES } from "@/lib/seo";
import type { SiteSettings } from "@/lib/cms-readers";

const DEFAULT_TAGLINE = "Luxury, clinical-meets-beauty aesthetics with results you can trust. Experience personalized care that makes you feel confident and gorgeous.";

export function Footer({ siteSettings }: { siteSettings?: SiteSettings | null }) {
  const tagline = siteSettings?.tagline?.trim() || DEFAULT_TAGLINE;
  const hours = siteSettings?.business_hours;
  const hasHours = hours && (hours.mon_fri || hours.sat || hours.sun);

  return (
    <footer className="bg-gradient-to-b from-black to-gray-950 border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white text-lg font-bold shadow-lg shadow-pink-500/25">
                HG
              </span>
              <div>
                <span className="text-xl font-bold text-white">{SITE.name}</span>
                <span className="block text-xs text-pink-400/80 font-medium tracking-wider">MEDICAL AESTHETICS</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              {tagline}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-pink-500/20 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-pink-500/20 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-pink-500/20 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-all"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3 text-sm">
              {SERVICES.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                    href={`/services/${s.slug}`}
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="text-pink-400 hover:text-pink-300 transition-colors font-medium"
                  href="/services"
                >
                  View All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/fix-what-bothers-me">
                  Fix What Bothers Me
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/explore-care">
                  Explore Care
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/your-journey">
                  Your Journey
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/understand-your-body">
                  Understand Your Body
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/care-and-support">
                  Care & Support
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/quiz">
                  Find My Treatment
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/telehealth">
                  Telehealth
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/providers">
                  Meet Your Care Team
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/locations">
                  Location
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/care-engine">
                  The Care Engine™
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/clinical-partners">
                  Clinical Standards
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-400 transition-colors" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Hours from CMS (optional) */}
        {hasHours && (
          <div className="mt-8 pt-6 border-t border-white/5">
            <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Hours</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
              {hours.mon_fri && <span>Mon–Fri: {hours.mon_fri}</span>}
              {hours.sat && <span>Sat: {hours.sat}</span>}
              {hours.sun && <span>Sun: {hours.sun}</span>}
              {Array.isArray(hours.special_closures) && hours.special_closures.length > 0 && (
                <span>Closures: {hours.special_closures.join(", ")}</span>
              )}
            </div>
          </div>
        )}

        {/* Contact Info Bar */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <a
                href={`tel:${SITE.phone}`}
                className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (630) 636-6193
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {SITE.email}
              </a>
              <span className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}
              </span>
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              Book Your Appointment
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Privacy & Security (HIPAA-aligned) */}
      <div className="border-t border-white/5 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h4 className="font-semibold text-white text-sm mb-2">Privacy & Security</h4>
          <p className="text-sm text-gray-400 max-w-3xl">
            We use secure, encrypted systems to protect your information. Client access is provided via secure, one-time login links — no passwords required. We never share your personal information without your consent.
          </p>
          <Link className="inline-block mt-2 text-pink-400 hover:text-pink-300 text-sm font-medium" href="/privacy">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link className="hover:text-gray-300 transition-colors" href="/privacy">
                Privacy Policy
              </Link>
              <Link className="hover:text-gray-300 transition-colors" href="/terms">
                Terms of Service
              </Link>
              <Link className="hover:text-gray-300 transition-colors" href="/privacy#hipaa">
                HIPAA Notice
              </Link>
            </div>
            <p className="text-center md:text-right text-xs">
              Medical spa services vary by provider, eligibility, and treatment plan.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
