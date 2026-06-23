import type { Metadata } from "next";

import { FindYourPeptideGuidePage } from "@/components/skin-101/FindYourPeptideGuidePage";
import { FIND_YOUR_PEPTIDE_GUIDE } from "@/data/skin-101-find-your-peptide-guide";
import { SKIN_101_GUIDES, SKIN_101_PATH } from "@/lib/skin-101-nav";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE, siteJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = `${SKIN_101_PATH}/find-your-peptide`;
const URL = `${SITE.url}${PATH}`;
const guide = SKIN_101_GUIDES.find((g) => g.slug === "find-your-peptide")!;

export const metadata: Metadata = pageMetadata({
  title: FIND_YOUR_PEPTIDE_GUIDE.metaTitle,
  description: FIND_YOUR_PEPTIDE_GUIDE.metaDescription,
  path: PATH,
});

const FAQ_ITEMS = [
  {
    question: "How do I know which peptide is right for me?",
    answer:
      "Start with your primary wellness goal — recovery, skin, energy, weight, sleep, brain health, or intimacy. Match that goal to the peptides commonly discussed for that area, then book a $49 NP-led consult at Hello Gorgeous in Oswego so your medical history and labs can guide a safe, personalized protocol.",
  },
  {
    question: "Does Hello Gorgeous offer peptide therapy in Oswego, IL?",
    answer:
      "Yes. Hello Gorgeous Med Spa offers NP-supervised peptide therapy through Hello Gorgeous RX™ — including BPC-157, Sermorelin, GHK-Cu, NAD+, PT-141, Tesamorelin, and more — sourced from licensed US compounding pharmacies after medical evaluation.",
  },
  {
    question: "How much does a peptide consultation cost?",
    answer:
      "Hello Gorgeous offers a $49 peptide consultation in downtown Oswego. Medication and protocol costs are priced separately based on your personalized plan.",
  },
];

export default function FindYourPeptidePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Skin 101", url: `${SITE.url}${SKIN_101_PATH}` },
    { name: "Find Your Peptide", url: URL },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: FIND_YOUR_PEPTIDE_GUIDE.title,
    description: FIND_YOUR_PEPTIDE_GUIDE.metaDescription,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@id": `${SITE.url}/#organization` },
    mainEntityOfPage: URL,
    image: `${SITE.url}${FIND_YOUR_PEPTIDE_GUIDE.featuredImage.src}`,
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to find the right peptide for your goals",
    description: FIND_YOUR_PEPTIDE_GUIDE.metaDescription,
    step: FIND_YOUR_PEPTIDE_GUIDE.howToSteps.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.body,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: FIND_YOUR_PEPTIDE_GUIDE.metaTitle,
              description: FIND_YOUR_PEPTIDE_GUIDE.metaDescription,
              url: URL,
              image: FIND_YOUR_PEPTIDE_GUIDE.featuredImage.src,
            })
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ_ITEMS)) }}
      />
      <FindYourPeptideGuidePage guide={FIND_YOUR_PEPTIDE_GUIDE} relatedLinks={guide.relatedServiceLinks} />
    </>
  );
}
