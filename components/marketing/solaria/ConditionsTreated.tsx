const CONDITIONS = [
  "Fine lines and wrinkles",
  "Acne scars",
  "Sun damage and age spots",
  "Uneven skin tone",
  "Skin laxity and crepey skin",
  "Enlarged pores",
  "Rough skin texture",
  "Surgical scars",
  "Stretch marks",
];

export function ConditionsTreated() {
  return (
    <section className="py-16 md:py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
          What Skin Concerns Can Solaria Treat?
        </h2>
        <p className="text-white/70 text-lg mb-10">
          The Solaria CO₂ laser is one of the most powerful skin resurfacing treatments available.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CONDITIONS.map((condition) => (
            <div
              key={condition}
              className="flex items-center gap-3 p-4 rounded-xl border border-[#E91E8C]/30 bg-[#E91E8C]/5"
            >
              <span className="text-[#E91E8C] text-lg flex-shrink-0">✓</span>
              <span className="text-white/90">{condition}</span>
            </div>
          ))}
        </div>
        <p className="text-white/60 text-sm mt-8">
          Many patients notice visible improvements in just one treatment, with continued
          collagen remodeling over several months.
        </p>
      </div>
    </section>
  );
}
