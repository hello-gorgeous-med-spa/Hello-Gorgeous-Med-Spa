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

      {/* Hero Section - Black background */}
      <section className="section-black section-padding-lg">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
              Meet The Experts Behind
              <span className="block text-[#FF2D8E] mt-2">Hello Gorgeous</span>
            </h1>
            <p className="mt-6 text-lg max-w-2xl mx-auto">
              Licensed medical professionals. Real results. Personalized care.
            </p>
          </div>
        </div>
      </section>

      {/* Provider Cards - White background */}
      <section className="section-white section-padding">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {providers.map((provider) => {
              const name = provider.display_name || `${provider.first_name} ${provider.last_name}`;
              const firstName = provider.first_name;
              
              return (
                <div key={provider.id} className="hg-card p-0 overflow-hidden">
                  {/* Headshot */}
                  <div className="relative h-72 md:h-80 bg-white">
                    {provider.headshot_url ? (
                      <Image
                        src={provider.headshot_url}
                        alt={name}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-8xl">👩‍⚕️</span>
                      </div>
                    )}
                    {provider.intro_video_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform border-2 border-[#FF2D8E]">
                          <span className="text-[#FF2D8E] text-2xl ml-1">▶</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-8">
                    <h2 className="text-xl font-bold">{name}</h2>
                    {provider.credentials && (
                      <p className="text-[#FF2D8E] font-bold text-sm mt-1">{provider.credentials}</p>
                    )}
                    {provider.tagline && (
                      <p className="text-sm mt-2 italic">{provider.tagline}</p>
                    )}
                    {provider.short_bio && (
                      <p className="mt-4 text-sm leading-relaxed line-clamp-3">{provider.short_bio}</p>
                    )}

                    {/* CTAs */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/providers/${provider.slug}`}
                        className="btn-outline text-sm flex-1 text-center"
                      >
                        View Results
                      </Link>
                      <Link
                        href={provider.booking_url || `/book?provider=${provider.slug}`}
                        className="btn-primary text-sm flex-1 text-center"
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
              <p>Provider information coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us - Black background */}
      <section className="section-black section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-12">
              Why Trust <span className="text-[#FF2D8E]">Hello Gorgeous?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-white border-2 border-white">
                <span className="text-4xl mb-4 block">🏆</span>
                <h3 className="text-lg font-bold text-black">Licensed & Certified</h3>
                <p className="text-black text-sm mt-2">All treatments by licensed medical professionals</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border-2 border-white">
                <span className="text-4xl mb-4 block">⭐</span>
                <h3 className="text-lg font-bold text-black">5-Star Rated</h3>
                <p className="text-black text-sm mt-2">Hundreds of verified reviews from real clients</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border-2 border-white">
                <span className="text-4xl mb-4 block">💝</span>
                <h3 className="text-lg font-bold text-black">Personalized Care</h3>
                <p className="text-black text-sm mt-2">Customized plans for your unique goals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Hot pink */}
      <section className="section-pink section-padding-sm">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold">Ready to Get Started?</h2>
            <p className="mt-4 text-lg">
              Book a free consultation to discuss your aesthetic goals
            </p>
            <Link href="/book" className="btn-white mt-8 inline-block">
              Book Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
