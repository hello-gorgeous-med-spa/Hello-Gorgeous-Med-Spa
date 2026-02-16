import type { Metadata } from "next";
import Image from "next/image";

import { FadeUp, Section } from "@/components/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Botox + Besties Party",
  description:
    "Host a Botox + Besties event with Hello Gorgeous Med Spa. We come to you! Exclusive perks: $10/unit Botox, $99 Lip Flip, $499 Filler. Book your party today.",
  path: "/botox-party",
});

const perks = [
  { title: "Botox Injection", price: "$10 Per Unit" },
  { title: "Botox Lip Flip", price: "$99" },
  { title: "Filler Injection", price: "$499 per syringe" },
  { title: "Vitamin Injections", price: "$25 (B12, Biotin, Glutathione)" },
];

const treatmentAreas = [
  "Forehead",
  "Crow's Feet",
  "Gummy Smile",
  "Migraines",
  "Jaw",
  "Chin",
  "Neck",
  "Sweating",
];

export default function BotoxPartyPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-[#FF2D8E] text-lg md:text-xl font-medium mb-6 tracking-wide">
              WE COME TO YOU
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Host a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                Botox + Besties
              </span>{" "}
              Party
            </h1>
            <p className="mt-6 text-xl text-black max-w-3xl leading-relaxed">
              Gather your crew for an unforgettable beauty event. Exclusive pricing, 
              professional service, and a whole lot of fun—right at your place.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="tel:630-636-6193"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#FF2D8E] text-white font-bold text-lg hover:bg-black transition shadow-lg shadow-[#FF2D8E]/25"
              >
                <span>📞</span> Call to Book: 630-636-6193
              </a>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Flyer Image */}
      <Section>
        <FadeUp>
          <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden border border-[#FF2D8E]/30 shadow-2xl shadow-[#FF2D8E]/10">
            <Image
              src="/images/events/botox-party.png"
              alt="Botox + Besties Party Flyer"
              width={800}
              height={1200}
              className="w-full h-auto"
              priority
            />
          </div>
        </FadeUp>
      </Section>

      {/* How It Works */}
      <Section>
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-[#FF2D8E] text-lg font-medium tracking-wide">HOW IT WORKS</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              Your Party, Your Place
            </h2>
          </div>
        </FadeUp>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Call to Book",
              description: "Reach out at 630-636-6193 to schedule your Botox + Besties event. We'll handle the details.",
            },
            {
              step: "2",
              title: "Gather Your Group",
              description: "Invite 6+ friends! The host gets FREE Botox (20 units) + 2 FREE vitamin injections.",
            },
            {
              step: "3",
              title: "We Come to You",
              description: "Tuesdays or Saturdays, 6-9 PM. Professional service in the comfort of your home.",
            },
          ].map((item, idx) => (
            <FadeUp key={item.step} delayMs={60 * idx}>
              <div className="rounded-2xl border border-[#FF2D8E]/20 bg-gradient-to-b from-pink-950/20 to-black p-8 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FF2D8E] flex items-center justify-center text-2xl font-bold text-white mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-black">{item.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Exclusive Perks */}
      <Section>
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-[#FF2D8E] text-lg font-medium tracking-wide">EXCLUSIVE PERKS</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              Party Pricing
            </h2>
            <p className="mt-4 text-black max-w-2xl mx-auto">
              Special rates only available at Botox + Besties events.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk, idx) => (
            <FadeUp key={perk.title} delayMs={40 * idx}>
              <div className="rounded-2xl border border-[#FF2D8E]/30 bg-black p-6 text-center hover:border-[#FF2D8E]/60 transition">
                <p className="text-white font-semibold text-lg">{perk.title}</p>
                <p className="mt-2 text-3xl font-bold text-[#FF2D8E]">{perk.price}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Host Bonus */}
        <FadeUp delayMs={200}>
          <div className="mt-8 rounded-2xl border-2 border-[#FF2D8E] bg-gradient-to-r from-pink-950/40 to-pink-900/20 p-8 text-center">
            <p className="text-[#FF2D8E] font-bold text-lg tracking-wide mb-2">🎉 HOST BONUS</p>
            <p className="text-2xl md:text-3xl font-bold text-white">
              Group of 6 or More?
            </p>
            <p className="mt-3 text-xl text-white">
              Get <span className="text-[#FF2D8E] font-bold">FREE Botox (20 units)</span> + <span className="text-[#FF2D8E] font-bold">2 FREE Vitamin Injections</span>
            </p>
          </div>
        </FadeUp>
      </Section>

      {/* Treatment Areas */}
      <Section>
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-[#FF2D8E] text-lg font-medium tracking-wide">WHAT CAN BOTOX TREAT?</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              Treatment Areas
            </h2>
          </div>
        </FadeUp>

        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {treatmentAreas.map((area, idx) => (
            <FadeUp key={area} delayMs={30 * idx}>
              <div className="px-6 py-3 rounded-full border border-[#FF2D8E]/30 bg-[#FF2D8E]/10 text-white font-medium hover:bg-[#FF2D8E]/20 transition">
                {area}
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <FadeUp>
          <div className="rounded-3xl border border-[#FF2D8E]/30 bg-gradient-to-br from-pink-950/30 via-black to-black p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Host?
            </h2>
            <p className="text-xl text-black max-w-2xl mx-auto mb-8">
              Call now to book your Botox + Besties event. Available Tuesdays & Saturdays, 6-9 PM.
            </p>
            <a
              href="tel:630-636-6193"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-[#FF2D8E] text-white font-bold text-xl hover:bg-black transition shadow-lg shadow-[#FF2D8E]/25"
            >
              <span className="text-2xl">📞</span> 630-636-6193
            </a>
            <p className="mt-6 text-black">
              hellogorgeousmedspa.com
            </p>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
