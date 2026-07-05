import type { Metadata } from "next";

import { ShockwaveCityRoutePage } from "@/components/flowwave/ShockwaveCityRoutePage";
import { getShockwaveCitySeo } from "@/lib/shockwave-city-seo";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

const content = getShockwaveCitySeo("aurora");

export const metadata: Metadata = pageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: content.path,
  keywords: content.keywords,
});

export default function ShockwaveTherapyAuroraPage() {
  return <ShockwaveCityRoutePage slug="aurora" />;
}
