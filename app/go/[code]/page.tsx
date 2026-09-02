import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PartnerDoorLanding } from "@/components/partner-network/PartnerDoorLanding";
import { bumpPartnerScan, getPartnerLocationByCode } from "@/lib/partner-network-server";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const found = await getPartnerLocationByCode(code);
  if (!found) {
    return { title: "Referral door", robots: { index: false, follow: false } };
  }
  return {
    title: `${found.location.name} · Hello Gorgeous RE GEN`,
    description:
      "You were referred to Hello Gorgeous RE GEN. NP-reviewed peptides and weight loss. The referring spa does not store or inject medication.",
    robots: { index: false, follow: false },
  };
}

export default async function PartnerDoorPage({ params }: Props) {
  const { code } = await params;
  const found = await getPartnerLocationByCode(code);
  if (!found) notFound();
  void bumpPartnerScan(found.location.id);
  return (
    <PartnerDoorLanding
      code={found.location.slug}
      spaName={found.location.name}
      city={found.location.city}
    />
  );
}
