// ============================================================
// Hello Gorgeous client app launch — 7-day FB + Google queue
// Uses existing organic APIs (scheduled_social_posts + cron).
// Paid Meta/Google Ads require separate credentials — not here.
// ============================================================

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { SITE } from "@/lib/seo";
import { getAppInstallUrl } from "@/lib/app-install-url";
import { businessDateTimeToUTC, BUSINESS_TIMEZONE } from "@/lib/business-timezone";
import {
  FACEBOOK_APP_LAUNCH_POST,
  FACEBOOK_IV_BUILDER_SHORT,
} from "@/data/marketing-posts-app-iv-launch";

export const APP_LAUNCH_CAMPAIGN = "hg_app_june2026";
export const APP_LAUNCH_POST_COUNT = 7;

export type AppLaunchChannel = "facebook" | "instagram" | "google";

export type AppLaunchPostDef = {
  id: string;
  label: string;
  message: string;
  /** Site path (with optional query) or absolute URL */
  linkPath: string;
  imagePath?: `/${string}`;
  channels: AppLaunchChannel[];
};

function addCalendarDays(ymd: string, n: number): string {
  const noon = businessDateTimeToUTC(ymd, 12, 0);
  const next = new Date(noon.getTime() + n * 24 * 60 * 60 * 1000);
  return next.toLocaleDateString("en-CA", { timeZone: BUSINESS_TIMEZONE });
}

