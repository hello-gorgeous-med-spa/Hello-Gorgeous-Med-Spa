'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/AdminHeader';
import { ToastProvider } from '@/components/ui/Toast';
import { KeyboardShortcutsProvider } from '@/components/ui/KeyboardShortcuts';

type AdminRole = 'owner' | 'admin' | 'staff' | 'provider' | 'readonly' | null;

const MAIN_NAV: { href: string; label: string; icon: string }[] = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/calendar', label: 'Calendar', icon: '🗓' },
  { href: '/admin/appointments', label: 'Appointments', icon: '📅' },
  { href: '/admin/clients', label: 'Clients', icon: '👥' },
  { href: '/admin/charting', label: 'Charting', icon: '📋' },
  { href: '/admin/procedures/contour-lift', label: 'Contour / Quantum', icon: '⚡' },
  { href: '/admin/services', label: 'Services', icon: '✨' },
  { href: '/admin/memberships', label: 'Memberships', icon: '💎' },
  { href: '/admin/inventory', label: 'Inventory', icon: '📦' },
  { href: '/admin/marketing', label: 'Marketing', icon: '📈' },
  { href: '/admin/campaign-studio', label: 'AI Campaign Studio', icon: '🤖' },
  { href: '/admin/campaign-analytics', label: 'Campaign Analytics', icon: '📊' },
  { href: '/admin/email-campaigns', label: 'Email Campaigns', icon: '📧' },
  { href: '/admin/marketing/blog-social', label: 'Blog → Social', icon: '📣' },
  { href: '/admin/marketing/post-social', label: 'Post to Social', icon: '📲' },
  { href: '/admin/video-generator', label: 'Video Generator', icon: '🎬' },
  { href: '/admin/staff', label: 'Staff', icon: '👤' },
  { href: '/admin/reports', label: 'Reports', icon: '📊' },
  { href: '/admin/content/site', label: 'Website / Content', icon: '📝' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

function visibleHrefs(role: AdminRole): Set<string> {
  if (!role) return new Set(MAIN_NAV.map((n) => n.href));
  const all = new Set(MAIN_NAV.map((n) => n.href));
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
      return new Set(['/admin', '/admin/calendar', '/admin/clients', '/admin/reports', '/admin/settings']);
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
              <nav className="flex-1 py-2 px-2 space-y-0.5">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive(item.href) ? 'bg-[#2D63A4] text-white font-medium' : 'text-black hover:bg-black/5'}`}>
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
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
                {[{ href: '/admin', icon: '📊', label: 'Home' }, { href: '/admin/calendar', icon: '🗓', label: 'Calendar' }, { href: '/admin/clients', icon: '👥', label: 'Clients' }, { href: '/pos', icon: '💳', label: 'POS' }].map((item) => (
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
