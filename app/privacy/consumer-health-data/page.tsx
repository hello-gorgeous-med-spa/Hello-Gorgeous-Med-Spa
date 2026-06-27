import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ConsumerHealthDataPolicy } from "./ConsumerHealthDataPolicy";

export const metadata: Metadata = pageMetadata({
  title: "Consumer Health Data Privacy Policy",
  description:
    "Hello Gorgeous Med Spa's Consumer Health Data Privacy Policy — your rights under applicable state law regarding how we collect, use, and share consumer health data.",
  path: "/privacy/consumer-health-data",
});

export default function ConsumerHealthDataPage() {
  return <ConsumerHealthDataPolicy />;
}
