import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solaria CO₂ Laser Pre & Post Treatment Instructions | Hello Gorgeous Med Spa",
  description:
    "Complete pre-treatment and post-treatment care instructions for Solaria CO₂ fractional laser at Hello Gorgeous Med Spa. Ensure optimal healing and results.",
  openGraph: {
    title: "Solaria CO₂ Laser Pre & Post Treatment Care",
    description: "Complete pre-treatment and post-treatment care instructions for optimal healing and results.",
  },
};

export default function SolariaAfterCareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
