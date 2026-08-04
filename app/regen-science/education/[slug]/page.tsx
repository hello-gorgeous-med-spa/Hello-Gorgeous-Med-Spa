import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EducationModulePage } from "@/components/regen-science/EducationModulePage";
import { SITE } from "@/lib/seo";
import {
  getModuleBySlug,
  getAllModuleSlugs,
} from "@/lib/regen/education-module-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllModuleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const module = getModuleBySlug(slug);

  if (!module) {
    return {
      title: "Module Not Found | Hello Gorgeous RX",
    };
  }

  const title = `Module ${module.moduleNumber}: ${module.title} — Peptide Education | Hello Gorgeous RX`;
  const description = module.heroDescription;

  return {
    title,
    description,
    keywords: [
      "peptide education",
      module.title.toLowerCase(),
      "peptide learning",
      "Hello Gorgeous RX",
      "peptide science",
      "medical education",
    ],
    alternates: {
      canonical: `${SITE.url}/regen-science/education/${slug}`,
    },
    openGraph: {
      title: `Module ${module.moduleNumber}: ${module.title}`,
      description,
      url: `${SITE.url}/regen-science/education/${slug}`,
      siteName: SITE.name,
      type: "article",
      images: [
        {
          url: `${SITE.url}/images/rx-care/square/rx-overview.jpg`,
          width: 1200,
          height: 630,
          alt: `Peptide Education Module ${module.moduleNumber}: ${module.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Module ${module.moduleNumber}: ${module.title}`,
      description,
    },
  };
}

const breadcrumbJsonLd = (slug: string, title: string, moduleNumber: string) => ({
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
    {
      "@type": "ListItem",
      position: 4,
      name: `Module ${moduleNumber}: ${title}`,
      item: `${SITE.url}/regen-science/education/${slug}`,
    },
  ],
});

const articleJsonLd = (slug: string, module: NonNullable<ReturnType<typeof getModuleBySlug>>) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Module ${module.moduleNumber}: ${module.title}`,
  description: module.heroDescription,
  author: {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
  },
  publisher: {
    "@type": "MedicalBusiness",
    name: SITE.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: "US",
    },
    telephone: SITE.phone,
    url: SITE.url,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE.url}/regen-science/education/${slug}`,
  },
  isPartOf: {
    "@type": "Course",
    name: "Peptide Education",
    url: `${SITE.url}/regen-science/education`,
  },
  educationalLevel: "beginner",
  learningResourceType: "reading",
  timeRequired: `PT${module.readTime.replace(" min", "M")}`,
});

export default async function EducationModulePageRoute({ params }: Props) {
  const { slug } = await params;
  const module = getModuleBySlug(slug);

  if (!module) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(slug, module.title, module.moduleNumber)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(slug, module)),
        }}
      />
      <EducationModulePage module={module} />
    </>
  );
}
