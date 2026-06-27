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

const HERO_IMAGE = "/images/homepage-services/compounded-tirzepatide-weight-loss.png";

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
        width: 1024,
        height: 682,
        alt: "Hello Gorgeous GLP-1 weight loss refill — tirzepatide and semaglutide home delivery",
      },
    ],
  },
};

export default function Glp1RefillPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF0F7] via-white to-white text-black">
      <div className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
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

      {/* Hero — solid dark base so text stays readable even if the photo fails to load */}
      <section className="relative overflow-hidden border-b-4 border-black bg-[#1a0812]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 15% 40%, rgba(230,0,126,0.45), transparent 60%), radial-gradient(ellipse 50% 60% at 90% 80%, rgba(255,45,142,0.3), transparent 55%)",
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-5xl px-4 py-12 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#E6007E] animate-pulse" aria-hidden />
                Existing patients only
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">
                Hello Gorgeous RX™ · Oswego, IL
              </p>
              <h1 className="mt-3 font-serif text-4xl md:text-5xl font-black leading-tight">
                <span className="text-white">GLP-1 </span>
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  refill request
                </span>
              </h1>
              <p className="mt-4 text-base md:text-lg text-[#FFB8DC]/95 leading-relaxed max-w-xl font-medium">
                Request your next month of tirzepatide or semaglutide. Medication ships{" "}
                <strong className="text-white">directly to your home</strong> after Ryan approves your refill
                and monthly check-in.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.45)]">
                <Image
                  src={HERO_IMAGE}
                  alt="Hello Gorgeous GLP-1 weight loss — tirzepatide and semaglutide home delivery"
                  width={1024}
                  height={682}
                  priority
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 90vw, 480px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="mb-10 rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#E6007E]">Pricing at a glance</h2>
          <ul className="mt-4 text-sm text-black/75 space-y-2">
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
            <li>After submit: download guides, pay invoice, or set up monthly auto-pay</li>
            <li>
              <strong className="text-black">Monthly add-ons</strong>: NAD+ $169/mo · Sermorelin $149/mo ·
              injectable bundle $289/mo · NAD+ liquid + Sermorelin RDT combo $299/mo
            </li>
            <li>
              New to Hello Gorgeous?{" "}
              <Link href={GLP1_INTAKE_PATH} className="text-[#E6007E] font-semibold underline">
                Start with screening intake
              </Link>
            </li>
          </ul>
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
