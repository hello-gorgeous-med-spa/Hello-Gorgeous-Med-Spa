#!/usr/bin/env node
/** Publish RE GEN blog launch post to Google Business Profile only. */

const SITE_URL = "https://www.hellogorgeousmedspa.com";

const message = `NEW on our blog — Introducing RE GEN: prescription care online from Hello Gorgeous Med Spa, Oswego IL.

Pay first · health intake · telehealth when needed · ship across Illinois:
• GLP-1 medical weight loss
• Peptides — BPC-157, NAD+, sermorelin & more
• Hormones, hair & skin Rx, sexual wellness

Ryan Kent, FNP-BC supervises every protocol. Flat $30 shipping after NP approval.

Read the full guide — link below`;

async function main() {
  const body = {
    message,
    link: `${SITE_URL}/blog/introducing-re-gen-online-rx-oswego-il?utm_source=google&utm_medium=gbp_post&utm_campaign=regen_blog_2026`,
    imageUrl: `${SITE_URL}/images/regen/regen-og-image.jpg`,
    channels: ["google"],
  };

  console.log("Publishing RE GEN blog launch to Google Business Profile…\n");

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
