// ============================================================
// PUBLIC: INDIVIDUAL PROVIDER PROFILE PAGE
// /providers/danielle or /providers/ryan
// Video gallery, before/after results, booking CTA
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface ProviderMedia {
  id: string;
  type: 'video' | 'before_after';
  video_url?: string;
  thumbnail_url?: string;
  before_image_url?: string;
  after_image_url?: string;
  title?: string;
  description?: string;
  service_tag?: string;
  featured: boolean;
  alt_text?: string;
}

interface Provider {
  id: string;
  slug: string;
  name: string;
  credentials: string;
  bio: string;
  philosophy?: string;
  headshot_url?: string;
}

const SERVICE_TAGS = [
  { id: 'all', label: 'All Results' },
  { id: 'botox', label: 'Botox' },
  { id: 'lip_filler', label: 'Lip Filler' },
  { id: 'dermal_filler', label: 'Dermal Filler' },
  { id: 'prp', label: 'PRP' },
  { id: 'hormone_therapy', label: 'Hormone Therapy' },
  { id: 'weight_loss', label: 'Weight Loss' },
  { id: 'microneedling', label: 'Microneedling' },
  { id: 'laser', label: 'Laser' },
];

// Default providers (until DB is connected)
const DEFAULT_PROVIDERS: Record<string, Provider> = {
  danielle: {
    id: '1', slug: 'danielle', name: 'Danielle', credentials: 'RN, BSN, Aesthetic Injector',
    bio: 'With over a decade of experience in aesthetic medicine, Danielle founded Hello Gorgeous Med Spa with a vision to deliver natural, personalized results. Her expertise spans advanced injection techniques, facial balancing, and helping clients feel confident in their own skin.',
    philosophy: 'Beauty should enhance who you already are. My approach is always natural-first—subtle changes that make a big impact without looking "done."',
  },
  ryan: {
    id: '2', slug: 'ryan', name: 'Ryan', credentials: 'PA-C, Medical Provider',
    bio: 'Ryan brings clinical precision and a patient-first approach to Hello Gorgeous. Specializing in hormone therapy and weight management, he works closely with each patient to develop personalized treatment plans.',
    philosophy: 'True transformation comes from within. I believe in treating the whole person—optimizing hormones, metabolism, and overall wellness for lasting results.',
  },
};

