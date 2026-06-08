import type { BlogPost } from "./blog-types";

const IV_APP_FAQ = [
  {
    question: "What is the Hello Gorgeous client app?",
    answer:
      "The **Hello Gorgeous app** lives at **[hellogorgeousmedspa.com/app](/app)** — a mobile-friendly hub on your phone. Browse services, open the **Vitamin Bar**, **build a custom IV bag**, book through Fresha, and add the app to your home screen like a native app. No App Store download required.",
  },
  {
    question: "How does Build Your IV Bag work?",
    answer:
      "Pick **500 mL ($89)** or **1 Liter ($109)**, then tap Olympia-sourced add-ons — B12, glutathione, vitamin C, Tri-Immune, magnesium, NAD+, and more. The app shows a **live price quote** (most custom bags land **$150–$199**). When you book, your bag summary goes straight into the appointment notes for our team.",
  },
  {
    question: "Do I need an account to use the IV bag builder?",
    answer:
      "**No.** You can browse and build as a guest. **Sign in** (magic link email) saves your preferences and unlocks member perks over time — walk-ins can create an account in seconds with the **New — get the app** tab on the login screen.",
  },
  {
    question: "Are IV add-ons the same as your Vitamin Bar menu?",
    answer:
      "**Yes.** Add-ons align with our **Vitamin Bar** shots and **[IV therapy](/iv-therapy)** offerings — sourced through **Olympia Pharmacy** and our in-spa menu. Rx add-ons like **Zofran** or **NAD+** may require provider screening before treatment.",
  },
  {
    question: "Where is Hello Gorgeous Med Spa for IV therapy?",
    answer:
      "**74 W Washington Street, Oswego, IL 60543** — serving **Naperville, Aurora, Plainfield, Yorkville, Montgomery**, and the **Fox Valley**. Call **(630) 636-6193** or **[book online](/book)**.",
  },
  {
    question: "How do I add the Hello Gorgeous app to my iPhone or Android home screen?",
    answer:
      "Open **[hellogorgeousmedspa.com/app](/app)** in Safari (iPhone) or Chrome (Android). Tap **Share → Add to Home Screen** (iPhone) or the menu **Install app / Add to Home screen** (Android). You get one-tap access to booking and the IV builder.",
  },
] as const;