/** Append launch UTMs (facebook page_post / google gbp_post). */
export function appLaunchLink(
  pathOrUrl: string,
  medium: "page_post" | "gbp_post" = "page_post"
): string {
  const base = pathOrUrl.startsWith("http")
    ? pathOrUrl
    : new URL(pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`, SITE.url).toString();
  const url = new URL(base);
  url.searchParams.set("utm_source", medium === "gbp_post" ? "google" : "facebook");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", APP_LAUNCH_CAMPAIGN);
  return url.toString();
}

const APP_URL = getAppInstallUrl({
  utmSource: "facebook",
  utmMedium: "page_post",
  utmCampaign: APP_LAUNCH_CAMPAIGN,
});
const GET_APP_URL = appLaunchLink("/get-app");
const IV_BUILDER_URL = appLaunchLink("/app?iv=build");
const DEALS_URL = appLaunchLink("/app?tab=deals");
const VITAMIN_URL = appLaunchLink("/app?tab=vitamin");
const MEMBERSHIP_URL = appLaunchLink("/app?tab=membership");
const FOR_HIM_URL = appLaunchLink("/app?tab=forhim");
const BLOG_URL = appLaunchLink(
  "/blog/build-your-iv-bag-hello-gorgeous-app-oswego-il",
  "page_post"
);

/** Seven-day app launch sequence (FB + Google; IG when image present). */
export const APP_LAUNCH_SOCIAL_POSTS: AppLaunchPostDef[] = [
  {
    id: "app-launch-hero",
    label: "App launch — full feature reveal",
    message: FACEBOOK_APP_LAUNCH_POST.replace(
      "https://www.hellogorgeousmedspa.com/get-app",
      GET_APP_URL
    )
      .replace("https://www.hellogorgeousmedspa.com/app?iv=build", IV_BUILDER_URL)
      .replace(
        "https://www.hellogorgeousmedspa.com/blog/build-your-iv-bag-hello-gorgeous-app-oswego-il",
        BLOG_URL
      ),
    linkPath: "/get-app",
    imagePath: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
    channels: ["facebook", "instagram", "google"],
  },
  {
    id: "app-iv-builder",
    label: "Build Your IV Bag — 60 seconds",
    message: FACEBOOK_IV_BUILDER_SHORT.replace(
      "https://www.hellogorgeousmedspa.com/app?iv=build",
      IV_BUILDER_URL
    ).replace("https://www.hellogorgeousmedspa.com/get-app", GET_APP_URL),
    linkPath: "/app?iv=build",
    imagePath: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
    channels: ["facebook", "instagram", "google"],
  },
  {
    id: "app-botox-deal",
    label: "App exclusive — Botox $11/unit",
    message: `💉 APP EXCLUSIVE at Hello Gorgeous Med Spa — Oswego, IL

Botox $11/unit when you book through the Hello Gorgeous app. Show your Deals tab at checkout — new & existing clients.

No App Store — scan our QR or open the link · Add to Home Screen.

Ryan Kent, FNP-BC on site 7 days a week · authentic Allergan & Galderma only.

👉 Get the app: ${APP_URL}`,
    linkPath: "/app?tab=deals",
    imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
    channels: ["facebook", "instagram", "google"],
  },
  {
    id: "app-vitamin-bar",
    label: "Vitamin Bar — drive-thru & pre-pay",
    message: `💉 Vitamin Bar in the Hello Gorgeous app — Oswego, IL

Pre-pay B12, glutathione, Tri-Immune & more in the app. Pull up drive-thru Mon–Sat — no appointment needed for shots.

Build a custom IV bag from $89 · most bags $150–$199 · live pricing before you book.

👉 Open Vitamin Bar tab: ${VITAMIN_URL}
Scan QR: ${GET_APP_URL}`,
    linkPath: "/app?tab=vitamin",
    imagePath: "/images/homepage-services/peptide-therapy-active-lifestyle.png",
    channels: ["facebook", "google"],
  },
  {
    id: "app-memberships",
    label: "Monthly memberships in-app",
    message: `⭐ Monthly memberships — now in the Hello Gorgeous app

The Glow Pass $49/mo · Energy Unlimited $89/mo · VIP Wellness $149/mo · Glow Facial $99/mo · Lash Fill $150/mo · Gentlemen's Club from $99/mo

Join in-app with Square checkout — one simple monthly price for your routine.

Ryan Kent, FNP-BC · Oswego · Naperville · Aurora · Plainfield

👉 Membership tab: ${MEMBERSHIP_URL}`,
    linkPath: "/app?tab=membership",
    imagePath: "/images/gentlemens-club/gentlemens-club-hero.png",
    channels: ["facebook", "instagram", "google"],
  },
  {
    id: "app-for-him",
    label: "For Him — Brotox, hormones, peptides",
    message: `👑 FOR HIM — inside the Hello Gorgeous app

Brotox · hormone optimization · peptides · recovery — curated for men who want results without the fluff.

Book consults, browse the For Him tab, and stack with Vitamin Bar drive-thru shots.

Ryan Kent, FNP-BC on site 7 days · downtown Oswego, IL

👉 ${FOR_HIM_URL}`,
    linkPath: "/app?tab=forhim",
    imagePath: "/images/gentlemens-club/gentlemens-club-hero.png",
    channels: ["facebook", "google"],
  },
  {
    id: "app-get-qr",
    label: "Scan QR — add to home screen",
    message: `📱 Get the Hello Gorgeous app in 10 seconds

1️⃣ Open hellogorgeousmedspa.com/get-app (or scan our in-spa QR)
2️⃣ Tap Share → Add to Home Screen
3️⃣ Book, build your IV bag, pre-pay shots & unlock app-only deals

No App Store download. Your med spa in your pocket — Oswego, IL.

👉 ${GET_APP_URL}`,
    linkPath: "/get-app",
    imagePath: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
    channels: ["facebook", "instagram", "google"],
  },
];

/** First 10:00 America/Chicago at least ~1 minute after `ref`. */
export function findNextAppLaunchStart(ref: Date = new Date()): { startYmd: string; firstPostAt: Date } {
  const startYmd = ref.toLocaleDateString("en-CA", { timeZone: BUSINESS_TIMEZONE });
  for (let i = 0; i < 14; i++) {
    const ymd = addCalendarDays(startYmd, i);
    const instant = businessDateTimeToUTC(ymd, 10, 0);
    if (instant.getTime() > ref.getTime() + 60_000) {
      return { startYmd: ymd, firstPostAt: instant };
    }
  }
  throw new Error("Could not find a valid 10:00 America/Chicago slot in the next 2 weeks.");
}

export type QueueAppLaunchResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  campaign?: string;
  startYmd?: string;
  firstPostAt?: string;
  inserted?: { id: string; label: string; scheduledAt: string }[];
  errors?: string[];
};

export async function queueAppLaunchSocial(options: {
  origin?: string;
  force?: boolean;
  /** YYYY-MM-DD (Chicago) for day 1 at 10:00. */
  startYmdOverride?: string;
}): Promise<QueueAppLaunchResult> {
  const origin = (options.origin ?? SITE.url).replace(/\/$/, "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return { ok: false, reason: "Database not configured (SUPABASE_SERVICE_ROLE_KEY)" };
  }

  let startYmd: string;
  let firstPostAt: Date;

  if (options.startYmdOverride) {
    startYmd = options.startYmdOverride;
    firstPostAt = businessDateTimeToUTC(startYmd, 10, 0);
    if (firstPostAt.getTime() < Date.now() + 60_000) {
      return { ok: false, reason: "Start day 10:00 must be at least ~1 minute in the future." };
    }
  } else {
    const found = findNextAppLaunchStart(new Date());
    startYmd = found.startYmd;
    firstPostAt = found.firstPostAt;
  }

  const rangeEndExclusive = businessDateTimeToUTC(
    addCalendarDays(startYmd, APP_LAUNCH_POST_COUNT),
    10,
    0
  );
  const campaignNeedle = `utm_campaign=${APP_LAUNCH_CAMPAIGN}`;

  if (!options.force) {
    const { count, error: cErr } = await supabase
      .from("scheduled_social_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .ilike("link", `%${campaignNeedle}%`)
      .gte("scheduled_at", firstPostAt.toISOString())
      .lt("scheduled_at", rangeEndExclusive.toISOString());

    if (cErr) {
      return { ok: false, reason: cErr.message };
    }
    if ((count ?? 0) >= APP_LAUNCH_POST_COUNT) {
      return {
        ok: true,
        skipped: true,
        reason: `App launch week already queued (${count} pending). Pass force=1 to queue again.`,
        campaign: APP_LAUNCH_CAMPAIGN,
        startYmd,
        firstPostAt: firstPostAt.toISOString(),
      };
    }
  }

  const inserted: { id: string; label: string; scheduledAt: string }[] = [];
  const errors: string[] = [];

  for (let dayOffset = 0; dayOffset < APP_LAUNCH_SOCIAL_POSTS.length; dayOffset++) {
    const post = APP_LAUNCH_SOCIAL_POSTS[dayOffset];
    const postDay = addCalendarDays(startYmd, dayOffset);
    const when = businessDateTimeToUTC(postDay, 10, 0);
    const link = appLaunchLink(post.linkPath);
    const imageUrl = post.imagePath ? `${origin}${post.imagePath}` : null;
    const channels = post.imagePath
      ? post.channels
      : post.channels.filter((c) => c !== "instagram");

    const { data, error } = await supabase
      .from("scheduled_social_posts")
      .insert({
        message: post.message,
        link,
        image_url: imageUrl,
        channels,
        scheduled_at: when.toISOString(),
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      errors.push(`${post.label}: ${error.message}`);
    } else if (data) {
      inserted.push({
        id: data.id,
        label: post.label,
        scheduledAt: when.toISOString(),
      });
    }
  }

  return {
    ok: errors.length === 0,
    campaign: APP_LAUNCH_CAMPAIGN,
    startYmd,
    firstPostAt: firstPostAt.toISOString(),
    inserted,
    errors: errors.length ? errors : undefined,
  };
}
