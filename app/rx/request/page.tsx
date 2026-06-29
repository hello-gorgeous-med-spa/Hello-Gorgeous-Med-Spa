import type { Metadata } from "next";

import { RxRequestPortal } from "@/components/rx/RxRequestPortal";
import { RX_REQUEST_HERO, RX_REQUEST_PORTAL_PATH } from "@/lib/rx-request-portal";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "RX Request Portal | Hello Gorgeous RX™ — Telehealth Prescriptions",
    description:
      "Choose your goal — weight loss, hormones, peptides, sexual health & more. NP-reviewed requests with published pricing. Shipped to your door across Illinois.",
    path: RX_REQUEST_PORTAL_PATH,
  }),
  openGraph: {
    title: `${RX_REQUEST_HERO.title} ${RX_REQUEST_HERO.titleAccent} | Hello Gorgeous RX™`,
    description: RX_REQUEST_HERO.body,
    url: `${SITE.url}${RX_REQUEST_PORTAL_PATH}`,
    images: [
      {
        url: `${SITE.url}/images/shop-rx/rx-hero-team.png`,
        width: 1200,
        height: 900,
        alt: "Hello Gorgeous RX — NP-supervised telehealth",
      },
    ],
  },
};

export default function RxRequestPortalPage() {
  return <RxRequestPortal />;
}
