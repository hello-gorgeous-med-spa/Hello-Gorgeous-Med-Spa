"use client";

import { useState } from "react";

interface Video {
  id: string;
  video_url?: string;
  video_thumbnail_url?: string;
  video_orientation?: string;
  title?: string;
  description?: string;
  featured?: boolean;
}

interface Props {
  videos: Video[];
  providerName: string;
}

export function ProviderVideos({ videos, providerName }: Props) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  return (
    <section className="bg-white py-24 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-black text-center mb-12">
          Videos from <span className="text-[#E6007E]">{providerName.split(" ")[0]}</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-black/5 hover:shadow-xl transition-all duration-300"
            >
              {video.video_thumbnail_url ? (
                <img
                  src={video.video_thumbnail_url}
                  alt={video.title || "Video thumbnail"}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <svg
                    className="w-16 h-16 text-black/30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}

              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-[#E6007E] flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Featured badge */}
              {video.featured && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-[#E6007E] text-white rounded">
                    Featured
                  </span>
                </div>
              )}

              {/* Title */}
              {video.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm font-medium truncate">
                    {video.title}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-[#E6007E] transition-colors"
            onClick={() => setActiveVideo(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className={`relative ${
              activeVideo.video_orientation === "horizontal"
                ? "w-full max-w-4xl aspect-video"
                : "w-full max-w-sm aspect-[9/16]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={activeVideo.video_url}
              controls
              autoPlay
              className="w-full h-full rounded-lg"
            />
            {activeVideo.title && (
              <div className="mt-4 text-center">
                <h3 className="text-white text-xl font-semibold">
                  {activeVideo.title}
                </h3>
                {activeVideo.description && (
                  <p className="text-white/70 mt-2">{activeVideo.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
