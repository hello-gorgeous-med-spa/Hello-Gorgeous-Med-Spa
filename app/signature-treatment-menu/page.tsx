import type { Metadata } from "next";

import { SignatureTreatmentMenuContent } from "@/components/marketing/SignatureTreatmentMenuContent";
import { SIGNATURE_MENU_PATH } from "@/lib/signature-treatment-menu";
import { pageMetadata, SITE } from "@/lib/seo";

const _meta = pageMetadata({
  title: "Signature Treatment Menu | Hello Gorgeous Med Spa Oswego",
  description:
    "Signature Treatment Menu at Hello Gorgeous Med Spa Oswego — Botox $10/unit, lip filler $450, Morpheus8 Burst 3 for $1999, Quantum RF, Solaria CO2 $899, Trifecta package. Book on Fresha.",
  path: SIGNATURE_MENU_PATH,
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

export default function SignatureTreatmentMenuPage() {
  return <SignatureTreatmentMenuContent />;
}
