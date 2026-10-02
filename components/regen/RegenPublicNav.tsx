'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import { regenHostHref } from '@/lib/regen/refill-request-catalog';
import { REGEN_TELEHEALTH_PATH, regenTelehealthPriceLabel } from '@/lib/regen/telehealth-consult';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
};

type NavLink = { href: string; label: string; sub: string };

const MENUS: { id: string; label: string; links: NavLink[] }[] = [
  {
    id: 'care',
    label: 'Care',
    links: [
      { href: '/learn/weight-loss', label: 'Weight loss', sub: 'Semaglutide and tirzepatide' },
      { href: '/peptides', label: 'Peptides', sub: 'What we can compound' },
      { href: '/learn/hormones', label: 'Hormones', sub: 'Reviewed before a prescription' },
      { href: '/sexual-health', label: 'Sexual health', sub: 'Men and women' },
      { href: '/dermatology', label: 'Dermatology', sub: 'Skin and hair' },
      { href: '/upneeq', label: 'Upneeq', sub: 'Eyelid lift drops' },
      { href: '/labs', label: 'Labs', sub: 'Ordered after medical review' },
      { href: '/refill', label: 'Compound shop', sub: 'Refill or add a protocol' },
    ],
  },
  {
    id: 'start',
    label: 'Start',
    links: [
      { href: '/start', label: 'Get started', sub: 'Request a review' },
      { href: '/how-it-works', label: 'How it works', sub: 'Request, review, then invoice' },
      { href: '/glp-1-quiz', label: 'GLP-1 quiz', sub: 'See if weight loss is a fit' },
      { href: '/pricing', label: 'Pricing', sub: 'Prescribed after approval' },
      { href: '/products', label: 'Products', sub: 'What a clinician can order' },
      { href: REGEN_TELEHEALTH_PATH, label: 'Book a consult', sub: regenTelehealthPriceLabel() },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    links: [
      { href: '/learn', label: 'Learn hub', sub: 'Guides by goal' },
      { href: '/learn/weight-loss', label: 'Weight loss guide', sub: 'How GLP-1s work' },
      { href: '/learn/hormones', label: 'Hormone guide', sub: 'What a visit covers' },
      { href: '/learn/side-effects', label: 'Side effects', sub: 'What to watch for' },
      { href: '/tools', label: 'Free tools', sub: 'Calculators and checklists' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    links: [
      { href: '/about', label: 'Our story', sub: 'Hello Gorgeous, P.C.' },
      { href: '/providers', label: 'Our team', sub: 'Illinois clinicians' },
      { href: '/affiliates', label: 'Partners', sub: 'Affiliate program' },
      { href: '/safety', label: 'Safety', sub: 'How we screen' },
      { href: '/contact', label: 'Contact', sub: '(630) 636-6193' },
    ],
  },
];

function barePath(pathname: string) {
  return pathname.replace(/^\/regen(?=\/|$)/, '') || '/';
}

function isLinkActive(pathname: string, href: string) {
  const path = barePath(pathname);
  if (href === '/learn') return path === '/learn';
  if (href === '/tools') return path.startsWith('/tools');
  return path === href || path.startsWith(`${href}/`);
}

function menuActive(pathname: string, links: NavLink[]) {
  return links.some((link) => isLinkActive(pathname, link.href));
}

function linkHref(href: string) {
  return href === '/refill' ? regenHostHref(href) : href;
}

function NavDropdown({
  label,
  links,
  pathname,
  open,
  onOpen,
  onClose,
}: {
  label: string;
  links: NavLink[];
  pathname: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const active = menuActive(pathname, links);

  const show = () => {
    clearTimeout(timeout.current);
    onOpen();
  };
  const hide = () => {
    timeout.current = setTimeout(onClose, 140);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onPointer);
    };
  }, [open, onClose]);

  return (
    <div ref={rootRef} className="relative hidden lg:block" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${
          active || open ? 'text-white' : 'text-gray-400 hover:text-white'
        }`}
        style={active || open ? { color: BRAND.teal } : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => (open ? onClose() : onOpen())}
      >
        {label}
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 min-w-[280px] pt-3">
          <div
            id={menuId}
            role="menu"
            className="overflow-hidden rounded-2xl border bg-[#111111] shadow-2xl"
            style={{ borderColor: `${BRAND.teal}40` }}
          >
            {links.map((link) => {
              const current = isLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.href + link.label}
                  href={linkHref(link.href)}
                  role="menuitem"
                  className="block border-b px-4 py-3 last:border-0 hover:bg-white/5"
                  style={{ borderColor: `${BRAND.teal}18` }}
                  onClick={onClose}
                >
                  <span className="block text-sm font-semibold" style={{ color: current ? BRAND.teal : '#FAF9F6' }}>
                    {link.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-white/50">{link.sub}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function RegenPublicNav({ fixed = false }: { fixed?: boolean }) {
  const pathname = usePathname() || '';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const consultActive =
    pathname.startsWith(REGEN_TELEHEALTH_PATH) || pathname.startsWith(`/regen${REGEN_TELEHEALTH_PATH}`);

  return (
    <nav
      className={`${fixed ? 'fixed top-8 left-0 right-0 z-50' : 'relative z-50'} backdrop-blur-xl border-b`}
      style={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: `${BRAND.teal}30` }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0" onClick={() => setMobileOpen(false)}>
          <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={220} height={70} className="h-12 md:h-16 w-auto brightness-110" />
        </Link>
        <div className="flex items-center gap-5">
          {MENUS.map((menu) => (
            <NavDropdown
              key={menu.id}
              label={menu.label}
              links={menu.links}
              pathname={pathname}
              open={openMenu === menu.id}
              onOpen={() => setOpenMenu(menu.id)}
              onClose={() => setOpenMenu((current) => (current === menu.id ? null : current))}
            />
          ))}
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-full hidden md:inline-flex"
            style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}50` }}
          >
            Patient Login
          </Link>
          <Link
            href={REGEN_TELEHEALTH_PATH}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-full hidden xl:inline-flex"
            style={{
              border: `2px solid ${consultActive ? BRAND.pink : BRAND.teal}`,
              color: consultActive ? BRAND.pink : BRAND.teal,
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
          <div className="flex flex-col gap-2">
            {MENUS.map((menu) => {
              const expanded = mobileSection === menu.id;
              return (
                <div key={menu.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-2 text-sm font-semibold"
                    style={{ color: menuActive(pathname, menu.links) || expanded ? BRAND.teal : '#E5E7EB' }}
                    aria-expanded={expanded}
                    onClick={() => setMobileSection(expanded ? null : menu.id)}
                  >
                    {menu.label}
                    <span aria-hidden>{expanded ? '−' : '+'}</span>
                  </button>
                  {expanded ? (
                    <div className="mb-2 ml-1 flex flex-col gap-2 border-l pl-3" style={{ borderColor: `${BRAND.teal}40` }}>
                      {menu.links.map((link) => (
                        <Link
                          key={link.href + link.label}
                          href={linkHref(link.href)}
                          className="text-sm font-medium"
                          style={{ color: isLinkActive(pathname, link.href) ? BRAND.teal : '#9CA3AF' }}
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
            <Link
              href="/login"
              className="pt-2 text-sm font-medium"
              style={{ color: BRAND.teal }}
              onClick={() => setMobileOpen(false)}
            >
              Patient Login
            </Link>
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
