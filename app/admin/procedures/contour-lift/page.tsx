import type { Metadata } from "next";
import Link from "next/link";
import { CL_STATUS_LABEL, type ClQuantumStatus } from "@/lib/contour-clinical/case-status";

const PINK = "#E6007E";

export const metadata: Metadata = {
  title: "Contour Lift / Quantum RF | Procedures",
  description: "Clinical pipeline: leads, intake, consent, treatment records, and post-care for Contour Lift / Quantum RF.",
};

const SECTIONS: { href: string; label: string; sub: string }[] = [
  { href: "/admin/procedures/contour-lift/cases", label: "Leads & cases", sub: "Pipeline, status, link to lead" },
  { href: "#intake", label: "Intake (coming next)", sub: "Digital Luxora-style intake + contraindication flags" },
  { href: "#consent", label: "Consents (coming next)", sub: "Quantum informed consent + model day + media" },
  { href: "#treatment", label: "Treatment records (coming next)", sub: "Face/neck and body templates" },
  { href: "#photos", label: "Photos (coming next)", sub: "Secure upload + marketing vs internal" },
  { href: "#postcare", label: "Post-care (coming next)", sub: "Send log + template v1" },
];

function StatusLegend() {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 text-sm text-black/80">
      <p className="mb-2 font-semibold text-black">Candidate status (manual)</p>
      <ul className="grid gap-1 sm:grid-cols-2">
        {(Object.keys(CL_STATUS_LABEL) as ClQuantumStatus[]).map((k) => (
          <li key={k}>
            <code className="text-xs text-black/60">{k}</code> — {CL_STATUS_LABEL[k]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ContourLiftProcedureHomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 text-black md:px-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PINK }}>
          Procedures
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold">Contour Lift / Quantum RF</h1>
        <p className="mt-2 text-sm leading-relaxed text-black/70">
          Clinical operating workflow: inquiry → review → intake → consent → treatment documentation →
          post-care. PHI stays in this admin and Supabase — not in public analytics.
        </p>
      </div>

      <div className="grid gap-3">
        {SECTIONS.map((s) => (
          <div key={s.label}>
            {s.href.startsWith("/") ? (
              <Link
                href={s.href}
                className="block rounded-lg border-2 border-black bg-white p-4 transition hover:bg-black/5"
              >
                <span className="font-bold">{s.label}</span>
                <span className="ml-2 text-black/50">→</span>
                <p className="mt-1 text-sm text-black/60">{s.sub}</p>
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed border-black/20 bg-black/[0.02] p-4">
                <span className="font-bold text-black/50">{s.label}</span>
                <p className="mt-1 text-sm text-black/50">{s.sub}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <StatusLegend />

      <p className="text-xs text-black/50">
        Run the SQL migration in Supabase, then open <strong>Leads &amp; cases</strong> to create a case
        from a <code>contour_lift</code> lead and update status.
      </p>
    </div>
  );
}
