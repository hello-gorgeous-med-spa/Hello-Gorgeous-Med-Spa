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

const PDF_PLACEHOLDERS = [
  { label: "Morpheus8 — pre-treatment guide (PDF)", file: "morpheus8-pre-treatment.pdf" },
  { label: "Morpheus8 — post-treatment guide (PDF)", file: "morpheus8-post-treatment.pdf" },
  { label: "Solaria CO₂ — pre-treatment letter (PDF)", file: "solaria-co2-pre-treatment.pdf" },
  { label: "Solaria CO₂ — post-treatment letter (PDF)", file: "solaria-co2-post-treatment.pdf" },
  { label: "Solaria CO₂ — consent (PDF)", file: "solaria-co2-consent.pdf" },
];

export default function PatientDocumentsPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="border-b-2 border-black bg-zinc-50">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#E6007E]">Patient resources</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Pre, post & consent</h1>
          <p className="mt-4 text-base leading-relaxed text-black/75">
            <strong>Scan a QR code</strong> below to open the pre- and post-care web guide on your phone—no app
            required. Use the text links for the same content on a kiosk. Printable PDFs can be added under{" "}
            <code className="rounded bg-black/5 px-1.5 py-0.5 text-sm">/docs/procedures/</code> on this site. Square
            checkout or your admin can reference these links in confirmations; Fresha stays your booking system.
          </p>
        </div>
      </section>

      <ProcedurePrePostQrSection />

      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-xl font-bold">Luxora (InMode) — pre, post, consent, reference</h2>
          <p className="mt-2 text-sm text-black/70">
            Verbatim source files in <code className="rounded bg-black/5 px-1">/docs/luxora/</code>. Chart-ready
            digital intake with the same consent document:{" "}
            <a className="font-semibold text-[#E6007E] hover:underline" href={HUB_INTAKE}>
              hub.hellogorgeousmedspa.com/intake
            </a>{" "}
            (default; optional <code className="rounded bg-black/5 px-1">?form=…</code> for other devices—see
            Solaria &amp; Morpheus8 below).
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
          <h2 className="text-xl font-bold">Solaria CO₂ &amp; Morpheus8 — informed consent (HTML)</h2>
          <p className="mt-2 text-sm text-black/70">
            Verbatim files in <code className="rounded bg-black/5 px-1">/docs/solaria/</code> and{" "}
            <code className="rounded bg-black/5 px-1">/docs/morpheus8/</code>. Same hub intake flow as Luxora:{" "}
            <a className="font-semibold text-[#E6007E] hover:underline" href={HUB_INTAKE}>
              {HUB_INTAKE.replace("https://", "")}
            </a>{" "}
            with <code className="rounded bg-black/5 px-1">?form=solaria-co2-consent</code> or{" "}
            <code className="rounded bg-black/5 px-1">?form=morpheus8-consent</code>.
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
          <h2 className="text-xl font-bold">Printable PDFs (upload to site)</h2>
          <p className="mt-2 text-sm text-black/70">
            After you copy branded PDFs into <code className="rounded bg-black/5 px-1 py-0.5">public/docs/procedures/</code>
            , they will load at <code className="rounded bg-black/5 px-1 py-0.5">/docs/procedures/&lt;filename&gt;</code>
            . Filenames we recommend:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {PDF_PLACEHOLDERS.map((p) => (
              <li key={p.file} className="flex flex-wrap items-baseline gap-2">
                <span className="text-black/80">{p.label}</span>
                <code className="rounded bg-white px-1.5 py-0.5 text-xs text-black/60">/docs/procedures/{p.file}</code>
              </li>
            ))}
            <li className="pt-2 text-black/55">
              Morpheus8 consent: use your existing HTML workflow or add{" "}
              <code className="rounded bg-white px-1 py-0.5 text-xs">morpheus8-consent.pdf</code> the same way.
            </li>
          </ul>
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
