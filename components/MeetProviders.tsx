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
    <Section className="relative bg-white">
      <div className="relative">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-[#FF2D8E] text-sm font-medium tracking-wide uppercase">YOUR PROVIDERS</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold text-black">Meet the Team</h2>
            <p className="mt-4 text-base md:text-lg text-black max-w-2xl mx-auto">
              Expert providers dedicated to your safety, comfort, and stunning results.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {providers.map((provider, idx) => (
            <FadeUp key={provider.name} delayMs={150 * idx}>
              <div className="bg-white border-2 border-black rounded-xl overflow-hidden hover:border-[#FF2D8E] transition group shadow-md hover:shadow-xl hover:-translate-y-[2px]">
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
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF2D8E] text-white text-xs font-medium hover:bg-black transition"
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
                    <p className="text-[#FF2D8E] text-xs font-semibold mt-1">{provider.credentials}</p>
                  )}
                  <p className="text-black text-sm mt-1">{provider.role}</p>
                  <p className="text-black text-sm mt-3">{provider.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/book?provider=${provider.slug}`}
                      className="inline-flex items-center rounded-md bg-[#FF2D8E] hover:bg-black hover:text-[#FF2D8E] border-2 border-[#FF2D8E] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg"
                    >
                      Book with {provider.name.split(" ")[0]}
                    </Link>
                    <Link
                      href={`/providers/${provider.slug}`}
                      className="inline-flex items-center rounded-md border-2 border-black px-6 py-3 text-sm font-medium text-[#FF2D8E] hover:bg-[#FF2D8E]/10 transition"
                    >
                      View Profile
                    </Link>
                    {provider.telehealth && (
                      <a
                        href="/telehealth"
                        className="inline-flex items-center gap-2 text-[#FF2D8E] text-sm font-medium hover:text-black transition"
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
