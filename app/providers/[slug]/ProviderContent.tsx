'use client';

// ============================================================
// PROVIDER CONTENT - Client-side interactive sections
// Video player, before/after gallery with filters
// ============================================================

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProviderMedia {
  id: string;
  type: 'video' | 'before_after' | 'intro_video';
  video_url?: string;
  video_thumbnail_url?: string;
  video_orientation?: string;
  before_image_url?: string;
  after_image_url?: string;
  title?: string;
  description?: string;
  service_tag?: string;
  caption?: string;
  featured?: boolean;
}

interface ServiceTag {
  name: string;
  display_name: string;
  category: string;
}

interface Props {
  provider: {
    id: string;
    firstName: string;
    name: string;
    credentials: string;
    bio: string;
    philosophy: string;
    certifications: string[];
    specialties: string[];
    color: string;
    bookingUrl: string;
    phone: string;
  };
}

// Default service tags for filtering
const DEFAULT_SERVICE_TAGS: ServiceTag[] = [
  { name: 'botox', display_name: 'Botox', category: 'Injectables' },
  { name: 'lip_filler', display_name: 'Lip Filler', category: 'Injectables' },
  { name: 'dermal_filler', display_name: 'Dermal Filler', category: 'Injectables' },
  { name: 'co2_laser', display_name: 'CO₂ Laser', category: 'Skin' },
  { name: 'prp', display_name: 'PRP', category: 'Regenerative' },
  { name: 'microneedling', display_name: 'Microneedling', category: 'Skin' },
];

