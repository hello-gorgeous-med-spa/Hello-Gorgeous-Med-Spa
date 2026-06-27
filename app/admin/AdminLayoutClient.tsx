'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/AdminHeader';
import { ToastProvider } from '@/components/ui/Toast';
import { KeyboardShortcutsProvider } from '@/components/ui/KeyboardShortcuts';

type AdminRole = 'owner' | 'admin' | 'staff' | 'provider' | 'readonly' | null;

type NavItem = { href: string; label: string; icon: string };
type NavGroup = { section: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    section: 'Daily Ops',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '📊' },
      { href: '/admin/calendar', label: 'Calendar', icon: '🗓' },
      { href: '/admin/appointments', label: 'Appointments', icon: '📅' },
      { href: '/admin/clients', label: 'Clients', icon: '👥' },
      { href: '/admin/scan', label: 'Scan Client', icon: '📷' },
    ],
  },
  {
    section: 'RX & Clinical',
    items: [
      { href: '/admin/rx', label: 'RX Command', icon: '🎯' },
      { href: '/admin/rx-dispatch', label: 'RX Dispatch', icon: '📤' },
      { href: '/admin/rx/pharmacy-orders', label: 'Pharmacy Orders', icon: '🧪' },
      { href: '/admin/rx/glp1-pricing', label: 'GLP-1 Pricing', icon: '📊' },
      { href: '/admin/rx-invoices', label: 'RX Invoices', icon: '💊' },
      { href: '/admin/rx-ledger', label: 'RX Ledger', icon: '📒' },
      { href: '/admin/rx-messages', label: 'RX Messages', icon: '💬' },
      { href: '/admin/rx/clinic-sale', label: 'Clinic Sale', icon: '🏥' },
      { href: '/admin/rx/clinic-reports', label: 'Clinic Reports', icon: '📋' },
      { href: '/admin/flowwave', label: 'FlowWave', icon: '🌊' },
      { href: '/admin/charting', label: 'Charting', icon: '🩺' },
      { href: '/admin/consents', label: 'Consents', icon: '✅' },
      { href: '/admin/prescriptions', label: 'Prescriptions', icon: '📝' },
      { href: '/admin/procedures/contour-lift', label: 'Contour / Quantum', icon: '⚡' },
    ],
  },
  {
    section: 'Business',
    items: [
      { href: '/admin/unit-bank', label: 'Unit Bank', icon: '💉' },
      { href: '/admin/memberships', label: 'Memberships', icon: '💎' },
      { href: '/admin/services', label: 'Services', icon: '✨' },
      { href: '/admin/gift-cards', label: 'Gift Cards', icon: '🎁' },
      { href: '/admin/packages', label: 'Packages', icon: '📦' },
    ],
  },
  {
    section: 'Marketing',
    items: [
      { href: '/admin/campaign-studio', label: 'AI Campaign Studio', icon: '🤖' },
      { href: '/admin/email-campaigns', label: 'Email Campaigns', icon: '📧' },
      { href: '/admin/sms', label: 'SMS', icon: '📱' },
      { href: '/admin/proposals', label: 'Proposals', icon: '📄' },
    ],
  },
  {
    section: 'System',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ],
  },
];

// Flat list for role-based visibility checks
const MAIN_NAV: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

const PMU_BROWS_NAV: { href: string; label: string; icon: string; external?: boolean }[] = [
  { href: '/admin/pmu-brows', label: 'PMU & Brows hub', icon: '💗' },
  { href: '/admin/tools/brow-mapping', label: 'Brow mapping tool', icon: '✏️' },
  { href: '/forms/brow-intake', label: 'Brow intake (client)', icon: '📋', external: true },
  { href: '/pre-post-care/microblading', label: 'Microblading pre/post', icon: '📄', external: true },
  { href: '/handouts/education/brow-consultation-packet.pdf', label: 'Consultation packet PDF', icon: '📑', external: true },
];

function pmuBrowsVisible(role: AdminRole): boolean {
  if (!role) return true;
  return role !== 'readonly';
}

function visibleHrefs(role: AdminRole): Set<string> {
  if (!role) return new Set(MAIN_NAV.map((n) => n.href));
  const all = new Set(MAIN_NAV.map((n) => n.href));
  if (pmuBrowsVisible(role)) {
    all.add('/admin/pmu-brows');
    all.add('/admin/tools/brow-mapping');
  }
  switch (role) {
    case 'owner':
    case 'admin':
      return all;
    case 'staff':
      all.delete('/admin/charting');
      all.delete('/admin/inventory');
      all.delete('/admin/staff');
      all.delete('/admin/reports');
      all.delete('/admin/content/site');
      return all;
    case 'provider':
      all.delete('/admin/memberships');
      all.delete('/admin/inventory');
      all.delete('/admin/marketing');
      all.delete('/admin/staff');
      all.delete('/admin/reports');
      all.delete('/admin/content/site');
      return all;
    case 'readonly':
      return new Set([
        '/admin',
        '/admin/calendar',
        '/admin/clients',
        '/admin/reports',
        '/admin/settings',
        '/admin/ai-concierge',
      ]);
    default:
      return all;
  }
}

