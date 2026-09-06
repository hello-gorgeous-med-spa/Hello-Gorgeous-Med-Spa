"use client";

import {
  TRYREGEN_BUNDLES,
  TRYREGEN_BUNDLES_LEGAL,
  tryregenBundleRetailUsd,
  tryregenBundleShippingUsd,
} from "@/lib/regen/tryregen-bundles";
import {
  REGEN_CLIENT_FLYER_PORTRAIT,
  REGEN_CLIENT_FLYER_SITE_URL,
  REGEN_CLIENT_FLYER_START_URL,
} from "@/lib/regen-client-flyer";
import { SITE } from "@/lib/seo";

const PROGRAMS = [
  { name: "Weight loss", detail: "Tirzepatide & semaglutide — NP-guided", from: "from $100" },
  { name: "Hormones", detail: "Women’s HRT & men’s TRT", from: "from $149" },
  { name: "Vitamins", detail: "B12, biotin, glutathione, NAD+", from: "from $73" },
  { name: "Bundles", detail: "Peptide stacks · one price · one ship", from: "from $200" },
] as const;

const TAG_COLOR: Record<string, string> = {
  Repair: "#0D9488",
  Skin: "#E91E8C",
  Energy: "#F59E0B",
  Focus: "#38BDF8",
  Glow: "#FF2D8E",
};

const STEPS = [
  { n: "01", t: "Start your visit", d: "2–5 minutes on your phone. Free to submit." },
  { n: "02", t: "Ryan reviews", d: "Ryan Kent, FNP-BC reads your history and labs." },
  { n: "03", t: "If appropriate", d: "He prescribes only when it is clinically right for you." },
  { n: "04", t: "It ships", d: "Illinois doorstep. You stay with the same Hello Gorgeous team." },
] as const;

const BUNDLE_BLURB: Record<string, string> = {
  recovery: "BPC-157 / TB-500 — the repair conversation people ask for most.",
  "skin-repair": "BPC-157 / TB-500 / GHK-Cu — skin and tissue in one vial.",
  "full-recovery": "BPC-157 / GHK-Cu / KPV / TB-500 — the four-way vial.",
  heal: "BPC-157 / KPV / TB-500 — a quieter repair stack.",
  peak: "CJC-1295 / Ipamorelin + NAD+ — two vials, one cold ship.",
  neuro: "Semax / Selank — the focus vial.",
  "nad-sermorelin": "NAD+ + sermorelin — energy and GH support together.",
  radiance: "Glutathione + NAD+ — the glow-and-energy pair.",
};

type Props = { qrDataUrl: string };

