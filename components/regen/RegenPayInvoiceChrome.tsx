import Image from "next/image";

import { MEDICAL_DIRECTOR, PRESCRIBING_NP, PRESCRIBING_NP_NPI } from "@/lib/medical-authority";
import { REGEN_BRAND, REGEN_LOGO } from "@/lib/regen-brand";
import { SITE } from "@/lib/seo";

export function RegenPayInvoiceChrome({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const address = `${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}`;

  return (
    <main className="min-h-screen bg-[#d9d9d9] text-[#222] px-3 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-[720px] bg-white shadow-sm border border-[#c8c8c8]">
        <header className="border-b border-[#c8c8c8] px-5 py-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Image
              src={REGEN_LOGO.primary}
              alt={REGEN_LOGO.alt}
              width={220}
              height={124}
              priority
              className="h-14 w-auto object-contain object-left"
            />
            <Image
              src="/images/logo-full.png"
              alt={SITE.name}
              width={180}
              height={64}
              priority
              className="h-12 w-auto object-contain object-right"
            />
          </div>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0D9488]">
            {REGEN_BRAND.fullName}
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#111]">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#444]">
            {address}
            <br />
            {SITE.phone} · Clinician-reviewed clinic invoice
          </p>
        </header>
        <div className="px-5 py-6 sm:px-8">{children}</div>
        <footer className="border-t border-[#c8c8c8] bg-[#f4f4f4] px-5 py-4 text-[11px] leading-relaxed text-[#555] sm:px-8">
          <p>
            {SITE.name} · REGEN RX · {address}
          </p>
          <p className="mt-1">
            Prescriber: {PRESCRIBING_NP.displayName} · NPI {PRESCRIBING_NP_NPI}
            <br />
            Medical Director: {MEDICAL_DIRECTOR.displayName}
          </p>
          <p className="mt-2">
            Card is entered on Bluefin PayConex and is not stored on this website. Compounded
            medication is not FDA-approved. Illinois patients only.
          </p>
        </footer>
      </div>
    </main>
  );
}
