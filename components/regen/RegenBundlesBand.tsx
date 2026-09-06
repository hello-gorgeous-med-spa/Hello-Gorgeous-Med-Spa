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

const BUNDLE_ART: Record<string, string> = {
  recovery: REGEN_VIAL_ART.recovery,
  "full-recovery": REGEN_VIAL_ART.fullRecovery,
  peak: REGEN_VIAL_ART.peak,
};

const BRAND = {
  teal: "#0D9488",
  pink: "#E91E8C",
  dark: "#0A0A0A",
  darkAlt: "#111111",
  cream: "#FAF9F6",
  gray: "#9CA3AF",
};

export function RegenBundlesBand({ id = "bundles" }: { id?: string }) {
  const ship = tryregenBundleShippingUsd();

  return (
    <section id={id} className="py-16 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink, border: `1px solid ${BRAND.pink}40` }}
          >
            Bundles
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: BRAND.cream }}>
            Request a BoomRx stack.
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: BRAND.gray }}>
            One card, one price, one cold ship. Your Illinois NP reviews the request and
            prescribes only if it is clinically appropriate.
          </p>
          <img
            src={REGEN_VIAL_ART.lineup}
            alt="REGEN RX vial lineup"
            className="mt-8 w-full max-h-[320px] rounded-3xl object-cover border"
            style={{ borderColor: `${BRAND.teal}40` }}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRYREGEN_BUNDLES.map((bundle) => {
            const price = tryregenBundleRetailUsd(bundle);
            return (
              <Link
                key={bundle.id}
                href={tryregenBundleStartHref(bundle)}
                className="group rounded-2xl p-6 transition-all hover:-translate-y-1"
                style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}30` }}
              >
                {BUNDLE_ART[bundle.id] ? (
                  <img
                    src={BUNDLE_ART[bundle.id]}
                    alt=""
                    className="mb-4 h-36 w-full rounded-xl object-cover"
                  />
                ) : null}
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: BRAND.teal }}>
                  {bundle.tagline}
                </p>
                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>
                  {bundle.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: BRAND.gray }}>
                  {bundle.description}
                </p>
                <ul className="mb-4 space-y-1">
                  {bundle.boomrxSheetNames.map((name) => (
                    <li key={name} className="text-xs" style={{ color: BRAND.cream }}>
                      {name}
                    </li>
                  ))}
                </ul>
                <p className="text-2xl font-black" style={{ color: BRAND.pink }}>
                  ${price}
                  <span className="ml-2 text-sm font-medium" style={{ color: BRAND.gray }}>
                    + ${ship} ship
                  </span>
                </p>
                <span
                  className="mt-4 inline-flex text-sm font-bold group-hover:translate-x-1 transition-transform"
                  style={{ color: BRAND.teal }}
                >
                  Start intake →
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-10 max-w-3xl mx-auto text-center text-xs leading-relaxed" style={{ color: "#666" }}>
          {TRYREGEN_BUNDLES_LEGAL}
        </p>
      </div>
    </section>
  );
}
