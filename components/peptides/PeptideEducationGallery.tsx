import Image from "next/image";
import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import {
  PEPTIDE_EDUCATION_THUMBNAILS,
  peptideEducationHref,
} from "@/lib/peptide-thumbnails";

export function PeptideEducationGallery() {
  return (
    <Section id="peptide-education-gallery" className="border-t-4 border-black bg-white">
      <FadeUp>
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF0F7] border-2 border-[#E6007E]/30 mb-4">
            <span className="text-sm font-bold uppercase tracking-wider text-[#E6007E]">
              Patient education series
            </span>
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-black">
            All <span className="text-[#E6007E]">20</span> peptide education sheets
          </h2>
          <p className="mt-4 text-black/75 max-w-2xl mx-auto">
            Danielle&apos;s branded Hello Gorgeous RX™ thumbnails — tap any peptide to open its guide or goal-matcher
            page. NP-led $49 consult in downtown Oswego.
          </p>
        </div>
      </FadeUp>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {PEPTIDE_EDUCATION_THUMBNAILS.map((item, idx) => (
          <FadeUp key={item.slug} delayMs={idx * 25}>
            <Link
              href={peptideEducationHref(item)}
              className="group block overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.2)] transition hover:border-[#E6007E] hover:shadow-[6px_6px_0_0_rgba(230,0,126,0.35)]"
            >
              <div className="relative aspect-video overflow-hidden border-b-4 border-black">
                <Image
                  src={item.thumbnailWebp}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <div className="px-3 py-3">
                <p className="text-sm font-black text-black group-hover:text-[#E6007E]">{item.name}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-black/45">
                  {item.topicSlug ? "Full guide →" : "In goal matcher →"}
                </p>
              </div>
            </Link>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}
