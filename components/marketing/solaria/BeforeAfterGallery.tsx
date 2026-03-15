import Image from "next/image";

export function BeforeAfterGallery() {
  return (
    <section className="py-16 md:py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
          Real Results
        </h2>
        <p className="text-white/70 text-lg mb-10">
          See the transformative power of Solaria CO₂ laser resurfacing.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map((set) => (
            <div key={set} className="rounded-2xl overflow-hidden border border-white/10">
              <div className="grid grid-cols-2">
                <div className="relative aspect-square bg-black/50">
                  <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">
                    Before Photo
                  </div>
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 rounded-lg text-xs font-bold tracking-wider">
                    BEFORE
                  </div>
                </div>
                <div className="relative aspect-square bg-[#E91E8C]/10">
                  <div className="absolute inset-0 flex items-center justify-center text-[#E91E8C]/30 text-sm">
                    After Photo
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 bg-[#E91E8C]/80 rounded-lg text-xs font-bold tracking-wider text-white">
                    AFTER
                  </div>
                </div>
              </div>
              <div className="p-4 bg-black/50">
                <p className="text-white/80 text-sm">
                  Solaria CO₂ Fractional Laser &bull; Results after treatment series
                </p>
                <p className="text-white/40 text-xs mt-1">
                  Results may vary. Individual results depend on treatment plan.
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-white/50 text-sm mt-8">
          Add your before/after images to <code className="text-[#E91E8C]/60">/public/solaria/</code> to populate this gallery.
        </p>
      </div>
    </section>
  );
}
