import Link from "next/link";

type CaseStudyTemplateProps = {
  title: string;
  concern: string;
  treatmentPlan: string;
  sessions: string;
  timeline: string;
  recovery: string;
  providerNotes: string;
  combinationTreatments: string;
  ctaHref: string;
};

export function CaseStudyTemplate({
  title,
  concern,
  treatmentPlan,
  sessions,
  timeline,
  recovery,
  providerNotes,
  combinationTreatments,
  ctaHref,
}: CaseStudyTemplateProps) {
  return (
    <article className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-8">
      <h1 className="text-3xl font-black text-black md:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-black/65">Educational template. Replace placeholders only with approved, consented, real case details.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-black/15 p-4">
          <h2 className="font-bold text-[#E6007E]">Concern</h2>
          <p className="mt-1 text-black/80">{concern}</p>
        </section>
        <section className="rounded-xl border border-black/15 p-4">
          <h2 className="font-bold text-[#E6007E]">Treatment Plan</h2>
          <p className="mt-1 text-black/80">{treatmentPlan}</p>
        </section>
        <section className="rounded-xl border border-black/15 p-4">
          <h2 className="font-bold text-[#E6007E]">Number of Sessions</h2>
          <p className="mt-1 text-black/80">{sessions}</p>
        </section>
        <section className="rounded-xl border border-black/15 p-4">
          <h2 className="font-bold text-[#E6007E]">Timeline</h2>
          <p className="mt-1 text-black/80">{timeline}</p>
        </section>
        <section className="rounded-xl border border-black/15 p-4">
          <h2 className="font-bold text-[#E6007E]">Recovery / Downtime</h2>
          <p className="mt-1 text-black/80">{recovery}</p>
        </section>
        <section className="rounded-xl border border-black/15 p-4">
          <h2 className="font-bold text-[#E6007E]">Combination Treatments</h2>
          <p className="mt-1 text-black/80">{combinationTreatments}</p>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-black/15 p-4">
        <h2 className="font-bold text-[#E6007E]">Provider Notes</h2>
        <p className="mt-1 text-black/80">{providerNotes}</p>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={ctaHref} className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white">
          Book consultation
        </Link>
        <Link href="/contact" className="rounded-lg border-2 border-black px-6 py-3 font-semibold text-black">
          Contact clinical team
        </Link>
      </div>
    </article>
  );
}
