const AREAS = [
  { area: "Face", description: "Reduce wrinkles, improve tone, and resurface damaged skin.", icon: "👩" },
  { area: "Under Eyes", description: "Tighten crepey skin and soften fine lines.", icon: "👁️" },
  { area: "Neck", description: "Improve skin laxity and reduce horizontal neck lines.", icon: "🦢" },
  { area: "Chest (Décolletage)", description: "Repair sun damage and smooth crepey texture.", icon: "✨" },
  { area: "Acne Scar Areas", description: "Resurface scar tissue and stimulate collagen regeneration.", icon: "🔬" },
];

export function TreatmentAreas() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 font-serif">
          Areas We Can Treat
        </h2>
        <p className="text-black/60 text-lg mb-10">
          Solaria CO₂ laser treatments safely and effectively treat multiple areas of the body.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {AREAS.map((item) => (
            <div
              key={item.area}
              className="p-6 rounded-2xl border border-black/10 hover:border-[#E91E8C]/40 transition-colors bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-xl font-bold text-black">{item.area}</h3>
              </div>
              <p className="text-black/70">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
