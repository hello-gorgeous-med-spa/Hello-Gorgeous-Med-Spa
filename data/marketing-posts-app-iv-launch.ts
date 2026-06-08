/**
 * Launch copy — Hello Gorgeous app + Build Your IV Bag (Jun 2026)
 * Use via Admin → Marketing → Post Social (GBP preset) or paste manually.
 */

export const APP_LAUNCH_BLOG_SLUG = "build-your-iv-bag-hello-gorgeous-app-oswego-il";

export const APP_LAUNCH_URLS = {
  app: "https://www.hellogorgeousmedspa.com/app",
  ivBuilder: "https://www.hellogorgeousmedspa.com/app?iv=build",
  blog: "https://www.hellogorgeousmedspa.com/blog/build-your-iv-bag-hello-gorgeous-app-oswego-il",
  book: "https://www.hellogorgeousmedspa.com/book",
} as const;

/** Facebook Page — primary launch post */
export const FACEBOOK_APP_LAUNCH_POST = `📱 BIG news from Hello Gorgeous Med Spa — our client app is LIVE!

No App Store. No hassle. Just open the link, tap Add to Home Screen, and you've got us in your pocket.

💧 NEW: Build Your IV Bag
Design your custom IV before you walk in:
• 500 mL from $89 · 1 Liter from $109
• Stack add-ons — B12, glutathione, vitamin C, Tri-Immune, magnesium & more
• See your total in real time (most custom bags land $150–$199)
• Book with your bag summary attached — our team is ready when you arrive

Also inside the app: Vitamin Bar, services, deals & Fresha booking.

👉 Build your bag: ${APP_LAUNCH_URLS.ivBuilder}
👉 Get the app: ${APP_LAUNCH_URLS.app}
📖 Full guide: ${APP_LAUNCH_URLS.blog}

Ryan Kent, FNP-BC on site 7 days a week · 74 W Washington St, Oswego, IL
Serving Naperville, Aurora, Plainfield & the Fox Valley 💕

#HelloGorgeousMedSpa #OswegoIL #IVTherapy #VitaminDrip #MedSpa #Naperville #AuroraIL #FoxValley`;

/** Google Business Profile — matches lib/google-business-post-presets hello-gorgeous-app-iv-builder */
export const GOOGLE_APP_LAUNCH_POST = `📱 NEW — The Hello Gorgeous client app is live!

💧 Build Your IV Bag in minutes:
• 500 mL from $89 · 1 Liter from $109
• Add B12, glutathione, vitamin C, Tri-Immune & more
• Most custom bags land $150–$199 — see your total before you book

Browse services, Vitamin Bar shots, deals & booking — add hellogorgeousmedspa.com/app to your home screen (no App Store needed).

Ryan Kent, FNP-BC · Oswego, IL — serving Naperville, Aurora & Plainfield.`;

/** Shorter Facebook follow-up / story caption */
export const FACEBOOK_IV_BUILDER_SHORT = `Build YOUR IV bag in 60 seconds 💧✨

Pick your size → tap your boosters → see your price → book.

${APP_LAUNCH_URLS.ivBuilder}

Hello Gorgeous Med Spa · Oswego, IL`;
