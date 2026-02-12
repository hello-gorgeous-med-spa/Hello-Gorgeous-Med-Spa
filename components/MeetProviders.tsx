"use client";

import Image from "next/image";
import Link from "next/link";
import { Section, FadeUp } from "@/components/Section";
import { DANIELLE_CREDENTIALS, RYAN_CREDENTIALS } from "@/lib/provider-credentials";

const providers = [
  {
    slug: "danielle",
    name: "Danielle Alcala",
    role: "Founder, Hello Gorgeous Med Spa",
    credentials: "Licensed CNA • CMAA • Phlebotomist",
    image: "/images/team/danielle.png",
    bio: "Passionate about helping clients feel confident and beautiful. Patient-first care philosophy with a focus on personalized treatments.",
    telehealth: false,
  },
  {
    slug: "ryan",
    name: "Ryan Kent",
    role: "Medical Director",
    credentials: `${RYAN_CREDENTIALS} • Full Practice Authority Nurse Practitioner`,
    image: "/images/providers/ryan-kent-clinic.jpg",
    bio: "Board-Certified Family Nurse Practitioner with full prescriptive authority. Specializing in weight management, hormone optimization, and regenerative medicine.",
    telehealth: true,
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
              <div className="bg-black/50 border border-pink-500/20 rounded-2xl overflow-hidden hover:border-pink-500/40 transition group shadow-xl">
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-pink-950/20 to-black">
                  <Image
                    src={provider.image}
                    alt={`${provider.name}, ${provider.credentials} at Hello Gorgeous Med Spa`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {provider.telehealth && (
                    <div className="absolute top-4 right-4">
                      <a
                        href="/telehealth"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuchsia-500/90 text-white text-xs font-medium hover:bg-fuchsia-500 transition"
                      >
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        Telehealth Available
                      </a>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">{provider.name}</h3>
                  {provider.credentials && (
                    <p className="text-blue-400 text-xs font-semibold mt-1">{provider.credentials}</p>
                  )}
                  <p className="text-pink-400 text-sm mt-1">{provider.role}</p>
                  <p className="text-white/70 text-sm mt-3">{provider.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/providers/${provider.slug}`}
                      className="inline-flex items-center rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
                    >
                      View Profile
                    </Link>
                    {provider.telehealth && (
                      <a
                        href="/telehealth"
                        className="inline-flex items-center gap-2 text-fuchsia-400 text-sm font-medium hover:text-fuchsia-300 transition"
                      >
                        🖥️ Book Virtual Visit →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  );
}
