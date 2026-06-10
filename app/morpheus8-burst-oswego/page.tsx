import type { Metadata } from "next";

import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { MORPHEUS8_BURST_OSWEGO_MENU } from "@/lib/oswego-inmode-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: MORPHEUS8_BURST_OSWEGO_MENU.metaTitle,
  description: MORPHEUS8_BURST_OSWEGO_MENU.metaDescription,
  path: MORPHEUS8_BURST_OSWEGO_MENU.path,
});

export default function Morpheus8BurstOswegoPage() {
  return (
    <OswegoMenuLanding
      slug="morpheus8-burst-oswego"
      config={MORPHEUS8_BURST_OSWEGO_MENU}
      breadcrumbName="Morpheus8 Burst Oswego"
    />
  );
}
