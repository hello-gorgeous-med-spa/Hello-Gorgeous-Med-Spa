import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  FORMULATION_ADDRESS,
  FORMULATION_HUB_LINKS,
  FORMULATION_PARTNER_NAME,
  FORMULATION_PHONE,
  FORMULATION_PROVIDERS_URL,
  REGEN_DESK_PHONE,
  REGEN_STREET,
  type FormulationHubId,
} from "@/lib/regen/formulation-partner";

export function FormulationPartnerShell({
  active,
  startHref,
  closingHeadline,
  sourceLabel,
  sourceHref,
  children,
}: {
  active: FormulationHubId;
  startHref: string;
  closingHeadline: string;
  sourceLabel: string;
  sourceHref: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3efe6] text-[#13241f]">
      <header className="border-b border-white/10 bg-[#0c1613]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/regen/regen-logo-white.png"
              alt="RE GEN RX"
              width={150}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-white/70 lg:flex">
            {FORMULATION_HUB_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={active === link.id ? "text-[#8fd4c4]" : "hover:text-white"}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/safety" className="hover:text-white">
              Pharmacy
            </Link>
            <Link
              href={startHref}
              className="rounded-full bg-[#E91E8C] px-4 py-2 text-white hover:opacity-90"
            >
              Start a visit
            </Link>
          </nav>
          <Link
            href={startHref}
            className="rounded-full bg-[#E91E8C] px-4 py-2 text-sm font-bold text-white lg:hidden"
          >
            Start a visit
          </Link>
        </div>
        <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-5 pb-3 text-sm font-semibold text-white/70 lg:hidden">
          {FORMULATION_HUB_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={active === link.id ? "text-[#8fd4c4]" : "whitespace-nowrap hover:text-white"}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>
      {children}
      <section className="bg-[#0c1613] py-16 text-center text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c4a36a]">
          Illinois practice · Texas 503A pharmacy
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
          {closingHeadline}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          {FORMULATION_ADDRESS}
          <br />
          {FORMULATION_PHONE} · RE GEN desk {REGEN_DESK_PHONE} · {REGEN_STREET}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={startHref}
            className="rounded-full bg-[#c4a36a] px-6 py-3 text-sm font-bold text-[#0c1613]"
          >
            Start a visit
          </Link>
          <a
            href={FORMULATION_PROVIDERS_URL}
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold"
            target="_blank"
            rel="noreferrer"
          >
            Formulation for prescribers ↗
          </a>
        </div>
      </section>
      <footer className="border-t border-[#e7e0d4] bg-[#f3efe6] px-5 py-10 text-sm leading-relaxed text-[#6b7a75]">
        <div className="mx-auto max-w-6xl">
          <p>
            Educational information for Illinois patients and licensed clinicians. Not a substitute
            for independent clinical or legal judgment. Compounded medications are not FDA-approved.
            A request is a consult — not a guaranteed prescription. {FORMULATION_PARTNER_NAME} is a
            LegitScript-certified 503A pharmacy. RE GEN RX is the prescription door of Hello Gorgeous
            Med Spa (Hello Gorgeous PC), Oswego, Illinois.
          </p>
          <p className="mt-3">
            Formulary snapshot summarized from Formulation’s public reference (
            <a className="font-semibold text-[#0f766e] underline" href={sourceHref}>
              {sourceLabel}
            </a>
            ). Confirm current eligibility, strength, and base with the pharmacy before any order.
          </p>
        </div>
      </footer>
    </div>
  );
}
