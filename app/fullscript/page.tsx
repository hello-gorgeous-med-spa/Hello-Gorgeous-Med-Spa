import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FullscriptPageContent } from "./FullscriptPageContent";

export const metadata: Metadata = pageMetadata({
  title: "Fullscript Dispensary | Professional Supplements | Hello Gorgeous Med Spa",
  description:
    "Access practitioner-grade supplements through Hello Gorgeous. Sleep, gut health, energy, skin & nails, immunity, stress support. Curated by Ryan & Danielle. Shop Fullscript.",
  path: "/fullscript",
});

export default function FullscriptPage() {
  return <FullscriptPageContent />;
}
