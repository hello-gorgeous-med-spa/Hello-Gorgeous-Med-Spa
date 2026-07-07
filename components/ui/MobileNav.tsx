'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_MOBILE_BOTTOM_NAV, ADMIN_NAV_GROUPS } from '@/lib/admin-nav';

interface MobileNavProps {
  variant?: 'light' | 'dark';
}

export function MobileNav({ variant = 'light' }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsedOpen, setCollapsedOpen] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const toggleCollapsed = (section: string) => {
    setCollapsedOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`lg:hidden p-2.5 rounded-lg transition-colors ${
          variant === 'dark' ? 'text-white hover:bg-white/20' : 'text-black hover:bg-black/10'
        }`}
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[9998] lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-[9999] transform transition-transform duration-300 ease-in-out lg:hidden shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-black/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💗</span>
              <span className="font-bold text-black">Hello Gorgeous</span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#E6007E] mt-1">
              Medical portal
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-black hover:bg-black/5 rounded-lg"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="overflow-y-auto p-3 pb-28 max-h-[calc(100vh-72px)]">
          <div className="mb-4 grid grid-cols-2 gap-2">
            <Link
              href="/admin/rx"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-[#E6007E] text-white text-center py-2 text-xs font-semibold"
            >
              RX
            </Link>
            <Link
              href="/staff/protocols"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-emerald-600 text-white text-center py-2 text-xs font-semibold"
            >
              Protocols
            </Link>
            <Link
              href="/admin/flowwave"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-[#2D63A4] text-white text-center py-2 text-xs font-semibold"
            >
              FlowWave
            </Link>
            <Link
              href="/pos"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-black text-white text-center py-2 text-xs font-semibold"
            >
              POS
            </Link>
          </div>

          {ADMIN_NAV_GROUPS.map((group) => {
            const items = group.items;
            if (group.collapsed) {
              const open = !!collapsedOpen[group.section];
              return (
                <div key={group.section} className="mb-4">
                  <button
                    type="button"
                    onClick={() => toggleCollapsed(group.section)}
                    className="w-full flex items-center justify-between px-2 py-1 text-xs font-bold uppercase tracking-wider text-black/45"
                  >
                    {group.section}
                    <span>{open ? '−' : '+'}</span>
                  </button>
                  {open &&
                    items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                          isActive(item.href)
                            ? 'bg-[#FFF0F7] text-[#E6007E] font-semibold'
                            : 'text-black hover:bg-black/5'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                </div>
              );
            }

            return (
              <div key={group.section} className="mb-4">
                <h3 className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-black/45">
                  {group.section}
                </h3>
                <ul className="space-y-0.5">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                          isActive(item.href)
                            ? 'bg-[#FFF0F7] text-[#E6007E] font-semibold'
                            : 'text-black hover:bg-black/5'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-black/10 bg-white safe-area-pb">
          <div className="flex justify-around">
            {ADMIN_MOBILE_BOTTOM_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-semibold ${
                  isActive(item.href) ? 'text-[#E6007E]' : 'text-black/55'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileNav;
