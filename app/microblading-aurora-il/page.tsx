import type { Metadata } from "next";

import { BrowMicrobladingCityRoutePage } from "@/components/brow-journey/BrowMicrobladingCityRoutePage";
import { getBrowMicrobladingCitySeo } from "@/lib/brow-microblading-city-seo";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

const content = getBrowMicrobladingCitySeo("aurora");

export const metadata: Metadata = pageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: content.path,
  keywords: content.keywords,
});

export default function MicrobladingAuroraPage() {
  return <BrowMicrobladingCityRoutePage slug="aurora" />;
}
