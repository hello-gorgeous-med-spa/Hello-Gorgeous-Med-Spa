// ============================================================
// PROVIDERS PAGE
// Meet The Experts - Provider showcase with videos & results
// SEO optimized, premium medical aesthetic design
// ============================================================

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Meet Our Providers | Hello Gorgeous Med Spa',
  description: 'Meet the licensed medical professionals behind Hello Gorgeous Med Spa. Danielle Glazier-Alcala, FNP-BC and Ryan Kent, FNP-C bring expertise in aesthetic injectables, laser treatments, and medical aesthetics.',
  keywords: 'aesthetic injector Aurora, med spa providers, Botox specialist, dermal filler expert, FNP aesthetic nurse',
  openGraph: {
    title: 'Meet The Experts | Hello Gorgeous Med Spa',
    description: 'Licensed medical professionals delivering personalized aesthetic care with real results.',
    type: 'website',
    images: ['/images/og-providers.jpg'],
  },
};

// Hardcoded providers for now - will be database-driven
const PROVIDERS = [
  {
    id: 'danielle',
    slug: 'danielle',
    name: 'Danielle Glazier-Alcala',
    firstName: 'Danielle',
    credentials: 'FNP-BC',
    title: 'Owner & Lead Aesthetic Injector',
    shortBio: 'With over a decade of nursing experience and specialized training in aesthetic medicine, Danielle founded Hello Gorgeous to bring personalized, natural-looking results to Aurora and the surrounding communities.',
    headshot: '/images/team/danielle-glazier-alcala.jpg',
    specialties: ['Botox & Dysport', 'Lip Augmentation', 'Dermal Fillers', 'CO₂ Laser', 'Hormone Therapy'],
    color: '#FF2D8E',
    bookingUrl: '/book?provider=danielle',
  },
  {
    id: 'ryan',
    slug: 'ryan',
    name: 'Ryan Kent',
    firstName: 'Ryan',
    credentials: 'FNP-C',
    title: 'Aesthetic Injector',
    shortBio: 'Ryan brings precision and an artistic eye to aesthetic medicine. His background in emergency nursing gives him excellent assessment skills and a steady hand for detailed injection work.',
    headshot: '/images/team/ryan-kent.jpg',
    specialties: ['Botox & Dysport', 'Jawline Contouring', 'Dermal Fillers', 'PRP Treatments'],
    color: '#2D63A4',
    bookingUrl: '/book?provider=ryan',
  },
];

export default function ProvidersPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Meet The Experts Behind
            <span className="block text-[#FF2D8E]">Hello Gorgeous</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Licensed medical professionals. Real results. Personalized care.
          </p>
          
          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">15+</p>
              <p className="text-sm text-gray-500">Years Combined Experience</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">5,000+</p>
              <p className="text-sm text-gray-500">Treatments Performed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">4.9★</p>
              <p className="text-sm text-gray-500">Patient Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Cards */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {PROVIDERS.map((provider) => (
              <article 
                key={provider.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Provider Image */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br opacity-20"
                    style={{ background: `linear-gradient(135deg, ${provider.color}40, ${provider.color}10)` }}
                  />
                  <Image
                    src={provider.headshot}
                    alt={`${provider.name}, ${provider.credentials}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  {/* Credentials badge */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <p className="font-semibold text-gray-900">
                      {provider.name}, <span className="text-[#FF2D8E]">{provider.credentials}</span>
                    </p>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="p-6 lg:p-8">
                  <p className="text-sm font-medium text-gray-500 mb-2">{provider.title}</p>
                  <p className="text-gray-700 mb-6 leading-relaxed">{provider.shortBio}</p>

                  {/* Specialties */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {provider.specialties.map((specialty) => (
                        <span 
                          key={specialty}
                          className="px-3 py-1 text-sm rounded-full"
                          style={{ 
                            backgroundColor: `${provider.color}15`,
                            color: provider.color,
                          }}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/providers/${provider.slug}`}
                      className="flex-1 text-center px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
                    >
                      View Results
                    </Link>
                    <Link
                      href={provider.bookingUrl}
                      className="flex-1 text-center px-6 py-3 bg-[#FF2D8E] text-white font-semibold rounded-lg hover:bg-black transition-colors"
                    >
                      Book with {provider.firstName}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Patients Trust Us
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#FF2D8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Board Certified</h3>
              <p className="text-gray-600">
                All providers are board-certified nurse practitioners with advanced aesthetic training.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#FF2D8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Natural Results</h3>
              <p className="text-gray-600">
                We believe in enhancing your features, not changing who you are. Subtle, beautiful results.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#FF2D8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Care</h3>
              <p className="text-gray-600">
                Every treatment plan is customized to your unique facial anatomy and aesthetic goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Disclaimer */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            Results vary by individual. All treatments performed by licensed medical professionals. 
            Individual consultations are required to determine appropriate treatment plans.
          </p>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalBusiness',
            name: 'Hello Gorgeous Med Spa',
            image: 'https://hellogorgeousmedspa.com/images/og-providers.jpg',
            '@id': 'https://hellogorgeousmedspa.com',
            url: 'https://hellogorgeousmedspa.com/providers',
            telephone: '+1-630-636-6193',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '2933 S Eudora St',
              addressLocality: 'Aurora',
              addressRegion: 'CO',
              postalCode: '80014',
              addressCountry: 'US',
            },
            employee: PROVIDERS.map(provider => ({
              '@type': 'Person',
              name: provider.name,
              jobTitle: provider.title,
              description: provider.shortBio,
              image: `https://hellogorgeousmedspa.com${provider.headshot}`,
              hasCredential: {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: provider.credentials,
              },
            })),
          }),
        }}
      />
    </main>
  );
}
