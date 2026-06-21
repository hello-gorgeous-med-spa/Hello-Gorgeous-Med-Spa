import Image from "next/image";
import Link from "next/link";

import type { Skin101Guide } from "@/lib/skin-101-nav";

export function Skin101GuideCard({ guide, compact = false }: { guide: Skin101Guide; compact?: boolean }) {
  return (
    <article
      className={`group rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] overflow-hidden flex flex-col transition hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_rgba(230,0,126,0.45)] ${compact ? "rounded-2xl shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]" : ""}`}
    >
      <Link
        href={guide.path}
        className={`relative block overflow-hidden border-b-4 border-black ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}
      >
        <Image
          src={guide.thumbnailImage}
          alt={guide.thumbnailAlt}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(230,0,126,0.35) 45%, rgba(230,0,126,0.08) 100%)",
          }}
        />
        {guide.badge ? (
          <span className="absolute top-3 left-3 rounded-full border-2 border-black bg-[#E6007E] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {guide.badge}
          </span>
        ) : null}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] text-[#FFB8DC]">
            {guide.tagline}
          </p>
          <h3 className="mt-1 text-lg md:text-xl font-black text-white leading-snug drop-shadow-sm">
            {guide.title}
          </h3>
        </div>
      </Link>

      {!compact ? (
        <div className="p-5 md:p-6 flex flex-col flex-1">
          <p className="text-sm md:text-base text-black/80 leading-relaxed font-medium flex-1">{guide.excerpt}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={guide.path}
              className="inline-flex items-center rounded-full bg-[#E6007E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#c9006e] transition"
            >
              Read guide
            </Link>
            {guide.pdfPath ? (
              <a
                href={guide.pdfPath}
                className="inline-flex items-center rounded-full border-2 border-black px-5 py-2.5 text-sm font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E] transition"
              >
                PDF
              </a>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="p-4">
          <p className="text-sm text-black/70 line-clamp-2">{guide.excerpt}</p>
        </div>
      )}
    </article>
  );
}
