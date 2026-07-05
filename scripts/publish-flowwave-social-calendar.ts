#!/usr/bin/env npx tsx
/**
 * Publish FlowWave social calendar posts (Hello Gorgeous Page — default metaBrand).
 *
 *   npx tsx scripts/publish-flowwave-social-calendar.ts --week=1
 *   npx tsx scripts/publish-flowwave-social-calendar.ts --all --dry-run
 */

import {
  FLOWWAVE_SOCIAL_CALENDAR_JULY_2026,
  getFlowwaveSocialPosts,
  listFlowwaveSocialSlugs,
  type FlowwaveSocialPost,
} from "../lib/marketing/flowwave-social-calendar-july-2026";

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");

async function postViaApi({
  message,
  link,
  imagePath,
  channels,
}: {
  message: string;
  link: string;
  imagePath: string;
  channels: string[];
}) {
  const body: Record<string, unknown> = { message, channels, link };
  if (imagePath) body.imageUrl = `${SITE_URL}${imagePath}`;
  const res = await fetch(`${SITE_URL}/api/social/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function parseArgs() {
  const weekArg = process.argv.find((a) => a.startsWith("--week="));
  const slugArg = process.argv.find((a) => a.startsWith("--slug="));
  const channelsArg = process.argv.find((a) => a.startsWith("--channels="));
  return {
    week: weekArg ? Number(weekArg.split("=")[1]) : undefined,
    slug: slugArg?.split("=")[1],
    channelOverride: channelsArg?.split("=")[1]?.split(",").filter(Boolean),
    dryRun: process.argv.includes("--dry-run"),
    all: process.argv.includes("--all"),
  };
}

async function publishPost(
  post: FlowwaveSocialPost,
  channelOverride: string[] | undefined,
  dryRun: boolean,
) {
  const channels = channelOverride ?? post.channels;
  console.log(`\n── ${post.dayLabel} · ${post.label}`);
  console.log(`   slug: ${post.slug}`);
  console.log(`   channels: ${channels.join(", ")}`);
  console.log(`   link: ${post.link}`);

  if (dryRun) {
    console.log("   [dry-run] skipped");
    return { ok: true };
  }

  const { ok, status, data } = await postViaApi({
    message: post.message,
    link: post.link,
    imagePath: post.imagePath,
    channels,
  });

  if (!ok) {
    console.error(`   ✗ HTTP ${status}`, JSON.stringify(data, null, 2));
    return { ok: false };
  }

  const results = (data as { results?: Record<string, { ok?: boolean; id?: string; error?: string }> })
    .results;
  for (const ch of channels) {
    const r = results?.[ch];
    console.log(`   ${ch}:`, r?.ok ? `✓ ${r.id || "posted"}` : `✗ ${r?.error || "skipped"}`);
  }
  return { ok: true };
}

async function main() {
  const { week, slug, channelOverride, dryRun, all } = parseArgs();

  if (!week && !slug && !all) {
    console.error("Usage:");
    console.error("  npx tsx scripts/publish-flowwave-social-calendar.ts --week=1");
    console.error("  npx tsx scripts/publish-flowwave-social-calendar.ts --all [--dry-run]");
    console.error("\nSlugs:", listFlowwaveSocialSlugs().join(", "));
    process.exit(1);
  }

  const posts = getFlowwaveSocialPosts({ week, slug });
  if (!posts.length) {
    console.error("No posts matched.");
    process.exit(1);
  }

  console.log(`Publishing ${posts.length} FlowWave post(s)${dryRun ? " [DRY RUN]" : ""}`);

  let failed = 0;
  for (const post of posts) {
    const result = await publishPost(post, channelOverride, dryRun);
    if (!result.ok) failed++;
  }

  console.log(`\nDone. ${posts.length - failed}/${posts.length} succeeded.`);
  if (failed) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
