"use client";

import Link from "next/link";

import { REGEN_VIAL_ART } from "@/lib/regen-gorgeous20";
import {
  TRYREGEN_BUNDLES,
  TRYREGEN_BUNDLES_LEGAL,
  tryregenBundleRetailUsd,
  tryregenBundleShippingUsd,
  tryregenBundleStartHref,
} from "@/lib/regen/tryregen-bundles";

const BRAND = {
  teal: "#0D9488",
  pink: "#E91E8C",
  dark: "#0A0A0A",
  darkAlt: "#111111",
  cream: "#FAF9F6",
  gray: "#9CA3AF",
};

export function RegenBundlesBand({ id = "energy" }: { id?: string }) {
  const ship = tryregenBundleShippingUsd();

  return (
    <section id={id} className="scroll-mt-28 px-6 py-10" style={{ backgroundColor: BRAND.darkAlt }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
            style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink, border: `1px solid ${BRAND.pink}40` }}
          >
            Energy & longevity
          </span>
          <h2 className="mb-2 font-serif text-2xl font-black md:text-3xl" style={{ color: BRAND.cream }}>
            NAD+, vitamins, and the glow pair.
          </h2>
          <p className="mx-auto max-w-xl text-sm" style={{ color: BRAND.gray }}>
            One card, one price, one cold ship. Your Illinois NP reviews the request and
            prescribes only if it is clinically appropriate.
          </p>
          <img
            src={REGEN_VIAL_ART.lineup}
            alt="REGEN RX vial lineup"
            className="mx-auto mt-5 h-28 w-auto max-w-full object-contain md:h-36"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRYREGEN_BUNDLES.map((bundle) => {
            const price = tryregenBundleRetailUsd(bundle);
            return (
              <Link
                key={bundle.id}
                href={tryregenBundleStartHref(bundle)}
                className="group rounded-2xl p-4 transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}30` }}
              >
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: BRAND.teal }}>
                  {bundle.tagline}
                </p>
                <h3 className="mb-1 text-base font-bold" style={{ color: BRAND.cream }}>
                  {bundle.name}
                </h3>
                <p className="mb-3 text-xs leading-relaxed" style={{ color: BRAND.gray }}>
                  {bundle.description}
                </p>
                <ul className="mb-3 space-y-0.5">
                  {bundle.boomrxSheetNames.map((name) => (
                    <li key={name} className="text-[11px]" style={{ color: BRAND.cream }}>
                      {name.replace(/^GLOW \((.+)\)$/, "$1")}
                    </li>
                  ))}
                </ul>
                <p className="text-xl font-black" style={{ color: BRAND.pink }}>
                  ${price}
                  <span className="ml-2 text-xs font-medium" style={{ color: BRAND.gray }}>
                    + ${ship} ship
                  </span>
                </p>
                <span
                  className="mt-2 inline-flex text-xs font-bold transition-transform group-hover:translate-x-1"
                  style={{ color: BRAND.teal }}
                >
                  Start intake →
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-[11px] leading-relaxed" style={{ color: "#666" }}>
          {TRYREGEN_BUNDLES_LEGAL}
        </p>
      </div>
    </section>
  );
}
