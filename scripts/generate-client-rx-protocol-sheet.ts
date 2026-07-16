#!/usr/bin/env npx tsx
/**
 * Generates a CLIENT-ONLY Hello Gorgeous RX™ handout (print / PDF).
 * No staff notes — safe to give directly to patients.
 *
 *   npm run generate-client-rx-protocol
 */

import fs from "fs";
import path from "path";

import QRCode from "qrcode";
import sharp from "sharp";

import { PROGRAM_CONSULT_FEE_USD } from "../lib/flows";
import { PEPTIDE_PHARMACY_SHIPPING_USD } from "../lib/peptide-retail-pricing";
import { RX_TELEHEALTH_CADENCE_DAYS } from "../lib/rx-supply-cycle";

const OUT_PATH = path.join(process.cwd(), "docs/internal/client-rx-handout.html");
const LOGO_PATH = path.join(
  process.cwd(),
  "public/images/homepage-buyer-paths/hello-gorgeous-rx.png",
);

const SITE = {
  name: "Hello Gorgeous Med Spa",
  phone: "630-636-6193",
  street: "74 W. Washington Street",
  city: "Oswego",
  region: "IL",
  zip: "60543",
  url: "https://www.hellogorgeousmedspa.com",
};

const LINKS = {
  rxHub: `${SITE.url}/rx`,
  careHub: `${SITE.url}/rx/care`,
  startHere: `${SITE.url}/hello-gorgeous-rx/start-here`,
  peptideRequest: `${SITE.url}/peptide-request`,
  glp1Refill: `${SITE.url}/glp1-refill`,
  status: `${SITE.url}/rx/status`,
  messages: `${SITE.url}/rx/messages`,
  telehealth: `${SITE.url}/telehealth`,
  app: `${SITE.url}/app?rx=1`,
  getApp: `${SITE.url}/get-app`,
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function logoDataUri(): Promise<string> {
  if (!fs.existsSync(LOGO_PATH)) return "";
  // Landscape hero is 1024×576 — crop left branding panel so "Hello Gorgeous Rx" isn't clipped in a square thumb.
  const buf = await sharp(LOGO_PATH)
    .extract({ left: 0, top: 0, width: 540, height: 576 })
    .resize(400, 400, {
      fit: "contain",
      background: { r: 10, g: 5, b: 8, alpha: 1 },
    })
    .jpeg({ quality: 92 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

async function appQrDataUri(): Promise<string> {
  const url = new URL(LINKS.app);
  url.searchParams.set("utm_source", "qr");
  url.searchParams.set("utm_medium", "rx_handout");
  url.searchParams.set("utm_campaign", "client_protocol");
  const buf = await QRCode.toBuffer(url.toString(), {
    type: "png",
    width: 280,
    margin: 2,
    color: { dark: "#000000", light: "#FFFFFF" },
  });
  return `data:image/png;base64,${buf.toString("base64")}`;
}

function main() {
  void run();
}

async function run() {
  const updated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const logo = await logoDataUri();
  const appQr = await appQrDataUri();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Hello Gorgeous RX™ — Your Online Guide</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Georgia, "Times New Roman", serif; color: #111; background: #fafafa; line-height: 1.5; }
    .toolbar { position: sticky; top: 0; z-index: 10; background: #fff; border-bottom: 3px solid #000; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; font-family: system-ui, sans-serif; }
    .toolbar p { margin: 0; font-size: 13px; font-weight: 600; }
    .toolbar button { background: #E6007E; color: #fff; border: 2px solid #000; border-radius: 999px; padding: 10px 20px; font-weight: 700; cursor: pointer; font-size: 14px; }
    .toolbar button:hover { background: #000; }
    .sheet { max-width: 8.5in; margin: 20px auto 36px; background: #fff; box-shadow: 0 8px 32px rgba(230,0,126,.12); border: 4px solid #000; }
    .header { display: flex; align-items: center; gap: 20px; padding: 22px 24px; background: linear-gradient(125deg, #FF2D8E 0%, #E6007E 50%, #9b0a4d 100%); color: #fff; border-bottom: 4px solid #000; }
    .header img { width: 108px; height: 108px; border-radius: 14px; border: 3px solid #fff; object-fit: contain; flex-shrink: 0; box-shadow: 4px 4px 0 rgba(0,0,0,.25); background: #0d0508; }
    .header-text .eyebrow { font-family: system-ui, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.9; margin: 0; }
    .header-text h1 { margin: 6px 0 0; font-size: 24px; font-weight: 900; line-height: 1.15; font-family: system-ui, sans-serif; }
    .header-text .sub { margin: 8px 0 0; font-size: 14px; opacity: 0.95; font-family: system-ui, sans-serif; }
    .intro { padding: 18px 24px; background: #FFF0F7; border-bottom: 4px solid #000; font-size: 15px; font-family: system-ui, sans-serif; }
    .intro p { margin: 0; color: rgba(0,0,0,.82); }
    .pill-row { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 4px solid #000; font-family: system-ui, sans-serif; }
    .pill { padding: 14px 10px; text-align: center; border-right: 1px solid rgba(0,0,0,.1); background: #fff; }
    .pill:last-child { border-right: none; }
    .pill .emoji { font-size: 22px; display: block; margin-bottom: 4px; }
    .pill .lbl { font-size: 11px; font-weight: 800; color: #E6007E; margin: 0; line-height: 1.25; }
    .flow-title { margin: 0; padding: 12px 24px 0; font-family: system-ui, sans-serif; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; color: #E6007E; }
    .flow { display: grid; grid-template-columns: repeat(5, 1fr); border-bottom: 4px solid #000; font-family: system-ui, sans-serif; }
    .step { border-right: 1px solid rgba(0,0,0,.08); padding: 14px 12px; text-align: center; min-height: 108px; }
    .step:last-child { border-right: none; }
    .step:nth-child(even) { background: #FFF0F7; }
    .step .num { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #E6007E; color: #fff; font-weight: 900; font-size: 12px; border: 2px solid #000; margin-bottom: 6px; }
    .step .title { font-size: 11px; font-weight: 800; margin: 0 0 4px; }
    .step .desc { font-size: 10px; color: rgba(0,0,0,.6); margin: 0; line-height: 1.35; }
    .paths { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 4px solid #000; font-family: system-ui, sans-serif; }
    .path { padding: 16px 20px; border-right: 1px solid rgba(0,0,0,.1); }
    .path:last-child { border-right: none; background: #FFF0F7; }
    .path h3 { margin: 0 0 10px; font-size: 13px; font-weight: 900; color: #E6007E; }
    .path ol { margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.55; }
    .path li { margin-bottom: 4px; }
    .links-section { padding: 0 0 4px; font-family: system-ui, sans-serif; }
    .links-section h2 { margin: 0; padding: 14px 24px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #E6007E; border-bottom: 2px solid #000; background: #fff; }
    .link-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    .link-card { padding: 14px 18px; border-bottom: 1px solid rgba(0,0,0,.08); border-right: 1px solid rgba(0,0,0,.08); }
    .link-card:nth-child(even) { border-right: none; }
    .link-card:nth-child(4n+3), .link-card:nth-child(4n+4) { background: rgba(255,240,247,.5); }
    .link-card strong { display: block; font-size: 13px; margin-bottom: 2px; }
    .link-card span { font-size: 11px; color: rgba(0,0,0,.55); display: block; margin-bottom: 6px; line-height: 1.35; }
    .link-card a { font-size: 11px; color: #E6007E; font-weight: 700; word-break: break-all; text-decoration: none; }
    .tips { padding: 16px 24px; border-top: 4px solid #000; font-family: system-ui, sans-serif; background: #fff; }
    .tips h2 { margin: 0 0 10px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #E6007E; }
    .tips ul { margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.55; color: rgba(0,0,0,.8); }
    .tips li { margin-bottom: 5px; }
    .app-band { display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: center; padding: 20px 24px; border-top: 4px solid #000; border-bottom: 4px solid #000; background: linear-gradient(135deg, #FFF0F7 0%, #fff 55%, #FFF0F7 100%); font-family: system-ui, sans-serif; }
    .app-band h2 { margin: 0 0 8px; font-size: 18px; font-weight: 900; color: #E6007E; line-height: 1.2; }
    .app-band .tag { margin: 0 0 10px; font-size: 12px; font-weight: 700; color: rgba(0,0,0,.55); text-transform: uppercase; letter-spacing: 0.08em; }
    .app-band ul { margin: 0 0 10px; padding-left: 18px; font-size: 12px; line-height: 1.5; color: rgba(0,0,0,.8); }
    .app-band li { margin-bottom: 3px; }
    .app-band .link { font-size: 12px; font-weight: 800; color: #E6007E; word-break: break-all; }
    .app-band .steps { margin: 8px 0 0; font-size: 11px; color: rgba(0,0,0,.65); line-height: 1.45; }
    .app-qr-wrap { text-align: center; flex-shrink: 0; }
    .app-qr-wrap img { width: 118px; height: 118px; border: 3px solid #000; border-radius: 12px; padding: 6px; background: #fff; display: block; }
    .app-qr-wrap span { display: block; margin-top: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #E6007E; }
    .cta { text-align: center; padding: 18px 24px; background: #0a0a0a; color: #fff; border-top: 4px solid #000; font-family: system-ui, sans-serif; }
    .cta p { margin: 0 0 4px; font-size: 15px; font-weight: 800; color: #FFB8DC; }
    .cta .phone { font-size: 22px; font-weight: 900; letter-spacing: 0.02em; }
    .cta .addr { margin-top: 8px; font-size: 11px; opacity: 0.65; }
    .footer { text-align: center; font-size: 9px; color: rgba(0,0,0,.45); padding: 10px; font-family: system-ui, sans-serif; border-top: 1px solid rgba(0,0,0,.08); }
    @media print {
      body { background: #fff; }
      .toolbar { display: none !important; }
      .sheet { margin: 0; box-shadow: none; border: none; max-width: 100%; }
      @page { size: letter; margin: 0.4in; }
      .header, .num, .cta { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <p>Client handout — print or save as PDF to share with patients.</p>
    <button type="button" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <article class="sheet">
    <header class="header">
      ${logo ? `<img src="${logo}" alt="Hello Gorgeous RX" width="108" height="108" />` : ""}
      <div class="header-text">
        <h1>Your Online Refill Guide</h1>
        <p class="sub">Peptides &amp; medical weight loss · Ryan Kent, FNP-BC · ${escapeHtml(SITE.city)}, ${escapeHtml(SITE.region)}</p>
      </div>
    </header>

    <div class="intro">
      <p>
        <strong>Welcome!</strong> Most of your refill happens on your phone — forms, telehealth booking,
        payment, tracking, and private messaging with our team. Save this sheet and bookmark your
        <strong>care hub</strong> link below.
      </p>
    </div>

    <div class="pill-row">
      <div class="pill"><span class="emoji">📍</span><p class="lbl">Track your order</p></div>
      <div class="pill"><span class="emoji">💬</span><p class="lbl">Message us 24/7</p></div>
      <div class="pill"><span class="emoji">💳</span><p class="lbl">Pay by text or email</p></div>
      <div class="pill"><span class="emoji">📅</span><p class="lbl">Book on Fresha</p></div>
    </div>

    <p class="flow-title">Your journey — five simple steps</p>
    <div class="flow">
      <div class="step"><div class="num">1</div><p class="title">Tell us what you need</p><p class="desc">Submit your refill or new protocol form online</p></div>
      <div class="step"><div class="num">2</div><p class="title">Video visit</p><p class="desc">Book Ryan on Fresha (${PROGRAM_CONSULT_FEE_USD === 49 ? "$49 consult for new protocols" : "consult fee applies for new protocols"})</p></div>
      <div class="step"><div class="num">3</div><p class="title">Pay your invoice</p><p class="desc">Secure link by text or email — pay on your phone</p></div>
      <div class="step"><div class="num">4</div><p class="title">Clinical review</p><p class="desc">Ryan approves your protocol for the pharmacy</p></div>
      <div class="step"><div class="num">5</div><p class="title">Delivered to you</p><p class="desc">Cold-chain shipping to your door</p></div>
    </div>

    <div class="paths">
      <div class="path">
        <h3>✨ First time with us?</h3>
        <ol>
          <li>Visit our RX home page &amp; pick a program</li>
          <li>Complete your intake form</li>
          <li>Pay your NP consult when prompted</li>
          <li>Book your Square telehealth visit</li>
          <li>Save your confirmation email — it has your personal status link</li>
        </ol>
      </div>
      <div class="path">
        <h3>🔄 Already an RX patient?</h3>
        <ol>
          <li>Open your <strong>care hub</strong> &amp; submit your refill</li>
          <li>Choose <strong>90-day supply</strong> (most popular) or 30-day</li>
          <li>Pay the invoice we text or email you</li>
          <li>Book Fresha only if your dose changed or it&apos;s been ${RX_TELEHEALTH_CADENCE_DAYS}+ days</li>
          <li>Check your status page anytime for shipping updates</li>
        </ol>
      </div>
    </div>

    <section class="links-section">
      <h2>Your links — save these on your phone</h2>
      <div class="link-grid">
        <div class="link-card">
          <strong>Care hub</strong>
          <span>Refills, add-ons &amp; patient guides — start here every time</span>
          <a href="${escapeHtml(LINKS.careHub)}">${escapeHtml(LINKS.careHub.replace("https://", ""))}</a>
        </div>
        <div class="link-card">
          <strong>Track my refill</strong>
          <span>See where you are: form → visit → pay → ship</span>
          <a href="${escapeHtml(LINKS.status)}">${escapeHtml(LINKS.status.replace("https://", ""))}</a>
        </div>
        <div class="link-card">
          <strong>Message our team</strong>
          <span>Private, secure chat — we reply during business hours</span>
          <a href="${escapeHtml(LINKS.messages)}">${escapeHtml(LINKS.messages.replace("https://", ""))}</a>
        </div>
        <div class="link-card">
          <strong>Book telehealth</strong>
          <span>Schedule your NP video visit on Fresha</span>
          <a href="${escapeHtml(LINKS.telehealth)}">${escapeHtml(LINKS.telehealth.replace("https://", ""))}</a>
        </div>
        <div class="link-card">
          <strong>GLP-1 refill</strong>
          <span>Semaglutide &amp; tirzepatide — existing weight-loss patients</span>
          <a href="${escapeHtml(LINKS.glp1Refill)}">${escapeHtml(LINKS.glp1Refill.replace("https://", ""))}</a>
        </div>
        <div class="link-card">
          <strong>Peptide request</strong>
          <span>New protocol or peptide refill form</span>
          <a href="${escapeHtml(LINKS.peptideRequest)}">${escapeHtml(LINKS.peptideRequest.replace("https://", ""))}</a>
        </div>
        <div class="link-card">
          <strong>Explore RX programs</strong>
          <span>Peptides, weight loss &amp; wellness RX overview</span>
          <a href="${escapeHtml(LINKS.rxHub)}">${escapeHtml(LINKS.rxHub.replace("https://", ""))}</a>
        </div>
        <div class="link-card">
          <strong>Hello Gorgeous app</strong>
          <span>RX hub, refills, book &amp; rewards — add to home screen</span>
          <a href="${escapeHtml(LINKS.app)}">${escapeHtml(LINKS.app.replace("https://", ""))}</a>
        </div>
        <div class="link-card">
          <strong>Start Here (peptides)</strong>
          <span>Step-by-step peptide program picker</span>
          <a href="${escapeHtml(LINKS.startHere)}">${escapeHtml(LINKS.startHere.replace("https://", ""))}</a>
        </div>
      </div>
    </section>

    <section class="tips">
      <h2>Helpful to know</h2>
      <ul>
        <li><strong>90-day supply</strong> is our most popular option — prepay three months and one shipping fee (typically $${PEPTIDE_PHARMACY_SHIPPING_USD}) per cycle.</li>
        <li><strong>Telehealth</strong> is usually every ${RX_TELEHEALTH_CADENCE_DAYS} days when your dose is stable — not every month.</li>
        <li><strong>Payment links</strong> come by text and/or email. Tap the link and pay securely on your phone.</li>
        <li><strong>Your status link</strong> in your confirmation email opens your personal tracker — no password needed.</li>
        <li><strong>Get the app</strong> — scan the QR below for RX refills, booking &amp; messaging on your home screen (no App Store).</li>
        <li><strong>Questions?</strong> Message us online or call — we&apos;re happy to walk you through any step.</li>
      </ul>
    </section>

    <section class="app-band">
      <div>
        <p class="tag">📱 Free · No App Store</p>
        <h2>Get the Hello Gorgeous App</h2>
        <ul>
          <li><strong>RX refills &amp; care hub</strong> — GLP-1, peptides &amp; guides in one tap</li>
          <li><strong>Track your refill</strong> — status, pay &amp; secure messages</li>
          <li><strong>Book</strong> — Botox, facials, Vitamin Bar &amp; more</li>
          <li><strong>HG Rewards</strong> — points, deals &amp; memberships</li>
        </ul>
        <a class="link" href="${escapeHtml(LINKS.app)}">${escapeHtml(LINKS.app.replace("https://", ""))}</a>
        <p class="steps"><strong>How:</strong> Scan the QR → open the link on your phone → tap <strong>Share</strong> → <strong>Add to Home Screen</strong>.</p>
      </div>
      <div class="app-qr-wrap">
        <img src="${appQr}" alt="Scan to get the Hello Gorgeous app" width="118" height="118" />
        <span>Scan to get the app</span>
      </div>
    </section>

    <div class="cta">
      <p>We&apos;re here for you</p>
      <div class="phone">${escapeHtml(SITE.phone)}</div>
      <div class="addr">${escapeHtml(SITE.street)} · ${escapeHtml(SITE.city)}, ${escapeHtml(SITE.region)} ${escapeHtml(SITE.zip)}<br>${escapeHtml(SITE.url)}</div>
    </div>

    <footer class="footer">
      Hello Gorgeous RX™ · Updated ${escapeHtml(updated)} · © ${new Date().getFullYear()} ${escapeHtml(SITE.name)}
    </footer>
  </article>
</body>
</html>`;

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, html, "utf8");

  const desktopPath = path.join(
    process.env.HOME || "",
    "Desktop",
    "Hello-Gorgeous-RX-Your-Online-Guide.html",
  );
  if (process.env.HOME) {
    fs.copyFileSync(OUT_PATH, desktopPath);
    console.log(`✅ Desktop copy: ${desktopPath}`);
  }

  console.log(`✅ Client handout: ${OUT_PATH}`);
  console.log("   Print → Save as PDF — ready to hand to patients\n");
}

main();
