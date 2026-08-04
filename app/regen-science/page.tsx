import type { Metadata } from "next";

import { RegenScienceHub } from "@/components/regen-science/RegenScienceHub";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Regen Science Library — Peptide Briefs & Evidence Guides | Hello Gorgeous RX",
  description:
    "Plain-language peptide education from Hello Gorgeous Med Spa in Oswego, IL. Searchable database of GLP-1s, peptides, and hormones with evidence levels, screening info, and science guides. Educational only — candidacy requires provider review.",
  keywords: [
    "peptide science",
    "GLP-1 education",
    "semaglutide guide",
    "tirzepatide information",
    "BPC-157 evidence",
    "peptide therapy Oswego",
    "Hello Gorgeous RX",
    "regenerative medicine education",
  ],
  alternates: {
    canonical: `${SITE.url}/regen-science`,
  },
  openGraph: {
    title: "Regen Science Library — Peptide Briefs & Evidence Guides",
    description:
      "Searchable peptide database with plain-language briefs. What each compound is, evidence levels, and what we screen before prescribing. Written by Hello Gorgeous providers in Oswego.",
    url: `${SITE.url}/regen-science`,
    siteName: SITE.name,
    type: "website",
    images: [
      {
        url: `${SITE.url}/images/rx-care/square/rx-overview.jpg`,
        width: 1200,
        height: 630,
        alt: "Hello Gorgeous RX Regen Science Library — peptide education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regen Science Library — Hello Gorgeous RX",
    description:
      "Plain-language peptide education. Searchable database of GLP-1s, peptides, and hormones with evidence levels.",
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Regen Science Library",
  description:
    "Searchable peptide database with plain-language briefs, evidence levels, and provider screening protocols from Hello Gorgeous Med Spa.",
  url: `${SITE.url}/regen-science`,
  isPartOf: {
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
  },
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
  about: {
    "@type": "MedicalEntity",
    name: "Peptide Therapy Education",
    description:
      "Educational information about peptides, GLP-1 medications, hormone therapy, and regenerative protocols.",
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
      name: "REGEN",
      item: `${SITE.url}/rx`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Regen Science Library",
      item: `${SITE.url}/regen-science`,
    },
  ],
};

export default function RegenSciencePage() {
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
      <RegenScienceHub />
    </>
  );
}
