import Link from 'next/link';
import Image from 'next/image';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { ServiceConfig, ServiceArea, generateServiceSchema } from '@/lib/location-seo';

// ============================================================
// REUSABLE LOCATION SERVICE PAGE COMPONENT
// Used for all service + city landing pages
// ============================================================

interface LocationServicePageProps {
  service: ServiceConfig;
  area: ServiceArea;
  nearbyAreas: ServiceArea[];
}

export function LocationServicePage({ service, area, nearbyAreas }: LocationServicePageProps) {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Services', url: `${SITE.url}/services` },
    { name: `${service.name} ${area.city} IL`, url: `${SITE.url}/${service.slug}-${area.slug}-il` },
  ];

  return (
    <>
      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateServiceSchema(service, area.city)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(service.faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(`${area.city}, IL`)) }} />

      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#FF2D8E] font-medium mb-4">
                  {area.city === 'Oswego' ? 'Located in Downtown Oswego' : `${area.distance} from ${area.city}`}
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  <span className="text-[#FF2D8E]">{service.name}</span> in {area.city}, IL
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  {service.description} Hello Gorgeous Med Spa serves {area.city} and surrounding areas with licensed nurse practitioners.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
                  >
                    Book Free Consultation
                  </Link>
                  <a
                    href={`tel:${SITE.phone.replace(/-/g, '')}`}
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg"
                  >
                    📞 {SITE.phone}
                  </a>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">⭐ 4.9 Stars</span>
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ Licensed NPs</span>
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square relative rounded-2xl overflow-hidden border-4 border-[#FF2D8E]/30">
                  <Image
                    src={service.heroImage}
                    alt={`${service.name} treatment in ${area.city} IL at Hello Gorgeous Med Spa`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#FF2D8E] text-white p-6 rounded-xl shadow-xl">
                  <p className="text-2xl font-bold">{service.priceDisplay}</p>
                  <p className="text-sm opacity-90">Starting price</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {service.name} Near You — Areas We Serve
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              {['Oswego', 'Naperville', 'Aurora', 'Plainfield', 'Yorkville', 'Montgomery'].map((city) => (
                <div key={city} className={`p-6 rounded-xl text-center shadow-sm border ${city === area.city ? 'bg-[#FF2D8E] text-white border-[#FF2D8E]' : 'bg-white border-gray-100'}`}>
                  <span className="text-2xl mb-2 block">📍</span>
                  <p className="font-semibold">{city}, IL</p>
                  <p className={`text-sm ${city === area.city ? 'text-pink-100' : 'text-gray-500'}`}>
                    {city === area.city ? "You're Here!" : 'Service Available'}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-gray-600">
              Located at <strong>74 W. Washington Street, Oswego, IL</strong> — Easy access from I-88 & Route 34
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">
              Why Choose Hello Gorgeous for {service.name}?
            </h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Clients from {area.city} choose us for our expertise, competitive pricing, and exceptional results.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.benefits.map((benefit, idx) => (
                <div key={idx} className="text-center p-6">
                  <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{benefit.icon}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Treatment Areas (if applicable) */}
        {service.treatmentAreas && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">
                {service.name} Treatment Areas
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {service.treatmentAreas.map((treatment, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-2">{treatment.area}</h3>
                    <p className="text-gray-600 text-sm">{treatment.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {service.name} in {area.city} — FAQs
            </h2>
            <div className="space-y-6">
              {service.faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Book Your {service.name} Appointment?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Serving {area.city} and surrounding areas. Free consultations available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
              >
                Book Online Now
              </Link>
              <a
                href={`tel:${SITE.phone.replace(/-/g, '')}`}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg"
              >
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </section>

        {/* Directions */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-6">
              {area.city === 'Oswego' ? 'Visit Us in Downtown Oswego' : `Driving from ${area.city}`}
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                <strong>{area.directions}</strong>
              </p>
              <p className="text-gray-600">
                74 W. Washington Street, Oswego, IL 60543<br />
                {area.city !== 'Oswego' && <>Approximately {area.distance} | </>}Free parking available
              </p>
              <a 
                href={`https://www.google.com/maps/dir/${area.city},+IL/74+W+Washington+St,+Oswego,+IL+60543`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-[#FF2D8E] font-medium hover:underline"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </section>

        {/* Nearby Pages */}
        {nearbyAreas.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-lg font-semibold text-center mb-6 text-gray-700">
                Also Serving Nearby Areas
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {nearbyAreas.map((nearby) => (
                  <Link
                    key={nearby.slug}
                    href={`/${service.slug}-${nearby.slug}-il`}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-colors"
                  >
                    {service.name} {nearby.city}, IL
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
