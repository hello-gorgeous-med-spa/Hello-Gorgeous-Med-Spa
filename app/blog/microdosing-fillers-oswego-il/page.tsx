import type { Metadata } from "next";

import { MicrodosingFillersContent } from "@/components/blog/MicrodosingFillersContent";
import { microdosingFillersPost as post } from "@/data/blog-post-microdosing-fillers";
import { blogPostNeedsMedicalReviewer, medicalWebPageJsonLd } from "@/lib/founder-credentials";
import { SITE, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const PAGE_PATH = `/blog/${post.slug}`;
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;
const OG_IMAGE = `${SITE.url}${post.featuredImage ?? "/images/blog/microdosing-fillers-hero.webp"}`;

export const metadata: Metadata = {
  title: post.metaTitle,
  description: post.metaDescription,
  keywords: [...post.keywords],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "article",
    title: post.metaTitle,
    description: post.metaDescription,
    url: PAGE_URL,
    siteName: SITE.name,
    publishedTime: post.date,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
};

export default function MicrodosingFillersBlogPage() {
  const faqs = post.structuredDataFaqs ?? [];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Blog", url: `${SITE.url}/blog` },
              { name: post.title, url: PAGE_URL },
            ])
          ),
        }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs, PAGE_URL)) }}
        />
      )}
      {blogPostNeedsMedicalReviewer(post.category) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              medicalWebPageJsonLd({
                url: PAGE_URL,
                name: post.title,
                lastReviewed: post.lastReviewed ?? post.date,
              })
            ),
          }}
        />
      )}
      <MicrodosingFillersContent />
    </>
  );
}
