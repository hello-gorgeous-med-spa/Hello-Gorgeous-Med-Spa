import { FadeUp, Section } from "@/components/Section";
import { PEPTIDES_HUB_FAQS } from "@/lib/peptide-seo-faqs";

export function PeptideHubFaqSection() {
  return (
    <Section id="peptide-faqs" className="border-t-4 border-black bg-white">
      <FadeUp>
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6007E]/10 border-2 border-[#E6007E]/30 mb-4">
            <span className="text-sm font-bold uppercase tracking-wider text-[#E6007E]">FAQ</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-black">
            Peptide therapy <span className="text-[#E6007E]">questions</span>
          </h2>
          <p className="mt-4 text-black/70 max-w-2xl mx-auto">
            Oswego, Naperville, Aurora &amp; Plainfield — NP-supervised Hello Gorgeous RX™
          </p>
        </div>
      </FadeUp>

      <div className="max-w-3xl mx-auto space-y-4">
        {PEPTIDES_HUB_FAQS.map((faq, idx) => (
          <FadeUp key={faq.question} delayMs={idx * 40}>
            <details className="group rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.2)] open:shadow-[6px_6px_0_0_rgba(230,0,126,0.35)]">
              <summary className="cursor-pointer list-none px-5 py-4 font-bold text-black flex items-center justify-between gap-3">
                <span>{faq.question}</span>
                <span className="text-[#E6007E] text-xl shrink-0 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 pt-0 text-black/80 leading-relaxed border-t-2 border-black/10">
                {faq.answer}
              </div>
            </details>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}
