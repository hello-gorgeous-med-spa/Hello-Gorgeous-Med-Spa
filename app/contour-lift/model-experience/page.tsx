import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Montserrat } from "next/font/google";
import { pageMetadata, SITE } from "@/lib/seo";
import { ModelExperienceApplyForm } from "./ModelExperienceApplyForm";
import { ModelExperienceBeforeAfter } from "./ModelExperienceBeforeAfter";
import "./experience.css";

const path = "/contour-lift/model-experience";
const YT_1 = "loJOgWGCkK8";
const YT_2 = "VSif40VosRc";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-cml-display",
  display: "swap",
  axes: ["opsz"],
});

const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-cml-sans",
  display: "swap",
});

const _meta = pageMetadata({
  title: "Hello Gorgeous Contour Lift™ — Clinical Model Experience · May 4 · Oswego, IL",
  description:
    "A limited clinical model opportunity. May 4th. Three candidates selected. The Hello Gorgeous Contour Lift™ powered by Quantum RF, performed by Ryan Kent, FNP-BC in Oswego, IL.",
  path,
});

export const metadata: Metadata = {
  ..._meta,
  keywords: [
    "Contour Lift",
    "Quantum RF model",
    "Hello Gorgeous Med Spa",
    "Oswego IL",
    "clinical model med spa",
    "Ryan Kent FNP-BC",
  ],
};

