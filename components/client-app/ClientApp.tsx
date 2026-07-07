"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
  shotsByCategory,
  type VitaminShot,
} from "@/lib/vitamin-bar";
import {
  WELLNESS_MEMBERSHIP_CATEGORIES,
  wellnessPlansByCategory,
  type WellnessMembershipPlan,
} from "@/lib/wellness-memberships";
import { squareGiftCardUrl, GIFT_CARD_DESIGNS, GIFT_CARD_PRESET_AMOUNTS } from "@/lib/gift-cards";
import { GENTLEMENS_CLUB_HERO_IMAGES } from "@/lib/gentlemens-club";
import {
  ClientAppIntakeCard,
  ClientAppIntakeForm,
} from "@/components/client-app/ClientAppIntakeForm";
import { ClientAppRxHub } from "@/components/client-app/ClientAppRxHub";
import { ClientAppIvBagBuilder } from "@/components/client-app/ClientAppIvBagBuilder";
import { AppGetQrCard } from "@/components/client-app/AppGetQrCard";
import {
  ClientAppPromoCodeCard,
  useAppPromoCode,
  writeStoredAppPromoCode,
} from "@/components/client-app/ClientAppPromoCode";
import { BrandHero } from "@/components/BrandHero";
import {
  usePwaInstall,
} from "@/lib/hooks/use-pwa-install";
import { useRxPushNotifications } from "@/lib/hooks/use-rx-push-notifications";
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

