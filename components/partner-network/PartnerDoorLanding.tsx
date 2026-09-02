import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import {
  PARTNER_CONSULT_USD,
  PARTNER_FEES,
  withPartnerQuery,
} from "@/lib/partner-network";
import { RX_REQUEST_PORTAL_PATH } from "@/lib/rx-request-portal";
import { PEPTIDE_REQUEST_PATH } from "@/lib/flows";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFB8DC",
  wash: "#FFF0F7",
};

export function PartnerDoorLanding({
  code,
  spaName,
  city,
}: {
  code: string;
  spaName: string;
  city: string | null;
}) {
  const startHref = withPartnerQuery(RX_REQUEST_PORTAL_PATH, code);
  const consultHref = withPartnerQuery(PEPTIDE_REQUEST_PATH, code);
  const shopHref = withPartnerQuery("/rx", code);
  const place = city ? `${spaName} · ${city}` : spaName;

  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(230,0,126,0.18), transparent 50%), radial-gradient(ellipse at 90% 10%, rgba(255,45,142,0.14), transparent 45%), linear-gradient(180deg, #FFF0F7 0%, #fff 42%, #f5f5f5 100%)",
        }}
      />

      <section
        className="relative overflow-hidden border-b-4 border-black px-4 py-14 text-white md:py-20"
        style={{
          background:
            "linear-gradient(125deg, #0a0a0a 0%, #2d1020 55%, #1a0a12 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 20%, rgba(230,0,126,0.45), transparent 42%), radial-gradient(circle at 85% 0%, rgba(255,45,142,0.35), transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <p
            className="text-xs font-bold uppercase tracking-[0.28em]"
            style={{ color: BRAND.rose }}
          >
            Referred by {place}
          </p>
          <h1 className="mt-4 font-black leading-[1.05] text-4xl md:text-6xl">
            You&apos;re a{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              Hello Gorgeous
            </span>{" "}
            patient now.
          </h1>
          <p className="mt-5 max-w-xl text-base font-medium text-white/85 md:text-lg">
            {spaName} sent you here for medical peptides and weight loss. We are the clinic.
            They are not a pharmacy. {PRESCRIBING_NP.displayName} reviews every chart.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTA href={startHref} variant="gradient">
              Start your request
            </CTA>
            <Link
              href={consultHref}
              className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/20"
            >
              ${PARTNER_CONSULT_USD} NP consult
            </Link>
          </div>
        </div>
      </section>

      <nav className="border-b-4 border-black bg-white/70 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
          {[
            { href: startHref, label: "Request portal" },
            { href: consultHref, label: `$${PARTNER_CONSULT_USD} consult` },
            { href: shopHref, label: "Browse RE GEN" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-1.5 text-xs font-bold hover:border-[#E6007E] hover:text-[#E6007E]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="px-4 py-12">
        <FadeUp>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-8">
              <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                01
              </span>
              <h2 className="mt-4 text-2xl font-black">How this works</h2>
              <ul className="mt-4 space-y-3 text-black/85 font-medium">
                <li>
                  <span className="font-bold text-[#E6007E]">▸ Clinic of record.</span> Hello
                  Gorgeous RE GEN in Oswego. Not {spaName}&apos;s treatment room.
                </li>
                <li>
                  <span className="font-bold text-[#E6007E]">▸ Your NP.</span>{" "}
                  {PRESCRIBING_NP.displayName} reads the intake and writes the order.{" "}
                  {MEDICAL_DIRECTOR.displayName} is Medical Director of this practice — he does
                  not review every chart.
                </li>
                <li>
                  <span className="font-bold text-[#E6007E]">▸ Their job is the intro.</span>{" "}
                  {spaName} does not store, inject, or sell vials. Medication ships to you or
                  you pick up at Hello Gorgeous.
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border-4 border-black bg-gradient-to-b from-white to-rose-50 p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-8">
              <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                02
              </span>
              <h2 className="mt-4 text-2xl font-black">What you pay</h2>
              <p className="mt-3 text-black/85 font-medium">
                ${PARTNER_CONSULT_USD} NP consult. Medication only after {PRESCRIBING_NP.displayName}{" "}
                approves — published starting rates on the request portal. No outcome promises.
              </p>
              <p className="mt-3 text-sm text-black/60">
                {spaName} is paid ${PARTNER_FEES.spaFirstOrderUsd} only when your first medication
                order is paid — not for scanning this code.
              </p>
            </div>
          </div>
        </FadeUp>
      </section>

      <section
        className="relative overflow-hidden border-t-4 border-black px-4 py-14 text-white"
        style={{
          background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
        }}
      >
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black md:text-4xl">Ready when you are.</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            Start the request on your phone. We&apos;ll take it from here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <CTA href={startHref} variant="white">
              Start request
            </CTA>
            <Link
              href={shopHref}
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/15"
            >
              Browse catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
