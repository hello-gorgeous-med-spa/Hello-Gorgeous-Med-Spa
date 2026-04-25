import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { CONSENT_IFRAME_BY_SLUG } from "@/lib/consent-iframe-by-slug";
import { LUXORA_DOC_URLS } from "@/lib/luxora-doc-urls";
import ProcedurePrePostQrSection from "@/components/patient/ProcedurePrePostQrSection";

const HUB_INTAKE = "https://hub.hellogorgeousmedspa.com/intake";

export const metadata: Metadata = pageMetadata({
  title: "Patient Documents | Pre, Post & Consent | Hello Gorgeous Med Spa",
  description:
    "Pre- and post-treatment guides and consent resources for Solaria CO₂, Morpheus8, Quantum RF, and Luxora (InMode) at Hello Gorgeous Med Spa, Oswego, IL. Complete on your own device or at check-in.",
  path: "/patient-documents",
});

type DocGroup = {
  title: string;
  procedure: string;
  items: { label: string; href: string; note?: string }[];
};

const WEB_GUIDES: DocGroup[] = [
  {
    title: "Morpheus8",
    procedure: "RF microneedling",
    items: [
      { label: "Pre & post care (Burst)", href: "/pre-post-care/morpheus8-burst" },
    ],
  },
  {
    title: "Solaria CO₂",
    procedure: "Fractional laser",
    items: [{ label: "Pre & post care (web guide)", href: "/pre-post-care/solaria-co2" }],
  },
  {
    title: "Quantum RF",
    procedure: "Subdermal contouring",
    items: [{ label: "Pre & post care", href: "/pre-post-care/quantum-rf" }],
  },
];

export default function PatientDocumentsPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="border-b-2 border-black bg-zinc-50">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#E6007E]">Patient resources</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Pre, post & consent</h1>
          <p className="mt-4 text-base leading-relaxed text-black/75">
            <strong>Scan a QR code</strong> below to open pre- and post-care guides on your phone—no app required. You
            can also use the same links on a tablet or computer. Consent and education documents are available further
            down the page. Need a paper copy? Ask us at the front desk or when you check in.
          </p>
        </div>
      </section>

      <ProcedurePrePostQrSection />

      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-xl font-bold">Luxora (InMode) — pre, post, consent, reference</h2>
          <p className="mt-2 text-sm text-black/70">
            Read the same informed consent, pre- and post-treatment, and InMode reference we use in clinic. For
            education only—your care team will guide signing at your visit if needed.{" "}
            <a className="font-semibold text-[#E6007E] hover:underline" href={HUB_INTAKE}>
              Digital check-in
            </a>{" "}
            is available on your phone when we ask you to complete consent on our check-in page.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                className="font-medium text-[#E6007E] hover:underline"
                href={LUXORA_DOC_URLS.consentHtml}
                target="_blank"
                rel="noopener noreferrer"
              >
                Informed consent (HTML)
              </a>
            </li>
            <li>
              <a
                className="font-medium text-[#E6007E] hover:underline"
                href={LUXORA_DOC_URLS.preHtml}
                target="_blank"
                rel="noopener noreferrer"
              >
                Pre-treatment guide (HTML)
              </a>
            </li>
            <li>
              <a
                className="font-medium text-[#E6007E] hover:underline"
                href={LUXORA_DOC_URLS.postHtml}
                target="_blank"
                rel="noopener noreferrer"
              >
                Post-treatment guide (HTML)
              </a>
            </li>
            <li>
              <a
                className="font-medium text-[#E6007E] hover:underline"
                href={LUXORA_DOC_URLS.inServiceInstructionsPdf}
                target="_blank"
                rel="noopener noreferrer"
              >
                InService Instructions — InMode (PDF, Aug 2025)
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-xl font-bold">Solaria CO₂ &amp; Morpheus8 — informed consent</h2>
          <p className="mt-2 text-sm text-black/70">
            You can read these informed consent documents online for education. At your appointment, we will walk you
            through signing and any questions, same as our other device treatments.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                className="font-medium text-[#E6007E] hover:underline"
                href={CONSENT_IFRAME_BY_SLUG["solaria-co2-consent"]}
                target="_blank"
                rel="noopener noreferrer"
              >
                Solaria CO₂ — informed consent (HTML)
              </a>
            </li>
            <li>
              <a
                className="font-medium text-[#E6007E] hover:underline"
                href={CONSENT_IFRAME_BY_SLUG["morpheus8-consent"]}
                target="_blank"
                rel="noopener noreferrer"
              >
                Morpheus8 — informed consent (HTML)
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-xl font-bold">Care guides (on this site)</h2>
        <div className="mt-6 space-y-8">
          {WEB_GUIDES.map((g) => (
            <div key={g.title} className="rounded-2xl border-2 border-black/10 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-[#E6007E]">
                {g.title}{" "}
                <span className="text-sm font-medium text-black/50">· {g.procedure}</span>
              </h3>
              <ul className="mt-3 space-y-2">
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} className="font-medium text-black underline decoration-[#E6007E]/40 underline-offset-2 hover:text-[#E6007E]">
                      {it.label}
                    </Link>
                    {it.note ? <span className="ml-2 text-sm text-black/50">{it.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-black/10 bg-zinc-50/80">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-xl font-bold">Print from your browser</h2>
          <p className="mt-2 text-sm text-black/70">
            Open any guide above, then use your browser&apos;s <strong>Print</strong> or <strong>Save as PDF</strong> if
            you want a copy at home. We can also provide printed handouts or walk you through consent in person.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-center text-sm text-black/60">
          <Link href="/procedures" className="font-semibold text-[#E6007E] hover:underline">
            ← Back to procedures hub
          </Link>
        </p>
      </section>
    </main>
  );
}
