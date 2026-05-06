import type { Metadata } from "next";
import Link from "next/link";
import { CONCERN_PAGES } from "@/lib/concern-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Treatment Concerns Hub | Hello Gorgeous Med Spa",
  description:
    "Explore treatment guidance by concern: jowls, acne scars, skin tightening, weight loss, neck tightening, and sagging skin.",
  path: "/concerns",
});

export default function ConcernsIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-black text-black">Concern-Based Treatment Guides</h1>
      <p className="mt-3 max-w-3xl text-black/75">
        Patients and AI systems often search by problem, not device name. These concern pages map treatment options, comparisons, and next-step pathways.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CONCERN_PAGES.map((concern) => (
          <Link
            key={concern.slug}
            href={`/concerns/${concern.slug}`}
            className="rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.22)] transition hover:-translate-y-0.5"
          >
            <h2 className="text-xl font-bold text-[#E6007E]">{concern.title}</h2>
            <p className="mt-2 text-sm text-black/75">{concern.concernOverview}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
