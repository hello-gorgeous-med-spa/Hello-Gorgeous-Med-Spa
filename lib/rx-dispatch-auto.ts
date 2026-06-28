/**
 * Auto-provision RX dispatch rows when intakes are submitted or paid.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { defaultDispatchFromIntake, RX_INTAKE_SLUGS } from "@/lib/rx-dispatch";

const RX_SLUG_SET = new Set<string>(RX_INTAKE_SLUGS);

export async function ensureRxDispatchForSubmission(
  admin: SupabaseClient,
  submissionId: string,
): Promise<{ created: boolean; error?: string }> {
  if (!submissionId) return { created: false, error: "missing submission id" };

  const { data: existing } = await admin
    .from("hg_rx_dispatch")
    .select("submission_id")
    .eq("submission_id", submissionId)
    .maybeSingle();

  if (existing?.submission_id) return { created: false };

  const { data: sub, error: subErr } = await admin
    .from("hg_form_submissions")
    .select(
      "id, signer_name, responses_json, template:hg_form_templates(slug)",
    )
    .eq("id", submissionId)
    .maybeSingle();

  if (subErr) return { created: false, error: subErr.message };
  if (!sub) return { created: false, error: "submission not found" };

  const slug = (sub as { template?: { slug?: string } }).template?.slug ?? "";
  if (!RX_SLUG_SET.has(slug)) return { created: false };

  const defaults = defaultDispatchFromIntake({
    slug,
    signerName: sub.signer_name as string | null,
    responses: (sub.responses_json ?? {}) as Record<string, unknown>,
  });

  const { error: insErr } = await admin.from("hg_rx_dispatch").insert({
    submission_id: submissionId,
    ...defaults,
    updated_by: "system:auto",
  });

  if (insErr) {
    if (insErr.code === "23505") return { created: false };
    return { created: false, error: insErr.message };
  }

  return { created: true };
}
