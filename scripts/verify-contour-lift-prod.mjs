/**
 * One-off: verify live Supabase (env) accepts contour_lift leads; optional API smoke test.
 * Run: node --env-file=.env.local scripts/verify-contour-lift-prod.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const liveApi = process.env.VERIFY_LIVE_API_URL || "https://www.hellogorgeousmedspa.com";

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const testEmail = `contour-lift-e2e-${Date.now()}@verify.hellogorgeous.local`;
const testPhone = "5555550199";

async function main() {
  const ref = (() => {
    try {
      return new URL(url).hostname.split(".")[0];
    } catch {
      return "(unknown ref)";
    }
  })();
  console.log("Supabase host:", new URL(url).hostname, "| project ref (from URL):", ref);
  console.log("---");

  // 1) Optional: list constraint via query — only works if a DB function exists; skip and rely on insert
  // 2) Safe insert
  // Match minimal columns the API uses; omit full_name if remote schema omits it (PostgREST will error).
  const baseRow = {
    email: testEmail,
    source: "website",
    lead_type: "contour_lift",
    metadata: { e2e: true, at: new Date().toISOString() },
  };
  let ins = await supabase.from("leads").insert({ ...baseRow, phone: testPhone, full_name: "E2E Contour Verify" }).select("id, lead_type, email, created_at").single();
  if (ins.error && (ins.error.message || "").includes("full_name")) {
    ins = await supabase.from("leads").insert(baseRow).select("id, lead_type, email, created_at").single();
  }
  if (ins.error && (ins.error.message || "").includes("phone")) {
    ins = await supabase.from("leads").insert(baseRow).select("id, lead_type, email, created_at").single();
  }
  if (ins.error) {
    console.log("INSERT test: FAILED");
    console.log("Error code:", ins.error.code);
    console.log("Error message:", ins.error.message);
    console.log("Details:", ins.error.details);
    process.exit(2);
  }
  console.log("INSERT test: SUCCESS (lead_type=contour_lift allowed)");
  console.log("Row id:", ins.data.id);

  const id = ins.data.id;

  // 3) Read back
  const q = await supabase.from("leads").select("id, lead_type, email").eq("id", id).single();
  if (q.error) {
    console.log("Read-back: FAILED", q.error.message);
  } else {
    console.log("Read-back: OK", { lead_type: q.data.lead_type, email: q.data.email });
  }

  // 4) Delete test row
  const del = await supabase.from("leads").delete().eq("id", id);
  if (del.error) {
    console.log("Cleanup delete: FAILED (please remove test row)", del.error.message);
  } else {
    console.log("Cleanup: deleted e2e row", id);
  }

  // 5) Live API POST
  if (process.argv.includes("--api")) {
    const body = {
      name: "Live API Verify",
      email: `contour-api-${Date.now()}@verify.hellogorgeous.local`,
      phone: "5555550188",
      area_of_concern: "e2e api verify — safe to delete",
      contact_method: "email",
    };
    const r = await fetch(`${liveApi}/api/public/contour-lift-inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await r.text();
    console.log("---");
    console.log("Live API:", liveApi, "status", r.status);
    console.log("Response (truncated):", text.slice(0, 500));
    if (!r.ok) {
      process.exit(3);
    }
    // Find lead by email
    const e = body.email;
    const l = await supabase.from("leads").select("id, lead_type, full_name").ilike("email", e).maybeSingle();
    if (l.error) {
      console.log("DB lookup after API: error", l.error.message);
    } else if (l.data) {
      console.log("DB lookup after API: FOUND", { id: l.data.id, lead_type: l.data.lead_type });
    } else {
      console.log("DB lookup after API: NO ROW (Resend may still have run; check constraint / API logs)");
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(99);
});
