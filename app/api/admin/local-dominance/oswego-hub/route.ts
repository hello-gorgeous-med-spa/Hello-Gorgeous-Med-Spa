/**
 * Oswego #1 hub — HG vs HER, review velocity, warm RX leads, intake counts.
 */

import { NextResponse } from "next/server";

import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import {
  OSWEGO_RX_ESTIMATED_START_USD,
  OSWEGO_RX_GOAL_END,
  OSWEGO_RX_GOAL_START,
  OSWEGO_RX_GOAL_USD,
  OSWEGO_RX_STARTS_TARGET_PER_WEEK,
  HG_GOOGLE_PLACE_ID,
  OSWEGO_RIVAL,
} from "@/lib/oswego-dominance-playbook";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  RX_INTAKE_SLUGS,
  intakeDisplayName,
  intakeTrackFromSlug,
  type RxDispatchStatus,
} from "@/lib/rx-dispatch";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function placeById(id: string, key: string) {
  const r = await fetch(`https://places.googleapis.com/v1/places/${id}`, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "displayName,rating,userRatingCount",
    },
  });
  return r.ok ? r.json() : null;
}

async function placeByText(q: string, key: string) {
  const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount",
    },
    body: JSON.stringify({ textQuery: q, maxResultCount: 1 }),
  });
  if (!r.ok) return null;
  const j = await r.json();
  return (j.places || [])[0] ?? null;
}

type WarmLead = {
  submissionId: string;
  submittedAt: string;
  patientName: string;
  phone: string | null;
  email: string | null;
  track: "peptide" | "glp1" | "unknown";
  status: RxDispatchStatus;
  action: string;
};

