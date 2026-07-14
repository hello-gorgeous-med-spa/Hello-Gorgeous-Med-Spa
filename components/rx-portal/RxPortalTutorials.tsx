"use client";

import Link from "next/link";

import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";
import { rxPortalTutorials } from "@/lib/rx-portal/documents";

export function RxPortalTutorials() {
  const tutorials = rxPortalTutorials();
  const videos = tutorials.filter((t) => t.videoSrc);
  const docs = tutorials.filter((t) => !t.videoSrc);

  return (
    <RxPortalShell title="How To Tutorials">
      <p className="mb-4 text-sm text-slate-600">
        FormuConnect pharmacy videos + clinical cheat sheets — no PHI. Use Chrome for vendor portals.
      </p>

      {videos.length > 0 ? (
        <section className="mb-8">
          <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-teal-700">
            FormuConnect (pharmacy portal)
          </h3>
          <ul className="grid gap-4 lg:grid-cols-2">
            {videos.map((t) => (
              <li
                key={t.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                  {t.category}
                </p>
                <h3 className="mt-1 font-bold text-[#0B1F33]">{t.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{t.description}</p>
                <video
                  className="mt-3 w-full rounded-lg bg-black aspect-video"
                  controls
                  preload="metadata"
                  playsInline
                >
                  <source src={t.videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.{" "}
                  <a href={t.href} className="text-teal-600 underline">
                    Download video
                  </a>
                </video>
                <a
                  href={t.href}
                  download
                  className="mt-2 inline-flex text-xs font-semibold text-slate-500 hover:text-teal-700"
                >
                  Download MP4 ↓
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-500">
          Clinical cheat sheets
        </h3>
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {docs.map((t) => (
            <li key={t.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                {t.category}
              </p>
              <h3 className="mt-1 font-bold text-[#0B1F33]">{t.title}</h3>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">{t.description}</p>
              <Link
                href={t.href}
                className="mt-3 inline-flex text-sm font-semibold text-teal-700 hover:underline"
              >
                Open tutorial →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </RxPortalShell>
  );
}
