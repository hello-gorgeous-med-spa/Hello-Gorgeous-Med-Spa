import { CityRankScoreboard } from "@/components/admin/CityRankScoreboard";
import { CompetitorWatch } from "@/components/admin/CompetitorWatch";
import { LocalDominanceSprintClient } from "@/components/admin/LocalDominanceSprintClient";
import { OswegoNumberOneHub } from "@/components/admin/OswegoNumberOneHub";

export default function LocalDominanceSprintPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-black text-black">Oswego #1 Command Center</h1>
      <p className="mt-2 max-w-3xl text-black/70">
        Your weekly operating system to become the top med spa in Oswego — beat HER on Google, win GLP-1 + peptide
        revenue, and out-execute rivals on reviews, posts, and follow-up.
      </p>
      <div className="mt-6">
        <OswegoNumberOneHub />
      </div>
      <div className="mt-8">
        <CityRankScoreboard />
      </div>
      <div className="mt-6">
        <CompetitorWatch />
      </div>
      <div className="mt-6">
        <LocalDominanceSprintClient />
      </div>
    </main>
  );
}
