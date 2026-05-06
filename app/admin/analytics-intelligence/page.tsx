import { AnalyticsIntelligenceClient } from "@/components/admin/AnalyticsIntelligenceClient";

export default function AnalyticsIntelligencePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-black text-black">Analytics Intelligence Dashboard</h1>
      <p className="mt-2 max-w-3xl text-black/70">
        Conversion-oriented dashboard for treatment demand, funnel performance, lead trends, concern interest, and future event tracking layers.
      </p>
      <div className="mt-6">
        <AnalyticsIntelligenceClient />
      </div>
    </main>
  );
}
