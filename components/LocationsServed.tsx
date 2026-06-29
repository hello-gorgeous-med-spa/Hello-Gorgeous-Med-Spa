import Link from "next/link";

import {
  GBP_SLUG_TO_SERVICE,
  MED_SPA_LOCATION_SLUGS,
  MED_SPA_SLUG_TO_CITY,
} from "@/lib/gbp-urls";
import { PRIMARY_CITY_SLUGS } from "@/lib/city-seo-tier";
import { OSWEGO_CHIP_CANONICAL_PATH } from "@/lib/service-pages-oswego/canonical-paths";

/**
 * Locations Served — global internal-link block
 * ----------------------------------------------
 * Renders a per-city grid of links so every page on the site links to every
 * city/service landing page. This kills "orphan page" SEO issues in one shot:
 * Google can crawl every city page directly from the footer of any URL.
 *
 * Structure for each city:
 *   <City Name> — <chip>Botox</chip> · <chip>Lip Filler</chip> · <chip>Weight Loss</chip> ...
 *
 * Cities and their available services come from `lib/gbp-urls.ts` so we never
 * link a 404; if a slug isn't in `GBP_SLUG_TO_SERVICE`, we don't render a chip
 * for it.
 */

// Core Fox Valley service area only. Far-flung cities (Sugar Grove, Ottawa,
// Sandwich, Bolingbrook) were thin templated pages Google refused to index, so
// they are noindexed and intentionally not linked here — we concentrate
// internal link equity on the cities we actually rank for.
const CITY_ORDER = PRIMARY_CITY_SLUGS.map((slug) => ({
  slug: `${slug}-il`,
  label: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
}));

// These cities have a dedicated hub route (/{slug}) with service sub-pages.
// Linking the city name straight to the hub fixes the "Discovered - not
// indexed" orphan problem (the hubs previously had no inbound internal links).
const CITY_HUB_SLUGS = new Set(PRIMARY_CITY_SLUGS.map((c) => `${c}-il`));

const SERVICE_CHIPS: Array<{ prefix: string; short: string }> = [
  { prefix: "med-spa", short: "Med Spa" },
  { prefix: "botox", short: "Botox" },
  { prefix: "lip-filler", short: "Lip Filler" },
  { prefix: "weight-loss", short: "Weight Loss" },
  { prefix: "laser-hair-removal", short: "Laser Hair" },
  { prefix: "morpheus8", short: "Morpheus8" },
  { prefix: "co2-laser", short: "CO2 Laser" },
  { prefix: "dermal-fillers", short: "Dermal Fillers" },
];

const LASER_HAIR_CITIES = new Set([
  "oswego-il",
  "naperville-il",
  "aurora-il",
  "plainfield-il",
  "yorkville-il",
  "montgomery-il",
]);

const MORPHEUS8_CITIES = new Set([
  "oswego-il",
  "naperville-il",
  "aurora-il",
  "plainfield-il",
]);

const CO2_LASER_CITIES = new Set([
  "oswego-il",
  "naperville-il",
  "aurora-il",
]);

const MED_SPA_CITY_SET = new Set(
  MED_SPA_LOCATION_SLUGS.map((s) => s.replace(/^med-spa-/, "")),
);

function chipsForCity(citySlug: string): Array<{ href: string; label: string }> {
  const out: Array<{ href: string; label: string }> = [];
  for (const chip of SERVICE_CHIPS) {
    if (citySlug === "oswego-il") {
      const oswegoPath = OSWEGO_CHIP_CANONICAL_PATH[chip.prefix];
      if (oswegoPath) {
        out.push({ href: oswegoPath, label: chip.short });
        continue;
      }
    }

    let slug: string | null = null;
    if (chip.prefix === "med-spa") {
      const candidate = `med-spa-${citySlug}`;
      if (MED_SPA_CITY_SET.has(citySlug) && MED_SPA_SLUG_TO_CITY[candidate]) {
        slug = candidate;
      }
    } else if (chip.prefix === "laser-hair-removal") {
      if (LASER_HAIR_CITIES.has(citySlug)) {
        slug = `laser-hair-removal-${citySlug}`;
      }
    } else if (chip.prefix === "morpheus8") {
      if (MORPHEUS8_CITIES.has(citySlug)) {
        slug = `morpheus8-${citySlug}`;
      }
    } else if (chip.prefix === "co2-laser") {
      if (CO2_LASER_CITIES.has(citySlug)) {
        slug = `co2-laser-${citySlug}`;
      }
    } else {
      const candidate = `${chip.prefix}-${citySlug}`;
      if (GBP_SLUG_TO_SERVICE[candidate]) {
        slug = candidate;
      }
    }
    if (slug) out.push({ href: `/${slug}`, label: chip.short });
  }
  return out;
}

export function LocationsServed({
  variant = "footer",
}: { variant?: "footer" | "page" } = {}) {
  const isFooter = variant === "footer";
  const headingClass = isFooter
    ? "font-bold text-[#FF2D8E] mb-4 text-sm uppercase tracking-wider"
    : "text-2xl md:text-3xl font-bold text-[#E6007E] mb-3";
  const cityNameClass = isFooter
    ? "text-white font-semibold text-sm hover:text-[#FF2D8E] transition-colors"
    : "text-black font-bold hover:text-[#E6007E] transition-colors";
  const chipClass = isFooter
    ? "inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs text-white/75 hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-colors"
    : "inline-flex items-center rounded-full border-2 border-black/10 bg-white px-3 py-1 text-xs text-black/70 hover:border-[#E6007E] hover:text-[#E6007E] transition-colors";

  return (
    <section
      aria-label="Locations we serve"
      className={isFooter ? "mt-10 pt-8 border-t border-black" : "py-10"}
    >
      <h4 className={headingClass}>Service Areas — Western Suburbs of Chicago</h4>
      {!isFooter && (
        <p className="text-black/70 mb-6 max-w-2xl">
          Hello Gorgeous Med Spa is in Oswego, IL and serves the surrounding
          area. Browse the treatments we offer in your city below.
        </p>
      )}
      <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {CITY_ORDER.map((city) => {
          const chips = chipsForCity(city.slug);
          if (chips.length === 0) return null;
          const medSpaSlug = `med-spa-${city.slug}`;
          // Prefer the dedicated city hub (fixes orphaned hubs); the med-spa
          // landing page stays linked via its own "Med Spa" chip below.
          const cityHref = CITY_HUB_SLUGS.has(city.slug)
            ? `/${city.slug}`
            : MED_SPA_CITY_SET.has(city.slug) && MED_SPA_SLUG_TO_CITY[medSpaSlug]
              ? `/${medSpaSlug}`
              : chips[0]?.href ?? "/contact";
          return (
            <li key={city.slug} className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                <Link href={cityHref} className={cityNameClass}>
                  {city.label}, IL
                </Link>
                <span aria-hidden="true" className={isFooter ? "text-white/30" : "text-black/30"}>
                  ·
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {chips.map((chip) => (
                    <Link key={chip.href} href={chip.href} className={chipClass}>
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
