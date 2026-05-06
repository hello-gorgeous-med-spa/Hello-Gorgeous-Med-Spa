"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { LibraryVideo } from "@/lib/video-library";
import { VideoEmbed } from "@/components/video/VideoEmbed";

export function VideoLibraryClient({ videos }: { videos: LibraryVideo[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((video) => {
      const categoryMatch = category === "all" || video.category === category;
      if (!categoryMatch) return false;
      if (!q) return true;
      const haystack = `${video.title} ${video.summary} ${video.transcript} ${video.concernTags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [videos, query, category]);

  return (
    <div>
      <div className="grid gap-3 rounded-2xl border-2 border-black bg-white p-4 md:grid-cols-[1fr_auto] md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transcripts, concerns, or topics..."
          className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-black/20 px-3 py-2 text-sm"
        >
          <option value="all">All categories</option>
          <option value="provider-reel">Provider reels</option>
          <option value="educational">Educational</option>
          <option value="faq-clip">FAQ clips</option>
          <option value="consultation-explainer">Consult explainer</option>
          <option value="treatment-walkthrough">Treatment walkthrough</option>
        </select>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {filtered.map((video) => (
          <article key={video.id} className="rounded-2xl border-2 border-black bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#E6007E]">{video.category.replace("-", " ")}</p>
            <h3 className="mt-1 text-xl font-bold text-black">{video.title}</h3>
            <p className="mt-2 text-black/80">{video.summary}</p>
            <div className="mt-3 aspect-video overflow-hidden rounded-lg border border-black/10 bg-black">
              <VideoEmbed embedUrl={video.embedUrl} title={video.title} />
            </div>
            <p className="mt-3 text-sm text-black/75">{video.transcript}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {video.relatedServices.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full border border-black/20 px-3 py-1 text-xs font-medium text-[#E6007E]">
                  {item.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
