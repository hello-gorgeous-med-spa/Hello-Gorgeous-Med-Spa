// ============================================================
// PUBLIC ONLINE BOOKING PAGE
// No login required - clients can book directly
// URL: /book
// ============================================================

import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Online | Hello Gorgeous Med Spa',
  description: 'Book your appointment online in seconds. Botox, fillers, facials, IV therapy, and more in Oswego, IL.',
};

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

async function getServicesData() {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: categories } = await supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    const { data: services } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .eq('allow_online_booking', true)
      .order('display_order');

    return { 
      categories: categories || [], 
      services: services || [] 
    };
  } catch (error) {
    console.error('Error loading services:', error);
    return { categories: [], services: [] };
  }
}

export default async function PublicBookingPage() {
  const { categories, services } = await getServicesData();

  // Group services by category
  const servicesByCategory = categories.map((cat) => ({
    ...cat,
    services: services.filter((s) => s.category_id === cat.id),
  }));

  // Featured/popular services
  const popularServices = services.filter((s) => s.is_featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💗</span>
            <span className="font-semibold text-gray-900">Hello Gorgeous</span>
          </Link>
          <div className="flex items-center gap-4">
            <a href="tel:6306366193" className="text-sm text-gray-600 hover:text-pink-600">
              (630) 636-6193
            </a>
            <Link 
              href="/portal" 
              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Book Your Appointment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a service below to get started. New clients welcome!
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">📍 74 W. Washington St, Oswego IL</span>
            <span>•</span>
            <span className="flex items-center gap-1">🕐 Mon-Fri 9am-5pm</span>
          </div>
        </section>

        {/* Quick Book - Popular Services */}
        {popularServices.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              ⭐ Most Popular
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/book/${service.slug}`}
                  className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-pink-600 font-semibold text-sm whitespace-nowrap ml-2">
                      {service.price_display}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {service.short_description || 'Premium aesthetic treatment'}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>🕐 {service.duration_minutes} min</span>
                    {service.requires_consult && (
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Consult First
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Services by Category */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Services
          </h2>
          
          {servicesByCategory.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
              <p className="text-gray-500 mb-4">
                Loading services...
              </p>
              <Link 
                href="https://hello-gorgeous-med-spa.square.site/"
                target="_blank"
                className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full font-medium hover:bg-pink-600"
              >
                Book via Alternate Portal →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {servicesByCategory.map((category) => (
                category.services.length > 0 && (
                  <div key={category.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    {/* Category Header */}
                    <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <span>{CATEGORY_ICONS[category.slug] || '✨'}</span>
                        {category.name}
                        <span className="text-sm font-normal text-gray-500">
                          ({category.services.length})
                        </span>
                      </h3>
                    </div>
                    
                    {/* Services List */}
                    <div className="divide-y divide-gray-100">
                      {category.services.map((service) => (
                        <Link
                          key={service.id}
                          href={`/book/${service.slug}`}
                          className="flex items-center justify-between p-5 hover:bg-pink-50 transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">
                              {service.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-sm text-gray-500">
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
                            <span className="text-gray-400 group-hover:text-pink-600 transition-colors">
                              →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </section>

        {/* Not Sure Section */}
        <section className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 text-center mb-12">
          <div className="text-4xl mb-4">🤔</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Not sure which treatment is right for you?
          </h3>
          <p className="text-gray-600 mb-6">
            Book a free consultation and our team will create a personalized plan just for you.
          </p>
          <Link
            href="/book/free-consultation"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
          >
            Book Free Consultation
          </Link>
        </section>

        {/* Contact Info */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="text-2xl mb-2">📍</div>
            <h4 className="font-semibold text-gray-900">Location</h4>
            <p className="text-sm text-gray-600 mt-1">
              74 W. Washington Street<br />
              Oswego, IL 60543
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="text-2xl mb-2">📞</div>
            <h4 className="font-semibold text-gray-900">Call or Text</h4>
            <a href="tel:6306366193" className="text-pink-600 font-medium mt-1 block">
              (630) 636-6193
            </a>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="text-2xl mb-2">🕐</div>
            <h4 className="font-semibold text-gray-900">Hours</h4>
            <p className="text-sm text-gray-600 mt-1">
              Mon-Thu: 9am-5pm<br />
              Fri: 9am-3pm
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Hello Gorgeous Med Spa. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
