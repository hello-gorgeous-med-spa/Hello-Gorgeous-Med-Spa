# Google Ads Launch Kit — Hello Gorgeous Med Spa

**Created:** 2026-05-05 · **Strategy:** Tier A (brand defense) + Tier B (uncontested local procedures). No "Botox near me" cold spend until conversion data exists.

---

## ⚠️ PREREQUISITE — Do this BEFORE any campaign launches

1. Verify `NEXT_PUBLIC_GA4_MEASUREMENT_ID` + `NEXT_PUBLIC_GTM_ID` have real values in Vercel (not empty strings)
2. Trigger a redeploy after fixing
3. Visit hellogorgeousmedspa.com in incognito → open Chrome DevTools Network tab → confirm a `googletagmanager.com/gtag/js?id=G-...` request fires
4. Open analytics.google.com → Realtime report → confirm your visit shows up
5. ONLY THEN proceed with Google Ads launch

---

## Account Setup Checklist (one-time, ~30 min)

| Step | Where | Action |
|---|---|---|
| 1 | ads.google.com | Open Google Ads account in **Expert mode** (NOT Smart mode — it auto-spends without controls) |
| 2 | Google Ads → Tools → Linked Accounts → Google Analytics | Link your GA4 property (1-click) |
| 3 | Google Ads → Goals → Conversions → New conversion → Import from GA4 | Import these GA4 events as conversions: `phone_click`, `book_now_click`, `form_submit`, `contour_lift_lead_submit`, `contour_lift_clinical_intake_submit` |
| 4 | Google Ads → Tools → Linked Accounts → Google Business Profile | Link your GBP (so reviews show below ads) |
| 5 | Google Ads → Settings → Account-level negative keywords | Paste the master negatives list at bottom of this doc |
| 6 | Google Ads → Tools → Audience Manager → Customer Match | Upload Square customer email list as remarketing audience |

---

## Geo Targeting (use for all campaigns)

**Primary radius:** 15-mile radius around Oswego, IL 60543

**OR** target these zip code clusters specifically (more controlled spend):
- Oswego: 60543
- Naperville: 60540, 60563, 60564, 60565
- Aurora: 60502, 60503, 60504, 60505, 60506
- Plainfield: 60544, 60585, 60586
- Yorkville: 60560
- Montgomery: 60538

