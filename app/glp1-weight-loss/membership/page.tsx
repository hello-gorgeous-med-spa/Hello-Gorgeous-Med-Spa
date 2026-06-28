import type { Metadata } from "next";

import { Glp1WeightLossMembershipContent } from "@/components/marketing/Glp1WeightLossMembershipContent";
import {
  GLP1_MEMBERSHIP_DISCLAIMER,
  GLP1_MEMBERSHIP_FAQS,
  GLP1_MEMBERSHIP_PRICE_USD,
  GLP1_WEIGHT_LOSS_MEMBERSHIP_PATH,
} from "@/lib/glp1-weight-loss-membership";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `GLP-1 Weight Loss Membership $${GLP1_MEMBERSHIP_PRICE_USD}/mo | Hello Gorgeous RX™ Oswego`,
  description:
    `$${GLP1_MEMBERSHIP_PRICE_USD}/month Hello Gorgeous RX weight loss membership — NP check-ins, care-team messaging, Formulation pharmacy GLP-1 SKU access. Semaglutide & tirzepatide billed separately. Oswego IL.`,
  path: GLP1_WEIGHT_LOSS_MEMBERSHIP_PATH,
});

const pageUrl = `${SITE.url}${GLP1_WEIGHT_LOSS_MEMBERSHIP_PATH}`;

export default function Glp1WeightLossMembershipPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "Medical Weight Loss", url: `${SITE.url}/glp1-weight-loss` },
    { name: "Membership", url: pageUrl },
  ]);

  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Hello Gorgeous RX Weight Loss Membership",
    description: GLP1_MEMBERSHIP_DISCLAIMER,
    url: pageUrl,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      price: String(GLP1_MEMBERSHIP_PRICE_USD),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: pageUrl,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(GLP1_MEMBERSHIP_FAQS, pageUrl)),
        }}
      />
      <Glp1WeightLossMembershipContent />
    </>
  );
}
