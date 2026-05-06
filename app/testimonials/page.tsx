import type { Metadata } from "next";
import { TaggedTestimonialsClient } from "@/components/reviews/TaggedTestimonialsClient";
import { pageMetadata } from "@/lib/seo";
import { providerPersonJsonLd, reviewSchemaPlaceholder } from "@/lib/schema-expansion";

export const metadata: Metadata = pageMetadata({
  title: "Testimonials System | Hello Gorgeous Med Spa",
  description:
    "Filterable testimonial architecture by treatment, concern, provider, and device for future approved review publishing.",
  path: "/testimonials",
});

export default function TestimonialsSystemPage() {
  const providerJsonLd = providerPersonJsonLd();
  const reviewJsonLd = reviewSchemaPlaceholder("Hello Gorgeous Med Spa Testimonials");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(providerJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }} />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-black text-black">Dynamic Testimonial System</h1>
        <p className="mt-3 max-w-3xl text-black/75">
          Structured review pipeline with treatment, concern, provider, device tags and before/after permission flags. Placeholder records remain unapproved until consented content is ready.
        </p>
        <div className="mt-7">
          <TaggedTestimonialsClient />
        </div>
      </main>
    </>
  );
}
