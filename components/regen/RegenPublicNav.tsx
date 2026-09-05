'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
};

const LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/tools', label: 'Free Tools' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/learn', label: 'Learn' },
  { href: '/about', label: 'Our Story' },
  { href: '/providers', label: 'Our Team' },
  { href: '/contact', label: 'Contact' },
] as const;

export function RegenPublicNav({ fixed = false }: { fixed?: boolean }) {
  const pathname = usePathname() || '';
  const onTools = pathname.startsWith('/tools') || pathname.startsWith('/regen/tools');

  return (
    <nav
      className={`${fixed ? 'fixed top-8 left-0 right-0 z-50' : ''} backdrop-blur-xl border-b`}
      style={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: `${BRAND.teal}30` }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={220} height={70} className="h-12 md:h-16 w-auto brightness-110" />
        </Link>
        <div className="flex items-center gap-5">
          {LINKS.map((item) => {
            const active = item.href === '/tools' ? onTools : pathname === item.href || pathname.startsWith(`${item.href}/`);
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
            href="/start"
            className="px-6 py-3 text-white text-sm font-bold rounded-full"
            style={{ backgroundColor: BRAND.pink }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
