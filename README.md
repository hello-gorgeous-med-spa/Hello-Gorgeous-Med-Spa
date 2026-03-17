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

## ✍️ Content Guidelines (Blog & Marketing)

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
