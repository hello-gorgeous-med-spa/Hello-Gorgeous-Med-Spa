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

      {/* Hero */}
      <section className="relative overflow-hidden border-b-4 border-black">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/92 via-[#2d1020]/88 to-[#0a0a0a]/95"
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 20% 30%, rgba(230,0,126,0.35), transparent 55%), radial-gradient(ellipse 50% 50% at 85% 70%, rgba(255,45,142,0.25), transparent 50%)",
            }}
            aria-hidden
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-14 md:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#E6007E] animate-pulse" aria-hidden />
              Existing patients only
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">
              Hello Gorgeous RX™ · Oswego, IL
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-black text-white leading-tight">
              GLP-1{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                refill request
              </span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/85 leading-relaxed max-w-xl font-medium">
              Request your next month of tirzepatide or semaglutide. Medication ships{" "}
              <strong className="text-white">directly to your home</strong> after Ryan approves your refill and
              monthly check-in.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Image
                src="/images/marketing/glp1-vial-hello-gorgeous.svg"
                alt=""
                width={72}
                height={108}
                className="drop-shadow-lg opacity-95"
              />
              <Image
                src="/images/marketing/tirzepatide-vial-hello-gorgeous.svg"
                alt=""
                width={72}
                height={108}
                className="drop-shadow-lg opacity-95"
              />
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
