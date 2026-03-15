export function TreatmentOverview() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 font-serif">
          What is Solaria CO₂ Fractional Laser?
        </h2>
        <div className="prose prose-lg max-w-none text-black/80 space-y-5">
          <p>
            Solaria is a medical-grade fractional CO₂ laser resurfacing system that precisely
            removes damaged outer layers of skin while stimulating collagen and elastin deep
            beneath the surface.
          </p>
          <p>
            This dual-action technology allows the skin to regenerate healthier tissue while
            tightening and rejuvenating from within.
          </p>
          <p>
            Unlike older resurfacing lasers, fractional technology treats microscopic zones of
            skin while leaving surrounding tissue intact — promoting faster healing and more
            natural results.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { stat: "30–60", label: "Minute Treatment", icon: "⏱️" },
            { stat: "3–6", label: "Months of Collagen Remodeling", icon: "✨" },
            { stat: "1", label: "Treatment for Visible Results", icon: "💎" },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-6 rounded-2xl border border-black/10 bg-white shadow-sm"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-3xl font-bold text-[#E91E8C]">{item.stat}</div>
              <div className="text-sm text-black/60 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
