# AI Admin Commands (Owner-Only Website Control)

Owner-only, approval-gated AI commands for website content and booking toggles. All changes go through Supabase CMS and are logged to AI Watchdog. No changes to the AI receptionist or client-facing AI.

---

## Overview

- **Where:** Admin → AI Insights → **Admin Commands** tab (owner only).
- **Flow:** Owner types a command → AI returns a **proposal** (what/where/old→new) → Owner chooses **Approve**, **Edit**, or **Cancel**. Nothing runs without explicit approval.
- **Execution:** CMS only (`cms_sections`, `cms_site_settings`). No code, schema, or config file edits.

---

## 1. AI Insights Page — Tabs

Two tabs:

| Tab | Who sees it | Purpose |
|-----|-------------|---------|
| **Insights** | All admin users | Business questions, charts, revenue, appointments (existing behavior). |
| **Admin Commands** | **Owner only** | Issue commands to update homepage/site; proposal → approve → execute. |

**Gating:** Admin Commands tab is wrapped in `<RoleGate roles={['owner']} />`. Staff and admin do not see the tab or the commands UI.

---

## 2. Command vs Query Classification

User input is classified with **rule-based detection** (no LLM autonomy):

- **Query** (e.g. “What’s my revenue?”, “How many appointments today?”)  
  → Response: *“Use the Insights tab for business questions.”*

- **Command** (e.g. “Update homepage headline to ‘Natural Results. Expert Care.’”, “Turn off booking”)  
  → AI returns a **proposal** only; nothing is executed.

**Command keywords (Phase 2 + Phase 3):** `change`, `update`, `set`, `enable`, `disable`, `turn off`, `turn on`, `add`, `remove`, `make the`, `replace`, `hours`, `close`, `open`, `banner`, `promo`, `pause booking`, `resume booking`.

---

## 3. Admin Command Flow (Approval Required)

1. Owner types a command (e.g. *“Update homepage headline to ‘Natural Results. Expert Care.’”*).
2. AI returns a **proposal card** with:
   - What will change  
   - Where it will change (e.g. `homepage.hero.headline`)  
   - Old value → New value  
3. UI actions:
   - **Approve** → Execute via CMS; log execution to Watchdog.
   - **Edit** → Pre-fill input with proposed value so owner can adjust and resend.
   - **Cancel** → Discard proposal.

No command executes without explicit **Approve**.

---

## 4. Execution Rules (No Direct File Edits)

All changes go through **Supabase CMS**. No code, schema, or config file edits.

### Allowed CMS targets (Phase 2 + Phase 3)

| Target | Table | Filter / notes | Fields |
|--------|--------|----------------|--------|
| Homepage hero | `cms_sections` | `type = 'hero'` | `headline`, `subheadline`, `cta_text`, `cta_url` |
| Homepage banner | `cms_sections` | `type = 'banner'` or `'promo_banner'` | `enabled`, `headline`, `subheadline`, `cta_text`, `cta_url`, `start_date`, `end_date` |
| Site settings | `cms_site_settings` | — | `tagline`, `features.booking_enabled`, `features.booking_paused_reason`, `features.booking_resume_at`, `business_hours` |

**Execution logic:** `lib/site-content-update.ts` (e.g. `applySiteContentUpdate(supabase, location, value)`).

**Location strings (Phase 2–4):**

- `homepage.hero.*` — headline, subheadline, cta_text, cta_url
- `homepage.banner.*` — enabled, headline, subheadline, cta_text, cta_url, start_date, end_date
- `site.tagline`, `site.booking_enabled`, `site.default_meta_title`, `site.default_meta_description`
- `site.hours.mon_fri`, `site.hours.sat`, `site.hours.sun`, `site.hours.add_closure`
- `site.booking_paused_reason`, `site.booking_resume_at`
- `section.about.content`, `section.about.title`, `section.first_time_visitor.*`, `section.what_to_expect.*` (text sections matched by name)

---

## 5. Phase 3 — Activity UI and Undo

- **Activity (read-only):** Admin Commands tab has sub-tabs **Chat** | **Activity**. Activity shows all `ai_admin_commands` logs from Watchdog: timestamp, action (Proposed vs Executed), location, old → new. Data: `GET /api/ai/watchdog?source=ai_admin_commands` (includes `metadata`).
- **Undo last change:** On the most recent **executed** entry, an “Undo last change” button is shown. Clicking it creates a **new proposal** (revert: old ↔ new) and shows the same Approve / Edit / Cancel card. Undo does not run without approval; it logs as a new action when approved.

---

## 6. Watchdog Logging (Mandatory)

Every command produces up to two log entries in `ai_watchdog_logs`.

### Proposal log (on suggestion)

When the AI returns a proposal (before any approval):

