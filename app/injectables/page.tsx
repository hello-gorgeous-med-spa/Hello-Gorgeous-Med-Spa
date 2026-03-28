import type { Metadata } from "next";
import { InjectablesConversion } from "@/components/homepage-v3/InjectablesConversion";
import { pageMetadata, SITE, siteJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Botox, Fillers & Lip Studio | Injectables in Oswego, IL | Hello Gorgeous",
  description:
    "Botox®, Dysport®, dermal fillers, Lip Enhancement Studio, and full-face consultations in Oswego, IL. NP-led injectables — natural results. Book Hello Gorgeous Med Spa.",
  path: "/injectables",
});

export default function InjectablesHubPage() {
  const crumbs = [
    { name: "Home", url: SITE.url },
    { name: "Injectables", url: `${SITE.url}/injectables` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(crumbs)),
        }}
      />
      <main className="bg-black min-h-screen">
        <InjectablesConversion />
      </main>
    </>
  );
}
