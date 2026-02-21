import type { Metadata } from "next";
import { SolariaCO2VIPContent } from "./SolariaCO2VIPContent";

export const metadata: Metadata = {
  title: "Solaria CO₂ VIP Early Access | Hello Gorgeous Med Spa",
  description: "Join the exclusive VIP waitlist for Solaria CO₂ Fractional Laser at Hello Gorgeous Med Spa. Priority booking, $50 VIP credit, and early access. Oswego, IL.",
  openGraph: {
    title: "Solaria CO₂ VIP Early Access | Hello Gorgeous Med Spa",
    description: "Limited Launch Access | Priority Booking | $50 VIP Credit. Join the exclusive waitlist for advanced skin resurfacing.",
    images: ["/images/promo/solaria-coming-soon-banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SolariaCO2VIPPage() {
  return <SolariaCO2VIPContent />;
}
