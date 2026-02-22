// ============================================================
// BOOKING PAGE - Service Selection
// ============================================================

import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Service category icons
const CATEGORY_ICONS: Record<string, string> = {
  'bhrt': '⚖️',
  'weight-loss': '⚡',
  'botox': '💉',
  'fillers': '💋',
  'anteage': '🧬',
  'facials': '✨',
  'prp': '🩸',
  'iv-therapy': '💧',
  'trigger-point': '🎯',
  'lash': '👁️',
  'brow': '🤨',
  'laser-hair': '⚡',
  'consultations': '🩺',
};

// Fallback services when database is unavailable
const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Injectables', slug: 'botox', description: 'Botox, Dysport, Fillers', display_order: 1 },
  { id: '2', name: 'Weight Loss', slug: 'weight-loss', description: 'Semaglutide & Tirzepatide', display_order: 2 },
  { id: '3', name: 'Hormone Therapy', slug: 'bhrt', description: 'BioTE Hormone Optimization', display_order: 3 },
  { id: '4', name: 'Skin Treatments', slug: 'facials', description: 'Facials, Peels, Microneedling', display_order: 4 },
];

const FALLBACK_SERVICES = [
  { id: '1', name: 'Botox', slug: 'botox', category_id: '1', duration_minutes: 30, price_display: '$10/unit', short_description: 'Smooth fine lines and wrinkles', is_featured: true },
  { id: '2', name: 'Lip Filler', slug: 'lip-filler', category_id: '1', duration_minutes: 45, price_display: 'From $550', short_description: 'Natural lip enhancement', is_featured: true },
  { id: '3', name: 'Semaglutide Weight Loss', slug: 'semaglutide', category_id: '2', duration_minutes: 15, price_display: 'From $250/mo', short_description: 'Medical weight loss program', is_featured: true, requires_consult: true },
  { id: '4', name: 'Tirzepatide Weight Loss', slug: 'tirzepatide', category_id: '2', duration_minutes: 15, price_display: 'From $350/mo', short_description: 'Dual GIP/GLP-1 therapy', requires_consult: true },
  { id: '5', name: 'BioTE Hormone Therapy', slug: 'biote', category_id: '3', duration_minutes: 30, price_display: 'Varies', short_description: 'Bioidentical hormone pellets', requires_consult: true },
  { id: '6', name: 'Consultation', slug: 'consultation', category_id: '1', duration_minutes: 30, price_display: 'FREE', short_description: 'Discuss your goals with our team', is_featured: true },
  { id: '7', name: 'HydraFacial', slug: 'hydrafacial', category_id: '4', duration_minutes: 60, price_display: 'From $175', short_description: 'Deep cleansing facial' },
  { id: '8', name: 'RF Microneedling', slug: 'rf-microneedling', category_id: '4', duration_minutes: 60, price_display: 'From $400', short_description: 'Skin tightening & texture' },
];

async function getServicesData() {
  try {
    const supabase = createServerSupabaseClient();
    
    // If Supabase isn't configured, return fallback data
    if (!supabase) {
      console.warn('Supabase not configured, using fallback services');
      return { categories: FALLBACK_CATEGORIES, services: FALLBACK_SERVICES };
    }
    
    // Get categories
    const { data: categories, error: catError } = await supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (catError) {
      console.error('Error fetching categories:', catError);
      return { categories: FALLBACK_CATEGORIES, services: FALLBACK_SERVICES };
    }

    // Get services
    const { data: services, error: svcError } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .eq('allow_online_booking', true)
      .order('display_order');
    
    if (svcError) {
      console.error('Error fetching services:', svcError);
      return { categories: categories || FALLBACK_CATEGORIES, services: FALLBACK_SERVICES };
    }

    // If no services found in database, use fallback
    if (!services || services.length === 0) {
      console.warn('No services in database, using fallback');
      return { categories: categories || FALLBACK_CATEGORIES, services: FALLBACK_SERVICES };
    }

    return { categories: categories || [], services: services || [] };
  } catch (error) {
    console.error('Error loading services:', error);
    return { categories: FALLBACK_CATEGORIES, services: FALLBACK_SERVICES };
  }
}

