import { NextRequest, NextResponse } from "next/server";
import { getRelatedContent, searchDocs } from "@/lib/search/search-index";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") || "").trim();
  if (!query) return NextResponse.json({ query, results: [], related: [] });

  const results = searchDocs(query, 20);
  const related = getRelatedContent(query.split(/\s+/), 8);

  return NextResponse.json(
    { query, count: results.length, results, related },
    { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400" } },
  );
}
