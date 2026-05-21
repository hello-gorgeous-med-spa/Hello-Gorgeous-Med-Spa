"use client";

import Image from "next/image";
import Link from "next/link";
import { DANIELLE_CREDENTIALS, RYAN_CREDENTIALS } from "@/lib/provider-credentials";
import { providerPublicBookingUrl } from "@/lib/flows";

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
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            Oswego's Trusted <span className="text-[#FF2D8E]">Aesthetic Team</span>
          </h2>
          <p className="mt-6 text-lg max-w-2xl mx-auto">
            Medical Experts. Real Results.
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
                  <Link href={providerPublicBookingUrl(provider.slug)} className="btn-primary text-sm">
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

        <div className="mt-12 max-w-2xl mx-auto text-center rounded-3xl border-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <p className="text-lg font-bold text-black">
            Why having both a male and female practitioner matters
          </p>
          <p className="mt-3 text-black/80 font-medium leading-relaxed">
            More comfort. Smarter plans. A team that looks at your goals from more than one angle — without
            leaving Hello Gorgeous.
          </p>
          <Link
            href="/blog/male-female-practitioners-med-spa-advantage-oswego-il"
            className="mt-6 inline-flex items-center gap-1 font-bold text-[#E6007E] hover:text-[#FF2D8E] underline decoration-2 underline-offset-4 decoration-[#E6007E]"
          >
            Read the full article →
          </Link>
        </div>
      </div>
    </section>
  );
}
