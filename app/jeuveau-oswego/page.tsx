import type { Metadata } from "next";

import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { JEUVEAU_OSWEGO_MENU } from "@/lib/oswego-injectable-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: JEUVEAU_OSWEGO_MENU.metaTitle,
  description: JEUVEAU_OSWEGO_MENU.metaDescription,
  path: JEUVEAU_OSWEGO_MENU.path,
});

export default function JeuveauOswegoPage() {
  return <OswegoMenuLanding slug="jeuveau-oswego" config={JEUVEAU_OSWEGO_MENU} breadcrumbName="Jeuveau Oswego" />;
}
