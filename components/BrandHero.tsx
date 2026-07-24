"use client";

import { CLIENT_APP, type ClientAppTab } from "@/lib/client-app";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { TRIFECTA_GRADIENT_TITLE, trifectaButtonGradient, trifectaAccent } from "@/lib/trifecta-tokens";
import WebsiteHeroBanner from "@/components/WebsiteHeroBanner";

type BrandHeroProps = {
  variant?: "home" | "app";
  className?: string;
  firstName?: string | null;
  authenticated?: boolean;
  onNavigate?: (tab: ClientAppTab) => void;
};

/**
 * App home brand block — cinematic rotating hero (Solaria / Quantum / Morpheus8)
 * plus welcome + CTAs. Public homepage uses `HeroV3` → `WebsiteHeroBanner` directly.
 */
export function BrandHero({
  variant = "home",
  className = "",
  firstName,
  authenticated,
  onNavigate,
}: BrandHeroProps) {
  const isApp = variant === "app";

  if (!isApp) {
    return <WebsiteHeroBanner variant="home" className={className} />;
  }

  return (
    <section className={`relative w-full overflow-hidden ${className}`}>
      <div className="relative mx-auto w-full max-w-xl px-3 pt-3">
        <WebsiteHeroBanner variant="app" />
      </div>

      <div className="relative mx-auto max-w-xl px-3 pb-4 pt-3">
        <div
          className="rounded-2xl p-4 backdrop-blur-md"
          style={{
            backgroundColor: "rgba(24, 24, 27, 0.85)",
            border: `1px solid ${trifectaAccent(1).border}`,
          }}
        >
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#60a5fa]">
                Solaria · Quantum RF · Morpheus8
              </p>
              <h1 className="mt-1.5 text-xl font-black leading-tight text-white sm:text-2xl">
                {authenticated && firstName ? (
                  <>
                    Welcome back,{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: TRIFECTA_GRADIENT_TITLE, WebkitBackgroundClip: "text" }}
                    >
                      {firstName}
                    </span>
                  </>
                ) : (
                  <>
                    Hello Gorgeous{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: TRIFECTA_GRADIENT_TITLE, WebkitBackgroundClip: "text" }}
                    >
                      App
                    </span>
                  </>
                )}
              </h1>
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-white/70">
                {CLIENT_APP.tagline}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href={PRIMARY_BOOKING_CTA.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:brightness-110"
                style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}
              >
                {PRIMARY_BOOKING_CTA.label}
              </a>
              {onNavigate ? (
                <button
                  type="button"
                  onClick={() => onNavigate("vitamin")}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border px-4 py-3 text-sm font-bold transition hover:bg-white/5"
                  style={{ borderColor: trifectaAccent(2).border, color: trifectaAccent(2).subtitle }}
                >
                  Vitamin Bar →
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
