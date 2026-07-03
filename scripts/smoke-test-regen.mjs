#!/usr/bin/env node
/**
 * RE GEN pre-launch smoke test — run before go-live.
 *
 *   node scripts/smoke-test-regen.mjs
 *   SITE_URL=https://www.hellogorgeousmedspa.com node scripts/smoke-test-regen.mjs
 */

const SITE = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");

const URLS = [
  "/",
  "/rx",
  "/rx/weight-loss",
  "/rx/hormones",
  "/rx/sexual-health",
  "/rx/request",
  "/rx/care",
  "/peptides",
  "/rx/brochure",
  "/brochure/regen.html",
  "/regen-tv",
  "/promo-kit/",
  "/regen-site/index.html",
  "/sitemap.xml",
  "/llms.txt",
  "/api/public/ai-profile",
  "/api/regen/pricing",
  "/images/regen/regen-og-image.jpg",
  "/videos/regen/regen-logo-reveal.mp4",
  "/brochure/assets/ryan-regen-provider.png",
];

const REDIRECTS = [
  ["/rx/peptides", "/peptides"],
  ["/regen-tv", "/regen-tv.html"],
  ["/refill", "/rx/care"],
];

let failed = 0;

async function checkUrl(path, expect = 200) {
  const res = await fetch(`${SITE}${path}`, { redirect: "follow" });
  const ok = res.ok;
  console.log(ok ? "✓" : "✗", res.status, path);
  if (!ok) failed++;
  return res;
}

async function checkRedirect(from, toFragment) {
  const res = await fetch(`${SITE}${from}`, { redirect: "manual" });
  const loc = res.headers.get("location") || "";
  const ok = (res.status === 301 || res.status === 308 || res.status === 307) && loc.includes(toFragment);
  console.log(ok ? "✓" : "✗", res.status, from, "→", loc || "(no location)");
  if (!ok) failed++;
}

async function checkRxSeo() {
  const res = await fetch(`${SITE}/rx`);
  const html = await res.text();
  const checks = [
    ["FAQPage schema", html.includes("FAQPage")],
    ["ItemList schema", html.includes("ItemList")],
    ["regen-site iframe", html.includes("regen-site/index.html")],
    ["sr-only crawl copy", html.includes("sr-only")],
    ["OG image", html.includes("regen-og-image")],
  ];
  for (const [label, ok] of checks) {
    console.log(ok ? "✓" : "✗", label);
    if (!ok) failed++;
  }
}

async function checkAiProfile() {
  const res = await fetch(`${SITE}/api/public/ai-profile`);
  const data = await res.json();
  const ok = data.reGen?.primaryUrl?.includes("/rx");
  console.log(ok ? "✓" : "✗", "ai-profile reGen block");
  if (!ok) failed++;
}

async function checkMascotChat() {
  const res = await fetch(`${SITE}/api/regen/mascot-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mascotId: "slim-t",
      messages: [{ role: "user", content: "smoke test" }],
    }),
  });
  const data = await res.json();
  const ok = res.ok && typeof data.response === "string" && data.response.length > 10;
  const live = !data.response.includes("warming up") && !data.response.includes("hit a snag");
  console.log(ok ? "✓" : "✗", "mascot-chat responds", live ? "(AI live)" : "(fallback — check ANTHROPIC_API_KEY in Vercel)");
  if (!ok) failed++;
}

async function checkSitemapRx() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  const xml = await res.text();
  for (const path of ["/rx", "/rx/weight-loss", "/rx/hormones", "/peptides"]) {
    const ok = xml.includes(path);
    console.log(ok ? "✓" : "✗", "sitemap contains", path);
    if (!ok) failed++;
  }
}

async function main() {
  console.log(`RE GEN smoke test → ${SITE}\n`);

  console.log("--- HTTP 200 URLs ---");
  for (const path of URLS) await checkUrl(path);

  console.log("\n--- Redirects ---");
  for (const [from, to] of REDIRECTS) await checkRedirect(from, to);

  console.log("\n--- /rx SEO ---");
  await checkRxSeo();

  console.log("\n--- AI / sitemap ---");
  await checkAiProfile();
  await checkSitemapRx();

  console.log("\n--- APIs ---");
  await checkMascotChat();

  console.log("\n--- Social config ---");
  const social = await fetch(`${SITE}/api/social/status`).then((r) => r.json());
  console.log("facebook:", social.facebook?.configured ? "✓" : "✗");
  console.log("google:", social.google?.configured ? "✓" : "✗");
  console.log("instagram:", social.instagram?.configured ? "✓" : "✗");

  console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed.");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
