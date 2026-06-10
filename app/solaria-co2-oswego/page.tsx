import type { Metadata } from "next";

import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { SOLARIA_CO2_OSWEGO_MENU } from "@/lib/oswego-inmode-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: SOLARIA_CO2_OSWEGO_MENU.metaTitle,
  description: SOLARIA_CO2_OSWEGO_MENU.metaDescription,
  path: SOLARIA_CO2_OSWEGO_MENU.path,
});

export default function SolariaCo2OswegoPage() {
  return (
    <OswegoMenuLanding
      slug="solaria-co2-oswego"
      config={SOLARIA_CO2_OSWEGO_MENU}
      breadcrumbName="Solaria CO2 Oswego"
    />
  );
}
