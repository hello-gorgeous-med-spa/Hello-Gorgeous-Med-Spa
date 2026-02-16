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
      {/* Filter Tags */}
      {tags.length > 2 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-pink-500 text-white'
                  : 'bg-white border border-pink-200 text-gray-700 hover:border-pink-400'
              }`}
            >
              {tag === 'all' ? 'All' : tag.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedMedia(item)}
            className="cursor-pointer group"
          >
            {type === 'video' ? (
              <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                {item.video_thumbnail_url ? (
                  <Image
                    src={item.video_thumbnail_url}
                    alt={item.title || 'Video'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
                    <span className="text-5xl">🎬</span>
                  </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-pink-500 text-xl ml-1">▶</span>
                  </div>
                </div>
                {item.is_featured && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-pink-500 text-white text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>
            ) : (
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
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
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white" />
                {/* Labels */}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded">
                  Before
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-pink-500 text-white text-xs rounded">
                  After
                </span>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium transition-opacity">
                    Click to view
                  </span>
                </div>
              </div>
            )}
            {item.title && (
              <h3 className="mt-3 font-medium text-gray-900">{item.title}</h3>
            )}
            {item.service_tag && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded">
                {item.service_tag.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No {type === 'video' ? 'videos' : 'results'} available for this filter
        </p>
      )}

      {/* Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {type === 'video' && selectedMedia.video_url ? (
              <div className="aspect-video">
                <video
                  src={selectedMedia.video_url}
                  className="w-full h-full"
                  controls
                  autoPlay
                  playsInline
                />
              </div>
            ) : selectedMedia.before_image_url && selectedMedia.after_image_url ? (
              <div className="p-4">
                <BeforeAfterSlider
                  beforeUrl={selectedMedia.before_image_url}
                  afterUrl={selectedMedia.after_image_url}
                  alt={selectedMedia.title || undefined}
                  aspectRatio="square"
                  className="rounded-xl overflow-hidden"
                />
              </div>
            ) : null}

            {/* Info */}
            <div className="p-6">
              {selectedMedia.title && (
                <h3 className="text-xl font-bold text-gray-900">{selectedMedia.title}</h3>
              )}
              {selectedMedia.description && (
                <p className="mt-2 text-gray-600">{selectedMedia.description}</p>
              )}
              {selectedMedia.service_tag && (
                <span className="inline-block mt-3 px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">
                  {selectedMedia.service_tag.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              )}
              <button
                onClick={() => setSelectedMedia(null)}
                className="mt-6 w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
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
