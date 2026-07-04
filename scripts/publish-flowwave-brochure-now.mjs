#!/usr/bin/env node
/**
 * Publish FlowWave shockwave therapy brochure to Facebook + Google Business.
 *
 *   node scripts/publish-flowwave-brochure-now.mjs
 *   node scripts/publish-flowwave-brochure-now.mjs --channels=google,facebook
 */

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");
const FLOWWAVE_URL = `${SITE_URL}/services/flowwave`;
const BROCHURE_PDF = `${SITE_URL}/brochure/flowwave-shockwave-therapy.pdf`;
const SOCIAL_IMAGE = `${SITE_URL}/brochure/assets/flowwave-brochure-social-1.png`;

const MESSAGE = `NEW at Hello Gorgeous Med Spa — FlowWave™ FOCUS shockwave therapy 💗

Focused acoustic-wave treatment for deep-tissue pain, faster recovery, and men's wellness — non-invasive, drug-free, and just 3–10 minutes per area.

✓ Penetrates up to 12 cm — not just the surface
✓ 150+ treatment zones on the FlowWave FOCUS
✓ NP-directed · free medical screening
✓ Intro special: $175 first session (any area)

Oswego, IL — serving Naperville, Aurora, Plainfield & Yorkville.

📄 View our brochure: ${BROCHURE_PDF}
Book your free consult 👇

#FlowWave #ShockwaveTherapy #HelloGorgeous #OswegoIL #PainRelief #MensHealth #MedSpa #FoxValley`;

async function main() {
  const channelsArg = process.argv.find((a) => a.startsWith("--channels="));
  const channels = channelsArg?.split("=")[1]?.split(",").filter(Boolean) ?? [
    "facebook",
    "google",
  ];

  console.log("Publishing FlowWave brochure post");
  console.log("Channels:", channels.join(", "));
  console.log("Landing:", FLOWWAVE_URL);
  console.log("Brochure PDF:", BROCHURE_PDF);
  console.log("Image:", SOCIAL_IMAGE);
  console.log();

  const res = await fetch(`${SITE_URL}/api/social/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: MESSAGE,
      link: FLOWWAVE_URL,
      imageUrl: SOCIAL_IMAGE,
      channels,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`✗ HTTP ${res.status}`, JSON.stringify(data, null, 2));
    process.exit(1);
  }

  for (const ch of channels) {
    const r = data.results?.[ch];
    console.log(
      `${ch}:`,
      r?.ok ? `✓ ${r.id || r.url || "posted"}` : `✗ ${r?.error || "skipped"}`,
    );
  }

  const failed = channels.filter((ch) => !data.results?.[ch]?.ok);
  if (failed.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
