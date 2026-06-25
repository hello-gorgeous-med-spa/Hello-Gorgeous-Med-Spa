import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  GLP1_PROGRAM,
  GLP1_PROGRAM_CONSULT_USD,
  GLP1_PROGRAM_DISCLAIMER,
} from "@/lib/glp1-program-pricing";
import { GLP1_INTAKE_PATH, PROGRAM_CONSULT_BOOKING_URL } from "@/lib/flows";

const PINK = "#E6007E";

export function Glp1ProgramOfferSection({
  variant = "light",
  id = "program-pricing",
}: {
  variant?: "light" | "dark";
  id?: string;
}) {
  const dark = variant === "dark";
  const { injectable, oral, pharmacyRx } = GLP1_PROGRAM;

  return (
    <Section
      id={id}
      className={`scroll-mt-24 border-t-4 border-black ${dark ? "bg-[#0a0a0a] text-white" : "bg-white text-black"}`}
    >
      <div className="mx-auto max-w-3xl px-4 py-14 md:py-16">
        <FadeUp>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: dark ? "#FFB8DC" : PINK }}
          >
            Program pricing · Oswego, IL
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Medical weight loss —{" "}
            <span style={{ color: dark ? "#FF2D8E" : PINK }}>clear numbers upfront</span>
          </h2>
          <p className={`mt-4 text-sm leading-relaxed ${dark ? "text-white/75" : "text-black/70"}`}>
            {GLP1_PROGRAM.newPatientIntro} {GLP1_PROGRAM.consultCredit}
          </p>
        </FadeUp>

        <FadeUp delayMs={40}>
          <div
            className={`mt-8 rounded-2xl border-4 border-black p-6 md:p-8 ${
              dark ? "bg-[#151922]" : "bg-gradient-to-br from-rose-50 to-white"
            } shadow-[8px_8px_0_0_rgba(230,0,126,0.25)]`}
          >
            <h3 className="text-lg font-black uppercase tracking-tight">{injectable.heading}</h3>
            <p className={`mt-1 text-sm ${dark ? "text-white/60" : "text-black/60"}`}>{injectable.includes}</p>
            <ul className={`mt-5 space-y-2 text-sm font-medium ${dark ? "text-white/90" : "text-black/85"}`}>
              <li>
                Monthly subscriptions start at{" "}
                <strong className={dark ? "text-[#FFB8DC]" : "text-[#E6007E]"}>
                  ${injectable.monthlyFromUsd}/month
                </strong>{" "}
                ({injectable.pendingNote})
              </li>
              <li>
                Semaglutide injectable from{" "}
                <strong>${injectable.semaglutideFromUsd}/month</strong>
              </li>
              <li>
                Tirzepatide injectable from{" "}
                <strong>${injectable.tirzepatideStarterUsd}/month</strong> · standard $
                {injectable.tirzepatideStandardUsd}/mo · advanced ${injectable.tirzepatideAdvancedUsd}/mo
              </li>
              <li>
                3-month subscription starting at{" "}
                <strong>${injectable.threeMonthFromUsd}</strong> ({injectable.pendingNote})
              </li>
              <li>
                High-dose 3-month protocol from <strong>${injectable.threeMonthHighDoseFromUsd}</strong>
              </li>
            </ul>
          </div>
        </FadeUp>

        <FadeUp delayMs={60}>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div
              className={`rounded-2xl border-2 p-5 ${dark ? "border-white/15 bg-[#151922]" : "border-black/10 bg-neutral-50"}`}
            >
              <h3 className="font-bold">Oral medications</h3>
              <p className={`mt-2 text-sm ${dark ? "text-white/70" : "text-black/70"}`}>
                Monthly subscription{" "}
                <strong>
                  ${oral.monthlyFromUsd}–${oral.monthlyToUsd}
                </strong>{" "}
                {oral.note}.
              </p>
            </div>
            <div
              className={`rounded-2xl border-2 p-5 ${dark ? "border-white/15 bg-[#151922]" : "border-black/10 bg-neutral-50"}`}
            >
              <h3 className="font-bold">Preferred pharmacy option</h3>
              <p className={`mt-2 text-sm ${dark ? "text-white/70" : "text-black/70"}`}>
                Monthly charge <strong>${pharmacyRx.monthlyEvalUsd}</strong> — {pharmacyRx.note}.{" "}
                <span className="block mt-2 text-xs opacity-80">{pharmacyRx.disclaimer}</span>
              </p>
            </div>
          </div>
        </FadeUp>

        <FadeUp delayMs={80}>
          <p className={`mt-6 text-sm font-semibold ${dark ? "text-[#FFB8DC]" : "text-[#E6007E]"}`}>
            ✓ {GLP1_PROGRAM.followUpIncluded}
          </p>
          <p className={`mt-4 text-xs leading-relaxed ${dark ? "text-white/45" : "text-black/50"}`}>
            {GLP1_PROGRAM_DISCLAIMER}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <CTA href={PROGRAM_CONSULT_BOOKING_URL} variant="gradient">
              Book ${GLP1_PROGRAM_CONSULT_USD} consult
            </CTA>
            <CTA href="/quiz/glp-1-readiness" variant="outline" className={dark ? "!border-white/30 !text-white" : ""}>
              Take GLP-1 screener
            </CTA>
            <Link
              href={GLP1_INTAKE_PATH}
              className={`inline-flex items-center justify-center rounded-xl border-2 px-6 py-3 text-sm font-bold transition ${
                dark
                  ? "border-white/20 text-white hover:border-[#FF2D8E]"
                  : "border-black/20 hover:border-[#E6007E] hover:text-[#E6007E]"
              }`}
            >
              Start secure intake →
            </Link>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
