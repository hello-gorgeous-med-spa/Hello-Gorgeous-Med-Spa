import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Meet Our Providers | Hello Gorgeous Med Spa',
  description: 'Meet the licensed medical professionals at Hello Gorgeous Med Spa in Oswego, IL. Our expert providers specialize in Botox, fillers, weight loss, and hormone therapy.',
  path: '/providers',
});

interface Provider {
  id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  slug: string;
  credentials: string | null;
  short_bio: string | null;
  headshot_url: string | null;
  intro_video_url: string | null;
  booking_url: string | null;
  tagline: string | null;
}

async function getProviders(): Promise<Provider[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('providers')
    .select('id, display_name, first_name, last_name, slug, credentials, short_bio, headshot_url, intro_video_url, booking_url, tagline')
    .eq('is_active', true);

  if (error) {
    console.error('Failed to fetch providers:', error);
    return [];
  }

  // Sort: Danielle first
  return (data || []).sort((a, b) => {
    if (a.slug === 'danielle') return -1;
    if (b.slug === 'danielle') return 1;
    return 0;
  });
}

export default async function ProvidersPage() {
  const providers = await getProviders();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'Hello Gorgeous Med Spa',
    employee: providers.map((p) => ({
      '@type': 'Person',
      name: p.display_name || `${p.first_name} ${p.last_name}`,
      jobTitle: p.credentials,
      description: p.short_bio,
      image: p.headshot_url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section - Black background for contrast */}
      <section className="relative bg-black py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Meet The Experts Behind
            <span className="block text-[#FF2D8E] mt-2">
              Hello Gorgeous
            </span>
          </h1>
          <p className="mt-4 text-lg text-white max-w-2xl mx-auto">
            Licensed medical professionals. Real results. Personalized care.
          </p>
        </div>
      </section>

      {/* Provider Cards - Clean layout */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providers.map((provider) => {
              const name = provider.display_name || `${provider.first_name} ${provider.last_name}`;
              const firstName = provider.first_name;
              
              return (
                <div
                  key={provider.id}
                  className="bg-white rounded-2xl border border-black overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {/* Headshot - Smaller height */}
                  <div className="relative h-64 md:h-72 bg-gradient-to-br from-pink-100 to-rose-50">
                    {provider.headshot_url ? (
                      <Image
                        src={provider.headshot_url}
                        alt={name}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-7xl">👩‍⚕️</span>
                      </div>
                    )}
                    {/* Play button for intro video */}
                    {provider.intro_video_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                          <span className="text-[#FF2D8E] text-xl ml-1">▶</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info - Compact padding */}
                  <div className="p-5 md:p-6">
                    <h2 className="text-xl font-bold text-black">{name}</h2>
                    {provider.credentials && (
                      <p className="text-[#FF2D8E] font-medium text-sm mt-0.5">{provider.credentials}</p>
                    )}
                    {provider.tagline && (
                      <p className="text-black text-sm mt-1 italic">{provider.tagline}</p>
                    )}
                    {provider.short_bio && (
                      <p className="text-black text-sm mt-3 line-clamp-2">{provider.short_bio}</p>
                    )}

                    {/* CTAs - Compact */}
                    <div className="mt-5 flex gap-3">
                      <Link
                        href={`/providers/${provider.slug}`}
                        className="flex-1 px-4 py-2.5 bg-white text-black font-medium rounded-lg text-center text-sm hover:bg-white transition-colors"
                      >
                        View Results
                      </Link>
                      <Link
                        href={provider.booking_url || `/book?provider=${provider.slug}`}
                        className="flex-1 px-4 py-2.5 bg-[#FF2D8E] text-white font-medium rounded-lg text-center text-sm hover:bg-[#C4006B] transition-colors"
                      >
                        Book with {firstName}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {providers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-black">Provider information coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us - Darker background for contrast */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Why Trust Hello Gorgeous?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-black rounded-xl p-5 border border-black">
              <span className="text-3xl mb-3 block">🏆</span>
              <h3 className="text-base font-semibold text-white">Licensed & Certified</h3>
              <p className="text-white/80 text-sm mt-1">All treatments by licensed medical professionals</p>
            </div>
            <div className="bg-black rounded-xl p-5 border border-black">
              <span className="text-3xl mb-3 block">⭐</span>
              <h3 className="text-base font-semibold text-white">5-Star Rated</h3>
              <p className="text-white/80 text-sm mt-1">Hundreds of verified reviews from real clients</p>
            </div>
            <div className="bg-black rounded-xl p-5 border border-black">
              <span className="text-3xl mb-3 block">💝</span>
              <h3 className="text-base font-semibold text-white">Personalized Care</h3>
              <p className="text-white/80 text-sm mt-1">Customized plans for your unique goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Hot pink */}
      <section className="py-12 px-4 md:px-6 bg-[#FF2D8E]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to Get Started?</h2>
          <p className="text-white/90 mt-2 text-base">
            Book a free consultation to discuss your aesthetic goals
          </p>
          <Link
            href="/book"
            className="mt-6 inline-block px-8 py-3 bg-white text-[#FF2D8E] font-bold rounded-lg hover:bg-white transition-colors shadow-lg"
          >
            Book Free Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
