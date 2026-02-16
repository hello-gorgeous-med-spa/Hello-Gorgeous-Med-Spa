import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { pageMetadata } from '@/lib/seo';
import { ProviderMediaSection } from './ProviderMediaSection';

interface Provider {
  id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  slug: string;
  credentials: string | null;
  short_bio: string | null;
  bio: string | null;
  philosophy: string | null;
  headshot_url: string | null;
  intro_video_url: string | null;
  booking_url: string | null;
  tagline: string | null;
}

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

async function getProvider(slug: string): Promise<{ provider: Provider | null; media: MediaItem[] }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: provider, error } = await supabase
    .from('providers')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !provider) {
    return { provider: null, media: [] };
  }

  const { data: mediaRaw } = await supabase
    .from('provider_media')
    .select('*')
    .eq('provider_id', provider.id)
    .eq('status', 'published')
    .or('media_type.eq.video,consent_confirmed.eq.true')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true });

  // Map to expected format
  const media = (mediaRaw || []).map((m: any) => ({
    id: m.id,
    type: m.media_type,
    video_url: m.video_url,
    video_thumbnail_url: m.thumbnail_url,
    before_image_url: m.before_image_url,
    after_image_url: m.after_image_url,
    title: m.title,
    description: m.description,
    service_tag: m.service_tag,
    is_featured: m.featured,
  }));

  return { provider, media: media || [] };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { provider } = await getProvider(slug);

  if (!provider) {
    return pageMetadata({ title: 'Provider Not Found', path: '/providers' });
  }

  const name = provider.display_name || `${provider.first_name} ${provider.last_name}`;

  return pageMetadata({
    title: `${name} - ${provider.credentials || 'Provider'} | Hello Gorgeous Med Spa`,
    description: provider.short_bio || `Meet ${name}, a licensed medical professional at Hello Gorgeous Med Spa.`,
    path: `/providers/${slug}`,
  });
}

export default async function ProviderProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { provider, media } = await getProvider(slug);

  if (!provider) {
    notFound();
  }

  const name = provider.display_name || `${provider.first_name} ${provider.last_name}`;
  const firstName = provider.first_name;
  const fullBio = provider.bio || provider.short_bio;

  const videos = media.filter((m) => m.type === 'video');
  const beforeAfters = media.filter((m) => m.type === 'before_after');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    jobTitle: provider.credentials,
    description: fullBio,
    image: provider.headshot_url,
    worksFor: {
      '@type': 'MedicalBusiness',
      name: 'Hello Gorgeous Med Spa',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '74 W. Washington Street',
        addressLocality: 'Oswego',
        addressRegion: 'IL',
        postalCode: '60543',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero / About Section */}
      <section className="relative bg-gradient-to-br from-white to-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/providers" className="text-[#FF2D8E] hover:underline text-sm mb-8 block">
            ← All Providers
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-2xl">
              {provider.headshot_url ? (
                <Image
                  src={provider.headshot_url}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                  <span className="text-9xl">👩‍⚕️</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-black">{name}</h1>
              {provider.credentials && (
                <p className="text-xl text-[#FF2D8E] font-medium mt-2">{provider.credentials}</p>
              )}
              {provider.tagline && (
                <p className="text-black italic mt-1">{provider.tagline}</p>
              )}

              {fullBio && (
                <div className="mt-6 prose prose-lg text-black">
                  <p>{fullBio}</p>
                </div>
              )}

              {provider.philosophy && (
                <div className="mt-8 p-6 bg-white/80 rounded-2xl border border-[#FF2D8E]/20">
                  <h3 className="font-semibold text-black mb-2">My Philosophy</h3>
                  <p className="text-black italic">&ldquo;{provider.philosophy}&rdquo;</p>
                </div>
              )}

              <div className="mt-8">
                <Link
                  href={provider.booking_url || `/book?provider=${provider.slug}`}
                  className="inline-block px-10 py-4 bg-gradient-to-r from-[#FF2D8E] to-[#FF2D8E] text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-colors shadow-lg"
                >
                  Book with {firstName}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      {videos.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-8">Videos</h2>
            <ProviderMediaSection media={videos} type="video" />
          </div>
        </section>
      )}

      {/* Results / Before & After Section */}
      {beforeAfters.length > 0 && (
        <section className="py-16 px-6 bg-gradient-to-br from-white to-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-4">Results</h2>
            <p className="text-black mb-8">See real results from real clients</p>
            <ProviderMediaSection media={beforeAfters} type="before_after" />

            {/* Disclaimer */}
            <div className="mt-12 p-6 bg-white/80 rounded-xl border border-[#FF2D8E]/20 text-sm text-black">
              <p>
                <strong>Disclaimer:</strong> Results vary by individual. All treatments performed by licensed
                medical professionals. Client consent on file.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#FF2D8E] to-[#FF2D8E]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Book with {firstName}?
          </h2>
          <p className="text-white/90 mt-4">
            Schedule your personalized consultation today
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              href={provider.booking_url || `/book?provider=${provider.slug}`}
              className="px-10 py-4 bg-white text-[#FF2D8E] font-bold rounded-xl hover:bg-[#FF2D8E]/10 transition-colors shadow-xl"
            >
              Book with {firstName}
            </Link>
            <Link
              href="/providers"
              className="px-10 py-4 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
            >
              View All Providers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
