import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "HG Face Blueprint™ – AI-Assisted Aesthetic Simulation",
  description:
    "See your aesthetic potential. Upload a selfie, select treatments, and get a personalized blueprint. Licensed professionals. Real results. Hello Gorgeous Med Spa, Oswego IL.",
  path: "/face-blueprint",
});

export default function FaceBlueprintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
