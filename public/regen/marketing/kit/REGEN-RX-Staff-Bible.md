# REGEN RX Owner & Staff Bible

**Internal · Staff only · v1 · September 6, 2026**

How Danielle Alcala, a licensed Illinois clinician, Damara Lindabald, and the desk run a licensed Illinois telehealth program — portal, ops, pharmacy, money, partners, and the rules we do not bend.

**Teach from this. Print it. New hires sign SOP-00 before they touch a queue.**

- Live (ops login): [tryregenrx.com/ops/playbook](https://tryregenrx.com/ops/playbook)
- Download / print: [/staff/protocols/guides/REGEN-RX-Staff-Bible.html](/staff/protocols/guides/REGEN-RX-Staff-Bible.html)
- Staff hub: [/staff/protocols](/staff/protocols)

The June 2026 `rx-owners-manual.md` is **stale** (Fresha, consumer-facing BoomRx). This file is the current bible.

---

## 1. Non-negotiables

- Illinois adults only. If they are not an Illinois resident, stop.
- a licensed Illinois clinician is the prescriber. Danielle and Damara move the queue. They do not write the Rx.
- A request is a consult — never a guaranteed prescription, dose, or result.
- Compounded medication is not FDA-approved. Say that. Never imply it is the same as a brand name.
- Patients never place an order at a pharmacy. Staff places after Ryan approves.
- Do not name the backup pharmacy to patients. Say “our licensed compounding pharmacy.” Staff may use Formulation / FormuConnect (default) and BoomRx (backup blends) internally.
- No diagnosis, no “this is your dose,” no outcome promises on the phone, in DMs, or on partner posts.
- No competitor dunking. Sell REGEN RX on our own process.
- PHI stays in the portal and ops. Never Slack, never group text, never a partner dashboard.
- If you did not review the chart, you do not click Approve.

---

## 2. Who does what

| Person | Owns | Does not do |
|---|---|---|
| Danielle Alcala — Owner | Policy, partners, money, refund exceptions, staff training, brand voice | Prescribe, invent a dose, approve a partner who skipped the Code |
| a licensed Illinois clinician — Prescriber | Clinical yes/no, labs, video, dose, decline, off-label when indicated | Paste pharmacy orders, run payouts, write affiliate ads |
| Damara Lindabald — Operations | Today queue, pharmacy paste, tracking, messages, refill follow-up | Override a decline, promise a ship date Ryan has not approved |
| Front desk / spa staff | Hand the flyer, QR to tryregenrx.com/start, book in-clinic consults, escalate | Quote a custom price, collect PHI on paper “to be faster” |

Ops login is name + password at **tryregenrx.com/ops**. Approvals are audited to the person who signed in.

---

## 3. What REGEN RX is

REGEN RX is Hello Gorgeous PC’s cash-pay telehealth door: weight loss, hormones, peptides, vitamins, skincare, hair, intimacy, and curated stacks.

- Live site: **tryregenrx.com**
- Phone: **(630) 636-6193**
- Clinic: 74 W. Washington St, Oswego, IL 60543

We are not a research-chem shop, not a nationwide Hims clone, and not insurance.

**Money math staff can do in their head**

- Pharmacy wholesale × 2.5 = client product
- 90-day product gets an extra 10% off the product only
- Formulation vial checkouts: **$25** cold shipping
- Curated stacks (BoomRx sheet blends): **$35** cold shipping
- Shipping is never commissioned and GORGEOUS20 never discounts it

---

## 4. Patient journey

1. **Start** — tryregenrx.com/start. Promo GORGEOUS20 is entered on the Stripe payment screen.
2. **Screening + consent** — they answer medical questions and sign. If they do not qualify, they get a **full refund**.
3. **Pay** — Stripe. Payment is a consult deposit toward medication if prescribed — not a purchase of a specific vial yet.
4. **A licensed Illinois clinician reviews** — Today queue. Four boxes must be true before Approve: medical history, contraindications, telehealth is appropriate, and “I am Ryan and this is my decision.” Or: Need labs / Video / Decline.
5. **Damara places pharmacy** — Formulation / FormuConnect first. BoomRx only when Formulation does not carry the line.
6. **Ship + portal** — tracking in the patient account. Messages stay in-app.
7. **Refill** — same clinical bar every month. Auto-pay does not mean auto-prescribe.

---

## 5. Daily ops

Bookmark after ops login:

| Screen | Path | Use |
|---|---|---|
| Today | /ops | Needs-action queue |
| Patients | /ops/patients | Search, open chart |
| Messages | /ops/messages | Same thread as /account/messages |
| Orders | /ops/orders | Pharmacy id + tracking |
| Labs | /ops/labs | Requested / received |
| Payments | /ops/payments | Stripe totals (refunds in Stripe Dashboard) |
| Partners | /ops/affiliates | Approve, pause, terminate |
| Clinical tools | /ops/calculator, reconstitution, tirzepatide | Math — never a patient dose card |
| Staff Bible | /ops/playbook | This document, live |

### Ryan’s morning (15–30 min)

1. Today → Needs action.
2. Open Chart. Read screening. If the story is thin, video or labs — do not guess.
3. Check all four attest boxes only if they are true.
4. Approve or decline. Write the note a lawyer could read in two years.

### Damara’s morning

1. Approved without a pharmacy id → place the ticket, mark ordered.
2. Shipped without tracking → add tracking, message the patient in-app.
3. Unread messages older than 4 business hours → answer or escalate to Ryan.
4. Partners tab Friday: pending applications to Danielle.

---

## 6. Patient portal

Patients log in at tryregenrx.com/login. Home is `/account`: dashboard, subscriptions, orders, prescriptions, messages, settings, progress.

- They should see status in the portal before they have to call.
- Staff answers in /ops/messages — never a personal Gmail thread for clinical questions.
- If they email a photo of labs, Damara uploads to the chart and tells them in-app it was received.
- Subscription cancel takes effect at the end of the paid period. Do not refund unused days unless SOP-04 / Danielle says so.
- Password / lockout: Damara resets. Do not share a staff login with a patient.

---

## 7. Orders and pharmacy

- Default: **Formulation Rx via FormuConnect**. Staff portal: [portal.formuconnect.com](https://portal.formuconnect.com/login)
- Backup: **BoomRx** for lines Formulation does not carry (BPC/TB stacks, sheet blends)
- Patients hear “licensed compounding pharmacy.” Never the backup pharmacy name.
- Live pharmacy APIs stay off until Danielle turns them on. We copy-paste.
- After ship: tracking in Orders + one portal message.

---

## 8. Money, GORGEOUS20, refunds

**GORGEOUS20** = 20% off the first medication order. Shipping excluded. Illinois only. Ryan still decides. Stripe coupon must exist as code `GORGEOUS20`.

There is no refund button inside /ops/payments yet. Danielle or Damara refund in the **REGEN Stripe Dashboard**: Payments → search the patient email → the charge → Refund. Paste the Stripe refund id in the chart the same day.

| Situation | Action | Who |
|---|---|---|
| Ryan declines before a prescription | Full refund of the consult/medication charge. Note: reason + next step. | Danielle or Damara. Same day. |
| Duplicate charge / Stripe error | Full refund. Screenshot the Stripe id in the chart. | Damara |
| Cancel after pay, before A licensed Illinois clinician reviews | Full refund if no clinical work has started. If Ryan already reviewed, Danielle decides. | Danielle |
| Pharmacy already compounded / shipped | No product refund. Shipping not refunded. Offer a clinical follow-up. | Danielle + Ryan |
| Side effect / they “don’t like it” | Clinical visit first. Refund is not the first tool. | Ryan, then Danielle if money |
| Chargeback | Pull consent, screening, Stripe, tracking. Pause refills until resolved. | Danielle |
| Partial subscription month | No refund for unused days unless Danielle writes a courtesy credit. | Danielle |

Do not keep medication money for an Rx that will not be written.

---

## 9. Affiliate / partner program

Public: [tryregenrx.com/affiliates](https://tryregenrx.com/affiliates)

- Code of Conduct **v2-2026-09-06**
- Cookie 30 days (`regen_aff`)
- Hold 14 days
- Payouts on the 15th, $100 minimum
- Referral fee only — never tied to a prescription
- Active window for tier: 45 days
- No $50 intake bonus

| Tier | Active patients | Rate on collected medication |
|---|---|---|
| Starter | 1–4 | 10% |
| Growth | 5–9 | 15% |
| Pro | 10–19 | 20% |
| Elite | 20+ | 25% |

Rate follows concurrent actives and can move up or down. Shipping is not commissioned. Danielle approves every partner in /ops/affiliates. Partners never see PHI. Illinois 21+ audience. No brand-name ads. No coupon sites. FTC #ad on every post.

---

## 10. Policies (SOP-00 to SOP-10)

**SOP-00 Onboarding.** Read this bible. Shadow one Today queue. Watch Ryan decline someone. Recite the non-negotiables. Sign: I will not prescribe, I will not promise a result, I will not put PHI in a text thread.

**SOP-01 Eligibility.** Confirm Illinois residency and adult status before checkout help. Affiliates: 21+. Out of state = spa menu or waitlist, not a “friend in Illinois” workaround.

**SOP-02 Intake & payment.** Patient completes start → screening → consent → Stripe. Staff may sit with them at the iPad. Staff does not fill medical answers for them. GORGEOUS20 is typed by the patient on the payment screen.

**SOP-03 Clinical review.** Only Ryan (or a covering Illinois-licensed prescriber Danielle has named in writing) clicks Approve. Four attestations must be true. Thin history = labs or video.

**SOP-04 Decline & refund.** Decline is a clinical act. Refund the medication charge the same business day. Give one next step. Do not let them re-enter a different start door to dodge the first chart.

**SOP-05 Pharmacy placement.** Formulation first. BoomRx backup for uncovered blends. Paste exact ticket names. Patients do not get pharmacy portal passwords.

**SOP-06 Portal & messages.** Reply in-app. Goal: same business day; four hours on clinical “I feel unwell.” Chest pain, severe allergy, suicidal talk: 911 / ER language immediately, then Ryan.

**SOP-07 Refills.** A paid refill is another consult. Auto-pay is not a standing order to ship if Ryan would not prescribe today.

**SOP-08 Safety events.** Document in the chart the same day. A licensed Illinois clinician decides hold / stop / ER. Danielle is told if it could become a complaint or pharmacy recall.

**SOP-09 Partners.** Danielle only. Code of Conduct v2. No PHI. No paying a partner for a specific Rx. Pause first, terminate for medical claims, minors, or brand bidding.

**SOP-10 Talking points.** Allowed: Illinois NP-directed, cash-pay, compounded not FDA-approved, A licensed Illinois clinician decides, shipping as shown at checkout, stacks are a request. Forbidden: “same as Ozempic guaranteed,” “you’ll lose X pounds,” “we always approve,” pharmacy brand names to patients, BoomRx in public copy.

---

## 11. Scripts

**Spa guest asks about peptides:** “That’s REGEN RX — A licensed Illinois clinician reviews every request. I can start you at tryregenrx.com/start or text you the link. It’s Illinois-only and not a guaranteed prescription.”

**They want a price on the phone:** “Published menus are on the site. Product plus cold shipping — $25 on most vials, $35 on curated stacks. If Ryan does not prescribe, we refund. I won’t quote a custom stack off the top of my head.”

**They want it faster:** “Ryan still has to review. I can see you in Today’s queue and make sure the chart is complete. I cannot skip the consult.”

**Partner asks for patient names:** “We can show you clicks and commissions. We never share who started which medication.”

**Refund ask after ship:** “Once the pharmacy has compounded and shipped, we don’t refund the vial. Ryan can review how you’re feeling and whether we continue. I’ll open your chart.”

---

## 12. What to expect — owner view

**Week 1.** Messy charts, people paying and disappearing, a few declines. That is success if Ryan’s notes are clean and refunds are same-day. Do not chase volume.

**Month 1.** Damara should run Today without Danielle in the room. Danielle only hits Partners, refunds, and exceptions.

**Month 2–3.** Refills start. This is where programs die if auto-pay ships without a look. Protect the refill review like a new consult.

**How you know it’s working.** Time-to-Ryan-review under 1–2 business days, every decline refunded, every approved order has a pharmacy id, messages answered, no BoomRx on the public site, partners on v2 only.

**Escalate to Danielle immediately.** Press, attorney letter, pharmacy recall, staff arguing with Ryan’s decline, a partner posting a dose, a minor in the funnel, a Stripe flood of chargebacks.

---

## 13. Weekly huddle and scoreboard

Fifteen minutes, Mondays. Danielle runs it. Damara brings the queue. Ryan brings anything clinical that scared him.

1. How many paid starts, approvals, labs, videos, declines last week?
2. Every decline — was the Stripe refund done the same day?
3. Every approval — does Orders have a pharmacy id and tracking?
4. Messages older than one business day?
5. Partners: new applications, anyone posting medical claims?
6. One thing we will not do this week.

**Owner scoreboard:** review under 2 business days · declines refunded 100% · pharmacy id before the patient asks · same-day “I feel unwell” · no BoomRx in public copy · partners on v2 only.

---

## Sign-off

I have read the REGEN RX Staff Bible v1 (September 6, 2026). I will follow SOP-00 through SOP-10. I understand that a request is a consult, compounded medication is not FDA-approved, and only Ryan (or a named covering prescriber) may approve a prescription.

Name _______________ Role _______________ Date _______________

Signature _______________ Trainer _______________ Danielle / Ryan initial _____
