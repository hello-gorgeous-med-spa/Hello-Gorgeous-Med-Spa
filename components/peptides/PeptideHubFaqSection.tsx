import { FadeUp, Section } from "@/components/Section";
import { PEPTIDES_HUB_FAQS } from "@/lib/peptide-seo-faqs";

export function PeptideHubFaqSection() {
  return (
    <Section id="peptide-faqs" className="border-t border-neutral-200 bg-white">
      <FadeUp>
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-2xl font-black text-neutral-900 md:text-3xl">Common questions</h2>
          <p className="mt-3 text-neutral-600">
            Oswego, Naperville, Aurora &amp; Plainfield — NP-supervised Hello Gorgeous RX™
          </p>
        </div>
      </FadeUp>

      <div className="mx-auto max-w-3xl space-y-3">
        {PEPTIDES_HUB_FAQS.map((faq, idx) => (
          <FadeUp key={faq.question} delayMs={idx * 30}>
            <details className="group rounded-xl border border-neutral-200 bg-white open:shadow-sm">
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-neutral-900 flex items-center justify-between gap-3">
                <span>{faq.question}</span>
                <span className="text-neutral-400 text-lg shrink-0 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 pt-0 text-neutral-600 leading-relaxed border-t border-neutral-100">
                {faq.answer}
              </div>
            </details>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}
