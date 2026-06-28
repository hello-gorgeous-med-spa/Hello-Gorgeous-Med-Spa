import type { Metadata } from "next";
import Link from "next/link";

import { Glp1RefillForm } from "@/components/forms/Glp1RefillForm";
import {
  RxIntakeLegalFooter,
  RxIntakeShell,
  RxIntakeTrustStrip,
} from "@/components/rx/intake/RxIntakeShell";
import { RxIntakePricingAccordion } from "@/components/rx/intake/RxIntakePricingAccordion";
import { GLP1_INTAKE_PATH, GLP1_REFILL_PATH, RX_PATIENT_CARE_PATH } from "@/lib/flows";
import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import {
  GLP1_SEMAGLUTIDE_DOSE_TIERS,
  GLP1_TIRZEPATIDE_DOSE_TIERS,
  GLP1_INSURANCE_OVERSIGHT,
} from "@/lib/glp1-dose-tiers";
import {
  NAD_SERMORELIN_BUNDLE_MONTHLY_USD,
  PEPTIDE_MONTHLY_ADDONS,
} from "@/lib/peptide-monthly-addons";
import { RX_INTAKE_NAV_GLPI_REFILL } from "@/lib/rx-intake-nav";
import { pageMetadata, SITE } from "@/lib/seo";

const HERO_IMAGE = "/images/shop-rx/glp1-refill.png";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "GLP-1 Refill Request | Tirzepatide & Semaglutide | Hello Gorgeous RX™",
    description:
      "Existing Hello Gorgeous GLP-1 patients: request your monthly tirzepatide or semaglutide refill with home delivery. Ryan Kent, FNP-BC — Oswego, IL.",
    path: GLP1_REFILL_PATH,
  }),
  openGraph: {
    ...pageMetadata({
      title: "GLP-1 Refill Request | Hello Gorgeous RX™",
      description:
        "Request your monthly GLP-1 refill with home delivery. Pay invoice, download guides, and book your check-in.",
      path: GLP1_REFILL_PATH,
    }).openGraph,
    images: [
      {
        url: `${SITE.url}${HERO_IMAGE}`,
        width: 512,
        height: 768,
        alt: "Hello Gorgeous GLP-1 refill — ship to your door",
      },
    ],
  },
};

export default function Glp1RefillPage() {
  return (
    <RxIntakeShell
      navLinks={RX_INTAKE_NAV_GLPI_REFILL}
      hero={{
        pill: "Existing patients · Secure intake",
        locality: "Hello Gorgeous RX™ · Oswego, IL",
        title: "GLP-1",
        titleAccent: "refill request",
        imageSrc: HERO_IMAGE,
        imageAlt: "Hello Gorgeous GLP-1 weight loss — tirzepatide and semaglutide home delivery",
        body: (
          <>
            A guided, step-by-step refill — medication ships to your home after Ryan approves your request
            and any required telehealth is complete. Most patients finish in under{" "}
            <strong className="text-white">5 minutes</strong>.
          </>
        ),
      }}
    >
      <RxIntakeTrustStrip />

      <RxIntakePricingAccordion title="GLP-1 pricing & add-ons">
        <p>
          <strong className="text-black">From ${GLP1_PROGRAM.injectable.monthlyFromUsd}/mo</strong> — medication
          included · price scales with weekly dose
        </p>
        <p>
          <strong className="text-black">Semaglutide</strong>:{" "}
          {GLP1_SEMAGLUTIDE_DOSE_TIERS.map((t) => `${t.doseLabel} $${t.priceUsd}`).join(" · ")}
        </p>
        <p>
          <strong className="text-black">Tirzepatide</strong>:{" "}
          {GLP1_TIRZEPATIDE_DOSE_TIERS.map((t) => `${t.doseLabel} $${t.priceUsd}`).join(" · ")}
        </p>
        <p>
          <strong className="text-black">Insurance oversight</strong>: ${GLP1_INSURANCE_OVERSIGHT.monthlyUsd}/mo
          (med via your plan)
        </p>
        <p>90-day prepay includes one cold-chain shipping fee · total shown before you pay</p>
        <p>
          <strong className="text-black">Optional add-ons</strong>: NAD+ $
          {PEPTIDE_MONTHLY_ADDONS.find((a) => a.id === "nad-plus")?.monthlyUsd}/mo · Sermorelin $
          {PEPTIDE_MONTHLY_ADDONS.find((a) => a.id === "sermorelin")?.monthlyUsd}/mo · bundles from $
          {NAD_SERMORELIN_BUNDLE_MONTHLY_USD}/mo
        </p>
        <p>
          New to Hello Gorgeous?{" "}
          <Link href={GLP1_INTAKE_PATH} className="font-semibold text-[#E6007E] underline">
            Start with screening intake
          </Link>{" "}
          or explore the{" "}
          <Link href={RX_PATIENT_CARE_PATH} className="font-semibold text-[#E6007E] underline">
            patient care hub
          </Link>
          .
        </p>
      </RxIntakePricingAccordion>

      <Glp1RefillForm />

      <RxIntakeLegalFooter />
    </RxIntakeShell>
  );
}
