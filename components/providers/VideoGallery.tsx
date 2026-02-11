"use client";

import { useState } from "react";

type VideoItem = {
  id: string;
  title: string;
  description?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  service_tag?: string;
};

export function VideoGallery({ videos }: { videos: VideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  if (videos.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left"
          >
            <div className="relative aspect-video bg-black/60">
              {video.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={video.thumbnail_url} alt={video.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl text-white/50">🎬</div>
              )}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-gray-900">Play</span>
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-pink-400">{video.service_tag}</p>
              <h4 className="mt-1 text-lg font-semibold text-white">{video.title}</h4>
              <p className="text-sm text-white/70 line-clamp-2">{video.description}</p>
            </div>
          </button>
        ))}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-black shadow-2xl">
            <button
              className="absolute right-3 top-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {activeVideo.video_url ? (
              <video src={activeVideo.video_url} controls className="w-full rounded-3xl" preload="none" playsInline />
            ) : (
              <div className="p-12 text-center text-white/60">Video unavailable</div>
            )}
            <div className="p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-pink-400">{activeVideo.service_tag}</p>
              <h4 className="text-2xl font-bold text-white">{activeVideo.title}</h4>
              <p className="text-white/70">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
