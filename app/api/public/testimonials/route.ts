import { NextRequest, NextResponse } from "next/server";
import { filterTestimonials } from "@/lib/testimonial-system";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const treatment = url.searchParams.get("treatment") || undefined;
  const concern = url.searchParams.get("concern") || undefined;
  const provider = url.searchParams.get("provider") || undefined;
  const device = url.searchParams.get("device") || undefined;
  const includeUnapproved = url.searchParams.get("includeUnapproved") === "true";

  const data = filterTestimonials({ treatment, concern, provider, device, includeUnapproved });
  return NextResponse.json(
    {
      filters: { treatment, concern, provider, device, includeUnapproved },
      count: data.length,
      data,
    },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
