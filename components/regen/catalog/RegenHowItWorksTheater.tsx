"use client";

import Image from "next/image";
import { useMemo } from "react";

import { findProductByDrugKey, listingPriceText } from "@/lib/regen/catalog";
import { SITE } from "@/lib/seo";

type Props = {
  onStartShopping?: () => void;
  /** Deep-link to Lose Weight / tirzepatide goal */
  onShopWeightLoss?: () => void;
};

export function RegenHowItWorksTheater({ onStartShopping, onShopWeightLoss }: Props) {
  const fromPrice = useMemo(() => {
    const p = findProductByDrugKey("tirzepatide");
    if (!p) return null;
    const label = listingPriceText(p);
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, []);

  const steps = [
    {
      n: "01",
      title: "Choose your stack",
      sell: fromPrice
        ? `Browse goals, protocols, or curated bundles. Weight-loss protocols start ${fromPrice} / 30 days.`
        : "Browse goals, protocols, or curated bundles — add what you want in one tap.",
      trust: "Secure Square checkout",
      image: "/images/regen/brand/steps/01-shop.jpg",
      imageAlt: "Hands holding a RE GEN peptide vial — choose your protocol",
      chip: fromPrice ? `Most popular: Tirzepatide · ${fromPrice}` : "Most popular: Tirzepatide",
      chipAction: onShopWeightLoss,
    },
    {
      n: "02",
      title: "Quick clinical intake",
      sell: "Tell us your health story right after you pay — typically about 4 minutes.",
      trust: "~4 min · Encrypted · NP-reviewed",
      image: "/images/regen/brand/steps/02-intake.jpg",
      imageAlt: "Client completing RE GEN health intake on a phone",
      chip: null,
      chipAction: undefined,
    },
    {
      n: "03",
      title: "NP reviews & approves",
      sell: "15-minute telehealth with Ryan Kent, FNP-BC. Medicine first — then we ship.",
      trust: "~15 min video · Licensed Illinois NP",
      image: "/images/regen/brand/steps/03-np.jpg",
      imageAlt: "RE GEN provider ready for NP telehealth review",
      chip: null,
      chipAction: undefined,
    },
    {
      n: "04",
      title: "Arrives discreet · tracked",
      sell: "Approved orders ship to your door in plain packaging — you get tracking the whole way.",
      trust: "Pharmacy-fulfilled · Flat $30 IL shipping",
      image: "/images/regen/brand/steps/04-arrive.jpg",
      imageAlt: "Happy client receiving a discreet RE GEN delivery",
      chip: null,
      chipAction: undefined,
    },
  ] as const;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-[148px] relative overflow-hidden px-4 py-16 sm:px-6 lg:py-24"
      style={{
        background:
          "radial-gradient(ellipse 65% 45% at 50% 0%, rgba(255,45,142,0.22) 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 10% 90%, rgba(212,175,55,0.12) 0%, transparent 50%), linear-gradient(180deg, #140a12 0%, #0a0610 50%, #1a0e14 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        aria-hidden
        style={{
          background:
            "linear-gradient(125deg, transparent 22%, rgba(255,200,160,0.16) 48%, rgba(255,45,142,0.14) 54%, transparent 78%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-12 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#FF2D8E]/35 bg-[#FF2D8E]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC] backdrop-blur">
            How RE GEN works
          </p>
          <h2 className="mt-4 font-serif text-4xl font-black tracking-tight text-white lg:text-5xl">
            Four steps to{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              your protocol
            </span>
          </h2>
          <p
            className="mt-2 text-sm font-black uppercase tracking-[0.28em]"
            style={{
              background: "linear-gradient(90deg, #F5D76E 0%, #FF2D8E 55%, #E6007E 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Shop → Intake → Approve → Ship
          </p>
          <p className="mt-3 text-sm font-semibold text-white/75">
            {SITE.freshaReviewRating}★ from {SITE.freshaReviewCount}+ verified visits · NP on site
            daily
          </p>
          <p className="mt-2 text-base font-medium leading-relaxed text-white/65">
            Desire first. Clinical review always. No mystery about what happens after you tap
            checkout.
          </p>
        </div>

        <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step) => (
            <li
              key={step.n}
              className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-[#FF2D8E]/25 bg-[#0a0610] shadow-[0_22px_44px_-16px_rgba(230,0,126,0.45)] transition duration-300 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* Warm HD photo */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 35%, rgba(10,6,16,0.55) 70%, rgba(10,6,16,0.95) 100%), linear-gradient(125deg, transparent 40%, rgba(255,180,140,0.12) 55%, transparent 70%)",
                  }}
                />
                <span
                  className="absolute left-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black text-black"
                  style={{
                    background: "linear-gradient(135deg, #F5D76E 0%, #FF2D8E 55%, #E6007E 100%)",
                    boxShadow:
                      "0 0 20px rgba(255,45,142,0.5), inset 0 1px 0 rgba(255,255,255,0.4)",
                  }}
                >
                  {step.n}
                </span>
              </div>

              <div className="relative flex flex-1 flex-col px-4 pb-5 pt-3">
                <h3 className="font-serif text-xl font-black leading-tight text-white">{step.title}</h3>
                <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-white/70">
                  {step.sell}
                </p>

                {step.chip && step.chipAction ? (
                  <button
                    type="button"
                    onClick={step.chipAction}
                    className="mt-3 rounded-full border border-[#FF2D8E]/50 bg-[#FF2D8E]/15 px-3 py-1.5 text-left text-[11px] font-black uppercase tracking-wide text-[#FFB8DC] transition hover:bg-[#FF2D8E]/25 hover:text-white"
                  >
                    {step.chip} →
                  </button>
                ) : null}

                <p
                  className="mt-3 text-[11px] font-black uppercase tracking-[0.16em]"
                  style={{
                    background: "linear-gradient(90deg, #F5D76E, #FFD700)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {step.trust}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {onShopWeightLoss ? (
            <button
              type="button"
              onClick={onShopWeightLoss}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-3.5 text-sm font-black text-white shadow-[0_0_28px_rgba(255,45,142,0.45)] transition hover:brightness-110"
            >
              Shop weight loss
              {fromPrice ? ` · ${fromPrice}` : ""} →
            </button>
          ) : null}
          {onStartShopping ? (
            <button
              type="button"
              onClick={onStartShopping}
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-black text-white backdrop-blur transition hover:border-[#FF2D8E] hover:bg-[#FF2D8E]/15"
            >
              Browse all goals →
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
