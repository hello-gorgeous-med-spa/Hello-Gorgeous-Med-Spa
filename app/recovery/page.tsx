import type { Metadata } from "next";
import Link from "next/link";
import { RECOVERY_PAGES } from "@/lib/topical-expansion";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Recovery Timelines | Hello Gorgeous Med Spa",
  description: "Recovery timeline pages for high-interest treatments.",
  path: "/recovery",
});

export default function RecoveryIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-black text-black">Recovery Timeline Guides</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {RECOVERY_PAGES.map((item) => (
          <Link key={item.slug} href={`/recovery/${item.slug}`} className="rounded-xl border-2 border-black bg-white p-4 font-semibold text-[#E6007E]">
            {item.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