type HomeData = {
  authenticated: boolean;
  clientId?: string | null;
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

function priceLabel(n: number) {
  return `$${n}`;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function formatApptDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ClientApp({
  initialTab = "home",
  initialIvBuilder = false,
  initialRxHub = false,
}: {
  initialTab?: ClientAppTab;
  initialIvBuilder?: boolean;
  initialRxHub?: boolean;
}) {
  const [tab, setTab] = useState<ClientAppTab>(initialTab);
  const [showIvBuilder, setShowIvBuilder] = useState(initialIvBuilder);
  const [showRxHub, setShowRxHub] = useState(initialRxHub);
  const [selected, setSelected] = useState<VitaminShot | null>(null);
  const [showIntake, setShowIntake] = useState(false);
  const [intakeRefresh, setIntakeRefresh] = useState(0);
  const { canInstall, promptInstall } = usePwaInstall({
    registerServiceWorker: true,
    useClientManifest: true,
  });
  const homeData = useHomeData();
  const { permission, subscribed, subscribe, canPrompt } = useRxPushNotifications(homeData?.authenticated ?? false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const promo = params.get("promo") || params.get("code");
    if (promo?.trim()) {
      writeStoredAppPromoCode(promo.trim().toUpperCase());
    }
  }, []);

  const showPushBanner = canPrompt;

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
            <p className="text-xs leading-snug text-white/70">Refill due alerts, deals & appointment reminders</p>
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
        ) : showRxHub ? (
          <ClientAppRxHub onClose={() => setShowRxHub(false)} />
        ) : showIvBuilder ? (
          <ClientAppIvBagBuilder onClose={() => setShowIvBuilder(false)} />
        ) : (
          <>
            {tab === "home"       && <HomeTab onNavigate={setTab} onOpenIntake={() => setShowIntake(true)} onOpenIvBuilder={() => { setTab("vitamin"); setShowIvBuilder(true); }} onOpenRxHub={() => setShowRxHub(true)} intakeRefresh={intakeRefresh} homeData={homeData} canInstall={canInstall} promptInstall={promptInstall} />}
            {tab === "vitamin"    && <VitaminTab onSelect={setSelected} onOpenIntake={() => setShowIntake(true)} onOpenIvBuilder={() => setShowIvBuilder(true)} intakeRefresh={intakeRefresh} />}
            {tab === "deals"      && <DealsTab />}
            {tab === "membership" && <MembershipTab />}
            {tab === "forhim"     && <ForHimTab />}
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
                onClick={() => { setShowIvBuilder(false); setShowRxHub(false); setTab(id); }}
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

function HomeTab({ onNavigate, onOpenIntake, onOpenIvBuilder, onOpenRxHub, intakeRefresh, homeData, canInstall, promptInstall }: {
  onNavigate: (t: ClientAppTab) => void;
  onOpenIntake: () => void;
  onOpenIvBuilder: () => void;
  onOpenRxHub: () => void;
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
      <AppGetQrCard />

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

      {/* Google Review Card */}
      <a
        href="https://g.page/r/CYQOWmT_HcwQEBM/review"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 rounded-2xl px-4 py-4 transition active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, rgba(255,45,142,0.18), rgba(255,45,142,0.08))", border: "1px solid rgba(255,45,142,0.35)" }}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{ background: "rgba(255,45,142,0.15)" }}>
          ⭐
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">Love Hello Gorgeous?</p>
          <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Leave us a Google review — it takes 30 seconds & means the world to us 💕</p>
        </div>
        <span className="shrink-0 text-xs font-semibold" style={{ color: "#FF2D8E" }}>Rate us →</span>
      </a>

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
        <Link href="/portal/login?redirect=/app&mode=register"
          className="flex items-center justify-between rounded-xl px-4 py-3 backdrop-blur-sm"
          style={glassStyle(1)}>
          <div className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            <span className="text-sm font-medium text-white/70">Sign in or create your account for appointments & rewards</span>
          </div>
          <span className="text-xs" style={{ color: trifectaAccent(1).subtitle }}>→</span>
        </Link>
      )}

      <button
        type="button"
        onClick={onOpenIvBuilder}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 backdrop-blur-sm text-left"
        style={{ ...glassStyle(2), background: "linear-gradient(90deg, rgba(59,130,246,0.12), rgba(255,45,142,0.08))" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">💧</span>
          <span className="text-sm font-medium text-white/80">Build Your IV Bag — from $89</span>
        </div>
        <span className="text-xs" style={{ color: trifectaAccent(2).subtitle }}>→</span>
      </button>

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

      {/* Gift Card Carousel — below quick actions */}
      <GiftCardStrip giftUrl={squareGiftCardUrl({ utmSource: "app", utmMedium: "home_tab" })} />

      {/* Wellness Programs */}
      <WellnessSection onOpenRxHub={onOpenRxHub} />

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

// ─── Gift Card Strip ──────────────────────────────────────────────────────────

function GiftCardStrip({ giftUrl }: { giftUrl: string }) {
  return (
    <section className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          Gift Cards
        </h2>
        <a href={giftUrl} target="_blank" rel="noopener noreferrer"
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "#fbbf24" }}>
          Buy Now →
        </a>
      </div>
      {/* Scrollable design cards */}
      <div className="-mx-5 px-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-3" style={{ width: "max-content" }}>
          {GIFT_CARD_DESIGNS.map((design) => (
            <a key={design.id} href={giftUrl} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 rounded-2xl overflow-hidden transition active:scale-95"
              style={{ width: 148, border: "1px solid rgba(245,158,11,0.3)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={design.image} alt={design.name} style={{ width: 148, height: 88, objectFit: "cover", display: "block" }} />
              <div className="px-2 py-1.5" style={{ background: "rgba(245,158,11,0.12)" }}>
                <p className="text-[11px] font-bold text-white leading-tight truncate">{design.name}</p>
              </div>
            </a>
          ))}
          {/* Final CTA tile */}
          <a href={giftUrl} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center gap-1 transition active:scale-95"
            style={{ width: 148, height: 115, background: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(249,115,22,0.18))", border: "1px solid rgba(245,158,11,0.4)" }}>
            <span className="text-2xl">🎁</span>
            <span className="text-xs font-bold text-white text-center px-2 leading-tight">Buy a Gift Card</span>
            <span className="text-[10px] font-semibold" style={{ color: "#fbbf24" }}>via Square →</span>
          </a>
        </div>
      </div>
      {/* Denomination row */}
      <div className="flex gap-2 mt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {GIFT_CARD_PRESET_AMOUNTS.map((amt) => (
          <a key={amt} href={giftUrl} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 rounded-xl px-4 py-2 text-sm font-bold text-white transition active:scale-95"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
            ${amt}
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── Wellness Programs Section ────────────────────────────────────────────────

function WellnessSection({ onOpenRxHub }: { onOpenRxHub: () => void }) {
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
                    {p.id === "peptides" ? (
                      <button
                        type="button"
                        onClick={onOpenRxHub}
                        className="flex-1 rounded-xl py-2.5 text-center text-sm font-semibold"
                        style={{ border: `1px solid ${accent.border}`, color: accent.subtitle }}>
                        Hello Gorgeous RX →
                      </button>
                    ) : p.bookHref.startsWith("http") ? (
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
  const giftUrl = squareGiftCardUrl({ utmSource: "app", utmMedium: "deals_tab" });
  const deals = getActiveDeals();
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);
  const homeData = useHomeData();
  const [activeVouchers, setActiveVouchers] = useState<VoucherSummary[]>([]);

  useEffect(() => {
    if (!homeData?.clientId) return;
    fetch(`/api/app/vouchers/balance?client_id=${homeData.clientId}`)
      .then(r => r.json())
      .then(d => setActiveVouchers(d.vouchers ?? []))
      .catch(() => {});
  }, [homeData?.clientId]);

  return (
    <div className="py-5">
      {/* Header */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-2"
          style={{ background: "rgba(230,0,126,0.15)", color: "#f472b6", border: "1px solid rgba(230,0,126,0.25)" }}>
          🎉 App Exclusives
        </div>
        <h2 className="text-xl font-bold text-white">Deals & Gift Cards</h2>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Special offers and gift cards — only in the Hello Gorgeous app.
        </p>
      </div>

      <ClientAppPromoCodeCard previewSubtotalUsd={100} />

      {/* Gift Card Showcase */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#fbbf24" }}>Gift Someone Special 🎁</p>
            <h3 className="text-base font-bold text-white">Hello Gorgeous Gift Cards</h3>
          </div>
        </div>
        <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
          Choose a design · Pick an amount · Delivered instantly via email.
        </p>

        {/* Design carousel */}
        <div className="-mx-5 px-5 overflow-x-auto pb-3 mb-3" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-3" style={{ width: "max-content" }}>
            {GIFT_CARD_DESIGNS.map((design) => (
              <a key={design.id} href={giftUrl} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 rounded-2xl overflow-hidden transition active:scale-95"
                style={{ width: 160, border: "1px solid rgba(245,158,11,0.3)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={design.image} alt={design.name} className="w-full object-cover" style={{ height: 100, objectFit: "cover" }} />
                <div className="px-2 py-2" style={{ background: "rgba(245,158,11,0.12)" }}>
                  <p className="text-[11px] font-bold text-white leading-tight truncate">{design.name}</p>
                  <p className="text-[10px] mt-0.5 leading-tight" style={{ color: "#fbbf24" }}>{design.tagline}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Amount grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {GIFT_CARD_PRESET_AMOUNTS.map((amt) => (
            <a key={amt} href={giftUrl} target="_blank" rel="noopener noreferrer"
              className="rounded-2xl p-3 flex flex-col items-center justify-center text-center transition active:scale-95"
              style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(249,115,22,0.12))", border: "1px solid rgba(245,158,11,0.3)", minHeight: 68 }}>
              <span className="text-xl font-black text-white">${amt}</span>
              <span className="text-[10px] mt-0.5 font-semibold" style={{ color: "#fbbf24" }}>Gift Card</span>
            </a>
          ))}
        </div>
        <a href={giftUrl} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white"
          style={{ background: "linear-gradient(90deg, #f59e0b, #f97316)" }}>
          🎁 Buy a Gift Card via Square →
        </a>
        <p className="text-center text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          Custom amounts available · Valid for any service or product
        </p>
      </div>

      {/* Buy a Voucher section */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💳</span>
          <h3 className="text-base font-bold text-white">Buy a Service Voucher</h3>
        </div>
        <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
          Pre-pay and get bonus credit — valid on all services · Excludes weight loss medications &amp; retail products.
        </p>
        <div className="space-y-3">
          {[
            { tier: '1000', pay: 1000, credit: 1100, bonus: '$100 free', pct: '10% bonus' },
            { tier: '2000', pay: 2000, credit: 2225, bonus: '$225 free', pct: '11.25% bonus' },
          ].map((v, i) => {
            const accent = trifectaAccent(i);
            return (
              <div key={v.tier} className="rounded-2xl p-4"
                style={{ background: `rgba(255,255,255,0.04)`, border: `1px solid ${accent.border}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
                        style={{ background: accent.badgeBg }}>
                        {v.pct}
                      </span>
                    </div>
                    <p className="font-bold text-white text-base">${v.pay.toLocaleString()} Voucher → ${v.credit.toLocaleString()} Credit</p>
                    <p className="text-xs mt-0.5" style={{ color: accent.subtitle }}>Get {v.bonus} — {v.pct}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Valid on all services · Excludes weight loss meds &amp; retail
                    </p>
                  </div>
                </div>
                <button type="button"
                  onClick={() => setVoucherMsg(`To purchase a $${v.pay.toLocaleString()} voucher, ask staff at checkout or call (630) 636-6193.`)}
                  className="mt-3 w-full rounded-xl py-3 text-sm font-bold text-white"
                  style={{ background: `linear-gradient(90deg, ${accent.buttonFrom}, ${accent.buttonTo})` }}>
                  Purchase ${v.pay.toLocaleString()} Voucher →
                </button>
              </div>
            );
          })}
        </div>
        {voucherMsg && (
          <div className="mt-3 rounded-xl p-4 text-sm"
            style={{ background: "rgba(255,45,142,0.1)", border: "1px solid rgba(255,45,142,0.25)", color: "rgba(255,255,255,0.8)" }}>
            {voucherMsg}
            <button type="button" onClick={() => setVoucherMsg(null)} className="ml-2 text-white/40 text-xs">✕</button>
          </div>
        )}

        {/* Existing vouchers */}
        {activeVouchers.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Your Active Vouchers</p>
            <div className="space-y-2">
              {activeVouchers.map(v => (
                <div key={v.id} className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span className="font-mono text-sm font-bold text-white">{v.code}</span>
                  <span className="font-bold" style={{ color: "#4ade80" }}>${v.remaining_balance} remaining</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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

    </div>
  );
}

// ─── Vitamin Tab ──────────────────────────────────────────────────────────────

function VitaminTab({ onSelect, onOpenIntake, onOpenIvBuilder, intakeRefresh }: {
  onSelect: (s: VitaminShot) => void;
  onOpenIntake: () => void;
  onOpenIvBuilder: () => void;
  intakeRefresh: number;
}) {
  const groups = shotsByCategory();
  return (
    <div className="py-5">
      <ClientAppIntakeCard onOpen={onOpenIntake} refreshKey={intakeRefresh} />

      <button
        type="button"
        onClick={onOpenIvBuilder}
        className="mt-5 w-full rounded-2xl p-5 text-left overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(255,45,142,0.12))",
          border: "1px solid rgba(59,130,246,0.35)",
        }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#3b82f6" }} />
        <div className="relative flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#93c5fd" }}>
              New · Build Your Bag
            </p>
            <p className="text-lg font-bold text-white">Custom IV Therapy</p>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              From $89 · 500 mL or 1 Liter · Olympia boosters · most bags $150–$199
            </p>
          </div>
          <span className="text-3xl shrink-0">💧</span>
        </div>
      </button>

      <p className="mb-4 mt-7 text-xs font-bold uppercase tracking-widest" style={{ color: trifectaAccent(0).subtitle }}>
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
                {shot.image ? (
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={shot.image} alt="" className="h-full w-full object-cover object-center" />
                  </div>
                ) : null}
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
  const promoCode = useAppPromoCode();
  const [payBusy, setPayBusy] = useState(false);
  const [payErr, setPayErr] = useState<string | null>(null);
  const [promoPreview, setPromoPreview] = useState<{ discountUsd: number; finalUsd: number } | null>(
    null,
  );

  useEffect(() => {
    if (!promoCode) {
      setPromoPreview(null);
      return;
    }
    void fetch("/api/client-app/promo/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode, subtotalUsd: shot.price, context: "vitamin" }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setPromoPreview({ discountUsd: d.discountUsd, finalUsd: d.finalUsd });
        else setPromoPreview(null);
      })
      .catch(() => setPromoPreview(null));
  }, [promoCode, shot.price]);

  async function prepay() {
    setPayErr(null); setPayBusy(true);
    try {
      const res = await fetch("/api/vitamin-bar/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: shot.id,
          kind: "shot",
          promoCode: promoCode || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) { window.location.href = data.url; return; }
      setPayErr(data.error || "Couldn't start pre-pay. Pay at the window or call us.");
    } catch { setPayErr("Network error. Pay at the window or call us."); }
    finally { setPayBusy(false); }
  }

  const displayPrice = promoPreview ? promoPreview.finalUsd : shot.price;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70" onClick={onClose}>
      <div className="w-full max-w-xl rounded-t-3xl p-6 pb-8 backdrop-blur-md" style={{ background: TRIFECTA_GLASS.panel, borderTop: `1px solid ${trifectaAccent(0).border}` }} onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        {shot.image ? (
          <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shot.image} alt={shot.name} className="h-full w-full object-cover object-center" />
          </div>
        ) : null}
        <h3 className="text-lg font-bold text-white">{shot.name}</h3>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{shot.benefit}</p>
        <ClientAppPromoCodeCard previewSubtotalUsd={shot.price} compact />
        <div className="mt-3">
          {promoPreview ? (
            <>
              <div className="text-sm line-through text-white/35">{priceLabel(shot.price)}</div>
              <div className="text-2xl font-black" style={{ color: trifectaAccent(0).subtitle }}>
                {priceLabel(displayPrice)}
              </div>
              <p className="text-xs mt-1 text-amber-300">
                {promoCode} applied (−{priceLabel(promoPreview.discountUsd)})
              </p>
            </>
          ) : (
            <div className="text-2xl font-black" style={{ color: trifectaAccent(0).subtitle }}>
              {priceLabel(shot.price)}
            </div>
          )}
        </div>
        <div className="mt-5 space-y-2.5">
          <button type="button" onClick={() => void prepay()} disabled={payBusy}
            className="block w-full rounded-xl py-3.5 font-bold text-white disabled:opacity-60"
            style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}>
            {payBusy ? "Starting checkout…" : `Pre-pay ${priceLabel(displayPrice)} & reserve`}
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

function MembershipTab() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const promoCode = useAppPromoCode();

  async function joinPlan(plan: WellnessMembershipPlan) {
    setErr(null);
    if (plan.consultFirst) {
      window.open(plan.bookHref ?? BOOKING_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setBusyId(plan.id);
    try {
      const res = await fetch("/api/client-app/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId: plan.id,
          promoCode: promoCode || undefined,
        }),
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
      <h2 className="text-xl font-bold text-white">Wellness Memberships</h2>
      <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
        Peptides · hormones · NP programs · Vitamin Bar — billed monthly through Square.
      </p>

      <ClientAppPromoCodeCard previewSubtotalUsd={100} />

      <div className="mt-5 space-y-8">
        {WELLNESS_MEMBERSHIP_CATEGORIES.map((category, ci) => {
          const plans = wellnessPlansByCategory(category.id);
          return (
            <section key={category.id}>
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: trifectaAccent(ci % 3).subtitle }}
              >
                {category.eyebrow}
              </p>
              <h3 className="text-sm font-bold text-white mb-3">{category.label}</h3>
              <div className="space-y-3">
                {plans.map((plan) => {
                  const accent = trifectaAccent(ci % 3);
                  const price = plan.priceLabel ?? `$${plan.pricePerMonth}/mo`;
                  return (
                    <div
                      key={plan.id}
                      className="rounded-2xl p-4"
                      style={{
                        background: plan.highlight
                          ? `linear-gradient(145deg, ${accent.subtitle}14 0%, rgba(10,15,30,0.97) 40%)`
                          : "rgba(255,255,255,0.03)",
                        border: plan.highlight
                          ? `1px solid ${accent.subtitle}50`
                          : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="font-bold text-white text-sm">{plan.name}</h4>
                        <span className="text-sm font-black shrink-0" style={{ color: accent.subtitle }}>
                          {price}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
                        {plan.summary}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {plan.perks.slice(0, 3).map((p) => (
                          <li key={p} className="flex gap-1.5 text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                            <span style={{ color: accent.subtitle }}>✓</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        disabled={busyId === plan.id}
                        onClick={() => void joinPlan(plan)}
                        className="mt-3 w-full rounded-xl py-3 text-center text-xs font-bold text-white disabled:opacity-60"
                        style={{ background: trifectaButtonGradient(accent) }}
                      >
                        {busyId === plan.id
                          ? "Starting…"
                          : plan.consultFirst
                            ? "Book consult"
                            : "Join with Square"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {err ? <p className="mt-4 text-center text-xs text-red-400">{err}</p> : null}

      <Link
        href="/monthly-memberships"
        className="mt-5 block w-full rounded-xl py-3 text-center text-sm font-semibold text-[#FF2D8E] transition hover:text-pink-300"
        style={{ border: "1px solid rgba(255,45,142,0.25)", background: "rgba(255,45,142,0.06)" }}
      >
        View all membership details →
      </Link>

      <p className="mt-4 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
        Billed monthly · Cancel anytime · Call {CLIENT_APP.phone}
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

// ─── QR Code Card ─────────────────────────────────────────────────────────────

type VoucherSummary = { id: string; code: string; remaining_balance: number; status: string };

function QRCodeCard({ clientId, firstName, vouchers: initialVouchers }: {
  clientId: string;
  firstName?: string | null;
  vouchers: VoucherSummary[];
}) {
  const [open, setOpen] = useState(false);
  const [vouchers, setVouchers] = useState<VoucherSummary[]>(initialVouchers);
  const [vouchersLoaded, setVouchersLoaded] = useState(false);

  function show() {
    setOpen(true);
    if (!vouchersLoaded) {
      fetch(`/api/app/vouchers/balance?client_id=${clientId}`)
        .then(r => r.json())
        .then(d => { setVouchers(d.vouchers ?? []); setVouchersLoaded(true); })
        .catch(() => setVouchersLoaded(true));
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="w-full rounded-2xl p-4 text-left transition active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, rgba(255,45,142,0.15), rgba(255,45,142,0.06))", border: "1px solid rgba(255,45,142,0.3)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📲</span>
            <div>
              <p className="text-sm font-bold text-white">My Scan Code</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Show to staff at checkout</p>
            </div>
          </div>
          <span className="text-sm font-bold px-3 py-1.5 rounded-xl" style={{ background: "#FF2D8E", color: "#fff" }}>
            Show QR
          </span>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-3xl p-6 text-center" style={{ background: "#111" }} onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
            <h3 className="text-xl font-bold text-white mb-1">{firstName ?? "My"} QR Code</h3>
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>Show this to staff at checkout</p>

            {/* QR Image */}
            <div className="mx-auto mb-5 rounded-2xl overflow-hidden" style={{ width: 220, height: 220, background: "#fff", padding: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/app/qr-code?client_id=${clientId}`}
                alt="Client QR code"
                width={204}
                height={204}
                className="w-full h-full"
              />
            </div>

            {/* Vouchers */}
            {vouchers.length > 0 && (
              <div className="mb-4 space-y-2 text-left">
                {vouchers.map(v => (
                  <div key={v.id} className="flex items-center justify-between rounded-xl px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span className="text-sm font-mono font-bold text-white">{v.code}</span>
                    <span className="text-sm font-bold" style={{ color: "#4ade80" }}>${v.remaining_balance} remaining</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Staff will scan this to pull up your account, points, and vouchers instantly.
            </p>
            <button type="button" onClick={() => setOpen(false)}
              className="w-full rounded-xl py-3 font-bold text-white"
              style={{ background: "#FF2D8E" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── For Him Tab ─────────────────────────────────────────────────────────────

const GIFT_CARD_URL = "https://app.squareup.com/gift/T47CHJDW8177K/order";

const FOR_HIM_SERVICES = [
  {
    id: "brotox",
    icon: "💉",
    label: "Brotox",
    blurb: "Botox for men. Soften lines, look rested, own the room. 15-minute treatment.",
    badge: "POPULAR",
    href: "/brotox",
    cta: "Book Brotox",
    accentIndex: 0,
  },
  {
    id: "hormones",
    icon: "🧬",
    label: "Hormone Optimization",
    blurb: "Energy. Strength. Libido. Mood. Recovery. Lab-guided TRT & hormone care.",
    badge: "RX",
    href: "/gentlemens-club",
    cta: "Book Consult",
    accentIndex: 1,
  },
  {
    id: "peptides",
    icon: "⚡",
    label: "Peptide Therapy",
    blurb: "BPC-157, Sermorelin, NAD+, AOD-9604 & more. Recovery, performance, longevity.",
    badge: "NEW",
    href: "/peptides",
    cta: "Learn More",
    accentIndex: 2,
  },
  {
    id: "giftcard",
    icon: "🎁",
    label: "Gift Brotox",
    blurb: "Perfect for dads, husbands & boyfriends. Delivered instantly via Square.",
    badge: "GIFT",
    href: GIFT_CARD_URL,
    cta: "Buy Gift Card",
    accentIndex: 0,
    external: true,
  },
] as const;

function ForHimTab() {
  return (
    <div className="py-5">
      {/* Flyer hero */}
      <div className="mb-5">
        <a
          href="/gentlemens-club"
          className="group block overflow-hidden rounded-2xl border-2 border-black bg-black shadow-[4px_4px_0_0_rgba(255,45,142,0.35)] transition-transform duration-300 active:scale-[0.98]"
        >
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={GENTLEMENS_CLUB_HERO_IMAGES[0].src}
              alt={GENTLEMENS_CLUB_HERO_IMAGES[0].alt}
              fill
              className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 480px) 100vw, 440px"
              priority
            />
          </div>
        </a>
      </div>

      {/* Hero copy + CTA */}
      <div className="relative rounded-3xl overflow-hidden mb-6 px-5 py-7"
        style={{ background: "linear-gradient(135deg, #030712 0%, rgba(15,23,42,0.95) 60%, rgba(30,58,138,0.15) 100%)", border: "1px solid rgba(59,130,246,0.2)" }}>
        {/* Blue glow */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] pointer-events-none"
          style={{ background: "rgba(59,130,246,0.2)" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none"
          style={{ background: "rgba(255,45,142,0.1)" }} />
        {/* Crown + title */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg" style={{ filter: "drop-shadow(0 0 8px rgba(255,45,142,0.6))" }}>👑</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#FF2D8E" }}>Hello Gorgeous Med Spa</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-1" style={{
            background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            textShadow: "none",
          }}>
            THE GENTLEMEN'S<br />CLUB
          </h2>
          <div className="w-16 h-px mb-3" style={{ background: "linear-gradient(90deg, #FF2D8E, transparent)" }} />
          <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
            Exclusive wellness, aesthetics &amp; performance support for men.
          </p>
          {/* Service pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {["BROTOX", "HORMONES", "PEPTIDE THERAPY", "RECOVERY"].map((s) => (
              <span key={s} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                {s}
              </span>
            ))}
          </div>
          <a href="/gentlemens-club"
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white"
            style={{ background: "linear-gradient(90deg, #FF2D8E, #db2777)", boxShadow: "0 0 20px rgba(255,45,142,0.3)" }}>
            📋 Book Your Consult →
          </a>
        </div>
      </div>

      {/* Membership banner */}
      <div className="rounded-2xl px-4 py-3 mb-5 flex items-center justify-between"
        style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.12), rgba(255,45,142,0.08))", border: "1px solid rgba(59,130,246,0.25)" }}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#60a5fa" }}>Membership</p>
          <p className="text-sm font-bold text-white">From $99/mo — No contracts</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Monthly shot · Member pricing · Priority booking · Discounted Brotox</p>
        </div>
        <a href="/gentlemens-club"
          className="flex-shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-white ml-3"
          style={{ background: "rgba(59,130,246,0.25)", border: "1px solid rgba(59,130,246,0.4)" }}>
          Join →
        </a>
      </div>

      {/* Services */}
      <div className="mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
          Men's Services
        </p>
        <div className="space-y-3">
          {FOR_HIM_SERVICES.map((svc) => {
            const accent = trifectaAccent(svc.accentIndex);
            return (
              <div key={svc.id} className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accent.border}` }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{svc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{svc.label}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
                        style={{ background: accent.badgeBg }}>{svc.badge}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{svc.blurb}</p>
                  </div>
                </div>
                {'external' in svc && svc.external ? (
                  <a href={svc.href} target="_blank" rel="noopener noreferrer"
                    className="mt-3 w-full flex items-center justify-center rounded-xl py-2.5 text-sm font-bold text-white"
                    style={{ background: `linear-gradient(90deg, ${accent.buttonFrom}, ${accent.buttonTo})` }}>
                    {svc.cta} →
                  </a>
                ) : (
                  <a href={svc.href}
                    className="mt-3 w-full flex items-center justify-center rounded-xl py-2.5 text-sm font-bold text-white"
                    style={{ background: `linear-gradient(90deg, ${accent.buttonFrom}, ${accent.buttonTo})` }}>
                    {svc.cta} →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Couples promo */}
      <div className="mt-5 rounded-2xl p-4 text-center"
        style={{ background: "rgba(255,45,142,0.06)", border: "1px solid rgba(255,45,142,0.2)" }}>
        <p className="text-sm font-bold text-white mb-1">Couples that glow together… 💗</p>
        <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
          Botox for her. Brotox for him. Book together and make it a date.
        </p>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
          style={{ background: "linear-gradient(90deg, #FF2D8E, #db2777)" }}>
          Book Together →
        </a>
      </div>
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
  const [unitBalance, setUnitBalance] = useState<number | null>(null);
  const [unitHistory, setUnitHistory] = useState<{ type: string; units: number; note: string | null; toxin: string | null; created_at: string }[]>([]);
  const [showUnitHistory, setShowUnitHistory] = useState(false);
  const totalVisits = homeData?.totalVisits ?? 0;
  const tier = homeData?.authenticated ? getTierForVisits(totalVisits) : null;
  const visitsToNext = homeData?.authenticated ? getVisitsToNextTier(totalVisits) : null;
  const referralCode = homeData?.referralCode;

  // Load Unit Bank balance when authenticated
  useEffect(() => {
    if (!homeData?.authenticated || !homeData?.clientId) return;
    fetch(`/api/app/unit-bank/balance?client_id=${homeData.clientId}`)
      .then(r => r.json())
      .then(d => {
        setUnitBalance(d.balance ?? 0);
        setUnitHistory(d.history ?? []);
      })
      .catch(() => setUnitBalance(0));
  }, [homeData?.authenticated, homeData?.clientId]);
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

      <Link
        href={
          homeData?.authenticated
            ? CLIENT_APP.myRxPath
            : `/portal/login?redirect=${encodeURIComponent(CLIENT_APP.myRxPath)}`
        }
        className="flex items-center gap-4 rounded-2xl px-4 py-4 transition active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, rgba(230,0,126,0.22), rgba(255,45,142,0.1))",
          border: "2px solid rgba(230,0,126,0.45)",
        }}
      >
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{ background: "rgba(230,0,126,0.2)" }}
        >
          💊
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#FFB8DC" }}>
            Hello Gorgeous RX™
          </p>
          <p className="text-sm font-bold text-white leading-tight">My prescriptions</p>
          <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            Track GLP-1 & peptide orders, pay invoices, reorder
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold" style={{ color: "#FF2D8E" }}>
          Open →
        </span>
      </Link>

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

      {/* ── HG Rewards Points Card ── */}
      {homeData?.authenticated && unitBalance !== null && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(255,45,142,0.12), rgba(80,20,80,0.25))", border: "1px solid rgba(255,45,142,0.35)" }}>
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌟</span>
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#FF2D8E" }}>HG Rewards</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "rgba(255,45,142,0.15)", color: "#FF2D8E", border: "1px solid rgba(255,45,142,0.25)" }}>
                Points Program
              </span>
            </div>

            {/* Balance */}
            <div className="flex items-end gap-3 mt-3 mb-4">
              <div>
                <p className="text-5xl font-black text-white leading-none">{unitBalance.toLocaleString()}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                  points
                  {unitBalance > 0
                    ? <span style={{ color: "#FF2D8E" }}> · ${(unitBalance / 100).toFixed(2)} value</span>
                    : ' — start earning today!'}
                </p>
              </div>
              {unitBalance >= 100 && (
                <div className="ml-auto text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Ready to redeem</p>
                  <p className="text-sm font-semibold" style={{ color: "#FF2D8E" }}>Tell us at checkout!</p>
                </div>
              )}
              {unitBalance > 0 && unitBalance < 100 && (
                <div className="ml-auto text-right">
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{100 - unitBalance} more pts</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>until $1 off</p>
                </div>
              )}
            </div>

            {/* Earn rate for their tier */}
            {tier && (
              <div className="rounded-xl px-3 py-2 mb-3"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {tier.emoji} <strong className="text-white">{tier.name}</strong> earn rate:{' '}
                  <span style={{ color: "#FF2D8E" }}>
                    {tier.id === 'bronze' && '5 pts per $1 spent'}
                    {tier.id === 'gold' && '7 pts per $1 spent'}
                    {tier.id === 'platinum' && '10 pts per $1 spent'}
                  </span>
                  {' '}· 100 pts = $1 off any service
                </p>
              </div>
            )}

            {/* How it works (shown when balance is 0) */}
            {unitBalance === 0 && (
              <div className="space-y-2 mb-3">
                {[
                  { emoji: '💳', text: 'Earn points on every dollar you spend' },
                  { emoji: '⭐', text: 'Bonus points for reviews, referrals & more' },
                  { emoji: '🎁', text: '100 points = $1 off — any service, any visit' },
                ].map(s => (
                  <div key={s.text} className="flex items-center gap-2">
                    <span className="text-base">{s.emoji}</span>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Transaction history toggle */}
            {unitHistory.length > 0 && (
              <button type="button" onClick={() => setShowUnitHistory(v => !v)}
                className="text-xs font-semibold mt-1 w-full text-left"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                {showUnitHistory ? '▲ Hide history' : `▼ View history (${unitHistory.length} transactions)`}
              </button>
            )}

            {/* History list */}
            {showUnitHistory && unitHistory.length > 0 && (
              <div className="mt-3 space-y-2">
                {unitHistory.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-t"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div>
                      <p className="text-xs text-white">
                        {tx.type === 'earned' ? '💰 Earned' : tx.type === 'redeemed' ? '✅ Redeemed' : tx.type === 'bonus' ? '🎁 Bonus' : '📋 Adjusted'}
                        {tx.toxin ? ` · ${tx.toxin.charAt(0).toUpperCase() + tx.toxin.slice(1)}` : ''}
                      </p>
                      {tx.note && <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{tx.note}</p>}
                    </div>
                    <span className={`text-sm font-bold ${tx.units > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.units > 0 ? '+' : ''}{tx.units.toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA strip */}
          <div className="px-5 py-3 flex items-center justify-between"
            style={{ background: "rgba(255,45,142,0.1)", borderTop: "1px solid rgba(255,45,142,0.2)" }}>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              Works on all services · Never expires
            </p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              className="text-xs font-bold shrink-0 ml-3"
              style={{ color: "#FF2D8E" }}>
              Book & earn →
            </a>
          </div>
        </div>
      )}

      {/* ── My QR Code ── */}
      {homeData?.authenticated && homeData?.clientId && (
        <QRCodeCard clientId={homeData.clientId} firstName={homeData.firstName} vouchers={[]} />
      )}

      {/* ── Ways to Earn ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">💰</span>
            <span className="text-sm font-bold text-white">Ways to Earn Points</span>
          </div>
          <p className="text-[11px] mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>100 points = $1 off · redeemable on any service</p>
          <div className="space-y-3">
            {[
              {
                emoji: '💳',
                title: 'Spend on any service',
                desc: 'Earn 5 pts per $1 (Bronze) · 7 pts per $1 (Gold) · 10 pts per $1 (Platinum)',
                badge: 'Auto-credited',
                badgeColor: '#FF2D8E',
              },
              {
                emoji: '⭐',
                title: 'Leave a Google review',
                desc: 'Takes 30 seconds and means the world to us 💕 Earn 500 points ($5 value)!',
                badge: '500 pts = $5',
                badgeColor: '#f59e0b',
                href: 'https://g.page/r/CYQOWmT_HcwQEBM/review',
                cta: 'Review us →',
              },
              {
                emoji: '💜',
                title: 'Refer a friend',
                desc: 'When they book their first visit, you earn 500 points ($5 value)',
                badge: '500 pts = $5',
                badgeColor: '#7B4FFF',
              },
              {
                emoji: '🎂',
                title: 'Birthday month',
                desc: 'We surprise you every year — just make sure your birthday is saved in your profile',
                badge: '500 pts surprise',
                badgeColor: '#ec4899',
              },
              {
                emoji: '📲',
                title: 'Follow us on Instagram',
                desc: '@hellogorgeousmedspa — show us at your next visit to claim your points',
                badge: '100 pts = $1',
                badgeColor: '#e11d48',
                href: 'https://instagram.com/hellogorgeousmedspa',
                cta: 'Follow →',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${item.badgeColor}22`, color: item.badgeColor }}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
                  {item.href && (
                    <a href={item.href} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-1 text-xs font-bold"
                      style={{ color: item.badgeColor }}>
                      {item.cta}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 py-3 text-[11px]"
          style={{ background: "rgba(255,45,142,0.06)", borderTop: "1px solid rgba(255,45,142,0.15)", color: "rgba(255,255,255,0.35)" }}>
          Points never expire · 100 pts = $1 off · Ask staff to credit bonus points at checkout
        </div>
      </div>

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

      {/* Google Review CTA — Me Tab */}
      <a
        href="https://g.page/r/CYQOWmT_HcwQEBM/review"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 rounded-2xl px-4 py-4 transition active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, rgba(255,45,142,0.18), rgba(255,45,142,0.08))", border: "1px solid rgba(255,45,142,0.35)" }}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{ background: "rgba(255,45,142,0.15)" }}>
          ⭐
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">Love Hello Gorgeous?</p>
          <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Tap to leave a Google review — 30 seconds & it means everything to us 💕</p>
        </div>
        <span className="shrink-0 text-xs font-semibold" style={{ color: "#FF2D8E" }}>Rate us →</span>
      </a>

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