export function RegenClientFlyer({ qrDataUrl }: Props) {
  const ship = tryregenBundleShippingUsd();
  const bundles = TRYREGEN_BUNDLES.map((b) => ({
    ...b,
    price: tryregenBundleRetailUsd(b),
    blurb: BUNDLE_BLURB[b.id] ?? b.description,
  }));

  return (
    <div className="flyer-root">
      <div className="flyer-screen print:hidden">
        <p>
          Print in <strong>color, letter, actual size</strong> — or{" "}
          <strong>Print → Save as PDF</strong> to text or email clients.
        </p>
        <button type="button" onClick={() => window.print()}>
          Print / save PDF
        </button>
      </div>

      {/* PAGE 1 — cover */}
      <article className="flyer-page flyer-cover">
        <div className="flyer-colorbar" aria-hidden />
        <div className="flyer-cover-grid">
          <div className="flyer-cover-copy">
            <p className="flyer-kicker">A Hello Gorgeous partnership</p>
            <img
              src="/images/regen/logo-full.png"
              alt="REGEN RX"
              className="flyer-logo"
            />
            <p className="flyer-renew">Renew. Rebalance. Regenerate.</p>
            <h1>The prescription door we opened for you.</h1>
            <p className="flyer-lede">
              Hello Gorgeous is still your studio on Washington Street. REGEN RX is
              how you keep working with <strong>Ryan Kent, FNP-BC</strong> without
              living in the waiting room — weight loss, hormones, vitamins, and
              stacks he can prescribe when it is clinically appropriate.
            </p>

            <div className="flyer-steps">
              {STEPS.map((s) => (
                <div key={s.n} className="flyer-step">
                  <span>{s.n}</span>
                  <div>
                    <strong>{s.t}</strong>
                    <em>{s.d}</em>
                  </div>
                </div>
              ))}
            </div>

            <div className="flyer-programs">
              {PROGRAMS.map((p) => (
                <div key={p.name} className="flyer-program">
                  <b>{p.name}</b>
                  <small>{p.detail}</small>
                  <em>{p.from}</em>
                </div>
              ))}
            </div>
          </div>

          <aside className="flyer-cover-photo">
            <img src={REGEN_CLIENT_FLYER_PORTRAIT} alt="" />
            <div className="flyer-photo-shade" />
            <div className="flyer-qr-card">
              <img src={qrDataUrl} alt="Scan to start REGEN RX" />
              <p>
                Scan to start
                <strong>tryregenrx.com/start</strong>
              </p>
            </div>
          </aside>
        </div>

        <footer className="flyer-footer">
          <p>
            {SITE.phone} · {SITE.address.streetAddress}, {SITE.address.addressLocality},{" "}
            {SITE.address.addressRegion} {SITE.address.postalCode} · Illinois patients only ·{" "}
            <span className="flyer-footer-url">
              {REGEN_CLIENT_FLYER_SITE_URL.replace("https://", "")}
            </span>
          </p>
        </footer>
      </article>

      {/* PAGE 2 — bundles */}
      <article className="flyer-page flyer-bundles">
        <div className="flyer-colorbar" aria-hidden />
        <header className="flyer-bundles-head">
          <p className="flyer-kicker">REGEN RX · Bundles</p>
          <h2>Request a stack. Ryan decides.</h2>
          <p>
            One card. One price. One ${ship} cold ship. You are asking for a consult —
            not buying a vial off a shelf. Compounded medications are not FDA-approved.
          </p>
        </header>

        <div className="flyer-bundle-grid">
          {bundles.map((b) => (
            <div key={b.id} className="flyer-bundle">
              <span style={{ color: TAG_COLOR[b.tagline] ?? "#0D9488" }}>{b.tagline}</span>
              <h3>{b.name}</h3>
              <p>{b.blurb}</p>
              <ul>
                {b.boomrxSheetNames.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
              <strong>
                ${b.price}
                <small>+ ${ship} ship</small>
              </strong>
            </div>
          ))}
        </div>

        <div className="flyer-bundles-cta">
          <div>
            <p className="flyer-kicker">Start today</p>
            <h3>Same Danielle. Same Ryan. New door.</h3>
            <p>
              Ask us before you leave, or start on your phone tonight.{" "}
              <strong>{REGEN_CLIENT_FLYER_START_URL.replace("https://", "")}</strong>
            </p>
          </div>
          <div className="flyer-qr-card flyer-qr-card-light">
            <img src={qrDataUrl} alt="Scan to start REGEN RX" />
            <p>
              Scan to start
              <strong>tryregenrx.com/start</strong>
            </p>
          </div>
        </div>

        <footer className="flyer-footer flyer-footer-light">
          <p>{TRYREGEN_BUNDLES_LEGAL}</p>
          <p>
            {SITE.phone} · Hello Gorgeous Med Spa · {SITE.address.addressLocality}, IL
          </p>
        </footer>
      </article>

      <style>{`
        .flyer-root {
          background: #1a1a1a;
          color: #FAF9F6;
          font-family: var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .flyer-screen {
          max-width: 8.5in;
          margin: 0 auto;
          padding: 20px 16px 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .flyer-screen p { font-size: 13px; color: #9CA3AF; }
        .flyer-screen button {
          background: linear-gradient(135deg, #FF2D8E, #E91E8C);
          color: #fff;
          border: 0;
          border-radius: 999px;
          padding: 10px 18px;
          font-weight: 800;
          cursor: pointer;
        }
        .flyer-page {
          width: 8.5in;
          height: 11in;
          margin: 16px auto;
          overflow: hidden;
          position: relative;
          box-shadow: 0 24px 80px rgba(0,0,0,0.45);
        }
        .flyer-cover {
          background:
            radial-gradient(ellipse 70% 50% at 10% 0%, rgba(13,148,136,0.28), transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 100%, rgba(233,30,140,0.22), transparent 50%),
            #0A0A0A;
          display: flex;
          flex-direction: column;
        }
        .flyer-colorbar {
          height: 5px;
          background: linear-gradient(90deg, #0D9488 0%, #0D9488 48%, #E91E8C 52%, #E91E8C 100%);
          flex: 0 0 5px;
        }
        .flyer-cover-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          min-height: 0;
        }
        .flyer-cover-copy { padding: 0.42in 0.38in 0.2in 0.42in; }
        .flyer-kicker {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 800;
          color: #0D9488;
          margin: 0 0 10px;
        }
        .flyer-logo { height: 52px; width: auto; display: block; margin-bottom: 8px; }
        .flyer-renew {
          color: #E91E8C;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 800;
          margin: 0 0 14px;
        }
        .flyer-cover h1 {
          font-family: var(--font-playfair), "Playfair Display", Georgia, serif;
          font-size: 34px;
          line-height: 1.08;
          font-weight: 800;
          margin: 0 0 12px;
          color: #FAF9F6;
        }
        .flyer-lede {
          font-size: 13px;
          line-height: 1.45;
          color: #C4C4C4;
          margin: 0 0 16px;
        }
        .flyer-lede strong { color: #fff; }
        .flyer-steps { display: grid; gap: 8px; margin-bottom: 16px; }
        .flyer-step { display: flex; gap: 10px; align-items: flex-start; }
        .flyer-step span {
          flex: 0 0 28px;
          height: 28px;
          border-radius: 8px;
          background: #E91E8C;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .flyer-step strong { display: block; font-size: 12.5px; color: #fff; }
        .flyer-step em { display: block; font-style: normal; font-size: 11px; color: #9CA3AF; }
        .flyer-programs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .flyer-program {
          border: 1px solid rgba(13,148,136,0.35);
          background: rgba(13,148,136,0.08);
          border-radius: 12px;
          padding: 8px 10px;
        }
        .flyer-program b { display: block; font-size: 12px; color: #fff; }
        .flyer-program small { display: block; font-size: 10px; color: #9CA3AF; }
        .flyer-program em { display: block; font-style: normal; font-size: 11px; font-weight: 800; color: #E91E8C; margin-top: 2px; }
        .flyer-cover-photo { position: relative; }
        .flyer-cover-photo > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 18%;
          display: block;
        }
        .flyer-photo-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 45%, rgba(10,10,10,0.88) 100%);
        }
        .flyer-qr-card {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 18px;
          background: rgba(250,249,246,0.96);
          color: #0A0A0A;
          border-radius: 14px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .flyer-qr-card img { width: 78px; height: 78px; border-radius: 8px; }
        .flyer-qr-card p { margin: 0; font-size: 11px; color: #4B5563; }
        .flyer-qr-card strong { display: block; color: #E91E8C; font-size: 12.5px; }
        .flyer-footer {
          padding: 10px 0.42in 14px;
          font-size: 10px;
          color: #7A7A7A;
          border-top: 1px solid rgba(13,148,136,0.25);
        }
        .flyer-footer p { margin: 0; }
        .flyer-footer-url { color: #E91E8C; font-weight: 800; }
        .flyer-bundles {
          background:
            radial-gradient(ellipse 60% 40% at 100% 0%, rgba(233,30,140,0.16), transparent 50%),
            #0A0A0A;
          display: flex;
          flex-direction: column;
          padding: 0 0.38in 0.22in;
        }
        .flyer-bundles .flyer-colorbar { margin: 0 -0.38in 0.28in; }
        .flyer-bundles-head h2 {
          font-family: var(--font-playfair), "Playfair Display", Georgia, serif;
          font-size: 32px;
          margin: 0 0 8px;
        }
        .flyer-bundles-head p {
          margin: 0 0 16px;
          color: #C4C4C4;
          font-size: 13px;
          max-width: 6.6in;
        }
        .flyer-bundle-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          flex: 1;
          align-content: start;
        }
        .flyer-bundle {
          border: 1px solid rgba(13,148,136,0.32);
          background: #111;
          border-radius: 14px;
          padding: 11px 12px 10px;
        }
        .flyer-bundle span {
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 800;
          color: #0D9488;
        }
        .flyer-bundle h3 {
          margin: 3px 0 4px;
          font-size: 16px;
          font-family: var(--font-playfair), "Playfair Display", Georgia, serif;
        }
        .flyer-bundle p { margin: 0; font-size: 11px; color: #B0B0B0; line-height: 1.35; }
        .flyer-bundle ul {
          margin: 6px 0 8px;
          padding: 0;
          list-style: none;
        }
        .flyer-bundle li { font-size: 10px; color: #FAF9F6; }
        .flyer-bundle strong {
          display: flex;
          align-items: baseline;
          gap: 8px;
          color: #E91E8C;
          font-size: 20px;
        }
        .flyer-bundle small { font-size: 11px; color: #9CA3AF; font-weight: 700; }
        .flyer-bundles-cta {
          margin-top: 12px;
          border: 1px solid rgba(233,30,140,0.4);
          background: linear-gradient(120deg, #1a0a12, #0d2a28);
          border-radius: 16px;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .flyer-bundles-cta h3 {
          font-family: var(--font-playfair), "Playfair Display", Georgia, serif;
          font-size: 20px;
          margin: 0 0 4px;
        }
        .flyer-bundles-cta p { margin: 0; font-size: 12px; color: #C4C4C4; }
        .flyer-qr-card-light { position: static; min-width: 220px; }
        .flyer-footer-light { padding: 10px 0 0; border-top: 0; display: block; }
        .flyer-footer-light p { margin: 0 0 4px; white-space: normal; }
        @media print {
          @page { size: letter portrait; margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; background: #0A0A0A !important; }
          .flyer-root { background: #000; }
          .flyer-page { margin: 0; box-shadow: none; page-break-after: always; break-after: page; }
          .flyer-page:last-of-type { page-break-after: auto; break-after: auto; }
        }
      `}</style>
    </div>
  );
}
