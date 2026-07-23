# Handoff: Hello Gorgeous — Command Center

## Overview
An internal operations app for **Hello Gorgeous Med Spa** (Oswego, IL) that sits *on top of* Square (the practice's system of record) and gives the team one place to run the day. It has three top-level areas:

1. **Overview** (owner-only) — a KPI/analytics dashboard + a private password/accounts vault.
2. **Team Hub** (all staff) — shared tasks with messaging & reminders, a daily-operations checklist, a consent-forms tracker, staff broadcast messages, and time-off requests.
3. **Marketing** (all staff) — shared campaigns/templates/resources, plus a password-locked **Laura's Desk** for the marketing contractor's hours/invoice accountability.

Two access codes gate sensitive areas (front-end only in the prototype — see Security):
- **Owner** view: `725247`
- **Laura's Desk**: `987654`

## About the Design Files
The file in this bundle (`Command Center.dc.html`) is a **design reference created in HTML** — a working prototype showing the intended look and behavior. It is **not production code to ship directly**. The task is to **recreate this design in the target codebase's environment** — the existing app is **Next.js 15 / React 18 / TypeScript / Tailwind / Supabase** (repo: `github.com/hello-gorgeous-med-spa/Hello-Gorgeous-Med-Spa`) — using its established components, patterns, and the Hello Gorgeous design system. Where the prototype holds data in React component state, production should use Supabase (or the relevant Square API) with real auth.

The prototype is authored as a "Design Component" (`.dc.html`): an `<x-dc>` template plus a `class Component extends DCLogic` logic class. Treat the logic class as the behavior spec, not as code to port verbatim.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, components, and interactions per the Hello Gorgeous design system. Recreate pixel-close using the codebase's existing UI library and the design tokens below.

## Data state
All sample data has been **emptied for handoff** — every list starts empty with a placeholder ("No tasks yet", "No time-off requests yet", KPIs at `0`, etc.). The developer wires real data into each named slot (see State Management). Structure, labels, controls, and access codes remain.

---

## Screens / Views

### Global chrome
- **Top bar**: solid black (`#000`), 14px/28px padding, flex space-between.
  - Left: wordmark "Hello Gorgeous" (Playfair Display, 22px, 800, letter-spacing −0.02em) + eyebrow "COMMAND CENTER" (11px, uppercase, letter-spacing 0.24em, hot pink `#FF2D8E`, 700).
  - Right: a **notification bell** (owner-only, see below) + a segmented view switcher (pill group, translucent white bg `rgba(255,255,255,0.1)`, radius 999px, 4px pad). Active segment = hot-pink fill, white text; inactive = `rgba(255,255,255,0.7)` text. Segments: **Overview** (only rendered for owner), **Team Hub**, **Marketing**.
- Body background: soft pink wash `#FFF5F9`. Content max-width 1240–1280px, centered, ~24–28px gutter.
- **Cards** (two treatments): (a) *soft* — white, 1px hairline `rgba(0,0,0,0.08)`, radius 16px, shadow `0 4px 24px rgba(0,0,0,0.05)`; (b) *signature* — white, **2px solid black** border, radius 16–18px, pink glow shadow `0 10px 30px rgba(255,45,142,0.12–0.2)` used on emphasis panels.
- Section headings: Playfair Display, 18–19px, 700. Eyebrows: 11px uppercase, letter-spacing 0.2em, hot pink, 700.

### 1. Overview (owner-only)
- **Handoff banner**: white card, 1px dashed hot-pink border, radius 12px; "Handoff" pink pill + note.
- **Header**: eyebrow "PRACTICE OVERVIEW", h1 "Welcome back." (Playfair 32px/800), subtitle (grey `#666`). Right: range toggle pill (Today / This week / This month).
- **KPI row**: 3-column grid, 16px gap, six soft cards. Each: uppercase label (11px, `#888`), big value (Playfair 34px/800, black), delta pill (12px; neutral grey `#f2f2f2`/`#aaa` in empty state — green `#16a34a` for up, pink for down when live), sub-label (12.5px `#777`).
- **Main grid**: `1.55fr / 1fr`, 16px gap.
  - Left column: **Revenue — last 8 weeks** (bar chart, bars = `--hg-pink-300`, latest `--hg-pink`, track `--hg-pink-100`), **Top services by revenue** (horizontal bars), **Provider performance** (table: Provider / Appts / Revenue / Rebook-rate bar). Empty state = dashed placeholders naming the Square source (e.g. "Dev: Team + Bookings → `providers[]`").
  - Right column: **Who's due back** (signature 2px-black card, pink pill count; recall list) and **Membership** (black card, MRR + active members + tier bars).
- **Passwords & accounts (vault)**: signature 2px-black card. Header + "+ Add account". Search input. Add form (name, category select, username, password, website). Rows in a 4-col grid: category pill + name/url · username + Copy · password (masked `••••••`, Show/Hide + Copy) · delete (×). Category pill colors: Vendor amber `#fef3c7/#b45309`, Software pink `--hg-pink-100/--hg-pink-700`, Banking indigo `#e0e7ff/#3730a3`, Social blue `#e7efff/#2D63A4`, Utility/Other grey. Copy uses `navigator.clipboard`; toast confirmation bottom-center.

### 2. Team Hub (all staff)
- **Header**: eyebrow "… · FRONT DESK BOARD", h1 "Let's get it done, **gorgeous**." (*gorgeous* in hot pink). Right: stat trio (Open / Done / Checklist %) + an **Owner / Staff** role toggle (pill, black active). "🔒 Owner" opens the passcode modal (`725247`); "Staff" re-locks and forces Team view.
- **Board grid** (`1.55fr / 1fr`):
  - **Left — Tasks**: "+ New task" (black pill) + quick-add chips (☎ Call a client, 📦 Order supplies, 💊 Call in Rx, 📄 Send a fax). Composer (2px-black card): title, note, **Assign to** (staff dropdown), **Type** chips (Call/Order/Rx/Fax/Task), **When** chips (Today/Tomorrow/This week), **🔔 Remind** chips (9 AM / Before lunch / 2 PM / End of day / None), "Assign to <name>". Filter chips (All / Open / In progress / Done). Task cards: category **Badge**, title, last-update line, status button cycling **Open → On it → Done**, bell chip if a reminder is set, due + reply count. Expand a card → detail note, message thread (bubbles: mine = hot-pink right-aligned, others = grey `#f1eef0` left), reply input + Send, "✓ Mark done" / "On it", and a **Reminder** chip row. A **"reminders now due"** black banner appears above the list with a shaking bell + Snooze 15m / Done.
  - **Right — Daily operations checklist**: signature 2px-black card, live progress bar. Sections Opening / Midday / Closing with toggle rows (checkbox → pink fill, label strikethrough when done). "Resets each morning."
- **Consent forms — today**: signature 2px-black card. "X/Y signed & ready" + progress bar. Rows: client · time · form name; status pill (Signed green / Awaiting signature pink / Not started black) + action (Prepare form → Mark signed).
- **Staff messages**: soft card. From dropdown (Ryan, Marissa, Danielle, Michelle, Laura, Jen) + To dropdown (Everyone + each), Template dropdown (prewritten notes that fill the box), textarea, "Send to <To>". Recent-messages feed: avatar initial + "sender → recipient · time" + message bubble.
- **Time-off requests**: soft card. "X pending owner approval". Request form (Who dropdown, Type: Vacation/Sick/Personal/Other, From/To date inputs, reason, "Request"). Shared board rows: name + type pill + date range (→) + note + status pill (Pending black / Approved green / Denied wine). **Approve / Deny buttons render only for Owner**; staff see status only. Each submission pushes an owner notification.

### 3. Marketing (all staff)
- **Header**: eyebrow "SALES & MARKETING", h1 "The marketing hub", subtitle "…managed by **Laura Witt**."
- **Sub-nav** pills: Campaigns / Templates / Resources / **🔒 Laura's Desk**.
- **Campaigns**: 2-col grid of soft cards — title, status pill (Live green / Scheduled blue / Draft grey), blurb, channel chips (IG/FB/Email/SMS/TikTok, pink), dates + "Get assets".
- **Templates**: 2-col grid — name + type, Copy + Download.
- **Resources**: soft card. **Upload** = real `<input type="file" multiple>` (label-wrapped black button); uploaded files list at top tagged "Yours" with real name/size. Rows: name/size + Copy link + Download. Downloads produce a real file (uploaded blob, or a generated `.txt` placeholder for seeded rows).
- **Laura's Desk** (locked): black lock card → "Enter access code" → modal (`987654`). Unlocked shows: agreement banner "$25/hr × 10 hrs/week = $250" (black→wine gradient), **Hours this week** (2px-black card: goal progress `X/10`, entry list, add-hours form: task + hrs + Log), **Monday invoice** (soft card: $250, status pill Due Monday → Submitted, "Submit weekly plan + invoice" → also fires the owner notification), **This week's accountability** checklist.

### Modals
- **Owner access** / **Laura's Desk**: fixed full-screen overlay `rgba(0,0,0,0.55)`, centered 340px white card radius 20px, 🔒 glyph, Playfair title, password input (centered, letter-spacing 0.3em, 2px black border), error text (`--hg-error #dc2626`), Cancel (outline) + Enter (pink). Correct code unlocks for the session.

### Notifications (owner bell)
- Bell button (38px round, translucent) in the top bar, **owner-only**. Unread count in a hot-pink badge. Click toggles a 300px white dropdown (radius 14px, heavy shadow): title, notification list (text + pink delivery line + time), empty state, and a **"Deliver to me by"** setting — Email / Text / Both chips + editable email & mobile inputs. Opening the bell marks all read. Fires when Laura submits an invoice and when a time-off request is submitted.

## Interactions & Behavior
- **View switching**: Overview visible only when `role === 'owner'` (after code). Selecting Staff re-locks owner and forces Team.
- **Access codes**: Owner `725247`, Laura's Desk `987654`. Wrong code → inline error. Prototype gates purely client-side.
- **Tasks**: status cycles Open→On it→Done; expand toggles thread; sending appends a message from the current role; reminders can be set/snoozed; a due-reminder banner surfaces at top.
- **Consent**: Prepare (missing→awaiting) then Mark signed (→signed); progress bar recomputes.
- **Time-off**: submit → Pending + owner notification; owner Approve/Deny sets status + `decidedBy`.
- **Marketing**: file upload via real input (object URLs); downloads via a generated `<a download>`; copy via clipboard; toasts bottom-center (~1.8–2s).
- **Notifications**: unread badge; delivery preference (email/text/both) recorded on each notification (actual send is a backend task).
- No route changes — everything is in-page view/state. Animations are minimal (bell shake keyframe `hgbell`; card/entry hovers per design system).

## State Management
Replace in-component state with real data/auth. Key stores:
- `role` (owner|staff), `ownerUnlocked`, `lauraUnlocked` → **real auth & RBAC server-side**, not codes.
- `view` (overview|team|marketing), `mktSub`.
- `tasks[]` {id,title,detail,cat,due,status,assignedTo,by,remindAt,remindState,thread[]} → Supabase table + realtime.
- `messages[]` {from,to,text,time} → team messages table.
- `timeOff[]` {id,who,type,start,end,note,status,decidedBy} → requests table; owner approval writes status.
- `consents[]` {client,time,form,status} → from Square Bookings + charting/consent system.
- `checks{}`, `weekChecks{}` → daily checklist state (reset daily).
- `hoursLog[]`, `invoiceSubmitted` → Laura's time tracking + invoice record.
- `vault[]` {name,cat,user,pass,url} → **see Security**.
- `notifications[]` {text,delivery,time,unread} + `notifChannel/notifEmail/notifPhone` → notification log + real email/SMS delivery (Twilio/SendGrid/Square).
- `uploads[]` → shared asset storage bucket.

### Square / data sources (from empty-state hints)
- KPIs, Revenue trend, Retail/RX → Payments/Reports API.
- Top services → Catalog + Payments.
- Provider performance → Team + Bookings.
- Who's due back → Bookings last-visit + recall-window rules.
- Membership MRR/tiers → Subscriptions API.
- Consent list → Bookings (today's schedule) + consent/charting store.

## Design Tokens
Load the Hello Gorgeous design system (fonts, colors, typography, spacing, base, styles + bundle). Key values used:
- **Colors**: white `#FFFFFF`, black `#000000`, hot pink `#FF2D8E` (`--hg-pink`), deep pink `#E6007E` (`--hg-pink-deep`), wine `#C90A68`; pink scale `--hg-pink-50…950` (used: 100 `#FFE0F0`, 200 `#FFC1E2`, 300 `#FF92CC`, 700 `#C90A68`); soft wash `#FFF5F9` (`--hg-pink-soft`), light panel `#FCE7F3` (`--hg-pink-mid`); success `#16a34a`, error `#dc2626`; incidental accents indigo `#3730a3/#e0e7ff`, blue `#2D63A4/#e7efff`, amber `#b45309/#fef3c7`.
- **Type**: Playfair Display (serif, headings, 700–800, tracking −0.02em); Inter (sans, body/UI). Sizes used: 34 (KPI), 32 (h1), 30, 24, 22, 19/18 (section), 14/13/12.5/11 (body/labels/eyebrows).
- **Radii**: 8–9px buttons/inputs, 12–14px chips/rows, 16–18px cards, 999px pills.
- **Shadows**: soft `0 4px 24px rgba(0,0,0,0.05–0.08)`; pink glow `0 10px 30px rgba(255,45,142,0.12–0.28)`; modal `0 30px 80px rgba(0,0,0,0.4)`.
- **Spacing**: 24–28px page gutter, 16–18px card gaps, 20–24px card padding.

## Assets
- No image assets are embedded (icons are inline stroke SVGs / emoji labels, matching the design system's Lucide/Heroicons-outline approach). Use the real logo assets from the design system (`assets/logo*.png`) for production branding.
- Fonts come from the design system's `tokens/fonts.css` (Playfair Display + Inter).

## Security (must-read)
The two passcodes and the password vault are **front-end-only prototype conveniences**. In production:
- Replace codes with **real authentication + role-based access control enforced server-side** (owner vs. staff vs. contractor). Never gate financials/credentials with a client-side string.
- Do **not** store live credentials in app state. Use a dedicated secrets manager / password manager (1Password, Bitwarden) or encrypted-at-rest storage with strict access; the vault UI should at most surface references.
- Treat consent/client data as **PHI** (HIPAA): encrypt, audit access, restrict by role.

## Files
- `Command Center.dc.html` — the full prototype (all three views, modals, logic). Open directly in a browser to interact.
