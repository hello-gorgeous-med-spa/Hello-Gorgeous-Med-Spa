import type { Metadata } from "next";

import { Glp1ProgramOfferSection } from "@/components/marketing/Glp1ProgramOfferSection";
import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { GLP1_WEIGHT_LOSS_OSWEGO_MENU } from "@/lib/oswego-wellness-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: GLP1_WEIGHT_LOSS_OSWEGO_MENU.metaTitle,
  description: GLP1_WEIGHT_LOSS_OSWEGO_MENU.metaDescription,
  path: GLP1_WEIGHT_LOSS_OSWEGO_MENU.path,
});

export default function Glp1WeightLossOswegoPage() {
  return (
    <>
      <OswegoMenuLanding
        slug="glp-1-weight-loss-oswego"
        config={GLP1_WEIGHT_LOSS_OSWEGO_MENU}
        breadcrumbName="Medical Weight Loss Oswego"
      />
      <Glp1ProgramOfferSection variant="light" />
    </>
  );
}
