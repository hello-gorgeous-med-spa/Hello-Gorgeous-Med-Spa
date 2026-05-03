#!/usr/bin/env node
/**
 * One-time script: insert 7 Facebook presets into scheduled_social_posts.
 * Run: node --env-file=.env.local scripts/queue-social-week-now.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_URL = "https://www.hellogorgeousmedspa.com";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const presets = [
  {
    id: "solaria-899",
    label: "Solaria CO₂ — $899 full face",
    message: `✨ InMode Solaria CO₂ fractional laser — gold-standard skin resurfacing for texture, fine lines, sun damage, and acne scarring.

Launch special: $899 full face (consult required). Real results — not hype.

Oswego · serving Naperville, Aurora, Plainfield & the Fox Valley.`,
    linkPath: "/services/solaria-co2",
    imagePath: "/images/solaria/solaria-co2-full-face-before-after.png",
  },
  {
    id: "quantum-contour-live",
    label: "Contour Lift / Quantum RF",
    message: `🔥 Quantum RF is LIVE — Hello Gorgeous Contour Lift™.

Model Days May 4 & May 12 · limited spots · Quantum RF + Morpheus8 Body Deep bundled. Save up to $1,000 vs package pricing.

Text or call Ryan Kent to claim your spot: 217-741-8359
Main office: (630) 636-6193`,
    linkPath: "/services/quantum-rf#contour-lift-model-days",
    imagePath: "/images/quantum-rf/hello-gorgeous-contour-lift-model-days-flyer-2026.jpg",
  },
  {
    id: "morpheus8-burst",
    label: "Morpheus8 Burst + Deep",
    message: `⚡ Morpheus8 Burst + Deep — the newest InMode RF microneedling. Multi-depth energy in one pass; reaches deeper for crepey neck, arms, thighs & more.

Free consult determines your plan. Hello Gorgeous Med Spa — Oswego.`,
    linkPath: "/services/morpheus8",
    imagePath: "/images/morpheus8/morpheus8-burst-deep-thighs-skin-tightening-before-after.png",
  },
  {
    id: "ipl-photofacial",
    label: "IPL Photofacial — now booking",
    message: `💡 IPL Photofacial is NOW BOOKING at Hello Gorgeous.

Fade sun spots, redness, and broken capillaries — often visible improvement within days. From $250 · series bundled.

Oswego · Naperville · Aurora · Plainfield.`,
    linkPath: "/services/ipl-photofacial",
    imagePath: "/images/ipl-photofacial/ipl-photofacial-zemits-treatment-hero.png",
  },
  {
    id: "book-consult",
    label: "Book a consult",
    message: `Ready for a change you can see? Book a free consult at Hello Gorgeous Med Spa — downtown Oswego. Medical-grade skin, body, and injectables with a team that actually listens.

Call (630) 636-6193 or book online — link below.`,
    linkPath: "/book",
    imagePath: null,
  },
  {
    id: "weight-loss",
    label: "Medical weight loss",
    message: `Medical weight loss with real clinical oversight — not a fad app. Hello Gorgeous partners with you on GLP-1 and sustainable habits.

Book a consult: we'll tell you honestly if you're a candidate.`,
    linkPath: "/services/weight-loss-therapy",
    imagePath: null,
  },
  {
    id: "glow-social",
    label: "The Glow Social — event",
    message: `🥂 THE GLOW SOCIAL — FREE VIP night at Hello Gorgeous / Freddie's Off The Chain, Oswego.

Trifecta demos, bites & bubbly, raffle, guest vitamin shot. RSVP on our site — spots limited.`,
    linkPath: "/events/the-glow-social",
    imagePath: "/images/events/glow-social-win-big-may-14.png",
  },
];

const UTM = "utm_source=facebook&utm_medium=page_post&utm_campaign=hg_social_agent";

function withUtm(path) {
  const [beforeHash, hash] = path.split("#");
  const sep = beforeHash.includes("?") ? "&" : "?";
  const withQs = beforeHash + sep + UTM;
  return hash ? withQs + "#" + hash : withQs;
}

function getNextMonday10amCentral() {
  // Get current time in Chicago
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const getPart = (type) => parts.find((p) => p.type === type)?.value;
  
  const chicagoYear = parseInt(getPart("year"), 10);
  const chicagoMonth = parseInt(getPart("month"), 10) - 1;
  const chicagoDay = parseInt(getPart("day"), 10);
  const chicagoHour = parseInt(getPart("hour"), 10);
  
  // Create date object for today in Chicago at 10:00
  let startDate = new Date(chicagoYear, chicagoMonth, chicagoDay, 10, 0, 0, 0);
  
  // Find next Monday
  const dayOfWeek = startDate.getDay();
  let daysUntilMonday;
  if (dayOfWeek === 0) {
    daysUntilMonday = 1; // Sunday -> Monday
  } else if (dayOfWeek === 1) {
    // Monday - if past 10am, next week
    daysUntilMonday = chicagoHour >= 10 ? 7 : 0;
  } else {
    daysUntilMonday = 8 - dayOfWeek;
  }
  
  startDate.setDate(startDate.getDate() + daysUntilMonday);
  
  // Convert to UTC: Chicago is UTC-5 (CDT) or UTC-6 (CST)
  // May = CDT = UTC-5, so 10:00 CDT = 15:00 UTC
  const utcDate = new Date(Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    15, // 10:00 CDT = 15:00 UTC
    0,
    0
  ));
  
  return utcDate;
}

async function main() {
  const startDate = getNextMonday10amCentral();
  
  console.log("Queuing 7-day Facebook sequence...");
  console.log("First post (Monday 10:00 AM Central):", startDate.toISOString());
  console.log("");
  
  const inserted = [];
  
  for (let i = 0; i < presets.length; i++) {
    const p = presets[i];
    const postDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const scheduledAt = postDate.toISOString();
    
    const link = SITE_URL + withUtm(p.linkPath);
    const imageUrl = p.imagePath ? SITE_URL + p.imagePath : null;
    
    const { data, error } = await supabase
      .from("scheduled_social_posts")
      .insert({
        message: p.message,
        link,
        image_url: imageUrl,
        channels: ["facebook"],
        scheduled_at: scheduledAt,
        status: "pending",
      })
      .select("id")
      .single();
    
    if (error) {
      console.log("✗", p.label, "—", error.message);
    } else {
      const dayName = postDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "America/Chicago" });
      const timeStr = postDate.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "short", timeStyle: "short" });
      inserted.push({ id: data.id, label: p.label, scheduledAt });
      console.log("✓", p.label, "→", dayName, timeStr, `(${data.id})`);
    }
  }
  
  console.log("");
  console.log(`Done — ${inserted.length} posts queued.`);
  console.log("Vercel cron /api/cron/scheduled-social-posts will publish them when due.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
