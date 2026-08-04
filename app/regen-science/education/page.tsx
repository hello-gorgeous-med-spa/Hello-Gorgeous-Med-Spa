import type { Metadata } from "next";

import { PeptideEducation } from "@/components/regen-science/PeptideEducation";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Peptide Education — Free Learning Modules | Hello Gorgeous RX",
  description:
    "Free peptide education from Hello Gorgeous Med Spa. Five modules: what peptides are, how they work, reading the evidence, safety, and preparing for your consult. No account required.",
  keywords: [
    "peptide education",
    "peptide basics",
    "how peptides work",
    "peptide evidence",
    "GLP-1 education",
    "semaglutide guide",
    "Hello Gorgeous RX",
    "peptide learning",
  ],
  alternates: {
    canonical: `${SITE.url}/regen-science/education`,
  },
  openGraph: {
    title: "Peptide Education — Free Learning Modules",
    description:
      "Understand peptides before anyone prescribes you one. Free modules on peptide basics, evidence literacy, safety, and preparing for your consult.",
    url: `${SITE.url}/regen-science/education`,
    siteName: SITE.name,
    type: "website",
    images: [
      {
        url: `${SITE.url}/images/rx-care/square/rx-overview.jpg`,
        width: 1200,
        height: 630,
        alt: "Hello Gorgeous RX Peptide Education — free learning modules",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peptide Education — Hello Gorgeous RX",
    description:
      "Free peptide education. Five modules covering basics, mechanisms, evidence, safety, and your consult.",
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Peptide Education",
  description:
    "Free five-module course on peptide science: what peptides are, how they work, evidence literacy, safety, and preparing for a provider consult.",
  url: `${SITE.url}/regen-science/education`,
  provider: {
    "@type": "MedicalBusiness",
    name: SITE.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: "US",
    },
    telephone: SITE.phone,
    url: SITE.url,
  },
  isAccessibleForFree: true,
  numberOfCredits: 0,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT45M",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Regen Science",
      item: `${SITE.url}/regen-science`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Peptide Education",
      item: `${SITE.url}/regen-science/education`,
    },
  ],
};

export default function PeptideEducationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PeptideEducation />
    </>
  );
}
