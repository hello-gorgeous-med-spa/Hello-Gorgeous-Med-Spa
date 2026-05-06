import type { Metadata } from "next";
import Link from "next/link";
import { FUNNEL_DEFINITIONS } from "@/lib/funnels";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Consultation Funnels | Hello Gorgeous Med Spa",
  description:
    "Smart consultation funnels for candidacy, treatment matching, and lead routing into booking, SMS, and email workflows.",
  path: "/funnels",
});

export default function FunnelsIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-black text-black">Consultation Funnels</h1>
      <p className="mt-3 max-w-3xl text-black/75">
        Funnel workflows collect concern type, treatment interest, urgency, budget range, and contact preference, then route into booking and follow-up operations.
      </p>
      <div className="mt-7 grid gap-3">
        {FUNNEL_DEFINITIONS.map((funnel) => (
          <Link key={funnel.slug} href={`/funnels/${funnel.slug}`} className="rounded-xl border-2 border-black bg-white p-4 font-semibold text-[#E6007E]">
            {funnel.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
