"use client";

import Link from "next/link";
import { FadeUp } from "@/components/Section";

const PERKS = [
  { icon: "💎", text: "10% off all services" },
  { icon: "📅", text: "Priority booking" },
  { icon: "🎁", text: "Monthly complimentary treatment" },
  { icon: "✨", text: "Member-only perks" },
];

export function MembershipSection() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <div className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-950/20 via-black to-black p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  Member Benefits
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Join Our{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                    VIP Membership
                  </span>
                </h2>
                <p className="text-gray-400 text-base mb-6 max-w-xl">
                  Save on every visit with 10% off all services, priority booking, monthly perks, and exclusive member events.
                </p>
                <ul className="space-y-2 mb-6 md:mb-0">
                  {PERKS.map((p, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                      <span className="text-lg">{p.icon}</span>
                      {p.text}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/membership"
                className="flex-shrink-0 inline-flex items-center justify-center min-h-[48px] px-8 py-3 bg-hg-pink hover:bg-hg-pinkDeep text-white text-sm font-semibold uppercase tracking-widest rounded-md transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg"
              >
                View Plans
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
