import type { Metadata } from "next";

import { Glp1WeightLossScienceContent } from "@/components/marketing/Glp1WeightLossScienceContent";
import {
  GLP1_SCIENCE_DISCLAIMER,
  GLP1_WEIGHT_LOSS_SCIENCE_PATH,
} from "@/lib/glp1-weight-loss-science";
import { breadcrumbJsonLd, pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "GLP-1 Weight Loss Science | Semaglutide & Tirzepatide | Hello Gorgeous RX™",
  description:
    "How GLP-1 and dual GLP-1/GIP pathways support medical weight loss — appetite, gastric emptying, trial context, and compounded semaglutide & tirzepatide at Hello Gorgeous Med Spa Oswego IL.",
  path: GLP1_WEIGHT_LOSS_SCIENCE_PATH,
});

const breadcrumbLd = breadcrumbJsonLd([
  { name: "Home", url: SITE.url },
  { name: "Medical Weight Loss", url: `${SITE.url}/glp1-weight-loss` },
  { name: "The Science", url: `${SITE.url}${GLP1_WEIGHT_LOSS_SCIENCE_PATH}` },
]);

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "GLP-1 Weight Loss Science",
  description:
    "Educational overview of GLP-1 receptor agonists and dual incretin pathways for medical weight management.",
  url: `${SITE.url}${GLP1_WEIGHT_LOSS_SCIENCE_PATH}`,
  about: [
    { "@type": "Drug", name: "Semaglutide" },
    { "@type": "Drug", name: "Tirzepatide" },
  ],
  publisher: {
    "@type": "MedicalBusiness",
    name: SITE.name,
    url: SITE.url,
  },
};

export default function Glp1WeightLossSciencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Glp1WeightLossScienceContent />
      <p className="sr-only">{GLP1_SCIENCE_DISCLAIMER}</p>
    </>
  );
}
