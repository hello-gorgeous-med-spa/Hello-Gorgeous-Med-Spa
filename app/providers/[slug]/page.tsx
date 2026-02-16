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

      {/* A. About Section - White background */}
      <section className="section-white section-padding">
        <div className="container">
          <Link href="/providers" className="text-[#FF2D8E] hover:text-black font-bold text-sm mb-8 inline-block">
            ← All Providers
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden border-2 border-black">
              {provider.headshot_url ? (
                <Image
                  src={provider.headshot_url}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <span className="text-9xl">👩‍⚕️</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold">{name}</h1>
              {provider.credentials && (
                <p className="text-xl text-[#FF2D8E] font-bold mt-3">{provider.credentials}</p>
              )}
              {provider.tagline && (
                <p className="italic mt-2">{provider.tagline}</p>
              )}

              {fullBio && (
                <div className="mt-8">
                  <p className="text-lg leading-relaxed">{fullBio}</p>
                </div>
              )}

              {provider.philosophy && (
                <div className="mt-8 p-6 rounded-2xl border-2 border-[#FF2D8E]">
                  <h3 className="font-bold mb-2">My Philosophy</h3>
                  <p className="italic">&ldquo;{provider.philosophy}&rdquo;</p>
                </div>
              )}

              <div className="mt-10">
                <Link
                  href={provider.booking_url || `/book?provider=${provider.slug}`}
                  className="btn-primary"
                >
                  Book with {firstName}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. Videos Section - Black background */}
      {videos.length > 0 && (
        <section className="section-black section-padding">
          <div className="container">
            <h2 className="text-3xl font-serif font-bold mb-8">
              <span className="text-[#FF2D8E]">Videos</span> from {firstName}
            </h2>
            <ProviderMediaSection media={videos} type="video" />
          </div>
        </section>
      )}

      {/* C. Results / Before & After Section - White background */}
      {beforeAfters.length > 0 && (
        <section className="section-white section-padding">
          <div className="container">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Real <span className="text-[#FF2D8E]">Results</span>
            </h2>
            <p className="mb-12 text-lg">See real results from real clients</p>
            <ProviderMediaSection media={beforeAfters} type="before_after" />

            {/* Disclaimer */}
            <div className="mt-16 p-6 rounded-2xl border-2 border-black text-sm">
              <p>
                <strong>Disclaimer:</strong> Results vary by individual. All treatments performed by licensed
                medical professionals. Client consent on file.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* D. CTA Section - Hot Pink */}
      <section className="section-pink section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold">
              Ready to Book with {firstName}?
            </h2>
            <p className="mt-4 text-lg">
              Schedule your personalized consultation today
            </p>
            <div className="mt-10 flex justify-center gap-4 flex-wrap">
              <Link
                href={provider.booking_url || `/book?provider=${provider.slug}`}
                className="btn-white"
              >
                Book with {firstName}
              </Link>
              <Link
                href="/providers"
                className="px-8 py-4 rounded-lg font-bold border-2 border-white hover:bg-white hover:text-[#FF2D8E] transition"
              >
                View All Providers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
