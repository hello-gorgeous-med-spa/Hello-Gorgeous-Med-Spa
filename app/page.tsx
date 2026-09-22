import { Metadata } from "next";
import { HOME_CIRCLE_PHOTO, HOME_LOUNGE_PHOTO, HOME_THIS_IS_US_PHOTOS } from "@/lib/campaigns/fall-makeover-2026";
import { LiveGooglePlaceCard } from "@/components/LiveGooglePlaceCard";
import { HomepageAtelier } from "@/components/homepage-atelier/HomepageAtelier";
import { resolveReviewTrust } from "@/lib/review-trust";
import { getGooglePlace } from "@/lib/seo/google-places";
import { aroraPersonJsonLd } from "@/lib/medical-trust";
import {
  SITE,
  SITE_OG_IMAGE,
  SITE_OG_IMAGE_PATH,
  SITE_OG_IMAGE_ALT,
  SITE_OG_IMAGE_HEIGHT,
  SITE_OG_IMAGE_WIDTH,
  pageMetadata,
  mainLocalBusinessJsonLd,
  breadcrumbJsonLd,
  imageGalleryJsonLd,
  getImagesByCategory,
  getMorpheus8HomepageImages,
  webPageJsonLd,
  HOME_FAQS,
  HOME_TESTIMONIALS,
  faqJsonLd,
  testimonialsJsonLd,
  bookingServiceJsonLd,
  homepageServicesItemListJsonLd,
  homepageServicesImageGalleryJsonLd,
} from "@/lib/seo";

const _homeBase = pageMetadata({
  title: "Med Spa in Oswego, IL — Botox, Weight Loss & Morpheus8",
  description: SITE.metaDescription,
  path: "/",
});

export const metadata: Metadata = {
  ..._homeBase,
  other: {
    "trustpilot-one-time-domain-verification-id": "f5a14c91-c7e2-4248-8748-0a6fb8835be4",
  },
  openGraph: {
    ..._homeBase.openGraph,
    images: [{ url: SITE_OG_IMAGE, width: SITE_OG_IMAGE_WIDTH, height: SITE_OG_IMAGE_HEIGHT, alt: SITE_OG_IMAGE_ALT }],
  },
  twitter: {
    ..._homeBase.twitter,
    images: [SITE_OG_IMAGE],
  },
};

export default async function HomePage() {
  const livePlace = await getGooglePlace();
  const trust = resolveReviewTrust(livePlace);
  const homeBreadcrumbs = [{ name: "Home", url: SITE.url }];
  const injectablesImages = getImagesByCategory("injectables");
  const aestheticsImages = getImagesByCategory("aesthetics");
  const morpheus8BurstHomeImages = getMorpheus8HomepageImages();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainLocalBusinessJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(homeBreadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: "Hello Gorgeous Med Spa - NP-Directed Medical Spa in Oswego, IL",
              description:
                "#1 Best Med Spa in Oswego, IL. Medical Director Dr. Mukesh Arora, MD · NP on site. Morpheus8 Burst, injectables, GLP-1, hormone support, Solaria CO₂, IV therapy, and advanced skin + body treatments.",
              path: "/",
              image: SITE_OG_IMAGE_PATH,
              datePublished: "2023-01-01",
              dateModified: new Date().toISOString().split("T")[0],
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageServicesItemListJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(injectablesImages, "Botox & Dermal Filler Treatments"),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(aestheticsImages, "Skin Rejuvenation Treatments"),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(
              morpheus8BurstHomeImages,
              "Morpheus8 Burst RF Microneedling — Verified Provider Oswego IL",
            ),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageServicesImageGalleryJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(HOME_FAQS, `${SITE.url}/`)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bookingServiceJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(testimonialsJsonLd(HOME_TESTIMONIALS)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aroraPersonJsonLd(SITE.url)),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(
              [HOME_LOUNGE_PHOTO, HOME_CIRCLE_PHOTO, ...HOME_THIS_IS_US_PHOTOS].map((photo) => ({
                src: photo.src,
                alt: photo.alt,
                title: `Hello Gorgeous Med Spa — ${photo.caption}`,
              })),
              "This is us — Hello Gorgeous Med Spa downtown Oswego",
            ),
          ),
        }}
      />

      <main>
        <HomepageAtelier
          googleRating={trust.google.rating}
          googleCount={trust.google.count}
          liveReviews={<LiveGooglePlaceCard />}
        />
      </main>
    </>
  );
}
