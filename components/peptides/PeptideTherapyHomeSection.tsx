import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { FEATURED_CLINIC_PEPTIDES, PEPTIDE_CONSULT_SPECIAL } from "@/lib/peptide-featured";
import { INJECTION_MENU_PATH } from "@/lib/injection-menu";
import { PEPTIDES_HUB_PATH } from "@/lib/peptides-hub";
import { BOOKING_URL } from "@/lib/flows";

/** Homepage + landing promo — peptide authority for Oswego & suburbs. */
export function PeptideTherapyHomeSection() {
  return (
    <Section className="border-y-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#1a0a12] to-black text-white py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <FadeUp>
          <p className="text-[#FFB8DC] text-sm font-bold uppercase tracking-[0.2em] mb-3">
            Oswego · Naperville · Aurora · Plainfield
          </p>
          <h2 className="text-3xl md:text-4xl font-black leading-tight">
            Peptide therapy —{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              we have it all
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-3xl font-medium">
            BPC-157, Sermorelin, GHK-Cu, Tesamorelin, PT-141, NAD+, glutathione &amp; GLP-1 options — prescribed and
            supervised by Ryan Kent, FNP-BC. Not internet peptides. Real medical protocols.
          </p>
        </FadeUp>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURED_CLINIC_PEPTIDES.map((p, i) => (
            <FadeUp key={p.slug} delayMs={i * 30}>
              <Link
                href={`${PEPTIDES_HUB_PATH}/${p.slug}`}
                className="block rounded-2xl border-2 border-white/15 bg-white/5 p-4 hover:border-[#FF2D8E] hover:bg-white/10 transition-colors"
              >
                <span className="text-2xl" aria-hidden>
                  {p.icon}
                </span>
                <p className="mt-2 font-bold text-white">{p.name}</p>
                <p className="text-sm text-white/70 mt-1">{p.benefit}</p>
              </Link>
            </FadeUp>
          ))}
        </div>

        <FadeUp delayMs={120} className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
          <CTA href={BOOKING_URL} variant="gradient" className="shadow-xl shadow-[#FF2D8E]/25">
            {PEPTIDE_CONSULT_SPECIAL.price} {PEPTIDE_CONSULT_SPECIAL.label}
          </CTA>
          <CTA href="/peptide-therapy-oswego" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
            Peptide therapy Oswego
          </CTA>
          <CTA href={PEPTIDES_HUB_PATH} variant="outline" className="border-white/40 text-white">
            Education hub
          </CTA>
          <CTA href={INJECTION_MENU_PATH} variant="outline" className="border-white/40 text-white">
            Injection menu
          </CTA>
        </FadeUp>
        <p className="mt-4 text-sm text-white/55">{PEPTIDE_CONSULT_SPECIAL.detail}</p>
      </div>
    </Section>
  );
}
