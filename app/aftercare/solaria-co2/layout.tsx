import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solaria CO₂ Laser Pre & Post Treatment Instructions | Hello Gorgeous Med Spa",
  description:
    "Complete pre-treatment and post-treatment care instructions for Solaria CO₂ fractional laser at Hello Gorgeous Med Spa in Oswego IL. Day-by-day healing timeline, what to avoid, products needed, and when to call. Serving Naperville, Aurora, Plainfield.",
  keywords: [
    "CO2 laser aftercare",
    "Solaria CO2 post treatment",
    "CO2 laser recovery",
    "fractional laser healing",
    "CO2 laser pre treatment instructions",
    "laser resurfacing aftercare",
    "CO2 laser downtime",
    "skin resurfacing recovery",
    "Hello Gorgeous Med Spa",
    "Oswego IL med spa",
    "Naperville CO2 laser",
    "Aurora laser treatment",
  ],
  alternates: {
    canonical: "https://www.hellogorgeousmedspa.com/aftercare/solaria-co2",
  },
  openGraph: {
    title: "Solaria CO₂ Laser Pre & Post Treatment Care | Hello Gorgeous Med Spa",
    description: "Complete day-by-day healing guide for CO₂ laser treatment. Pre-care instructions, post-treatment timeline, products needed, and emergency signs.",
    url: "https://www.hellogorgeousmedspa.com/aftercare/solaria-co2",
    siteName: "Hello Gorgeous Med Spa",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://www.hellogorgeousmedspa.com/images/solaria/solaria-aftercare-og.jpg",
        width: 1200,
        height: 630,
        alt: "Solaria CO2 Laser Pre and Post Treatment Instructions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solaria CO₂ Laser Aftercare Instructions",
    description: "Complete pre & post treatment care guide for CO₂ fractional laser at Hello Gorgeous Med Spa.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SolariaAfterCareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
