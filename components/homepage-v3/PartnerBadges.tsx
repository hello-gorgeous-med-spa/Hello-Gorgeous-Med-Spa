"use client";

/** Trusted partners & featured brands — text badges (add logo URLs later if desired) */
const PARTNERS = [
  { name: "Allergan", label: "Botox® · Juvederm®" },
  { name: "Biote", label: "Hormone Optimization" },
  { name: "Revanesse", label: "Dermal Fillers" },
  { name: "Galderma", label: "Dysport®" },
  { name: "McKesson", label: "Medical Supply" },
  { name: "Olympia", label: "Pharmacy Partner" },
  { name: "Evolus", label: "Jeuveau®" },
  { name: "Merz", label: "Xeomin® · Belotero®" },
  { name: "Teoxane", label: "Teosyal®" },
] as const;

export function PartnerBadges() {
  return (
    <section className="bg-white py-12 md:py-16 border-y border-black/10" aria-label="Trusted partners and featured brands">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <p className="text-center text-sm font-semibold text-black/70 uppercase tracking-wider mb-8">
          Trusted Partners & Featured Brands
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          {PARTNERS.map((p) => (
            <span
              key={p.name}
              className="inline-flex flex-col items-center justify-center rounded-xl border-2 border-black/15 bg-white px-4 py-2.5 text-center shadow-sm"
            >
              <span className="font-semibold text-black text-sm">{p.name}</span>
              {p.label && (
                <span className="text-xs text-black/60 mt-0.5">{p.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
