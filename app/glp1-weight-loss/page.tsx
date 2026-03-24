import type { Metadata } from "next";
import { GLP1WeightLossLanding } from "@/components/marketing/GLP1WeightLossLanding";
import { GLP1_WEIGHT_LOSS_FAQS } from "@/lib/glp1-weight-loss-faqs";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE } from "@/lib/seo";

const GLP1_PATH = "/glp1-weight-loss";

const base = pageMetadata({
  title: "Medical Weight Loss Oswego IL | GLP-1 Semaglutide & Tirzepatide | Hello Gorgeous Med Spa",
  description:
    "Medically supervised GLP-1 weight loss in Oswego, IL. Semaglutide & tirzepatide (similar to Ozempic/Wegovy & Mounjaro/Zepbound). NP-supervised, in-person care. Compounded by a licensed pharmacy. No insurance required. HSA/FSA. Naperville, Aurora, Plainfield, Yorkville.",
  path: GLP1_PATH,
});

export const metadata: Metadata = {
  ...base,
  keywords: [
    "GLP-1 weight loss Oswego",
    "semaglutide Oswego IL",
    "tirzepatide Oswego",
    "medical weight loss Oswego IL",
    "Ozempic alternative Oswego",
    "Wegovy Oswego",
    "Mounjaro weight loss Illinois",
    "Zepbound Illinois",
    "weight loss clinic Naperville",
    "medical weight loss Aurora IL",
    "GLP-1 med spa Kendall County",
    "Hello Gorgeous weight loss",
    "compounded semaglutide Oswego",
    "weight loss shots Oswego",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    ...base.openGraph,
    images: [
      {
        url: `${SITE.url}/images/services/hg-weight-loss.png`,
        width: 1200,
        height: 630,
        alt: "Medical weight loss GLP-1 program at Hello Gorgeous Med Spa Oswego IL",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    ...base.twitter,
    images: [`${SITE.url}/images/services/hg-weight-loss.png`],
  },
};

const medicalProcedureJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "GLP-1 Medical Weight Loss Therapy",
  alternateName: ["Semaglutide Weight Loss", "Tirzepatide Weight Loss", "Ozempic Weight Loss", "Wegovy Treatment"],
  description:
    "Medical weight loss program using GLP-1 receptor agonists (semaglutide, tirzepatide) under nurse practitioner supervision in Oswego, IL.",
  procedureType: "Medical",
  bodyLocation: "Subcutaneous injection",
  url: `${SITE.url}${GLP1_PATH}`,
  provider: {
    "@type": "MedicalBusiness",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: "US",
    },
  },
  areaServed: [
    { "@type": "City", name: "Oswego, IL" },
    { "@type": "City", name: "Naperville, IL" },
    { "@type": "City", name: "Aurora, IL" },
    { "@type": "City", name: "Plainfield, IL" },
    { "@type": "City", name: "Yorkville, IL" },
  ],
};

const breadcrumbLd = breadcrumbJsonLd([
  { name: "Home", url: SITE.url },
  { name: "Medical Weight Loss (GLP-1)", url: `${SITE.url}${GLP1_PATH}` },
]);

export default function GLP1WeightLossPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd([...GLP1_WEIGHT_LOSS_FAQS])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalProcedureJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <GLP1WeightLossLanding />
    </>
  );
}
