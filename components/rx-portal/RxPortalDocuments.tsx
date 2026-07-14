"use client";

import Link from "next/link";

import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";
import {
  RX_PORTAL_COMPLIANCE_DOCS,
  RX_PORTAL_DOCUMENTS,
  RX_PORTAL_FORMUCONNECT_SAFETY,
} from "@/lib/rx-portal/documents";

export function RxPortalDocuments() {
  return (
    <RxPortalShell title="Documents">
      <section className="mb-8">
        <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-teal-700">
          FormuConnect compliance agreements
        </h3>
        <p className="mb-4 text-sm text-slate-600">
          Signed copies for Hello Gorgeous Medical Spa · Provider {RX_PORTAL_FORMUCONNECT_SAFETY.signedBy} ·{" "}
          {RX_PORTAL_FORMUCONNECT_SAFETY.signedAt}. Keep for renewals / audits.
        </p>
        <ul className="grid gap-4 md:grid-cols-3">
          {RX_PORTAL_COMPLIANCE_DOCS.map((doc) => (
            <li
              key={doc.id}
              className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm flex flex-col"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Compliance
              </p>
              <h3 className="mt-1 font-black text-[#0B1F33]">{doc.title}</h3>
              <p className="mt-2 text-sm text-slate-600 flex-1">{doc.description}</p>
              <p className="mt-2 text-[11px] text-slate-400">
                Signed {doc.signedAt} · {doc.signedBy}
              </p>
              <a
                href={doc.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex self-start rounded-lg bg-[#0B1F33] px-3 py-2 text-sm font-bold text-white hover:bg-slate-800"
              >
                Open PDF ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#0B1F33]">
          Practice safety checklist (from these agreements)
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Ops guide for Hello Gorgeous — not legal advice. Vendor: {RX_PORTAL_FORMUCONNECT_SAFETY.vendorContact}
        </p>
        <ul className="mt-4 space-y-3">
          {RX_PORTAL_FORMUCONNECT_SAFETY.bullets.map((b) => (
            <li key={b.title} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <p className="text-sm font-bold text-teal-800">{b.title}</p>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-500">
          Staff documents
        </h3>
        <ul className="grid gap-4 md:grid-cols-2">
          {RX_PORTAL_DOCUMENTS.map((doc) => (
            <li
              key={doc.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col"
            >
              <h3 className="font-black text-[#0B1F33]">{doc.title}</h3>
              <p className="mt-2 text-sm text-slate-600 flex-1">{doc.description}</p>
              {"note" in doc && doc.note ? (
                <p className="mt-2 text-[11px] text-slate-400">{doc.note}</p>
              ) : null}
              <Link
                href={doc.href}
                className="mt-4 inline-flex self-start rounded-lg bg-teal-500 px-3 py-2 text-sm font-bold text-[#0B1F33] hover:bg-teal-400"
              >
                Open
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </RxPortalShell>
  );
}
