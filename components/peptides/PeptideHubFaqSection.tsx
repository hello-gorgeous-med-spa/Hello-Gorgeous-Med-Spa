import {
  JOURNEY_SECTION_BG_A,
  JourneySectionHead,
} from "@/components/marketing/JourneyPageUi";
import { FadeUp } from "@/components/Section";
import { PEPTIDES_HUB_FAQS } from "@/lib/peptide-seo-faqs";

export function PeptideHubFaqSection() {
  return (
    <section id="peptide-faqs" className={`scroll-mt-20 ${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
      <div className="mx-auto max-w-3xl">
        <FadeUp>
          <JourneySectionHead
            eyebrow="Common questions"
            title="Peptide therapy"
            titleAccent="FAQs"
            description="Oswego, Naperville, Aurora & Plainfield — NP-supervised Hello Gorgeous RX™"
            center
          />
        </FadeUp>

        <div className="mt-10 space-y-3">
          {PEPTIDES_HUB_FAQS.map((faq, idx) => (
            <FadeUp key={faq.question} delayMs={idx * 30}>
              <details className="group rounded-2xl border border-white/14 bg-[#0a0206] open:border-[#FF2D8E]/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-semibold text-white">
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-lg text-[#FF2D8E] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="border-t border-white/10 px-5 pb-5 pt-0 leading-relaxed text-white/75">
                  {faq.answer}
                </div>
              </details>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
