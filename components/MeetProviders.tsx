"use client";

import Image from "next/image";
import Link from "next/link";
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
    <section className="section-white section-padding">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-[#FF2D8E] text-sm font-bold tracking-wider uppercase">Your Providers</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold">
            Meet the <span className="text-[#FF2D8E]">Team</span>
          </h2>
          <p className="mt-6 text-lg max-w-2xl mx-auto">
            Expert providers dedicated to your safety, comfort, and stunning results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {providers.map((provider) => (
            <div 
              key={provider.name}
              className="hg-card overflow-hidden p-0"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={provider.image}
                  alt={`${provider.name}, ${provider.credentials} at Hello Gorgeous Med Spa`}
                  fill
                  className="object-cover object-center hover:scale-105 transition duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {provider.telehealth && (
                  <div className="absolute top-4 right-4">
                    <a
                      href="/telehealth"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#FF2D8E] text-white text-xs font-bold hover:bg-black transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Telehealth Available
                    </a>
                  </div>
                )}
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold">{provider.name}</h3>
                {provider.credentials && (
                  <p className="text-[#FF2D8E] text-sm font-bold mt-2">{provider.credentials}</p>
                )}
                <p className="text-sm mt-1">{provider.role}</p>
                <p className="mt-4 leading-relaxed">{provider.bio}</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link href={`/book?provider=${provider.slug}`} className="btn-primary text-sm">
                    Book with {provider.name.split(" ")[0]}
                  </Link>
                  <Link href={`/providers/${provider.slug}`} className="btn-outline text-sm">
                    View Profile
                  </Link>
                </div>
                {provider.telehealth && (
                  <a
                    href="/telehealth"
                    className="inline-flex items-center gap-2 mt-4 text-[#FF2D8E] text-sm font-bold hover:text-black transition"
                  >
                    🖥️ Book Virtual Visit →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
