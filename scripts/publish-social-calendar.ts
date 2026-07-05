#!/usr/bin/env npx tsx
/**
 * Publish FlowWave + RE GEN social calendar posts to Google, Facebook, Instagram.
 *
 *   npx tsx scripts/publish-social-calendar.ts --week=1
 *   npx tsx scripts/publish-social-calendar.ts --slug=fw-intro-launch
 *   npx tsx scripts/publish-social-calendar.ts --week=2 --dry-run
 *   npx tsx scripts/publish-social-calendar.ts --all --dry-run
 */

import {
  SOCIAL_CALENDAR_JULY_2026,
  getSocialCalendarPosts,
  listSocialCalendarSlugs,
  type SocialCalendarPost,
} from "../lib/marketing/social-calendar-july-2026";

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
  const brandArg = process.argv.find((a) => a.startsWith("--brand="));
  const channelsArg = process.argv.find((a) => a.startsWith("--channels="));
  const dryRun = process.argv.includes("--dry-run");
  const all = process.argv.includes("--all");

  return {
    week: weekArg ? Number(weekArg.split("=")[1]) : undefined,
    slug: slugArg?.split("=")[1],
    brand: brandArg?.split("=")[1] as "flowwave" | "regen" | undefined,
    channelOverride: channelsArg?.split("=")[1]?.split(",").filter(Boolean),
    dryRun,
    all,
  };
}

async function publishPost(
  post: SocialCalendarPost,
  channelOverride: string[] | undefined,
  dryRun: boolean,
) {
  const channels = channelOverride ?? post.channels;
  console.log(`\n── ${post.dayLabel} · ${post.label}`);
  console.log(`   slug: ${post.slug} · brand: ${post.brand}`);
  console.log(`   channels: ${channels.join(", ")}`);
  console.log(`   link: ${post.link}`);

  if (dryRun) {
    console.log("   [dry-run] skipped API call");
    console.log(`   preview: ${post.message.slice(0, 120).replace(/\n/g, " ")}…`);
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

  const results = (data as { results?: Record<string, { ok?: boolean; id?: string; url?: string; error?: string }> })
    .results;
  for (const ch of channels) {
    const r = results?.[ch];
    console.log(`   ${ch}:`, r?.ok ? `✓ ${r.id || r.url || "posted"}` : `✗ ${r?.error || "skipped"}`);
  }
  return { ok: true };
}

async function main() {
  const { week, slug, brand, channelOverride, dryRun, all } = parseArgs();

  if (!week && !slug && !all) {
    console.error("Usage:");
    console.error("  npx tsx scripts/publish-social-calendar.ts --week=1");
    console.error("  npx tsx scripts/publish-social-calendar.ts --slug=fw-intro-launch");
    console.error("  npx tsx scripts/publish-social-calendar.ts --all [--dry-run]");
    console.error("\nKnown slugs:", listSocialCalendarSlugs().join(", "));
    console.error("\nCalendar overview:");
    for (const p of SOCIAL_CALENDAR_JULY_2026) {
      console.log(`  W${p.week} ${p.dayLabel.padEnd(8)} ${p.slug}`);
    }
    process.exit(1);
  }

  const posts = getSocialCalendarPosts({ week, slug, brand });
  if (!posts.length) {
    console.error("No posts matched filter.");
    process.exit(1);
  }

  console.log(`Publishing ${posts.length} post(s) to ${SITE_URL}${dryRun ? " [DRY RUN]" : ""}`);

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
