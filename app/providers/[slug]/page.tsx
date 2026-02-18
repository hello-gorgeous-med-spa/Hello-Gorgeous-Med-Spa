import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BOOKING_URL } from "@/lib/flows";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProviderVideos } from "./ProviderVideos";
import { ProviderResults } from "./ProviderResults";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProvider(slug: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: provider } = await supabase
      .from("providers")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();
    return provider;
  } catch {
    return null;
  }
}

async function getProviderMedia(providerId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: media } = await supabase
      .from("provider_media")
      .select("*")
      .eq("provider_id", providerId)
      .eq("status", "published")
      .eq("consent_confirmed", true)
      .order("featured", { ascending: false })
      .order("display_order", { ascending: true });
    return media || [];
  } catch {
    return [];
  }
}

async function getServiceTags() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("provider_service_tags")
      .select("*")
      .order("display_order", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

// Fallback providers for when database is empty
const fallbackProviders: Record<string, {
  slug: string;
  name: string;
  role: string;
  credentials: string;
  headshot_url: string;
  bio: string;
  philosophy: string;
  telehealth_enabled: boolean;
}> = {
  danielle: {
    slug: "danielle",
    name: "Danielle Alcala",
    role: "Founder, Hello Gorgeous Med Spa",
    credentials: "Licensed CNA • CMAA • Phlebotomist",
    headshot_url: "/images/team/danielle.png",
    bio: "Passionate about helping clients feel confident and beautiful. Patient-first care philosophy with a focus on personalized treatments.",
    philosophy: "Every client deserves to feel gorgeous. My approach is rooted in listening to your goals and creating a personalized plan that enhances your natural beauty.",
    telehealth_enabled: false,
  },
  ryan: {
    slug: "ryan",
    name: "Ryan Kent",
    role: "Medical Director",
    credentials: "MSN, FNP-C, ABAAHP • Full Practice Authority NP",
    headshot_url: "/images/providers/ryan-kent-clinic.jpg",
    bio: "Board-Certified Family Nurse Practitioner with full prescriptive authority. Specializing in weight management, hormone optimization, and regenerative medicine.",
    philosophy: "Medical aesthetics should be grounded in science and delivered with care. I focus on evidence-based treatments that deliver real, measurable results.",
    telehealth_enabled: true,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const provider = (await getProvider(slug)) || fallbackProviders[slug];

  if (!provider) {
    return { title: "Provider Not Found" };
  }

  return {
    title: `${provider.name} | Hello Gorgeous Med Spa`,
    description: provider.bio,
    openGraph: {
      title: `${provider.name} | Hello Gorgeous Med Spa`,
      description: provider.bio,
      type: "profile",
    },
  };
}

export default async function ProviderProfilePage({ params }: Props) {
  const { slug } = await params;
  let provider = await getProvider(slug);
  let media: Array<{
    id: string;
    type: string;
    video_url?: string;
    video_thumbnail_url?: string;
    video_orientation?: string;
    before_image_url?: string;
    after_image_url?: string;
    service_tag?: string;
    title?: string;
    description?: string;
    featured?: boolean;
  }> = [];

  // Use fallback if no database provider
  if (!provider) {
    const fallback = fallbackProviders[slug];
    if (!fallback) {
      notFound();
    }
    provider = fallback as typeof provider;
  } else {
    media = await getProviderMedia(provider.id);
  }

  const serviceTags = await getServiceTags();

  const videos = media.filter((m) => m.type === "video");
  const beforeAfter = media.filter((m) => m.type === "before_after");

  return (
    <main className="bg-white">
      {/* About Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Photo */}
            <div className="relative">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src={provider.headshot_url || "/images/team/placeholder.png"}
                  alt={`${provider.name}, ${provider.credentials}`}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {provider.telehealth_enabled && (
                <div className="absolute top-4 right-4">
                  <Link
                    href="/telehealth"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6007E] text-white text-sm font-semibold hover:opacity-90 transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Telehealth Available
                  </Link>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold text-black">
                {provider.name}
              </h1>
              <p className="mt-2 text-[#E6007E] text-lg font-semibold">
                {provider.credentials}
              </p>
              <p className="mt-1 text-black/60">{provider.role}</p>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-black mb-4">About</h2>
                <p className="text-black/70 leading-relaxed">{provider.bio}</p>
              </div>

              {provider.philosophy && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-black mb-4">
                    Philosophy
                  </h2>
                  <p className="text-black/70 leading-relaxed italic">
                    "{provider.philosophy}"
                  </p>
                </div>
              )}

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href={`${BOOKING_URL}?provider=${provider.slug}`}
                  className="inline-flex items-center justify-center bg-[#E6007E] text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all"
                >
                  Book with {provider.name.split(" ")[0]}
                </Link>
                {provider.telehealth_enabled && (
                  <Link
                    href="/telehealth"
                    className="inline-flex items-center justify-center border-2 border-black text-black px-8 py-4 rounded-lg font-semibold hover:border-[#E6007E] hover:text-[#E6007E] transition-all"
                  >
                    Virtual Consultation
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      {videos.length > 0 && (
        <ProviderVideos videos={videos} providerName={provider.name} />
      )}

      {/* Results Section */}
      {beforeAfter.length > 0 && (
        <ProviderResults
          results={beforeAfter}
          serviceTags={serviceTags}
          providerName={provider.name}
        />
      )}

      {/* CTA Section */}
      <section className="bg-black py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Ready to Book with {provider.name.split(" ")[0]}?
          </h2>
          <p className="mt-6 text-lg text-white/80">
            Schedule your consultation and start your transformation journey.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`${BOOKING_URL}?provider=${provider.slug}`}
              className="inline-flex items-center justify-center bg-[#E6007E] text-white px-10 py-4 rounded-lg font-semibold uppercase tracking-wide hover:opacity-90 transition-all"
            >
              Book with {provider.name.split(" ")[0]}
            </Link>
            <a
              href="tel:630-636-6193"
              className="inline-flex items-center justify-center border-2 border-white text-white px-10 py-4 rounded-lg font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-all"
            >
              Call 630-636-6193
            </a>
          </div>
        </div>
      </section>

      {/* Compliance Disclaimer */}
      <section className="bg-white py-8 border-t border-black/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <p className="text-sm text-black/50">
            Results vary by individual. All treatments performed by licensed
            medical professionals. Client consent on file.
          </p>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: provider.name,
            jobTitle: provider.role,
            description: provider.bio,
            worksFor: {
              "@type": "MedicalBusiness",
              name: "Hello Gorgeous Med Spa",
            },
          }),
        }}
      />
    </main>
  );
}
