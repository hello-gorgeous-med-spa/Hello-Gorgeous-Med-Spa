/**
 * Upload a curated Hello Gorgeous photo set to Google Business Profile.
 * Uses public hellogorgeousmedspa.com URLs (Google fetches them).
 *
 *   node --env-file=.env.local scripts/upload-gbp-photos.mjs
 */
const SITE = "https://www.hellogorgeousmedspa.com";

/** @type {{ category: string, path: string, label: string }[]} */
const PHOTOS = [
  { category: "LOGO", path: "/images/logo-full.png", label: "Logo" },
  { category: "PROFILE", path: "/images/team/danielle-alcala-glazier-portrait.png", label: "Danielle portrait" },
  { category: "TEAMS", path: "/images/team/danielle-alcala-glazier-about.png", label: "Danielle about" },
  { category: "TEAMS", path: "/images/team/michelle-colby-2026.jpg", label: "Michelle" },
  { category: "TEAMS", path: "/images/team/laura-witt-2026.jpg", label: "Laura" },
  { category: "TEAMS", path: "/images/team/marissa-murray-2026.jpg", label: "Marissa" },
  { category: "INTERIOR", path: "/images/quantum-rf/quantum-rf-treatment-room-may-4.jpg", label: "Quantum treatment room" },
  { category: "INTERIOR", path: "/images/solaria/danielle-solaria-inmode-clinic.png", label: "Solaria clinic" },
  { category: "INTERIOR", path: "/images/gallery/treatment-1.png", label: "Treatment room 1" },
  { category: "INTERIOR", path: "/images/gallery/treatment-2.png", label: "Treatment room 2" },
  { category: "INTERIOR", path: "/images/gallery/treatment-3.png", label: "Treatment room 3" },
  { category: "ADDITIONAL", path: "/images/morpheus8/morpheus8-hero.jpg", label: "Morpheus8 Burst" },
  { category: "ADDITIONAL", path: "/images/home/morpheus8-body-burst-technology-inmode.png", label: "Morpheus8 Body" },
  { category: "ADDITIONAL", path: "/images/solaria/solaria-hero.jpg", label: "Solaria CO2" },
  { category: "ADDITIONAL", path: "/images/solaria/solaria-inmode-machine.jpg", label: "Solaria machine" },
  { category: "ADDITIONAL", path: "/images/quantum-rf/quantum-hero.jpg", label: "Quantum RF" },
  { category: "ADDITIONAL", path: "/images/quantum-rf/quantum-rf-inmode-handpieces-ba.jpg", label: "Quantum handpieces" },
  { category: "ADDITIONAL", path: "/images/injectables/hero-lip-injection.png", label: "Dermal fillers / lips" },
  { category: "ADDITIONAL", path: "/images/injectables/hero-glam-portrait.png", label: "Injectables portrait" },
  { category: "AT_WORK", path: "/images/botox/slideshow/01.jpg", label: "In-chair injectables" },
  { category: "AT_WORK", path: "/images/quantum-rf/quantum-rf-procedure-may-4.jpg", label: "Quantum procedure" },
  { category: "AT_WORK", path: "/images/solaria/solaria-workstation.png", label: "Solaria workstation" },
];

async function token() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(data.error_description || data.error || "token failed");
  return data.access_token;
}

async function main() {
  const access = await token();
  const acc = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
  const loc = process.env.GOOGLE_BUSINESS_LOCATION_ID;
  const endpoint = `https://mybusiness.googleapis.com/v4/accounts/${acc}/locations/${loc}/media`;
  const results = [];

  for (const photo of PHOTOS) {
    const sourceUrl = `${SITE}${photo.path}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mediaFormat: "PHOTO",
        locationAssociation: { category: photo.category },
        sourceUrl,
      }),
    });
    const data = await res.json();
    results.push({
      ok: res.ok,
      label: photo.label,
      category: photo.category,
      error: data.error?.message || null,
    });
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(
    JSON.stringify(
      {
        uploaded: results.filter((r) => r.ok).map((r) => `${r.category}: ${r.label}`),
        failed: results.filter((r) => !r.ok).map((r) => `${r.label} — ${r.error}`),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
