import Link from "next/link";
import { getRelatedContent } from "@/lib/search/search-index";

export function RelatedContentModule({ seedTags, title = "Related Content" }: { seedTags: string[]; title?: string }) {
  const items = getRelatedContent(seedTags, 6);
  if (!items.length) return null;

  return (
    <section className="rounded-2xl border-2 border-black bg-white p-5">
      <h2 className="text-xl font-bold text-[#E6007E]">{title}</h2>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <Link key={`${item.type}-${item.id}`} href={item.href} className="rounded-lg border border-black/10 px-3 py-2 text-sm font-medium text-black hover:text-[#E6007E]">
            {item.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
