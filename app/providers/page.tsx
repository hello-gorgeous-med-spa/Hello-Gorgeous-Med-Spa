// ============================================================
// PROVIDERS PAGE
// Meet The Experts Behind Hello Gorgeous
// ============================================================

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { siteJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Meet Our Providers | Hello Gorgeous Med Spa Oswego IL',
  description: 'Meet the licensed medical professionals at Hello Gorgeous Med Spa in Oswego, IL. Our expert team includes Danielle and Ryan, specializing in Botox, fillers, weight loss, and hormone therapy. View credentials, results, and book your appointment.',
  keywords: [
    'med spa providers Oswego IL',
    'nurse practitioner Oswego',
    'Botox injector near me',
    'filler specialist Naperville',
    'weight loss doctor Aurora IL',
    'hormone therapy provider',
    'medical aesthetics team',
    'Hello Gorgeous providers',
    'licensed injector Illinois',
    'aesthetic nurse practitioner',
  ],
  alternates: {
    canonical: 'https://www.hellogorgeousmedspa.com/providers',
  },
  openGraph: {
    title: 'Meet Our Expert Providers | Hello Gorgeous Med Spa',
    description: 'Licensed medical professionals delivering real results with personalized care. View our team, credentials, and before/after results.',
    url: 'https://www.hellogorgeousmedspa.com/providers',
    siteName: 'Hello Gorgeous Med Spa',
    images: [{
      url: 'https://www.hellogorgeousmedspa.com/images/providers-og.jpg',
      width: 1200,
      height: 630,
      alt: 'Hello Gorgeous Med Spa Providers',
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meet Our Expert Providers | Hello Gorgeous Med Spa',
    description: 'Licensed medical professionals delivering real results with personalized care.',
    images: ['https://www.hellogorgeousmedspa.com/images/providers-og.jpg'],
  },
  robots: { index: true, follow: true },
};

// Fallback provider data when database is unavailable
const FALLBACK_PROVIDERS = [
  {
    id: '1',
    first_name: 'Danielle',
    last_name: '',
    slug: 'danielle',
    title: 'Owner & Nurse Practitioner',
    credentials: 'MSN, APRN, FNP-BC',
    bio: 'Danielle is the founder and lead aesthetic injector at Hello Gorgeous Med Spa. With years of experience in medical aesthetics, she specializes in creating natural, beautiful results that enhance each client\'s unique features.',
    philosophy: 'I believe in enhancing your natural beauty, not changing who you are. Every treatment is customized to your unique features and goals.',
    headshot_url: '/images/providers/danielle.jpg',
    booking_url: 'https://hellogorgeousmedspa.janeapp.com/staff_members/1',
    is_active: true,
    display_order: 1,
  },
  {
    id: '2',
    first_name: 'Ryan',
    last_name: 'Kent',
    slug: 'ryan',
    title: 'Medical Director & Nurse Practitioner',
    credentials: 'MSN, APRN, FNP-BC',
    bio: 'Ryan brings extensive medical experience to Hello Gorgeous Med Spa, specializing in weight loss management and hormone optimization. His evidence-based approach ensures safe, effective treatments for every patient.',
    philosophy: 'Healthcare should be personalized and accessible. I work with each patient to develop a treatment plan that fits their lifestyle and goals.',
    headshot_url: '/images/providers/ryan.jpg',
    booking_url: 'https://hellogorgeousmedspa.janeapp.com/staff_members/2',
    is_active: true,
    display_order: 2,
  },
];

async function getProviders() {
  try {
    const supabase = createServerSupabaseClient();
    
    if (!supabase) {
      return FALLBACK_PROVIDERS;
    }
    
    const { data: providers, error } = await supabase
      .from('providers')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (error || !providers || providers.length === 0) {
      return FALLBACK_PROVIDERS;
    }
    
    return providers;
  } catch {
    return FALLBACK_PROVIDERS;
  }
}

export default async function ProvidersPage() {
  const providers = await getProviders();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': 'https://www.hellogorgeousmedspa.com/#organization',
    name: 'Hello Gorgeous Med Spa',
    url: 'https://www.hellogorgeousmedspa.com',
    employee: providers.map((provider) => ({
      '@type': 'Person',
      name: `${provider.first_name} ${provider.last_name || ''}`.trim(),
      jobTitle: provider.title,
      description: provider.bio,
      image: provider.headshot_url?.startsWith('http') 
        ? provider.headshot_url 
        : `https://www.hellogorgeousmedspa.com${provider.headshot_url}`,
      worksFor: {
        '@type': 'MedicalBusiness',
        name: 'Hello Gorgeous Med Spa',
      },
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#FF2D8E]/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Meet The Experts Behind
            <span className="block text-[#FF2D8E]">Hello Gorgeous</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Licensed medical professionals. Real results. Personalized care.
          </p>
        </div>
      </section>

      {/* Provider Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {providers.map((provider) => (
              <article
                key={provider.id}
                className="group bg-white border-2 border-black rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Provider Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50">
                  {provider.headshot_url ? (
                    <Image
                      src={provider.headshot_url}
                      alt={`${provider.first_name} ${provider.last_name || ''} - ${provider.title}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl">👩‍⚕️</span>
                    </div>
                  )}
                  {/* Credentials Badge */}
                  {provider.credentials && (
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold text-black">{provider.credentials}</span>
                    </div>
                  )}
                </div>

                {/* Provider Info */}
                <div className="p-8">
                  <div className="mb-4">
                    <h2 className="text-3xl font-bold text-black mb-1">
                      {provider.first_name} {provider.last_name || ''}
                    </h2>
                    {provider.title && (
                      <p className="text-[#FF2D8E] font-medium">{provider.title}</p>
                    )}
                  </div>

                  {provider.bio && (
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {provider.bio}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/providers/${provider.slug || provider.id}`}
                      className="flex-1 text-center bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                    >
                      View Results
                    </Link>
                    <a
                      href={provider.booking_url || 'https://hellogorgeousmedspa.janeapp.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-[#FF2D8E] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#e0267d] transition-colors"
                    >
                      Book with {provider.first_name}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-black mb-2">1000+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">5+ yrs</div>
              <div className="text-gray-600">Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">4.9★</div>
              <div className="text-gray-600">Google Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">100%</div>
              <div className="text-gray-600">Licensed & Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
            Why Choose Our Providers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl border border-gray-200 hover:border-[#FF2D8E] transition-colors">
              <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Board Certified</h3>
              <p className="text-gray-600">
                All treatments performed by licensed nurse practitioners with specialized training in medical aesthetics.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl border border-gray-200 hover:border-[#FF2D8E] transition-colors">
              <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Natural Results</h3>
              <p className="text-gray-600">
                We enhance your natural beauty with subtle, artistic techniques that look refreshed, never overdone.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl border border-gray-200 hover:border-[#FF2D8E] transition-colors">
              <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💝</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Personalized Care</h3>
              <p className="text-gray-600">
                Every treatment plan is customized to your unique features, goals, and lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Meet Your Provider?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Book a free consultation to discuss your goals and create your personalized treatment plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://hellogorgeousmedspa.janeapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF2D8E] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#e0267d] transition-colors"
            >
              Book Free Consultation
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
