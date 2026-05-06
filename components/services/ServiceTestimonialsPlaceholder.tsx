type ServiceTestimonialsPlaceholderProps = {
  serviceName: string;
  note?: string;
};

export function ServiceTestimonialsPlaceholder({
  serviceName,
  note = "Reserved for approved and consented patient reviews only.",
}: ServiceTestimonialsPlaceholderProps) {
  return (
    <section className="border-y-2 border-black bg-white py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-black text-black md:text-4xl">{serviceName} Review Highlights</h2>
        <p className="mt-2 text-black/75">This block is configured for service-specific social proof.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((idx) => (
            <article key={idx} className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#E6007E]">Approved Review Slot {idx}</p>
              <p className="mt-3 text-black/80">Patient review text appears here once approved for this service page.</p>
              <p className="mt-4 text-xs text-black/60">Source: Google / in-clinic consented feedback</p>
            </article>
          ))}
        </div>

        <p className="mt-5 text-sm text-black/70">{note}</p>
      </div>
    </section>
  );
}
