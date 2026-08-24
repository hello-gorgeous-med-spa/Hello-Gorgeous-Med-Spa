import { notFound } from "next/navigation";

import { ConsentFormPrintView } from "@/components/admin/ConsentFormPrintView";
import { CONSENT_FORMS, type ConsentFormType } from "@/lib/hgos/consent-forms";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ autoprint?: string }>;
};

export default async function ConsentFormPrintPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { autoprint } = await searchParams;
  const form = CONSENT_FORMS.find((item) => item.id === (id as ConsentFormType));
  if (!form) notFound();

  return <ConsentFormPrintView form={form} autoPrint={autoprint === "1"} />;
}
