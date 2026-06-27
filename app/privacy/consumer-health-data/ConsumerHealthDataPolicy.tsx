"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "collection", label: "What we collect" },
  { id: "use", label: "How we use it" },
  { id: "sharing", label: "Who we share with" },
  { id: "rights", label: "Your rights" },
  { id: "changes", label: "Policy changes" },
  { id: "contact", label: "Contact us" },
];

export function ConsumerHealthDataPolicy() {
  const [activeId, setActiveId] = useState("intro");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    document.querySelectorAll(".chd-section, #intro").forEach((el) =>
      observerRef.current?.observe(el)
    );
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .chd-page { font-family: 'Inter', sans-serif; background: #FAF8F5; color: #2C2826; min-height: 100vh; }
        .chd-header {
          background: #fff; border-bottom: 1px solid rgba(44,40,38,0.1);
          padding: 3rem; display: flex; flex-direction: column; gap: 1rem;
        }
        .chd-header-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .chd-brand { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 300; letter-spacing: 0.05em; color: #2C2826; }
        .chd-brand em { font-style: italic; color: #C4848A; }
        .chd-meta { font-size: 12px; color: #6B6360; text-align: right; line-height: 1.7; }
        .chd-meta strong { display: block; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #2C2826; margin-bottom: 2px; }
        .chd-page-body { display: grid; grid-template-columns: 220px 1fr; max-width: 1100px; margin: 0 auto; padding: 3rem; gap: 4rem; }
        .chd-sidenav { position: sticky; top: 2rem; align-self: start; }
        .chd-sidenav-title { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #B89A72; font-weight: 500; margin-bottom: 12px; }
        .chd-sidenav ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
        .chd-sidenav a { font-size: 13px; color: #6B6360; text-decoration: none; padding: 5px 10px; border-radius: 4px; display: block; border-left: 2px solid transparent; transition: all 0.15s; }
        .chd-sidenav a:hover, .chd-sidenav a.active { color: #2C2826; border-left-color: #C4848A; background: rgba(196,132,138,0.06); }
        .chd-rights-badge { margin-top: 1.5rem; background: #F5E6E7; border-radius: 6px; padding: 1rem; font-size: 12px; color: #6B3035; line-height: 1.65; }
        .chd-rights-badge strong { display: block; color: #4A1F23; font-weight: 600; margin-bottom: 6px; }
        .chd-rights-badge a { color: #8A4F54; text-decoration: underline; text-underline-offset: 2px; }
        .chd-doc-eyebrow { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #B89A72; margin-bottom: 8px; }
        .chd-doc-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 300; letter-spacing: 0.02em; color: #2C2826; margin-bottom: 2rem; line-height: 1.2; }
        .chd-intro-box { background: #fff; border: 1px solid rgba(196,132,138,0.25); border-radius: 4px; padding: 1.5rem 2rem; font-size: 14px; color: #6B6360; line-height: 1.85; margin-bottom: 2.5rem; }
        .chd-intro-box strong { color: #2C2826; }
        .chd-section { margin-bottom: 3rem; }
        .chd-eyebrow { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #B89A72; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
        .chd-eyebrow::after { content: ''; flex: 1; height: 1px; background: rgba(44,40,38,0.1); }
        .chd-heading { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; font-weight: 400; color: #2C2826; margin-bottom: 14px; }
        .chd-body { font-size: 14px; color: #6B6360; line-height: 1.85; margin-bottom: 14px; }
        .chd-body a { color: #8A4F54; text-decoration: underline; text-underline-offset: 2px; }
        .chd-collection-group { display: flex; flex-direction: column; gap: 12px; }
        .chd-collection-item { background: #fff; border: 1px solid rgba(44,40,38,0.1); border-radius: 4px; padding: 1.25rem 1.5rem; }
        .chd-collection-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #2C2826; margin-bottom: 10px; }
        .chd-data-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .chd-data-list li { font-size: 13px; color: #6B6360; padding-left: 16px; position: relative; line-height: 1.65; }
        .chd-data-list li::before { content: ''; position: absolute; left: 0; top: 9px; width: 6px; height: 1px; background: #B89A72; }
        .chd-table-wrap { overflow-x: auto; }
        .chd-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .chd-table th { background: #2C2826; color: #FAF8F5; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; padding: 10px 14px; text-align: left; }
        .chd-table td { padding: 12px 14px; border-bottom: 1px solid rgba(44,40,38,0.08); vertical-align: top; color: #6B6360; }
        .chd-table tr:last-child td { border-bottom: none; }
        .chd-table tr:nth-child(even) td { background: rgba(250,248,245,0.6); }
        .chd-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
        .chd-tag { font-size: 10px; background: rgba(196,132,138,0.12); color: #8A4F54; border: 1px solid rgba(196,132,138,0.3); border-radius: 3px; padding: 2px 7px; white-space: nowrap; }
        .chd-sharing-list { list-style: none; padding: 0; margin: 0 0 14px; display: flex; flex-direction: column; gap: 10px; }
        .chd-sharing-list li { font-size: 14px; color: #6B6360; padding-left: 20px; position: relative; line-height: 1.75; }
        .chd-sharing-list li::before { content: '✦'; position: absolute; left: 0; top: 3px; font-size: 8px; color: #C4848A; }
        .chd-notice { background: #F5EFE6; border: 1px solid rgba(184,154,114,0.3); border-radius: 4px; padding: 1rem 1.25rem; font-size: 13px; color: #5C4A30; line-height: 1.75; margin-top: 10px; }
        .chd-notice strong { color: #3E3020; }
        .chd-rights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 14px 0; }
        .chd-right-card { background: #fff; border: 1px solid rgba(44,40,38,0.1); border-radius: 4px; padding: 1rem 1.25rem; }
        .chd-right-card-title { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #C4848A; margin-bottom: 6px; }
        .chd-right-card p { font-size: 13px; color: #6B6360; margin: 0; line-height: 1.65; }
        .chd-right-card.full { grid-column: 1 / -1; }
        .chd-contact-block { background: #fff; border: 1px solid rgba(196,132,138,0.25); border-radius: 4px; padding: 1.5rem 2rem; }
        .chd-contact-block p { font-size: 14px; color: #6B6360; margin: 0 0 1rem; line-height: 1.75; }
        .chd-contact-btn { display: inline-block; background: #C4848A; color: #fff; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; padding: 10px 24px; border-radius: 2px; transition: background 0.2s; }
        .chd-contact-btn:hover { background: #8A4F54; }
        .chd-footer { background: #fff; border-top: 1px solid rgba(44,40,38,0.1); padding: 1.5rem 3rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .chd-footer-brand { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 300; letter-spacing: 0.05em; color: #2C2826; }
        .chd-footer-brand em { font-style: italic; color: #C4848A; }
        .chd-footer-copy { font-size: 11px; color: #6B6360; letter-spacing: 0.05em; }
        @media (max-width: 768px) {
          .chd-page-body { grid-template-columns: 1fr; padding: 1.5rem; gap: 2rem; }
          .chd-sidenav { display: none; }
          .chd-header { padding: 1.5rem; }
          .chd-rights-grid { grid-template-columns: 1fr; }
          .chd-footer { padding: 1.25rem 1.5rem; flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="chd-page">
        <header className="chd-header">
          <div className="chd-header-top">
            <Link href="/" className="chd-brand">Hello <em>Gorgeous</em></Link>
            <div className="chd-meta">
              <strong>Consumer Health Data Privacy Policy</strong>
              Last updated: February 4, 2026
            </div>
          </div>
          <div style={{fontSize:"12px",color:"#6B6360"}}>
            <Link href="/privacy" style={{color:"#8A4F54",textDecoration:"underline",textUnderlineOffset:"2px"}}>← General Privacy Policy</Link>
            {" · "}
            <Link href="/telehealth/consent" style={{color:"#8A4F54",textDecoration:"underline",textUnderlineOffset:"2px"}}>Telehealth Consent</Link>
          </div>
        </header>

        <div className="chd-page-body">
          {/* Side nav */}
          <nav className="chd-sidenav" aria-label="Policy sections">
            <div className="chd-sidenav-title">On this page</div>
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={activeId === s.id ? "active" : ""}>{s.label}</a>
                </li>
              ))}
            </ul>
            <div className="chd-rights-badge">
              <strong>Exercise your rights</strong>
              To access, correct, or delete your consumer health data, email us at:
              <br /><br />
              <a href="mailto:provider@hellogorgeousmedspa.com">provider@hellogorgeousmedspa.com</a>
            </div>
          </nav>

          {/* Main content */}
          <main>
            <div className="chd-doc-eyebrow">Legal &amp; Privacy</div>
            <h1 className="chd-doc-title">Consumer Health Data<br />Privacy Policy</h1>

            <div className="chd-intro-box" id="intro">
              Hello Gorgeous Med Spa owns and operates this platform and any associated mobile applications (collectively, the "Service"). <strong>This Consumer Health Data Privacy Policy</strong> applies to the extent required by applicable state law with respect to consumer health data ("Consumer Health Data") as defined by law. It supplements our general Privacy Policy — in the event of a conflict, this policy governs.
              <br /><br />
              This policy does not apply to protected health information subject to HIPAA. Please refer to our <Link href="/privacy#hipaa" style={{color:"#8A4F54",textDecoration:"underline",textUnderlineOffset:"2px"}}>Notice of Privacy Practices</Link> for that information.
            </div>

            {/* Collection */}
            <section className="chd-section" id="collection">
              <div className="chd-eyebrow">Collection</div>
              <h2 className="chd-heading">What consumer health data we collect</h2>
              <div className="chd-body">
                <p>The Consumer Health Data we collect depends on how you interact with us, the services you use, and the choices you make. We collect data from multiple sources:</p>
              </div>
              <div className="chd-collection-group">
                {[
                  {
                    label: "Data you provide directly",
                    items: [
                      "Name, email address, phone number, and billing or physical address",
                      "Demographic information — gender, racial or ethnic origin, date of birth, zip code",
                      "Payment details — credit card number, financial account information",
                      "Account credentials — username, password, access codes, and profile information",
                      "Marketing preferences and communications history",
                      "Photographs, videos, documents, and messages you send us",
                      "Government-issued identifiers — driver's license, passport, and social security number",
                      "Biometric information that can identify you",
                      "Health information, including physical and mental health status",
                      "Sexual and reproductive health information, including sex life and sexual orientation",
                    ],
                  },
                  {
                    label: "Data collected automatically",
                    items: [
                      "IP address, device type, operating system, browser version, and identifiers such as MAC address",
                      "General location data when you use our apps or services",
                      "Usage data — pages visited, time spent, referring URLs, and actions taken on our platform",
                      "Cookie identifiers, mobile IDs, and similar tracking technologies",
                    ],
                  },
                  {
                    label: "Data we infer or create",
                    items: ["Inferred preferences or characteristics generated from other data using automated means"],
                  },
                  {
                    label: "Data from third-party sources",
                    items: [
                      "Corporate affiliates we operate with",
                      "Social networks or third-party apps you connect to our services",
                      "Co-branding and joint marketing partners",
                      "Service providers acting on our behalf",
                      "Public government databases and open sources",
                    ],
                  },
                ].map((group) => (
                  <div className="chd-collection-item" key={group.label}>
                    <div className="chd-collection-label">{group.label}</div>
                    <ul className="chd-data-list">
                      {group.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Use */}
            <section className="chd-section" id="use">
              <div className="chd-eyebrow">Use</div>
              <h2 className="chd-heading">How we use your data</h2>
              <div className="chd-body">
                <p>We use Consumer Health Data as described in this policy or as otherwise disclosed at the time of collection.</p>
              </div>
              <div className="chd-table-wrap">
                <table className="chd-table">
                  <thead>
                    <tr><th>Purpose</th><th>Description</th><th>Categories used</th></tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        purpose: "Service delivery",
                        desc: "Providing and operating the Service, including billing, fraud detection, customer support, identity verification, and legal compliance.",
                        tags: ["Contact info","Health data","Payment info","Device identifiers","Location","Biometrics","Government ID","Sexual & reproductive health"],
                      },
                      {
                        purpose: "Product improvement",
                        desc: "Developing and testing new features, analyzing traffic and user behavior, and identifying new service opportunities.",
                        tags: ["Contact info","Health data","Usage data","Inferences","Demographic data","Sexual & reproductive health"],
                      },
                      {
                        purpose: "Aggregation & anonymization",
                        desc: "Creating de-identified or aggregated data sets. We do not attempt to re-identify such data unless required by law. We may share these data sets with third parties.",
                        tags: ["All categories"],
                      },
                      {
                        purpose: "Marketing",
                        desc: "Communicating with you about new services, promotions, events, and partner offerings.",
                        tags: ["Contact info","Usage data","Inferences","Health data","Location","Sexual & reproductive health"],
                      },
                    ].map((row) => (
                      <tr key={row.purpose}>
                        <td style={{fontWeight:500,color:"#2C2826",whiteSpace:"nowrap"}}>{row.purpose}</td>
                        <td>{row.desc}</td>
                        <td>
                          <div className="chd-tags">
                            {row.tags.map((t) => <span className="chd-tag" key={t}>{t}</span>)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Sharing */}
            <section className="chd-section" id="sharing">
              <div className="chd-eyebrow">Sharing</div>
              <h2 className="chd-heading">Who we share your data with</h2>
              <div className="chd-body">
                <p>We may share Consumer Health Data with your consent, to complete your transactions, to provide services you have requested, or as otherwise permitted or required by law.</p>
              </div>
              <ul className="chd-sharing-list">
                <li><strong>Affiliates.</strong> We share data across our subsidiaries and related companies to operate our business and provide services. This includes Hello Gorgeous affiliated entities and management companies.</li>
                <li><strong>Legal and law enforcement.</strong> We will share Consumer Health Data when required by law, in response to valid legal process, or when necessary to protect our customers&apos; rights or property.</li>
                <li><strong>Service providers.</strong> Third parties that process data on our behalf to support operations such as billing, customer support, and technology.</li>
              </ul>
              <div className="chd-notice">
                <strong>What we do not do:</strong> We do not sell your Consumer Health Data to data brokers or unaffiliated advertisers. Sharing is limited to what is necessary to provide the Service or comply with legal obligations.
              </div>
            </section>

            {/* Rights */}
            <section className="chd-section" id="rights">
              <div className="chd-eyebrow">Your rights</div>
              <h2 className="chd-heading">Control over your consumer health data</h2>
              <div className="chd-body">
                <p>You may have certain rights to your Consumer Health Data under applicable state law. Rights vary by state of residence and may be subject to limitations. To exercise any of these rights, email us at <a href="mailto:provider@hellogorgeousmedspa.com">provider@hellogorgeousmedspa.com</a>.</p>
              </div>
              <div className="chd-rights-grid">
                {[
                  { title: "Withdraw consent", body: "Withdraw any consent we rely upon to collect or share your Consumer Health Data, effective for future actions." },
                  { title: "Access & confirm", body: "Ask us to confirm whether we have collected, shared, or sold your data — and request a copy of it, including a list of third parties we have shared with." },
                  { title: "Correction", body: "Ask us to correct inaccuracies in the Consumer Health Data we hold about you." },
                  { title: "Deletion", body: "Ask us to delete your Consumer Health Data. Note that deleting required data may affect your ability to use the Service." },
                ].map((r) => (
                  <div className="chd-right-card" key={r.title}>
                    <div className="chd-right-card-title">{r.title}</div>
                    <p>{r.body}</p>
                  </div>
                ))}
                <div className="chd-right-card full">
                  <div className="chd-right-card-title">Appeal</div>
                  <p>If we deny a rights request, you have the right to appeal our decision. We will provide appeal instructions at the time of any denial.</p>
                </div>
              </div>
              <div className="chd-notice" style={{marginTop:"10px"}}>
                <strong>Identity verification:</strong> To protect your privacy, we may need to verify your identity before processing a rights request. We may ask you to confirm information already on file or provide additional documentation, which will only be used for verification purposes.
              </div>
            </section>

            {/* Changes */}
            <section className="chd-section" id="changes">
              <div className="chd-eyebrow">Updates</div>
              <h2 className="chd-heading">Changes to this policy</h2>
              <div className="chd-body">
                <p>We reserve the right to modify this Consumer Health Data Privacy Policy at any time. If we make material changes, we will notify you by updating the date at the top of this policy and posting it on the Service. Continued use of the Service after any modification constitutes your acknowledgment that the updated policy applies to your interactions with the Service.</p>
              </div>
            </section>

            {/* Contact */}
            <section className="chd-section" id="contact">
              <div className="chd-eyebrow">Questions</div>
              <h2 className="chd-heading">Contact us</h2>
              <div className="chd-body">
                <p>If you have questions about this Consumer Health Data Privacy Policy or wish to exercise your data rights, we&apos;re here to help.</p>
              </div>
              <div className="chd-contact-block">
                <p>Reach our privacy team by email. We aim to respond to all privacy inquiries within 30 days of receipt, and will confirm identity before processing any data request.</p>
                <a href="mailto:provider@hellogorgeousmedspa.com" className="chd-contact-btn">Email privacy team</a>
              </div>
            </section>
          </main>
        </div>

        <footer className="chd-footer">
          <div className="chd-footer-brand">Hello <em>Gorgeous</em></div>
          <div className="chd-footer-copy">© {new Date().getFullYear()} Hello Gorgeous Med Spa &nbsp;·&nbsp; All rights reserved &nbsp;·&nbsp; Consumer Health Data Privacy Policy</div>
        </footer>
      </div>
    </>
  );
}
