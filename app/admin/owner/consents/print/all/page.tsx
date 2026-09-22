import { ConsentBinderPrintView } from "@/components/admin/ConsentBinderPrintView";
import { CONSENT_FORMS } from "@/lib/hgos/consent-forms";

type PageProps = {
  searchParams: Promise<{ autoprint?: string }>;
};

export default async function ConsentBinderPrintPage({ searchParams }: PageProps) {
  const { autoprint } = await searchParams;
  const forms = [...CONSENT_FORMS].sort((a, b) => a.order - b.order);
  return <ConsentBinderPrintView forms={forms} autoPrint={autoprint === "1"} />;
}
