import type { Metadata } from "next";

import { RegenWeightLossCityRoutePage } from "@/components/regen/RegenWeightLossCityRoutePage";
import { getRegenWeightLossCitySeo } from "@/lib/regen-weight-loss-city-seo";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

const content = getRegenWeightLossCitySeo("montgomery");

export const metadata: Metadata = pageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: content.path,
  keywords: content.keywords,
});

export default function RegenWeightLossMontgomeryPage() {
  return <RegenWeightLossCityRoutePage slug="montgomery" />;
}
