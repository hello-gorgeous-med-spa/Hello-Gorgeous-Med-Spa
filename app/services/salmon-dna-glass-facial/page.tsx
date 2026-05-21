import { TreatmentSeoLanding, treatmentSeoMetadata } from "@/components/marketing/TreatmentSeoLanding";
import { salmonDnaGlassFacialSeo } from "@/lib/gap-treatment-seo-content";

export const metadata = treatmentSeoMetadata(salmonDnaGlassFacialSeo);

export default function SalmonDnaGlassFacialPage() {
  return <TreatmentSeoLanding config={salmonDnaGlassFacialSeo} />;
}