export async function GET() {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = process.env.GOOGLE_PLACES_API_KEY;
  let hgRating: number | null = null;
  let hgReviews: number | null = null;
  let herRating: number | null = null;
  let herReviews: number | null = null;
  let placesConnected = false;

  if (key) {
    placesConnected = true;
    const [hg, her] = await Promise.all([
      placeById(HG_GOOGLE_PLACE_ID, key),
      placeByText(OSWEGO_RIVAL.searchQuery, key),
    ]);
    if (hg) {
      hgRating = hg.rating ?? null;
      hgReviews = hg.userRatingCount ?? null;
    }
    if (her) {
      herRating = her.rating ?? null;
      herReviews = her.userRatingCount ?? null;
    }
  }

  const reviewsToPassHer =
    hgReviews != null && herReviews != null && herReviews >= hgReviews
      ? herReviews - hgReviews + 1
      : null;

  const ratingGap =
    hgRating != null && herRating != null ? Math.round((herRating - hgRating) * 10) / 10 : null;

  const admin = getSupabaseAdminClient();
  const since7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let reviewAsksLast7 = 0;
  let reviewAsksLast30 = 0;
  let rxIntakesLast7 = 0;
  let rxIntakesLast30 = 0;
  let warmLeads: WarmLead[] = [];
  let rxStartsSent7 = 0;
  let rxStartsSent30 = 0;
  let rxStartsGoalPeriod = 0;
  let peptideGuideLeads30 = 0;
  let warmNurtureSent7 = 0;

  if (admin) {
    const [asks7, asks30, templates, peptideGuides, nurture7, sent7, sent30, sentGoal] =
      await Promise.all([
      admin
        .from("review_requests_sent")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since7),
      admin
        .from("review_requests_sent")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since30),
      admin.from("hg_form_templates").select("id, slug").in("slug", [...RX_INTAKE_SLUGS]),
      admin
        .from("feature_leads")
        .select("id", { count: "exact", head: true })
        .eq("source", "peptide_guide")
        .gte("created_at", since30),
      admin
        .from("hg_warm_lead_nurture_log")
        .select("id", { count: "exact", head: true })
        .gte("sent_at", since7)
        .eq("sms_success", true),
      admin
        .from("hg_rx_dispatch")
        .select("submission_id", { count: "exact", head: true })
        .eq("status", "sent")
        .gte("updated_at", since7),
      admin
        .from("hg_rx_dispatch")
        .select("submission_id", { count: "exact", head: true })
        .eq("status", "sent")
        .gte("updated_at", since30),
      admin
        .from("hg_rx_dispatch")
        .select("submission_id", { count: "exact", head: true })
        .eq("status", "sent")
        .gte("updated_at", `${OSWEGO_RX_GOAL_START}T00:00:00.000Z`)
        .lte("updated_at", `${OSWEGO_RX_GOAL_END}T23:59:59.999Z`),
    ]);

    reviewAsksLast7 = asks7.count ?? 0;
    reviewAsksLast30 = asks30.count ?? 0;
    peptideGuideLeads30 = peptideGuides.count ?? 0;
    warmNurtureSent7 = nurture7.error ? 0 : (nurture7.count ?? 0);
    rxStartsSent7 = sent7.count ?? 0;
    rxStartsSent30 = sent30.count ?? 0;
    rxStartsGoalPeriod = sentGoal.count ?? 0;

    const templateIds = (templates.data ?? []).map((t: { id: string }) => t.id);
    if (templateIds.length > 0) {
      const { data: submissions } = await admin
        .from("hg_form_submissions")
        .select("id, submitted_at, signer_name, client_phone, responses_json, template_id")
        .in("template_id", templateIds)
        .gte("submitted_at", since30)
        .order("submitted_at", { ascending: false })
        .limit(50);

      const [intakes7Count, intakes30Count] = await Promise.all([
        admin
          .from("hg_form_submissions")
          .select("id", { count: "exact", head: true })
          .in("template_id", templateIds)
          .gte("submitted_at", since7),
        admin
          .from("hg_form_submissions")
          .select("id", { count: "exact", head: true })
          .in("template_id", templateIds)
          .gte("submitted_at", since30),
      ]);
      rxIntakesLast7 = intakes7Count.count ?? 0;
      rxIntakesLast30 = intakes30Count.count ?? 0;

      const rows = submissions ?? [];
      const ids = rows.map((r: { id: string }) => r.id);

      const slugByTemplate = new Map(
        (templates.data ?? []).map((t: { id: string; slug: string }) => [t.id, t.slug]),
      );

      let dispatchMap = new Map<string, { status: RxDispatchStatus }>();
      if (ids.length > 0) {
        const { data: dispatchRows } = await admin
          .from("hg_rx_dispatch")
          .select("submission_id, status")
          .in("submission_id", ids);
        dispatchMap = new Map(
          (dispatchRows ?? []).map((d: { submission_id: string; status: RxDispatchStatus }) => [
            d.submission_id,
            d,
          ]),
        );
      }

      for (const row of rows as Array<{
        id: string;
        submitted_at: string;
        signer_name: string | null;
        client_phone: string | null;
        responses_json: Record<string, unknown> | null;
        template_id: string;
      }>) {
        const slug = slugByTemplate.get(row.template_id) ?? "";
        const status: RxDispatchStatus = dispatchMap.get(row.id)?.status ?? "new";
        if (status === "sent") continue;

        const responses = row.responses_json ?? {};
        let action = "Review intake in RX Dispatch";
        if (status === "new") action = "Ryan review → mark Reviewed / Approved";
        else if (status === "reviewed") action = "Approve in Charm → mark Approved";
        else if (status === "approved") action = "Send RX Invoice payment link → pharmacy";

        warmLeads.push({
          submissionId: row.id,
          submittedAt: row.submitted_at,
          patientName: intakeDisplayName(slug, row.signer_name, responses),
          phone: row.client_phone || String(responses.phone || "") || null,
          email: String(responses.email || "") || null,
          track: intakeTrackFromSlug(slug),
          status,
          action,
        });
      }
      warmLeads = warmLeads.slice(0, 15);
    }
  }

  const goalStartMs = new Date(`${OSWEGO_RX_GOAL_START}T00:00:00.000Z`).getTime();
  const goalEndMs = new Date(`${OSWEGO_RX_GOAL_END}T23:59:59.999Z`).getTime();
  const nowMs = Date.now();
  const goalActive = nowMs >= goalStartMs && nowMs <= goalEndMs;
  const msRemaining = Math.max(0, goalEndMs - nowMs);
  const weeksRemaining = Math.ceil(msRemaining / (7 * 24 * 60 * 60 * 1000));
  const estimatedRevenueUsd = rxStartsGoalPeriod * OSWEGO_RX_ESTIMATED_START_USD;
  const progressPercent = Math.min(100, Math.round((estimatedRevenueUsd / OSWEGO_RX_GOAL_USD) * 100));
  const startsNeededTotal = Math.ceil(OSWEGO_RX_GOAL_USD / OSWEGO_RX_ESTIMATED_START_USD);
  const startsRemaining = Math.max(0, startsNeededTotal - rxStartsGoalPeriod);
  const weeklyStartsNeeded =
    weeksRemaining > 0 ? Math.ceil(startsRemaining / weeksRemaining) : startsRemaining;

  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    placesConnected,
    rival: OSWEGO_RIVAL,
    you: {
      name: "Hello Gorgeous Med Spa",
      rating: hgRating,
      reviews: hgReviews,
    },
    her: {
      name: OSWEGO_RIVAL.name,
      rating: herRating,
      reviews: herReviews,
    },
    gap: {
      reviewsToPassHer,
      ratingGap,
      aheadOnReviews:
        hgReviews != null && herReviews != null ? hgReviews > herReviews : null,
      reviewLead:
        hgReviews != null && herReviews != null ? hgReviews - herReviews : null,
    },
    velocity: {
      reviewAsksLast7,
      reviewAsksLast30,
      reviewTargetPerWeek: 5,
      rxIntakesLast7,
      rxIntakesLast30,
      rxStartsTargetPerWeek: OSWEGO_RX_STARTS_TARGET_PER_WEEK,
      rxStartsSent7,
      rxStartsSent30,
      warmNurtureSent7,
      peptideGuideLeads30,
    },
    rxGoal: {
      goalUsd: OSWEGO_RX_GOAL_USD,
      goalStart: OSWEGO_RX_GOAL_START,
      goalEnd: OSWEGO_RX_GOAL_END,
      goalActive,
      weeksRemaining,
      estimatedRevenueUsd,
      progressPercent,
      rxStartsGoalPeriod,
      startsNeededTotal,
      startsRemaining,
      weeklyStartsNeeded,
      estimatedStartUsd: OSWEGO_RX_ESTIMATED_START_USD,
      onTrackWeeklyStarts: rxStartsSent7 >= OSWEGO_RX_STARTS_TARGET_PER_WEEK,
    },
    warmLeads,
  });
}
