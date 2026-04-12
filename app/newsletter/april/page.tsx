import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SITE } from "@/lib/seo";

const STATIC_PATH = "/newsletter/hello-gorgeous-april.html";

export const metadata: Metadata = {
  title: "April Newsletter | Hello Gorgeous Med Spa",
  description:
    "Seasonal tips, treatments, and updates from Hello Gorgeous Med Spa — Oswego’s trusted medical aesthetics team.",
  alternates: { canonical: `${SITE.url}/newsletter/april` },
  openGraph: {
    title: "April Newsletter | Hello Gorgeous Med Spa",
    description: "Seasonal tips and med spa updates from Hello Gorgeous in Oswego, IL.",
    url: `${SITE.url}/newsletter/april`,
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
  },
};

/** Serves the static HTML asset under /public (same design as email blast). */
export default function AprilNewsletterPage() {
  redirect(STATIC_PATH);
}
