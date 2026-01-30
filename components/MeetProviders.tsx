"use client";

import Image from "next/image";
import { Section, FadeUp } from "@/components/Section";

const providers = [
  {
    name: "Danielle Alcala",
    role: "Founder & Lead Aesthetician",
    image: "/images/team/danielle.png",
    bio: "Passionate about helping clients feel confident and beautiful. Patient-first care philosophy.",
  },
  {
    name: "Ryan Kent, FNP-BC",
    role: "Medical Director",
    image: "/images/team/ryan-danielle.png",
    bio: "Board-certified Family Nurse Practitioner ensuring clinical excellence and safety.",
  },
];

export function MeetProviders() {
  return (
    <Section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-pink-950/10" />
      <div className="relative">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-pink-400 text-lg font-medium tracking-wide">YOUR PROVIDERS</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">Meet the Team</h2>
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto">
              Expert providers dedicated to your safety, comfort, and stunning results.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {providers.map((provider, idx) => (
            <FadeUp key={provider.name} delayMs={150 * idx}>
              <div className="bg-black/50 border border-pink-500/20 rounded-3xl overflow-hidden hover:border-pink-500/40 transition group">
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-pink-950/20 to-black">
                  <Image
                    src={provider.image}
                    alt={provider.name}
                    fill
                    className="object-contain object-center group-hover:scale-105 transition duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">{provider.name}</h3>
                  <p className="text-pink-400 text-sm mt-1">{provider.role}</p>
                  <p className="text-white/70 text-sm mt-3">{provider.bio}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  );
}
