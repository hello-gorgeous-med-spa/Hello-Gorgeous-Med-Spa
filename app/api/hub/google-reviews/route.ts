import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import {
  getGoogleBusinessAccessToken,
  loadGoogleBusinessTokenRow,
  resolveAccountAndLocationIds,
} from "@/lib/hub/google-business-access";

const GBP_V4 = "https://mybusiness.googleapis.com/v4";

function starRatingToNum(star: string | number | undefined): number {
  if (typeof star === "number" && star >= 1 && star <= 5) return star;
  if (!star || typeof star !== "string") return 0;
  const m: Record<string, number> = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  };
  return m[star] ?? 0;
}

export type HubGoogleReview = {
  reviewId: string;
  reviewer: string;
  rating: number;
  comment: string;
  reply: string | null;
  createTime: string;
};

/** PUT reply to a review (Google Business Profile v4). */
export async function POST(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  let body: { reviewId?: string; comment?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reviewId = body.reviewId?.trim();
  const comment = body.comment?.trim();
  if (!reviewId || !comment) {
    return NextResponse.json({ error: "reviewId and comment required" }, { status: 400 });
  }

  const row = await loadGoogleBusinessTokenRow();
  if (!row) {
    return NextResponse.json({ error: "Google Business not connected" }, { status: 400 });
  }

  const accessToken = await getGoogleBusinessAccessToken(row);
  if (!accessToken) {
    return NextResponse.json({ error: "No valid Google access token" }, { status: 400 });
  }

  const resolved = await resolveAccountAndLocationIds(
    accessToken,
    row.account_id,
    row.location_id
  );
  if (!resolved) {
    return NextResponse.json({ error: "Could not resolve account/location" }, { status: 400 });
  }

  const { accountId, locationId } = resolved;
  const name = `accounts/${accountId}/locations/${locationId}/reviews/${reviewId}`;
  const replyUrl = `${GBP_V4}/${name}/reply`;

  const putRes = await fetch(replyUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
  });

  const putJson = (await putRes.json().catch(() => ({}))) as { error?: { message?: string } };

  if (!putRes.ok) {
    const msg = putJson?.error?.message || `Reply failed HTTP ${putRes.status}`;
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

/** Hub: live Google Business Profile reviews + aggregates (OAuth token in hg_oauth_tokens). */
export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const row = await loadGoogleBusinessTokenRow();
  if (!row) {
    return NextResponse.json(
      { error: "Google Business not connected", reviews: [], averageRating: null, totalReviewCount: 0 },
      { status: 200 }
    );
  }

  const accessToken = await getGoogleBusinessAccessToken(row);
  if (!accessToken) {
    return NextResponse.json(
      { error: "No valid Google access token", reviews: [], averageRating: null, totalReviewCount: 0 },
      { status: 200 }
    );
  }

  const resolved = await resolveAccountAndLocationIds(
    accessToken,
    row.account_id,
    row.location_id
  );
  if (!resolved) {
    return NextResponse.json(
      {
        error: "Could not resolve Google Business account or location",
        reviews: [],
        averageRating: null,
        totalReviewCount: 0,
      },
      { status: 200 }
    );
  }

  const { accountId, locationId } = resolved;
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") || 50), 50);
  const url = `${GBP_V4}/accounts/${accountId}/locations/${locationId}/reviews?pageSize=${limit}&orderBy=updateTime desc`;

  const revRes = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const raw = (await revRes.json()) as {
    reviews?: Array<{
      reviewId?: string;
      name?: string;
      starRating?: string | number;
      comment?: string;
      createTime?: string;
      updateTime?: string;
      reviewer?: { displayName?: string; profilePhotoUrl?: string };
      reviewReply?: { comment?: string };
    }>;
    averageRating?: number;
    totalReviewCount?: number;
    error?: { message?: string; status?: string };
  };

  if (!revRes.ok) {
    const msg = raw?.error?.message || `Google reviews API HTTP ${revRes.status}`;
    console.error("[hub/google-reviews]", msg, raw);
    return NextResponse.json(
      {
        error: msg,
        reviews: [] as HubGoogleReview[],
        averageRating: null,
        totalReviewCount: 0,
        accountId,
        locationId,
      },
      { status: 200 }
    );
  }

  const reviews: HubGoogleReview[] = (raw.reviews || []).map((r) => {
    let rid = r.reviewId || "";
    if (!rid && r.name) {
      const m = String(r.name).match(/\/reviews\/([^/]+)$/);
      if (m) rid = m[1];
    }
    return {
    reviewId: rid,
    reviewer: r.reviewer?.displayName || "Anonymous",
    rating: starRatingToNum(r.starRating),
    comment: r.comment || "",
    reply: r.reviewReply?.comment ?? null,
    createTime: r.updateTime || r.createTime || "",
  };
  });

  let averageRating: number | null =
    typeof raw.averageRating === "number" && !Number.isNaN(raw.averageRating) ? raw.averageRating : null;
  let totalReviewCount =
    typeof raw.totalReviewCount === "number" && !Number.isNaN(raw.totalReviewCount)
      ? raw.totalReviewCount
      : reviews.length;

  if (averageRating == null && reviews.length > 0) {
    const sum = reviews.reduce((s, x) => s + x.rating, 0);
    averageRating = Math.round((sum / reviews.length) * 10) / 10;
  }
  if (raw.totalReviewCount == null && reviews.length > 0) {
    totalReviewCount = reviews.length;
  }

  return NextResponse.json({
    reviews,
    averageRating,
    totalReviewCount,
    accountId,
    locationId,
 });
}
