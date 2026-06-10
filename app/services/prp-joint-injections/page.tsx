import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { PRP_JOINT_INJECTIONS_MENU } from "@/lib/prp-joint-injections-menu";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${PRP_JOINT_INJECTIONS_MENU.path}`;

export const metadata: Metadata = pageMetadata({
  title: PRP_JOINT_INJECTIONS_MENU.metaTitle,
  description: PRP_JOINT_INJECTIONS_MENU.metaDescription,
  path: PRP_JOINT_INJECTIONS_MENU.path,
});

export default function PrpJointInjectionsMenuPage() {
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
              { name: "PRP Joint Injections", url: PAGE_URL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(PRP_JOINT_INJECTIONS_MENU.faqs, PAGE_URL)) }}
      />
      <ServiceMenuPageLayout config={PRP_JOINT_INJECTIONS_MENU} />
    </>
  );
}
