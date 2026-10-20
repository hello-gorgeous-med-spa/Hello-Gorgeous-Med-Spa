import Link from "next/link";
import { CONSENT_FORMS } from "@/lib/hgos/consent-forms";

export const dynamic = "force-dynamic";

export default function ConsentHardCopyIndexPage() {
  const forms = [...CONSENT_FORMS].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/admin/consents" className="text-sm font-medium text-[#2D63A4] hover:underline">
          ← Consent templates
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-black">Hard copies</h1>
        <p className="mt-1 text-sm text-black">
          Blank forms for the printer or iPad binder. Signed copies stay on the client chart.
        </p>
      </div>

      <Link
        href="/admin/consents/print/all"
        className="inline-block px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
      >
        Print all {forms.length} forms
      </Link>

      <ul className="bg-white rounded-xl border border-black divide-y divide-black">
        {forms.map((form) => (
          <li key={form.id} className="px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-black">{form.name}</p>
              <p className="text-sm text-black">{form.shortName} · v{form.version}</p>
            </div>
            <Link
              href={`/admin/consents/print/${form.id}`}
              className="shrink-0 px-3 py-1.5 text-sm font-medium text-[#2D63A4] border border-black rounded-lg hover:bg-gray-50"
            >
              Print
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
