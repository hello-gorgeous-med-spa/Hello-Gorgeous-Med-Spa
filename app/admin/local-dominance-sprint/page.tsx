import { CityRankScoreboard } from "@/components/admin/CityRankScoreboard";
import { LocalDominanceSprintClient } from "@/components/admin/LocalDominanceSprintClient";

export default function LocalDominanceSprintPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-black text-black">Local Dominance Sprint</h1>
      <p className="mt-2 max-w-3xl text-black/70">
        Weekly lead-generation operating system to grow awareness and bookings using owned channels: SEO, Google Business,
        reviews, reactivation, and funnel optimization.
      </p>
      <div className="mt-6">
        <CityRankScoreboard />
      </div>
      <div className="mt-6">
        <LocalDominanceSprintClient />
      </div>
    </main>
  );
}
