#!/usr/bin/env node
/**
 * Queue 7-day Hello Gorgeous app launch to scheduled_social_posts (FB + Google).
 * Run: node --env-file=.env.local scripts/queue-app-launch-now.mjs
 * Optional: FORCE=1 node --env-file=.env.local scripts/queue-app-launch-now.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.hellogorgeousmedspa.com").replace(
  /\/$/,
  ""
);
const CAMPAIGN = "hg_app_june2026";
const FORCE = process.env.FORCE === "1";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function appLaunchLink(path) {
  const url = new URL(path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);
  url.searchParams.set("utm_source", "facebook");
  url.searchParams.set("utm_medium", "page_post");
  url.searchParams.set("utm_campaign", CAMPAIGN);
  return url.toString();
}

const GET_APP = appLaunchLink("/get-app");
const IV = appLaunchLink("/app?iv=build");
const DEALS = appLaunchLink("/app?tab=deals");
const VITAMIN = appLaunchLink("/app?tab=vitamin");
const MEMBERSHIP = appLaunchLink("/app?tab=membership");
const FOR_HIM = appLaunchLink("/app?tab=forhim");

const posts = [
  {
    label: "App launch — full feature reveal",
    message: `📱 YOUR med spa. In YOUR pocket. The Hello Gorgeous app is LIVE!

No App Store download — scan our QR or open the link, then Add to Home Screen.

✨ Book · Build Your IV Bag · Vitamin Bar · Deals · Memberships · HG Rewards · GLP-1 screening · portal & more

Ryan Kent, FNP-BC on site 7 days a week · Oswego, IL

👉 ${GET_APP}
👉 Build your IV bag: ${IV}`,
    link: GET_APP,
    imagePath: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
    channels: ["facebook", "instagram", "google"],
  },
  {
    label: "Build Your IV Bag — 60 seconds",
    message: `Build YOUR IV bag in 60 seconds 💧✨

Pick size → tap boosters → see your price → book.

${IV}

Get the full app: ${GET_APP}
Hello Gorgeous Med Spa · Oswego, IL`,
    link: IV,
    imagePath: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
    channels: ["facebook", "instagram", "google"],
  },
  {
    label: "App exclusive — Botox $11/unit",
    message: `💉 APP EXCLUSIVE — Botox $11/unit through the Hello Gorgeous app.

Show your Deals tab at checkout. Ryan Kent, FNP-BC · Oswego, IL.

👉 ${DEALS}`,
    link: DEALS,
    imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
    channels: ["facebook", "instagram", "google"],
  },
  {
    label: "Vitamin Bar — drive-thru & pre-pay",
    message: `💉 Vitamin Bar in the app — pre-pay shots & drive-thru wellness.

👉 ${VITAMIN}`,
    link: VITAMIN,
    imagePath: "/images/homepage-services/peptide-therapy-active-lifestyle.png",
    channels: ["facebook", "google"],
  },
  {
    label: "Monthly memberships in-app",
    message: `⭐ Memberships from $49/mo — join in the Hello Gorgeous app with Square checkout.

👉 ${MEMBERSHIP}`,
    link: MEMBERSHIP,
    imagePath: "/images/gentlemens-club/gentlemens-club-hero.png",
    channels: ["facebook", "instagram", "google"],
  },
  {
    label: "For Him — Brotox, hormones, peptides",
    message: `👑 FOR HIM tab in the Hello Gorgeous app — Brotox, hormones, peptides & recovery.

👉 ${FOR_HIM}`,
    link: FOR_HIM,
    imagePath: "/images/gentlemens-club/gentlemens-club-hero.png",
    channels: ["facebook", "google"],
  },
  {
    label: "Scan QR — add to home screen",
    message: `📱 Get the app in 10 seconds — scan QR, Add to Home Screen, no App Store.

👉 ${GET_APP}`,
    link: GET_APP,
    imagePath: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
    channels: ["facebook", "instagram", "google"],
  },
];

function businessDateTimeToUTC(ymd, hours24, minutes) {
  const [y, m, d] = ymd.split("-").map(Number);
  const monthIndex = m - 1;
  const noonUTC = new Date(Date.UTC(y, monthIndex, d, 12, 0, 0));
  const chicagoNoonStr = noonUTC.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const match = chicagoNoonStr.match(/(\d+)\/(\d+)\/(\d+),\s*(\d+):(\d+)/);
  const chicagoHour = match ? parseInt(match[4], 10) : 6;
  const offsetHours = 12 - chicagoHour;
  const totalMinutes = hours24 * 60 + minutes + offsetHours * 60;
  const base = new Date(Date.UTC(y, monthIndex, d, 0, 0, 0, 0));
  return new Date(base.getTime() + totalMinutes * 60 * 1000);
}

function addDays(ymd, n) {
  const base = businessDateTimeToUTC(ymd, 12, 0);
  return new Date(base.getTime() + n * 86400000).toLocaleDateString("en-CA", {
    timeZone: "America/Chicago",
  });
}

function findNextStart() {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  for (let i = 0; i < 14; i++) {
    const ymd = addDays(today, i);
    const at = businessDateTimeToUTC(ymd, 10, 0);
    if (at.getTime() > Date.now() + 60_000) return { ymd, at };
  }
  throw new Error("No valid start slot");
}

async function main() {
  const { ymd, at } = findNextStart();
  const rangeEnd = businessDateTimeToUTC(addDays(ymd, 7), 10, 0);

  if (!FORCE) {
    const { count } = await supabase
      .from("scheduled_social_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .ilike("link", `%utm_campaign=${CAMPAIGN}%`)
      .gte("scheduled_at", at.toISOString())
      .lt("scheduled_at", rangeEnd.toISOString());
    if ((count ?? 0) >= 7) {
      console.log(`Skipped — ${count} app launch posts already pending. Set FORCE=1 to queue again.`);
      return;
    }
  }

  console.log(`Queuing app launch week (${CAMPAIGN})…`);
  console.log("First post:", ymd, "10:00 America/Chicago →", at.toISOString());
  console.log("");

  let n = 0;
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const day = addDays(ymd, i);
    const when = businessDateTimeToUTC(day, 10, 0);
    const { data, error } = await supabase
      .from("scheduled_social_posts")
      .insert({
        message: p.message,
        link: p.link,
        image_url: p.imagePath ? SITE_URL + p.imagePath : null,
        channels: p.channels,
        scheduled_at: when.toISOString(),
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.log("✗", p.label, "—", error.message);
    } else {
      n++;
      console.log("✓", p.label, "→", when.toLocaleString("en-US", { timeZone: "America/Chicago" }), `(${data.id})`);
    }
  }

  console.log("");
  console.log(`Done — ${n}/${posts.length} queued. Cron publishes when due.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
