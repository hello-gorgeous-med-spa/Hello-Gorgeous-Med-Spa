'use client';

// ============================================================
// PROVIDER PROFILE PAGE
// Individual provider with videos, before/after photos
// ============================================================

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Service tags for filtering
const SERVICE_TAGS = [
  { id: 'all', name: 'All Results' },
  { id: 'botox', name: 'Botox' },
  { id: 'lip-filler', name: 'Lip Filler' },
  { id: 'dermal-fillers', name: 'Dermal Fillers' },
  { id: 'prp', name: 'PRP/PRF' },
  { id: 'hormone-therapy', name: 'Hormone Therapy' },
  { id: 'weight-loss', name: 'Weight Loss' },
  { id: 'microneedling', name: 'Microneedling' },
  { id: 'laser', name: 'Laser' },
];

// Fallback provider data
const FALLBACK_PROVIDERS: Record<string, Provider> = {
  'danielle': {
    id: '1',
    first_name: 'Danielle',
    last_name: '',
    slug: 'danielle',
    title: 'Owner & Nurse Practitioner',
    credentials: 'MSN, APRN, FNP-BC',
    bio: 'Danielle is the founder and lead aesthetic injector at Hello Gorgeous Med Spa. With years of experience in medical aesthetics, she specializes in creating natural, beautiful results that enhance each client\'s unique features. Her artistic eye and advanced training in facial anatomy allow her to create stunning, yet subtle transformations.',
    philosophy: 'I believe in enhancing your natural beauty, not changing who you are. Every treatment is customized to your unique features and goals. My approach is conservative yet effective - you\'ll leave looking refreshed and confident, never overdone.',
    headshot_url: '/images/providers/danielle.jpg',
    booking_url: 'https://hellogorgeousmedspa.janeapp.com/staff_members/1',
    is_active: true,
    display_order: 1,
  },
  'ryan': {
    id: '2',
    first_name: 'Ryan',
    last_name: 'Kent',
    slug: 'ryan',
    title: 'Medical Director & Nurse Practitioner',
    credentials: 'MSN, APRN, FNP-BC',
    bio: 'Ryan brings extensive medical experience to Hello Gorgeous Med Spa, specializing in weight loss management and hormone optimization. His evidence-based approach ensures safe, effective treatments for every patient. With a background in family practice, he understands the whole-body approach to wellness and aesthetics.',
    philosophy: 'Healthcare should be personalized and accessible. I work with each patient to develop a treatment plan that fits their lifestyle and goals. Whether you\'re looking to optimize your hormones or achieve your weight loss goals, we\'ll create a plan that works for you.',
    headshot_url: '/images/providers/ryan.jpg',
    booking_url: 'https://hellogorgeousmedspa.janeapp.com/staff_members/2',
    is_active: true,
    display_order: 2,
  },
};

interface Provider {
  id: string;
  first_name: string;
  last_name: string | null;
  slug: string | null;
  title: string | null;
  credentials: string | null;
  bio: string | null;
  philosophy: string | null;
  headshot_url: string | null;
  booking_url: string | null;
  is_active: boolean;
  display_order: number;
}

interface ProviderMedia {
  id: string;
  provider_id: string;
  type: 'video' | 'before_after';
  video_url: string | null;
  thumbnail_url: string | null;
  video_orientation: 'horizontal' | 'vertical' | null;
  before_image_url: string | null;
  after_image_url: string | null;
  title: string | null;
  description: string | null;
  service_tag: string | null;
  is_featured: boolean;
}

// Video Player Modal Component
function VideoModal({ 
  video, 
  onClose 
}: { 
  video: ProviderMedia | null; 
  onClose: () => void;
}) {
  if (!video) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-4xl hover:text-[#FF2D8E] transition-colors"
          aria-label="Close video"
        >
          ×
        </button>
        <video
          src={video.video_url || ''}
          controls
          autoPlay
          className="w-full rounded-xl"
        >
          Your browser does not support the video tag.
        </video>
        {video.title && (
          <h3 className="text-white text-xl font-semibold mt-4">{video.title}</h3>
        )}
        {video.description && (
          <p className="text-white/70 mt-2">{video.description}</p>
        )}
      </div>
    </div>
  );
}

