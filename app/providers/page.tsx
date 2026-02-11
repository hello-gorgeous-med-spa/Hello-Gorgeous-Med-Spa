import type { Metadata } from "next";

import { ProviderCard } from "@/components/providers/ProviderCard";
import { ResultsDisclaimer } from "@/components/providers/ResultsDisclaimer";
import { BOOKING_URL } from "@/lib/flows";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";
import { PROVIDER_FALLBACKS, PROVIDER_MEDIA_FALLBACK } from "@/lib/providers/fallback";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type PublicProvider = {
  id: string;
  slug: string;
  display_name: string;
  credentials?: string | null;
  tagline?: string | null;
  short_bio?: string | null;
  headshot_url?: string | null;
  intro_video_url?: string | null;
  booking_url?: string | null;
  media_counts?: { videos: number; results: number };
};

export const metadata: Metadata = pageMetadata({
  title: "Meet The Experts Behind Hello Gorgeous",
  description: "Licensed medical professionals. Real results. Personalized care from Danielle Alcala and Ryan Kent.",
  path: "/providers",
});

async function fetchProviders(): Promise<PublicProvider[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return Object.values(PROVIDER_FALLBACKS).map((provider) => ({
      id: provider.id,
      slug: provider.slug,
      display_name: provider.display_name,
      credentials: provider.credentials,
      tagline: provider.tagline,
      short_bio: provider.short_bio,
      headshot_url: provider.headshot_url,
      intro_video_url: provider.intro_video_url,
      booking_url: provider.booking_url,
      media_counts: {
        videos: (PROVIDER_MEDIA_FALLBACK[provider.slug] || []).filter((m) => m.media_type === "video").length,
        results: (PROVIDER_MEDIA_FALLBACK[provider.slug] || []).filter((m) => m.media_type === "before_after").length,
      },
    }));
  }

  const { data: providers } = await supabase
    .from("providers")
    .select("id, slug, display_name, credentials, tagline, short_bio, headshot_url, intro_video_url, booking_url, is_active")
    .eq("is_active", true)
    .order("display_name", { ascending: true });

  if (!providers || providers.length === 0) {
    return Object.values(PROVIDER_FALLBACKS).map((provider) => ({
      id: provider.id,
      slug: provider.slug,
      display_name: provider.display_name,
      credentials: provider.credentials,
      tagline: provider.tagline,
      short_bio: provider.short_bio,
      headshot_url: provider.headshot_url,
      intro_video_url: provider.intro_video_url,
      booking_url: provider.booking_url,
      media_counts: {
        videos: (PROVIDER_MEDIA_FALLBACK[provider.slug] || []).filter((m) => m.media_type === "video").length,
        results: (PROVIDER_MEDIA_FALLBACK[provider.slug] || []).filter((m) => m.media_type === "before_after").length,
      },
    }));
  }

  const { data: media } = await supabase
    .from("provider_media")
    .select("provider_id, media_type")
    .eq("status", "published");

  const counts = (media || []).reduce<Record<string, { videos: number; results: number }>>((acc, item) => {
    if (!acc[item.provider_id]) {
      acc[item.provider_id] = { videos: 0, results: 0 };
    }
    if (item.media_type === "video") acc[item.provider_id].videos += 1;
    if (item.media_type === "before_after") acc[item.provider_id].results += 1;
    return acc;
  }, {});

  return providers.map((provider) => ({
    id: provider.id,
    slug: provider.slug ?? "",
    display_name: provider.display_name || "Provider",
    credentials: provider.credentials,
    tagline: provider.tagline,
    short_bio: provider.short_bio,
    headshot_url: provider.headshot_url,
    intro_video_url: provider.intro_video_url,
    booking_url: provider.booking_url,
    media_counts: counts[provider.id] || { videos: 0, results: 0 },
  }));
}

export default async function ProvidersPage() {
  const providers = await fetchProviders();

  return (
    <main className="bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <section className="relative px-4 py-24 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm uppercase tracking-[0.5em] text-pink-400">Hello Gorgeous Providers</p>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Meet The Experts Behind Hello Gorgeous
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Licensed medical professionals. Real results. Personalized care. Every treatment plan begins with Danielle & Ryan’s oversight.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">🩺 Medical-grade injectables</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">📍 Oswego, IL</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">⚖️ Concierge treatment planning</span>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl">
          <p className="text-sm uppercase tracking-[0.5em] text-pink-400">Ready When You Are</p>
          <h2 className="mt-4 text-3xl font-bold">Book With Danielle or Ryan</h2>
          <p className="mt-2 text-white/70">
            Request a concierge consultation or secure your treatment spot. We’ll align your concerns with the right medical plan.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`${BOOKING_URL}?provider=danielle`}
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-semibold shadow-lg shadow-pink-500/30"
            >
              Book with Danielle
            </a>
            <a
              href={`${BOOKING_URL}?provider=ryan`}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Book with Ryan
            </a>
            <a href="/contact" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 hover:text-white">
              Text the Studio
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-12">
        <ResultsDisclaimer />
      </section>
    </main>
  );
}
