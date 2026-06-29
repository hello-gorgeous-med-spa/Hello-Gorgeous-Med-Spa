"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CLIENT_APP, type ClientAppTab } from "@/lib/client-app";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE, SITE_HERO_IMAGE } from "@/lib/seo";
import { TRIFECTA_GRADIENT_TITLE, trifectaButtonGradient, trifectaAccent } from "@/lib/trifecta-tokens";

type BrandHeroProps = {
  variant?: "home" | "app";
  className?: string;
  firstName?: string | null;
  authenticated?: boolean;
  onNavigate?: (tab: ClientAppTab) => void;
};

export function BrandHero({
  variant = "home",
  className = "",
  firstName,
  authenticated,
  onNavigate,
}: BrandHeroProps) {
  const [revealed, setRevealed] = useState(false);
  const isApp = variant === "app";

  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const imageHeight = isApp
    ? "h-[clamp(220px,62vw,340px)]"
    : "h-[clamp(360px,54vw,680px)]";

  const outerPad = isApp ? "px-3 pt-3" : "px-2 pt-3 sm:px-4 sm:pt-4 md:px-6";
  const maxW = isApp ? "max-w-xl" : "max-w-[1400px]";
  const actionPad = isApp ? "px-3 pb-4 pt-3" : "px-4 pb-5 pt-4 sm:px-6 md:px-10 md:pb-6 md:pt-5";
  const actionMaxW = isApp ? "max-w-xl" : "max-w-7xl";

  return (
    <section className={`relative w-full overflow-hidden ${isApp ? "" : "border-b border-white/10 bg-black"} ${className}`}>
      {!isApp ? (
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/4 top-0 h-64 w-64 rounded-full blur-[100px]"
            style={{ backgroundColor: "rgba(236, 72, 153, 0.12)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full blur-[100px]"
            style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
          />
        </div>
      ) : null}

      <div className={`relative mx-auto w-full ${maxW} ${outerPad}`}>
        <div className="relative">
          {revealed ? (
            <div
              className={`pointer-events-none absolute rounded-[16px] md:rounded-[28px] ${
                isApp ? "-inset-1.5 rounded-[14px]" : "-inset-2 md:-inset-3"
              }`}
              aria-hidden="true"
            >
              <div className="hero-glow-ring hero-glow-ring--pink absolute inset-0 rounded-[inherit]" />
              <div className="hero-glow-ring hero-glow-ring--blue absolute inset-0 rounded-[inherit]" />
              <div className="hero-glow-ring hero-glow-ring--orange absolute inset-0 rounded-[inherit]" />
            </div>
          ) : null}

          <div
            className={`relative ${imageHeight} w-full overflow-hidden rounded-2xl transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:rounded-3xl ${
              revealed ? "scale-100 opacity-100" : "scale-[0.94] opacity-0"
            }`}
            style={{
              border: `1px solid ${trifectaAccent(0).border}`,
              boxShadow: revealed
                ? "0 28px 90px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.06)"
                : "none",
            }}
          >
            <Image
              src={SITE_HERO_IMAGE}
              alt="Danielle Alcala-Glazier and Ryan Kent, FNP-BC — Hello Gorgeous Med Spa founders, Oswego IL"
              fill
              priority
              unoptimized
              className="object-cover object-[center_35%] sm:object-center"
              sizes={isApp ? "(max-width: 576px) 100vw, 576px" : "(max-width: 1400px) 100vw, 1400px"}
              onLoad={() => setRevealed(true)}
            />

            <div
              className={`absolute left-3 top-3 transition-all duration-700 ease-out sm:left-4 sm:top-4 ${
                revealed ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: "280ms" }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
                style={{
                  backgroundColor: "rgba(0,0,0,0.55)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#f472b6",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: "#ec4899" }}
                  />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#ec4899" }} />
                </span>
                Advanced technology · Oswego, IL
              </div>
            </div>
          </div>
        </div>
      </div>

      {isApp ? (
        <div
          className={`relative mx-auto ${actionMaxW} ${actionPad} transition-all duration-700 ease-out ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
          style={{ transitionDelay: "480ms" }}
        >
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
                  Morpheus8 · Quantum RF · InMode Trifecta
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
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-white/70">{CLIENT_APP.tagline}</p>
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
      ) : null}
    </section>
  );
}
