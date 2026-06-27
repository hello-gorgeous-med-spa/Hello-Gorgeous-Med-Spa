import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Glp1RefillForm } from "@/components/forms/Glp1RefillForm";
import { GLP1_INTAKE_PATH, GLP1_REFILL_PATH } from "@/lib/flows";
import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import {
  GLP1_SEMAGLUTIDE_DOSE_TIERS,
  GLP1_TIRZEPATIDE_DOSE_TIERS,
  GLP1_INSURANCE_OVERSIGHT,
} from "@/lib/glp1-dose-tiers";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "GLP-1 Refill Request | Tirzepatide & Semaglutide | Hello Gorgeous RX™",
  description:
    "Existing Hello Gorgeous GLP-1 patients: request your monthly tirzepatide or semaglutide refill with home delivery. Ryan Kent, FNP-BC — Oswego, IL.",
  path: GLP1_REFILL_PATH,
});

export default function Glp1RefillPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50/80 via-white to-white text-black">
      <div className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="font-serif text-lg font-semibold text-black hover:text-[#E6007E]">
            <span className="text-[#E6007E]">Hello Gorgeous</span>
            <span className="text-black/70 text-sm font-sans font-medium ml-2">RX™</span>
          </Link>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/glp1-weight-loss" className="text-[#E6007E] font-medium hover:underline">
              Program overview
            </Link>
            <span className="text-black/30">|</span>
            <Link href={GLP1_INTAKE_PATH} className="text-black/70 hover:text-[#E6007E]">
              New patient intake
            </Link>
            <span className="text-black/30">|</span>
            <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-black/70 hover:text-[#E6007E]">
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
          <div className="shrink-0 flex justify-center md:justify-start">
            <Image
              src="/images/marketing/glp1-vial-hello-gorgeous.svg"
              alt=""
              width={100}
              height={150}
              className="drop-shadow-md"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E] mb-2">
              Existing patients only
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-black leading-tight mb-3">
              GLP-1 refill request
            </h1>
            <p className="text-black/70 text-sm md:text-base leading-relaxed max-w-xl mb-3">
              Request your next month of{" "}
              <strong className="text-black">tirzepatide</strong> or{" "}
              <strong className="text-black">semaglutide</strong>. Medication ships{" "}
              <strong className="text-black">directly to your home</strong> after Ryan approves your refill
              and monthly check-in.
            </p>
            <ul className="text-sm text-black/65 space-y-1 max-w-xl">
              <li>
                <strong className="text-black">From ${GLP1_PROGRAM.injectable.monthlyFromUsd}/mo</strong> — medication
                included · price scales with weekly dose
              </li>
              <li>
                <strong className="text-black">Semaglutide</strong>:{" "}
                {GLP1_SEMAGLUTIDE_DOSE_TIERS.map((t) => `${t.doseLabel} $${t.priceUsd}`).join(" · ")}
              </li>
              <li>
                <strong className="text-black">Tirzepatide</strong>:{" "}
                {GLP1_TIRZEPATIDE_DOSE_TIERS.map((t) => `${t.doseLabel} $${t.priceUsd}`).join(" · ")}
              </li>
              <li>
                <strong className="text-black">Insurance oversight</strong>: ${GLP1_INSURANCE_OVERSIGHT.monthlyUsd}/mo
                (med via your plan)
              </li>
              <li>Price calculates automatically when you select your dose tier</li>
              <li>Monthly NP check-in required before each refill</li>
              <li>
                New to Hello Gorgeous?{" "}
                <Link href={GLP1_INTAKE_PATH} className="text-[#E6007E] font-semibold underline">
                  Start with screening intake
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Glp1RefillForm />

        <p className="mt-10 text-xs text-black/50 text-center max-w-2xl mx-auto leading-relaxed">
          Questions? Call{" "}
          <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-[#E6007E] font-medium">
            {SITE.phone}
          </a>
          . By continuing you agree we may contact you at the information you provide. See our{" "}
          <Link href="/privacy" className="text-[#E6007E] underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
