import Link from "next/link";

import { MedicalHubNavGrid } from "@/components/medical/MedicalHubNav";
import { FadeUp } from "@/components/Section";
import { HOMEPAGE_AESTHETICS_ANCHOR, HOMEPAGE_MEDICAL_ANCHOR } from "@/lib/homepage-buyer-paths";
import { MEDICAL_HUB_UTILITIES } from "@/lib/medical-hub-nav";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

/** Clean RX entry — Hims-style category navigation (no poster cards or glow). */
export function HomepageRxNavigator() {
  return (
    <section
      id={HOMEPAGE_MEDICAL_ANCHOR}
      className="scroll-mt-20 border-b border-neutral-200 bg-white"
      aria-labelledby="homepage-rx-nav-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <FadeUp className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Hello Gorgeous RX
          </p>
          <h2
            id="homepage-rx-nav-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
          >
            Prescription care, supervised by an FNP.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-neutral-600">
            GLP-1, hormones, peptides, and lab panels — pay online, telehealth with Ryan Kent, FNP-BC,
            ship to your door in Illinois.
          </p>
        </FadeUp>

        <FadeUp delayMs={60} className="mt-10">
          <MedicalHubNavGrid />
        </FadeUp>

        <FadeUp delayMs={100}>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-neutral-100 pt-8">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">Quick links</span>
            {MEDICAL_HUB_UTILITIES.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </FadeUp>

        <FadeUp delayMs={120}>
          <p className="mt-8 text-sm text-neutral-500">
            In-office med spa treatments —{" "}
            <Link
              href={`#${HOMEPAGE_AESTHETICS_ANCHOR}`}
              className="font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-900"
            >
              see aesthetics below
            </Link>
            . Questions?{" "}
            <Link
              href={PRIMARY_BOOKING_CTA.href}
              className="font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-900"
            >
              {PRIMARY_BOOKING_CTA.shortLabel}
            </Link>
            .
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
