'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/AdminHeader';
import { ToastProvider } from '@/components/ui/Toast';
import { KeyboardShortcutsProvider } from '@/components/ui/KeyboardShortcuts';
import {
  ADMIN_MOBILE_BOTTOM_NAV,
  ADMIN_NAV_FLAT,
  ADMIN_NAV_GROUPS,
  type AdminNavGroup,
} from '@/lib/admin-nav';

type AdminRole = 'owner' | 'admin' | 'staff' | 'provider' | 'readonly' | null;

function visibleHrefs(role: AdminRole): Set<string> {
  if (!role) return new Set(ADMIN_NAV_FLAT.map((n) => n.href));
  const all = new Set(ADMIN_NAV_FLAT.map((n) => n.href));
  switch (role) {
    case 'owner':
    case 'admin':
      return all;
    case 'staff':
      all.delete('/admin/charting');
      all.delete('/admin/reports');
      return all;
    case 'provider':
      all.delete('/admin/memberships');
      all.delete('/admin/marketing');
      all.delete('/admin/reports');
      return all;
    case 'readonly':
      return new Set([
        '/admin',
        '/admin/calendar',
        '/admin/clients',
        '/admin/rx',
        '/admin/flowwave',
        '/admin/vendors',
        '/admin/settings',
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
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.commit && setBuildId(d.commit))
      .catch(() => {});
  }, []);
  if (!buildId) return null;
  return (
    <footer className="text-center py-2 text-xs text-black/50">
      Build {buildId.slice(0, 7)}
    </footer>
  );
}

function useAdminManifest() {
  useEffect(() => {
    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    const originalHref = manifestLink?.href;
    if (manifestLink) manifestLink.href = '/admin-manifest.json';
    const themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    const prevTheme = themeColor?.content;
    if (themeColor) themeColor.content = '#FF2D8E';
    return () => {
      if (manifestLink && originalHref) manifestLink.href = originalHref;
      if (themeColor && prevTheme) themeColor.content = prevTheme;
    };
  }, []);
}

