"use client";

import { useEffect, useState, useCallback } from "react";
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
import {
  ClientAppIntakeCard,
  ClientAppIntakeForm,
} from "@/components/client-app/ClientAppIntakeForm";

// ─── Design tokens ────────────────────────────────────────────────────────────
const PINK    = "#E6007E";
const PURPLE  = "#7B4FFF";
const BLUE    = "#4F9FFF";
const ORANGE  = "#F5A623";
const BG      = "#000000";
const CARD    = "#111111";
const CARD2   = "#1a1a1a";

// ─── Types ────────────────────────────────────────────────────────────────────

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type HomeData = {
  authenticated: boolean;
  firstName?: string | null;
  nextAppointment?: { id: string; startsAt: string; serviceName: string | null } | null;
  lastAppointment?: {
    id: string;
    startsAt: string;
    serviceName: string | null;
    daysSince: number | null;
  } | null;
  rewardPoints?: number;
  creditBalance?: number;
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as BeforeInstallPromptEvent); };
    const onInstalled = () => { setInstalled(true); setDeferred(null); };
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
    return () => { if (link && original) link.href = original; };
  }, []);
}

function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  useEffect(() => {
    fetch("/api/app/home-data")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ authenticated: false }));
  }, []);
  return data;
}

function usePushNotifications(authenticated: boolean) {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (typeof Notification === "undefined") { setPermission("unsupported"); return; }
    setPermission(Notification.permission);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/app-sw.js", { scope: "/" }).catch(() => {});
  }, []);

  const subscribe = useCallback(async () => {
    if (!authenticated || typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== "granted") return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
      const json = sub.toJSON();
      await fetch("/api/app/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });
      setSubscribed(true);
    } catch { /* silent */ }
  }, [authenticated]);

  return { permission, subscribed, subscribe };
}

function priceLabel(n: number) { return `$${n}`; }

function formatApptDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ClientApp({ initialTab = "home" }: { initialTab?: ClientAppTab }) {
  const [tab, setTab] = useState<ClientAppTab>(initialTab);
  const [selected, setSelected] = useState<VitaminShot | null>(null);
  const [showIntake, setShowIntake] = useState(false);
  const [intakeRefresh, setIntakeRefresh] = useState(0);
  const { canInstall, promptInstall } = useInstallPrompt();
  const homeData = useHomeData();
  const { permission, subscribed, subscribe } = usePushNotifications(homeData?.authenticated ?? false);
  useClientManifest();

  const showPushBanner = homeData?.authenticated && permission === "default" && !subscribed;

  return (
    <div className="min-h-screen pb-24 text-white" style={{ background: BG }}>

      {/* Header */}
      <header className="sticky top-0 z-30" style={{ background: BG, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="mx-auto max-w-xl px-5 pt-5 pb-4">
          <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: PINK }}>Oswego, IL</p>
          <h1 className="mt-1 font-serif text-2xl font-light text-white">{CLIENT_APP.name}</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{CLIENT_APP.tagline}</p>
          {canInstall && (
            <button
              type="button"
              onClick={() => void promptInstall()}
              className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
              style={{ background: PINK }}
            >
              ⤓ Add to home screen
            </button>
          )}
        </div>

        {/* Push opt-in banner */}
        {showPushBanner && (
          <div className="px-5 py-3 flex items-center justify-between gap-3"
            style={{ background: "linear-gradient(90deg, #E6007E22, #7B4FFF22)", borderTop: "1px solid rgba(230,0,126,0.2)" }}>
            <p className="text-xs text-white/70 leading-snug">Get notified about deals & appointment reminders</p>
            <button
              type="button"
              onClick={() => void subscribe()}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-white"
              style={{ background: PINK }}
            >
              Turn on
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-xl px-5">
        {showIntake ? (
          <ClientAppIntakeForm onBack={() => { setShowIntake(false); setIntakeRefresh(n => n + 1); }} />
        ) : (
          <>
            {tab === "home"       && <HomeTab onNavigate={setTab} onOpenIntake={() => setShowIntake(true)} intakeRefresh={intakeRefresh} homeData={homeData} />}
            {tab === "vitamin"    && <VitaminTab onSelect={setSelected} onOpenIntake={() => setShowIntake(true)} intakeRefresh={intakeRefresh} />}
            {tab === "membership" && <MembershipTab memberships={VITAMIN_MEMBERSHIPS} />}
            {tab === "visit"      && <VisitTab onOpenIntake={() => setShowIntake(true)} intakeRefresh={intakeRefresh} />}
            {tab === "me"         && <MeTab onOpenIntake={() => setShowIntake(true)} intakeRefresh={intakeRefresh} homeData={homeData} />}
          </>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="mx-auto grid max-w-xl grid-cols-5">
          {CLIENT_APP_TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors"
              style={{ color: tab === id ? PINK : "rgba(255,255,255,0.35)" }}
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

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab({ onNavigate, onOpenIntake, intakeRefresh, homeData }: {
  onNavigate: (t: ClientAppTab) => void;
  onOpenIntake: () => void;
  intakeRefresh: number;
  homeData: HomeData | null;
}) {
  const auth      = homeData?.authenticated;
  const firstName = homeData?.firstName;
  const next      = homeData?.nextAppointment;
  const last      = homeData?.lastAppointment;
  const points    = homeData?.rewardPoints ?? 0;
  const nudge     = last && last.daysSince != null && last.daysSince >= 70;

  return (
    <div className="py-5 space-y-4">
      <ClientAppIntakeCard onOpen={onOpenIntake} refreshKey={intakeRefresh} />

      {/* Hero card */}
      <div className="rounded-2xl p-5 overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #1a0a12 0%, #0d0020 60%, #000 100%)", border: "1px solid rgba(230,0,126,0.25)" }}>
        {/* Glow orbs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: PINK }} />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: PURPLE }} />

        <p className="relative text-[10px] uppercase tracking-widest font-bold" style={{ color: PINK }}>
          {auth && firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        </p>

        {next ? (
          <div className="relative mt-3 rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Your next appointment</p>
            <p className="mt-1 font-semibold text-white">{next.serviceName ?? "Appointment"}</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{formatApptDate(next.startsAt)}</p>
          </div>
        ) : (
          <p className="relative mt-2 text-lg font-semibold leading-snug text-white">
            Book, pre-pay, check in, and manage your care — all in one place.
          </p>
        )}

        {nudge && (
          <div className="relative mt-3 rounded-xl px-4 py-3" style={{ background: "rgba(230,0,126,0.12)", border: "1px solid rgba(230,0,126,0.3)" }}>
            <p className="text-sm font-semibold" style={{ color: "#FFB8DC" }}>
              👀 It&apos;s been {last!.daysSince} days since your last visit
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              {last!.serviceName ? `${last!.serviceName} typically needs a touch-up around now.` : "Time for a touch-up?"}
            </p>
          </div>
        )}

        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
          className="relative mt-4 block rounded-xl py-3.5 text-center text-sm font-bold text-white"
          style={{ background: `linear-gradient(90deg, ${PINK}, #c90070)` }}>
          {next ? "Book another appointment" : "Book an appointment"}
        </a>
      </div>

      {/* Rewards pill */}
      {auth && points > 0 && (
        <Link href="/portal/rewards"
          className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{ background: "rgba(230,0,126,0.1)", border: "1px solid rgba(230,0,126,0.25)" }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎁</span>
            <span className="text-sm font-semibold" style={{ color: PINK }}>{points} reward points</span>
          </div>
          <span className="text-xs" style={{ color: PINK }}>View →</span>
        </Link>
      )}

      {/* Sign-in prompt */}
      {!auth && homeData !== null && (
        <Link href="/portal/login?redirect=/app"
          className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{ background: CARD, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            <span className="text-sm font-medium text-white/70">Sign in to see your appointments & rewards</span>
          </div>
          <span className="text-xs" style={{ color: PINK }}>→</span>
        </Link>
      )}

      {/* Quick actions grid */}
      <div className="grid grid-cols-2 gap-3">
        {CLIENT_APP_QUICK_ACTIONS.map((a, i) => {
          const accentColors = [PINK, PURPLE, BLUE, ORANGE, PINK];
          const accent = accentColors[i % accentColors.length];
          const inner = (
            <>
              <span className="text-2xl">{a.icon}</span>
              <span className="mt-2 block font-bold text-sm text-white">{a.label}</span>
              <span className="mt-0.5 block text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>{a.blurb}</span>
            </>
          );
          const cardStyle = {
            background: CARD,
            border: `1px solid ${accent}33`,
          };

          if ("tab" in a && a.tab) {
            return (
              <button key={a.id} type="button" onClick={() => onNavigate(a.tab!)}
                className="rounded-2xl p-4 text-left transition active:scale-[0.98]"
                style={cardStyle}>
                {inner}
              </button>
            );
          }
          const href = "href" in a ? a.href : BOOKING_URL;
          if (href.startsWith("http")) {
            return (
              <a key={a.id} href={href} target="_blank" rel="noopener noreferrer"
                className="rounded-2xl p-4 text-left"
                style={cardStyle}>
                {inner}
              </a>
            );
          }
          return (
            <Link key={a.id} href={href} className="rounded-2xl p-4 text-left" style={cardStyle}>
              {inner}
            </Link>
          );
        })}
      </div>

      {/* Services list */}
      <section className="mt-4">
        <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          Our services
        </h2>
        <div className="space-y-2">
          {CLIENT_APP_SERVICES.map((s) => (
            <Link key={s.href} href={s.href}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-white transition"
              style={{ background: CARD, border: "1px solid rgba(255,255,255,0.07)" }}>
              {s.label}
              <span style={{ color: PINK }}>→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Vitamin Tab ──────────────────────────────────────────────────────────────

function VitaminTab({ onSelect, onOpenIntake, intakeRefresh }: {
  onSelect: (s: VitaminShot) => void;
  onOpenIntake: () => void;
  intakeRefresh: number;
}) {
  const groups = shotsByCategory();
  return (
    <div className="py-5">
      <ClientAppIntakeCard onOpen={onOpenIntake} refreshKey={intakeRefresh} />
      <p className="mb-4 mt-5 text-xs font-bold uppercase tracking-widest" style={{ color: PINK }}>
        The Vitamin Bar · drive-thru wellness
      </p>
      <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${PINK}33` }}>
        <p className="text-sm font-bold" style={{ color: PINK }}>{VITAMIN_BAR.driveThru.headline}</p>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{VITAMIN_BAR.driveThru.blurb}</p>
      </div>
      {groups.map((g) => (
        <section key={g.category} className="mt-7">
          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>{g.label}</h2>
          <div className="space-y-3">
            {g.shots.map((shot) => (
              <button key={shot.id} type="button" onClick={() => onSelect(shot)}
                className="flex w-full items-center gap-3 rounded-2xl p-4 text-left transition active:scale-[0.99]"
                style={{ background: CARD, border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-white">{shot.name}</span>
                    {shot.favorite && (
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                        style={{ background: `${PINK}22`, color: PINK }}>Popular</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{shot.benefit}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-bold" style={{ color: PINK }}>{priceLabel(shot.price)}</div>
                  {shot.memberPrice != null && (
                    <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
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

// ─── Shot Sheet ───────────────────────────────────────────────────────────────

function ShotSheet({ shot, onClose }: { shot: VitaminShot; onClose: () => void }) {
  const freshaUrl = shot.freshaUrl || BOOKING_URL;
  const [payBusy, setPayBusy] = useState(false);
  const [payErr, setPayErr] = useState<string | null>(null);

  async function prepay() {
    setPayErr(null); setPayBusy(true);
    try {
      const res = await fetch("/api/vitamin-bar/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: shot.id, kind: "shot" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) { window.location.href = data.url; return; }
      setPayErr("Couldn't start pre-pay. Pay at the window or call us.");
    } catch { setPayErr("Network error. Pay at the window or call us."); }
    finally { setPayBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70" onClick={onClose}>
      <div className="w-full max-w-xl rounded-t-3xl p-6 pb-8" style={{ background: "#181818" }} onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        <h3 className="text-lg font-bold text-white">{shot.name}</h3>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{shot.benefit}</p>
        <div className="mt-3 text-2xl font-black" style={{ color: PINK }}>{priceLabel(shot.price)}</div>
        <div className="mt-5 space-y-2.5">
          <button type="button" onClick={() => void prepay()} disabled={payBusy}
            className="block w-full rounded-xl py-3.5 font-bold text-white disabled:opacity-60"
            style={{ background: `linear-gradient(90deg, ${PINK}, #c90070)` }}>
            {payBusy ? "Starting checkout…" : `Pre-pay ${priceLabel(shot.price)} & reserve`}
          </button>
          {payErr && <p className="text-center text-xs text-red-400">{payErr}</p>}
          <a href={freshaUrl} target="_blank" rel="noopener noreferrer"
            className="block rounded-xl py-3.5 text-center font-bold"
            style={{ border: `2px solid ${PINK}`, color: PINK }}>
            Schedule a drive-thru time
          </a>
        </div>
        <button type="button" onClick={onClose} className="mt-3 w-full py-2 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Membership Tab ───────────────────────────────────────────────────────────

function MembershipTab({ memberships }: { memberships: VitaminMembership[] }) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function join(m: VitaminMembership) {
    setErr(null); setBusyId(m.id);
    try {
      const res = await fetch("/api/client-app/membership/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: m.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) { window.location.href = data.url; return; }
      setErr(data.error || "Could not start checkout. Call us to join.");
    } catch { setErr("Network error. Call us to join."); }
    finally { setBusyId(null); }
  }

  const accentColors = [PINK, PURPLE, BLUE, ORANGE];

  return (
    <div className="py-5">
      <h2 className="text-xl font-bold text-white">Memberships</h2>
      <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
        Monthly wellness plans — member pricing, skip-the-line drive-thru, and more.
      </p>
      {err && <p className="mt-3 rounded-xl px-3 py-2 text-xs text-red-400" style={{ background: "rgba(255,0,0,0.1)" }}>{err}</p>}
      <div className="mt-5 space-y-4">
        {memberships.map((m, i) => {
          const accent = accentColors[i % accentColors.length];
          return (
            <div key={m.id} className="rounded-2xl p-5"
              style={{ background: CARD, border: `2px solid ${m.highlight ? accent : "rgba(255,255,255,0.07)"}`,
                boxShadow: m.highlight ? `0 4px 24px ${accent}33` : "none" }}>
              {m.highlight && (
                <span className="mb-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase text-white"
                  style={{ background: accent }}>Most popular</span>
              )}
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-white">{m.name}</h3>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black" style={{ color: accent }}>${m.pricePerMonth}</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>/mo</span>
                </div>
              </div>
              <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{m.summary}</p>
              <ul className="mt-3 space-y-1.5">
                {m.perks.map((p) => (
                  <li key={p} className="flex gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span style={{ color: accent }}>✓</span>{p}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => void join(m)} disabled={busyId === m.id}
                className="mt-4 block w-full rounded-xl py-3.5 font-bold text-white disabled:opacity-60"
                style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }}>
                {busyId === m.id ? "Starting checkout…" : `Join ${m.name}`}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
        Billed monthly via Square. Cancel anytime — call {CLIENT_APP.phone}.
      </p>
    </div>
  );
}

// ─── Visit Tab ────────────────────────────────────────────────────────────────

function VisitTab({ onOpenIntake, intakeRefresh }: { onOpenIntake: () => void; intakeRefresh: number }) {
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setResult(null); setBusy(true);
    try {
      const res = await fetch("/api/public/checkin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setResult({ ok: false, text: data.error || "Could not check you in." }); return; }
      setResult({ ok: true, text: (data.message || "You're checked in!") + " We'll be right out." });
      setPhone("");
    } catch { setResult({ ok: false, text: "Network error. Try again or call us." }); }
    finally { setBusy(false); }
  }

  return (
    <div className="py-5 space-y-8">
      <ClientAppIntakeCard onOpen={onOpenIntake} refreshKey={intakeRefresh} />
      <section>
        <h2 className="text-xl font-bold text-white">Plan your visit</h2>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
          className="mt-4 block rounded-xl py-4 text-center font-bold text-white"
          style={{ background: `linear-gradient(90deg, ${PINK}, #c90070)` }}>
          Schedule online
        </a>
        <div className="mt-4 rounded-2xl p-4 text-sm" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="font-semibold text-white">{CLIENT_APP.address}</p>
          <p className="mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{CLIENT_APP.hoursNote}</p>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white">I&apos;m here</h2>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Curbside check-in for drive-thru shots or appointments.</p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile phone on file"
            className="w-full rounded-xl px-4 py-3.5 text-lg outline-none text-white placeholder-white/30"
            style={{ background: CARD, border: "2px solid rgba(255,255,255,0.1)" }}
            onFocus={(e) => e.target.style.borderColor = PINK}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
          <button type="submit" disabled={busy}
            className="w-full rounded-xl py-4 font-bold text-white disabled:opacity-50"
            style={{ background: `linear-gradient(90deg, ${PINK}, #c90070)` }}>
            {busy ? "Checking in…" : "Tap to check in"}
          </button>
        </form>
        {result && (
          <div className="mt-4 rounded-xl p-4 text-sm"
            style={{ background: result.ok ? "rgba(0,200,100,0.1)" : "rgba(255,50,50,0.1)",
              color: result.ok ? "#6ee7b7" : "#fca5a5", border: `1px solid ${result.ok ? "rgba(0,200,100,0.2)" : "rgba(255,50,50,0.2)"}` }}>
            {result.text}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Me Tab ───────────────────────────────────────────────────────────────────

function MeTab({ onOpenIntake, intakeRefresh, homeData }: {
  onOpenIntake: () => void;
  intakeRefresh: number;
  homeData: HomeData | null;
}) {
  return (
    <div className="py-5">
      <h2 className="text-xl font-bold text-white">
        {homeData?.firstName ? `Hey, ${homeData.firstName} ✨` : "Your account"}
      </h2>
      <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Portal, rewards, documents, and more.</p>

      {homeData?.rewardPoints != null && homeData.rewardPoints > 0 && (
        <div className="mt-4 rounded-xl px-4 py-4 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, ${PINK}22, ${PURPLE}22)`, border: `1px solid ${PINK}33` }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: PINK }}>Reward Points</p>
            <p className="text-3xl font-black" style={{ color: PINK }}>{homeData.rewardPoints}</p>
          </div>
          <Link href="/portal/rewards" className="text-xs font-bold underline underline-offset-2" style={{ color: PINK }}>
            View →
          </Link>
        </div>
      )}

      <div className="mt-5">
        <ClientAppIntakeCard onOpen={onOpenIntake} refreshKey={intakeRefresh} />
      </div>

      <div className="mt-5 space-y-2">
        {CLIENT_APP_PORTAL_LINKS.map((l) => (
          <Link key={l.href} href={l.href}
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 font-medium text-white transition"
            style={{ background: CARD, border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-xl">{l.icon}</span>
            {l.label}
            <span className="ml-auto" style={{ color: PINK }}>→</span>
          </Link>
        ))}
      </div>

      <a href={CLIENT_APP.phoneHref}
        className="mt-6 block rounded-xl py-3.5 text-center font-bold"
        style={{ border: `2px solid ${PINK}`, color: PINK }}>
        Call {CLIENT_APP.phone}
      </a>
    </div>
  );
}

/** @deprecated Use ClientApp */
export function VitaminBarApp() {
  return <ClientApp initialTab="vitamin" />;
}
