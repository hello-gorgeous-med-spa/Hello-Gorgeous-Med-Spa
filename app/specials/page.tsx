import type { Metadata } from "next";

import { MoreSpecialsSection } from "@/components/marketing/MoreSpecialsSection";
import { SignatureTreatmentMenuContent } from "@/components/marketing/SignatureTreatmentMenuContent";
import { SPECIALS_PATH } from "@/lib/specials";
import { pageMetadata, SITE } from "@/lib/seo";

const _meta = pageMetadata({
  title: "Specials & Signature Treatment Menu | Hello Gorgeous Med Spa Oswego",
  description:
    "Current specials at Hello Gorgeous Med Spa Oswego — Signature Treatment Menu: Botox $10/unit, lip filler $450, Morpheus8 Burst, Quantum RF, Solaria CO2 $899, Trifecta. VIP model, laser hair & more.",
  path: SPECIALS_PATH,
});

export const metadata: Metadata = {
  ..._meta,
  openGraph: {
    ..._meta.openGraph,
    images: [
      {
        url: `${SITE.url}/images/promo/signature-treatment-menu-poster.png`,
        width: 1200,
        height: 1550,
        alt: "Hello Gorgeous Signature Treatment Menu",
      },
    ],
  },
};

export default function SpecialsPage() {
  return (
    <>
      <SignatureTreatmentMenuContent />
      <MoreSpecialsSection />
    </>
  );
}
