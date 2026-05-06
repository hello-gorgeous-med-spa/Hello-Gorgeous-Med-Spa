"use client";

import { useEffect, useState } from "react";

type DashboardPayload = {
  topViewedTreatments: Array<{ slug: string; views: number; note?: string }>;
  highestConvertingFunnels: Array<{ slug: string; submissions: number }>;
  consultationSubmissionTrends: Array<{ day: string; count: number }>;
  concernPageTraffic: Array<{ concern: string; submissions: number }>;
  internalSearchTerms: Array<{ term: string; count: number }>;
  ctaClickTracking: { note: string; trackedCtas: string[] };
  bookingClickAttribution: Array<{ label: string; count: number }>;
  videoEngagement: Array<{ id: string; title: string; engagements: number; note?: string }>;
  faqEngagement: { note: string; topFaqs: Array<{ id: string; count: number }> };
};

export function AnalyticsIntelligenceClient() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/analytics-intelligence")
      .then((r) => r.json())
      .then((payload) => {
        if (payload.error) throw new Error(payload.error);
        setData(payload);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load analytics."));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-black/60">Loading analytics intelligence...</p>;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border-2 border-black bg-white p-5">
          <h2 className="text-lg font-bold text-[#E6007E]">Top viewed treatments</h2>
          <ul className="mt-3 space-y-1 text-sm text-black/80">
            {data.topViewedTreatments.map((item) => (
              <li key={item.slug}>{item.slug}: {item.views}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border-2 border-black bg-white p-5">
          <h2 className="text-lg font-bold text-[#E6007E]">Highest converting funnels</h2>
          <ul className="mt-3 space-y-1 text-sm text-black/80">
            {data.highestConvertingFunnels.map((item) => (
              <li key={item.slug}>{item.slug}: {item.submissions}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border-2 border-black bg-white p-5">
          <h2 className="text-lg font-bold text-[#E6007E]">Consultation submission trends</h2>
          <ul className="mt-3 space-y-1 text-sm text-black/80">
            {data.consultationSubmissionTrends.map((item) => (
              <li key={item.day}>{item.day}: {item.count}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border-2 border-black bg-white p-5">
          <h2 className="text-lg font-bold text-[#E6007E]">Concern page traffic proxy</h2>
          <ul className="mt-3 space-y-1 text-sm text-black/80">
            {data.concernPageTraffic.map((item) => (
              <li key={item.concern}>{item.concern}: {item.submissions}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
        <h2 className="text-lg font-bold text-black">Tracking notes</h2>
        <p className="mt-2 text-sm text-black/75">{data.ctaClickTracking.note}</p>
        <p className="mt-1 text-sm text-black/75">{data.faqEngagement.note}</p>
      </section>
    </div>
  );
}
