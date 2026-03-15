import Link from "next/link";

export function VIPOffer() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-black via-[#1a0a14] to-black text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-4">
          Limited Launch Special
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
          VIP Launch Package
        </h2>
        <p className="text-white/70 text-lg mb-10">
          To celebrate the arrival of our new Solaria technology, we are offering a limited
          launch special for new clients.
        </p>

        <div className="rounded-3xl border-2 border-[#FFD700]/40 bg-black/50 p-10 md:p-14 shadow-2xl shadow-[#FFD700]/10 max-w-md mx-auto">
          <div className="text-white/60 text-sm uppercase tracking-widest mb-4">
            Full Face + Neck + Chest
          </div>
          <div className="text-white/50 mb-2">Solaria CO₂ Laser Treatment</div>
          <div className="text-6xl md:text-7xl font-bold text-[#E91E8C] my-6">
            $1,895
          </div>
          <div className="text-white/40 text-sm mb-8">
            Regular price: <span className="line-through">$2,500</span>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center justify-center px-10 py-4 bg-[#E91E8C] hover:bg-[#c90a68] text-white font-bold rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-[#E91E8C]/40"
          >
            Book Your VIP Session
          </Link>
          <p className="text-[#FFD700]/60 text-xs mt-6">
            Limited availability. Introductory pricing ends when spots fill.
          </p>
        </div>
      </div>
    </section>
  );
}
