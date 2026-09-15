import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  FORMULATION_HUB_LINKS,
  REGEN_DESK_PHONE,
  REGEN_STREET,
  type FormulationHubId,
} from "@/lib/regen/formulation-partner";
import { REGEN_TELEHEALTH_PATH, regenTelehealthPriceLabel } from "@/lib/regen/telehealth-consult";

export function FormulationPartnerShell({
  active,
  startHref,
  closingHeadline,
  children,
}: {
  active: FormulationHubId;
  startHref: string;
  closingHeadline: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <header className="border-b border-white/10 bg-[#0A0A0A]">
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
                className={active === link.id ? "text-[#0D9488]" : "hover:text-white"}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/safety" className="hover:text-white">
              Safety
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
              className={active === link.id ? "text-[#0D9488]" : "whitespace-nowrap hover:text-white"}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>
      {children}
      <section className="bg-[#0A0A0A] py-16 text-center text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0D9488]">
          Illinois practice · licensed 503A compounding
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
          {closingHeadline}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          Hello Gorgeous PC · {REGEN_STREET}
          <br />
          RE GEN desk {REGEN_DESK_PHONE}
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/50">
          Start a visit, a licensed Illinois clinician reviews, then you pay the invoice. If they
          don&apos;t prescribe, we refund.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={startHref}
            className="rounded-full bg-[#E91E8C] px-6 py-3 text-sm font-bold text-white"
          >
            Start a visit
          </Link>
          <Link
            href={REGEN_TELEHEALTH_PATH}
            className="rounded-full border-2 border-[#0D9488] px-6 py-3 text-sm font-bold text-[#2DD4BF]"
          >
            Book a consult · {regenTelehealthPriceLabel()}
          </Link>
        </div>
      </section>
      <footer className="border-t border-[#0D9488]/15 bg-[#FAF9F6] px-5 py-10 text-sm leading-relaxed text-[#6B7280]">
        <div className="mx-auto max-w-6xl">
          <p>
            Educational information for Illinois patients. Not a substitute for independent clinical
            judgment. Compounded medications are prepared by a US-licensed 503A compounding pharmacy
            and are not FDA-approved. A request is a consult — not a guaranteed prescription. RE GEN
            RX is the prescription door of Hello Gorgeous Med Spa (Hello Gorgeous PC), Oswego,
            Illinois.
          </p>
        </div>
      </footer>
    </div>
  );
}