**Exclude:** Any geo outside 30 miles of Oswego (prevents Google's "expanded location" feature from wasting spend).

---

## CAMPAIGN 1 — Brand Defense (always-on, low cost)

**Daily budget:** $5/day (~$150/mo)
**Bid strategy:** Manual CPC, max $2 per click
**Status to launch:** Active immediately once tracking verified

### Ad Group 1A: "Hello Gorgeous" Brand

**Keywords (exact + phrase match):**
```
[hello gorgeous med spa]
[hello gorgeous oswego]
[hello gorgeous med spa oswego]
[hello gorgeous skincare]
[hello gorgeous botox]
"hello gorgeous"
"hellogorgeous medspa"
+hello +gorgeous +oswego
```

**Final URL:** https://hellogorgeousmedspa.com/

**15 Headlines (30 char limit each):**
```
Hello Gorgeous Med Spa
Official Site — Oswego IL
Family-Owned Since 2014
4.4★ on Google · 116 Reviews
Botox · Filler · Laser · GLP-1
Free Consultation · Book Today
Real People. Real Results.
Hello Gorgeous Oswego IL
Cherry Financing Available
74 W Washington · Oswego, IL
Same-Week Appointments
Medical Director On-Site
InMode Verified Provider
Quantum RF · Solaria CO2
The Original Hello Gorgeous
```

**4 Descriptions (90 char limit each):**
```
Family-owned med spa in downtown Oswego. Botox, fillers, weight loss, Morpheus8 & more.
4.4★ rating with 116 Google reviews. Free consultations. Cherry financing available.
The only med spa in the western suburbs with Quantum RF, Solaria CO₂ & Morpheus8 Burst.
Visit us at 74 W. Washington St in downtown Oswego. Same-week appointments available.
```

**Display path:** /hello-gorgeous

---

## CAMPAIGN 2 — Quantum RF (THE MONEY CAMPAIGN)

**Daily budget:** $15/day (~$450/mo)
**Bid strategy:** Maximize Conversions (let Google optimize, after 30 conversions switch to Target CPA $40)
**Status to launch:** Active immediately once tracking verified

### Ad Group 2A: Quantum RF Local

**Keywords (phrase match unless noted):**
```
"quantum rf"
"quantum rf near me"
"quantum rf oswego"
"quantum rf naperville"
"quantum rf aurora"
"quantum rf chicago"
"quantum rf chicago suburbs"
"inmode quantum rf"
"non surgical liposuction"
"non surgical lipo near me"
"lipo alternative oswego"
"lipo alternative naperville"
"body contouring oswego"
"body contouring naperville il"
"radiofrequency body contouring"
"subdermal rf"
"rf lipo near me"
"non surgical fat reduction"
[quantum rf oswego il]
[non surgical liposuction oswego]
```

**Final URL:** https://hellogorgeousmedspa.com/lp/contour/

**15 Headlines (30 char limit each):**
```
Quantum RF Now in Oswego IL
The Lipo Alternative
75-Min Walk-Out Procedure
Performed by FNP-BC On-Site
No Surgery · No Scalpel
Local Anesthesia Only
Cherry Financing from $104/mo
Chin & Neck from $2,499
Abdomen Contour $3,999
Free Consultation · Book Now
InMode Quantum RF Provider
Only Provider in W Suburbs
Real Medical Procedure
Skip the $10K Lipo Bill
4.4★ Google · 116 Reviews
```

**4 Descriptions (90 char limit each):**
```
Lipo-level body contouring without surgery. 75 minutes. Local anesthesia. Walk out same day.
Performed by Ryan Kent, FNP-BC. One of the only Quantum RF providers in the Chicago suburbs.
Chin & Neck $2,499. Abdomen $3,999. Total Body $7,499. Cherry financing from $104/month.
Free consultation. Book online or call 630-636-6193. Family-owned med spa in Oswego, IL.
```

**Display path:** /quantum-rf

---

## CAMPAIGN 3 — Solaria CO₂ Laser (low spend, high intent)

**Daily budget:** $7/day (~$210/mo)
**Bid strategy:** Manual CPC, max $4 per click
**Status:** Activate AFTER Campaign 2 has produced data

### Ad Group 3A: CO₂ Laser Local

**Keywords:**
```
"solaria co2 oswego"
"solaria laser oswego"
"co2 laser oswego il"
"co2 laser naperville"
"co2 laser aurora il"
"fractional co2 laser near me"
"co2 laser resurfacing oswego"
"co2 laser cost oswego"
"laser skin resurfacing oswego"
"co2 laser acne scars"
[co2 laser oswego il]
[solaria co2 laser]
```

**Final URL:** https://hellogorgeousmedspa.com/co2-laser-oswego-il

**15 Headlines:**
```
Solaria CO₂ Laser in Oswego IL
$899 Full Face Launch Special
Reg. $1,500+ at Surgery Offices
InMode Solaria Provider
Treats Acne Scars · Sun Damage
5-7 Day Downtime
Smooths Wrinkles & Lines
Performed by Medical Director
Family-Owned Since 2014
Free Consultation Available
Cherry Financing Available
Real Patient Results
4.4★ Google · 116 Reviews
Same-Week Appointments
The Only Solaria in Oswego
```

**4 Descriptions:**
```
InMode Solaria CO₂ fractional laser resurfacing — $899 launch special vs $1,500+ elsewhere.
Treats acne scars, sun damage, wrinkles, sun spots. 5-7 days downtime, dramatic results.
Performed by Ryan Kent, FNP-BC at our Oswego location. One of the only Solaria providers locally.
Free consultation. Book online at hellogorgeousmedspa.com or call 630-636-6193.
```

**Display path:** /solaria-co2

---

## CAMPAIGN 4 — Morpheus8 Local (medium-competition, medium-spend)

**Daily budget:** $10/day (~$300/mo)
**Bid strategy:** Manual CPC, max $5/click
**Status:** Activate after Campaign 2 + 3 data is in

### Ad Group 4A: Morpheus8 Burst & Deep

**Keywords:**
```
"morpheus8 burst"
"morpheus8 deep"
"morpheus8 oswego"
"morpheus8 naperville il"
"morpheus8 aurora il"
"morpheus8 burst near me"
"morpheus8 body burst"
"rf microneedling oswego"
"morpheus8 face oswego"
"morpheus8 abdomen"
"morpheus8 jawline"
[morpheus8 burst oswego]
[morpheus8 deep oswego]
```

**Final URL:** https://hellogorgeousmedspa.com/morpheus8-burst-oswego-il

**15 Headlines:**
```
Morpheus8 Burst — Oswego IL
The Newest Morpheus8 Protocol
Burst + Body Deep Available
Verified InMode Provider
Skin Tightening · Face & Body
RF Microneedling
Performed by Medical Director
Free Consultation
Cherry Financing Available
Family-Owned Since 2014
4.4★ Google · 116 Reviews
Real Results · Real People
Same-Week Appointments
74 W Washington · Oswego
Visit Our Treatment Suite
```

**4 Descriptions:**
```
The newest Morpheus8 Burst + Deep protocols. Face, neck, body — performed by Ryan Kent, FNP-BC.
One of the few Oswego med spas offering Burst + Body Deep. RF microneedling that actually works.
Free consultation included. Cherry financing available. Family-owned in downtown Oswego.
4.4★ on Google with 116 reviews. Book online or call 630-636-6193 today.
```

**Display path:** /morpheus8

---

## SITELINK EXTENSIONS (apply to all campaigns)

Create these in Google Ads → Ads & Extensions → Extensions → Sitelink:

| Sitelink Title | Description Line 1 | Description Line 2 | URL |
|---|---|---|---|
| Free Consultation | Talk with our medical team | No pressure, no upsell | /book |
| Cherry Financing | $0 down, 0% APR available | $100-300/mo payment plans | /financing |
| Real Patient Results | See before & after photos | Verified by our team | /results |
| Meet the Team | Family-owned since 2014 | Ryan Kent, FNP-BC on-site | /about |
| Read Our Reviews | 4.4★ across 116 reviews | What real clients say | /reviews |

---

## CALLOUT EXTENSIONS (apply to all campaigns)

Add these as callouts:
```
4.4★ Google Rating
Cherry Financing Available
Family-Owned Since 2014
Free Consultations
Same-Week Appointments
Medical Director On-Site
InMode Verified Provider
HSA/FSA Eligible
```

---

## STRUCTURED SNIPPETS

**Header: Services**
- Botox
- Dermal Fillers
- Morpheus8 Burst
- Quantum RF
- Solaria CO₂ Laser
- Weight Loss Programs
- IV Therapy
- Hormone Therapy

**Header: Brands**
- InMode
- Allergan
- Galderma
- Revance
- AnteAGE
- SkinMedica

---

## MASTER NEGATIVE KEYWORDS LIST (apply at account level)

Paste these into Google Ads → Settings → Account-level negative keywords. Stops your ads from showing on irrelevant searches that waste budget.

```
free
diy
home remedy
side effects
dangers
risks
lawsuit
class action
recall
banned
fda warning
death
killed
why does
why did
how to make
how to do
how does it work
salary
job
career
hiring
employment
school
training
certification
course
class
seminar
licensed
license
certify
certification cost
become a
become an
how much do
how much does
cost without
cheapest
discount
coupon
groupon
promo code
review of
reviews of
near you
near them
horror story
horror stories
gone wrong
ruined
botched
bad experience
worst
warning
banned
youtube
reddit
forum
quora
wikipedia
images
pictures
before after
recipe
study
research
peer reviewed
medical school
nursing school
md vs
dentist
dental
veterinary
vet
animal
dog
cat
horse
```

---

## LAUNCH SEQUENCE

| Day | Action | Spend |
|---|---|---|
| Day 0 | Verify GA4/GTM firing in production | $0 |
| Day 0 | Setup Google Ads + GA4 link + import conversions | $0 |
| Day 1 | Launch Campaign 1 (Brand Defense) | $5/day = $150/mo |
| Day 1 | Launch Campaign 2 (Quantum RF) | $15/day = $450/mo |
| Day 7 | Review impression share + CTR for Campaign 2; adjust if needed | — |
| Day 14 | If Campaign 2 has at least 5 conversions, launch Campaign 3 (Solaria) | +$210/mo |
| Day 21 | Review aggregate conversion data; pause underperformers | — |
| Day 30 | Launch Campaign 4 (Morpheus8) if budget allows | +$300/mo |
| Day 60 | Total spend ramping toward $1,100/mo if all 4 campaigns running | — |

**Conservative starting commitment:** $600/mo (Campaigns 1 + 2 only)
**Full ramped state:** $1,100/mo (all 4 campaigns)

---

## EXPECTED ROI MATH (conservative)

Assumptions:
- $600/mo spend → ~120-180 clicks (avg CPC $4)
- 8% conversion rate to consultation request (industry typical)
- 50% consult-to-booking close rate
- = **5-7 new bookings per month from $600 spend**

Average ticket assumptions:
- 2 Quantum RF bookings × $2,500 avg = $5,000
- 3 Botox bookings × $300 avg = $900
- 2 weight-loss consults converting to programs × $1,500 avg = $3,000
- = **~$8,900 monthly revenue** from $600 spend

Expected ROAS: **~14x at launch, 10-20x at steady state.**

The Quantum RF clicks alone justify the entire campaign. One Quantum RF booking covers a month of ad spend at any tier.

---

## WEEKLY MONITORING CHECKLIST

Every Monday morning, check:
1. Google Ads → Campaigns → check Conversions column. If a campaign has 0 conversions for 14 days → pause it
2. Search Terms report → add irrelevant queries as negatives
3. Impression Share → if < 50%, may need to increase bids
4. Quality Score on top keywords → if any < 6, improve landing page or ad copy
5. GA4 → verify conversion events still firing (you can break this with a code deploy)

---

## WHAT TO AVOID

- **Don't bid on "Botox" alone** — too competitive ($10-15 CPC), and you're better positioned on Quantum RF where you have unfair advantage
- **Don't bid on "Tirzepatide", "Semaglutide", "GLP-1"** — Google heavily restricts pharmacy ads. Most of these will get rejected or your account will get flagged
- **Don't enable "Display Network" on search campaigns** — wastes budget on banner ads with terrible conversion
- **Don't enable "Search Partners"** — Yahoo/Bing distribution, lower quality traffic for med spa
- **Don't use Smart campaigns** — auto-bidding without controls burns budget fast
- **Don't enable Performance Max from day 1** — wait until you have 30+ conversions to feed it data
