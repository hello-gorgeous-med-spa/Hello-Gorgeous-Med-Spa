import type { Metadata } from "next";

import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { TRT_OSWEGO_MENU } from "@/lib/oswego-wellness-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: TRT_OSWEGO_MENU.metaTitle,
  description: TRT_OSWEGO_MENU.metaDescription,
  path: TRT_OSWEGO_MENU.path,
});

export default function TestosteroneReplacementOswegoPage() {
  return (
    <OswegoMenuLanding
      slug="testosterone-replacement-oswego"
      config={TRT_OSWEGO_MENU}
      breadcrumbName="TRT Oswego"
    />
  );
}
