"use client";

import Link from "next/link";
import { ContourBookLink } from "@/components/marketing/ContourBookLink";
import { SITE } from "@/lib/seo";

const PINK = "#E6007E";
const SMS_HREF = `sms:${SITE.phone.replace(/\D/g, "")}`;

export function QuantumRFStickyCta() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-black bg-black p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.45)] md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-1.5">
        <Link
          href="/contour-lift/inquiry"
          className="flex min-h-[48px] items-center justify-center rounded-md border border-white/20 bg-white/5 px-1 text-[0.6rem] font-bold uppercase leading-tight tracking-tight text-white"
          data-cl-only
          data-cl-event="contour_lift_candidate_cta_click"
          data-cl-placement="quantum_sticky"
        >
          Candidate
        </Link>
        <ContourBookLink
          className="flex min-h-[48px] items-center justify-center rounded-md py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-95"
          style={{ backgroundColor: PINK }}
          data-cl-placement="quantum_sticky"
        >
          Book
        </ContourBookLink>
        <a
          href={SMS_HREF}
          className="flex min-h-[48px] items-center justify-center rounded-md border-2 border-white/80 text-[0.7rem] font-bold uppercase tracking-wide text-white"
          data-sms-click
          data-cl-only
          data-cl-event="contour_lift_sms_click"
          data-cl-placement="quantum_sticky"
        >
          Text
        </a>
      </div>
    </div>
  );
}
