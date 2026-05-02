import Link from "next/link";
import { getGooglePlace } from "@/lib/seo/google-places";
import { GOOGLE_REVIEW_URL, MAPS_DIRECTIONS_URL } from "@/lib/local-seo";
import { SITE } from "@/lib/seo";

/**
 * Server component — fetches live Google Place data (rating, review count,
 * "open now" status, today's hours) and renders a card. Caches at the fetch
 * layer for 24h, so this is effectively free in API-call terms.
 *
 * Renders nothing if Places API is unreachable / unconfigured, so it's safe
 * to drop on any page without worrying about fallback layouts.
 */
export async function LiveGooglePlaceCard({
  className = "",
  variant = "card",
}: {
  className?: string;
  variant?: "card" | "inline";
}) {
  const place = await getGooglePlace();
  if (!place) return null;

  const todayDescription = pickTodayHours(place.weekdayDescriptions);
  const isOpen = place.openNow === true;
  const isClosed = place.openNow === false;

  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ${className}`}>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-yellow-500">★★★★★</span>
          <span className="font-bold text-black">{place.rating.toFixed(1)}</span>
          <span className="text-gray-600">({place.userRatingCount} Google reviews)</span>
        </span>
        {place.openNow !== null && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                isOpen ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
              aria-hidden
            />
            <span className={`font-semibold ${isOpen ? "text-green-700" : "text-gray-700"}`}>
              {isOpen ? "Open now" : "Closed"}
            </span>
            {todayDescription && (
              <span className="text-gray-600">· {stripDayPrefix(todayDescription)}</span>
            )}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border-2 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] ${className}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E6007E]">
            Live from Google
          </p>
          <h3 className="mt-1 text-xl font-black text-black">{SITE.name}</h3>
        </div>
        {place.openNow !== null && (
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 ${
              isOpen
                ? "border-green-600 bg-green-50 text-green-700"
                : "border-gray-400 bg-gray-50 text-gray-600"
            }`}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                isOpen ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
              aria-hidden
            />
            {isOpen ? "Open now" : "Closed"}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-2xl font-black text-black">{place.rating.toFixed(1)}</span>
        <span className="text-yellow-500 text-lg" aria-label={`${place.rating} out of 5 stars`}>
          {renderStars(place.rating)}
        </span>
        <span className="text-sm text-gray-600">
          {place.userRatingCount} Google reviews
        </span>
      </div>

      {todayDescription && (
        <p className="mt-3 text-sm text-gray-700">
          <span className="font-semibold">Today:</span>{" "}
          {stripDayPrefix(todayDescription)}
        </p>
      )}

      {place.weekdayDescriptions.length > 0 && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-semibold text-gray-700 hover:text-black">
            All hours
          </summary>
          <ul className="mt-2 space-y-1 text-gray-600">
            {place.weekdayDescriptions.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E6007E] px-3 py-2 text-sm font-semibold text-white hover:bg-[#c9006e] transition"
        >
          ★ Leave a Google review
        </Link>
        <Link
          href={MAPS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black px-3 py-2 text-sm font-semibold text-black hover:bg-black hover:text-white transition"
        >
          📍 Get Directions
        </Link>
        {place.googleMapsUri && (
          <Link
            href={place.googleMapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            View on Google Maps →
          </Link>
        )}
      </div>
    </div>
  );
}

/** "Monday: 10:00 AM – 8:00 PM" -> the line for today's day-of-week. */
function pickTodayHours(descriptions: string[]): string | null {
  if (descriptions.length === 0) return null;
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[new Date().getDay()];
  return descriptions.find((d) => d.toLowerCase().startsWith(today.toLowerCase())) ?? descriptions[0];
}

function stripDayPrefix(line: string): string {
  return line.replace(/^[A-Za-z]+:\s*/, "");
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return "★".repeat(full) + (hasHalf ? "½" : "") + "☆".repeat(Math.max(0, 5 - full - (hasHalf ? 1 : 0)));
}
