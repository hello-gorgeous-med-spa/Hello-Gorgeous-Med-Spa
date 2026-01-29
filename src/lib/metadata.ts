import type { Metadata } from "next";

import { site } from "@/content/site";

export function pageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = new URL(path, site.url).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} | ${site.name}`,
      description,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
    },
  };
}

