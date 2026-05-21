import type { Metadata } from "next";

import { NadPlusInjectionsLanding } from "@/components/marketing/NadPlusInjectionsLanding";
import {
  NAD_PLUS_FAQS,
  NAD_PLUS_INJECTIONS_PATH,
  nadPlusPageJsonLd,
} from "@/lib/nad-plus-injections";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE } from "@/lib/seo";

const meta = pageMetadata({
  title: "NAD+ Injections in Oswego, IL | Hello Gorgeous Med Spa",
  description:
    "NAD+ injection therapy at Hello Gorgeous Med Spa in Oswego, IL. Support cellular energy, focus, mitochondrial wellness, and healthy aging pathways with a quick clinical wellness visit. Serving Naperville, Aurora & Plainfield.",
  path: NAD_PLUS_INJECTIONS_PATH,
});

export const metadata: Metadata = {
  ...meta,
  keywords: [
    "NAD+ injections Oswego IL",
    "NAD injection Naperville",
    "cellular wellness Oswego",
    "mitochondrial wellness med spa",
    "NAD+ shot Illinois",
    "Hello Gorgeous Med Spa NAD",
  ],
  openGraph: {
    ...meta.openGraph,
    images: [
      {
        url: `${SITE.url}/images/marketing/nad-plus-vial-hello-gorgeous.svg`,
        width: 1200,
        height: 630,
        alt: "NAD+ injection therapy Hello Gorgeous Med Spa Oswego IL",
      },
    ],
  },
};

export default function NadPlusInjectionsOswegoPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "NAD+ Injections", path: NAD_PLUS_INJECTIONS_PATH },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(nadPlusPageJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([...NAD_PLUS_FAQS])),
        }}
      />
      <NadPlusInjectionsLanding />
    </>
  );
}
