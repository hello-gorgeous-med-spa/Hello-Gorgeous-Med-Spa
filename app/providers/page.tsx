import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BOOKING_URL } from "@/lib/flows";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Our Providers | Hello Gorgeous Med Spa",
  description:
    "Meet the licensed medical professionals behind Hello Gorgeous Med Spa. Real results. Personalized care. Advanced aesthetic expertise.",
  openGraph: {
    title: "Our Providers | Hello Gorgeous Med Spa",
    description:
      "Meet the licensed medical professionals behind Hello Gorgeous Med Spa.",
    type: "website",
  },
};

async function getProviders() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("providers")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export default async function ProvidersPage() {
  const providers = await getProviders();

  // Fallback to hardcoded providers if database is empty
  const displayProviders =
    providers.length > 0
      ? providers
      : [
          {
            slug: "danielle",
            name: "Danielle Alcala",
            role: "Founder, Hello Gorgeous Med Spa",
            credentials: "Licensed CNA • CMAA • Phlebotomist",
            headshot_url: "/images/team/danielle.png",
            bio: "Passionate about helping clients feel confident and beautiful. Patient-first care philosophy with a focus on personalized treatments.",
            telehealth_enabled: false,
          },
          {
            slug: "ryan",
            name: "Ryan Kent",
            role: "Medical Director",
            credentials: "MSN, FNP-C, ABAAHP • Full Practice Authority NP",
            headshot_url: "/images/providers/ryan-kent-clinic.jpg",
            bio: "Board-Certified Family Nurse Practitioner with full prescriptive authority. Specializing in weight management, hormone optimization, and regenerative medicine.",
            telehealth_enabled: true,
          },
        ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-black leading-tight">
            Meet The Experts Behind{" "}
            <span className="text-[#E6007E]">Hello Gorgeous</span>
          </h1>
          <p className="mt-6 text-xl text-black/70 max-w-2xl mx-auto">
            Licensed medical professionals. Real results. Personalized care.
          </p>
        </div>
      </section>

      {/* Provider Cards */}
      <section className="bg-white pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            {displayProviders.map((provider) => (
              <article
                key={provider.slug}
                className="bg-white border border-black rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={provider.headshot_url || "/images/team/placeholder.png"}
                    alt={`${provider.name}, ${provider.credentials}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {provider.telehealth_enabled && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6007E] text-white text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        Telehealth Available
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-black">
                    {provider.name}
                  </h2>
                  <p className="mt-1 text-[#E6007E] font-semibold">
                    {provider.credentials}
                  </p>
                  <p className="mt-1 text-black/60">{provider.role}</p>
                  <p className="mt-4 text-black/70 leading-relaxed">
                    {provider.bio}
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/providers/${provider.slug}`}
                      className="inline-flex items-center justify-center border-2 border-black text-black px-6 py-3 rounded-lg font-semibold hover:border-[#E6007E] hover:text-[#E6007E] transition-all"
                    >
                      View Results
                    </Link>
                    <Link
                      href={`${BOOKING_URL}?provider=${provider.slug}`}
                      className="inline-flex items-center justify-center bg-[#E6007E] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
                    >
                      Book with {provider.name.split(" ")[0]}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-[#E6007E] text-3xl font-semibold">500+</p>
              <p className="text-white text-sm mt-1">Happy Clients</p>
            </div>
            <div>
              <p className="text-[#E6007E] text-3xl font-semibold">5.0</p>
              <p className="text-white text-sm mt-1">Google Rating</p>
            </div>
            <div>
              <p className="text-[#E6007E] text-3xl font-semibold">10+</p>
              <p className="text-white text-sm mt-1">Years Experience</p>
            </div>
            <div>
              <p className="text-[#E6007E] text-3xl font-semibold">100%</p>
              <p className="text-white text-sm mt-1">Medical Grade</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-black">
            Ready to Get Started?
          </h2>
          <p className="mt-6 text-lg text-black/70">
            Book your consultation today and discover the Hello Gorgeous difference.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={BOOKING_URL}
              className="inline-flex items-center justify-center bg-[#E6007E] text-white px-10 py-4 rounded-lg font-semibold uppercase tracking-wide hover:opacity-90 transition-all"
            >
              Book Consultation
            </Link>
            <a
              href="tel:630-636-6193"
              className="inline-flex items-center justify-center border-2 border-black text-black px-10 py-4 rounded-lg font-semibold uppercase tracking-wide hover:border-[#E6007E] hover:text-[#E6007E] transition-all"
            >
              Call 630-636-6193
            </a>
          </div>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            name: "Hello Gorgeous Med Spa",
            address: {
              "@type": "PostalAddress",
              streetAddress: "2931 Route 34",
              addressLocality: "Oswego",
              addressRegion: "IL",
              postalCode: "60543",
            },
            employee: displayProviders.map((p) => ({
              "@type": "Person",
              name: p.name,
              jobTitle: p.role,
              description: p.bio,
            })),
          }),
        }}
      />
    </main>
  );
}
