import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RxProtocolPageContent } from "@/components/rx/RxProtocolPageContent";
import { clinicalPageJsonLd } from "@/lib/medical-authority";
import {
  getPublishedProtocol,
  publishedProtocolModels,
  relatedProtocols,
  RX_PROTOCOLS_PATH,
} from "@/lib/regen/catalog/protocol-pages";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedProtocolModels().map((protocol) => ({ slug: protocol.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const protocol = getPublishedProtocol(slug);
  if (!protocol) {
    return { title: "Protocol | RE GEN" };
  }
  return {
    ...pageMetadata({
      title: `${protocol.name} Protocol | RE GEN Hello Gorgeous Oswego`,
      description:
        protocol.what.slice(0, 155) ||
        `${protocol.name} — ${protocol.tagline}. NP-supervised Hello Gorgeous RX in Oswego, IL.`,
      path: protocol.path,
    }),
    robots: { index: true, follow: true },
  };
}

export default async function RxProtocolPage({ params }: Props) {
  const { slug } = await params;
  const protocol = getPublishedProtocol(slug);
  if (!protocol) notFound();

  const url = `${SITE.url}${protocol.path}`;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "RE GEN", url: `${SITE.url}/rx` },
    { name: "Protocols", url: `${SITE.url}${RX_PROTOCOLS_PATH}` },
    { name: protocol.name, url },
  ];
  const clinicalLd = clinicalPageJsonLd({
    url,
    name: `${protocol.name} protocol | RE GEN`,
    description: protocol.tagline,
    siteUrl: SITE.url,
    extraNodes: [breadcrumbJsonLd(breadcrumbs)],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicalLd) }} />
      <RxProtocolPageContent protocol={protocol} related={relatedProtocols(protocol)} />
    </>
  );
}