export const buildYourIvBagAppLaunchPost: BlogPost = {
  slug: "build-your-iv-bag-hello-gorgeous-app-oswego-il",
  title:
    "Build Your IV Bag + Our New Hello Gorgeous App — Oswego, IL",
  metaTitle:
    "Build Your IV Bag Online | Hello Gorgeous App | IV Therapy Oswego IL",
  metaDescription:
    "Design a custom IV bag from $89 in the new Hello Gorgeous app — pick size, add B12, glutathione, vitamin C & more. Most bags $150–$199. IV therapy in Oswego for Naperville, Aurora & Plainfield. Add to home screen & book.",
  excerpt:
    "Our new client app is live: build a custom IV bag in minutes, see your price in real time, and book IV therapy in Oswego — no App Store required. Add hellogorgeousmedspa.com/app to your home screen.",
  category: "Wellness",
  date: "2026-06-07",
  readTime: "6 min",
  keywords: [
    "IV therapy Oswego IL",
    "custom IV bag",
    "Hello Gorgeous app",
    "vitamin IV Naperville",
    "glutathione IV Oswego",
    "Build Your IV Bag",
    "med spa app Illinois",
    "IV hydration Aurora IL",
    "Vitamin Bar Oswego",
    "add to home screen PWA",
  ],
  featuredImage: "/images/marketing/nad-iv-bag-hello-gorgeous.svg",
  structuredDataFaqs: IV_APP_FAQ.map(({ question, answer }) => ({
    question,
    answer: answer.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[(.+?)\]\(([^)]+)\)/g, "$1"),
  })),
  content: `# Build Your IV Bag + Our New Hello Gorgeous App — Oswego, IL

**Hello Gorgeous Med Spa in Oswego, IL** — serving **Naperville, Aurora, Plainfield, Yorkville**, and the **Fox Valley** — just launched something we have wanted for years: a **client app** that lives on your phone **without the App Store**, plus a **Build Your IV Bag** tool so you can design hydration, glow, energy, or recovery IVs **before you walk in**.

Open it now: **[hellogorgeousmedspa.com/app](/app)** · Deep link to the builder: **[Build Your IV Bag](/app?iv=build)**

![Custom IV bag builder — Hello Gorgeous Med Spa, Oswego IL](/images/marketing/nad-iv-bag-hello-gorgeous.svg)

## Why we built the Hello Gorgeous app

Med spa care should feel **personal**, not like guessing at a menu board. Our app puts **booking**, the **Vitamin Bar**, **memberships**, and **IV customization** in one pink-branded home screen you can save to your phone.

**What you can do today:**

- **Browse & book** — Fresha scheduling for Botox, fillers, facials, weight loss, and more
- **Vitamin Bar** — quick shots and wellness injectables (same Olympia-sourced quality we use in IVs)
- **Build Your IV Bag** — pick bag size, stack add-ons, see your total instantly
- **Add to Home Screen** — works like an app on iPhone & Android (PWA)

> *"I built my bag on my couch, walked in, and they had everything ready — no back-and-forth at the desk."* — **Hello Gorgeous client**, Oswego *(individual experiences vary)*

## Build Your IV Bag — how it works

### Step 1: Choose your bag size

| Size | Base price | Best for |
| --- | --- | --- |
| **500 mL** | **$89** | Hydration + a few boosters — our most popular |
| **1 Liter (1000 mL)** | **$109** | Deep hydration, recovery, or multiple add-ons |

Fluids: **Normal Saline** or **Lactated Ringer's**. Typical session: **30–60 minutes** in our Oswego treatment suite.

### Step 2: Add boosters (Olympia-sourced)

Tap what matches your goal — pricing is transparent in the app:

- **Energy** — B12, B-Complex, MIC/Lipotropic, taurine
- **Immune** — Vitamin C, zinc, Tri-Immune Boost
- **Beauty & glow** — Glutathione, biotin
- **Recovery** — Magnesium, amino blend
- **Longevity / Rx** — NAD+ boost, Zofran *(provider screening when required)*

Most **custom bags land in the $150–$199 range** — we show a live total so there are no surprises.

### Step 3: Start from a preset (or build from scratch)

Not sure where to start? One tap loads a popular combo:

- **✨ Glow Bag** — glutathione, biotin, vitamin C
- **⚡ Energy Bag** — B12, B-Complex, taurine
- **🛡️ Immunity Bag** — vitamin C, zinc, Tri-Immune
- **💪 Recovery Bag** — magnesium, amino blend, B-Complex *(1 L bag)*
- **⭐ Myers-Style** — wellness classic stack

### Step 4: Book with your bag attached

Hit **Book this bag** — your size, add-ons, and estimated total copy into the Fresha booking notes. Our **NP-led team** reviews everything at check-in.

**Try the builder:** **[Open Build Your IV Bag](/app?iv=build)**

Learn more about IV therapy on our **[IV Therapy page](/iv-therapy)** and **[Vitamin Bar](/vitamin-bar)** hub.

## Add the app to your home screen (30 seconds)

1. On your phone, go to **hellogorgeousmedspa.com/app**
2. **iPhone (Safari):** Share → **Add to Home Screen**
3. **Android (Chrome):** Menu → **Install app** or **Add to Home screen**

You get one-tap access to booking, deals, and the IV builder — updated whenever we ship new features.

## New here? Create your account in seconds

Walk-ins and first-time clients: tap **Sign in** in the app, then **New — get the app**. Enter your email and first name — we send a **magic link** (no password to remember). Same flow works on **[portal login](/portal/login)**.

## IV therapy at Hello Gorgeous — Oswego, IL

IV therapy delivers fluids, vitamins, and antioxidants **directly into your bloodstream** for fast absorption — popular for **hydration**, **immune support**, **post-travel recovery**, **glow**, and **energy**.

- **Medical oversight** — Ryan Kent, **FNP-BC**, on site **7 days a week**
- **Pharmacy-grade sourcing** — Olympia & vetted partners, not random internet vials
- **Same spa you trust** — #1 Best Med Spa in Oswego, authentic products, honest pricing

**Related services:** **[Peptide therapy](/peptides)** · **[Hello Gorgeous RX™](/rx)** · **[Weight loss](/glp1-weight-loss)** · **[Book a consult](/book)**

---

## Frequently Asked Questions

${IV_APP_FAQ.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n")}

---

## Ready to build your bag?

📱 **[Open the Hello Gorgeous app](/app)**  
💧 **[Build Your IV Bag](/app?iv=build)**  
📞 **(630) 636-6193**  
🌐 **[Book online](/book)**  
📍 **74 W. Washington Street, Oswego, IL 60543**

*Pricing shown in the app is an estimate for planning; final treatment plans are confirmed by your provider at visit.*`,
};
