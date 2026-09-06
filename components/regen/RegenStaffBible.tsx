"use client";

import type { ReactNode } from "react";

const PINK = "#E91E8C";
const TEAL = "#0D9488";
const BIBLE_HTML = "/staff/protocols/guides/REGEN-RX-Staff-Bible.html";

export function RegenStaffBible() {
  return (
    <article className="bible mx-auto max-w-3xl space-y-10 pb-24 text-white/90 print:max-w-none print:text-black">
      <style>{`
        @media print {
          nav, aside, .no-print { display: none !important; }
          .bible { color: #111 !important; }
          .bible h1, .bible h2, .bible h3 { color: #111 !important; break-after: avoid; }
          .bible section { break-inside: avoid; }
          .stamp { border: 2px solid #111 !important; box-shadow: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <header className="stamp rounded-3xl border-4 border-black bg-white p-8 text-black shadow-[8px_8px_0_0_rgba(233,30,140,0.35)]">
        <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: PINK }}>
          Internal · Staff only · v1 · September 6, 2026
        </p>
        <h1 className="mt-2 font-serif text-4xl font-black">REGEN RX Owner &amp; Staff Bible</h1>
        <p className="mt-3 text-sm font-medium text-black/70">
          How Danielle, Ryan, Damara, and the desk run a licensed Illinois telehealth program —
          portal, ops, pharmacy, money, partners, and the rules we do not bend.
        </p>
        <p className="mt-2 text-sm font-bold text-black/80">
          Teach from this. Print it. Save as PDF. New hires sign SOP-00 before they touch a queue.
        </p>
        <div className="no-print mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full px-5 py-2.5 text-sm font-black text-white"
            style={{ background: PINK }}
          >
            Print / Save as PDF
          </button>
          <a
            href={BIBLE_HTML}
            download="REGEN-RX-Staff-Bible.html"
            className="rounded-full border-2 border-black px-5 py-2.5 text-sm font-black"
          >
            Download HTML
          </a>
          <a
            href="/ops"
            className="rounded-full border-2 border-black px-5 py-2.5 text-sm font-black"
          >
            Back to Today
          </a>
        </div>
      </header>

      <nav className="rounded-2xl bg-white/5 p-5 text-sm leading-7 print:hidden">
        <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: TEAL }}>
          Teach in this order
        </p>
        {[
          ["1. Non-negotiables", "#nn"],
          ["2. Who does what", "#roles"],
          ["3. What REGEN RX is", "#what"],
          ["4. Patient journey", "#journey"],
          ["5. Daily ops", "#ops"],
          ["6. Patient portal", "#portal"],
          ["7. Orders & pharmacy", "#pharmacy"],
          ["8. Money, refunds, promos", "#money"],
          ["9. Affiliate program", "#affiliates"],
          ["10. Policies (SOP-00 to SOP-10)", "#sops"],
          ["11. Scripts", "#scripts"],
          ["12. What to expect", "#expect"],
          ["13. Weekly huddle & KPIs", "#huddle"],
        ].map(([label, href]) => (
          <a key={href} href={href} className="mr-4 underline decoration-white/20 hover:decoration-white">
            {label}
          </a>
        ))}
      </nav>

      <Section id="nn" kicker="01" title="Non-negotiables">
        <ul>
          <li>Illinois adults only. If they are not an Illinois resident, stop. Do not work around it.</li>
          <li>Ryan Kent, FNP-BC is the prescriber. Nobody else approves a prescription. Danielle and Damara move the queue. They do not write the Rx.</li>
          <li>A request is a consult — never a guaranteed prescription, dose, or result.</li>
          <li>Compounded medication is not FDA-approved. Say that. Never imply it is the same as a brand name.</li>
          <li>Patients never place an order at a pharmacy. Staff places after Ryan approves.</li>
          <li>Do not name the backup pharmacy to patients. Say “our licensed compounding pharmacy.” Staff may use Formulation / FormuConnect (default) and BoomRx (backup blends) internally.</li>
          <li>No diagnosis, no “this is your dose,” no outcome promises on the phone, in DMs, or on partner posts.</li>
          <li>No competitor dunking. Sell REGEN RX on our own process.</li>
          <li>PHI stays in the portal and ops. Never Slack, never group text, never a partner dashboard.</li>
          <li>If you did not review the chart, you do not click Approve.</li>
        </ul>
      </Section>

      <Section id="roles" kicker="02" title="Who does what">
        <table>
          <thead>
            <tr>
              <th>Person</th>
              <th>Owns</th>
              <th>Does not do</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Danielle — Owner</td>
              <td>Policy, partners, money, refund exceptions, staff training, brand voice</td>
              <td>Prescribe, invent a dose, approve a partner who skipped the Code</td>
            </tr>
            <tr>
              <td>Ryan Kent, FNP-BC — Prescriber</td>
              <td>Clinical yes/no, labs, video, dose, decline, off-label when indicated</td>
              <td>Paste pharmacy orders, run payouts, write affiliate ads</td>
            </tr>
            <tr>
              <td>Damara — Operations</td>
              <td>Today queue, pharmacy paste, tracking, messages, refill follow-up</td>
              <td>Override a decline, promise a ship date Ryan has not approved</td>
            </tr>
            <tr>
              <td>Front desk / spa staff</td>
              <td>Hand the flyer, QR to tryregenrx.com/start, book in-clinic consults, escalate</td>
              <td>Quote a custom price, collect PHI on paper “to be faster”</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-sm">
          Ops login is name + password at <code>tryregenrx.com/ops</code>. Approvals are audited to the person who signed in.
        </p>
      </Section>

      <Section id="what" kicker="03" title="What REGEN RX is">
        <p>
          REGEN RX is Hello Gorgeous PC’s cash-pay telehealth door: weight loss, hormones, peptides, vitamins,
          skincare, hair, intimacy, and curated stacks. Live site: <strong>tryregenrx.com</strong>. Phone{" "}
          <strong>(630) 636-6193</strong>. Clinic: 74 W. Washington St, Oswego, IL 60543.
        </p>
        <p className="mt-3">
          We are not a research-chem shop, not a nationwide Hims clone, and not insurance. Patients pay product +
          cold shipping as its own line. Formulation vial checkouts are{" "}
          <strong>$25 ship</strong>. Curated stacks (BoomRx sheet blends) are{" "}
          <strong>$35 ship</strong>. Shipping is never commissioned and GORGEOUS20 never discounts it.
        </p>
        <p className="mt-3 font-bold" style={{ color: TEAL }}>
          Pricing rule staff can do in their head: pharmacy wholesale × 2.5 = client product. 90-day product gets an extra 10% off the product only.
        </p>
      </Section>

      <Section id="journey" kicker="04" title="Patient journey — teach this until it is muscle memory">
        <ol>
          <li>
            <strong>Start</strong> — tryregenrx.com/start (goal + program). Promo GORGEOUS20 is entered on the Stripe
            payment screen, not as a fake “already 20% off” price.
          </li>
          <li>
            <strong>Screening + consent</strong> — they answer medical questions and sign. We tell them: if they do not
            qualify, they get a <strong>full refund</strong>.
          </li>
          <li>
            <strong>Pay</strong> — Stripe checkout. Payment is a consult deposit toward medication if prescribed. It is
            not a purchase of a specific vial yet.
          </li>
          <li>
            <strong>Ryan reviews</strong> — Today queue. Four boxes must be true before Approve: medical history,
            contraindications, telehealth is appropriate, and “I am Ryan and this is my decision.” Or: Need labs /
            Video / Decline.
          </li>
          <li>
            <strong>Damara places pharmacy</strong> — Formulation / FormuConnect first. BoomRx only when Formulation
            does not carry the line (recovery blends, etc.).
          </li>
          <li>
            <strong>Ship + portal</strong> — tracking in the patient account. Messages stay in-app.
          </li>
          <li>
            <strong>Refill</strong> — they return through the portal / start. Same clinical bar every month. Auto-pay
            does not mean auto-prescribe.
          </li>
        </ol>
      </Section>

      <Section id="ops" kicker="05" title="Daily ops — the board">
        <p>Bookmark these (tryregenrx.com, after ops login):</p>
        <ul>
          <li>
            <strong>Today</strong> /ops — needs-action queue. Act → attest four boxes → Approve / Labs / Video / Decline.
          </li>
          <li>
            <strong>Patients</strong> /ops/patients — search, open chart.
          </li>
          <li>
            <strong>Messages</strong> /ops/messages — same thread the patient sees in /account/messages.
          </li>
          <li>
            <strong>Orders</strong> /ops/orders — fulfillment + pharmacy id.
          </li>
          <li>
            <strong>Labs</strong> /ops/labs — requested / received.
          </li>
          <li>
            <strong>Payments</strong> /ops/payments — Stripe totals.
          </li>
          <li>
            <strong>Partners</strong> /ops/affiliates — approve, pause, terminate.
          </li>
          <li>
            <strong>Catalog / Calculator / Reconstitution / Tirzepatide</strong> — clinical math, never a patient-facing
            dose card.
          </li>
        </ul>
        <p className="mt-3 font-bold">Ryan’s morning (15–30 min):</p>
        <ol>
          <li>Today → Needs action.</li>
          <li>Open Chart. Read screening. If the story is thin, video or labs — do not guess.</li>
          <li>Check all four attest boxes only if they are true.</li>
          <li>Approve or decline. Write the note a lawyer could read in two years.</li>
        </ol>
        <p className="mt-3 font-bold">Damara’s morning:</p>
        <ol>
          <li>Approved without a pharmacy id → place the ticket, mark ordered.</li>
          <li>Shipped without tracking → add tracking, message the patient in-app.</li>
          <li>Unread messages older than 4 business hours → answer or escalate to Ryan.</li>
          <li>Partners tab Friday: pending applications to Danielle.</li>
        </ol>
      </Section>

      <Section id="portal" kicker="06" title="Patient portal — how we manage it">
        <p>
          Patients log in at tryregenrx.com/login. Their home is /account: dashboard, subscriptions, orders,
          prescriptions, messages, settings.
        </p>
        <ul>
          <li>They should see status in the portal before they have to call.</li>
          <li>Staff answers in /ops/messages — never a personal Gmail thread for clinical questions.</li>
          <li>If they email a photo of labs, Damara uploads to the chart and tells them in-app it was received.</li>
          <li>Subscription cancel: they can ask anytime. Cancel takes effect at the end of the paid period (see terms). Do not refund unused days unless SOP-04 says so.</li>
          <li>Password / lockout: Damara resets. Do not share a staff login with a patient “just this once.”</li>
        </ul>
      </Section>

      <Section id="pharmacy" kicker="07" title="Orders and pharmacy">
        <p>
          Default shipper is <strong>Formulation Rx via FormuConnect</strong>. Copy the Formulation ticket SKU, paste,
          then mark pharmacy ordered.{" "}
          <a className="underline" href="https://portal.formuconnect.com/login">
            portal.formuconnect.com
          </a>
        </p>
        <p className="mt-3">
          Backup: <strong>BoomRx</strong> for lines Formulation does not carry (BPC/TB stacks, sheet blends). Patients
          still hear “licensed compounding pharmacy.” Staff portal is internal only.
        </p>
        <p className="mt-3">
          Live pharmacy APIs stay off until Danielle turns them on. We copy-paste. We do not let a patient “order
          their own vial.”
        </p>
        <p className="mt-3">
          After ship: tracking number in Orders, one portal message: “Your medication left the pharmacy. Tracking is
          in your account.”
        </p>
      </Section>

      <Section id="money" kicker="08" title="Money, GORGEOUS20, refunds">
        <p>
          <strong>GORGEOUS20</strong> = 20% off the first medication order. Shipping excluded. Illinois only. Ryan
          still decides. Stripe coupon must exist as code GORGEOUS20.
        </p>
        <p className="mt-3">
          There is no refund button inside /ops/payments yet. Danielle or Damara refund in the{" "}
          <strong>REGEN Stripe Dashboard</strong>: Payments → search the patient email → the charge → Refund.
          Paste the Stripe refund id in the chart the same day.
        </p>
        <h3 className="mt-4 font-black">Refund policy we actually run</h3>
        <table>
          <thead>
            <tr>
              <th>Situation</th>
              <th>Action</th>
              <th>Who</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ryan declines before a prescription</td>
              <td>Full refund of the consult/medication charge. Keep a one-line note: reason + next step (PCP, in-clinic, wait).</td>
              <td>Danielle or Damara in Stripe. Same day.</td>
            </tr>
            <tr>
              <td>Duplicate charge / obvious Stripe error</td>
              <td>Full refund. Screenshot the Stripe id in the chart.</td>
              <td>Damara</td>
            </tr>
            <tr>
              <td>Patient cancels after pay, before Ryan reviews</td>
              <td>Full refund if no clinical work has started. If Ryan already reviewed, refund minus a documented admin decision by Danielle.</td>
              <td>Danielle</td>
            </tr>
            <tr>
              <td>Pharmacy already compounded / shipped</td>
              <td>No product refund. Shipping not refunded. Offer a clinical follow-up, not a “we’ll eat the vial.”</td>
              <td>Danielle + Ryan</td>
            </tr>
            <tr>
              <td>Side effect / they “don’t like it”</td>
              <td>Clinical visit first. Refund is not the first tool. Document. Ryan decides if they stop the med.</td>
              <td>Ryan, then Danielle if money</td>
            </tr>
            <tr>
              <td>Chargeback</td>
              <td>Pull consent, screening, Stripe, tracking. Respond in the Stripe window. Pause refills until resolved.</td>
              <td>Danielle</td>
            </tr>
            <tr>
              <td>Partial subscription month</td>
              <td>No refund for unused days (site terms). Courtesy credit only if Danielle writes it.</td>
              <td>Danielle</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-sm">
          Do not keep medication money for an Rx that will not be written. That is how we stay clean on good-faith
          exams.
        </p>
      </Section>

      <Section id="affiliates" kicker="09" title="Affiliate / partner program">
        <p>
          Public: tryregenrx.com/affiliates. Apply + Code of Conduct v2. Cookie 30 days. Hold 14 days. Payouts on the
          15th. $100 minimum. Referral fee only — never tied to a prescription.
        </p>
        <table>
          <thead>
            <tr>
              <th>Tier</th>
              <th>Active patients</th>
              <th>Rate on collected medication</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Starter</td>
              <td>1–4</td>
              <td>10%</td>
            </tr>
            <tr>
              <td>Growth</td>
              <td>5–9</td>
              <td>15%</td>
            </tr>
            <tr>
              <td>Pro</td>
              <td>10–19</td>
              <td>20%</td>
            </tr>
            <tr>
              <td>Elite</td>
              <td>20+</td>
              <td>25%</td>
            </tr>
          </tbody>
        </table>
        <ul>
          <li>Rate follows concurrent actives and can move up or down. Shipping is not commissioned.</li>
          <li>No $50 intake bonus. No money before REGEN RX actually collects medication revenue.</li>
          <li>Danielle approves every partner in /ops/affiliates. Pause or terminate for Code violations.</li>
          <li>Partners never see PHI. They see clicks, signups, and commission.</li>
          <li>Illinois 21+ audience. No brand-name ads. No coupon sites. FTC #ad on every post.</li>
        </ul>
      </Section>

      <Section id="sops" kicker="10" title="Policies — print these, staff initials the last page">
        <Sop n="00" title="Onboarding">
          Read this bible. Shadow one Today queue. Watch Ryan decline someone. Recite the non-negotiables out loud.
          Sign: I will not prescribe, I will not promise a result, I will not put PHI in a text thread.
        </Sop>
        <Sop n="01" title="Eligibility">
          Confirm Illinois residency and adult status before checkout help. Affiliates: 21+. If they are out of state,
          offer the spa menu or a future waitlist — not a “friend in Illinois” workaround.
        </Sop>
        <Sop n="02" title="Intake &amp; payment">
          Patient completes start → screening → consent → Stripe. Staff may sit with them at the iPad. Staff does not
          fill medical answers for them. GORGEOUS20 is typed by the patient on the payment screen.
        </Sop>
        <Sop n="03" title="Clinical review">
          Only Ryan (or a covering Illinois-licensed prescriber Danielle has named in writing) clicks Approve. Four
          attestations must be true. Thin history = labs or video. Off-label is allowed when Ryan documents why.
        </Sop>
        <Sop n="04" title="Decline &amp; refund">
          Decline is a clinical act. Refund the medication charge the same business day. Give one next step. Do not
          let them re-enter a different start door to dodge the decline without Ryan seeing the first chart.
        </Sop>
        <Sop n="05" title="Pharmacy placement">
          Formulation first. BoomRx backup for uncovered blends. Paste exact ticket names. Mark ordered. Patients do
          not get portal passwords to pharmacies.
        </Sop>
        <Sop n="06" title="Portal &amp; messages">
          Reply in-app. Goal: same business day, four hours on clinical “I feel unwell.” Anything chest pain, severe
          allergy, suicidal talk: 911 / ER language immediately, then Ryan.
        </Sop>
        <Sop n="07" title="Refills">
          A paid refill is another consult. Check adherence, side effects, weight/labs as indicated. Auto-pay is not
          a standing order to ship if Ryan would not prescribe today.
        </Sop>
        <Sop n="08" title="Safety events">
          Document in the chart the same day. Ryan decides hold / stop / ER. Danielle is told if it could become a
          complaint or pharmacy recall. We do not argue with an emergency department on Instagram.
        </Sop>
        <Sop n="09" title="Partners">
          Danielle only. Code of Conduct v2. No PHI. No paying a partner for a specific Rx. Pause first, terminate
          for medical claims, minors, or brand bidding.
        </Sop>
        <Sop n="10" title="Talking points">
          Allowed: Illinois NP-directed, cash-pay, compounded not FDA-approved, Ryan decides, shipping as shown at
          checkout ($25 Formulation vials / $35 stacks), stacks are a request. Forbidden: “same as Ozempic
          guaranteed,” “you’ll lose X pounds,” “we always approve,” pharmacy brand names to patients, BoomRx in
          public copy.
        </Sop>
      </Section>

      <Section id="scripts" kicker="11" title="Scripts — say this">
        <p>
          <strong>Spa guest asks about peptides:</strong> “That’s REGEN RX — Ryan reviews every request. I can start
          you at tryregenrx.com/start or text you the link. It’s Illinois-only and not a guaranteed prescription.”
        </p>
        <p className="mt-3">
          <strong>They want a price on the phone:</strong> “Published menus are on the site. Product plus cold
          shipping — $25 on most vials, $35 on curated stacks. If Ryan does not prescribe, we refund. I won’t quote
          a custom stack off the top of my head.”
        </p>
        <p className="mt-3">
          <strong>They want it faster:</strong> “Ryan still has to review. I can see you in Today’s queue and make
          sure the chart is complete. I cannot skip the consult.”
        </p>
        <p className="mt-3">
          <strong>Partner asks for patient names:</strong> “We can show you clicks and commissions. We never share
          who started which medication. That’s the law and the program.”
        </p>
        <p className="mt-3">
          <strong>Refund ask after ship:</strong> “Once the pharmacy has compounded and shipped, we don’t refund the
          vial. Ryan can review how you’re feeling and whether we continue. I’ll open your chart.”
        </p>
      </Section>

      <Section id="expect" kicker="12" title="What to expect — owner view">
        <p>
          <strong>Week 1:</strong> Messy charts, people paying and disappearing, a few declines. That is success if
          Ryan’s notes are clean and refunds are same-day. Do not chase volume.
        </p>
        <p className="mt-3">
          <strong>Month 1:</strong> Damara should be able to run Today without Danielle in the room. Danielle only
          hits Partners, refunds, and exceptions. You will find one pharmacy paste error — that’s why we mark ordered
          only after the portal confirms.
        </p>
        <p className="mt-3">
          <strong>Month 2–3:</strong> Refills start. This is where programs die if auto-pay ships without a look.
          Protect the refill review like a new consult.
        </p>
        <p className="mt-3">
          <strong>How you know it’s working:</strong> time-to-Ryan-review under 1–2 business days, every decline
          refunded, every approved order has a pharmacy id, messages answered, no BoomRx on the public site, partners
          on v2 only.
        </p>
        <p className="mt-3">
          <strong>Escalate to Danielle immediately:</strong> press, attorney letter, pharmacy recall, staff arguing
          with Ryan’s decline, a partner posting a dose, a minor in the funnel, a Stripe flood of chargebacks.
        </p>
      </Section>

      <Section id="huddle" kicker="13" title="Weekly huddle and how you know you are winning">
        <p>
          Fifteen minutes, Mondays. Danielle runs it. Damara brings the queue. Ryan brings anything clinical that
          scared him.
        </p>
        <ol>
          <li>How many paid starts, approvals, labs, videos, declines last week?</li>
          <li>Every decline — was the Stripe refund done the same day?</li>
          <li>Every approval — does Orders have a pharmacy id and tracking?</li>
          <li>Messages older than one business day?</li>
          <li>Partners: new applications, anyone posting medical claims?</li>
          <li>One thing we will not do this week (usually: invent a price, skip a video, name BoomRx).</li>
        </ol>
        <p className="mt-3 font-bold">Owner scoreboard (keep this boring on purpose):</p>
        <ul>
          <li>Time from paid start → Ryan decision: under 2 business days.</li>
          <li>Declines refunded: 100%.</li>
          <li>Approved orders with a pharmacy id before the patient has to ask: 100%.</li>
          <li>In-app clinical “I feel unwell” answered the same day.</li>
          <li>No BoomRx, no dose promises, no competitor dunking on any public surface.</li>
          <li>Partners only on Code of Conduct v2. Active-patient tier is honest.</li>
        </ul>
      </Section>

      <section className="stamp rounded-3xl border-4 border-black bg-white p-8 text-black">
        <h2 className="font-serif text-2xl font-black">Sign-off</h2>
        <p className="mt-2 text-sm text-black/70">
          I have read the REGEN RX Staff Bible v1 (September 6, 2026). I will follow SOP-00 through SOP-10. I
          understand that a request is a consult, compounded medication is not FDA-approved, and only Ryan (or a
          named covering prescriber) may approve a prescription.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p>
            Name _______________________
            <br />
            Role _______________________
            <br />
            Date _______________________
          </p>
          <p>
            Signature __________________
            <br />
            Trainer ____________________
            <br />
            Danielle / Ryan initial _____
          </p>
        </div>
      </section>
    </article>
  );
}

function Section({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: TEAL }}>
        {kicker}
      </p>
      <h2 className="mb-4 font-serif text-3xl font-black text-white print:text-black">{title}</h2>
      <div className="space-y-2 text-[15px] leading-relaxed [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_li]:ml-5 [&_li]:list-disc [&_li]:py-0.5 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol_li]:list-decimal [&_table]:mt-3 [&_table]:w-full [&_table]:text-left [&_table]:text-sm [&_td]:border-b [&_td]:border-white/10 [&_td]:py-2 [&_td]:pr-3 [&_th]:border-b [&_th]:border-white/20 [&_th]:py-2 [&_th]:pr-3">
        {children}
      </div>
    </section>
  );
}

function Sop({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="mb-4 rounded-2xl border border-white/15 bg-white/5 p-4">
      <p className="font-black" style={{ color: PINK }}>
        SOP-{n} · {title}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-white/80 print:text-black">{children}</p>
    </div>
  );
}
