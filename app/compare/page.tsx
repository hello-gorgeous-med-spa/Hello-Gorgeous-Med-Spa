import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Treatment Comparisons | Hello Gorgeous Med Spa",
  description:
    "Compare Morpheus8, Quantum RF, Solaria CO2, and GLP-1 treatment options with practical guidance from Hello Gorgeous Med Spa.",
  path: "/compare",
});

const COMPARISONS = [
  { href: "/compare/morpheus8-vs-rf-microneedling", title: "Morpheus8 vs RF Microneedling" },
  { href: "/compare/quantum-rf-vs-facelift", title: "Quantum RF vs Facelift" },
  { href: "/compare/solaria-co2-vs-traditional-co2", title: "Solaria CO2 vs Traditional CO2" },
  { href: "/compare/glp1-vs-traditional-weight-loss", title: "GLP-1 vs Traditional Weight Loss" },
];

export default function CompareIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-black text-black">Treatment Comparison Guides</h1>
      <p className="mt-4 text-black/75">
        Educational comparisons to help you understand candidacy, downtime, timeline, and value.
      </p>
      <div className="mt-8 grid gap-3">
        {COMPARISONS.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl border-2 border-black p-4 font-semibold text-[#E6007E]">
            {item.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
