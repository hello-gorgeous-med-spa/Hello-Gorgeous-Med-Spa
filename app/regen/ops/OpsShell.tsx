'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { OPS_NAV_GROUPS, OPS_STAFF, getOpsStaff, type OpsStaffId } from '@/lib/regen/ops-staff';

const OpsStaffContext = createContext<ReturnType<typeof getOpsStaff>>(null);
export function useOpsStaff() {
  return useContext(OpsStaffContext);
}

function pathMatches(normalizedPath: string, href: string) {
  if (href === '/ops') return normalizedPath === '/ops' || normalizedPath === '';
  return normalizedPath === href || normalizedPath.startsWith(`${href}/`);
}

export default function OpsShell({
  initialStaffId,
  children,
}: {
  initialStaffId: OpsStaffId | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [staffId, setStaffId] = useState<string | null>(initialStaffId);
  const [pickId, setPickId] = useState<string>(initialStaffId || 'danielle');
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setStaffId(initialStaffId);
    if (initialStaffId) sessionStorage.setItem('regen-ops-staff', initialStaffId);
  }, [initialStaffId]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const current = getOpsStaff(staffId);

  const handleLogin = async (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();
    setSigningIn(true);
    setAuthError('');
    const res = await fetch('/api/regen/ops/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId: pickId, password: passInput }),
    });
    const json = await res.json();
    setSigningIn(false);
    if (!res.ok) {
      setAuthError(json.error || 'Invalid password');
      return;
    }
    sessionStorage.setItem('regen-ops-staff', json.staff.id);
    setStaffId(json.staff.id);
    setPassInput('');
    router.refresh();
  };

  const signOut = () => {
    fetch('/api/regen/ops/session', { method: 'DELETE' });
    sessionStorage.removeItem('regen-ops-staff');
    setStaffId(null);
    router.refresh();
  };

  if (!current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">REGEN RX</h1>
            <p className="text-teal-300/80">Your name is required. Approvals are audited.</p>
          </div>
          <form onSubmit={handleLogin} action="#" method="post" className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Who are you?</label>
              <div className="space-y-2">
                {OPS_STAFF.map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer ${
                      pickId === s.id ? 'border-teal-400 bg-teal-500/20' : 'border-white/20 bg-white/5'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ops-staff"
                      checked={pickId === s.id}
                      onChange={() => setPickId(s.id)}
                      className="sr-only"
                    />
                    <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-sm font-semibold`}>
                      {s.short[0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{s.name}</p>
                      <p className="text-white/50 text-xs">{s.role}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <p className="text-white/40 text-xs">{OPS_STAFF.find((s) => s.id === pickId)?.email}</p>
            <div>
              <label className="block text-sm text-white/70 mb-2">Your password</label>
              <input
                type="password"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Password for the person you selected"
                autoFocus
              />
            </div>
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="button"
              disabled={signingIn}
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold disabled:opacity-50"
            >
              {signingIn ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const normalizedPath = pathname.replace('/regen/ops', '/ops').replace('/regen', '');

  const sidebar = (
    <aside className="flex h-full w-64 flex-col bg-black border-r border-white/10">
      <Link href="/ops" className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold">R</div>
        <div>
          <h1 className="text-white font-bold leading-tight">REGEN RX</h1>
          <p className="text-teal-400/80 text-xs">Staff OS · Backend</p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {OPS_NAV_GROUPS.map((group) => (
          <div key={group.section} className="mb-5">
            <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-teal-400/80">{group.section}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathMatches(normalizedPath, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      active ? 'bg-teal-500 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="w-4 text-center text-xs opacity-80">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3 space-y-2">
        {current.id === 'danielle' && (
          <a
            href="https://hellogorgeousmedspa.com/admin/owner"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-amber-300 hover:bg-white/5"
          >
            HG Owner Control
          </a>
        )}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className={`w-8 h-8 rounded-full ${current.color} flex items-center justify-center text-white text-sm font-semibold`}>
            {current.short[0]}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{current.short}</p>
            <p className="text-white/40 text-xs">{current.role}</p>
          </div>
        </div>
        <button onClick={signOut} className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-white/5">
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:block">{sidebar}</div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <button className="absolute inset-0 bg-black/60" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full">{sidebar}</div>
        </div>
      )}

      <header className="fixed top-0 right-0 left-0 md:left-64 h-14 bg-slate-900/95 border-b border-white/10 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden rounded-lg px-3 py-2 text-white/80 bg-white/5"
            onClick={() => setSidebarOpen(true)}
          >
            Menu
          </button>
          <p className="text-white/50 text-sm">
            {current.role} view · {current.name}
          </p>
        </div>
        <Link href="/ops/analytics" className="text-teal-400 text-sm font-medium hover:text-teal-300">
          Dashboard
        </Link>
      </header>

      <main className="pt-14 md:pl-64 min-h-screen">
        <div className="p-4 md:p-6 max-w-6xl">
          <OpsStaffContext.Provider value={current}>{children}</OpsStaffContext.Provider>
        </div>
      </main>
    </div>
  );
}
