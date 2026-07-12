#!/usr/bin/env node
/**
 * Align Ryan Kent's Square Team wage with his 1099 Compensation Agreement (July 2026).
 *
 * Ryan is NOT paid $100/hr clinical — pay is oversight (flat monthly by clocked hrs/wk)
 * plus commission buckets. Square Payroll should import timecards for hours only and use
 * the Amount column (or /admin/payroll preview) for actual 1099 pay.
 *
 * This script sets:
 *   Job:  NP Service Provider (1099)
 *   Rate: $0.00/hr (prevents hours × wrong rate on payroll import)
 *   OT:   exempt (contractor)
 *
 * USAGE:
 *   node --env-file=.env.local scripts/sync-ryan-square-pay.mjs --dry-run
 *   node --env-file=.env.local scripts/sync-ryan-square-pay.mjs --apply
 */

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run") || !args.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST =
  envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

/** Production Square Team member ID — lib/payroll/compensation-plans.ts SQUARE_TEAM.ryan */
const RYAN_TEAM_MEMBER_ID = process.env.SQUARE_RYAN_TEAM_MEMBER_ID || "TM1IptWCrgxkY4p7";
const JOB_TITLE = "NP Service Provider (1099)";

if (!TOKEN || TOKEN.length < 10) {
  console.error("❌ Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

async function squareFetch(method, path, body) {
  const res = await fetch(`${HOST}/v2${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.errors?.map((e) => e.detail || e.code).join("; ") || res.statusText;
    throw new Error(msg);
  }
  return data;
}

async function resolveJobId() {
  const data = await squareFetch("GET", "/team-members/jobs");
  const hit = (data.jobs || []).find((j) => j.title === JOB_TITLE);
  if (hit) return hit.id;

  if (DRY_RUN) {
    console.log(`   Would create job: "${JOB_TITLE}"`);
    return "#new-np-1099-job";
  }

  const created = await squareFetch("POST", "/team-members/jobs", {
    idempotency_key: `hg-ryan-np-1099-job-${Date.now()}`,
    job: { title: JOB_TITLE, is_tip_eligible: false },
  });
  return created.job.id;
}

function formatHourly(jobAssignments) {
  const ja = jobAssignments?.[0];
  if (!ja?.hourly_rate?.amount) return "$0.00";
  return `$${(ja.hourly_rate.amount / 100).toFixed(2)}/hr`;
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log(" Sync Ryan Kent Square pay → 1099 compensation agreement");
  console.log("═══════════════════════════════════════════════════");
  console.log(` Env:    ${envName}`);
  console.log(` Mode:   ${DRY_RUN ? "DRY-RUN" : "APPLY"}`);
  console.log(` Ryan:   ${RYAN_TEAM_MEMBER_ID}`);
  console.log("");

  const { team_member: tm } = await squareFetch("GET", `/team-members/${RYAN_TEAM_MEMBER_ID}`);
  const before = tm.wage_setting;
  console.log("Current:");
  console.log(`   Job:  ${before?.job_assignments?.[0]?.job_title ?? "(none)"}`);
  console.log(`   Rate: ${formatHourly(before?.job_assignments)}`);
  console.log(`   OT exempt: ${before?.is_overtime_exempt ?? false}`);
  console.log("");

  const jobId = await resolveJobId();
  const target = {
    team_member_id: RYAN_TEAM_MEMBER_ID,
    version: before?.version,
    job_assignments: [
      {
        job_id: jobId,
        pay_type: "HOURLY",
        hourly_rate: { amount: 0, currency: "USD" },
      },
    ],
    is_overtime_exempt: true,
  };

  const already =
    before?.job_assignments?.[0]?.job_title === JOB_TITLE &&
    before?.job_assignments?.[0]?.hourly_rate?.amount === 0 &&
    before?.is_overtime_exempt === true;

  if (already) {
    console.log("✅ Already aligned — no update needed.");
    return;
  }

  console.log("Target:");
  console.log(`   Job:  ${JOB_TITLE}`);
  console.log(`   Rate: $0.00/hr (use Square Payroll Amount + /admin/payroll for 1099 pay)`);
  console.log(`   OT exempt: true`);
  console.log("");

  if (DRY_RUN) {
    console.log("Re-run with --apply to update Square.");
    return;
  }

  const { team_member: updated } = await squareFetch("PUT", `/team-members/${RYAN_TEAM_MEMBER_ID}`, {
    team_member: { wage_setting: target },
  });

  console.log("✅ Updated Ryan Kent wage_setting:");
  console.log(`   Job:  ${updated.wage_setting?.job_assignments?.[0]?.job_title}`);
  console.log(`   Rate: ${formatHourly(updated.wage_setting?.job_assignments)}`);
  console.log(`   OT exempt: ${updated.wage_setting?.is_overtime_exempt}`);
  console.log("\nRun weekly pay from /admin/payroll → Square Payroll → contractor Amount column.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
