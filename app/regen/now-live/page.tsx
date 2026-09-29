import type { Metadata } from "next";

import { RegenNowLivePageContent } from "@/components/regen/RegenNowLivePageContent";
export const metadata: Metadata = {
  title: "REGEN RX is live | Hello Gorgeous Med Spa",
  description:
    "Request GLP-1 and other protocols online. A licensed Illinois clinician reviews every request. If approved, a clinic invoice and pharmacy delivery. Illinois adults 21+.",
  alternates: { canonical: "https://tryregenrx.com/now-live" },
  openGraph: {
    title: "REGEN RX is live",
    description: "Your wellness. Your schedule. Licensed Illinois clinicians. Delivery to your door.",
    url: "https://tryregenrx.com/now-live",
    images: [{ url: "https://tryregenrx.com/images/marketing/regen-now-live.jpg", width: 1080, height: 1920 }],
  },
};

export default function RegenNowLivePage() {
  return <RegenNowLivePageContent />;
}
