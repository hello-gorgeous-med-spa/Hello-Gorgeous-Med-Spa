"use client";

import Link from "next/link";
import Image from "next/image";
import { TechBlogPromo } from "@/components/TechBlogPromo";

const WAITLIST_URL = "/waitlist?source=trifecta-vip";

export function TrifectaVIPContent() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-pink-400 font-semibold uppercase tracking-widest text-sm mb-4">
            Limited-Time Offer
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            The InMode Trifecta
            <span className="block mt-2 bg-gradient-to-r from-pink-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">
              $100 Off Any Service
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Join our <strong className="text-white">VIP Waitlist</strong> and get $100 off any service—Morpheus8, QuantumRF, Solaria CO₂, or any treatment we offer.
          </p>
          <Link
            href={WAITLIST_URL}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-lg bg-white text-black hover:bg-pink-100 transition-colors shadow-lg hover:shadow-xl"
          >
            Join the VIP Waitlist — Get $100 Off
            <span aria-hidden>→</span>
          </Link>
          <p className="mt-6 text-sm text-white/60">
            First-come, first-served. We&apos;ll notify you when you&apos;re next in line.
          </p>
        </div>
      </section>

      {/* Three technologies */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Three Technologies. One Waitlist.
          </h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
            Be first in line for our most advanced treatments—and save $100 on the service you choose.
          </p>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="rounded-2xl overflow-hidden border border-pink-500/30 bg-zinc-900/80">
              <div className="relative h-48">
                <Image src="/images/trifecta/morpheus8.png" alt="Morpheus8" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-pink-500 text-white rounded-full">NEW</span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white">Morpheus8</h3>
                <p className="text-pink-300 text-sm font-medium mb-2">RF Microneedling</p>
                <p className="text-white/70 text-sm mb-4">Deep RF microneedling for skin tightening, fat reduction, and collagen remodeling.</p>
                <Link href="/services/morpheus8" className="text-pink-400 text-sm font-semibold hover:text-pink-300">Learn more →</Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-blue-500/30 bg-zinc-900/80">
              <div className="relative h-48">
                <Image src="/images/trifecta/quantum-rf.png" alt="QuantumRF" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-blue-500 text-white rounded-full">NEW</span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white">QuantumRF</h3>
                <p className="text-blue-300 text-sm font-medium mb-2">Subdermal Contouring</p>
                <p className="text-white/70 text-sm mb-4">Minimally invasive RF beneath the skin for surgical-like results without surgery.</p>
                <Link href="/services/quantum-rf" className="text-blue-400 text-sm font-semibold hover:text-blue-300">Learn more →</Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-amber-500/30 bg-zinc-900/80">
              <div className="relative h-48">
                <Image src="/images/trifecta/solaria-co2.png" alt="Solaria CO2" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-amber-500 text-white rounded-full">VIP</span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white">Solaria CO₂</h3>
                <p className="text-amber-300 text-sm font-medium mb-2">Fractional Laser</p>
                <p className="text-white/70 text-sm mb-4">Gold standard CO₂ resurfacing for wrinkles, scars, and skin renewal.</p>
                <Link href="/stretch-mark-treatment-oswego-il" className="text-amber-400 text-sm font-semibold hover:text-amber-300">Learn more →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TechBlogPromo
        title="Learn More: Morpheus8 Burst, Quantum RF & Solaria"
        subtitle="Expert blog guides on our InMode technology. Serving Oswego, Naperville, Aurora, Plainfield, Yorkville & Montgomery."
      />

      {/* CTA */}
      <section className="px-4 py-16 md:py-20 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to save $100?</h2>
          <p className="text-white/70 mb-8">
            Join the VIP waitlist. When your turn comes, you&apos;ll get <strong className="text-white">$100 off any service</strong>—no minimum.
          </p>
          <Link
            href={WAITLIST_URL}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors"
          >
            Join the VIP Waitlist
            <span aria-hidden>→</span>
          </Link>
          <p className="mt-8 text-sm text-white/50">
            Hello Gorgeous Med Spa · Oswego, IL · (630) 636-6193
          </p>
        </div>
      </section>
    </div>
  );
}