function SidebarGroup({
  group,
  visible,
  isActive,
  collapsedOpen,
  onToggleCollapsed,
}: {
  group: AdminNavGroup;
  visible: Set<string>;
  isActive: (href: string) => boolean;
  collapsedOpen: boolean;
  onToggleCollapsed: () => void;
}) {
  const groupItems = group.items.filter((item) => visible.has(item.href));
  if (groupItems.length === 0) return null;

  if (group.collapsed) {
    const anyActive = groupItems.some((item) => isActive(item.href));
    return (
      <div className="mb-1">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={`w-full flex items-center justify-between px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest ${
            anyActive ? 'text-[#FF2D8E]' : 'text-white/40'
          } hover:text-white/70`}
        >
          <span>{group.section}</span>
          <span className="text-[11px]">{collapsedOpen ? '−' : '+'}</span>
        </button>
        {collapsedOpen &&
          groupItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive(item.href)
                  ? 'bg-[#FF2D8E] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
      </div>
    );
  }

  return (
    <div className="mb-1">
      <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
        {group.section}
      </p>
      {groupItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
            isActive(item.href)
              ? 'bg-[#FF2D8E] text-white font-semibold'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="text-base">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<AdminRole>(null);
  const [businessName, setBusinessName] = useState('Hello Gorgeous');
  const [collapsedOpen, setCollapsedOpen] = useState<Record<string, boolean>>({});

  useAdminManifest();

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => setRole(data?.role ?? null))
      .catch(() => setRole(null));
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const name = data?.settings?.business_name;
        if (name && typeof name === 'string') setBusinessName(name.trim() || 'Hello Gorgeous');
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setCollapsedOpen((prev) => {
      const next = { ...prev };
      for (const group of ADMIN_NAV_GROUPS) {
        if (!group.collapsed) continue;
        const onPage = group.items.some(
          (item) => item.href !== '/admin' && pathname.startsWith(item.href),
        );
        if (onPage) next[group.section] = true;
      }
      return next;
    });
  }, [pathname]);

  const toggleCollapsed = (section: string) => {
    setCollapsedOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const visible = visibleHrefs(role);

  // Command Center = dedicated portal shell (hide Admin chrome — like /rx-portal)
  const isCommandCenter =
    pathname === '/admin/command-center' || pathname.startsWith('/admin/command-center/');
  if (isCommandCenter) {
    return (
      <ToastProvider>
        <KeyboardShortcutsProvider>{children}</KeyboardShortcutsProvider>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <KeyboardShortcutsProvider>
        <div className="min-h-screen bg-[#FFF5F9] admin-panel text-[#111]">
          <AdminHeader />
          <div
            className="h-1.5 w-full"
            style={{
              background: 'linear-gradient(90deg, #FF2D8E 0%, #E6007E 55%, #9b0a4d 100%)',
            }}
          />
          <div className="flex">
            <aside className="w-60 bg-[#0a0a0a] text-white min-h-[calc(100vh-62px)] sticky top-[62px] hidden lg:flex lg:flex-col overflow-y-auto border-r border-white/10">
              <div className="px-4 pt-5 pb-3 border-b border-white/10">
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#FF2D8E]">
                  Hello Gorgeous
                </p>
                <p
                  className="mt-0.5 text-base font-black tracking-tight"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  Admin <span className="text-[#FF2D8E]">Hub</span>
                </p>
              </div>
              <div className="p-3 border-b border-white/10 space-y-0.5">
                <Link
                  href="/admin/command-center"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-semibold ${
                    pathname.startsWith('/admin/command-center')
                      ? 'bg-[#FF2D8E] text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">🎛️</span>
                  <span>Command Center</span>
                </Link>
                {showOwnerLink(role) && (
                  <Link
                    href="/admin/owner"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      pathname.startsWith('/admin/owner') && pathname !== '/admin/owner/manual'
                        ? 'bg-[#FF2D8E] text-white font-semibold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">👑</span>
                    <span>Owner</span>
                  </Link>
                )}
                <Link
                  href="/pos"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                    pathname.startsWith('/pos')
                      ? 'bg-[#FF2D8E] text-white font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">💳</span>
                  <span>POS</span>
                </Link>
                <Link
                  href="/rx-portal"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <span className="text-lg">💉</span>
                  <span>RX Portal</span>
                </Link>
              </div>
              <nav className="flex-1 py-2 px-2">
                {ADMIN_NAV_GROUPS.map((group) => (
                  <SidebarGroup
                    key={group.section}
                    group={group}
                    visible={visible}
                    isActive={isActive}
                    collapsedOpen={!!collapsedOpen[group.section]}
                    onToggleCollapsed={() => toggleCollapsed(group.section)}
                  />
                ))}
              </nav>
              <div className="p-3 border-t border-white/10">
                <Link
                  href="/admin/owner/manual"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <span className="text-base">📖</span>
                  <span>Manual</span>
                </Link>
              </div>
              <div className="p-3 border-t border-white/10 flex items-center gap-2">
                <span className="text-[#FF2D8E] text-sm">💗</span>
                <span className="text-xs text-white/55 font-medium truncate" title={businessName}>
                  {businessName}
                </span>
              </div>
            </aside>
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 z-40 safe-area-pb">
              <div className="flex justify-around items-center h-14 min-h-[56px] px-1">
                {ADMIN_MOBILE_BOTTOM_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-2 rounded-xl transition-all ${
                      isActive(item.href) ? 'text-[#FF2D8E] bg-white/10' : 'text-white/55'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[10px] font-semibold">{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
            <main
              className={`flex-1 w-full min-w-0 min-h-[calc(100vh-62px)] safe-area-pb ${
                pathname.startsWith('/admin/rx/ops') || pathname.startsWith('/admin/rx/portal')
                  ? 'bg-[#FFF5F9] p-0 pb-20 sm:pb-0 lg:pb-0'
                  : ['/admin/video-generator', '/admin/campaign-studio', '/admin/campaign-analytics'].some(
                      (p) => pathname.startsWith(p),
                    )
                    ? 'bg-black'
                    : 'bg-[#FFF5F9] p-4 sm:p-6 pb-20 sm:pb-6 lg:pb-6'
              }`}
            >
              {children}
            </main>
          </div>
          <AdminBuildId />
        </div>
      </KeyboardShortcutsProvider>
    </ToastProvider>
  );
}
