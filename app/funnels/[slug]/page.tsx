import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConsultationFunnelForm } from "@/components/funnels/ConsultationFunnelForm";
import { FUNNEL_DEFINITIONS, getFunnelBySlug } from "@/lib/funnels";
import { pageMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return FUNNEL_DEFINITIONS.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const funnel = getFunnelBySlug(params.slug);
  if (!funnel) return pageMetadata({ title: "Consultation Funnel", description: "Consultation funnel", path: "/funnels" });
  return pageMetadata({
    title: `${funnel.title} | Hello Gorgeous Med Spa`,
    description: `${funnel.title} intake funnel for consultation routing and automation workflow.`,
    path: `/funnels/${funnel.slug}`,
  });
}

export default function FunnelDetailPage({ params }: { params: Params }) {
  const funnel = getFunnelBySlug(params.slug);
  if (!funnel) notFound();
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <ConsultationFunnelForm funnel={funnel} />
    </main>
  );
}
