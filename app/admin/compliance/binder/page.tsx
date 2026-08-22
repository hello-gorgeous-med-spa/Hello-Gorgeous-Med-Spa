"use client";

import Link from "next/link";

import {
  BINDER_MD_DOCS,
  BINDER_OPTIONAL_PDFS,
  BINDER_PDF_KITS,
  BINDER_PRINT_PATH,
} from "@/lib/compliance-binder-catalog";

export default function ComplianceBinderPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Compliance Binder</h1>
        <p className="mt-1 text-black">
          IDFPR inspection packet for Hello Gorgeous — Oswego. Print for Dr. Arora to sign, then
          keep the signed original at the front desk. Reprint from this page anytime.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border-4 border-black bg-[#FFF0F7] p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.35)]">
        <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
          Hand off to Dr. Arora
        </p>
        <h2 className="mt-1 text-xl font-black text-black">Print the full packet</h2>
        <p className="mt-2 text-sm text-black/75">
          One print job for the adoption/sign-off page plus core protocols 01–12. Then print the
          three complete SOP kits. After he signs, hole-punch and store at the front desk.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={BINDER_PRINT_PATH}
            className="inline-flex rounded-lg bg-[#E6007E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c4006b]"
          >
            Print packet for Dr. Arora
          </Link>
          <Link
            href={BINDER_PRINT_PATH}
            className="inline-flex rounded-lg border-2 border-black bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-gray-50"
          >
            Front desk reprint
          </Link>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold text-black">Core documents</h2>
      <ul className="space-y-4">
        {BINDER_MD_DOCS.map((doc) => (
          <li
            key={doc.slug}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-black">{doc.title}</h3>
              <p className="mt-0.5 text-sm text-gray-600">{doc.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/compliance/binder/${doc.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2D63A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#002168]"
              >
                View &amp; print
              </Link>
              <a
                href={`/api/compliance-binder/${doc.slug}?download=1`}
                download
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
              >
                Download .md
              </a>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 mb-2 text-lg font-semibold text-black">SOP kits (print the complete PDF)</h2>
      <p className="mb-4 text-sm text-gray-600">
        These are the protocol kits from your Downloads folders. Print each <strong>complete</strong>{" "}
        kit for the binder tabs. Individual SOPs are there if you only need one page.
      </p>
      <ul className="space-y-6">
        {BINDER_PDF_KITS.map((kit) => (
          <li key={kit.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-black">{kit.title}</h3>
            <p className="mt-0.5 text-sm text-gray-600">{kit.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`/compliance-binder/${kit.complete.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg bg-[#2D63A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#002168]"
              >
                Print complete kit
              </a>
              <a
                href={`/compliance-binder/${kit.complete.file}`}
                download
                className="inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
              >
                Download complete kit
              </a>
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-[#2D63A4]">
                Individual SOPs
              </summary>
              <ul className="mt-2 space-y-1">
                {kit.items.map((item) => (
                  <li key={item.file}>
                    <a
                      href={`/compliance-binder/${item.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-black underline hover:text-[#E6007E]"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 mb-3 text-lg font-semibold text-black">Signed agreement (add when you have it)</h2>
      <ul className="space-y-4">
        {BINDER_OPTIONAL_PDFS.map((doc) => (
          <li
            key={doc.file}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-black">{doc.title}</h3>
              <p className="mt-0.5 text-sm text-gray-600">{doc.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/compliance-binder/${doc.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg bg-[#2D63A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#002168]"
              >
                Open
              </a>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-gray-600">
        Templates only — not legal advice. Dr. Arora and counsel should review before you rely on
        this packet in an IDFPR visit.
      </p>
    </div>
  );
}
