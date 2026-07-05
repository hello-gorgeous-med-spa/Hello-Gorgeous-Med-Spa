import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Start RE GEN | Quick Intake | Hello Gorgeous Med Spa",
  description:
    "Scan at Hello Gorgeous Med Spa to start RE GEN — weight loss, peptides, hormones, and wellness prescriptions shipped across Illinois.",
  path: "/rx/start",
  keywords: ["RE GEN start", "Hello Gorgeous RX intake", "med spa QR RE GEN"],
});

export default function RxStartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
