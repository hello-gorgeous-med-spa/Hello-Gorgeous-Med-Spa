import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { IVTherapyContent } from "./IVTherapyContent";

export const metadata: Metadata = pageMetadata({
  title: "IV Therapy",
  description:
    "IV Vitamin Therapy at Hello Gorgeous Med Spa in Oswego, IL. Myers' Cocktail, NAD+, Glutathione, Immunity Boost, Hydration & custom IV drips. Powered by Olympia Pharmacy.",
  path: "/iv-therapy",
});

export default function IVTherapyPage() {
  return <IVTherapyContent />;
}
