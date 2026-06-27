"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function TelehealthConsentForm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const [hasSig, setHasSig] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitDate, setSubmitDate] = useState("");

  const todayStr = (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  })();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    function resize() {
      if (!canvas || !wrap) return;
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = "#2C2826";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  function getCtx() {
    return canvasRef.current?.getContext("2d") ?? null;
  }

  function getPos(e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const src = "touches" in e ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    drawingRef.current = true;
    const p = getPos(e.nativeEvent as MouseEvent | TouchEvent, canvas);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    if (hintRef.current) hintRef.current.style.opacity = "0";
    setHasSig(true);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    const p = getPos(e.nativeEvent as MouseEvent | TouchEvent, canvas);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function endDraw() {
    drawingRef.current = false;
  }

  function clearSig() {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
    if (hintRef.current) hintRef.current.style.opacity = "1";
  }

  function handleSubmit() {
    const name = (document.getElementById("patient-name") as HTMLInputElement)?.value.trim();
    const dob = (document.getElementById("patient-dob") as HTMLInputElement)?.value;
    if (!name) { alert("Please enter your full legal name."); return; }
    if (!dob) { alert("Please enter your date of birth."); return; }
    if (!hasSig) { alert("Please provide your signature."); return; }
    if (!agreed) { alert("Please check the agreement box to confirm your consent."); return; }
    const now = new Date();
    setSubmitDate(now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
    setSubmitted(true);
  }

  return (
    <>
      <style>{`
        .hg-consent *,
        .hg-consent *::before,
        .hg-consent *::after { box-sizing: border-box; }
        .hg-consent {
          font-family: 'Inter', sans-serif;
          background: #FAF8F5;
          color: #2C2826;
          font-size: 15px;
          line-height: 1.7;
          font-weight: 300;
          min-height: 100vh;
        }
        .hg-consent .letterhead {
          background: #fff;
          border-bottom: 1px solid rgba(44,40,38,0.12);
          padding: 2.5rem 3rem 2rem;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
        }
        .hg-consent .brand-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 32px;
          font-weight: 300;
          letter-spacing: 0.06em;
          color: #2C2826;
          line-height: 1.1;
        }
        .hg-consent .brand-name em { font-style: italic; color: #C4848A; }
        .hg-consent .brand-tagline {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6B6360;
          font-weight: 400;
        }
        .hg-consent .brand-divider {
          width: 40px; height: 1px;
          background: #B89A72;
          margin: 8px 0;
        }
        .hg-consent .doc-meta {
          text-align: right;
          font-size: 12px;
          color: #6B6360;
          line-height: 1.8;
        }
        .hg-consent .doc-meta strong {
          font-weight: 500;
          color: #2C2826;
          display: block;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .hg-consent .emergency-banner {
          background: #FFF1F2;
          border-left: 3px solid #C4848A;
          padding: 14px 3rem;
          font-size: 13px;
          color: #6B3035;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hg-consent .emergency-banner a { color: #8A4F54; font-weight: 500; text-decoration: none; border-bottom: 1px solid #C4848A; }
        .hg-consent .container { max-width: 820px; margin: 0 auto; padding: 3rem 3rem 4rem; }
        .hg-consent .doc-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px; font-weight: 300;
          letter-spacing: 0.02em; color: #2C2826;
          margin-bottom: 6px; line-height: 1.2;
        }
        .hg-consent .doc-subtitle {
          font-size: 12px; letter-spacing: 0.16em;
          text-transform: uppercase; color: #B89A72;
          font-weight: 400; margin-bottom: 2.5rem;
        }
        .hg-consent .intro-block {
          background: #fff;
          border: 1px solid rgba(196,132,138,0.3);
          border-radius: 2px;
          padding: 1.5rem 2rem;
          margin-bottom: 2.5rem;
          font-size: 14px; color: #6B6360; line-height: 1.8;
        }
        .hg-consent .intro-block strong { color: #2C2826; font-weight: 500; }
        .hg-consent section { margin-bottom: 2.5rem; }
        .hg-consent .section-label {
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: #B89A72;
          font-weight: 400; margin-bottom: 10px;
          display: flex; align-items: center; gap: 12px;
        }
        .hg-consent .section-label::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(44,40,38,0.12);
        }
        .hg-consent .section-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 21px; font-weight: 400;
          color: #2C2826; margin-bottom: 12px; line-height: 1.3;
        }
        .hg-consent .section-body { font-size: 14px; color: #6B6360; line-height: 1.85; }
        .hg-consent .risk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
        .hg-consent .risk-item {
          background: #fff; border: 1px solid rgba(44,40,38,0.12);
          border-radius: 2px; padding: 1rem 1.1rem;
          font-size: 13px; color: #6B6360; line-height: 1.6;
          border-left: 2px solid #F5E6E7;
        }
        .hg-consent .risk-item strong {
          display: block; font-size: 11px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #8A4F54; margin-bottom: 4px;
        }
        .hg-consent .benefits-list { list-style: none; margin-top: 12px; display: flex; flex-direction: column; gap: 10px; }
        .hg-consent .benefits-list li {
          font-size: 14px; color: #6B6360;
          padding-left: 22px; position: relative; line-height: 1.7;
        }
        .hg-consent .benefits-list li::before {
          content: ''; position: absolute; left: 0; top: 10px;
          width: 8px; height: 1px; background: #B89A72;
        }
        .hg-consent .lab-notice {
          background: #F5EFE6;
          border: 1px solid rgba(184,154,114,0.25);
          border-radius: 2px; padding: 1.25rem 1.5rem;
          margin-top: 14px; font-size: 13px;
          color: #6B5535; line-height: 1.75;
        }
        .hg-consent .lab-notice strong { font-weight: 500; color: #4A3820; }
        .hg-consent .acknowledgment-block {
          background: #fff; border: 1px solid rgba(44,40,38,0.12);
          border-radius: 2px; padding: 2rem 2.5rem; margin: 2.5rem 0;
        }
        .hg-consent .ack-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .hg-consent .ack-list li {
          font-size: 13px; color: #6B6360;
          padding-left: 22px; position: relative; line-height: 1.7;
        }
        .hg-consent .ack-list li::before {
          content: '✦'; position: absolute; left: 0; top: 4px;
          font-size: 9px; color: #C4848A;
        }
        .hg-consent .signature-zone {
          background: #fff;
          border: 1px solid rgba(196,132,138,0.3);
          border-radius: 2px; padding: 2.5rem; margin-top: 2.5rem;
        }
        .hg-consent .sig-label {
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: #B89A72; margin-bottom: 1.5rem;
        }
        .hg-consent .sig-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1.5rem; margin-bottom: 2rem;
        }
        .hg-consent .sig-field label {
          display: block; font-size: 11px; letter-spacing: 0.12em;
          text-transform: uppercase; color: #6B6360;
          font-weight: 400; margin-bottom: 8px;
        }
        .hg-consent .sig-field input,
        .hg-consent .sig-field select {
          width: 100%; padding: 10px 14px;
          border: 1px solid rgba(44,40,38,0.12);
          border-radius: 2px; background: #FAF8F5;
          font-size: 14px; color: #2C2826;
          font-weight: 300; outline: none;
          transition: border-color 0.2s;
          -webkit-appearance: none;
        }
        .hg-consent .sig-field input:focus,
        .hg-consent .sig-field select:focus { border-color: #C4848A; }
        .hg-consent .sig-field.full { grid-column: 1 / -1; }
        .hg-consent .sig-canvas-label {
          font-size: 11px; letter-spacing: 0.12em;
          text-transform: uppercase; color: #6B6360; margin-bottom: 8px;
        }
        .hg-consent .sig-canvas-wrap {
          border: 1px solid rgba(44,40,38,0.12);
          border-radius: 2px; background: #FAF8F5;
          position: relative; height: 100px;
          cursor: crosshair; margin-bottom: 6px;
        }
        .hg-consent .sig-canvas-wrap canvas { display: block; width: 100%; height: 100%; }
        .hg-consent .sig-canvas-hint {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic; font-size: 15px;
          color: rgba(107,99,96,0.35);
          pointer-events: none; transition: opacity 0.2s;
        }
        .hg-consent .sig-clear {
          font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase; color: #6B6360;
          background: none; border: none; cursor: pointer;
          padding: 0; text-decoration: underline; text-underline-offset: 2px;
        }
        .hg-consent .agree-btn {
          display: block; width: 100%; padding: 16px;
          background: #C4848A; color: #fff; border: none;
          border-radius: 2px; font-size: 13px; font-weight: 400;
          letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; margin-top: 2rem; transition: background 0.2s;
        }
        .hg-consent .agree-btn:hover { background: #8A4F54; }
        .hg-consent .consent-checkbox {
          display: flex; align-items: flex-start; gap: 12px;
          font-size: 13px; color: #6B6360;
          margin-top: 1.5rem; line-height: 1.65;
        }
        .hg-consent .consent-checkbox input[type="checkbox"] {
          margin-top: 3px; flex-shrink: 0;
          width: 15px; height: 15px;
          accent-color: #C4848A; cursor: pointer;
        }
        .hg-consent .privacy-note {
          margin-top: 2.5rem; padding-top: 2rem;
          border-top: 1px solid rgba(44,40,38,0.12);
          font-size: 12px; color: #6B6360; line-height: 1.7;
        }
        .hg-consent .privacy-note a { color: #8A4F54; text-decoration: none; border-bottom: 1px solid rgba(196,132,138,0.3); }
        .hg-consent .ext-link {
          font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase; color: #6B6360;
          text-decoration: none; border: 1px solid rgba(44,40,38,0.12);
          padding: 5px 12px; border-radius: 2px;
          transition: border-color 0.2s, color 0.2s; display: inline-block;
        }
        .hg-consent .ext-link:hover { border-color: #C4848A; color: #8A4F54; }
        .hg-consent .hg-footer {
          background: #fff; border-top: 1px solid rgba(44,40,38,0.12);
          padding: 1.5rem 3rem;
          display: flex; align-items: center;
          justify-content: space-between; gap: 1rem; flex-wrap: wrap;
        }
        .hg-consent .footer-brand {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 16px; font-weight: 300;
          letter-spacing: 0.05em; color: #2C2826;
        }
        .hg-consent .footer-brand em { font-style: italic; color: #C4848A; }
        .hg-consent .footer-copy { font-size: 11px; color: #6B6360; letter-spacing: 0.06em; }
        @media (max-width: 620px) {
          .hg-consent .letterhead { flex-direction: column; align-items: flex-start; padding: 1.5rem; }
          .hg-consent .doc-meta { text-align: left; }
          .hg-consent .container { padding: 2rem 1.5rem; }
          .hg-consent .risk-grid { grid-template-columns: 1fr; }
          .hg-consent .sig-grid { grid-template-columns: 1fr; }
          .hg-consent .emergency-banner { padding: 12px 1.5rem; }
          .hg-consent .hg-footer { padding: 1.25rem 1.5rem; flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="hg-consent">
        <header className="letterhead">
          <div>
            <div className="brand-name">Hello <em>Gorgeous</em></div>
            <div className="brand-divider" />
            <div className="brand-tagline">Medical Aesthetics &amp; Wellness</div>
          </div>
          <div className="doc-meta">
            <strong>Confidential Document</strong>
            Last updated: February 4, 2026<br />
            Patient Copy — Please retain for your records
          </div>
        </header>

        <div className="emergency-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          If you are experiencing a life-threatening emergency, call <strong style={{margin:"0 4px"}}>911</strong> immediately. For mental health crises, call or text <a href="tel:988">988</a> — the Suicide &amp; Crisis Lifeline is available 24/7.
        </div>

        <div className="container">
          <div className="doc-title">Authorization to Use &amp; Disclose Medical Information</div>
          <div className="doc-subtitle">Consent to Telehealth &nbsp;·&nbsp; Open Payments Notice</div>

          <div className="intro-block">
            This consent form provides information about telehealth services and obtains your informed consent to receive healthcare and/or mental health services from licensed providers through Hello Gorgeous Med Spa's digital platform. <strong>By clicking "I Agree" below, you acknowledge you have read and accepted all terms.</strong> If you do not agree, do not create an account or use the service.
          </div>

          <section>
            <div className="section-label">01 &nbsp; Purpose</div>
            <div className="section-heading">What is telehealth?</div>
            <div className="section-body">
              Telehealth involves the delivery of healthcare and mental health services using electronic communications, information technology, or other means between a provider and a patient who are not in the same physical location. Services may include diagnosis, treatment, follow-up visits, and patient education — delivered through secure messaging, audio, video, and data communications.<br /><br />
              Alternative in-person methods of care may be available to you. You may choose an in-person alternative at any time by discussing options with your provider.
            </div>
          </section>

          <section>
            <div className="section-label">02 &nbsp; Benefits</div>
            <div className="section-heading">What telehealth offers you</div>
            <ul className="benefits-list">
              <li>Convenient access to licensed medical and aesthetic providers without requiring an in-person visit</li>
              <li>Flexible scheduling at times that work for your lifestyle</li>
              <li>Reduced stress and travel burden associated with in-clinic appointments</li>
              <li>For mental health services: potential reduction in anxiety, improved relationships, and progress toward your wellness goals</li>
            </ul>
          </section>

          <section>
            <div className="section-label">03 &nbsp; Risks</div>
            <div className="section-heading">Potential limitations to be aware of</div>
            <div className="section-body">No service is without limitation. Before consenting, please review the following:</div>
            <div className="risk-grid">
              {[
                { title: "Technology limitations", body: "Platform errors, connectivity issues, or bugs may limit functionality or affect the accuracy of records and results." },
                { title: "Diagnostic constraints", body: "Inability to perform in-person physical examinations may prevent diagnosis in some cases or delay identification of urgent needs." },
                { title: "Data privacy", body: "Electronic communications, including email, carry inherent security risks. While we use robust encryption, we cannot guarantee your email provider's security." },
                { title: "Prescription limitations", body: "Regulatory requirements in certain jurisdictions may limit diagnosis and treatment options, particularly certain prescriptions." },
                { title: "Incomplete records", body: "A provider's lack of access to your full medical history may result in potential adverse drug interactions or other clinical errors." },
                { title: "Mental health services", body: "It is normal and sometimes expected to feel worse before you feel better during therapy. Your provider will monitor your progress." },
              ].map((r) => (
                <div className="risk-item" key={r.title}>
                  <strong>{r.title}</strong>
                  {r.body}
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="section-label">04 &nbsp; Emergency Protocol</div>
            <div className="section-heading">When telehealth is not appropriate</div>
            <div className="section-body">
              If your situation is an emergency, call 911. Telehealth is not a substitute for emergency care. Your provider may not respond immediately to messages submitted through the platform. If you require urgent care, please visit an emergency room or urgent care facility.<br /><br />
              If a technical failure prevents you from reaching your provider through our platform, call us directly at <strong>(630) 636-6193</strong> — Hello Gorgeous Med Spa.
            </div>
          </section>

          <section>
            <div className="section-label">05 &nbsp; Privacy &amp; Data</div>
            <div className="section-heading">How we protect your information</div>
            <div className="section-body">
              Our platform uses industry-standard network and software security protocols to protect your personal and protected health information (PHI). Your information will not be disclosed to any third party without your consent, except as authorized by law — including consultation, treatment, billing, mandatory reporting requirements (such as danger to self or others, or abuse reporting), or as set forth in your provider's Notice of Privacy Practices.
            </div>
          </section>

          <section>
            <div className="section-label">06 &nbsp; Laboratory Services</div>
            <div className="section-heading">If lab testing is part of your care</div>
            <div className="section-body">
              Certain services may include laboratory testing. If applicable, your provider may order tests using an at-home kit or a local blood collection site. Lab tests carry standard risks including discomfort, bruising, or, rarely, infection at the draw site.
            </div>
            <div className="lab-notice">
              <strong>Important:</strong> Laboratory tests are processed by affiliated or third-party labs. Neither Hello Gorgeous Med Spa nor your provider can guarantee the accuracy of results. Testing may produce false positives, false negatives, or inconclusive results. By agreeing to testing, you exercise your right of direct access to results under federal law and waive any standard delay period. <strong>You are responsible for sharing results with your primary care physician and pursuing follow-up care.</strong>
            </div>
          </section>

          <section>
            <div className="section-label">07 &nbsp; Open Payments</div>
            <div className="section-heading">Federal disclosure notice</div>
            <div className="section-body">
              The federal Physician Payments Sunshine Act requires that payments of value over $10 from drug and device manufacturers to physicians and teaching hospitals be made publicly available. You may search this database at <a href="https://openpaymentsdata.cms.gov" target="_blank" rel="noopener noreferrer" style={{color:"#8A4F54",textDecoration:"none",borderBottom:"1px solid rgba(196,132,138,0.3)"}}>openpaymentsdata.cms.gov</a>.
            </div>
          </section>

          <div className="acknowledgment-block">
            <div className="section-label" style={{marginBottom:"14px"}}>08 &nbsp; Your Acknowledgments</div>
            <div className="section-heading">By signing below, you confirm that you understand and agree:</div>
            <ul className="ack-list">
              {[
                "Healthcare services will be delivered via telehealth by licensed physicians, nurse practitioners, physician assistants, and/or mental health professionals.",
                "Technology used to deliver care may be in beta phases and may contain errors that could affect care quality.",
                "No specific results, benefits, or cures can be guaranteed through telehealth or associated laboratory testing.",
                "Your condition may not improve, and in some cases may worsen — in which case you will be referred to appropriate in-person care.",
                "You may withdraw consent in writing at any time without penalty, though this will affect your ability to use the platform, as our providers do not offer in-person treatment.",
                "You will provide truthful, accurate, and complete information — including current medications, medical history, and emergency contacts.",
                "You understand that online sessions will not be recorded by you or your provider.",
                "Hello Gorgeous Med Spa has commercial relationships with pharmacy and laboratory partners; you may obtain prescriptions from a pharmacy of your choice by contacting our support team.",
                "You are responsible for all costs associated with your care and will not submit claims to Medicare or other federal payors.",
              ].map((item, i) => <li key={i}>{item}</li>)}
            </ul>
            <div style={{marginTop:"1.5rem",paddingTop:"1.25rem",borderTop:"1px solid rgba(44,40,38,0.12)",fontSize:"13px",color:"#6B6360",lineHeight:"1.85"}}>
              <strong style={{fontSize:"11px",letterSpacing:"0.1em",textTransform:"uppercase",color:"#2C2826",fontWeight:500}}>Commercial relationships</strong><br /><br />
              Hello Gorgeous Med Spa has a financial relationship with the entity that employs or contracts with your provider, and commercial relationships with BPI Labs LLC, EHT Pharmacy LLC dba Curexa, XeCare LLC, Apostrophe Pharmacy LLC, Strive Specialties Inc., CD Pharmacy LLC (d/b/a Red Rock Pharmacy), AnazaoHealth Corporation, H&amp;H Labs LLC, Quest Diagnostics Incorporated, and Grail, Inc. You are free to receive examination from any provider not associated with our platform.
            </div>
          </div>

          <div className="signature-zone">
            <div className="sig-label">Patient Signature &amp; Confirmation</div>
            <div className="sig-grid">
              <div className="sig-field">
                <label htmlFor="patient-name">Full legal name</label>
                <input type="text" id="patient-name" placeholder="As it appears on your ID" autoComplete="name" />
              </div>
              <div className="sig-field">
                <label htmlFor="patient-dob">Date of birth</label>
                <input type="date" id="patient-dob" />
              </div>
              <div className="sig-field">
                <label htmlFor="today-date">Today&apos;s date</label>
                <input type="date" id="today-date" defaultValue={todayStr} />
              </div>
              <div className="sig-field">
                <label htmlFor="patient-state">State of residence</label>
                <select id="patient-state" defaultValue="">
                  <option value="" disabled>Select state</option>
                  {["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="sig-field full">
                <label htmlFor="patient-rel">Relationship to patient (if signing on behalf of a minor)</label>
                <select id="patient-rel" defaultValue="self">
                  <option value="self">I am the patient (18+)</option>
                  <option value="parent">Parent / Legal Guardian</option>
                  <option value="legal">Legal Representative</option>
                </select>
              </div>
            </div>

            <div className="sig-canvas-label">Your signature</div>
            <div className="sig-canvas-wrap" ref={wrapRef}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
            >
              <canvas ref={canvasRef} />
              <div className="sig-canvas-hint" ref={hintRef}>Sign here with your mouse or finger</div>
            </div>
            <button className="sig-clear" type="button" onClick={clearSig}>Clear signature</button>

            <div className="consent-checkbox">
              <input type="checkbox" id="agree-check" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
              <label htmlFor="agree-check">
                I have read, understood, and agree to the Authorization to Use and Disclose My Medical Information, Consent to Telehealth, and Open Payments Notice. I confirm that all information I have provided is true and accurate.
              </label>
            </div>

            <button className="agree-btn" type="button" onClick={handleSubmit}>
              I Agree — Submit Consent
            </button>
          </div>

          <div className="privacy-note">
            <strong style={{fontSize:"11px",letterSpacing:"0.1em",textTransform:"uppercase"}}>State-specific notices</strong><br /><br />
            <strong>California patients:</strong> Physicians and midwives are licensed and regulated by the Medical Board of California. To confirm a license or file a complaint, visit <a href="https://www.mbc.ca.gov" target="_blank" rel="noopener noreferrer">mbc.ca.gov</a> or call (800) 633-2322. The California Board of Behavioral Sciences handles complaints about licensed counselors, social workers, and therapists — reach them at <a href="https://www.bbs.ca.gov" target="_blank" rel="noopener noreferrer">bbs.ca.gov</a> or (916) 574-7830.<br /><br />
            For concerns about a provider in any state, contact your state's Medical Board. If you have questions about this consent, reach our patient services team at any time.
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginTop:"12px"}}>
              <a className="ext-link" href="https://openpaymentsdata.cms.gov" target="_blank" rel="noopener noreferrer">Open Payments Database</a>
              <a className="ext-link" href="https://www.mbc.ca.gov" target="_blank" rel="noopener noreferrer">CA Medical Board</a>
              <a className="ext-link" href="https://www.bbs.ca.gov" target="_blank" rel="noopener noreferrer">CA Behavioral Sciences Board</a>
            </div>
          </div>
        </div>

        <footer className="hg-footer">
          <div className="footer-brand">Hello <em>Gorgeous</em></div>
          <div className="footer-copy">© 2026 Hello Gorgeous Med Spa &nbsp;·&nbsp; All rights reserved &nbsp;·&nbsp; Confidential patient document</div>
        </footer>

        {submitted && (
          <div style={{
            position:"fixed",inset:0,background:"rgba(250,248,245,0.97)",
            zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",
            flexDirection:"column",gap:"1.5rem",textAlign:"center",padding:"2rem"
          }}>
            <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"64px",color:"#C4848A",lineHeight:1}}>✦</div>
            <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"28px",fontWeight:300,letterSpacing:"0.04em",color:"#2C2826"}}>Consent received</div>
            <div style={{fontSize:"14px",color:"#6B6360",maxWidth:"360px"}}>Your consent has been recorded. A copy will be available in your patient portal. Thank you for choosing Hello Gorgeous.</div>
            <div style={{fontSize:"12px",letterSpacing:"0.14em",textTransform:"uppercase",color:"#B89A72"}}>{submitDate}</div>
            <Link href="/" style={{marginTop:"1rem",fontSize:"13px",color:"#8A4F54",textDecoration:"underline"}}>Return home</Link>
          </div>
        )}
      </div>
    </>
  );
}
