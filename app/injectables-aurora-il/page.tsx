import type { Metadata } from "next";

import { InjectablesCityRoutePage } from "@/components/injectables/InjectablesCityRoutePage";
import { getInjectablesCitySeo } from "@/lib/injectables-city-seo";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

const content = getInjectablesCitySeo("aurora");

export const metadata: Metadata = pageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: content.path,
  keywords: content.keywords,
});

export default function InjectablesAuroraPage() {
  return <InjectablesCityRoutePage slug="aurora" />;
}
