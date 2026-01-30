import type { Metadata } from "next";

import { Hero } from "@/components/Hero";
import { HomeCareTeam } from "@/components/HomeCareTeam";
import { PromoBanner } from "@/components/PromoBanner";
import { PhotoGallery } from "@/components/PhotoGallery";
import { MeetProviders } from "@/components/MeetProviders";
import { HOME_FAQS, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Home",
  description:
    "Hello Gorgeous Med Spa in Oswego, IL. Luxury medical aesthetics—Botox/Dysport, fillers, weight loss (GLP‑1), hormone therapy, PRF/PRP. Serving Naperville, Aurora, and Plainfield.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQS)) }}
      />
      <Hero />
      <PromoBanner />
      <HomeCareTeam />
      <PhotoGallery />
      <MeetProviders />
    </>
  );
}

