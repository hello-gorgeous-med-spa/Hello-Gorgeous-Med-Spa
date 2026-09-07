"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CLINICAL_CHEAT_SHEET_CATEGORIES,
  CLINICAL_CHEAT_SHEETS_PATH,
  opsClinicalCheatSheets,
} from "@/lib/clinical-cheat-sheets";

export default function ClinicalRefsClient() {
  const sheets = opsClinicalCheatSheets();
  const params = useSearchParams();
  const selectedId = params.get("sheet") || sheets[0]?.id;
  const selected = sheets.find((s) => s.id === selectedId) || sheets[0];
  const cat = CLINICAL_CHEAT_SHEET_CATEGORIES.find((c) => c.id === selected?.category);

  if (!selected) {
    return <p className="text-white/50">No clinical sheets are configured.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Clinical reference</h1>
          <p className="mt-1 text-white/50">
            NPA desk sheets for GLP-1, hormones, peptides, and IV. Staff only — not for patients.
          </p>
        </div>
        <Link href={CLINICAL_CHEAT_SHEETS_PATH} className="text-sm text-teal-400 hover:text-teal-300">
          Full cheat-sheet library →
        </Link>
      </div>

      <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
        Reference only — not a standing order. Ryan decides every dose. Compounded medications are not
        FDA-approved. Illinois patients only.
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sheets.map((sheet) => {
          const active = sheet.id === selected.id;
          const sheetCat = CLINICAL_CHEAT_SHEET_CATEGORIES.find((c) => c.id === sheet.category);
          return (
            <Link
              key={sheet.id}
              href={`/ops/clinical?sheet=${encodeURIComponent(sheet.id)}`}
              className={`rounded-2xl border p-4 transition ${
                active
                  ? "border-teal-400 bg-teal-500/15"
                  : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                {sheetCat?.icon} {sheetCat?.label}
              </p>
              <h2 className="mt-1 text-base font-semibold text-white">{sheet.title}</h2>
              <p className="mt-1 text-xs leading-5 text-white/55">{sheet.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">
              {cat?.icon} {selected.title}
            </p>
            <p className="text-xs text-white/45">{selected.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={selected.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-400"
            >
              Open full page
            </a>
            <a
              href={selected.href}
              download
              className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              Download
            </a>
          </div>
        </div>
        <div className="overflow-auto bg-slate-900">
          <iframe
            title={selected.title}
            src={selected.href}
            className="h-[75vh] min-h-[32rem] w-full border-0 bg-white"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Staff pharmacy</p>
        <h2 className="mt-1 text-base font-semibold text-white">BoomRx Master Formulary Spec</h2>
        <p className="mt-1 text-xs leading-5 text-white/55">
          Backup pharmacy only. Never name BoomRx to patients, partners, or on social.
        </p>
        <a
          href="/staff/protocols/guides/BoomRx-Master-Formulary-Spec.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
        >
          Open staff PDF
        </a>
      </div>
    </div>
  );
}