export default function ProviderContent({ provider }: Props) {
  const [media, setMedia] = useState<ProviderMedia[]>([]);
  const [serviceTags, setServiceTags] = useState<ServiceTag[]>(DEFAULT_SERVICE_TAGS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'about' | 'videos' | 'results'>('about');
  const [selectedVideo, setSelectedVideo] = useState<ProviderMedia | null>(null);
  const [selectedBeforeAfter, setSelectedBeforeAfter] = useState<ProviderMedia | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  useEffect(() => {
    fetchMedia();
  }, [provider.id]);

  const fetchMedia = async () => {
    try {
      const res = await fetch(`/api/provider-media?providerId=${provider.id}`);
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media || []);
        if (data.serviceTags?.length) {
          setServiceTags(data.serviceTags);
        }
      }
    } catch (e) {
      console.error('Error fetching media:', e);
    }
  };

  const videos = media.filter(m => m.type === 'video' || m.type === 'intro_video');
  const introVideo = media.find(m => m.type === 'intro_video');
  const beforeAfters = media.filter(m => m.type === 'before_after');
  
  const filteredBeforeAfters = activeFilter === 'all' 
    ? beforeAfters 
    : beforeAfters.filter(m => m.service_tag === activeFilter);

  const usedTags = [...new Set(beforeAfters.map(m => m.service_tag).filter(Boolean))];

  return (
    <>
      {/* Navigation Tabs */}
      <section className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {[
              { id: 'about', label: 'About' },
              { id: 'videos', label: 'Videos', count: videos.length },
              { id: 'results', label: 'Results', count: beforeAfters.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#FF2D8E] text-[#FF2D8E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* About Section */}
      {activeTab === 'about' && (
        <section className="py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Bio */}
              <div className="lg:col-span-2 space-y-8">
                {/* Intro Video if available */}
                {introVideo && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet {provider.firstName}</h2>
                    <div 
                      className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedVideo(introVideo)}
                    >
                      {introVideo.video_thumbnail_url ? (
                        <Image
                          src={introVideo.video_thumbnail_url}
                          alt={`${provider.firstName} introduction video`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <span className="text-white text-xl font-medium">Introduction Video</span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#FF2D8E] ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About {provider.firstName}</h2>
                  <div className="prose prose-lg text-gray-700">
                    {provider.bio.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Philosophy Quote */}
                <blockquote 
                  className="border-l-4 pl-6 py-4 italic text-lg text-gray-700 bg-gray-50 rounded-r-lg"
                  style={{ borderColor: provider.color }}
                >
                  {provider.philosophy}
                </blockquote>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Certifications */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Certifications & Training</h3>
                  <ul className="space-y-3">
                    {provider.certifications.map((cert, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Book CTA */}
                <div 
                  className="rounded-xl p-6 text-white"
                  style={{ backgroundColor: provider.color }}
                >
                  <h3 className="font-semibold text-xl mb-3">Ready to Get Started?</h3>
                  <p className="text-white/90 mb-4 text-sm">
                    Book your consultation with {provider.firstName} today.
                  </p>
                  <Link
                    href={provider.bookingUrl}
                    className="block w-full text-center py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      {activeTab === 'videos' && (
        <section className="py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Videos from {provider.firstName}</h2>
            
            {videos.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <p className="text-gray-500">Videos coming soon!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                  <div 
                    key={video.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative aspect-video bg-gray-100">
                      {video.video_thumbnail_url ? (
                        <Image
                          src={video.video_thumbnail_url}
                          alt={video.title || 'Video thumbnail'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                          <span className="text-white">Video</span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#FF2D8E] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{video.title || 'Untitled Video'}</h3>
                      {video.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
                      )}
                      {video.service_tag && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-700">
                          {serviceTags.find(t => t.name === video.service_tag)?.display_name || video.service_tag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Results / Before-After Section */}
      {activeTab === 'results' && (
        <section className="py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Results by {provider.firstName}</h2>
              
              {/* Filter by service */}
              {usedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === 'all'
                        ? 'bg-[#FF2D8E] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Results
                  </button>
                  {usedTags.map(tag => {
                    const tagInfo = serviceTags.find(t => t.name === tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => setActiveFilter(tag!)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          activeFilter === tag
                            ? 'bg-[#FF2D8E] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tagInfo?.display_name || tag}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {filteredBeforeAfters.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <p className="text-gray-500">
                  {beforeAfters.length === 0 
                    ? 'Before & after photos coming soon!' 
                    : 'No results found for this filter.'}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBeforeAfters.map(item => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => setSelectedBeforeAfter(item)}
                  >
                    <div className="relative aspect-[4/3] bg-gray-100">
                      {/* Side by side preview */}
                      <div className="absolute inset-0 flex">
                        <div className="w-1/2 relative overflow-hidden">
                          {item.before_image_url && (
                            <Image
                              src={item.before_image_url}
                              alt="Before"
                              fill
                              className="object-cover"
                            />
                          )}
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                            Before
                          </div>
                        </div>
                        <div className="w-1/2 relative overflow-hidden border-l-2 border-white">
                          {item.after_image_url && (
                            <Image
                              src={item.after_image_url}
                              alt="After"
                              fill
                              className="object-cover"
                            />
                          )}
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-[#FF2D8E] text-white text-xs rounded">
                            After
                          </div>
                        </div>
                      </div>
                      {/* View overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                        <span className="opacity-0 group-hover:opacity-100 bg-white px-4 py-2 rounded-lg font-medium text-gray-900 transition-opacity">
                          View Full Comparison
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title || 'Before & After'}</h3>
                      {item.caption && (
                        <p className="text-sm text-gray-500 line-clamp-2">{item.caption}</p>
                      )}
                      {item.service_tag && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-700">
                          {serviceTags.find(t => t.name === item.service_tag)?.display_name || item.service_tag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 text-center">
                <strong>Disclaimer:</strong> Results vary by individual. All treatments performed by licensed medical professionals. 
                Client consent on file for all photos shown.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section 
        className="py-16 lg:py-20"
        style={{ backgroundColor: `${provider.color}10` }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Schedule a consultation with {provider.firstName} to discuss your aesthetic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={provider.bookingUrl}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white"
              style={{ backgroundColor: provider.color }}
            >
              Book with {provider.firstName}
            </Link>
            <a
              href={`tel:${provider.phone}`}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
            >
              Call {provider.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedVideo(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div 
            className="bg-black rounded-xl overflow-hidden max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {selectedVideo.video_url && (
              <video 
                src={selectedVideo.video_url}
                controls
                autoPlay
                className="w-full aspect-video"
              />
            )}
            {selectedVideo.title && (
              <div className="p-4 bg-gray-900">
                <h3 className="text-white font-semibold">{selectedVideo.title}</h3>
                {selectedVideo.description && (
                  <p className="text-gray-400 text-sm mt-1">{selectedVideo.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Before/After Modal with Slider */}
      {selectedBeforeAfter && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBeforeAfter(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={() => setSelectedBeforeAfter(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div 
            className="bg-white rounded-xl overflow-hidden max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Slider comparison */}
            <div className="relative aspect-[4/3] overflow-hidden select-none">
              {/* After image (full) */}
              {selectedBeforeAfter.after_image_url && (
                <Image
                  src={selectedBeforeAfter.after_image_url}
                  alt="After"
                  fill
                  className="object-cover pointer-events-none"
                />
              )}
              
              {/* Before image (clipped) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                {selectedBeforeAfter.before_image_url && (
                  <Image
                    src={selectedBeforeAfter.before_image_url}
                    alt="Before"
                    fill
                    className="object-cover pointer-events-none"
                    style={{ 
                      maxWidth: 'none',
                      width: `${10000 / sliderPosition}%`,
                    }}
                  />
                )}
              </div>

              {/* Slider handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                onMouseDown={(e) => {
                  const container = e.currentTarget.parentElement;
                  if (!container) return;
                  
                  const handleMove = (e: MouseEvent) => {
                    const rect = container.getBoundingClientRect();
                    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    setSliderPosition(x * 100);
                  };
                  
                  const handleUp = () => {
                    document.removeEventListener('mousemove', handleMove);
                    document.removeEventListener('mouseup', handleUp);
                  };
                  
                  document.addEventListener('mousemove', handleMove);
                  document.addEventListener('mouseup', handleUp);
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/70 text-white text-sm font-medium rounded">
                Before
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#FF2D8E] text-white text-sm font-medium rounded">
                After
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedBeforeAfter.title || 'Before & After Results'}
              </h3>
              {selectedBeforeAfter.caption && (
                <p className="text-gray-600 mb-4">{selectedBeforeAfter.caption}</p>
              )}
              {selectedBeforeAfter.service_tag && (
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-pink-100 text-pink-700">
                  {serviceTags.find(t => t.name === selectedBeforeAfter.service_tag)?.display_name || selectedBeforeAfter.service_tag}
                </span>
              )}
              
              <p className="mt-4 text-xs text-gray-400">
                Drag the slider to compare before and after results.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
