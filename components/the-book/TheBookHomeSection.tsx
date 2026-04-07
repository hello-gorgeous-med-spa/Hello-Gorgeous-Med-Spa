import Link from "next/link";
import { THE_BOOK } from "@/lib/the-book";

export function TheBookHomeSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-[#1a0a12] to-black border-y border-[#E6007E]/20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(230,0,126,0.15),transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 grid md:grid-cols-2 gap-10 md:gap-14 items-center relative">
        <div>
          <p className="text-[#E6007E] text-xs font-bold uppercase tracking-[0.2em] mb-3">New · Digital book</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
            {THE_BOOK.subtitle}
          </h2>
          <p className="mt-4 text-white/75 text-base leading-relaxed max-w-lg">
            {THE_BOOK.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/50">
            {THE_BOOK.stats.map((s) => (
              <span key={s.label} className="inline-flex items-baseline gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <span className="font-bold text-[#E6007E]">{s.value}</span>
                <span>{s.label}</span>
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href={THE_BOOK.slugPath}
              className="inline-flex items-center justify-center rounded-full bg-[#E6007E] text-white font-semibold px-8 py-3.5 hover:bg-[#c90a68] transition-colors text-center"
            >
              Read sneak peek &amp; buy
            </Link>
            <a
              href={THE_BOOK.sneakPeekUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/25 text-white font-semibold px-8 py-3.5 hover:border-[#E6007E] hover:text-[#E6007E] transition-colors text-center"
            >
              Full scroll preview →
            </a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <Link
            href={THE_BOOK.slugPath}
            className="group relative block w-full max-w-sm aspect-[3/4] rounded-2xl border border-white/10 bg-gradient-to-br from-[#2d1520] to-black p-8 shadow-2xl shadow-[#E6007E]/10 transition-transform hover:scale-[1.02]"
          >
            <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-white/40">Digital</div>
            <div className="h-full flex flex-col justify-between">
              <div>
                <p className="font-serif text-2xl md:text-3xl text-white leading-tight">
                  Hello
                  <br />
                  <span className="italic text-[#E6007E]">Gorgeous</span>
                </p>
                <p className="mt-4 text-sm text-white/60 leading-snug border-l-2 border-[#E6007E] pl-3">
                  {THE_BOOK.subtitle}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">{THE_BOOK.author}</p>
                <p className="text-[11px] text-white/30 mt-1">Tap to open the book page</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
