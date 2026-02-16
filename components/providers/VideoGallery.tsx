"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type VideoItem = {
  id: string;
  title: string;
  description?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  service_tag?: string | null;
  duration_seconds?: number | null;
};

const SERVICE_LABELS: Record<string, string> = {
  botox: "Botox",
  lip_filler: "Lip Filler",
  prp: "PRP / PRF",
  hormone_therapy: "Hormone Therapy",
  weight_loss: "Weight Loss",
  microneedling: "Microneedling",
  laser: "Laser",
  other: "Aesthetics",
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function VideoGallery({ videos }: { videos: VideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get unique service tags
  const availableTags = Array.from(new Set(videos.map((v) => v.service_tag).filter(Boolean))) as string[];

  // Filter videos
  const filteredVideos = filter === "all" ? videos : videos.filter((v) => v.service_tag === filter);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Auto-play video when modal opens
  useEffect(() => {
    if (activeVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeVideo]);

  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setActiveVideo(null);
  }, []);

  if (videos.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Filter Pills */}
      {availableTags.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === "all"
                ? "bg-[#FF2D8E] text-white shadow-lg shadow-pink-500/30"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            }`}
          >
            All Videos ({videos.length})
          </button>
          {availableTags.map((tag) => {
            const count = videos.filter((v) => v.service_tag === tag).length;
            return (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === tag
                    ? "bg-[#FF2D8E] text-white shadow-lg shadow-pink-500/30"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {SERVICE_LABELS[tag] || tag} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <button
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left transition-all duration-300 hover:border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/10"
          >
            <div className="relative aspect-video bg-black/60">
              {video.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl text-white/50">🎬</div>
              )}
              {/* Play Button Overlay */}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-white/90 p-4 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <svg className="h-6 w-6 text-[#FF2D8E]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
              {/* Duration Badge */}
              {video.duration_seconds && (
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
                  {formatDuration(video.duration_seconds)}
                </span>
              )}
            </div>
            <div className="p-4">
              {video.service_tag && (
                <p className="text-xs uppercase tracking-[0.2em] text-pink-400">
                  {SERVICE_LABELS[video.service_tag] || video.service_tag}
                </p>
              )}
              <h4 className="mt-1 text-lg font-semibold text-white line-clamp-1">{video.title}</h4>
              {video.description && (
                <p className="mt-1 text-sm text-white/70 line-clamp-2">{video.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl rounded-3xl bg-black shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-2 text-gray-900 shadow-lg hover:bg-gray-100 transition-colors"
              onClick={handleClose}
              aria-label="Close video"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            {activeVideo.video_url ? (
              <video
                ref={videoRef}
                src={activeVideo.video_url}
                controls
                className="w-full rounded-t-3xl"
                preload="metadata"
                playsInline
                controlsList="nodownload"
              />
            ) : (
              <div className="aspect-video flex items-center justify-center rounded-t-3xl bg-gray-900">
                <p className="text-white/60">Video unavailable</p>
              </div>
            )}

            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {activeVideo.service_tag && (
                    <p className="text-xs uppercase tracking-[0.2em] text-pink-400">
                      {SERVICE_LABELS[activeVideo.service_tag] || activeVideo.service_tag}
                    </p>
                  )}
                  <h4 className="mt-1 text-2xl font-bold text-white">{activeVideo.title}</h4>
                  {activeVideo.description && (
                    <p className="mt-2 text-white/70">{activeVideo.description}</p>
                  )}
                </div>
                {activeVideo.duration_seconds && (
                  <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">
                    {formatDuration(activeVideo.duration_seconds)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
