import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { LASER_HAIR_MENU } from "@/lib/laser-hair-menu";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${LASER_HAIR_MENU.path}`;

export const metadata: Metadata = pageMetadata({
  title: LASER_HAIR_MENU.metaTitle,
  description: LASER_HAIR_MENU.metaDescription,
  path: LASER_HAIR_MENU.path,
});

export default function LaserHairMenuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Services", url: `${SITE.url}/services` },
              { name: "Laser Hair Removal", url: PAGE_URL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(LASER_HAIR_MENU.faqs, PAGE_URL)) }}
      />
      <ServiceMenuPageLayout config={LASER_HAIR_MENU} />
    </>
  );
}
