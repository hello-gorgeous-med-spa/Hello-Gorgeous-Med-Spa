import Link from "next/link";

import { createServerSupabaseClient } from "@/lib/hgos/supabase";
import { HOME_TESTIMONIALS, SITE } from "@/lib/seo";

/**
 * RealPatientReviews — server component that pulls authentic patient reviews
 * from Supabase `client_reviews` table for a given service category and
 * renders them as named-patient social proof cards on SEO landing pages.
 *
 * Design goals
 *  - Server-rendered HTML so Google crawlers see all review text + names
 *  - Schema.org Review + AggregateRating markup → unlocks star rich snippets
 *    in search results (the visible 4.9 ★ ★ ★ ★ ★ in the SERP listing)
 *  - Falls back to curated HOME_TESTIMONIALS if Supabase is unavailable
 *  - Filters by service so each landing page sees only on-topic reviews
 *
 * Why this matters: HER Aesthetics' biggest CTR weapon is named-patient
 * social proof on every service page. We're matching it with authentic data.
 */

export type ReviewServiceCategory =
  | "botox"
  | "weight-loss"
  | "morpheus8"
  | "lip-filler"
  | "fillers"
  | "general";

type ReviewRow = {
  id: string;
  rating: number;
  review_text: string;
  client_name: string | null;
  service_name: string | null;
  created_at: string;
  source: string;
};

type DisplayReview = {
  id: string;
  rating: number;
  text: string;
  name: string;
  service?: string | null;
  date?: string;
  location?: string;
};

const SERVICE_FILTERS: Record<ReviewServiceCategory, string[]> = {
  botox: ["botox", "dysport", "jeuveau", "neurotoxin", "tox"],
  "weight-loss": [
    "weight loss",
    "semaglutide",
    "tirzepatide",
    "ozempic",
    "wegovy",
    "mounjaro",
    "zepbound",
    "glp",
  ],
  morpheus8: ["morpheus", "rf microneedling", "skin tightening", "burst"],
  "lip-filler": ["lip filler", "lip"],
  fillers: ["filler", "dermal filler", "cheek", "chin"],
  general: [],
};

const FALLBACK_BY_CATEGORY: Record<ReviewServiceCategory, DisplayReview[]> =
  (() => {
    const fromHome = (svcContains: string[], idPrefix: string): DisplayReview[] =>
      HOME_TESTIMONIALS.filter((t) => {
        const svc = t.service.toLowerCase();
        return svcContains.length === 0 || svcContains.some((k) => svc.includes(k));
      }).map((t, i) => ({
        id: `${idPrefix}-${i}`,
        rating: t.rating,
        text: t.text,
        name: t.name,
        service: t.service,
        location: t.location,
      }));
    return {
      botox: fromHome(["botox", "dysport", "jeuveau"], "fallback-botox"),
      "weight-loss": fromHome(["weight"], "fallback-wl"),
      morpheus8: fromHome([], "fallback-m8").slice(0, 2),
      "lip-filler": fromHome(["lip", "filler"], "fallback-lip"),
      fillers: fromHome(["filler"], "fallback-fillers"),
      general: fromHome([], "fallback-gen"),
    };
  })();

async function fetchReviews(
  category: ReviewServiceCategory,
  limit: number,
): Promise<DisplayReview[]> {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return [];
    const filters = SERVICE_FILTERS[category];

    let query = supabase
      .from("client_reviews")
      .select("id, rating, review_text, client_name, service_name, created_at, source")
      .gte("rating", 4)
      .not("review_text", "is", null)
      .not("client_name", "is", null)
      .order("rating", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit * 3);

    if (filters.length > 0) {
      const orFilter = filters.map((f) => `service_name.ilike.%${f}%`).join(",");
      query = query.or(orFilter);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    const seen = new Set<string>();
    const rows: DisplayReview[] = [];
    for (const r of data as ReviewRow[]) {
      const text = (r.review_text || "").trim();
      if (text.length < 60 || text.length > 600) continue;
      const name = (r.client_name || "").trim();
      if (!name) continue;
      const key = text.slice(0, 120).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        id: r.id,
        rating: r.rating,
        text,
        name: shortName(name),
        service: r.service_name,
        date: r.created_at,
      });
      if (rows.length >= limit) break;
    }
    return rows;
  } catch {
    return [];
  }
}

function shortName(full: string): string {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-[#FF2D8E] text-lg" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} aria-hidden="true">
          {i <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export async function RealPatientReviews({
  service,
  serviceLabel,
  limit = 6,
  heading,
  intro,
}: {
  service: ReviewServiceCategory;
  serviceLabel?: string;
  limit?: number;
  heading?: string;
  intro?: string;
}) {
  const fetched = await fetchReviews(service, limit);
  const reviews = fetched.length >= 2 ? fetched : FALLBACK_BY_CATEGORY[service];
  if (!reviews || reviews.length === 0) return null;

  const label = serviceLabel ?? "Hello Gorgeous";
  const aggregate = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.streetAddress,
        addressLocality: SITE.address.addressLocality,
        addressRegion: SITE.address.addressRegion,
        postalCode: SITE.address.postalCode,
      },
    },
    ratingValue: SITE.reviewRating,
    reviewCount: SITE.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
  const reviewLd = reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: { "@type": "Person", name: r.name },
    reviewBody: r.text,
    itemReviewed: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
    },
  }));

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-rose-50 via-white to-white border-y-4 border-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregate) }}
      />
      {reviewLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#E6007E] text-sm font-bold tracking-widest uppercase">
            Real Patient Reviews
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-black">
            {heading ?? `What ${label} clients are saying`}
          </h2>
          <p className="mt-4 text-black/70 max-w-2xl mx-auto">
            {intro ??
              `${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars · Real clients in their own words.`}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-[#E6007E] text-2xl tracking-wide">★ ★ ★ ★ ★</span>
            <span className="font-bold text-black">{SITE.reviewRating}</span>
            <span className="text-black/60">on Google</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, limit).map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"
            >
              <StarRow rating={r.rating} />
              <p className="mt-4 text-black/85 leading-relaxed text-[15px]">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t-2 border-black/10 flex items-center justify-between">
                <div>
                  <p className="font-bold text-black">{r.name}</p>
                  {r.location && (
                    <p className="text-xs text-black/60">{r.location}</p>
                  )}
                </div>
                {r.service && (
                  <span className="inline-flex items-center rounded-full border-2 border-[#E6007E]/40 bg-[#FFF0F7] px-3 py-1 text-xs font-semibold text-[#E6007E]">
                    {r.service}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={SITE.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E6007E] hover:bg-[#9b0a4d] text-white font-bold transition-colors"
          >
            <span aria-hidden="true">★</span> Read all {SITE.reviewCount}+ Google reviews
          </a>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-black bg-white hover:bg-rose-50 text-black font-bold transition-colors"
          >
            See more patient stories
          </Link>
        </div>
      </div>
    </section>
  );
}