export default function ProviderProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [provider, setProvider] = useState<Provider | null>(DEFAULT_PROVIDERS[slug] || null);
  const [media, setMedia] = useState<ProviderMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'videos' | 'results'>('results');
  const [selectedMedia, setSelectedMedia] = useState<ProviderMedia | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/provider-media?slug=${slug}`);
        const data = await res.json();
        setMedia(data.media || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const videos = media.filter(m => m.type === 'video');
  const beforeAfter = media.filter(m => m.type === 'before_after');
  const filteredResults = activeFilter === 'all' 
    ? beforeAfter 
    : beforeAfter.filter(m => m.service_tag === activeFilter);

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Provider not found</h1>
          <Link href="/providers" className="text-pink-500 hover:underline">View all providers</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero / About Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <Link href="/providers" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8">
            <span className="mr-2">←</span> All Providers
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-pink-100 to-gray-100 flex items-center justify-center overflow-hidden">
                <div className="text-8xl font-bold text-pink-300">
                  {provider.name.charAt(0)}
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <span className="inline-block px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium mb-4">
                {provider.credentials}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {provider.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {provider.bio}
              </p>
              {provider.philosophy && (
                <blockquote className="border-l-4 border-pink-500 pl-6 py-2 mb-8">
                  <p className="text-gray-700 italic">&ldquo;{provider.philosophy}&rdquo;</p>
                </blockquote>
              )}
              <Link
                href={`/book?provider=${slug}`}
                className="inline-block px-8 py-4 bg-pink-500 text-white text-lg font-medium rounded-xl hover:bg-pink-600 transition-colors"
              >
                Book with {provider.name}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: 'results', label: 'Results Gallery', count: beforeAfter.length },
              { id: 'videos', label: 'Videos', count: videos.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 text-lg font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} {tab.count > 0 && <span className="text-gray-400">({tab.count})</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      {activeTab === 'videos' && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {videos.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">🎬</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Videos Coming Soon</h3>
                <p className="text-gray-500">Check back for educational videos and treatment demonstrations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedMedia(video)}
                    className="group relative aspect-video rounded-2xl overflow-hidden bg-gray-100"
                  >
                    {video.thumbnail_url ? (
                      <Image src={video.thumbnail_url} alt={video.alt_text || ''} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <span className="text-white/50 text-6xl">▶</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <span className="text-pink-500 text-2xl ml-1">▶</span>
                      </div>
                    </div>
                    {video.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white font-medium">{video.title}</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Results (Before/After) Section */}
      {activeTab === 'results' && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Service Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {SERVICE_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setActiveFilter(tag.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === tag.id
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {filteredResults.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">📸</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeFilter === 'all' ? 'Results Coming Soon' : `No ${activeFilter.replace('_', ' ')} results yet`}
                </h3>
                <p className="text-gray-500">Check back for before and after photos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMedia(item)}
                    className="group relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 hover:shadow-xl transition-shadow"
                  >
                    <div className="aspect-square relative">
                      {/* Before/After Slider Preview */}
                      <div className="absolute inset-0 flex">
                        <div className="w-1/2 relative overflow-hidden">
                          {item.before_image_url && (
                            <Image src={item.before_image_url} alt="Before" fill className="object-cover" />
                          )}
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">Before</div>
                        </div>
                        <div className="w-1/2 relative overflow-hidden">
                          {item.after_image_url && (
                            <Image src={item.after_image_url} alt="After" fill className="object-cover" />
                          )}
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-pink-500 text-white text-xs rounded">After</div>
                        </div>
                      </div>
                    </div>
                    {(item.title || item.service_tag) && (
                      <div className="p-4 bg-white">
                        <p className="font-medium text-gray-900">{item.title || item.service_tag?.replace('_', ' ')}</p>
                        {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Results vary by individual. All treatments performed by licensed medical professionals. Client consent on file.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Booking CTA */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to See Your Transformation?
          </h2>
          <p className="text-gray-400 mb-8">
            Book a consultation with {provider.name} and start your journey.
          </p>
          <Link
            href={`/book?provider=${slug}`}
            className="inline-block px-8 py-4 bg-pink-500 text-white text-lg font-medium rounded-xl hover:bg-pink-600 transition-colors"
          >
            Book with {provider.name}
          </Link>
        </div>
      </section>

      {/* Video/Image Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMedia(null)}>
          <button className="absolute top-4 right-4 text-white text-3xl hover:text-pink-500">&times;</button>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            {selectedMedia.type === 'video' ? (
              <video
                src={selectedMedia.video_url || ''}
                controls
                autoPlay
                className="w-full rounded-xl"
              />
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* Before/After Slider */}
                <div className="relative aspect-[4/3]">
                  <div className="absolute inset-0">
                    {selectedMedia.after_image_url && (
                      <Image src={selectedMedia.after_image_url} alt="After" fill className="object-cover" />
                    )}
                  </div>
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    {selectedMedia.before_image_url && (
                      <Image src={selectedMedia.before_image_url} alt="Before" fill className="object-cover" style={{ maxWidth: 'none', width: `${100 / (sliderPosition / 100)}%` }} />
                    )}
                  </div>
                  {/* Slider Handle */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                    style={{ left: `${sliderPosition}%` }}
                    onMouseDown={(e) => {
                      const handleMove = (ev: MouseEvent) => {
                        const rect = (e.target as HTMLElement).parentElement?.getBoundingClientRect();
                        if (rect) {
                          const pos = ((ev.clientX - rect.left) / rect.width) * 100;
                          setSliderPosition(Math.max(0, Math.min(100, pos)));
                        }
                      };
                      const handleUp = () => {
                        window.removeEventListener('mousemove', handleMove);
                        window.removeEventListener('mouseup', handleUp);
                      };
                      window.addEventListener('mousemove', handleMove);
                      window.addEventListener('mouseup', handleUp);
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <span className="text-gray-400">⟷</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded">Before</div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-pink-500 text-white text-sm rounded">After</div>
                </div>
                {(selectedMedia.title || selectedMedia.description) && (
                  <div className="p-6">
                    {selectedMedia.title && <h3 className="text-xl font-bold text-gray-900">{selectedMedia.title}</h3>}
                    {selectedMedia.description && <p className="text-gray-600 mt-2">{selectedMedia.description}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