export default async function BookingPage() {
  const { categories, services } = await getServicesData();

  // Group services by category
  const servicesByCategory = categories.map((cat) => ({
    ...cat,
    services: services.filter((s) => s.category_id === cat.id),
  }));

  // Featured services
  const featuredServices = services.filter((s) => s.is_featured);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-black mb-2">
          Book an Appointment
        </h1>
        <p className="text-black">
          Select a service to get started
        </p>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
            <span>⭐</span> Most Popular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredServices.slice(0, 6).map((service) => (
              <Link
                key={service.id}
                href={`/portal/book/${service.slug}`}
                className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-5 border border-pink-100 hover:shadow-lg hover:border-pink-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-black group-hover:text-pink-600 transition-colors">
                    {service.name}
                  </h3>
                  <span className="text-pink-600 font-semibold text-sm">
                    {service.price_display}
                  </span>
                </div>
                <p className="text-sm text-black mb-3 line-clamp-2">
                  {service.short_description}
                </p>
                <div className="flex items-center gap-3 text-xs text-black">
                  <span>🕐 {service.duration_minutes} min</span>
                  {service.requires_consult && (
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Consult Required
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Categories */}
      <section>
        <h2 className="text-lg font-semibold text-black mb-4">
          All Services
        </h2>
        
        {servicesByCategory.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-black text-center">
            <p className="text-black mb-4">
              Services are being loaded. Please refresh in a moment.
            </p>
            <p className="text-sm text-black">
              If this persists, the services may need to be seeded.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {servicesByCategory.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl border border-black overflow-hidden">
                {/* Category Header */}
                <div className="bg-white px-5 py-4 border-b border-black">
                  <h3 className="font-semibold text-black flex items-center gap-2">
                    <span>{CATEGORY_ICONS[category.slug] || '✨'}</span>
                    {category.name}
                    <span className="text-sm font-normal text-black">
                      ({category.services.length})
                    </span>
                  </h3>
                  {category.description && (
                    <p className="text-sm text-black mt-1">{category.description}</p>
                  )}
                </div>
                
                {/* Services List */}
                <div className="divide-y divide-black">
                  {category.services.length === 0 ? (
                    <div className="p-5 text-center text-black text-sm">
                      No services available in this category yet.
                    </div>
                  ) : (
                    category.services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/portal/book/${service.slug}`}
                        className="flex items-center justify-between p-5 hover:bg-pink-50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-black group-hover:text-pink-600 transition-colors">
                            {service.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-black">
                              🕐 {service.duration_minutes} min
                            </span>
                            {service.deposit_required && (
                              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                                Deposit Required
                              </span>
                            )}
                            {service.requires_consult && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                Consult First
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-pink-600">
                            {service.price_display}
                          </span>
                          <span className="text-black group-hover:text-pink-600 transition-colors">
                            →
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Help Section */}
      <section className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-4xl">🤔</div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-black">Not sure which service?</h3>
            <p className="text-sm text-black">
              Book a free consultation and we'll help you find the perfect treatment.
            </p>
          </div>
          <Link
            href="/portal/book/free-consultation"
            className="bg-white text-black px-5 py-2.5 rounded-full font-medium hover:shadow-md transition-all text-sm"
          >
            Free Consultation
          </Link>
        </div>
      </section>

      {/* External Booking Option */}
      <section className="bg-white rounded-2xl border border-black p-6 text-center">
        <p className="text-black mb-4">
          You can also book directly through our booking system:
        </p>
        <a
          href="https://hellogorgeousmedspa.janeapp.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#FF2D8E] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#FF2D8E]/90 transition-colors"
        >
          Book on Jane App →
        </a>
      </section>
    </div>
  );
}
