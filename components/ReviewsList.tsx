"use client";

import { useEffect, useState } from "react";
import { FadeUp } from "./Section";

type Review = {
  id: string;
  rating: number;
  review_text: string;
  client_name: string | null;
  service_name: string | null;
  created_at: string;
  source: "fresha_legacy" | "hg_os" | "google";
  is_verified: boolean;
};

export function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [serviceFilter, setServiceFilter] = useState("");

  const fetchReviews = async (rating?: string, service?: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (rating) params.set("rating", rating);
    if (service) params.set("service", service);
    try {
      const res = await fetch(`/api/reviews?${params.toString()}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setTotal(data.total ?? 0);
    } catch {
      setReviews([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(ratingFilter || undefined, serviceFilter || undefined);
  }, [ratingFilter, serviceFilter]);

  const formatDate = (s: string) => {
    try {
      const d = new Date(s);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-black">
          <span>Rating:</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="rounded-lg border border-black bg-black/40 px-3 py-2 text-white focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            <option value="">All</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-black">
          <span>Service:</span>
          <input
            type="text"
            placeholder="Filter by service..."
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            onBlur={() => fetchReviews(ratingFilter || undefined, serviceFilter || undefined)}
            onKeyDown={(e) => e.key === "Enter" && fetchReviews(ratingFilter || undefined, serviceFilter || undefined)}
            className="rounded-lg border border-black bg-black/40 px-3 py-2 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 min-w-[180px]"
          />
        </label>
      </div>

      {loading ? (
        <p className="text-black">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-black">No reviews yet. Be the first to leave feedback after your visit!</p>
      ) : (
        <>
          <p className="text-sm text-black">
            {total} review{total !== 1 ? "s" : ""} · Sorted by highest rating, then newest
          </p>
          <ul className="space-y-4">
            {reviews.map((r, i) => (
              <FadeUp key={r.id} delayMs={Math.min(i * 20, 120)}>
                <li className="rounded-2xl border border-black bg-black/40 p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-amber-400" aria-label={`${r.rating} stars`}>
                      {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </span>
                    {r.service_name && (
                      <span className="text-xs font-medium text-pink-400/90 bg-pink-500/10 px-2 py-0.5 rounded">
                        {r.service_name}
                      </span>
                    )}
                    {r.is_verified && (
                      <span className="text-xs text-black">Verified client review</span>
                    )}
                    {r.source === "fresha_legacy" && (
                      <span className="text-xs text-black">Imported review</span>
                    )}
                  </div>
                  <p className="text-white leading-relaxed">{r.review_text}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-black">
                    {r.client_name && <span>{r.client_name}</span>}
                    <span>{formatDate(r.created_at)}</span>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