function showOwnerLink(role: AdminRole): boolean {
  return role === 'owner' || role === 'admin';
}

function AdminBuildId() {
  const [buildId, setBuildId] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/build-id')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d?.commit && setBuildId(d.commit))
      .catch(() => {});
  }, []);
  if (!buildId) return null;
  return (
    <footer className="text-center py-2 text-xs text-black/50">
      Build: {buildId.slice(0, 7)}
    </footer>
  );
}

function useAdminManifest() {
  useEffect(() => {
    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    const originalHref = manifestLink?.href;
    if (manifestLink) {
      manifestLink.href = '/admin-manifest.json';
    }
    const themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (themeColor) themeColor.content = '#0f172a';
    return () => {
      if (manifestLink && originalHref) manifestLink.href = originalHref;
    };
  }, []);
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<AdminRole>(null);
  const [businessName, setBusinessName] = useState<string>('Your Med Spa');

  useAdminManifest();

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => setRole(data?.role ?? null))
      .catch(() => setRole(null));
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        const name = data?.settings?.business_name;
        if (name && typeof name === 'string') setBusinessName(name.trim() || 'Your Med Spa');
      })
      .catch(() => {});
  }, []);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const visible = visibleHrefs(role);
  const navItems = MAIN_NAV.filter((item) => visible.has(item.href));

  return (
    <ToastProvider>
      <KeyboardShortcutsProvider>
        <div className="min-h-screen bg-[#F3F7F8] admin-panel">
          <AdminHeader />
          <div className="flex">
            <aside className="w-56 bg-white min-h-[calc(100vh-56px)] sticky top-14 hidden lg:flex lg:flex-col overflow-y-auto shadow-sm border-r border-black/10">
              <div className="p-3 border-b border-black/10">
                {showOwnerLink(role) && (
                  <Link href="/admin/owner" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${pathname.startsWith('/admin/owner') && pathname !== '/admin/owner/manual' ? 'bg-black text-white font-medium' : 'text-black hover:bg-black/5'}`}>
                    <span className="text-lg">👑</span>
                    <span>Owner</span>
                  </Link>
                )}
                <Link href="/pos" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${showOwnerLink(role) ? 'mt-0.5' : ''} ${pathname.startsWith('/pos') ? 'bg-[#FF2D8E] text-white font-medium' : 'text-black hover:bg-black/5'}`}>
                  <span className="text-lg">💳</span>
                  <span>POS</span>
                </Link>
              </div>
              <nav className="flex-1 py-2 px-2">
                {NAV_GROUPS.map((group) => {
                  const groupItems = group.items.filter((item) => visible.has(item.href));
                  if (groupItems.length === 0) return null;
                  return (
                    <div key={group.section} className="mb-1">
                      <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-black/40">{group.section}</p>
                      {groupItems.map((item) => (
                        <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${isActive(item.href) ? 'bg-[#2D63A4] text-white font-medium' : 'text-black hover:bg-black/5'}`}>
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  );
                })}
                {pmuBrowsVisible(role) ? (
                  <>
                    <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-black/45">PMU &amp; brows</p>
                    {PMU_BROWS_NAV.map((item) =>
                      item.external ? (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-black hover:bg-black/5"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </a>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive(item.href) ? 'bg-[#2D63A4] text-white font-medium' : 'text-black hover:bg-black/5'}`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ),
                    )}
                  </>
                ) : null}
              </nav>
              <div className="p-3 border-t border-black/10">
                <Link href="/admin/owner/manual" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-black hover:bg-black/5">
                  <span className="text-base">📖</span>
                  <span>Owner&apos;s Manual</span>
                </Link>
              </div>
              <div className="p-3 border-t border-black/10 flex items-center justify-center gap-2">
                <span className="text-[#FF2D8E] text-sm">💗</span>
                <span className="text-xs text-black/70 font-medium truncate" title={businessName}>{businessName}</span>
              </div>
            </aside>
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 z-40 safe-area-pb shadow-[0_-1px_0_rgba(0,0,0,.06)]">
              <div className="flex justify-around items-center h-14 min-h-[56px] px-2">
                {[{ href: '/admin', icon: '📊', label: 'Home' }, { href: '/admin/calendar', icon: '🗓', label: 'Calendar' }, { href: '/admin/pmu-brows', icon: '💗', label: 'Brows' }, { href: '/admin/clients', icon: '👥', label: 'Clients' }, { href: '/pos', icon: '💳', label: 'POS' }].map((item) => (
                  <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-2 rounded-xl transition-all ${isActive(item.href) ? 'text-[#2D63A4] bg-black/5' : 'text-black hover:text-[#2D63A4]'}`}>
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
            <main className={`flex-1 w-full min-w-0 min-h-[calc(100vh-56px)] safe-area-pb ${
              ['/admin/video-generator', '/admin/campaign-studio', '/admin/campaign-analytics'].some(p => pathname.startsWith(p))
                ? 'bg-black'
                : 'bg-[#F3F7F8] p-4 sm:p-6 pb-20 sm:pb-6 lg:pb-6'
            }`}>
              {children}
            </main>
          </div>
          <AdminBuildId />
        </div>
      </KeyboardShortcutsProvider>
    </ToastProvider>
  );
}
