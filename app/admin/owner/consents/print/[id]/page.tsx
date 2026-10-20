import { redirect } from "next/navigation";

import { ConsentFormPrintView } from "@/components/admin/ConsentFormPrintView";
import { findCatalogConsentForm } from "@/lib/consents/resolve-print-form";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ autoprint?: string }>;
};

export default async function ConsentFormPrintPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { autoprint } = await searchParams;
  const form = findCatalogConsentForm(id);
  if (!form) {
    redirect(`/admin/consents/print/${encodeURIComponent(id)}`);
  }

  return <ConsentFormPrintView form={form} autoPrint={autoprint === "1"} />;
}
