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
    <Section className="relative bg-white py-24">
      <div className="relative max-w-5xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-[#FF2D8E] text-sm font-bold tracking-wide uppercase">Your Providers</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-black">Meet the Team</h2>
            <p className="mt-4 text-lg text-black max-w-2xl mx-auto">
              Expert providers dedicated to your safety, comfort, and stunning results.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {providers.map((provider, idx) => (
            <FadeUp key={provider.name} delayMs={150 * idx}>
              <div className="bg-white border-2 border-black rounded-2xl overflow-hidden hover:border-[#FF2D8E] transition group shadow-md hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[3/4] overflow-hidden bg-white">
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
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF2D8E] text-white text-xs font-bold hover:bg-black transition"
                      >
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        Telehealth Available
                      </a>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black">{provider.name}</h3>
                  {provider.credentials && (
                    <p className="text-[#FF2D8E] text-xs font-bold mt-1">{provider.credentials}</p>
                  )}
                  <p className="text-black text-sm mt-1">{provider.role}</p>
                  <p className="text-black text-sm mt-3">{provider.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/book?provider=${provider.slug}`}
                      className="inline-flex items-center rounded-lg bg-[#FF2D8E] hover:bg-black px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Book with {provider.name.split(" ")[0]}
                    </Link>
                    <Link
                      href={`/providers/${provider.slug}`}
                      className="inline-flex items-center rounded-lg border-2 border-black px-6 py-3 text-sm font-bold text-black hover:bg-black hover:text-white transition"
                    >
                      View Profile
                    </Link>
                    {provider.telehealth && (
                      <a
                        href="/telehealth"
                        className="inline-flex items-center gap-2 text-[#FF2D8E] text-sm font-bold hover:text-black transition"
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
