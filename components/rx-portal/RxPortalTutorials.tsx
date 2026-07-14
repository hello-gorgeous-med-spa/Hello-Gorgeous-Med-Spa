"use client";

import Link from "next/link";

import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";
import { rxPortalTutorials } from "@/lib/rx-portal/documents";

export function RxPortalTutorials() {
  const tutorials = rxPortalTutorials();

  return (
    <RxPortalShell title="How To Tutorials">
      <p className="mb-4 text-sm text-slate-600">
        Clinical cheat sheets and protocols — no PHI. Use Chrome for pharmacy vendor portals.
      </p>
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {tutorials.map((t) => (
          <li key={t.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
              {t.category}
            </p>
            <h3 className="mt-1 font-bold text-[#0B1F33]">{t.title}</h3>
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{t.description}</p>
            <Link
              href={t.href}
              className="mt-3 inline-flex text-sm font-semibold text-teal-700 hover:underline"
            >
              Open tutorial →
            </Link>
          </li>
        ))}
      </ul>
    </RxPortalShell>
  );
}
