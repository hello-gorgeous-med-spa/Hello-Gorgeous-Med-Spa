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
  CLIENT_APP_WELLNESS_PROGRAMS,
  type ClientAppTab,
} from "@/lib/client-app";
import { getActiveDeals, type AppDeal } from "@/lib/app-deals";
import { getTierForVisits, getVisitsToNextTier } from "@/lib/loyalty-tiers";
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
import { BrandHero } from "@/components/BrandHero";
import {
  TRIFECTA_GLASS,
  TRIFECTA_GRADIENT_TITLE,
  trifectaAccent,
  trifectaButtonGradient,
} from "@/lib/trifecta-tokens";

const BG = "#000000";

function glassStyle(accentIndex: number) {
  const accent = trifectaAccent(accentIndex);
  return {
    backgroundColor: TRIFECTA_GLASS.bg,
    border: `1px solid ${accent.border}`,
  } as const;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type HomeData = {
  authenticated: boolean;
  firstName?: string | null;
  totalVisits?: number;
  nextAppointment?: { id: string; startsAt: string; serviceName: string | null } | null;
  lastAppointment?: {
    id: string;
    startsAt: string;
    serviceName: string | null;
    daysSince: number | null;
  } | null;
  rewardPoints?: number;
  creditBalance?: number;
  birthdayInDays?: number | null;
  isBirthday?: boolean;
  referralCode?: string | null;
  referralUses?: number;
  referralCreditsEarned?: number;
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
    <div className="relative min-h-screen pb-24 text-white" style={{ background: BG }}>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full blur-[100px]" style={{ backgroundColor: "rgba(236, 72, 153, 0.1)" }} />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full blur-[100px]" style={{ backgroundColor: "rgba(59, 130, 246, 0.08)" }} />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-[120px]" style={{ backgroundColor: "rgba(245, 158, 11, 0.05)" }} />
      </div>

      {(tab !== "home" || showPushBanner) && (
      <header className="sticky top-0 z-30 backdrop-blur-md" style={{ background: "rgba(0,0,0,0.85)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="mx-auto max-w-xl px-5 pt-4 pb-3">
          {tab !== "home" && (
            <>
              <div
                className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f472b6" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: "#ec4899" }} />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#ec4899" }} />
                </span>
                Oswego, IL
              </div>
              <h1 className="font-serif text-2xl font-light text-white">
                Hello Gorgeous{" "}
                <span className="bg-clip-text font-semibold text-transparent" style={{ backgroundImage: TRIFECTA_GRADIENT_TITLE }}>
                  App
                </span>
              </h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{CLIENT_APP.tagline}</p>
            </>
          )}
          {canInstall && tab !== "home" && (
            <button
              type="button"
              onClick={() => void promptInstall()}
              className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-110"
              style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}
            >
              ⤓ Add to home screen
            </button>
          )}
        </div>

        {/* Push opt-in banner */}
        {showPushBanner && (
          <div
            className="flex items-center justify-between gap-3 px-5 py-3"
            style={{ background: "linear-gradient(90deg, rgba(236,72,153,0.12), rgba(59,130,246,0.12))", borderTop: "1px solid rgba(236, 72, 153, 0.2)" }}
          >
            <p className="text-xs leading-snug text-white/70">Get notified about deals & appointment reminders</p>
            <button
              type="button"
              onClick={() => void subscribe()}
              className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold text-white"
              style={{ background: trifectaButtonGradient(trifectaAccent(1)) }}
            >
              Turn on
            </button>
          </div>
        )}
      </header>
      )}

      <main className="mx-auto max-w-xl px-5">
        {showIntake ? (
          <ClientAppIntakeForm onBack={() => { setShowIntake(false); setIntakeRefresh(n => n + 1); }} />
        ) : (
          <>
            {tab === "home"       && <HomeTab onNavigate={setTab} onOpenIntake={() => setShowIntake(true)} intakeRefresh={intakeRefresh} homeData={homeData} canInstall={canInstall} promptInstall={promptInstall} />}
            {tab === "vitamin"    && <VitaminTab onSelect={setSelected} onOpenIntake={() => setShowIntake(true)} intakeRefresh={intakeRefresh} />}
            {tab === "deals"      && <DealsTab />}
            {tab === "membership" && <MembershipTab memberships={VITAMIN_MEMBERSHIPS} />}
            {tab === "me"         && <MeTab onOpenIntake={() => setShowIntake(true)} intakeRefresh={intakeRefresh} homeData={homeData} />}
          </>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md" style={{ background: "rgba(10,10,10,0.92)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="mx-auto grid max-w-xl grid-cols-5">
          {CLIENT_APP_TABS.map(({ id, label, icon }, index) => {
            const accent = trifectaAccent(index % 3);
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors"
                style={{
                  color: active ? accent.subtitle : "rgba(255,255,255,0.35)",
                  borderTop: active ? `2px solid ${accent.bullet}` : "2px solid transparent",
                }}
              >
                <span className="text-base leading-none">{icon}</span>
                <span className="max-w-[4.5rem] truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {selected && <ShotSheet shot={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab({ onNavigate, onOpenIntake, intakeRefresh, homeData, canInstall, promptInstall }: {
  onNavigate: (t: ClientAppTab) => void;
  onOpenIntake: () => void;
  intakeRefresh: number;
  homeData: HomeData | null;
  canInstall: boolean;
  promptInstall: () => Promise<void>;
}) {
  const auth           = homeData?.authenticated;
  const firstName      = homeData?.firstName;
  const next           = homeData?.nextAppointment;
  const last           = homeData?.lastAppointment;
  const points         = homeData?.rewardPoints ?? 0;
  const nudge          = last && last.daysSince != null && last.daysSince >= 70;
  const birthdayInDays = homeData?.birthdayInDays ?? null;
  const isBirthday     = homeData?.isBirthday ?? false;
  const nearBirthday   = auth && birthdayInDays != null && birthdayInDays <= 30;
  const totalVisits    = homeData?.totalVisits ?? 0;
  const tier           = auth ? getTierForVisits(totalVisits) : null;
  const visitsToNext   = auth ? getVisitsToNextTier(totalVisits) : null;

  return (
    <div className="space-y-4">
      <div className="-mx-5 border-b border-white/10">
        <BrandHero
          variant="app"
          authenticated={auth}
          firstName={firstName}
          onNavigate={onNavigate}
        />
        {canInstall && (
          <div className="mx-auto max-w-xl px-3 pb-3">
            <button
              type="button"
              onClick={() => void promptInstall()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-110"
              style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}
            >
              ⤓ Add to home screen
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4 py-1">
      <ClientAppIntakeCard onOpen={onOpenIntake} refreshKey={intakeRefresh} />

      {/* Next appointment / touch-up nudge */}
      {(next || nudge) && (
        <div className="rounded-2xl p-4 backdrop-blur-sm" style={glassStyle(0)}>
          {next ? (
            <div className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Your next appointment</p>
              <p className="mt-1 font-semibold text-white">{next.serviceName ?? "Appointment"}</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{formatApptDate(next.startsAt)}</p>
            </div>
          ) : null}

          {nudge && (
            <div className={`rounded-xl px-4 py-3 ${next ? "mt-3" : ""}`} style={{ background: "rgba(230,0,126,0.12)", border: "1px solid rgba(230,0,126,0.3)" }}>
              <p className="text-sm font-semibold" style={{ color: "#FFB8DC" }}>
                👀 It&apos;s been {last!.daysSince} days since your last visit
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                {last!.serviceName ? `${last!.serviceName} typically needs a touch-up around now.` : "Time for a touch-up?"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Loyalty tier badge */}
      {tier && (
        <div className="rounded-2xl p-4 overflow-hidden relative"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${tier.borderColor}` }}>
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: tier.color }} />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{tier.emoji}</span>
                <span className="text-sm font-bold" style={{ color: tier.color }}>{tier.name}</span>
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                {totalVisits} visit{totalVisits !== 1 ? "s" : ""} with Hello Gorgeous
                {visitsToNext ? ` · ${visitsToNext} more to unlock next tier` : " · You've reached the top! 💎"}
              </p>
            </div>
            <div className="shrink-0 w-16 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full" style={{
                background: tier.gradient,
                width: visitsToNext
                  ? `${Math.min(100, ((totalVisits % 10) / 10) * 100)}%`
                  : "100%"
              }} />
            </div>
          </div>
          {tier.id !== "platinum" && (
            <div className="relative mt-2 flex gap-1 flex-wrap">
              {tier.perks.slice(0, 2).map((p) => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}>
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rewards pill */}
      {auth && points > 0 && (
        <Link href="/portal/rewards"
          className="flex items-center justify-between rounded-xl px-4 py-3 backdrop-blur-sm"
          style={glassStyle(0)}>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎁</span>
            <span className="text-sm font-semibold" style={{ color: trifectaAccent(0).subtitle }}>{points} reward points</span>
          </div>
          <span className="text-xs" style={{ color: trifectaAccent(0).subtitle }}>View →</span>
        </Link>
      )}

      {/* Birthday card */}
      {nearBirthday && (
        <div className="rounded-2xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #1a0020, #0a0010)", border: "1px solid rgba(245,158,11,0.4)" }}>
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#f59e0b" }} />
          <div className="p-4 relative">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{isBirthday ? "🎂" : "🎁"}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#fbbf24" }}>
                {isBirthday ? "Happy Birthday!" : `Birthday in ${birthdayInDays} day${birthdayInDays === 1 ? "" : "s"}`}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">
              {isBirthday ? `Happy Birthday, ${firstName ?? "gorgeous"}! 🎉` : `${firstName ? `${firstName}, your` : "Your"} birthday treat is waiting`}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              {isBirthday
                ? "Enjoy 15% off any treatment this month — just mention it at checkout."
                : "Book before your birthday and get 15% off any treatment as our gift to you."}
            </p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-block rounded-xl px-4 py-2 text-xs font-bold text-white"
              style={{ background: "linear-gradient(90deg, #f59e0b, #f97316)" }}>
              {isBirthday ? "Claim birthday treat →" : "Book my birthday treat →"}
            </a>
          </div>
        </div>
      )}

      {/* Sign-in prompt */}
      {!auth && homeData !== null && (
        <Link href="/portal/login?redirect=/app"
          className="flex items-center justify-between rounded-xl px-4 py-3 backdrop-blur-sm"
          style={glassStyle(1)}>
          <div className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            <span className="text-sm font-medium text-white/70">Sign in to see your appointments & rewards</span>
          </div>
          <span className="text-xs" style={{ color: trifectaAccent(1).subtitle }}>→</span>
        </Link>
      )}

      {/* Quick actions grid */}
      <div className="grid grid-cols-2 gap-3">
        {CLIENT_APP_QUICK_ACTIONS.map((a, i) => {
          const accent = trifectaAccent(i % 3);
          const inner = (
            <>
              <span className="text-2xl">{a.icon}</span>
              <span className="mt-2 block text-sm font-bold text-white">{a.label}</span>
              <span className="mt-0.5 block text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>{a.blurb}</span>
            </>
          );
          const cardStyle = glassStyle(i % 3);

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

      {/* Wellness Programs */}
      <WellnessSection />

      {/* Services list */}
      <section className="mt-4">
        <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          All services
        </h2>
        <div className="space-y-2">
          {CLIENT_APP_SERVICES.map((s, i) => (
            <Link key={s.href} href={s.href}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-white transition backdrop-blur-sm"
              style={glassStyle(i % 3)}>
              {s.label}
              <span style={{ color: trifectaAccent(i % 3).subtitle }}>→</span>
            </Link>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}

// ─── Wellness Programs Section ────────────────────────────────────────────────

function WellnessSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="mt-4">
      <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
        Wellness Programs
      </h2>
      <div className="space-y-3">
        {CLIENT_APP_WELLNESS_PROGRAMS.map((p) => {
          const accent = trifectaAccent(p.accentIndex);
          const isOpen = expanded === p.id;
          return (
            <div key={p.id} className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${accent.border}` }}>

              {/* Card header — always visible */}
              <button
                type="button"
                className="w-full text-left p-4"
                onClick={() => setExpanded(isOpen ? null : p.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
                        style={{ background: accent.badgeBg }}>
                        {p.badge}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accent.subtitle }}>
                        {p.subtitle}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{p.label}</h3>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {p.blurb}
                    </p>
                  </div>
                  <span className="text-lg mt-1 transition-transform duration-200 shrink-0"
                    style={{ color: accent.subtitle, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                    ⌄
                  </span>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="mb-3 space-y-1.5">
                    {p.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                        <span className="text-xs" style={{ color: accent.bullet }}>●</span>
                        {h}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {p.learnHref.startsWith("http") ? (
                      <a href={p.learnHref} target="_blank" rel="noopener noreferrer"
                        className="flex-1 rounded-xl py-2.5 text-center text-sm font-semibold text-white"
                        style={{ background: `linear-gradient(90deg, ${accent.buttonFrom}, ${accent.buttonTo})` }}>
                        {p.id === "fullscript" ? "Open Store →" : "Learn More →"}
                      </a>
                    ) : (
                      <Link href={p.learnHref}
                        className="flex-1 rounded-xl py-2.5 text-center text-sm font-semibold text-white"
                        style={{ background: `linear-gradient(90deg, ${accent.buttonFrom}, ${accent.buttonTo})` }}>
                        Learn More →
                      </Link>
                    )}
                    {p.bookHref.startsWith("http") ? (
                      <a href={p.bookHref} target="_blank" rel="noopener noreferrer"
                        className="flex-1 rounded-xl py-2.5 text-center text-sm font-semibold"
                        style={{ border: `1px solid ${accent.border}`, color: accent.subtitle }}>
                        {p.id === "fullscript" ? "Shop Now" : "Get Started"}
                      </a>
                    ) : (
                      <Link href={p.bookHref}
                        className="flex-1 rounded-xl py-2.5 text-center text-sm font-semibold"
                        style={{ border: `1px solid ${accent.border}`, color: accent.subtitle }}>
                        Get Started
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Deals Tab ───────────────────────────────────────────────────────────────

function DealsTab() {
  const deals = getActiveDeals();
  const [gcOpen, setGcOpen] = useState(false);

  return (
    <div className="py-5">
      {/* Header */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-2"
          style={{ background: "rgba(230,0,126,0.15)", color: "#f472b6", border: "1px solid rgba(230,0,126,0.25)" }}>
          🔒 App Members Only
        </div>
        <h2 className="text-xl font-bold text-white">Exclusive Deals</h2>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Special offers only available in the Hello Gorgeous app.
        </p>
      </div>

      {/* Gift Card CTA */}
      <button type="button" onClick={() => setGcOpen(true)}
        className="w-full mb-5 rounded-2xl p-4 text-left"
        style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.1))", border: "1px solid rgba(245,158,11,0.3)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#fbbf24" }}>Gift Someone Special</p>
            <p className="font-bold text-white">Buy a Gift Card</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>$25 · $50 · $100 · $150 · $200 — via Square</p>
          </div>
          <span className="text-3xl">🎁</span>
        </div>
      </button>

      {/* Deal cards */}
      <div className="space-y-4">
        {deals.map((deal) => {
          const accent = trifectaAccent(deal.accentIndex);
          return (
            <div key={deal.id} className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${accent.border}` }}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white mr-2"
                      style={{ background: accent.badgeBg }}>
                      {deal.badge}
                    </span>
                    {deal.savings && (
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
                        {deal.savings}
                      </span>
                    )}
                  </div>
                  {deal.expires && (
                    <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Exp {new Date(deal.expires).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">{deal.title}</h3>
                <p className="text-xs font-semibold mt-0.5" style={{ color: accent.subtitle }}>{deal.subtitle}</p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{deal.description}</p>
                <Link href={deal.href}
                  className="mt-3 inline-block rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                  style={{ background: `linear-gradient(90deg, ${accent.buttonFrom}, ${accent.buttonTo})` }}>
                  {deal.cta} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {deals.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-4xl mb-3">🌟</p>
          <p className="font-semibold text-white">New deals coming soon</p>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Turn on notifications so you never miss one.</p>
        </div>
      )}

      {gcOpen && <GiftCardModal onClose={() => setGcOpen(false)} />}
    </div>
  );
}

// ─── Gift Card Modal ──────────────────────────────────────────────────────────

const GC_AMOUNTS = [25, 50, 75, 100, 150, 200];

function GiftCardModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState<number>(50);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function checkout() {
    setErr(null); setBusy(true);
    try {
      const res = await fetch("/api/app/gift-card/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) { window.location.href = data.url; return; }
      setErr(data.error || "Could not start checkout. Call us to purchase.");
    } catch { setErr("Network error. Try again or call us."); }
    finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70" onClick={onClose}>
      <div className="w-full max-w-xl rounded-t-3xl p-6 pb-10"
        style={{ background: "#181818" }} onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        <h3 className="text-xl font-bold text-white">Buy a Gift Card</h3>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Redeemable for any service or product. Delivered via Square — recipient gets an email.
        </p>

        {/* Amount picker */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {GC_AMOUNTS.map((a) => (
            <button key={a} type="button" onClick={() => setAmount(a)}
              className="rounded-xl py-3 text-sm font-bold transition"
              style={{
                background: amount === a ? "linear-gradient(90deg, #f59e0b, #f97316)" : "rgba(255,255,255,0.06)",
                color: amount === a ? "#fff" : "rgba(255,255,255,0.6)",
                border: amount === a ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}>
              ${a}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-xl px-4 py-3 flex items-center justify-between"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}>
          <span className="text-sm text-white/70">Gift card value</span>
          <span className="text-xl font-black" style={{ color: "#fbbf24" }}>${amount}</span>
        </div>

        <button type="button" onClick={() => void checkout()} disabled={busy}
          className="mt-4 w-full rounded-xl py-4 font-bold text-white disabled:opacity-60"
          style={{ background: "linear-gradient(90deg, #f59e0b, #f97316)" }}>
          {busy ? "Opening checkout…" : `Purchase $${amount} Gift Card via Square`}
        </button>
        {err && <p className="mt-2 text-center text-xs text-red-400">{err}</p>}
        <button type="button" onClick={onClose} className="mt-3 w-full py-2 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          Cancel
        </button>
      </div>
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
      <p className="mb-4 mt-5 text-xs font-bold uppercase tracking-widest" style={{ color: trifectaAccent(0).subtitle }}>
        The Vitamin Bar · drive-thru wellness
      </p>
      <div className="rounded-2xl p-4 backdrop-blur-sm" style={glassStyle(0)}>
        <p className="text-sm font-bold" style={{ color: trifectaAccent(0).subtitle }}>{VITAMIN_BAR.driveThru.headline}</p>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{VITAMIN_BAR.driveThru.blurb}</p>
      </div>
      {groups.map((g) => (
        <section key={g.category} className="mt-7">
          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>{g.label}</h2>
          <div className="space-y-3">
            {g.shots.map((shot, shotIndex) => (
              <button key={shot.id} type="button" onClick={() => onSelect(shot)}
                className="flex w-full items-center gap-3 rounded-2xl p-4 text-left backdrop-blur-sm transition active:scale-[0.99]"
                style={glassStyle(shotIndex % 3)}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-white">{shot.name}</span>
                    {shot.favorite && (
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                        style={{ background: `${trifectaAccent(0).bullet}22`, color: trifectaAccent(0).subtitle }}>Popular</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{shot.benefit}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-bold" style={{ color: trifectaAccent(shotIndex % 3).subtitle }}>{priceLabel(shot.price)}</div>
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
      <div className="w-full max-w-xl rounded-t-3xl p-6 pb-8 backdrop-blur-md" style={{ background: TRIFECTA_GLASS.panel, borderTop: `1px solid ${trifectaAccent(0).border}` }} onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        <h3 className="text-lg font-bold text-white">{shot.name}</h3>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{shot.benefit}</p>
        <div className="mt-3 text-2xl font-black" style={{ color: trifectaAccent(0).subtitle }}>{priceLabel(shot.price)}</div>
        <div className="mt-5 space-y-2.5">
          <button type="button" onClick={() => void prepay()} disabled={payBusy}
            className="block w-full rounded-xl py-3.5 font-bold text-white disabled:opacity-60"
            style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}>
            {payBusy ? "Starting checkout…" : `Pre-pay ${priceLabel(shot.price)} & reserve`}
          </button>
          {payErr && <p className="text-center text-xs text-red-400">{payErr}</p>}
          <a href={freshaUrl} target="_blank" rel="noopener noreferrer"
            className="block rounded-xl py-3.5 text-center font-bold"
            style={{ border: `1px solid ${trifectaAccent(1).border}`, color: trifectaAccent(1).subtitle }}>
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

  const accentColors = [trifectaAccent(0), trifectaAccent(1), trifectaAccent(2), trifectaAccent(0)];

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
            <div key={m.id} className="rounded-2xl p-5 backdrop-blur-sm"
              style={{
                ...glassStyle(i % 3),
                boxShadow: m.highlight ? `0 4px 24px ${accent.bullet}33` : "none",
              }}>
              {/* Badges row */}
              <div className="flex flex-wrap gap-2 mb-3">
                {m.highlight && (
                  <span className="inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase text-white"
                    style={{ background: trifectaButtonGradient(accent) }}>Most popular</span>
                )}
                {m.category && (
                  <span className="inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase"
                    style={{ background: "rgba(255,255,255,0.08)", color: accent.subtitle }}>
                    {m.category}
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-white">{m.name}</h3>
                <div className="shrink-0 text-right">
                  <span className="text-2xl font-black" style={{ color: accent.subtitle }}>${m.pricePerMonth}</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>/mo</span>
                </div>
              </div>
              <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{m.summary}</p>
              <ul className="mt-3 space-y-1.5">
                {m.perks.map((p) => (
                  <li key={p} className="flex gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span style={{ color: accent.bullet }}>✓</span>{p}
                  </li>
                ))}
              </ul>
              {m.rolloverNote && (
                <p className="mt-3 rounded-xl px-3 py-2.5 text-xs leading-relaxed"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {m.rolloverNote}
                </p>
              )}
              <button type="button" onClick={() => void join(m)} disabled={busyId === m.id}
                className="mt-4 block w-full rounded-xl py-3.5 font-bold text-white disabled:opacity-60 transition hover:brightness-110"
                style={{ background: trifectaButtonGradient(accent) }}>
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
          className="mt-4 block rounded-xl py-4 text-center font-bold text-white transition hover:brightness-110"
          style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}>
          Schedule online
        </a>
        <div className="mt-4 rounded-2xl p-4 text-sm backdrop-blur-sm" style={glassStyle(1)}>
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
            className="w-full rounded-xl px-4 py-3.5 text-lg text-white outline-none placeholder-white/30 backdrop-blur-sm"
            style={glassStyle(2)}
            onFocus={(e) => { e.target.style.borderColor = trifectaAccent(2).bullet; }}
            onBlur={(e) => { e.target.style.borderColor = trifectaAccent(2).border.replace("0.35", "1"); }} />
          <button type="submit" disabled={busy}
            className="w-full rounded-xl py-4 font-bold text-white disabled:opacity-50 transition hover:brightness-110"
            style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}>
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
  const [copied, setCopied] = useState(false);
  const totalVisits = homeData?.totalVisits ?? 0;
  const tier = homeData?.authenticated ? getTierForVisits(totalVisits) : null;
  const visitsToNext = homeData?.authenticated ? getVisitsToNextTier(totalVisits) : null;
  const referralCode = homeData?.referralCode;
  const referralUses = homeData?.referralUses ?? 0;
  const referralLink = referralCode
    ? `https://hellogorgeousmedspa.com/app?ref=${referralCode}`
    : null;

  function copyReferral() {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="py-5 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">
          {homeData?.firstName ? `Hey, ${homeData.firstName} ✨` : "Your account"}
        </h2>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Portal, rewards, documents, and more.</p>
      </div>

      {/* Loyalty tier card */}
      {tier && (
        <div className="rounded-2xl p-5 overflow-hidden relative"
          style={{ background: "rgba(255,255,255,0.04)", border: `2px solid ${tier.borderColor}` }}>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: tier.color }} />
          <div className="relative flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{tier.emoji}</span>
                <span className="text-lg font-bold" style={{ color: tier.color }}>{tier.name}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                {totalVisits} lifetime visit{totalVisits !== 1 ? "s" : ""}
              </p>
            </div>
            {visitsToNext && (
              <div className="text-right">
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>Next tier</p>
                <p className="text-sm font-bold" style={{ color: tier.color }}>{visitsToNext} visits</p>
              </div>
            )}
          </div>
          {/* Progress bar */}
          <div className="relative mb-4 h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ background: tier.gradient, width: visitsToNext ? `${Math.min(100, (totalVisits / (totalVisits + visitsToNext)) * 100)}%` : "100%" }} />
          </div>
          <div className="space-y-1.5">
            {tier.perks.map((p) => (
              <div key={p} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                <span style={{ color: tier.color }}>✓</span>{p}
              </div>
            ))}
          </div>
          {visitsToNext && tier.nextTierMessage && (
            <p className="mt-3 text-[10px] text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
              {tier.nextTierMessage}
            </p>
          )}
        </div>
      )}

      {/* Referral card */}
      {referralLink && (
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,79,255,0.35)" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">💜</span>
            <span className="text-sm font-bold text-white">Refer a Friend</span>
            {referralUses > 0 && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: "rgba(123,79,255,0.2)", color: "#a78bfa" }}>
                {referralUses} referred
              </span>
            )}
          </div>
          <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
            Share your link — you both get <strong className="text-white">$25 credit</strong> when they book their first visit.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 rounded-xl px-3 py-2 text-xs truncate font-mono"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
              hellogorgeousmedspa.com/app?ref={referralCode}
            </div>
            <button type="button" onClick={copyReferral}
              className="shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-white transition"
              style={{ background: copied ? "rgba(0,200,100,0.3)" : "linear-gradient(90deg, #7B4FFF, #4F9FFF)" }}>
              {copied ? "Copied! ✓" : "Copy"}
            </button>
          </div>
          <button type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Hello Gorgeous Med Spa", text: "Get $25 off your first visit!", url: referralLink });
              }
            }}
            className="mt-2 w-full rounded-xl py-2 text-xs font-semibold"
            style={{ background: "rgba(123,79,255,0.15)", color: "#a78bfa", border: "1px solid rgba(123,79,255,0.2)" }}>
            📤 Share with a friend
          </button>
        </div>
      )}

      {homeData?.rewardPoints != null && homeData.rewardPoints > 0 && (
        <div className="flex items-center justify-between rounded-xl px-4 py-4 backdrop-blur-sm"
          style={glassStyle(0)}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: trifectaAccent(0).subtitle }}>Reward Points</p>
            <p className="text-3xl font-black" style={{ color: trifectaAccent(0).subtitle }}>{homeData.rewardPoints}</p>
          </div>
          <Link href="/portal/rewards" className="text-xs font-bold underline underline-offset-2" style={{ color: trifectaAccent(0).subtitle }}>
            View →
          </Link>
        </div>
      )}

      <div className="mt-5">
        <ClientAppIntakeCard onOpen={onOpenIntake} refreshKey={intakeRefresh} />
      </div>

      <div className="mt-5 space-y-2">
        {CLIENT_APP_PORTAL_LINKS.map((l, i) => {
          const isExternal = l.href.startsWith("http");
          const cls = "flex items-center gap-3 rounded-xl px-4 py-3.5 font-medium text-white backdrop-blur-sm transition";
          const style = glassStyle(i % 3);
          const inner = (
            <>
              <span className="text-xl">{l.icon}</span>
              {l.label}
              <span className="ml-auto" style={{ color: trifectaAccent(i % 3).subtitle }}>→</span>
            </>
          );
          return isExternal ? (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
              {inner}
            </a>
          ) : (
            <Link key={l.href} href={l.href} className={cls} style={style}>
              {inner}
            </Link>
          );
        })}
      </div>

      <a href={CLIENT_APP.phoneHref}
        className="mt-6 block rounded-xl py-3.5 text-center font-bold backdrop-blur-sm transition hover:brightness-110"
        style={{ ...glassStyle(1), color: trifectaAccent(1).subtitle }}>
        Call {CLIENT_APP.phone}
      </a>
    </div>
  );
}

/** @deprecated Use ClientApp */
export function VitaminBarApp() {
  return <ClientApp initialTab="vitamin" />;
}
