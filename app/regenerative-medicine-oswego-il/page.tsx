import type { Metadata } from "next";

import { RegenerativeMedicineHub } from "@/components/marketing/RegenerativeMedicineHub";
import { REGENERATIVE_MEDICINE_PATH } from "@/lib/regenerative-medicine-nav";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const meta = pageMetadata({
  title: "Regenerative Medicine in Oswego, IL | PRF, AnteAGE & NAD+ | Hello Gorgeous",
  description:
    "Regenerative medicine at Hello Gorgeous Med Spa in Oswego, IL — PRP, PRF, AnteAGE exosomes & biosomes, P.E.A.R.L. fusion, and NAD+ injections. Serving Naperville, Aurora, Plainfield & Fox Valley.",
  path: REGENERATIVE_MEDICINE_PATH,
});

export const metadata: Metadata = {
  ...meta,
  keywords: [
    "regenerative medicine Oswego IL",
    "PRF med spa Oswego",
    "AnteAGE exosomes Illinois",
    "PRP facial Naperville",
    "regenerative aesthetics Fox Valley",
    "Hello Gorgeous regenerative",
  ],
  openGraph: {
    ...meta.openGraph,
    images: [
      {
        url: `${SITE.url}/images/homepage-services/anteage-md-brightening.png`,
        width: 1200,
        height: 630,
        alt: "Regenerative medicine AnteAGE PRF at Hello Gorgeous Oswego",
      },
    ],
  },
};

export default function RegenerativeMedicineOswegoPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Regenerative Medicine", path: REGENERATIVE_MEDICINE_PATH },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <RegenerativeMedicineHub />
    </>
  );
}
