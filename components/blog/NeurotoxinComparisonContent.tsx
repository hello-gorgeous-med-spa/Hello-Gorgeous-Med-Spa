"use client";

import Link from "next/link";
import { useCallback, useState, type ReactNode } from "react";

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import { SITE } from "@/lib/seo";

const PHONE_DISPLAY = "(630) 636-6193";
const PHONE_TEL = "tel:+16306366193";
const ADDRESS = "74 W. Washington Street, Oswego, IL 60543";

type HighlightCol = "1" | "2" | "3" | "5" | "6" | null;

export function NeurotoxinComparisonContent() {
  const [on, setOn] = useState<HighlightCol>(null);

  const toggle = useCallback((col: Exclude<HighlightCol, null>) => {
    setOn((prev) => (prev === col ? null : col));
  }, []);

  return (
    <div className="ntx">
      <header className="hero">
        <div className="wrap">
          <p className="eyebrow">Treatments compared · Oswego, IL</p>
          <h1>Six wrinkle relaxers, honestly compared</h1>
          <p className="dek">
            Botox, Dysport, Xeomin, Jeuveau, Daxxify and Letybo are all FDA-approved, all use the
            same underlying molecule, and all work the same way. The differences are real but
            smaller than the marketing suggests — here&apos;s exactly where they diverge.
          </p>
          <div className="byline">
            <span>
              Reviewed by {PRESCRIBING_NP.displayName} · Medical Director {MEDICAL_DIRECTOR.displayName}
            </span>
            <span>·</span>
            <span>10 min read</span>
            <span>·</span>
            <span>Verified August 2026</span>
          </div>
        </div>
      </header>

      <section className="trap">
        <div className="wide">
          <p className="eyebrow" style={{ color: "#BBB0C6" }}>
            Read this before you price-shop
          </p>
          <h2>A &ldquo;unit&rdquo; means something different in every brand</h2>
          <p>
            This is the most useful thing on this page. Units are <strong>not</strong> a standard
            measure of strength — each product has its own scale, set by its own manufacturer.
            Comparing price per unit between two brands tells you nothing at all.
          </p>
          <div className="maths">
            <div>
              <b>Botox</b>
              <span>~20 units for frown lines, at a higher price per unit</span>
            </div>
            <div className="eq">≈</div>
            <div>
              <b>Dysport</b>
              <span>~50–60 units for the same area, at a lower price per unit</span>
            </div>
          </div>
          <p>
            Dysport looks dramatically cheaper per unit and lands in roughly the same place per
            treatment. A clinic advertising &ldquo;$8 a unit&rdquo; may cost you more than one
            advertising &ldquo;$14 a unit,&rdquo; depending entirely on which product is in the
            syringe.
          </p>
          <p>
            <strong>Ask for the price of treating your area, not the price per unit.</strong> That
            is the only number that compares.
          </p>
        </div>
      </section>

      <section className="tablewrap">
        <div className="full">
          <p className="eyebrow" style={{ textAlign: "center" }}>
            All six, side by side
          </p>
          <div className="chips" role="group" aria-label="Highlight by priority">
            <Chip col="1" on={on} toggle={toggle}>
              Longest track record
            </Chip>
            <Chip col="2" on={on} toggle={toggle}>
              Fastest onset
            </Chip>
            <Chip col="3" on={on} toggle={toggle}>
              Fewest additives
            </Chip>
            <Chip col="5" on={on} toggle={toggle}>
              Longest lasting
            </Chip>
            <Chip col="6" on={on} toggle={toggle}>
              Newest option
            </Chip>
          </div>
          <p className="hint">
            Tap a priority to highlight the product that leads on it. Scroll the table sideways to
            see every column.
          </p>
          <div className="scroller">
            <table className="cmp">
              <colgroup>
                <col />
                <col className={on === "1" ? "on" : undefined} />
                <col className={on === "2" ? "on" : undefined} />
                <col className={on === "3" ? "on" : undefined} />
                <col />
                <col className={on === "5" ? "on" : undefined} />
                <col className={on === "6" ? "on" : undefined} />
              </colgroup>
              <thead>
                <tr>
                  <th />
                  <th>
                    Botox<small>Cosmetic</small>
                  </th>
                  <th>
                    Dysport<small>Galderma</small>
                  </th>
                  <th>
                    Xeomin<small>Merz</small>
                  </th>
                  <th>
                    Jeuveau<small>Evolus</small>
                  </th>
                  <th>
                    Daxxify<small>Revance</small>
                  </th>
                  <th>
                    Letybo<small>Hugel</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Active ingredient</th>
                  <td>onabotulinumtoxinA</td>
                  <td>abobotulinumtoxinA</td>
                  <td>incobotulinumtoxinA</td>
                  <td>prabotulinumtoxinA</td>
                  <td>daxibotulinumtoxinA</td>
                  <td>letibotulinumtoxinA</td>
                </tr>
                <tr>
                  <th>FDA approval (cosmetic)</th>
                  <td className="win">2002</td>
                  <td>2009</td>
                  <td>2011</td>
                  <td>2019</td>
                  <td>2022</td>
                  <td className="win">Feb 2024</td>
                </tr>
                <tr>
                  <th>Typical onset</th>
                  <td>3–5 days</td>
                  <td className="win">2–3 days</td>
                  <td>3–5 days</td>
                  <td className="win">2–3 days</td>
                  <td>3–5 days</td>
                  <td>3–5 days</td>
                </tr>
                <tr>
                  <th>Typical duration</th>
                  <td>3–4 months</td>
                  <td>3–4 months</td>
                  <td>3–4 months</td>
                  <td>3–4 months</td>
                  <td className="win">~6 months in trials</td>
                  <td>3–4 months</td>
                </tr>
                <tr>
                  <th>Units vs Botox</th>
                  <td>1:1 (the baseline)</td>
                  <td>~2.5–3 units per 1</td>
                  <td>≈1:1</td>
                  <td>≈1:1</td>
                  <td>Own scale — 40u vs 20u for frown lines</td>
                  <td>≈1:1</td>
                </tr>
                <tr>
                  <th>Formulation</th>
                  <td>Toxin + accessory proteins</td>
                  <td>Smaller protein complexes</td>
                  <td className="win">&ldquo;Naked&rdquo; — no accessory proteins</td>
                  <td>Accessory proteins, closest to Botox</td>
                  <td>Peptide-stabilised; no human or animal-derived components</td>
                  <td>Accessory proteins</td>
                </tr>
                <tr>
                  <th>How it spreads</th>
                  <td>Moderate, predictable</td>
                  <td>Wider — suits large areas</td>
                  <td>Precise</td>
                  <td>Similar to Botox</td>
                  <td>Similar to Botox</td>
                  <td>Similar to Botox</td>
                </tr>
                <tr>
                  <th>
                    Also approved for
                    <br />
                    (beyond wrinkles)
                  </th>
                  <td className="win">Migraine, excess sweating, bladder, muscle spasticity and more</td>
                  <td>Muscle spasticity, cervical dystonia</td>
                  <td>Blepharospasm, cervical dystonia, drooling, spasticity</td>
                  <td>Cosmetic use only</td>
                  <td>Cervical dystonia</td>
                  <td>Frown lines (US)</td>
                </tr>
                <tr>
                  <th>Loyalty programme</th>
                  <td>Allē</td>
                  <td>ASPIRE</td>
                  <td>Xperience</td>
                  <td>Evolus Rewards</td>
                  <td>Ask at consult</td>
                  <td>N/A — we do not carry Letybo</td>
                </tr>
                <tr>
                  <th>Known abroad as</th>
                  <td>Vistabel, Botox Cosmetic</td>
                  <td>Azzalure, Dysport</td>
                  <td>Bocouture, Xeomin</td>
                  <td>Nuceiva, Nabota</td>
                  <td>Daxxify</td>
                  <td>Letybo, Botulax</td>
                </tr>
                <tr>
                  <th>Often chosen for</th>
                  <td>First-timers; the most predictable option</td>
                  <td>Forehead and other broad areas; speed</td>
                  <td>Minimal-additive preference; precision work</td>
                  <td>Cosmetic-only patients; often priced below Botox</td>
                  <td>Fewer appointments per year</td>
                  <td>A straightforward, often lower-cost swap for Botox</td>
                </tr>
                <tr>
                  <th>We currently carry</th>
                  <td className="win">Yes</td>
                  <td className="win">Yes</td>
                  <td className="win">Yes</td>
                  <td className="win">Yes</td>
                  <td className="win">Yes</td>
                  <td>Not currently</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="hint" style={{ marginTop: "1.25rem" }}>
            Onset and duration are typical ranges, not promises — both vary with dose, treatment
            area and individual metabolism. Individual results vary.
          </p>
        </div>
      </section>

      <main className="wrap">
        <h2>What each one is actually like</h2>
        <div className="prods">
          <Prod
            name="Botox Cosmetic"
            gen="onabotulinumtoxinA · AbbVie"
            href="/botox-oswego"
            body="The original and still the reference point everything else is measured against. Approved for cosmetic use since 2002, with by far the widest range of medical approvals — migraine, excess sweating, bladder conditions and more. Nothing has a longer real-world track record."
            consider="You want the most predictable, best-documented option"
            elsewhere="You want longer between appointments, or a lower price"
          />
          <Prod
            name="Dysport"
            gen="abobotulinumtoxinA · Galderma"
            href="/dysport-oswego"
            body="Often described as the fastest to kick in, and it spreads a little more widely through tissue — which is an advantage across a broad forehead and a reason for care near delicate areas. Its units run on a different scale, roughly 2.5 to 3 to one against Botox."
            consider="You're treating a large area, or want it working sooner"
            elsewhere="You want the tightest possible control in a small area"
          />
          <Prod
            name="Xeomin"
            gen="incobotulinumtoxinA · Merz"
            href="/xeomin-oswego-il"
            body='The "naked" toxin — purified, with the accessory proteins stripped out. The theory is that fewer proteins means less for the immune system to react to, which matters for the small number of long-term patients who find results fading over years. Worth knowing the evidence here is more nuanced than the marketing.'
            consider="You've used toxin for years and feel it works less well"
            elsewhere="You want the longest duration"
          />
          <Prod
            name="Jeuveau"
            gen="prabotulinumtoxinA · Evolus"
            href="/jeuveau-oswego"
            body='Sometimes marketed as "Newtox." Formulated closest to Botox of any alternative and dosed on essentially the same scale, so it is the most direct swap. It is the only one in the group approved for cosmetic use alone — no medical indications.'
            consider="You like Botox but want a lower price for similar behaviour"
            elsewhere="You're being treated for migraine or sweating too"
          />
          <Prod
            name="Daxxify"
            gen="daxibotulinumtoxinA · Revance"
            href="/daxxify-oswego-il"
            body="The long one. Stabilised with a synthetic peptide rather than proteins from human or animal sources, and the trial data showed a median duration around six months — roughly double the rest. It costs more per visit, and you may need fewer visits. Its unit scale is entirely its own."
            consider="Fewer appointments a year is worth more to you than a lower price"
            elsewhere="You're new to toxin — six months is a long time to live with a result you're unsure about"
          />
          <Prod
            name="Letybo"
            gen="letibotulinumtoxinA · Hugel"
            body="The newest arrival, FDA-approved in February 2024, and already the leading toxin in South Korea before it reached the US. Dosed roughly one-to-one with Botox and generally positioned on price. Trial data supports it as a genuine peer; what it lacks is years of US real-world familiarity. We do not currently carry Letybo in Oswego."
            consider="You want a like-for-like alternative at a better price — ask us if that changes"
            elsewhere="You'd rather have the longest track record"
          />
        </div>

        <div className="callout rose">
          <h3>The honest summary</h3>
          <p>
            For most people, in most areas, all six produce broadly similar results when the dose
            and the technique are right. The differences that genuinely change your experience are
            duration (Daxxify), onset and spread (Dysport), and price. Everything else is closer to
            branding than pharmacology.
          </p>
          <p style={{ marginBottom: 0 }}>
            <strong>Your injector&apos;s skill matters more than which vial they open.</strong>{" "}
            Placement, dosing and understanding your anatomy account for far more of your result
            than the brand on the label.
          </p>
        </div>

        <h2>How to actually choose</h2>
        <div className="pick">
          <div>
            <b>Never had it before</b>
            <span>
              Start with something that lasts three to four months. If you don&apos;t love it,
              you&apos;re not living with it for half a year. Botox, Jeuveau or Xeomin are all
              sensible first steps here.
            </span>
          </div>
          <div>
            <b>You hate how often you&apos;re back</b>
            <span>Daxxify is the reason it exists. Higher cost per visit, fewer visits.</span>
          </div>
          <div>
            <b>Treating a wide forehead</b>
            <span>Dysport&apos;s broader spread can give a smoother, more even result across a large area.</span>
          </div>
          <div>
            <b>You have an event soon</b>
            <span>
              Dysport and Jeuveau tend to show earlier — but book at least two weeks out regardless,
              for any brand.
            </span>
          </div>
          <div>
            <b>It used to work better than it does now</b>
            <span>
              Worth a conversation about Xeomin, and about whether dose or placement is the real
              issue.
            </span>
          </div>
          <div>
            <b>You&apos;re also treated for migraine or sweating</b>
            <span>Botox has the widest medical approvals, and there may be a reason to stay consistent.</span>
          </div>
          <div>
            <b>Budget is the deciding factor</b>
            <span>
              Ask for the price per area across brands, and ask about loyalty programmes — the
              rebates are meaningful over a year.
            </span>
          </div>
        </div>

        <div className="callout watch">
          <h3>Switching brands is normal — tell us if you do</h3>
          <p>
            There&apos;s no medical reason you can&apos;t move between products, and plenty of people
            do. Two things matter when you switch: your injector needs to know what you had, how
            much, and how you responded, and you shouldn&apos;t judge the new one until it&apos;s had
            a full two weeks.
          </p>
          <p style={{ marginBottom: 0 }}>
            If you&apos;ve been treated elsewhere, bring the details — the product name and units
            used, if you have them. Guessing is how people end up over- or under-treated after a
            switch.
          </p>
        </div>

        <h2>What&apos;s coming next</h2>
        <p>
          Two products get talked about a lot and neither is available in the US yet. Both were held
          up in 2026 over manufacturing paperwork rather than anything to do with safety or whether
          they work.
        </p>
        <ul>
          <li>
            <strong>Relfydess</strong> (relabotulinumtoxinA, Galderma) — the first ready-to-use
            liquid toxin, so there&apos;s no mixing step. Already approved across Europe, Australia
            and elsewhere, and still working through US review.
          </li>
          <li>
            <strong>TrenibotE</strong> (AbbVie) — a genuinely different animal: a type E toxin rather
            than type A, reported to start working within about a day and to fade in two to three
            weeks. Designed as a way to try a wrinkle relaxer without committing to months.
          </li>
        </ul>
        <p>
          You may also see <strong>Myobloc</strong> mentioned. It&apos;s a type B toxin used for
          medical conditions such as cervical dystonia and drooling, not for cosmetic treatment.
        </p>

        <div className="callout" style={{ background: "var(--urgent-soft)" }}>
          <h3 style={{ color: "var(--urgent)" }}>One thing that matters more than brand</h3>
          <p>
            Counterfeit and unapproved toxin is a real problem, and the FDA has warned about harm
            from fake or mishandled product. Whichever brand you choose, ask where it was purchased,
            ask to see the vial, and be sceptical of pricing that seems too good to be true.
          </p>
          <p style={{ marginBottom: 0 }}>
            Every product on this page is prescription-only and should be administered by a
            qualified, licensed injector following an in-person assessment — in a clinical setting,
            not at a party or a pop-up. At Hello Gorgeous that means {PRESCRIBING_NP.displayName}{" "}
            on site, under Medical Director {MEDICAL_DIRECTOR.displayName}.
          </p>
        </div>

        <div className="cta">
          <h2>Not sure which is right for you?</h2>
          <p>
            Bring your history and your priorities — speed, duration, budget — and we&apos;ll tell
            you honestly which of the products we carry fits.
          </p>
          <Link className="btn" href={PRIMARY_BOOKING_CTA.href}>
            {PRIMARY_BOOKING_CTA.label}
          </Link>
          <p style={{ marginTop: "1rem", marginBottom: 0, fontSize: "0.9rem" }}>
            <a href={PHONE_TEL}>{PHONE_DISPLAY}</a> · {ADDRESS}
          </p>
        </div>

        <h2>Common questions</h2>
        <details>
          <summary>Is one of these actually better than the others?</summary>
          <p>
            Not universally. All six are FDA-approved, all use botulinum toxin type A, and all work
            by the same mechanism. Head-to-head, results are broadly comparable when dosing and
            technique are appropriate. Where they genuinely differ is duration, onset, spread and
            price — so &ldquo;better&rdquo; depends on which of those matters most to you.
          </p>
        </details>
        <details>
          <summary>Why is one clinic&apos;s price per unit so much lower?</summary>
          <p>
            Usually because it&apos;s a different product with a different unit scale. Dysport needs
            roughly two and a half to three times as many units as Botox for the same area, so its
            per-unit price is naturally much lower while the total is similar. Always compare the
            cost of treating your area, not the per-unit figure.
          </p>
        </details>
        <details>
          <summary>Can I switch from Botox to something else?</summary>
          <p>
            Yes, and it&apos;s common. Your injector will convert the dose rather than matching unit
            for unit, since the scales differ between products. Tell them exactly what you had before
            and how you responded, and give the new product a full two weeks before judging it.
          </p>
        </details>
        <details>
          <summary>Does Daxxify really last six months?</summary>
          <p>
            The trial data showed a median of around six months, which is roughly double the others
            — but a median means half of people got less. Real-world experience varies, and it costs
            more per treatment. Individual results vary. It&apos;s a strong option if you&apos;re
            tired of quarterly appointments, and a poor first choice if you&apos;ve never had toxin
            before.
          </p>
        </details>
        <details>
          <summary>What if my toxin has stopped working?</summary>
          <p>
            A few possibilities, and brand is only one. Dose may be too low for your muscle strength,
            placement may need adjusting, or you may be judging it too early. A small number of
            long-term patients do develop resistance, which is where Xeomin&apos;s protein-free
            formulation comes into the conversation. Worth assessing properly rather than just
            switching brands and hoping.
          </p>
        </details>
        <details>
          <summary>Are the loyalty programmes worth joining?</summary>
          <p>
            If you treat regularly, yes — the rebates add up meaningfully over a year. The catch is
            that each one is tied to a manufacturer, so points follow the brand rather than you. If
            you expect to switch products often, that&apos;s worth factoring in.
          </p>
        </details>
        <details>
          <summary>Which ones can I get at Hello Gorgeous in Oswego?</summary>
          <p>
            We currently carry Botox, Dysport, Xeomin, Jeuveau, and Daxxify. We do not currently
            carry Letybo. {PRESCRIBING_NP.displayName} is on site six days a week at {ADDRESS}.{" "}
            {SITE.name} also has a shorter three-brand walkthrough at{" "}
            <Link href="/botox-vs-dysport-vs-jeuveau">Botox vs Dysport vs Jeuveau</Link>.
          </p>
        </details>

        <p className="note">
          <strong>A note on this article.</strong> This is general information to help you have a
          better conversation at your consultation. It isn&apos;t medical advice and can&apos;t
          substitute for being assessed in person. All products discussed are prescription medicines;
          suitability, product choice and dosing are decisions for a qualified clinician who has
          examined you. Onset, duration and results vary between individuals. Brand names are
          trademarks of their respective manufacturers, and we have no commercial relationship with
          any of them beyond purchasing product. Information verified August 2026. Last reviewed by{" "}
          {PRESCRIBING_NP.displayName}, with physician oversight by {MEDICAL_DIRECTOR.displayName}.
        </p>
      </main>

      <style jsx global>{`
        .ntx {
          --veil: #f4f2f7;
          --surface: #ffffff;
          --ink: #2a2233;
          --muted: #6e6478;
          --rule: #e3ddea;
          --rose: #a34e5e;
          --rose-soft: #f7edef;
          --expected: #3f7a63;
          --expected-soft: #eaf2ee;
          --watch: #8f6013;
          --watch-soft: #faf1df;
          --urgent: #a33a33;
          --urgent-soft: #fbedec;
          --measure: 34rem;
          background: var(--veil);
          color: var(--ink);
          font-size: 1.0625rem;
          line-height: 1.72;
        }
        .ntx .wrap {
          max-width: var(--measure);
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .ntx .wide {
          max-width: 52rem;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .ntx .full {
          max-width: 70rem;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .ntx h1,
        .ntx h2,
        .ntx h3 {
          font-family: var(--font-playfair), Georgia, serif;
          font-weight: 400;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .ntx h1 {
          font-size: clamp(2.2rem, 5.6vw, 3.5rem);
          line-height: 1.05;
        }
        .ntx h2 {
          font-size: clamp(1.75rem, 4vw, 2.4rem);
          line-height: 1.14;
          margin: 3.5rem 0 0.9rem;
        }
        .ntx h3 {
          font-size: 1.28rem;
          line-height: 1.25;
          margin: 0 0 0.4rem;
        }
        .ntx p {
          margin: 0 0 1.15rem;
        }
        .ntx a {
          color: var(--rose);
          text-underline-offset: 3px;
        }
        .ntx .eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.19em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 1rem;
        }
        .ntx .dek {
          font-size: 1.2rem;
          line-height: 1.6;
          color: var(--muted);
          margin: 1.4rem 0 0;
        }
        .ntx header.hero {
          background: var(--surface);
          border-bottom: 1px solid var(--rule);
          padding: 4.5rem 0 3rem;
        }
        .ntx .byline {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          font-size: 0.8rem;
          color: var(--muted);
          margin-top: 2rem;
          padding-top: 1.1rem;
          border-top: 1px solid var(--rule);
        }
        .ntx .trap {
          background: var(--ink);
          color: var(--veil);
          padding: 3rem 0;
        }
        .ntx .trap h2 {
          color: var(--surface);
          margin: 0 0 1rem;
          font-size: clamp(1.6rem, 3.4vw, 2.1rem);
        }
        .ntx .trap p {
          color: #c4bace;
          margin: 0 0 1rem;
        }
        .ntx .trap p:last-child {
          margin: 0;
        }
        .ntx .trap .maths {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 1.5rem;
          align-items: center;
          margin: 2rem 0;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 1rem;
        }
        .ntx .trap .maths b {
          font-family: var(--font-playfair), Georgia, serif;
          font-weight: 400;
          font-size: 1.5rem;
          color: #fff;
          display: block;
          line-height: 1.2;
        }
        .ntx .trap .maths span {
          font-size: 0.9rem;
          color: #bbb0c6;
          display: block;
          margin-top: 0.3rem;
        }
        .ntx .trap .eq {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.6rem;
          color: var(--rose);
          text-align: center;
        }
        .ntx .tablewrap {
          background: var(--surface);
          padding: 3rem 0;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }
        .ntx .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin: 0 0 0.5rem;
        }
        .ntx .chip {
          font: inherit;
          font-size: 0.83rem;
          font-weight: 600;
          padding: 0.45rem 1rem;
          border-radius: 2rem;
          border: 1.5px solid var(--rule);
          background: var(--surface);
          color: var(--muted);
          cursor: pointer;
        }
        .ntx .chip:hover {
          border-color: var(--rose);
          color: var(--rose);
        }
        .ntx .chip[aria-pressed="true"] {
          background: var(--rose);
          border-color: var(--rose);
          color: #fff;
        }
        .ntx .hint {
          font-size: 0.78rem;
          color: var(--muted);
          text-align: center;
          margin: 0.9rem 0 1.5rem;
        }
        .ntx .scroller {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .ntx table.cmp {
          border-collapse: collapse;
          font-size: 0.87rem;
          min-width: 60rem;
          width: 100%;
        }
        .ntx table.cmp th,
        .ntx table.cmp td {
          text-align: left;
          padding: 0.8rem 0.85rem;
          border-bottom: 1px solid var(--rule);
          vertical-align: top;
          line-height: 1.5;
        }
        .ntx table.cmp thead th {
          font-family: var(--font-playfair), Georgia, serif;
          font-weight: 400;
          font-size: 1.3rem;
          border-bottom: 2px solid var(--ink);
          position: sticky;
          top: 0;
          background: var(--surface);
          z-index: 2;
        }
        .ntx table.cmp thead th small {
          display: block;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 0.15rem;
          font-family: inherit;
        }
        .ntx table.cmp tbody th {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--muted);
          width: 12rem;
          position: sticky;
          left: 0;
          background: var(--surface);
          z-index: 1;
        }
        .ntx table.cmp tbody tr:nth-child(even) th,
        .ntx table.cmp tbody tr:nth-child(even) td {
          background: #fbfafc;
        }
        .ntx table.cmp col.on {
          background: var(--rose-soft) !important;
        }
        .ntx table.cmp td.win {
          font-weight: 700;
          color: var(--rose);
        }
        .ntx .prods {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin: 2rem 0;
        }
        .ntx .prod {
          background: var(--surface);
          border: 1px solid var(--rule);
          border-radius: 1rem;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .ntx .prod::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--rose);
        }
        .ntx .prod h3 {
          margin-bottom: 0.1rem;
        }
        .ntx .prod .gen {
          font-size: 0.74rem;
          letter-spacing: 0.06em;
          color: var(--muted);
          margin-bottom: 0.8rem;
          font-style: italic;
        }
        .ntx .prod p {
          font-size: 0.95rem;
          margin-bottom: 0.8rem;
        }
        .ntx .prod .split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          font-size: 0.87rem;
          border-top: 1px solid var(--rule);
          padding-top: 0.85rem;
        }
        .ntx .prod .split b {
          display: block;
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.15rem;
        }
        .ntx .callout {
          border-radius: 1.25rem;
          padding: 1.8rem;
          margin: 2rem 0;
        }
        .ntx .callout.rose {
          background: var(--rose-soft);
        }
        .ntx .callout.watch {
          background: var(--watch-soft);
        }
        .ntx .callout h2,
        .ntx .callout h3 {
          margin-top: 0;
        }
        .ntx .callout p:last-child,
        .ntx .callout ul:last-child {
          margin-bottom: 0;
        }
        .ntx ul {
          padding-left: 1.15rem;
          margin: 0 0 1.15rem;
        }
        .ntx li {
          margin-bottom: 0.5rem;
        }
        .ntx .pick {
          border-left: 2px solid var(--rule);
          padding-left: 1.6rem;
          margin: 1.75rem 0;
        }
        .ntx .pick div {
          position: relative;
          padding-bottom: 1.3rem;
        }
        .ntx .pick div:last-child {
          padding-bottom: 0;
        }
        .ntx .pick div::before {
          content: "";
          position: absolute;
          left: -2.05rem;
          top: 0.5rem;
          width: 0.7rem;
          height: 0.7rem;
          border-radius: 50%;
          background: var(--rose);
        }
        .ntx .pick b {
          font-family: var(--font-playfair), Georgia, serif;
          font-weight: 400;
          font-size: 1.2rem;
          display: block;
        }
        .ntx .pick span {
          font-size: 0.97rem;
          color: var(--muted);
        }
        .ntx details {
          border-bottom: 1px solid var(--rule);
          padding: 1.1rem 0;
        }
        .ntx summary {
          cursor: pointer;
          font-weight: 600;
          list-style: none;
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: baseline;
        }
        .ntx summary::-webkit-details-marker {
          display: none;
        }
        .ntx summary::after {
          content: "+";
          color: var(--rose);
          font-size: 1.35rem;
          line-height: 1;
          flex-shrink: 0;
        }
        .ntx details[open] summary::after {
          content: "–";
        }
        .ntx details p {
          margin: 0.8rem 0 0;
          color: var(--muted);
        }
        .ntx .cta {
          background: var(--ink);
          color: var(--veil);
          border-radius: 1.25rem;
          padding: 2.6rem 2rem;
          text-align: center;
          margin: 3.5rem 0;
        }
        .ntx .cta h2 {
          color: var(--surface);
          margin: 0 0 0.6rem;
        }
        .ntx .cta p {
          color: #bbb0c6;
          margin: 0 auto 1.6rem;
          max-width: 30rem;
        }
        .ntx .btn {
          display: inline-block;
          background: var(--rose);
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          padding: 0.95rem 2rem;
          border-radius: 2rem;
        }
        .ntx .btn:hover {
          background: #8e4252;
          color: #fff;
        }
        .ntx .note {
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--muted);
          border-top: 1px solid var(--rule);
          padding-top: 1.4rem;
          margin-top: 3rem;
          padding-bottom: 3rem;
        }
        @media (max-width: 760px) {
          .ntx .prods {
            grid-template-columns: 1fr;
          }
          .ntx .trap .maths {
            grid-template-columns: 1fr;
            gap: 0.9rem;
            text-align: center;
          }
          .ntx .trap .eq {
            transform: rotate(90deg);
          }
          .ntx table.cmp tbody th {
            width: 8.5rem;
            font-size: 0.62rem;
          }
        }
      `}</style>
    </div>
  );
}

function Chip({
  col,
  on,
  toggle,
  children,
}: {
  col: Exclude<HighlightCol, null>;
  on: HighlightCol;
  toggle: (col: Exclude<HighlightCol, null>) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="chip"
      aria-pressed={on === col}
      onClick={() => toggle(col)}
    >
      {children}
    </button>
  );
}

function Prod({
  name,
  gen,
  href,
  body,
  consider,
  elsewhere,
}: {
  name: string;
  gen: string;
  href?: string;
  body: string;
  consider: string;
  elsewhere: string;
}) {
  return (
    <div className="prod">
      <h3>{href ? <Link href={href}>{name}</Link> : name}</h3>
      <p className="gen">{gen}</p>
      <p>{body}</p>
      <div className="split">
        <div>
          <b>Consider if</b>
          {consider}
        </div>
        <div>
          <b>Look elsewhere if</b>
          {elsewhere}
        </div>
      </div>
    </div>
  );
}
