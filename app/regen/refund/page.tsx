import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Refund Policy | REGEN RX",
  description:
    "Refund policy for REGEN RX. A request is not a prescription. Medication is invoiced only after a clinician approves a plan. Compounded medication cannot be returned after the pharmacy prepares it.",
  alternates: { canonical: "https://tryregenrx.com/refund" },
};

const BRAND = {
  teal: "#0D9488",
  dark: "#0a0a0a",
  darkAlt: "#111",
  gray: "#888",
  cream: "#f5f5f5",
};

export default function RegenRefundPage() {
  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: "100vh", color: "#ccc" }}>
      <header style={{ padding: "20px 24px", borderBottom: "1px solid #222" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={160} height={50} className="h-12 w-auto brightness-110" />
          </Link>
          <nav style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/hipaa" style={{ color: BRAND.gray, fontSize: 14 }}>HIPAA</Link>
            <Link href="/privacy" style={{ color: BRAND.gray, fontSize: 14 }}>Privacy</Link>
            <Link href="/terms" style={{ color: BRAND.gray, fontSize: 14 }}>Terms</Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ color: BRAND.teal, fontWeight: 700, letterSpacing: "0.04em" }}>HELLO GORGEOUS, P.C.</p>
        <h1 style={{ color: BRAND.cream, fontSize: 40, margin: "8px 0 12px" }}>Refund Policy</h1>
        <p style={{ color: BRAND.gray }}>REGEN RX · tryregenrx.com · Oswego, Illinois</p>

        <p>
          This website does not take a card and does not sell medication. A request is not a prescription.
          Ryan Kent, FNP-BC reviews every request. If he approves a plan, Hello Gorgeous, P.C. sends a clinic
          invoice. The pharmacy prepares the prescription only after that invoice is paid.
        </p>

        <h2 style={{ color: BRAND.cream }}>If the clinician does not prescribe</h2>
        <p>
          An unpaid request that is declined has no medication charge. Nothing ships.
        </p>
        <p>
          A completed consult is a paid visit. That visit fee is not refunded if the clinician does not prescribe.
        </p>

        <h2 style={{ color: BRAND.cream }}>Before the pharmacy compounds</h2>
        <p>
          If you cancel a paid medication invoice before the pharmacy compounds the prescription, we refund the
          medication charge. Shipping that was not used is refunded with it.
        </p>

        <h2 style={{ color: BRAND.cream }}>After the pharmacy compounds or ships</h2>
        <p>
          Compounded medication is prepared for one patient and cannot be returned to stock. After the pharmacy
          compounds or ships, the medication charge and shipping are not refunded.
        </p>

        <h2 style={{ color: BRAND.cream }}>Side effects or stopping early</h2>
        <p>
          Contact the clinic. The clinician reviews whether to stop the medication. A refund is not automatic.
        </p>

        <h2 style={{ color: BRAND.cream }}>Duplicate or wrong charges</h2>
        <p>A duplicate charge or a charge sent in error is refunded.</p>

        <h2 style={{ color: BRAND.cream }}>Ask about a charge</h2>
        <p>
          Hello Gorgeous, P.C.<br />
          74 W. Washington Street, Oswego, IL 60543<br />
          <a href="tel:+16306366193" style={{ color: BRAND.teal }}>(630) 636-6193</a>
          <br />
          <a href="mailto:hello@tryregenrx.com" style={{ color: BRAND.teal }}>hello@tryregenrx.com</a>
        </p>
        <p>
          Also read our <Link href="/terms" style={{ color: BRAND.teal }}>Terms of Service</Link>,{" "}
          <Link href="/privacy" style={{ color: BRAND.teal }}>Privacy Policy</Link>, and{" "}
          <Link href="/hipaa" style={{ color: BRAND.teal }}>HIPAA Notice</Link>.
        </p>
      </main>
    </div>
  );
}
