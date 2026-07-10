import { notFound, redirect } from "next/navigation";

import { goalFromSlug } from "@/lib/regen/catalog";

type Props = { params: Promise<{ slug: string }> };

/** Legacy goal URLs — canonical shop is /rx?goal=… */
export default async function LegacyRxCatalogGoalRedirect({ params }: Props) {
  const { slug } = await params;
  if (!goalFromSlug(slug)) notFound();
  redirect(`/rx?goal=${encodeURIComponent(slug)}`);
}