```json
{
  "source": "ai_admin_commands",
  "channel": "admin",
  "metadata": {
    "action": "update_site_content",
    "confidence": "high",
    "proposal": {
      "location": "homepage.hero.headline",
      "old": "...",
      "new": "..."
    },
    "approved_by_owner": false
  }
}
```

### Execution log (on approve)

When the owner clicks **Approve** and the change is applied:

```json
{
  "source": "ai_admin_commands",
  "channel": "admin",
  "metadata": {
    "action": "update_site_content",
    "confidence": "high",
    "approved_by_owner": true,
    "changes": {
      "location": "homepage.hero.headline",
      "old": "...",
      "new": "..."
    }
  }
}
```

---

## 7. API Routes

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/ai/admin-commands` | POST | Classify input; return query message or **proposal** (no execution). | Owner only (`hgos_session` cookie, `role === 'owner'`) |
| `/api/ai/admin-commands/execute` | POST | Execute an approved proposal (CMS update + execution log). | Owner only |

**Classify + propose (POST body):** `{ "message": "Update homepage headline to …" }`

**Response (query):** `{ "kind": "query", "response": "Use the Insights tab for business questions." }`

**Response (command proposal):** `{ "kind": "command_proposal", "message": "…", "proposal": { "action", "location", "old", "new", "summary", "confidence" } }`

**Execute (POST body):** `{ "proposal": { "action", "location", "old", "new" } }`

**Execute (success):** `{ "success": true, "message": "Change applied.", "changes": { "location", "old", "new" } }`

---

## 8. Files

| File | Purpose |
|------|---------|
| `lib/get-owner-session.ts` | Owner auth for admin command API routes (read `hgos_session` cookie). |
| `lib/site-content-update.ts` | Apply CMS updates by location; allowed locations and `applySiteContentUpdate()`. |
| `app/api/ai/admin-commands/route.ts` | Classify + propose; owner-only; proposal log to Watchdog. |
| `app/api/ai/admin-commands/execute/route.ts` | Execute approved proposal; owner-only; execution log to Watchdog. |
| `app/admin/insights/page.tsx` | Tabs (Insights \| Admin Commands), RoleGate, command chat, proposal card (Approve / Edit / Cancel). |

---

## 9. Out of Scope & Never Automate

**Do not build in Admin Commands (any phase):**

- Voice assistant, payments, schema migrations, staff permissions for Commands, auto-execution without approval, mascot routing, changes to receptionist or client-facing AI.

**Never automate (stay human forever). AI may draft; never apply:**

- Pricing, payments, medical protocols, legal language, HIPAA policies, staff permissions, provider credentials, patient data, schema/code changes.

---

## 10. Acceptance Criteria

- [x] Admin Commands tab visible only to owner (`RoleGate roles={['owner']}`).
- [x] Commands never auto-execute; execution only on **Approve**.
- [x] All updates go through CMS tables only (no file/schema edits).
- [x] All proposals and executions logged to `ai_watchdog_logs` with required metadata.
- [x] No regressions to AI receptionist or booking.
- [x] Build passes.
- [x] **(Phase 3)** Owner can update hours, add/remove banners, pause/resume booking with reason; Activity view shows all changes; Undo creates a revert proposal (approval required).

---

## One-liner (for dev)

**Phase 2:** Owner-only, approval-gated AI commands for website content and booking toggles, using CMS + Watchdog — no changes to receptionist or client AI.

**Phase 3:** Expands to hours, banners, and booking pauses, plus a read-only Activity view and safe Undo (revert as new proposal, approval required) — same safety model, CMS-only, fully logged.

**Phase 4:** Content & optimization — default SEO meta (title/description), informational sections (about, first-time visitor, what to expect), and campaign **draft only** (SMS/email copy with copy-to-clipboard; no send). AI proposes, owner approves or copies.

---

## Phase Map (Roadmap)

| Phase | Summary | Status |
|-------|---------|--------|
| **Phase 3 — Operational control** | Homepage messaging (hero, CTA), promotional banners (add/remove, schedule, toggle, copy), booking (on/off, pause with reason, resume at time), business hours & closures. *“Anything operational, visible, and reversible.”* | ✅ Shipped |
| **Phase 4 — Content & optimization** | Informational content (about, first-time visitor, “what to expect”), **SEO** (default meta title/description — approval required), campaign copy **drafting** (SMS/email draft copy, copy-to-clipboard — no execution). *“AI proposes, owner decides.”* | ✅ Shipped |
| **Phase 5 — Strategic intelligence** | Staleness/consistency detection (outdated copy, conflicting hours, old promos, Google profile mismatch), performance-based suggestions (banners, seasonal messaging, CTA ideas), cross-channel awareness (website vs SMS/email vs Google). *“AI becomes an advisor, not an operator.”* | Optional, after trust earned |

**One-liner map:**  
Phase 3 = operations + visibility + booking + hours + promos.  
Phase 4 = content + SEO proposals + campaign drafts.  
Phase 5 = intelligence + insights + proactive suggestions.
