import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Treatment Quiz | Find Your Perfect Med Spa Treatment | Hello Gorgeous",
  description:
    "Take our free treatment quiz to get personalized med spa recommendations — Botox, fillers, Morpheus8, weight loss, IV therapy & more in Oswego, IL.",
  path: "/quiz/treatment",
});

export default function TreatmentQuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