// Before/After Image Comparison Component
function BeforeAfterSlider({ media }: { media: ProviderMedia }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-ew-resize">
      {/* After Image (Background) */}
      <div className="absolute inset-0">
        {media.after_image_url && (
          <Image
            src={media.after_image_url}
            alt="After treatment"
            fill
            className="object-cover"
          />
        )}
      </div>
      
      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        {media.before_image_url && (
          <Image
            src={media.before_image_url}
            alt="Before treatment"
            fill
            className="object-cover"
            style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
          />
        )}
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <span className="text-black text-sm">↔</span>
        </div>
      </div>

      {/* Slider Input */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
      />

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-[#FF2D8E] text-white text-xs px-3 py-1 rounded-full">
        After
      </div>

      {/* Service Tag */}
      {media.service_tag && (
        <div className="absolute bottom-4 left-4 bg-white/90 text-black text-xs px-3 py-1 rounded-full font-medium">
          {SERVICE_TAGS.find(t => t.id === media.service_tag)?.name || media.service_tag}
        </div>
      )}
    </div>
  );
}

export default function ProviderProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [media, setMedia] = useState<ProviderMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<ProviderMedia | null>(null);

  useEffect(() => {
    async function fetchProviderData() {
      try {
        // Try to fetch from API
        const res = await fetch(`/api/providers/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProvider(data.provider);
          setMedia(data.media || []);
        } else {
          // Use fallback data
          setProvider(FALLBACK_PROVIDERS[slug] || null);
          setMedia([]);
        }
      } catch {
        // Use fallback data
        setProvider(FALLBACK_PROVIDERS[slug] || null);
        setMedia([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProviderData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin text-4xl">💗</div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Provider Not Found</h1>
          <Link href="/providers" className="text-[#FF2D8E] hover:underline">
            ← Back to All Providers
          </Link>
        </div>
      </div>
    );
  }

  const videos = media.filter(m => m.type === 'video');
  const beforeAfters = media.filter(m => m.type === 'before_after');
  const filteredBeforeAfters = activeFilter === 'all' 
    ? beforeAfters 
    : beforeAfters.filter(m => m.service_tag === activeFilter);

  return (
    <main className="min-h-screen bg-white">
      {/* Video Modal */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />

      {/* Back Link */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/providers" className="text-white/70 hover:text-white flex items-center gap-2">
            <span>←</span> All Providers
          </Link>
        </div>
      </div>

      {/* Hero / About Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-800">
              {provider.headshot_url ? (
                <Image
                  src={provider.headshot_url}
                  alt={`${provider.first_name} ${provider.last_name || ''}`}
                  fill
                  className="object-cover object-top"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl">👩‍⚕️</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {provider.credentials && (
                <div className="inline-block bg-[#FF2D8E] text-white text-sm px-4 py-1 rounded-full mb-4">
                  {provider.credentials}
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {provider.first_name} {provider.last_name || ''}
              </h1>
              {provider.title && (
                <p className="text-xl text-white/70 mb-6">{provider.title}</p>
              )}
              
              {provider.bio && (
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  {provider.bio}
                </p>
              )}

              {provider.philosophy && (
                <blockquote className="border-l-4 border-[#FF2D8E] pl-6 italic text-white/70 mb-8">
                  "{provider.philosophy}"
                </blockquote>
              )}

              <a
                href={provider.booking_url || 'https://hellogorgeousmedspa.janeapp.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FF2D8E] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#e0267d] transition-colors"
              >
                Book with {provider.first_name} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      {videos.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-8">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-black"
                >
                  {video.thumbnail_url ? (
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title || 'Video thumbnail'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                      <span className="text-4xl">🎬</span>
                    </div>
                  )}
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                    <div className="w-16 h-16 bg-[#FF2D8E] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-2xl ml-1">▶</span>
                    </div>
                  </div>
                  {/* Featured Badge */}
                  {video.is_featured && (
                    <div className="absolute top-4 left-4 bg-[#FF2D8E] text-white text-xs px-3 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                  {/* Title */}
                  {video.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-white font-semibold truncate">{video.title}</h3>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Before/After Results Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-black mb-8">Results Gallery</h2>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {SERVICE_TAGS.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveFilter(tag.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === tag.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>

          {/* Before/After Grid */}
          {filteredBeforeAfters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBeforeAfters.map((item) => (
                <BeforeAfterSlider key={item.id} media={item} />
              ))}
            </div>
          ) : beforeAfters.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <span className="text-5xl mb-4 block">📸</span>
              <h3 className="text-xl font-semibold text-black mb-2">Results Coming Soon</h3>
              <p className="text-gray-600">
                We're adding before/after photos. Check back soon!
              </p>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-gray-600">
                No results found for this filter. Try selecting "All Results".
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-gray-100 rounded-xl text-sm text-gray-600">
            <p>
              <strong>Disclaimer:</strong> Results vary by individual. All treatments 
              performed by licensed medical professionals. Client consent on file.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Transformation?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Book a consultation with {provider.first_name} to discuss your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={provider.booking_url || 'https://hellogorgeousmedspa.janeapp.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF2D8E] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#e0267d] transition-colors"
            >
              Book with {provider.first_name}
            </a>
            <a
              href="tel:630-636-6193"
              className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Call (630) 636-6193
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
