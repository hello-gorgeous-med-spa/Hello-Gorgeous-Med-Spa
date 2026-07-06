#!/usr/bin/env npx tsx
/** npx tsx scripts/publish-inmode-social-calendar.ts --week=1 --product=morpheus8 */

import {
  getInmodeSocialPosts,
  listInmodeSocialSlugs,
  type InmodeSocialPost,
} from "../lib/marketing/inmode-social-calendar-july-2026";

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");

async function postViaApi(args: { message: string; link: string; imagePath: string; channels: string[] }) {
  const body: Record<string, unknown> = { message: args.message, channels: args.channels, link: args.link };
  if (args.imagePath) body.imageUrl = `${SITE_URL}${args.imagePath}`;
  const res = await fetch(`${SITE_URL}/api/social/post`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
}

async function main() {
  const weekArg = process.argv.find((a) => a.startsWith("--week="));
  const slugArg = process.argv.find((a) => a.startsWith("--slug="));
  const productArg = process.argv.find((a) => a.startsWith("--product="));
  const dryRun = process.argv.includes("--dry-run");
  const all = process.argv.includes("--all");

  if (!weekArg && !slugArg && !all) {
    console.error("Usage: npx tsx scripts/publish-inmode-social-calendar.ts --week=1 [--product=morpheus8|solaria]");
    console.error("Slugs:", listInmodeSocialSlugs().join(", "));
    process.exit(1);
  }

  const posts = getInmodeSocialPosts({
    week: weekArg ? Number(weekArg.split("=")[1]) : undefined,
    slug: slugArg?.split("=")[1],
    product: productArg?.split("=")[1] as InmodeSocialPost["product"] | undefined,
  });

  for (const post of posts) {
    console.log(`\n── ${post.dayLabel} · ${post.label}`);
    if (dryRun) continue;
    const { ok, status, data } = await postViaApi({ message: post.message, link: post.link, imagePath: post.imagePath, channels: post.channels });
    console.log(ok ? "✓ posted" : `✗ ${status} ${JSON.stringify(data)}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
