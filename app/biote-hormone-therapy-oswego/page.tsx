import type { Metadata } from "next";

import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { BIOTE_HORMONE_OSWEGO_MENU } from "@/lib/oswego-wellness-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: BIOTE_HORMONE_OSWEGO_MENU.metaTitle,
  description: BIOTE_HORMONE_OSWEGO_MENU.metaDescription,
  path: BIOTE_HORMONE_OSWEGO_MENU.path,
});

export default function BioteHormoneTherapyOswegoPage() {
  return (
    <OswegoMenuLanding
      slug="biote-hormone-therapy-oswego"
      config={BIOTE_HORMONE_OSWEGO_MENU}
      breadcrumbName="BioTE Hormone Therapy Oswego"
    />
  );
}
