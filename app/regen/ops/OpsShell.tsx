'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { OPS_NAV, OPS_STAFF, getOpsStaff, type OpsStaffId } from '@/lib/regen/ops-staff';

const OpsStaffContext = createContext<ReturnType<typeof getOpsStaff>>(null);
export function useOpsStaff() {
  return useContext(OpsStaffContext);
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

  useEffect(() => {
    setStaffId(initialStaffId);
    if (initialStaffId) sessionStorage.setItem('regen-ops-staff', initialStaffId);
  }, [initialStaffId]);

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

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/95 border-b border-white/10 z-50 flex items-center justify-between px-4">
        <Link href="/ops" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold">R</div>
          <div>
            <h1 className="text-white font-bold leading-tight">REGEN RX</h1>
            <p className="text-teal-400/70 text-xs">Staff OS</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {OPS_NAV.map((item) => {
            const active = normalizedPath === item.href || (item.href !== '/ops' && normalizedPath.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  active ? 'bg-teal-500/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-white text-sm font-medium">{current.short}</p>
            <p className="text-white/40 text-xs">{current.role}</p>
          </div>
          <button
            onClick={() => {
              fetch('/api/regen/ops/session', { method: 'DELETE' });
              sessionStorage.removeItem('regen-ops-staff');
              setStaffId(null);
              router.refresh();
            }}
            className="text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </header>
      <nav className="md:hidden fixed top-16 left-0 right-0 z-40 bg-slate-900 border-b border-white/10 flex overflow-x-auto">
        {OPS_NAV.map((item) => (
          <Link key={item.href} href={item.href} className="px-4 py-3 text-sm text-white/70 whitespace-nowrap">
            {item.label}
          </Link>
        ))}
      </nav>
      <main className="pt-16 md:pt-16 min-h-screen">
        <div className="p-4 md:p-6 pt-16 md:pt-6 max-w-6xl mx-auto">
          <OpsStaffContext.Provider value={current}>{children}</OpsStaffContext.Provider>
        </div>
      </main>
    </div>
  );
}
