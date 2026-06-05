import type { Metadata } from "next";

import { InjectionMenuContent } from "@/components/marketing/InjectionMenuContent";
import { INJECTION_MENU_PATH, INJECTION_MENU_POSTER } from "@/lib/injection-menu";
import { pageMetadata, SITE } from "@/lib/seo";

const meta = pageMetadata({
  title: "Injection Menu — Peptides & Vitamin Shots | Hello Gorgeous Med Spa Oswego",
  description:
    "Hello Gorgeous Injection Menu: PT-141, GHK-Cu, BPC-157, Sermorelin, Tesamorelin, NAD+, glutathione, GLP-1, B12, biotin, MIC & more. Provider-guided wellness in Oswego, IL.",
  path: INJECTION_MENU_PATH,
});

export const metadata: Metadata = {
  ...meta,
  openGraph: {
    ...meta.openGraph,
    images: [
      {
        url: `${SITE.url}${INJECTION_MENU_POSTER.src}`,
        width: 1200,
        height: 1550,
        alt: INJECTION_MENU_POSTER.alt,
      },
    ],
  },
};

export default function InjectionMenuPage() {
  return <InjectionMenuContent />;
}
