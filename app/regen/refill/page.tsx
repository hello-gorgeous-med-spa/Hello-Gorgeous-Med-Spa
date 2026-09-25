import type { Metadata } from "next";

import { Bpc157RefillScreening } from "@/components/regen/Bpc157RefillScreening";
import { RegenPublicNav } from "@/components/regen/RegenPublicNav";
import { REGEN_REFILL_HUB_PATH } from "@/lib/regen/bpc-157-refill-screening";
import { regenRequestSkuById, type RegenRequestIntent } from "@/lib/regen/refill-request-catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Compound shop | REGEN RX",
    description:
      "Shop Hello Gorgeous RX protocols, see patient pricing, and request a refill or add-on. Ryan reviews every request before any clinic invoice.",
    path: REGEN_REFILL_HUB_PATH,
  }),
};

export default async function RegenRefillHubPage({
  searchParams,
}: {
  searchParams: Promise<{ sku?: string; intent?: string }>;
}) {
  const sp = await searchParams;
  const sku = regenRequestSkuById(sp.sku)?.id;
  const intent: RegenRequestIntent | undefined =
    sp.intent === "add" || sp.intent === "refill" ? sp.intent : undefined;
  return (
    <>
      <RegenPublicNav />
      <Bpc157RefillScreening initialSkuId={sku} initialIntent={intent} />
    </>
  );
}
