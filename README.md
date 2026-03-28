# Hello Gorgeous Med Spa (HelloGorgeousMedSpa.com)

Full-stack medical spa platform built on **Next.js 14 (App Router)** + **Tailwind CSS** + **Supabase** + **Remotion**.

## 🚀 Features

### Admin Dashboard (`/admin`)
- **Dashboard** - Overview and KPIs
- **Calendar** - Fresha-style drag-and-drop appointment scheduling
- **Clients** - Client management with Square integration
- **Charting** - HIPAA-compliant medical charting
- **Services** - Service catalog management
- **Memberships** - VIP membership programs

### 🤖 AI Campaign Studio (`/admin/campaign-studio`)
Complete marketing automation like Canva + CapCut + Hootsuite:
- **AI Prompt Box** - Describe campaign, AI generates everything
- **Hook Generator** - Viral 3-second hooks with scoring (0-100)
- **Image Generator** - DALL-E powered campaign images
- **Caption Generator** - Platform-specific captions (Instagram, TikTok, Facebook)
- **30-Day Batch Generator** - Generate a month of content in 2 minutes
- **8 Campaign Templates** - Weight Loss, Botox, Laser, Fillers, etc.
- **Stock Media Library** - Pexels integration for stock photos/videos
- **One-Click Social Posting** - Publish to Instagram, Facebook, TikTok, YouTube

### 📊 Campaign Analytics (`/admin/campaign-analytics`)
Self-learning AI optimization engine:
- **Performance Tracking** - Views, engagement, bookings per campaign
- **AI Analysis** - Weekly analysis of what converts to bookings
- **Auto-Recommendations** - Best hooks, hashtags, posting times
- **Conversion Funnel** - Views → Engagement → Clicks → Bookings
- **Booking Attribution** - Track which campaigns generate bookings

### 🎬 Video Generator (`/admin/video-generator`)
Remotion-powered video creation:
- **Service Templates** - Solaria, Botox, Morpheus8, Weight Loss, etc.
- **Multiple Formats** - Vertical (9:16), Square (1:1), Horizontal (16:9)
- **AI Voiceover** - ElevenLabs integration
- **Auto Captions** - Whisper transcription with animated text
- **Before/After Images** - Pull from landing pages
- **Video Library** - Save and manage generated videos

### 📧 Email Campaigns (`/admin/email-campaigns`)
- **Visual Email Builder** - Block-based drag-and-drop editor
- **Client Import** - Pull clients from Square
- **Templates** - Promotional, newsletter, appointment reminders
- **Resend Integration** - Reliable email delivery

### Additional Features
- **Consent Forms** - HIPAA-compliant digital consent
- **SMS Notifications** - Twilio integration (A2P 10DLC pending)
- **Gift Cards** - Square gift card integration
- **Inventory Management** - Track products and supplies
- **Staff Management** - Provider schedules and permissions
- **Reports** - Revenue, appointments, marketing ROI

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes, Server Actions |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth.js |
| Payments | Square, Stripe |
| Video | Remotion |
| AI | OpenAI (GPT-4, DALL-E, Whisper), ElevenLabs |
| Email | Resend |
| SMS | Twilio |
| Storage | Supabase Storage |
| Hosting | Vercel |

## 📁 Project Structure

```
app/
├── admin/                    # Admin dashboard pages
│   ├── campaign-studio/      # AI Campaign Generator
│   ├── campaign-analytics/   # Performance Analytics
│   ├── video-generator/      # Remotion Video Creator
│   ├── email-campaigns/      # Email Marketing
│   ├── calendar/             # Appointment Calendar
│   ├── clients/              # Client Management
│   └── ...
├── api/
│   ├── ai/                   # AI endpoints
│   │   ├── campaign/         # Generate campaigns
│   │   ├── hooks/            # Viral hook generator
│   │   ├── images/           # DALL-E image generation
│   │   ├── optimize/         # Social optimization
│   │   ├── batch-content/    # 30-day content generator
│   │   ├── analyze-campaigns/# AI performance analysis
│   │   └── transcribe/       # Whisper transcription
│   ├── analytics/            # Campaign analytics
│   ├── render-video/         # Remotion video rendering
│   ├── social/               # Social media posting
│   └── ...
├── (public pages)/           # Marketing website
│   ├── services/
│   ├── about/
│   └── ...
lib/
├── brand-config.ts           # Hello Gorgeous branding
├── supabase/                 # Database client
└── ...
remotion-videos/
├── src/
│   ├── compositions/         # Video templates
│   │   ├── SolariaCO2Laser.tsx
│   │   ├── StretchMarkTreatment.tsx
│   │   └── ...
│   ├── components/           # Reusable video components
│   │   └── AnimatedCaptions.tsx
│   └── Root.tsx              # Composition registry
└── public/                   # Video assets
supabase/
└── migrations/               # Database schema
```

## 🗄 Database Tables

### Core Tables
- `appointments` - Booking data with campaign attribution
- `clients` - Client profiles synced from Square
- `services` - Service catalog
- `providers` - Staff and provider info

### Marketing Tables
- `campaigns_library` - Saved AI campaigns
- `video_library` - Generated videos
- `image_library` - Stock and uploaded images
- `social_posts` - Published social media posts
- `campaign_metrics` - Performance analytics
- `campaign_recommendations` - AI optimization insights

## 🔧 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPEN_API_KEY=

# ElevenLabs
ELEVENLABS_API_KEY=

# Square
SQUARE_APPLICATION_ID=
SQUARE_OAUTH_CLIENT_SECRET=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Resend
RESEND_API_KEY=

