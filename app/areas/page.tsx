import type { Metadata } from "next";
import Link from "next/link";
import { AREA_PAGES } from "@/lib/topical-expansion";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Treatment Area Guides | Hello Gorgeous Med Spa",
  description: "Body-area and facial-area treatment guidance with related service links.",
  path: "/areas",
});

export default function AreasIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-black text-black">Treatment Area Guides</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {AREA_PAGES.map((item) => (
          <Link key={item.slug} href={`/areas/${item.slug}`} className="rounded-xl border-2 border-black bg-white p-4 font-semibold text-[#E6007E]">
            {item.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
