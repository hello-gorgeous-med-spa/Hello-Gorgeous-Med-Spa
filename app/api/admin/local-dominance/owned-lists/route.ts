/**
 * GET — owned marketing audience counts for Oswego command center.
 */

import { NextResponse } from "next/server";

import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { previewSquareAudienceCounts } from "@/lib/marketing/square-segments";
import {
  RX_INTAKE_SLUGS,
  type RxDispatchStatus,
} from "@/lib/rx-dispatch";

export const dynamic = "force-dynamic";
export const maxDuration = 90;

export type OwnedListRow = {
  id: string;
  label: string;
  count: number | null;
  hint: string;
  href: string;
  external?: boolean;
  highlight?: boolean;
};

export async function GET() {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = getSupabaseAdminClient();
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let emailOptIn = 0;
  let smsOptIn = 0;
  let featureLeadsTotal = 0;
  let featureLeadsOptIn = 0;
  let warmRxLeads = 0;
  let vipWaitlistPending = 0;
  let squareLinkedClients = 0;

  if (admin) {
    const [
      emailOpt,
      smsOpt,
      featureTotal,
      featureOpt,
      squareClients,
      vipPending,
      templates,
    ] = await Promise.all([
      admin
        .from("marketing_preferences")
        .select("id", { count: "exact", head: true })
        .eq("email_opt_in", true),
      admin
        .from("marketing_preferences")
        .select("id", { count: "exact", head: true })
        .eq("sms_opt_in", true),
      admin.from("feature_leads").select("id", { count: "exact", head: true }),
      admin
        .from("feature_leads")
        .select("id", { count: "exact", head: true })
        .eq("marketing_opt_in", true),
      admin
        .from("clients")
        .select("id", { count: "exact", head: true })
        .not("square_customer_id", "is", null),
      admin
        .from("vip_waitlist")
        .select("id", { count: "exact", head: true })
        .in("status", ["pending", "contacted"]),
      admin.from("hg_form_templates").select("id, slug").in("slug", [...RX_INTAKE_SLUGS]),
    ]);

    emailOptIn = emailOpt.count ?? 0;
    smsOptIn = smsOpt.count ?? 0;
    featureLeadsTotal = featureTotal.count ?? 0;
    featureLeadsOptIn = featureOpt.count ?? 0;
    squareLinkedClients = squareClients.count ?? 0;
    vipWaitlistPending = vipPending.count ?? 0;

    const templateIds = (templates.data ?? []).map((t: { id: string }) => t.id);
    if (templateIds.length > 0) {
      const { data: submissions } = await admin
        .from("hg_form_submissions")
        .select("id")
        .in("template_id", templateIds)
        .gte("submitted_at", since30);

      const ids = (submissions ?? []).map((r: { id: string }) => r.id);
      if (ids.length > 0) {
        const { data: dispatchRows } = await admin
          .from("hg_rx_dispatch")
          .select("submission_id, status")
          .in("submission_id", ids);
        const sent = new Set(
          (dispatchRows ?? [])
            .filter((d: { status: RxDispatchStatus }) => d.status === "sent")
            .map((d: { submission_id: string }) => d.submission_id),
        );
        warmRxLeads = ids.filter((id) => !sent.has(id)).length;
      }
    }
  }

  const square = await previewSquareAudienceCounts();
  const lapsed =
    square.segments.find((s) => s.segment === "HG Lapsed (90+ Days)")?.count ?? null;
  const allOptIn =
    square.segments.find((s) => s.segment === "HG All Opt-In")?.count ?? null;
  const firstTime =
    square.segments.find((s) => s.segment === "HG First-Time Clients")?.count ?? null;
  const birthday =
    square.segments.find((s) => s.segment === "HG Birthday Month")?.count ?? null;

  const lists: OwnedListRow[] = [
    {
      id: "square-all",
      label: "Square customers (email or phone)",
      count: square.connected ? allOptIn : null,
      hint: "Your biggest free audience — blast in Square Marketing",
      href: "https://squareup.com/dashboard/customers",
      external: true,
      highlight: true,
    },
    {
      id: "square-lapsed",
      label: "Square · Lapsed 90+ days",
      count: square.connected ? lapsed : null,
      hint: "Win-back email/SMS — no ad spend",
      href: "/admin/marketing/square-segments",
      highlight: true,
    },
    {
      id: "square-first-time",
      label: "Square · First-time (30 days)",
      count: square.connected ? firstTime : null,
      hint: "Welcome flow + review ask",
      href: "/admin/marketing/square-segments",
    },
    {
      id: "square-birthday",
      label: "Square · Birthday this month",
      count: square.connected ? birthday : null,
      hint: "Birthday offer in Square",
      href: "/admin/marketing/square-segments",
    },
    {
      id: "contact-email",
      label: "Contact Collection · email opt-in",
      count: emailOptIn,
      hint: "/join signups + CSV imports",
      href: "/admin/marketing/contacts",
    },
    {
      id: "contact-sms",
      label: "Contact Collection · SMS opt-in",
      count: smsOptIn,
      hint: "Twilio campaigns + opt-in only",
      href: "/admin/marketing/contacts",
    },
    {
      id: "feature-leads",
      label: "Feature leads (opted in)",
      count: featureLeadsOptIn,
      hint: `${featureLeadsTotal} total · Face Blueprint, Journey, etc.`,
      href: "/admin/marketing/feature-leads",
    },
    {
      id: "warm-rx",
      label: "Warm RX leads (30 days)",
      count: warmRxLeads,
      hint: "GLP-1 + peptide intakes not sent to pharmacy",
      href: "/admin/rx-dispatch",
      highlight: warmRxLeads > 0,
    },
    {
      id: "vip-waitlist",
      label: "VIP waitlist (active)",
      count: vipWaitlistPending,
      hint: "CO2 / launch campaigns",
      href: "/admin/marketing",
    },
    {
      id: "square-linked-db",
      label: "Clients linked to Square in HG",
      count: squareLinkedClients,
      hint: "HG OS clients matched to Square ID",
      href: "/admin/clients",
    },
  ];

  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    square: {
      connected: square.connected,
      customersScanned: square.customersScanned,
      segments: square.segments,
      error: square.error,
    },
    lists,
    totals: {
      emailOptIn,
      smsOptIn,
      featureLeadsTotal,
      featureLeadsOptIn,
      warmRxLeads,
      vipWaitlistPending,
      squareLinkedClients,
    },
  });
}