# Stock Media (optional)
PEXELS_API_KEY=
```

## 🔍 SEO & Search Performance

### Top Queries We Optimize For

| Query | Target | Status |
|-------|--------|--------|
| hello gorgeous med spa | Position 6.9 → top 3 | Homepage title leads with "Hello Gorgeous Med Spa" |
| hello gorgeous oswego il | Position 8.2 → top 3 | Best-med-spa page title, site keywords |
| hello gorgeous oswego | #1 | ✓ |
| botox oswego il | #1 | ✓ |
| botox specials near me | #1 | ✓ |
| dermaplaning near me | #1 | ✓ |

### SEO Changes Made

- **Homepage:** Title "Hello Gorgeous Med Spa" first; description leads with brand
- **Best Med Spa page:** "Hello Gorgeous Med Spa Oswego IL" in title
- **Site keywords:** "hello gorgeous med spa", "hello gorgeous oswego il" prioritized
- **Sitemap:** Fixed middleware; Google can discover all pages
- **404 redirects:** Legacy URLs (shop-1, skinscript, anteage, etc.) redirect to current pages
- **GBP:** See `docs/GOOGLE-MAPS-ACTION-PLAN.md` for Maps visibility

### Structured data (JSON-LD) — critical for Google Rich Results

When you change SEO-related markup, **treat structured data as part of the same change**. Invalid or mismatched schema is a common reason **FAQ snippets, review stars, and Rich Results Test** fail.

**Follow these rules:**

1. **FAQ (`FAQPage`) must match the visible page.** The questions and answers in JSON-LD need to be the **same text** users see on the page. On the homepage, `HOME_FAQS` in `lib/seo.ts` is the single source of truth and `HomepageFAQ` renders from it — do not maintain a separate FAQ list in the component. For other pages, keep `faqJsonLd(...)` in sync with on-page Q&amp;A. When you call `faqJsonLd`, pass the **canonical URL of that page** as the second argument on key landings (see homepage in `app/page.tsx`).

2. **Review markup must be valid JSON-LD.** Each `<script type="application/ld+json">` must be **one JSON object**, not a root-level **array**. Multiple reviews should use `@context` + `@graph`. Each `Review` should include **`itemReviewed`** pointing at the business (`@id` matching `#organization` in `siteJsonLd()`).

3. **Do not duplicate conflicting reviews on the organization.** Avoid embedding a `review` array on `MedicalBusiness` / `LocalBusiness` that quotes the same people as the testimonials section but with **different text** — that conflicts with visible content and hurts trust signals. Use **`aggregateRating`** for summary stats; put full quoted testimonials in the dedicated review `@graph` that matches the UI.

4. **Homepage services:** Service cards and JSON-LD should stay aligned via `lib/homepage-services.ts` (ItemList, booking catalog, galleries).

5. **After meaningful schema changes**, run **[Google Rich Results Test](https://search.google.com/test/rich-results)** on the live URL. Some types (e.g. `ImageGallery`) may show as valid but “not eligible” for a specific rich result — that is normal; fix **errors** on FAQ, `LocalBusiness` / `MedicalBusiness`, and `Review`.

### Docs

- `docs/LOCAL-SEO-OSWEGO.md` — **Oswego, IL & surrounding areas (location keywords)**
- `docs/MORPHEUS8-MARKETING.md` — **Newest Morpheus8 Burst face & body — use everywhere**
- `docs/INDEXING-ACTION-PLAN.md` — Indexing fixes
- `docs/404-REDIRECTS.md` — Legacy URL redirects
- `docs/GOOGLE-MAPS-ACTION-PLAN.md` — Google Maps / GBP
- `docs/GBP-VISIBILITY-FIXES.md` — Why not showing for "near me"

---

## ✍️ Content Guidelines (Blog & Marketing)

### Local SEO — Oswego, IL & Surrounding Areas (CRITICAL)

**EVERYTHING is Oswego, IL and surrounding areas.** This is huge for SEO and being recognized locally.

- **Canonical locations:** Oswego, Naperville, Aurora, Plainfield, Fox Valley, Yorkville, Montgomery
- **Never use:** Phoenix, Phoenix Valley, or any non-local city
- See [`docs/LOCAL-SEO-OSWEGO.md`](docs/LOCAL-SEO-OSWEGO.md) for the full rule set

### Blog SEO — When Creating New Blog Posts

**Before publishing any blog article, follow:** [`docs/BLOG-SEO-GUIDELINES.md`](docs/BLOG-SEO-GUIDELINES.md)

- Include **city/neighborhood** (Oswego, IL) in the title and first 100 words
- Add an **FAQ section** at the bottom with exact questions people ask
- **Link to the related service page** (e.g., /services/morpheus8)
- Use **client reviews as quotes** — keyword-rich testimonials help SEO

---

**Never disparage competitors.** When writing blog articles, social posts, or landing page copy:

- **Do not** compare competitors unfavorably or make negative claims about other businesses
- **Do not** publish false or misleading statements about other providers
- **Focus on our strengths** — what we offer, our expertise, and our outcomes — without putting others down
- **Ranking or comparison content** should be factual and neutral; avoid disparaging competitors to avoid legal liability (defamation, deceptive trade practices, Lanham Act claims)

Disparaging competitors in blog content can lead to legal action. We build trust by showcasing our own excellence.

## 🚀 Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build
npm run build

# Remotion studio (video preview)
cd remotion-videos && npm run studio
```

## 📍 Location

**Hello Gorgeous Med Spa**  
74 W Washington Street  
Oswego, IL 60543  
📞 630-636-6193  
🌐 [hellogorgeousmedspa.com](https://hellogorgeousmedspa.com)

---

Built with ❤️ for Hello Gorgeous Med Spa
