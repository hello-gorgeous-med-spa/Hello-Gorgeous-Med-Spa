import type { Metadata } from "next";
import { OurPromiseContent } from "./OurPromiseContent";
import { pageMetadata, siteJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Promise — 100% Authentic Products & Class IV Medical Lasers | Hello Gorgeous",
  description:
    "Over $1 million invested in FDA-cleared InMode Class IV lasers, genuine Allergan/Evolus injectables, and pharmacy-grade medications. No fakes. No shortcuts. That's our promise to Oswego, Naperville, Aurora & Plainfield.",
  path: "/our-promise",
});

export default function OurPromisePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Our Promise", href: "/our-promise" },
            ])
          ),
        }}
      />
      <OurPromiseContent />
    </>
  );
}
