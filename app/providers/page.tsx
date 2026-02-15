// ============================================================
// PUBLIC: PROVIDERS PAGE
// "Meet The Experts Behind Hello Gorgeous"
// Premium, medical, trustworthy design
// ============================================================

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Providers | Hello Gorgeous Med Spa',
  description: 'Meet our licensed medical professionals at Hello Gorgeous Med Spa. Expert injectors and aesthetic specialists delivering personalized care with real results.',
  openGraph: {
    title: 'Meet Our Expert Providers | Hello Gorgeous Med Spa',
    description: 'Licensed medical professionals. Real results. Personalized care.',
  },
};

// Schema markup for SEO
const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Hello Gorgeous Med Spa",
  "description": "Premium med spa offering Botox, fillers, weight loss, and hormone therapy",
  "employee": [
    {
      "@type": "Person",
      "name": "Danielle",
      "jobTitle": "Owner & Lead Injector",
      "description": "Expert aesthetic injector specializing in natural results"
    },
    {
      "@type": "Person", 
      "name": "Ryan",
      "jobTitle": "Medical Provider",
      "description": "Licensed medical professional"
    }
  ]
};

// Default provider data (will be replaced with DB data)
const DEFAULT_PROVIDERS = [
  {
    id: '1',
    slug: 'danielle',
    name: 'Danielle',
    credentials: 'RN, BSN, Aesthetic Injector',
    bio: 'With over a decade of experience in aesthetic medicine, Danielle founded Hello Gorgeous Med Spa with a vision to deliver natural, personalized results. Her expertise spans advanced injection techniques, facial balancing, and helping clients feel confident in their own skin.',
    headshot_url: '/images/team/danielle.jpg',
    specialties: ['Botox', 'Lip Filler', 'Facial Balancing', 'PRP'],
    featured: true,
  },
  {
    id: '2',
    slug: 'ryan',
    name: 'Ryan',
    credentials: 'PA-C, Medical Provider',
    bio: 'Ryan brings clinical precision and a patient-first approach to Hello Gorgeous. Specializing in hormone therapy and weight management, he works closely with each patient to develop personalized treatment plans that deliver lasting results.',
    headshot_url: '/images/team/ryan.jpg',
    specialties: ['Hormone Therapy', 'Weight Loss', 'IV Therapy'],
    featured: true,
  },
];

export default function ProvidersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium mb-6">
              Our Team
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Meet The Experts Behind<br />
              <span className="text-pink-500">Hello Gorgeous</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Licensed medical professionals. Real results. Personalized care.
            </p>
          </div>
        </section>

        {/* Provider Cards */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {DEFAULT_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className="group bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Provider Image */}
                  <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-6xl font-bold text-pink-400">
                        {provider.name.charAt(0)}
                      </div>
                    </div>
                    {/* Featured Badge */}
                    {provider.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-pink-500 text-white text-xs font-medium rounded-full">
                        Lead Provider
                      </div>
                    )}
                  </div>

                  {/* Provider Info */}
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {provider.name}
                    </h2>
                    <p className="text-pink-500 font-medium mb-4">
                      {provider.credentials}
                    </p>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {provider.bio}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {provider.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/providers/${provider.slug}`}
                        className="flex-1 text-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                      >
                        View Results
                      </Link>
                      <Link
                        href={`/book?provider=${provider.slug}`}
                        className="flex-1 text-center px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium"
                      >
                        Book with {provider.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why Choose Hello Gorgeous?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🎓',
                  title: 'Licensed & Certified',
                  description: 'All treatments performed by licensed medical professionals with advanced training in aesthetics.',
                },
                {
                  icon: '✨',
                  title: 'Natural Results',
                  description: 'We specialize in subtle, natural-looking enhancements that enhance your unique beauty.',
                },
                {
                  icon: '💖',
                  title: 'Personalized Care',
                  description: 'Every treatment plan is customized to your goals, anatomy, and lifestyle.',
                },
              ].map((item, i) => (
                <div key={i} className="text-center p-8 bg-white rounded-2xl shadow-sm">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Look & Feel Gorgeous?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Schedule your complimentary consultation today.
            </p>
            <Link
              href="/book"
              className="inline-block px-8 py-4 bg-pink-500 text-white text-lg font-medium rounded-xl hover:bg-pink-600 transition-colors"
            >
              Book Your Consultation
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
