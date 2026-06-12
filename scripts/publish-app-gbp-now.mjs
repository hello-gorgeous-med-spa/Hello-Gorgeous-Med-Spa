#!/usr/bin/env node
/** Publish Hello Gorgeous app launch to Google Business Profile only. */

const SITE_URL = "https://www.hellogorgeousmedspa.com";

const message = `📱 NEW — Hello Gorgeous Med Spa client app | Oswego, IL

Your med spa in your pocket — built for Oswego, Naperville, Aurora, Plainfield & the Fox Valley. No App Store download: scan our QR at the spa or open the link below, then Add to Home Screen for one-tap booking.

✓ Book online — Botox & Dysport, dermal fillers, HydraFacial, Morpheus8 Burst, IPL, medical weight loss (GLP-1 / tirzepatide), body contouring & more
✓ Build Your IV Bag — custom IV hydration from $89 · most bags $150–$199 (B12, glutathione, vitamin C, Tri-Immune & more)
✓ Vitamin Bar — drive-thru wellness shots · pre-pay in the app
✓ App-only deals, gift cards & monthly memberships
✓ HG Rewards points · GLP-1 screening · peptides · hormones · client portal

Ryan Kent, FNP-BC on site 7 days a week · downtown Oswego at 74 W Washington St.

Get the app (scan QR): hellogorgeousmedspa.com/get-app
Open the app: hellogorgeousmedspa.com/app`;

async function main() {
  const body = {
    message,
    link: `${SITE_URL}/get-app?utm_source=google&utm_medium=gbp_post&utm_campaign=app_full_launch`,
    imageUrl: `${SITE_URL}/images/marketing/hello-gorgeous-app-scan-flyer.jpg`,
    channels: ["google"],
  };

  console.log("Publishing app launch to Google Business Profile…\n");

  const res = await fetch(`${SITE_URL}/api/social/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("✗ HTTP", res.status, JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const g = data.results?.google;
  console.log("Google:", g?.ok ? `✓ posted ${g.id ?? ""}` : `✗ ${g?.error ?? "failed"}`);
  if (!g?.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
