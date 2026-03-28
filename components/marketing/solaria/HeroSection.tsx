import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-black text-white py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-[#E91E8C] text-sm font-semibold uppercase tracking-widest mb-4">
          Advanced Skin Rejuvenation in Oswego, Illinois
        </p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-serif">
          Solaria CO₂ Fractional
          <br />
          <span className="text-[#E91E8C]">Laser Resurfacing</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/85 mb-8 leading-relaxed max-w-2xl">
          Dramatically improve skin texture, tighten loose skin, reduce wrinkles, and diminish
          acne scars with the newest generation of CO₂ fractional laser technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/book"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#E91E8C] hover:bg-[#c90a68] text-white font-bold rounded-lg text-lg transition-all hover:-translate-y-0.5 shadow-lg shadow-[#E91E8C]/30"
          >
            Book Free Consultation
          </Link>
          <a
            href="tel:6306366193"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-lg text-lg transition-all"
          >
            📞 630-636-6193
          </a>
        </div>
        <p className="mt-6 text-sm text-white/75">
          <a
            href="https://www.inmodemd.com/workstation/solaria/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#E91E8C] hover:text-pink-300 underline underline-offset-2"
          >
            More info
          </a>
          <span className="text-white/60"> from InMode (official Solaria workstation)</span>
        </p>
      </div>
    </section>
  );
}
