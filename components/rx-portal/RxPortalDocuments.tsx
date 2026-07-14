"use client";

import Link from "next/link";

import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";
import { RX_PORTAL_DOCUMENTS } from "@/lib/rx-portal/documents";

export function RxPortalDocuments() {
  return (
    <RxPortalShell title="Documents">
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
    </RxPortalShell>
  );
}
