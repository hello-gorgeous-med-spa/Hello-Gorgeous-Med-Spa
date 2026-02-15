import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResultsDisclaimer } from "@/components/providers/ResultsDisclaimer";
import { ResultsGallery } from "@/components/providers/ResultsGallery";
import { VideoGallery } from "@/components/providers/VideoGallery";
import { BOOKING_URL } from "@/lib/flows";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";
import { PROVIDER_FALLBACKS, PROVIDER_MEDIA_FALLBACK, applyProviderImageOverrides } from "@/lib/providers/fallback";
import { pageMetadata, providerBeforeAfterJsonLd, providerPersonJsonLd, providerVideoJsonLd } from "@/lib/seo";

export const revalidate = 300;

const KNOWN_PROVIDER_SLUGS = Object.keys(PROVIDER_FALLBACKS);

export function generateStaticParams() {
  return KNOWN_PROVIDER_SLUGS.map((slug) => ({ slug }));
}

type ProviderDetail = {
  id: string;
  slug: string;
  display_name: string;
  credentials?: string | null;
  tagline?: string | null;
  short_bio?: string | null;
  philosophy?: string | null;
  headshot_url?: string | null;
  hero_image_url?: string | null;
  intro_video_url?: string | null;
  booking_url?: string | null;
  color_hex?: string | null;
};

type MediaItem = {
  id: string;
  media_type: "video" | "before_after";
  title: string;
  description?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  before_image_url?: string | null;
  after_image_url?: string | null;
  service_tag?: string | null;
  alt_text?: string | null;
  consent_confirmed?: boolean;
  duration_seconds?: number | null;
};

function useFallback(slug: string): { provider: ProviderDetail; videos: MediaItem[]; results: MediaItem[] } | null {
  const fallback = Object.values(PROVIDER_FALLBACKS).find((p) => p.slug === slug);
  if (!fallback) return null;
  const media = PROVIDER_MEDIA_FALLBACK[slug] || [];
  return {
    provider: applyProviderImageOverrides({
      id: fallback.id,
      slug: fallback.slug,
      display_name: fallback.display_name,
      credentials: fallback.credentials,
      tagline: fallback.tagline,
      short_bio: fallback.short_bio,
      philosophy: fallback.philosophy,
      headshot_url: fallback.headshot_url,
      hero_image_url: fallback.hero_image_url,
      intro_video_url: fallback.intro_video_url,
      booking_url: fallback.booking_url,
      color_hex: fallback.color_hex || "#ec4899",
    }),
    videos: media.filter((item) => item.media_type === "video"),
    results: media.filter((item) => item.media_type === "before_after"),
  };
}

async function fetchProvider(slug: string): Promise<{ provider: ProviderDetail; videos: MediaItem[]; results: MediaItem[] } | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return useFallback(slug);

  try {
    const { data: provider } = await supabase
      .from("providers")
      .select("id, slug, display_name, credentials, tagline, short_bio, philosophy, headshot_url, hero_image_url, intro_video_url, booking_url, color_hex, is_active")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (!provider) return useFallback(slug);

    const { data: media } = await supabase
      .from("provider_media")
      .select("id, media_type, title, description, video_url, thumbnail_url, before_image_url, after_image_url, service_tag, alt_text, consent_confirmed, duration_seconds")
      .eq("provider_id", provider.id)
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true });

    const videos = (media || []).filter((item) => item.media_type === "video");
    const results = (media || []).filter((item) => item.media_type === "before_after" && item.consent_confirmed);

    return { provider: applyProviderImageOverrides(provider), videos, results };
  } catch {
    return useFallback(slug);
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const profile = await fetchProvider(params.slug.toLowerCase());
  if (!profile) {
    return pageMetadata({
      title: "Provider",
      description: "Licensed medical professionals at Hello Gorgeous.",
      path: `/providers/${params.slug}`,
    });
  }
  return pageMetadata({
    title: `${profile.provider.display_name} | Hello Gorgeous Providers`,
    description: profile.provider.short_bio || "Licensed medical professional at Hello Gorgeous Med Spa.",
    path: `/providers/${params.slug}`,
  });
}

export default async function ProviderDetailPage({ params }: { params: { slug: string } }) {
  const profile = await fetchProvider(params.slug.toLowerCase());
  if (!profile) {
    notFound();
  }
  const { provider, videos, results } = profile;
  const schema = [
    providerPersonJsonLd({
      name: provider.display_name,
      credentials: provider.credentials,
      description: provider.short_bio,
      image: provider.headshot_url,
    }),
    ...providerVideoJsonLd(provider.display_name, videos),
    ...providerBeforeAfterJsonLd(provider.display_name, results),
  ];

  return (
    <main className="bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-12">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-transparent to-purple-500/10" />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
              {provider.headshot_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={provider.headshot_url} alt={provider.display_name} className="h-full w-full object-cover" loading="eager" decoding="async" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl">👩‍⚕️</div>
              )}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.5em] text-pink-400">Provider</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{provider.display_name}</h1>
              <p className="mt-2 text-blue-200">{provider.credentials}</p>
              <p className="mt-4 text-lg text-white/80">{provider.tagline}</p>
              <div className="mt-8 flex flex-wrap gap-4 text-sm">
                <a
                  href={provider.booking_url || `${BOOKING_URL}?provider=${provider.slug}`}
                  className="rounded-md bg-hg-pink hover:bg-hg-pinkDeep px-10 py-4 font-semibold uppercase tracking-widest text-sm text-white transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg"
                >
                  Book with {provider.display_name.split(" ")[0]}
                </a>
                <a href="/contact" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white/80 hover:text-white">
                  Text the studio
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <p className="text-sm uppercase tracking-[0.5em] text-pink-400">Philosophy</p>
          <p className="text-lg leading-relaxed text-white/80">{provider.philosophy || provider.short_bio}</p>
        </div>
      </section>

      {/* Videos Section */}
      {videos.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-5xl space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.5em] text-pink-400">Videos</p>
              <h2 className="mt-2 text-3xl font-bold">Watch & Learn</h2>
              <p className="text-white/70">Quick clips that explain techniques, safety, and behind-the-scenes care.</p>
            </div>
            <VideoGallery videos={videos} />
          </div>
        </section>
      )}

      {/* Results Section with Filtering */}
      {results.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-5xl space-y-10">
            <div>
              <p className="text-sm uppercase tracking-[0.5em] text-pink-400">Results</p>
              <h2 className="mt-2 text-3xl font-bold">Before & After Library</h2>
              <p className="text-white/70">All clients granted written consent prior to publishing results.</p>
            </div>
            <ResultsGallery results={results} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl">
          <p className="text-sm uppercase tracking-[0.5em] text-pink-400">Stay in touch</p>
          <h2 className="mt-4 text-3xl font-bold">Your plan stays under Danielle & Ryan&apos;s oversight</h2>
          <p className="mt-2 text-white/70">
            Book a consultation or text our concierge. We&apos;ll align your timeline, budget, and safety considerations.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={provider.booking_url || `${BOOKING_URL}?provider=${provider.slug}`}
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold shadow-lg shadow-pink-500/30"
            >
              Book with {provider.display_name.split(" ")[0]}
            </a>
            <a href="/contact" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white/80 hover:text-white">
              Text the studio
            </a>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="px-4 pb-24 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <ResultsDisclaimer />
        </div>
      </section>
    </main>
  );
}
