import { ConsentFormPrintView } from "@/components/admin/ConsentFormPrintView";
import { consentContentToHtml, findCatalogConsentForm } from "@/lib/consents/resolve-print-form";
import { consentNamesMatch } from "@/lib/consents/template-signed-counts";
import { CONSENT_FORMS, type ConsentForm } from "@/lib/hgos/consent-forms";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ autoprint?: string }>;
};

function asPrintForm(partial: {
  id: string;
  name: string;
  content: string;
  version?: string | number;
  lastUpdated?: string;
}): ConsentForm {
  return {
    id: (CONSENT_FORMS[0]?.id || "general_consent") as ConsentForm["id"],
    name: partial.name,
    shortName: partial.name,
    description: "",
    version: String(partial.version || "1"),
    lastUpdated: partial.lastUpdated || new Date().toLocaleDateString(),
    isRequired: false,
    requiresWitness: false,
    expiresAfterDays: null,
    content: consentContentToHtml(partial.content),
    order: 0,
  };
}

export default async function AdminConsentPrintPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { autoprint } = await searchParams;
  const catalog = findCatalogConsentForm(id);
  if (catalog) {
    return <ConsentFormPrintView form={catalog} autoPrint={autoprint === "1"} />;
  }

  const supabase = createServerSupabaseClient();
  if (supabase) {
    const { data: byId } = await supabase.from("consent_templates").select("*").eq("id", id).maybeSingle();
    const row =
      byId ||
      (
        await supabase.from("consent_templates").select("*").ilike("slug", id.replace(/_/g, "-"))
      ).data?.[0];

    if (row) {
      const matched = CONSENT_FORMS.find((form) => consentNamesMatch(form.name, row.name));
      if (matched) {
        return <ConsentFormPrintView form={matched} autoPrint={autoprint === "1"} />;
      }
      return (
        <ConsentFormPrintView
          form={asPrintForm({
            id: row.id,
            name: row.name,
            content: row.content,
            version: row.version,
            lastUpdated: row.updated_at,
          })}
          autoPrint={autoprint === "1"}
        />
      );
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-black">That print page was not found</h1>
      <p className="text-sm text-black">
        No consent form matched <span className="font-mono">{id}</span>. Open the hard-copy list and print from there.
      </p>
      <Link
        href="/admin/consents/print"
        className="inline-block px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg"
      >
        Hard copy list
      </Link>
    </div>
  );
}
