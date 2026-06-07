import type { Metadata } from "next";

import { VitaminBarApp } from "@/components/vitamin-bar/VitaminBarApp";
import { pageMetadata } from "@/lib/seo";
import { VITAMIN_BAR } from "@/lib/vitamin-bar";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${VITAMIN_BAR.name} — Drive-Thru Vitamin Shots | Hello Gorgeous Med Spa Oswego`,
    description:
      "Oswego's wellness drive-thru. Browse vitamin & wellness shots, join a membership, pre-pay, and schedule a quick in-and-out at Hello Gorgeous Med Spa.",
    path: VITAMIN_BAR.path,
  }),
  // App-like experience — keep it reachable in search.
  robots: { index: true, follow: true },
  // Custom home-screen icon when installed from the Vitamin Bar.
  icons: {
    icon: "/icons/vitamin-bar-icon-192.png",
    apple: "/icons/vitamin-bar-icon-180.png",
  },
};

export default function VitaminBarPage() {
  return <VitaminBarApp />;
}
