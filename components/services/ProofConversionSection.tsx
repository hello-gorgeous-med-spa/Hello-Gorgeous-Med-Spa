import Link from "next/link";

type ProofItem = {
  title: string;
  body: string;
};

type ProofConversionSectionProps = {
  serviceName: string;
  concerns: string[];
  resultStages: ProofItem[];
  variabilityFactors: string[];
  combinationGuidance: string;
  ctaHref: string;
  ctaLabel?: string;
};

export function ProofConversionSection({
  serviceName,
  concerns,
  resultStages,
  variabilityFactors,
  combinationGuidance,
  ctaHref,
  ctaLabel = "Book consultation",
}: ProofConversionSectionProps) {
  return (
    <section className="border-y-2 border-black bg-white py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-black text-black md:text-4xl">{serviceName} Proof + Conversion Guide</h2>
        <p className="mt-2 max-w-3xl text-black/75">
          Educational overview only. Results vary by anatomy, treatment plan, and follow-through. Consultation required.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border-2 border-black bg-white p-5">
            <h3 className="text-xl font-bold text-[#E6007E]">What patients usually want corrected</h3>
            <ul className="mt-3 space-y-2 text-black/80">
              {concerns.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
            <h3 className="text-xl font-bold text-[#E6007E]">Why results vary</h3>
            <ul className="mt-3 space-y-2 text-black/80">
              {variabilityFactors.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
        </div>

        <article className="mt-4 rounded-2xl border-2 border-black bg-white p-5">
          <h3 className="text-xl font-bold text-[#E6007E]">What results may look like: early vs final</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {resultStages.map((stage) => (
              <div key={stage.title} className="rounded-xl border border-black/15 p-4">
                <p className="font-bold text-black">{stage.title}</p>
                <p className="mt-1 text-black/80">{stage.body}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="mt-4 rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
          <h3 className="text-xl font-bold text-[#E6007E]">When combination treatment may be recommended</h3>
          <p className="mt-2 text-black/80">{combinationGuidance}</p>
        </article>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={ctaHref} className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white">
            {ctaLabel}
          </Link>
          <Link href="/contact" className="rounded-lg border-2 border-black px-6 py-3 font-semibold text-black">
            Contact clinical team
          </Link>
        </div>
      </div>
    </section>
  );
}
