import Link from 'next/link';
import { Metadata } from 'next';

import { BESTIE_SQUARE_DISCOUNT } from '@/lib/square/bestie-discount';

export const metadata: Metadata = {
  title: 'Staff Resources | Hello Gorgeous Med Spa',
  robots: 'noindex, nofollow',
};

export default function StaffPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-black">
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Header with new RE GEN logo */}
        <div className="text-center mb-10">
          <img 
            src="/images/regen/regen-logo.png" 
            alt="RE GEN - Renew. Rebalance. Regenerate." 
            className="h-24 mx-auto mb-6 rounded-lg"
          />
          <h1 className="text-2xl font-bold text-white mb-2">
            Staff Training Hub
          </h1>
          <p className="text-pink-300">
            Your tools & training resources
          </p>
        </div>

        {/* Resource Cards */}
        <div className="space-y-4">
          {/* Protocols Hub — guides, social, invoices */}
          <Link
            href="/staff/protocols"
            className="block bg-gradient-to-r from-emerald-600/25 to-pink-600/25 backdrop-blur rounded-2xl p-5 border-2 border-emerald-400/60 hover:border-emerald-400 hover:from-emerald-600/35 hover:to-pink-600/35 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📋</div>
              <div className="flex-1">
                <h2 className="font-bold text-white text-lg">Protocols &amp; Quick Tools</h2>
                <p className="text-emerald-200/80 text-sm">
                  Dosing guides · cheat sheets · July social · RX invoices
                </p>
              </div>
              <div className="text-emerald-400 text-2xl">→</div>
            </div>
          </Link>

          {/* Bestie $100 Square discount */}
          <Link
            href="/admin/promos/bestie"
            className="block bg-gradient-to-r from-amber-600/25 to-pink-600/25 backdrop-blur rounded-2xl p-5 border-2 border-amber-400/60 hover:border-amber-400 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">💕</div>
              <div className="flex-1">
                <h2 className="font-bold text-white text-lg">Bestie — ${BESTIE_SQUARE_DISCOUNT.amountUsd} Off</h2>
                <p className="text-amber-200/80 text-sm font-mono">
                  Square code: {BESTIE_SQUARE_DISCOUNT.code}
                </p>
              </div>
              <div className="text-amber-400 text-2xl">→</div>
            </div>
          </Link>

          {/* Pharmacy Selector */}
          <a
            href="/staff/pharmacy-selector.html"
            className="block bg-white/10 backdrop-blur rounded-2xl p-5 border-2 border-pink-500/30 hover:border-pink-500 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">💊</div>
              <div className="flex-1">
                <h2 className="font-bold text-white text-lg">Pharmacy Selector</h2>
                <p className="text-pink-200/70 text-sm">Compare prices across pharmacies</p>
              </div>
              <div className="text-pink-500 text-2xl">→</div>
            </div>
          </a>

          {/* Install Instructions */}
          <a
            href="/staff/pharmacy-install-card.pdf"
            target="_blank"
            className="block bg-white/10 backdrop-blur rounded-2xl p-5 border-2 border-purple-500/30 hover:border-purple-500 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📲</div>
              <div className="flex-1">
                <h2 className="font-bold text-white text-lg">Install Instructions</h2>
                <p className="text-purple-200/70 text-sm">Add Pharmacy Selector to home screen</p>
              </div>
              <div className="text-purple-400 text-2xl">→</div>
            </div>
          </a>

          {/* REGEN Study Guide */}
          <a
            href="/staff/regen-study-guide.pdf"
            target="_blank"
            className="block bg-white/10 backdrop-blur rounded-2xl p-5 border-2 border-cyan-500/30 hover:border-cyan-500 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📚</div>
              <div className="flex-1">
                <h2 className="font-bold text-white text-lg">RE GEN Study Guide</h2>
                <p className="text-cyan-200/70 text-sm">Product knowledge & training</p>
              </div>
              <div className="text-cyan-400 text-2xl">→</div>
            </div>
          </a>

          {/* Promo Kit - NEW */}
          <a
            href="/promo-kit/"
            target="_blank"
            className="block bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur rounded-2xl p-5 border-2 border-pink-400/50 hover:border-pink-400 hover:from-pink-600/30 hover:to-purple-600/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎨</div>
              <div className="flex-1">
                <h2 className="font-bold text-white text-lg">Promo Kit</h2>
                <p className="text-pink-200/70 text-sm">Social graphics & marketing assets</p>
              </div>
              <div className="text-pink-400 text-2xl">→</div>
            </div>
          </a>

          {/* Print Brochure */}
          <a
            href="/rx/brochure"
            target="_blank"
            className="block bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur rounded-2xl p-5 border-2 border-cyan-400/50 hover:border-cyan-400 hover:from-cyan-600/30 hover:to-blue-600/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📄</div>
              <div className="flex-1">
                <h2 className="font-bold text-white text-lg">RE GEN Brochure</h2>
                <p className="text-cyan-200/70 text-sm">Print-ready handout — 2 pages, double-sided</p>
              </div>
              <div className="text-cyan-400 text-2xl">→</div>
            </div>
          </a>

          {/* In-Spa TV Loop */}
          <a
            href="/regen-tv"
            target="_blank"
            className="block bg-gradient-to-r from-fuchsia-600/20 to-pink-600/20 backdrop-blur rounded-2xl p-5 border-2 border-fuchsia-400/50 hover:border-fuchsia-400 hover:from-fuchsia-600/30 hover:to-pink-600/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📺</div>
              <div className="flex-1">
                <h2 className="font-bold text-white text-lg">In-Spa TV Loop</h2>
                <p className="text-fuchsia-200/70 text-sm">Logo reveal + RE GEN promos — waiting room &amp; TVs</p>
              </div>
              <div className="text-fuchsia-400 text-2xl">→</div>
            </div>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            Questions? Text Dani 💕
          </p>
        </div>

        {/* Quick tip */}
        <div className="mt-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-4 text-center border border-pink-500/20">
          <p className="text-sm text-pink-100">
            <strong>Pro tip:</strong> Bookmark this page or add to your home screen for quick access!
          </p>
        </div>
      </div>
    </div>
  );
}
