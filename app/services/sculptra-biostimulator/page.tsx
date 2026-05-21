import { TreatmentSeoLanding, treatmentSeoMetadata } from "@/components/marketing/TreatmentSeoLanding";
import { sculptraBiostimulatorSeo } from "@/lib/gap-treatment-seo-content";

export const metadata = treatmentSeoMetadata(sculptraBiostimulatorSeo);

export default function SculptraBiostimulatorPage() {
  return <TreatmentSeoLanding config={sculptraBiostimulatorSeo} />;
}
