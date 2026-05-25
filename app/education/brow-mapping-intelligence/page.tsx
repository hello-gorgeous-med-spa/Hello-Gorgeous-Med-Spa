import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Brow Mapping Intelligence | Hello Gorgeous",
  robots: { index: false, follow: false },
};

/** Legacy education URL — staff tool lives in admin (auth-protected). */
export default function BrowMappingIntelligencePage() {
  redirect("/admin/tools/brow-mapping");
}