const phoneDisplay = (() => {
  const d = SITE.phone.replace(/\D/g, "");
  if (d.length === 10) {
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return SITE.phone;
})();

function YouTube16x9({ id, title }: { id: string; title: string }) {
  return (
    <div className="cml-yt">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export default function ContourModelExperiencePage() {
  return (
    <div className={`cml-landing ${display.variable} ${sans.variable}`}>
      <div className="cml-topbar">
        <div className="cml-container cml-topbar-inner">
          <Link href="/" className="cml-brand" aria-label="Hello Gorgeous — home">
            <div className="cml-brand-mark">HG</div>
            <div className="cml-brand-text">
              <span className="cml-name">Hello Gorgeous</span>
              <span className="cml-sub">Med Spa · Oswego, IL</span>
            </div>
          </Link>
          <a href="#apply" className="cml-cta">
            Apply
          </a>
        </div>
      </div>

      <header className="cml-hero">
        <div className="cml-container">
          <div className="cml-hero-meta">
            <span className="cml-pill cml-pink">
              <span className="cml-dot" /> May 4 · Oswego, IL
            </span>
            <span className="cml-pill">3 candidates · By selection</span>
            <span className="cml-pill cml-gold">
              <span className="cml-trophy" aria-hidden>
                🏆
              </span>{" "}
              Best of Oswego
            </span>
          </div>

          <h1 className="cml-display">
            The Hello Gorgeous <em>Contour Lift™</em> Clinical Model Experience.
          </h1>

          <div className="cml-hero-grid">
            <p className="cml-lede">
              Three candidates will be personally selected for a single-session Contour Lift — our signature
              contouring procedure powered by Quantum RF, performed by Ryan Kent, FNP-BC. This is a curated
              clinical opportunity, not a giveaway.
            </p>
            <div>
              <div className="cml-hero-facts">
                <div className="cml-fact">
                  <div className="cml-fk">Procedure</div>
                  <div className="cml-fv">Contour Lift™</div>
                </div>
                <div className="cml-fact">
                  <div className="cml-fk">Provider</div>
                  <div className="cml-fv">Ryan Kent, FNP-BC</div>
                </div>
                <div className="cml-fact">
                  <div className="cml-fk">Sessions</div>
                  <div className="cml-fv">Just one</div>
                </div>
              </div>
            </div>
          </div>

          <div className="cml-hero-ctas">
            <a href="#apply" className="cml-btn cml-btn-primary">
              Apply to be a model
            </a>
            <a href="#why" className="cml-btn cml-btn-ghost">
              Why this matters
            </a>
          </div>
        </div>
      </header>

      <section id="why" className="cml-section">
        <div className="cml-container">
          <div className="cml-section-head">
            <div className="cml-section-number">01</div>
            <div>
              <span className="cml-eyebrow">Why This, Why Now</span>
              <h2>Your body changed. Your skin is trying to catch up.</h2>
            </div>
          </div>
          <p className="cml-why-intro">
            Skin has a timeline. <span className="cml-highlight">Weight loss, pregnancy, and aging</span> often
            move faster than collagen can rebuild — leaving softness where there used to be structure. The
            Contour Lift is designed for exactly this window.
          </p>
          <div className="cml-reasons-grid">
            <article className="cml-reason-card">
              <span className="cml-tag">After GLP-1</span>
              <h3>Ozempic. Wegovy. Mounjaro.</h3>
              <p>
                Rapid fat loss happens faster than skin can retract. Collagen and elastin don&apos;t rebuild at
                the same pace, and areas like the jawline, arms, abdomen, and thighs can feel loose even after
                reaching goal weight.
              </p>
              <div className="cml-stat">An estimated 10 million Americans on GLP-1 therapy in 2025.</div>
            </article>
            <article className="cml-reason-card">
              <span className="cml-tag">After pregnancy</span>
              <h3>Your skin held a lot.</h3>
              <p>
                Postpartum laxity across the abdomen is one of the most common reasons women explore
                non-surgical contouring. The tissue is intact — it just needs help remembering its shape.
              </p>
              <div className="cml-stat">Best addressed once nursing has concluded.</div>
            </article>
            <article className="cml-reason-card">
              <span className="cml-tag">Natural aging</span>
              <h3>Collagen declines after 30.</h3>
              <p>
                Loss of firmness along the jawline, neck, and knees isn&apos;t a flaw — it&apos;s biology. The
                Contour Lift works beneath the skin to stimulate the collagen your body is already making
                less of.
              </p>
              <div className="cml-stat">Results build gradually across 6–8 weeks.</div>
            </article>
          </div>
        </div>
      </section>

      <section className="cml-pullquote" aria-label="Inspirational message">
        <blockquote>
          <span className="cml-qmark" aria-hidden>
            &ldquo;
          </span>
          <p>
            You did the hard work. Now it&apos;s fair to want the <em>outside</em> to match how you feel on the
            inside.
          </p>
          <cite>— The Hello Gorgeous team</cite>
        </blockquote>
      </section>

      <section className="cml-blush">
        <div className="cml-container">
          <div className="cml-section-head">
            <div className="cml-section-number">02</div>
            <div>
              <span className="cml-eyebrow">The Protocol</span>
              <h2>
                One session. <span className="cml-italic-done">Done.</span>
              </h2>
              <p>
                Most skin-tightening treatments require four, six, sometimes eight visits. The Contour Lift is
                engineered differently — a single in-office session, performed once, with results that
                continue building over the months that follow.
              </p>
            </div>
          </div>

          <div className="cml-one-done-grid">
            <div className="cml-one-done-copy">
              <h3>
                Why it only takes <em>one</em>.
              </h3>
              <p>
                The Contour Lift is powered by Quantum RF by InMode — fractionated radiofrequency energy
                delivered up to 60mm beneath the surface. Deep enough to trigger meaningful collagen remodeling
                in a single pass, without damaging the skin on top.
              </p>
              <p>
                For most candidates, that means showing up once, going home the same day, and letting the
                body do the rest over the following 6 to 12 weeks.
              </p>
            </div>
            <div className="cml-timeline">
              <div className="cml-timeline-row">
                <span className="cml-when">Day 0</span>
                <div className="cml-what">
                  <h4>Your one session</h4>
                  <p>Performed in-office by Ryan Kent, FNP-BC. Most areas complete in under 90 minutes.</p>
                </div>
              </div>
              <div className="cml-timeline-row">
                <span className="cml-when">Week 1</span>
                <div className="cml-what">
                  <h4>Settling</h4>
                  <p>Mild warmth and firmness as tissue responds. Normal daily life resumes quickly.</p>
                </div>
              </div>
              <div className="cml-timeline-row">
                <span className="cml-when">Weeks 4–6</span>
                <div className="cml-what">
                  <h4>Visible change</h4>
                  <p>Collagen production peaks. Skin begins to look and feel noticeably firmer.</p>
                </div>
              </div>
              <div className="cml-timeline-row">
                <span className="cml-when">Month 3+</span>
                <div className="cml-what">
                  <h4>Full result</h4>
                  <p>Collagen remodeling continues. Your follow-up visit documents progress.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cml-video-block">
            <div className="cml-video-label">
              <span className="cml-eyebrow">See the procedure</span>
              <span className="cml-vtitle">What most people don&apos;t realize.</span>
            </div>
            <YouTube16x9
              id={YT_1}
              title="Minimally invasive Contour Lift — InMode Quantum RF (Hello Gorgeous / clinical context)"
            />
            <p className="cml-vcaption">
              This is not a facial. The Contour Lift is a minimally invasive procedure performed beneath the
              skin — which is why a single session can do what other treatments require many visits for.
            </p>
          </div>
        </div>
      </section>

      <section id="results" className="cml-section" style={{ paddingTop: 0 }}>
        <div className="cml-container">
          <div className="cml-section-head">
            <div className="cml-section-number">03</div>
            <div>
              <span className="cml-eyebrow">Clinical Results</span>
              <h2>Drag to compare.</h2>
              <p>
                Real Contour Lift outcomes across different treatment zones. Select an area below, then drag
                the handle to see the difference.
              </p>
            </div>
          </div>
          <ModelExperienceBeforeAfter />
        </div>
      </section>

      <section className="cml-section">
        <div className="cml-container">
          <div className="cml-section-head">
            <div className="cml-section-number">04</div>
            <div>
              <span className="cml-eyebrow">The Technology</span>
              <h2>A medical procedure. Not a facial.</h2>
              <p>
                The Contour Lift is powered by Quantum RF by InMode — the same family behind Morpheus8 — a
                minimally invasive radiofrequency treatment designed for mild-to-moderate skin laxity.
              </p>
            </div>
          </div>
          <div className="cml-what-grid">
            <div className="cml-what-cell">
              <div className="cml-num">i.</div>
              <h3>Beneath the surface</h3>
              <p>
                Bipolar RF energy is delivered below the skin — not across the top. The dermis is protected
                while deeper tissue is gently heated to the exact temperature that stimulates collagen.
              </p>
            </div>
            <div className="cml-what-cell">
              <div className="cml-num">ii.</div>
              <h3>Two handpieces, precise zones</h3>
              <p>
                The QuantumRF 10 handles delicate areas like the jawline and neck. The QuantumRF 25 addresses
                larger zones — abdomen, arms, thighs — in the same appointment when indicated.
              </p>
            </div>
            <div className="cml-what-cell">
              <div className="cml-num">iii.</div>
              <h3>Gradual, natural change</h3>
              <p>
                You won&apos;t leave looking &quot;done.&quot; You&apos;ll leave having started something
                that continues quietly for months. The goal is refreshed, not obvious.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cml-section" style={{ paddingTop: 0 }}>
        <div className="cml-container">
          <div className="cml-section-head">
            <div className="cml-section-number">05</div>
            <div>
              <span className="cml-eyebrow">Candidacy</span>
              <h2>We&apos;re choosing. Not filling.</h2>
              <p>
                Three spots. Reviewed personally. We&apos;re looking for candidates whose goals and tissue
                profile align with what the Contour Lift does well — and we&apos;re honest about who
                it&apos;s not for.
              </p>
            </div>
          </div>
          <div className="cml-candidacy">
            <div className="cml-candidacy-grid">
              <div>
                <h4 className="cml-eyebrow" style={{ marginBottom: 20 }}>
                  We&apos;re selecting
                </h4>
                <ul className="cml-checklist">
                  <li>
                    <span className="cml-ckm">✓</span>
                    <span>Experiencing mild to moderate skin laxity</span>
                  </li>
                  <li>
                    <span className="cml-ckm">✓</span>
                    <span>Post-GLP-1, postpartum, or age-related change</span>
                  </li>
                  <li>
                    <span className="cml-ckm">✓</span>
                    <span>Interested in non-surgical contouring</span>
                  </li>
                  <li>
                    <span className="cml-ckm">✓</span>
                    <span>Available in-person in Oswego on May 4th</span>
                  </li>
                  <li>
                    <span className="cml-ckm">✓</span>
                    <span>Comfortable with photo and video documentation</span>
                  </li>
                  <li>
                    <span className="cml-ckm">✓</span>
                    <span>Willing to follow post-care guidance</span>
                  </li>
                </ul>
              </div>
              <div className="cml-invest-card">
                <span className="cml-eyebrow">Model Investment</span>
                <div className="cml-price-row">
                  <span>Standard pricing</span>
                  <span>$4,000 – $8,000+</span>
                </div>
                <div className="cml-price-row cml-model">
                  <span>Selected model rate</span>
                  <span className="cml-val">$1,500 – $2,500+</span>
                </div>
                <p className="cml-invest-note">
                  A non-refundable deposit is required to hold your spot, and applies toward your treatment.
                  Morpheus8 is available as a discounted add-on. Includes custom treatment plan, follow-up visit,
                  and professional before/after imaging.
                </p>
              </div>
            </div>
            <div className="cml-gate-block">
              <h4>
                This isn&apos;t <em>for everyone</em> — and that&apos;s the point.
              </h4>
              <p>
                The Contour Lift works best for mild to moderate laxity. If you have significant hanging skin
                from large weight loss, a consultation with a surgical practice will serve you better — and
                we&apos;ll tell you that honestly. Candidacy is at our discretion. Applying does not guarantee
                selection.
              </p>
            </div>
            <div className="cml-exchange">
              <div>
                <h4>What you receive</h4>
                <ul>
                  <li>Treatment by Ryan Kent, FNP-BC with full practice authority</li>
                  <li>Custom treatment plan built for your goals</li>
                  <li>Optional Morpheus8 add-on at a reduced rate</li>
                  <li>Follow-up visit included</li>
                  <li>Professional before/after imaging</li>
                </ul>
              </div>
              <div>
                <h4>What we ask</h4>
                <ul>
                  <li>Photo and video consent for clinical use</li>
                  <li>Confirmed attendance on May 4th</li>
                  <li>Compliance with post-care instructions</li>
                  <li>Non-refundable deposit, applied to treatment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="closer-look" className="cml-closer-look" aria-label="A closer look — video">
        <div className="cml-container">
          <div className="cml-video-block" style={{ marginTop: 0 }}>
            <div className="cml-video-label">
              <span className="cml-eyebrow">A closer look</span>
              <span className="cml-vtitle">Before you apply.</span>
            </div>
            <YouTube16x9 id={YT_2} title="More on Quantum RF and Contour Lift at Hello Gorgeous" />
            <p className="cml-vcaption">
              A short walkthrough of what the Contour Lift experience looks like at Hello Gorgeous. If this
              feels like the right fit, the application is just below.
            </p>
          </div>
        </div>
      </section>

      <section id="apply" className="cml-apply">
        <div className="cml-form-wrap cml-container">
          <div className="cml-section-head">
            <div className="cml-section-number">06</div>
            <div>
              <span className="cml-eyebrow">Apply</span>
              <h2>Tell us about you.</h2>
              <p>
                A consultation is required to confirm candidacy. Every application is reviewed personally.
                We&apos;ll reach out within 48 hours if you may be a fit for May 4th.
              </p>
            </div>
          </div>
          <ModelExperienceApplyForm />
        </div>
      </section>

      <footer>
        <div className="cml-container cml-foot-grid">
          <div>
            <div className="cml-fname">Hello Gorgeous Med Spa</div>
            <div className="cml-fsub">Medical Aesthetics</div>
            <p style={{ marginTop: 12, marginBottom: 0, color: "rgba(255,255,255,0.75)" }}>
              {SITE.address.streetAddress}
              <br />
              {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}
            </p>
          </div>
          <div style={{ textAlign: "right" as const }}>
            <p style={{ margin: 0 }}>
              <a href={`tel:${SITE.phone.replace(/\D/g, "")}`}>{phoneDisplay}</a>
            </p>
            <p style={{ marginTop: 6, color: "rgba(255,255,255,0.75)" }}>
              Contour Lift™ · Powered by Quantum RF
              <br />
              Performed by Ryan Kent, FNP-BC
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
