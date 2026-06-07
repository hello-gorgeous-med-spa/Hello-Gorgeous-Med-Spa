"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { BOOKING_URL } from "@/lib/flows";
import {
  CLIENT_APP,
  CLIENT_APP_PORTAL_LINKS,
  CLIENT_APP_QUICK_ACTIONS,
  CLIENT_APP_SERVICES,
  CLIENT_APP_TABS,
  type ClientAppTab,
} from "@/lib/client-app";
import {
  VITAMIN_BAR,
  VITAMIN_MEMBERSHIPS,
  shotsByCategory,
  type VitaminMembership,
  type VitaminShot,
} from "@/lib/vitamin-bar";

const PINK = "#E6007E";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return { canInstall: !!deferred && !installed, promptInstall };
}

function useClientManifest() {
  useEffect(() => {
    let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
    const original = link?.href;
    if (link) link.href = "/client-manifest.json";
    else {
      link = document.createElement("link");
      link.rel = "manifest";
      link.href = "/client-manifest.json";
      document.head.appendChild(link);
    }
    return () => {
      if (link && original) link.href = original;
    };
  }, []);
}

function priceLabel(n: number) {
  return `$${n}`;
}

export function ClientApp({ initialTab = "home" }: { initialTab?: ClientAppTab }) {
  const [tab, setTab] = useState<ClientAppTab>(initialTab);
  const [selected, setSelected] = useState<VitaminShot | null>(null);
  const { canInstall, promptInstall } = useInstallPrompt();
  useClientManifest();

  return (
    <div className="min-h-screen bg-[#faf7f9] text-black pb-24">
      <header className="sticky top-0 z-30 bg-black text-white">
        <div className="mx-auto max-w-xl px-5 pt-5 pb-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#FFB8DC]">Oswego, IL</p>
          <h1 className="mt-1 font-serif text-2xl font-light">{CLIENT_APP.name}</h1>
          <p className="text-sm text-white/60">{CLIENT_APP.tagline}</p>
          {canInstall && (
            <button
              type="button"
              onClick={() => void promptInstall()}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#E6007E] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
            >
              ⤓ Add to home screen
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5">
        {tab === "home" && <HomeTab onNavigate={setTab} />}
        {tab === "vitamin" && <VitaminTab onSelect={setSelected} />}
        {tab === "membership" && <MembershipTab memberships={VITAMIN_MEMBERSHIPS} />}
        {tab === "visit" && <VisitTab />}
        {tab === "me" && <MeTab />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/10 bg-white">
        <div className="mx-auto grid max-w-xl grid-cols-5">
          {CLIENT_APP_TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold ${
                tab === id ? "text-[#E6007E]" : "text-black/45"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span className="truncate max-w-[4.5rem]">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {selected && <ShotSheet shot={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function HomeTab({ onNavigate }: { onNavigate: (t: ClientAppTab) => void }) {
  return (
    <div className="py-5">
      <div className="rounded-2xl border-2 border-black bg-gradient-to-br from-[#1a0a12] to-black p-5 text-white shadow-[4px_4px_0_0_rgba(230,0,126,0.35)]">
        <p className="text-xs uppercase tracking-wider text-[#FFB8DC]">Welcome back</p>
        <p className="mt-2 text-lg font-semibold leading-snug">
          Book, pre-pay, check in, and manage your care — all in one place.
        </p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-xl bg-[#E6007E] py-3.5 text-center text-sm font-bold text-white"
        >
          Book an appointment
        </a>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {CLIENT_APP_QUICK_ACTIONS.map((a) => {
          const inner = (
            <>
              <span className="text-2xl">{a.icon}</span>
              <span className="mt-2 block font-bold text-sm">{a.label}</span>
              <span className="mt-0.5 block text-[11px] text-black/55">{a.blurb}</span>
            </>
          );
          if ("tab" in a && a.tab) {
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onNavigate(a.tab!)}
                className={`rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                  "accent" in a && a.accent
                    ? "border-[#E6007E] bg-[#FFF0F7]"
                    : "border-black/10 bg-white"
                }`}
              >
                {inner}
              </button>
            );
          }
          return (
            <a
              key={a.id}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-[#E6007E] bg-[#FFF0F7] p-4 text-left"
            >
              {inner}
            </a>
          );
        })}
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-black/50">
          Our services
        </h2>
        <div className="space-y-2">
          {CLIENT_APP_SERVICES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium hover:border-[#E6007E]/40"
            >
              {s.label}
              <span className="text-[#E6007E]">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function VitaminTab({ onSelect }: { onSelect: (s: VitaminShot) => void }) {
  const groups = shotsByCategory();
  return (
    <div className="py-5">
      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#E6007E]">
        The Vitamin Bar · drive-thru wellness
      </p>
      <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]">
        <p className="text-sm font-bold text-[#E6007E]">{VITAMIN_BAR.driveThru.headline}</p>
        <p className="mt-1 text-sm text-black/70">{VITAMIN_BAR.driveThru.blurb}</p>
      </div>
      {groups.map((g) => (
        <section key={g.category} className="mt-7">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-black/50">{g.label}</h2>
          <div className="space-y-3">
            {g.shots.map((shot) => (
              <button
                key={shot.id}
                type="button"
                onClick={() => onSelect(shot)}
                className="flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-white p-4 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">{shot.name}</span>
                    {shot.favorite && (
                      <span className="shrink-0 rounded-full bg-[#FFF0F7] px-2 py-0.5 text-[9px] font-bold uppercase text-[#E6007E]">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-black/60">{shot.benefit}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-bold text-[#E6007E]">{priceLabel(shot.price)}</div>
                  {shot.memberPrice != null && (
                    <div className="text-[10px] text-black/40">
                      {priceLabel(shot.memberPrice)} member
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ShotSheet({ shot, onClose }: { shot: VitaminShot; onClose: () => void }) {
  const freshaUrl = shot.freshaUrl || BOOKING_URL;
  const [payBusy, setPayBusy] = useState(false);
  const [payErr, setPayErr] = useState<string | null>(null);

  async function prepay() {
    setPayErr(null);
    setPayBusy(true);
    try {
      const res = await fetch("/api/vitamin-bar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: shot.id, kind: "shot" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setPayErr("Couldn't start pre-pay. Pay at the window or call us.");
    } catch {
      setPayErr("Network error. Pay at the window or call us.");
    } finally {
      setPayBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-t-3xl bg-white p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-black/15" />
        <h3 className="text-lg font-bold">{shot.name}</h3>
        <p className="mt-1 text-sm text-black/65">{shot.benefit}</p>
        <div className="mt-3 text-2xl font-black text-[#E6007E]">{priceLabel(shot.price)}</div>
        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={() => void prepay()}
            disabled={payBusy}
            className="block w-full rounded-xl bg-[#E6007E] py-3.5 font-bold text-white disabled:opacity-60"
          >
            {payBusy ? "Starting checkout…" : `Pre-pay ${priceLabel(shot.price)} & reserve`}
          </button>
          {payErr && <p className="text-center text-xs text-red-600">{payErr}</p>}
          <a
            href={freshaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border-2 border-[#E6007E] py-3.5 text-center font-bold text-[#E6007E]"
          >
            Schedule a drive-thru time
          </a>
        </div>
        <button type="button" onClick={onClose} className="mt-3 w-full py-2 text-sm text-black/45">
          Close
        </button>
      </div>
    </div>
  );
}

function MembershipTab({ memberships }: { memberships: VitaminMembership[] }) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function join(m: VitaminMembership) {
    setErr(null);
    setBusyId(m.id);
    try {
      const res = await fetch("/api/client-app/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: m.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setErr(data.error || "Could not start checkout. Call us to join.");
    } catch {
      setErr("Network error. Call us to join.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="py-5">
      <h2 className="text-xl font-bold">Memberships</h2>
      <p className="mt-1 text-sm text-black/60">
        Monthly wellness plans — member pricing, skip-the-line drive-thru, and more.
      </p>
      {err && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{err}</p>}
      <div className="mt-5 space-y-4">
        {memberships.map((m) => (
          <div
            key={m.id}
            className={`rounded-2xl border-2 p-5 ${
              m.highlight ? "border-[#E6007E] shadow-[5px_5px_0_0_rgba(230,0,126,0.3)]" : "border-black/10"
            } bg-white`}
          >
            {m.highlight && (
              <span className="mb-2 inline-block rounded-full bg-[#E6007E] px-3 py-0.5 text-[10px] font-bold uppercase text-white">
                Most popular
              </span>
            )}
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-lg font-bold">{m.name}</h3>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black text-[#E6007E]">${m.pricePerMonth}</span>
                <span className="text-sm text-black/45">/mo</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-black/70">{m.summary}</p>
            <ul className="mt-3 space-y-1.5">
              {m.perks.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-black/75">
                  <span className="text-[#E6007E]">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => void join(m)}
              disabled={busyId === m.id}
              className="mt-4 block w-full rounded-xl bg-[#E6007E] py-3.5 font-bold text-white disabled:opacity-60"
            >
              {busyId === m.id ? "Starting checkout…" : `Join ${m.name}`}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-black/45">
        Billed monthly via Square. Cancel anytime — call {CLIENT_APP.phone}.
      </p>
    </div>
  );
}

function VisitTab() {
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setBusy(true);
    try {
      const res = await fetch("/api/public/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ ok: false, text: data.error || "Could not check you in." });
        return;
      }
      setResult({
        ok: true,
        text: (data.message || "You're checked in!") + " We'll be right out.",
      });
      setPhone("");
    } catch {
      setResult({ ok: false, text: "Network error. Try again or call us." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="py-5 space-y-8">
      <section>
        <h2 className="text-xl font-bold">Plan your visit</h2>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-xl bg-[#E6007E] py-4 text-center font-bold text-white"
        >
          Schedule online
        </a>
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4 text-sm">
          <p className="font-semibold">{CLIENT_APP.address}</p>
          <p className="mt-1 text-black/60">{CLIENT_APP.hoursNote}</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">I&apos;m here</h2>
        <p className="mt-1 text-sm text-black/60">Curbside check-in for drive-thru shots or appointments.</p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile phone on file"
            className="w-full rounded-xl border-2 border-black/15 px-4 py-3.5 text-lg outline-none focus:border-[#E6007E]"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl py-4 font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: PINK }}
          >
            {busy ? "Checking in…" : "Tap to check in"}
          </button>
        </form>
        {result && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm ${
              result.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
            }`}
          >
            {result.text}
          </div>
        )}
      </section>
    </div>
  );
}

function MeTab() {
  return (
    <div className="py-5">
      <h2 className="text-xl font-bold">Your account</h2>
      <p className="mt-1 text-sm text-black/60">Portal, rewards, documents, and more.</p>
      <div className="mt-5 space-y-2">
        {CLIENT_APP_PORTAL_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3.5 font-medium hover:border-[#E6007E]/40"
          >
            <span className="text-xl">{l.icon}</span>
            {l.label}
            <span className="ml-auto text-[#E6007E]">→</span>
          </Link>
        ))}
      </div>
      <a
        href={CLIENT_APP.phoneHref}
        className="mt-6 block rounded-xl border-2 border-[#E6007E] py-3.5 text-center font-bold text-[#E6007E]"
      >
        Call {CLIENT_APP.phone}
      </a>
    </div>
  );
}

/** @deprecated Use ClientApp — kept for imports that still reference VitaminBarApp */
export function VitaminBarApp() {
  return <ClientApp initialTab="vitamin" />;
}
