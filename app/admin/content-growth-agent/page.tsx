import { ContentGrowthAgentClient } from "@/components/admin/ContentGrowthAgentClient";

export default function ContentGrowthAgentPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-black text-black">Content Growth Agent</h1>
      <p className="mt-2 max-w-3xl text-black/70">
        Autonomous weekly operating queue for content publishing, SEO authority expansion, distribution repurposing,
        and conversion optimization.
      </p>
      <div className="mt-6">
        <ContentGrowthAgentClient />
      </div>
    </main>
  );
}
