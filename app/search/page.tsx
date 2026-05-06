import type { Metadata } from "next";
import { SemanticSearchClient } from "@/components/search/SemanticSearchClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Internal Semantic Search | Hello Gorgeous Med Spa",
  description:
    "Search across services, concerns, videos, comparisons, FAQs, and case-study assets with related content recommendations.",
  path: "/search",
});

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-black text-black">Semantic Internal Search</h1>
      <p className="mt-3 max-w-3xl text-black/75">
        Search treatment, concern, comparison, FAQ, case-study, and video transcript content, then follow related recommendations.
      </p>
      <div className="mt-7">
        <SemanticSearchClient />
      </div>
    </main>
  );
}
