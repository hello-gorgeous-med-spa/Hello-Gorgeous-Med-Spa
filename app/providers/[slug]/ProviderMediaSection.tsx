'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BeforeAfterSlider } from '@/components/providers/BeforeAfterSlider';

interface MediaItem {
  id: string;
  type: 'video' | 'before_after';
  video_url: string | null;
  video_thumbnail_url: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  title: string | null;
  description: string | null;
  service_tag: string | null;
  is_featured: boolean;
}

interface Props {
  media: MediaItem[];
  type: 'video' | 'before_after';
}

export function ProviderMediaSection({ media, type }: Props) {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Get unique service tags
  const tags = ['all', ...new Set(media.map((m) => m.service_tag).filter(Boolean))];

  // Filter media by selected tag
  const filtered = selectedTag === 'all' 
    ? media 
    : media.filter((m) => m.service_tag === selectedTag);

  return (
    <div>
      {/* Filter Tags - only show if more than "all" */}
      {tags.length > 2 && (
        <div className="flex gap-3 mb-8 flex-wrap">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedTag === tag
                  ? 'bg-[#FF2D8E] text-white'
                  : 'bg-white border-2 border-black text-black hover:border-[#FF2D8E]'
              }`}
            >
              {tag === 'all' ? 'All' : tag.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedMedia(item)}
            className="cursor-pointer group"
          >
            {type === 'video' ? (
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-2 border-white">
                {item.video_thumbnail_url ? (
                  <Image
                    src={item.video_thumbnail_url}
                    alt={item.title || 'Video'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <span className="text-6xl">🎬</span>
                  </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#FF2D8E]">
                    <span className="text-[#FF2D8E] text-2xl ml-1">▶</span>
                  </div>
                </div>
                {item.is_featured && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#FF2D8E] text-white text-xs font-bold rounded-full">
                    Featured
                  </span>
                )}
              </div>
            ) : (
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border-2 border-black group-hover:border-[#FF2D8E] transition-colors">
                {/* Before/After Preview */}
                <div className="absolute inset-0 grid grid-cols-2">
                  <div className="relative">
                    {item.before_image_url && (
                      <Image
                        src={item.before_image_url}
                        alt="Before"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="relative">
                    {item.after_image_url && (
                      <Image
                        src={item.after_image_url}
                        alt="After"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
                {/* Divider line */}
                <div className="absolute inset-y-0 left-1/2 w-1 bg-[#FF2D8E]" />
                {/* Labels */}
                <span className="absolute bottom-3 left-3 px-2 py-1 bg-black text-white text-xs font-bold rounded">
                  Before
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-1 bg-[#FF2D8E] text-white text-xs font-bold rounded">
                  After
                </span>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-bold transition-opacity bg-black/50 px-4 py-2 rounded-lg">
                    Click to view
                  </span>
                </div>
              </div>
            )}
            {item.title && (
              <h3 className="mt-4 font-bold">{item.title}</h3>
            )}
            {item.service_tag && (
              <span className="inline-block mt-2 px-3 py-1 border-2 border-[#FF2D8E] text-[#FF2D8E] text-xs font-bold rounded-full">
                {item.service_tag.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-12">
          No {type === 'video' ? 'videos' : 'results'} available for this filter
        </p>
      )}

      {/* Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white text-black text-xl flex items-center justify-center hover:bg-[#FF2D8E] hover:text-white transition z-10"
          >
            ✕
          </button>
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-black"
            onClick={(e) => e.stopPropagation()}
          >
            {type === 'video' && selectedMedia.video_url ? (
              <div className="aspect-video bg-black">
                <video
                  src={selectedMedia.video_url}
                  className="w-full h-full"
                  controls
                  autoPlay
                  playsInline
                />
              </div>
            ) : selectedMedia.before_image_url && selectedMedia.after_image_url ? (
              <div className="p-6">
                <BeforeAfterSlider
                  beforeUrl={selectedMedia.before_image_url}
                  afterUrl={selectedMedia.after_image_url}
                  alt={selectedMedia.title || undefined}
                  aspectRatio="square"
                  className="rounded-xl overflow-hidden border-2 border-black"
                />
              </div>
            ) : null}

            {/* Info */}
            <div className="p-8">
              {selectedMedia.title && (
                <h3 className="text-xl font-bold">{selectedMedia.title}</h3>
              )}
              {selectedMedia.description && (
                <p className="mt-3">{selectedMedia.description}</p>
              )}
              {selectedMedia.service_tag && (
                <span className="inline-block mt-4 px-4 py-1 border-2 border-[#FF2D8E] text-[#FF2D8E] text-sm font-bold rounded-full">
                  {selectedMedia.service_tag.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              )}
              <button
                onClick={() => setSelectedMedia(null)}
                className="mt-8 w-full btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
