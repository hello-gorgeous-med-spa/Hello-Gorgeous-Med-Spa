import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PeptideLearnPageContent } from "@/components/regen/PeptideLearnPageContent";
import {
  allShowcaseSlugs,
  PEPTIDE_SHOWCASE_STATUS,
} from "@/lib/regen/peptide-showcase-grid";
import {
  getPeptideLearnPage,
  peptideLearnCanonical,
} from "@/lib/regen/peptide-learn-pages";

type Params = { slug: string };

export function generateStaticParams() {
  return allShowcaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPeptideLearnPage(slug);
  if (!page) return { title: "Peptide education" };
  const status = PEPTIDE_SHOWCASE_STATUS[page.card.status].label;
  const title = `${page.card.name} peptide education`;
  const description = `${page.tagline} ${status}. RE GEN RX in Oswego, Illinois.`;
  const url = peptideLearnCanonical(slug);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "REGEN RX",
      type: "article",
    },
  };
}

export default async function RegenPeptideLearnPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getPeptideLearnPage(slug);
  if (!page) notFound();

  const url = peptideLearnCanonical(slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${page.card.name} peptide education`,
    description: page.tagline,
    url,
    lastReviewed: "2026-07-01",
    about: { "@type": "MedicalTherapy", name: page.card.name },
    publisher: {
      "@type": "MedicalBusiness",
      name: "RE GEN RX · Hello Gorgeous Med Spa",
      address: {
        "@type": "PostalAddress",
        streetAddress: "74 W. Washington Street",
        addressLocality: "Oswego",
        addressRegion: "IL",
        postalCode: "60543",
      },
    },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <PeptideLearnPageContent page={page} />
    </>
  );
}
