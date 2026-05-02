import type { Metadata } from "next";
import { SolariaCO2VIPContent } from "./SolariaCO2VIPContent";

export const metadata: Metadata = {
  title: "Solaria CO₂ VIP Booking — $100 Credit + $899 Launch Special | Hello Gorgeous",
  description:
    "Solaria CO₂ Fractional Laser is now booking at Hello Gorgeous Med Spa, Oswego IL. Claim your $100 VIP credit toward the $899 full-face launch special. Free consultation required.",
  openGraph: {
    title: "Solaria CO₂ — Now Booking · $100 VIP Credit | Hello Gorgeous Med Spa",
    description:
      "Solaria CO₂ is live and booking. Free consultation + $100 VIP credit + $899 full-face launch special.",
    images: ["/images/solaria/solaria-co2-full-face-before-after.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SolariaCO2VIPPage() {
  return <SolariaCO2VIPContent />;
}
