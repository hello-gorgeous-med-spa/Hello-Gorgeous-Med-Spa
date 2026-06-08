/**
 * Launch copy — Hello Gorgeous app + Build Your IV Bag (Jun 2026)
 * Use via Admin → Marketing → Post Social (GBP preset) or paste manually.
 */

export const APP_LAUNCH_BLOG_SLUG = "build-your-iv-bag-hello-gorgeous-app-oswego-il";

export const APP_LAUNCH_URLS = {
  app: "https://www.hellogorgeousmedspa.com/app",
  ivBuilder: "https://www.hellogorgeousmedspa.com/app?iv=build",
  getApp: "https://www.hellogorgeousmedspa.com/get-app",
  blog: "https://www.hellogorgeousmedspa.com/blog/build-your-iv-bag-hello-gorgeous-app-oswego-il",
  book: "https://www.hellogorgeousmedspa.com/book",
} as const;

/** Full feature list — use in social + email */
export const APP_FEATURE_BULLETS = [
  "Book Botox, facials, Morpheus8, weight loss & more",
  "Build Your IV Bag — custom hydration from $89 (most bags $150–$199)",
  "Vitamin Bar — pre-pay shots & drive-thru wellness",
  "Deals, gift cards & monthly memberships (Square checkout in-app)",
  "HG Rewards points · loyalty tiers · birthday treats",
  "GLP-1 screening · peptides · hormones · Fullscript supplements",
  "Client portal — appointments, documents, referrals & account",
  "Scan-to-get QR at hellogorgeousmedspa.com/get-app — add to home screen, no App Store",
] as const;

/** Facebook Page — full app launch */
export const FACEBOOK_APP_LAUNCH_POST = `📱 YOUR med spa. In YOUR pocket. The Hello Gorgeous app is LIVE!

No App Store download — scan our QR or open the link, then Add to Home Screen. One tap forever.

✨ EVERYTHING INSIDE THE APP:
• Book Now — Botox, fillers, facials, Morpheus8, weight loss & more
• 💧 Build Your IV Bag — pick 500 mL ($89) or 1 L ($109), stack B12, glutathione, vitamin C, Tri-Immune & more · live price before you book
• 💉 Vitamin Bar — drive-thru shots, pre-pay in the app
• 🎁 Deals — specials & gift cards
• ⭐ Memberships — monthly wellness plans, billed via Square
• 🏆 HG Rewards — earn points on every visit · loyalty tiers · birthday treats
• ⚖️ GLP-1 weight-loss screening intake
• 🧬 Wellness hub — peptides, hormone optimization, Fullscript supplements
• 👤 Me tab — portal, appointments, documents, referrals & your personal QR at checkout

Ryan Kent, FNP-BC on site 7 days a week · Oswego, IL

👉 Scan QR / get the app: ${APP_LAUNCH_URLS.getApp}
👉 Build your IV bag: ${APP_LAUNCH_URLS.ivBuilder}
📖 Full guide: ${APP_LAUNCH_URLS.blog}

#HelloGorgeousMedSpa #OswegoIL #MedSpa #IVTherapy #VitaminBar #Naperville #AuroraIL #FoxValley`;

/** Google Business Profile — full app launch */
export const GOOGLE_APP_LAUNCH_POST = `📱 NEW — The Hello Gorgeous client app is live (Oswego, IL)

Your med spa in your pocket — no App Store. Scan our QR or open hellogorgeousmedspa.com/app · Add to Home Screen.

What's inside:
✓ Book — Botox, facials, Morpheus8, weight loss & more
✓ Build Your IV Bag — from $89 · most custom bags $150–$199
✓ Vitamin Bar shots · deals · gift cards · memberships
✓ HG Rewards points · loyalty tiers · birthday perks
✓ GLP-1 screening · peptides · hormones · supplements
✓ Client portal · appointments · documents · referrals

Scan QR: hellogorgeousmedspa.com/get-app
Ryan Kent, FNP-BC · serving Naperville, Aurora & Plainfield.`;

/** Shorter Facebook follow-up / story caption */
export const FACEBOOK_IV_BUILDER_SHORT = `Build YOUR IV bag in 60 seconds 💧✨

Pick size → tap boosters → see your price → book.

${APP_LAUNCH_URLS.ivBuilder}

Get the full app (scan QR): ${APP_LAUNCH_URLS.getApp}
Hello Gorgeous Med Spa · Oswego, IL`;
