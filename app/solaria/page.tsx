import type { Metadata } from "next";
import { SolariaPageContent } from "./SolariaPageContent";

export const metadata: Metadata = {
  title: "Solaria CO₂ Laser | Pre & Post Treatment Care | Hello Gorgeous Med Spa",
  description:
    "Complete pre-treatment and post-treatment care for Solaria CO₂ fractional laser at Hello Gorgeous Med Spa. Day-by-day healing timeline, products needed, when to call. Oswego, Naperville, Aurora IL.",
  keywords: [
    "Solaria CO2",
    "CO2 laser aftercare",
    "CO2 laser recovery",
    "fractional laser healing",
    "skin resurfacing aftercare",
    "Hello Gorgeous Med Spa",
    "Oswego IL med spa",
  ],
  openGraph: {
    title: "Solaria CO₂ Laser Pre & Post Treatment Care | Hello Gorgeous Med Spa",
    description: "Complete day-by-day healing guide for CO₂ laser. Pre-care, post-treatment timeline, products needed, and when to call.",
    url: "https://www.hellogorgeousmedspa.com/solaria",
  },
};

export default function SolariaPage() {
  return <SolariaPageContent />;
}
