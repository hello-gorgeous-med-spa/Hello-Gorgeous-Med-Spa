'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { RegenFormulationNavDropdown } from '@/components/regen/RegenFormulationNavDropdown';
import {
  FORMULATION_HUB_LINKS,
  FORMULATION_NAV_LABEL,
  isFormulationHubPath,
} from '@/lib/regen/formulation-partner';
import { REGEN_TELEHEALTH_PATH, regenTelehealthPriceLabel } from '@/lib/regen/telehealth-consult';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
};

const LINKS = [
  { href: '/start', label: 'Programs' },
  { href: '/products', label: 'Products' },
  { href: '/tools', label: 'Free Tools' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/learn', label: 'Learn' },
  { href: '/about', label: 'Our Story' },
  { href: '/providers', label: 'Our Team' },
  { href: '/affiliates', label: 'Partners' },
  { href: '/contact', label: 'Contact' },
] as const;

function isNavActive(pathname: string, href: string) {
  if (href === '/tools') {
    return pathname.startsWith('/tools') || pathname.startsWith('/regen/tools');
  }
  return pathname === href || pathname.startsWith(`${href}/`) || pathname === `/regen${href}` || pathname.startsWith(`/regen${href}/`);
}

export function RegenPublicNav({ fixed = false }: { fixed?: boolean }) {
  const pathname = usePathname() || '';
  const [mobileOpen, setMobileOpen] = useState(false);
  const peptidesOpen = isFormulationHubPath(pathname);

  return (
    <nav
      className={`${fixed ? 'fixed top-8 left-0 right-0 z-50' : 'relative z-50'} backdrop-blur-xl border-b`}
      style={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: `${BRAND.teal}30` }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
          <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={220} height={70} className="h-12 md:h-16 w-auto brightness-110" />
        </Link>
        <div className="flex items-center gap-5">
          {LINKS.slice(0, 2).map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hidden lg:block ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                style={active ? { color: BRAND.teal } : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <RegenFormulationNavDropdown />
          {LINKS.slice(2).map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hidden lg:block ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                style={active ? { color: BRAND.teal } : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-full hidden md:inline-flex"
            style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}50` }}
          >
            Patient Login
          </Link>
          <Link
            href={REGEN_TELEHEALTH_PATH}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-full"
            style={{
              border: `2px solid ${pathname.startsWith(REGEN_TELEHEALTH_PATH) || pathname.startsWith('/regen' + REGEN_TELEHEALTH_PATH) ? BRAND.pink : BRAND.teal}`,
              color: pathname.startsWith(REGEN_TELEHEALTH_PATH) || pathname.startsWith('/regen' + REGEN_TELEHEALTH_PATH) ? BRAND.pink : BRAND.teal,
            }}
          >
            Book a consult {regenTelehealthPriceLabel()}
          </Link>
          <Link
            href="/start"
            className="px-6 py-3 text-white text-sm font-bold rounded-full hidden sm:inline-flex"
            style={{ backgroundColor: BRAND.pink }}
          >
            Get Started
          </Link>
          <button
            type="button"
            className="lg:hidden rounded-full border px-3 py-2 text-sm font-bold text-white"
            style={{ borderColor: `${BRAND.teal}50` }}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="lg:hidden border-t px-6 py-4" style={{ borderColor: `${BRAND.teal}20`, backgroundColor: '#0A0A0A' }}>
          <div className="flex flex-col gap-3">
            {LINKS.map((item) => {
              const active = isNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium"
                  style={{ color: active ? BRAND.teal : '#9CA3AF' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <p className="pt-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: peptidesOpen ? BRAND.teal : '#6B7280' }}>
              {FORMULATION_NAV_LABEL}
            </p>
            <div className="ml-1 flex flex-col gap-2 border-l pl-3" style={{ borderColor: `${BRAND.teal}40` }}>
              {FORMULATION_HUB_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  <span className="mt-0.5 block text-xs font-normal text-white/45">{link.sub}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/start"
              className="mt-2 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: BRAND.pink }}
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
