import Link from "next/link";

export function CallToAction() {
  return (
    <section className="py-16 md:py-24 bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
          Ready to Restore Smoother,
          <br />
          <span className="text-[#E91E8C]">Younger-Looking Skin</span>?
        </h2>
        <p className="text-white/70 text-lg mb-4">
          The Solaria CO₂ Fractional Laser may be the perfect treatment for you.
          Appointments are now available for our VIP launch special.
        </p>
        <p className="text-white/50 text-sm mb-10">
          Serving Oswego, Naperville, Aurora, Plainfield, Montgomery, and Yorkville.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="/book"
            className="inline-flex items-center justify-center px-10 py-4 bg-[#E91E8C] hover:bg-[#c90a68] text-white font-bold rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-[#E91E8C]/40"
          >
            Book Your Consultation Today
          </Link>
          <a
            href="tel:6306366193"
            className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 hover:border-[#E91E8C] text-white font-bold rounded-full text-lg transition-all"
          >
            📞 630-636-6193
          </a>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm mb-4">Explore our other advanced treatments:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/morpheus8-burst-oswego-il" className="px-4 py-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 text-sm transition-colors">
              Morpheus8 Burst
            </Link>
            <Link href="/quantum-rf-oswego-il" className="px-4 py-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 text-sm transition-colors">
              QuantumRF Skin Tightening
            </Link>
            <Link href="/solaria-vs-morpheus8-burst" className="px-4 py-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 text-sm transition-colors">
              Solaria vs Morpheus8
            </Link>
          </div>
        </div>

        <div className="text-white/50 space-y-1 text-sm mt-8">
          <p className="font-semibold text-white/70">Hello Gorgeous Med Spa</p>
          <p>74 W Washington Street, Oswego, Illinois 60543</p>
          <p>
            <Link href="/" className="text-[#E91E8C] hover:underline">
              hellogorgeousmedspa.com
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
