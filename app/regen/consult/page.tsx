import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { RegenPublicNav } from "@/components/regen/RegenPublicNav";
import {
  RegenTelehealthBookButton,
  regenTelehealthButtonStyle,
} from "@/components/regen/RegenTelehealthBookButton";
import {
  REGEN_TELEHEALTH_BLURB,
  REGEN_TELEHEALTH_CREDIT_LINE,
  REGEN_TELEHEALTH_CREDIT_SHORT,
  REGEN_TELEHEALTH_DURATION,
  REGEN_TELEHEALTH_FEE_USD,
  REGEN_TELEHEALTH_PROVIDER,
} from "@/lib/regen/telehealth-consult";

export const metadata: Metadata = {
  title: `Book ${REGEN_TELEHEALTH_PROVIDER} — $${REGEN_TELEHEALTH_FEE_USD} video consult`,
  description: REGEN_TELEHEALTH_BLURB,
};

const BRAND = {
  teal: "#0D9488",
  pink: "#E91E8C",
  dark: "#0a0a0a",
};

const STEPS = [
  {
    n: "01",
    title: "Pick a time on Ryan's calendar",
    body: `${REGEN_TELEHEALTH_DURATION} on Square. Illinois adults 21+ only.`,
  },
  {
    n: "02",
    title: "Talk before you buy therapy",
    body: "Ask questions. He reviews whether a request is appropriate. A visit is not a guaranteed prescription.",
  },
  {
    n: "03",
    title: "Credit if you move forward",
    body: REGEN_TELEHEALTH_CREDIT_LINE,
  },
] as const;

export default function ConsultPage() {
  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: "100vh", color: "#fff" }}>
      <RegenPublicNav />

      <section
        style={{
          padding: "72px 24px 48px",
          background: `linear-gradient(135deg, ${BRAND.dark} 0%, #0d1f1d 50%, ${BRAND.dark} 100%)`,
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: BRAND.teal,
              border: `1px solid ${BRAND.teal}50`,
              backgroundColor: `${BRAND.teal}18`,
              marginBottom: 20,
            }}
          >
            Video first · no therapy purchase required
          </p>
          <h1
            style={{
              fontSize: "clamp(32px, 6vw, 52px)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Book {REGEN_TELEHEALTH_PROVIDER}
            <br />
            <span style={{ color: BRAND.pink }}>before you buy.</span>
          </h1>
          <p style={{ fontSize: 18, color: "#aaa", maxWidth: 640, margin: "0 auto 28px", lineHeight: 1.6 }}>
            {REGEN_TELEHEALTH_BLURB}
          </p>

          <div
            style={{
              display: "inline-block",
              padding: "20px 28px",
              borderRadius: 20,
              border: `2px solid ${BRAND.pink}`,
              background: `linear-gradient(135deg, ${BRAND.pink}18 0%, ${BRAND.teal}12 100%)`,
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 900, color: BRAND.pink, lineHeight: 1 }}>
              ${REGEN_TELEHEALTH_FEE_USD}
            </div>
            <div style={{ fontSize: 13, color: "#bbb", marginTop: 6 }}>{REGEN_TELEHEALTH_DURATION}</div>
            <div style={{ fontSize: 13, color: BRAND.teal, fontWeight: 700, marginTop: 8 }}>
              {REGEN_TELEHEALTH_CREDIT_SHORT}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <RegenTelehealthBookButton style={regenTelehealthButtonStyle} />
            <Link
              href="/start"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                borderRadius: 12,
                border: `2px solid ${BRAND.teal}`,
                color: BRAND.teal,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Already know what you want?
            </Link>
          </div>
          <p style={{ fontSize: 13, color: "#777", marginTop: 16, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            Starting a request online still pays for therapy first. If you want to talk first and skip that refund dance, book the visit.
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {STEPS.map((step) => (
            <div
              key={step.n}
              style={{
                padding: 24,
                borderRadius: 20,
                backgroundColor: "#111",
                border: `1px solid ${BRAND.teal}30`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: BRAND.teal, marginBottom: 8 }}>{step.n}</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{step.title}</h2>
              <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.6, margin: 0 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 24px 72px", maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Good to know</h2>
        <dl style={{ display: "grid", gap: 20, margin: 0 }}>
          <div>
            <dt style={{ fontWeight: 700, color: BRAND.pink, marginBottom: 6 }}>What if Ryan does not prescribe?</dt>
            <dd style={{ margin: 0, color: "#aaa", lineHeight: 1.6 }}>
              You paid for the visit, not for a vial. There is no therapy charge to refund. The visit fee is not refunded.
            </dd>
          </div>
          <div>
            <dt style={{ fontWeight: 700, color: BRAND.pink, marginBottom: 6 }}>How does the credit work?</dt>
            <dd style={{ margin: 0, color: "#aaa", lineHeight: 1.6 }}>
              {REGEN_TELEHEALTH_CREDIT_LINE} Tell us you already saw Ryan when you start your order — we apply the{" "}
              ${REGEN_TELEHEALTH_FEE_USD} against that first medication charge (shipping stays as shown at checkout).
            </dd>
          </div>
          <div>
            <dt style={{ fontWeight: 700, color: BRAND.pink, marginBottom: 6 }}>Illinois only</dt>
            <dd style={{ margin: 0, color: "#aaa", lineHeight: 1.6 }}>
              REGEN is for Illinois adults 21+. Compounded medication is not FDA-approved. A consult is not a guaranteed
              prescription, dose, or result.
            </dd>
          </div>
        </dl>

        <div style={{ marginTop: 36, textAlign: "center" }}>
          <RegenTelehealthBookButton style={regenTelehealthButtonStyle} />
          <p style={{ fontSize: 13, color: "#666", marginTop: 16 }}>
            Questions?{" "}
            <a href="tel:+16306366193" style={{ color: BRAND.teal }}>
              (630) 636-6193
            </a>
          </p>
        </div>
      </section>

      <footer style={{ padding: "32px 24px", borderTop: "1px solid #222", textAlign: "center" }}>
        <Link href="/">
          <Image
            src="/images/regen/logo-full.png"
            alt="REGEN RX"
            width={140}
            height={44}
            style={{ height: 36, width: "auto", opacity: 0.85 }}
          />
        </Link>
      </footer>
    </div>
  );
}
