import type { Metadata } from "next";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { SITE, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "VIP List",
  description:
    "Join the Hello Gorgeous VIP list for exclusive offers, first access to new treatments, and member-only perks. Serving Oswego, Naperville, Aurora, and Plainfield.",
  path: "/vip",
});

export default function VIPPage() {
  return (
    <>
      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              EXCLUSIVE ACCESS
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Join our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                VIP List
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              Be the first to know about new services, limited-time offers, and member-only
              perks. We’ll never spam you—just the good stuff.
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          <FadeUp>
            <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-8">
              <h2 className="text-2xl font-bold text-white mb-4">What you get</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-pink-400">✓</span>
                  First access to new treatments and services
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-pink-400">✓</span>
                  Exclusive offers and seasonal promotions
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-pink-400">✓</span>
                  Birthday and loyalty perks
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-pink-400">✓</span>
                  Tips and education from our team
                </li>
              </ul>
            </div>
          </FadeUp>

          <FadeUp delayMs={80}>
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Sign up</h2>
              <p className="text-gray-300 mb-6">
                Join with email and optionally SMS for appointment reminders and quick
                updates.
              </p>
              <div className="flex flex-col gap-4">
                <CTA href="/subscribe" variant="gradient">
                  Join the VIP list
                </CTA>
                <CTA href={BOOKING_URL} variant="outline">
                  Book an appointment
                </CTA>
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
