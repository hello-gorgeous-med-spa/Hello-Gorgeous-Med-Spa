import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { HELLO_GORGEOUS_RX_START_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import {
  formatFromMonthly,
  PEPTIDE_PREPAY_DISCOUNT_PERCENT,
  PEPTIDE_PREPAY_MONTHS,
  PEPTIDE_PRICING_DISCLAIMER,
  PEPTIDE_RETAIL_FROM_MONTHLY_USD,
  peptideRetailMenuByCategory,
} from "@/lib/peptide-retail-pricing";

export function PeptideRetailPricingSection() {
  const groups = peptideRetailMenuByCategory();

  return (
    <Section
      id="peptide-pricing"
      className="border-t-4 border-black bg-gradient-to-b from-white via-[#FFF0F7]/40 to-white"
    >
      <FadeUp>
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6007E] text-white border-2 border-black mb-4">
            <span className="text-sm font-bold uppercase tracking-wider">Hello Gorgeous RX™</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-black">
            Peptide &amp; wellness <span className="text-[#E6007E]">pricing</span>
          </h2>
          <p className="mt-4 text-black/75 max-w-2xl mx-auto text-lg leading-relaxed">
            Provider-guided options after NP-led evaluation. Published starting rates below — your
            final protocol is confirmed at consult.
          </p>
        </div>
      </FadeUp>

      <FadeUp delayMs={60}>
        <div className="max-w-3xl mx-auto mb-10 rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#E6007E]">
                Peptide consultation
              </p>
              <p className="mt-1 text-4xl font-black text-black">${PEPTIDE_CONSULT_FEE_USD}</p>
              <p className="mt-2 text-sm text-black/70">
                NP evaluation · goals · protocol design · telehealth booking
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm font-bold text-black">Monthly protocols</p>
              <p className="text-2xl font-black text-[#E6007E]">
                From ${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo
              </p>
              <p className="mt-1 text-xs text-black/60">
                {PEPTIDE_PREPAY_MONTHS}-month prepay: {PEPTIDE_PREPAY_DISCOUNT_PERCENT}% off medication
              </p>
            </div>
          </div>
        </div>
      </FadeUp>

      <div className="max-w-4xl mx-auto space-y-8">
        {groups.map((group, gi) => (
          <FadeUp key={group.category} delayMs={80 + gi * 40}>
            <div className="rounded-3xl border-4 border-black bg-white overflow-hidden shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
              <div className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-3 border-b-4 border-black">
                <h3 className="font-black text-white text-sm uppercase tracking-wider">
                  {group.category}
                </h3>
              </div>
              <ul className="divide-y-2 divide-black/10">
                {group.rows.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-4"
                  >
                    <div>
                      <p className="font-bold text-black">{row.name}</p>
                      {row.note ? (
                        <p className="text-sm text-black/65 mt-0.5">{row.note}</p>
                      ) : null}
                    </div>
                    <p className="font-black text-[#E6007E] shrink-0">
                      {formatFromMonthly(row.fromMonthlyUsd)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delayMs={320}>
        <p className="mt-10 max-w-3xl mx-auto text-center text-xs text-black/55 leading-relaxed">
          {PEPTIDE_PRICING_DISCLAIMER}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <CTA href={HELLO_GORGEOUS_RX_START_PATH} variant="gradient">
            Start Here
          </CTA>
          <CTA href={PEPTIDE_REQUEST_PATH} variant="outline" className="border-[#E6007E] text-[#E6007E]">
            Request or refill
          </CTA>
        </div>
      </FadeUp>
    </Section>
  );
}
