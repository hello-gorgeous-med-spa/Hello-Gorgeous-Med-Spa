// ============================================================
// PUBLIC ONLINE BOOKING PAGE
// No login required - clients can book directly
// URL: /book
// ============================================================

import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { DEFAULT_ONLINE_BOOKING_CONFIG, DEFAULT_BOOKING_POLICY, DEFAULT_CANCELLATION_POLICY } from '@/lib/hgos/policies';
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
  'dermal-fillers': '💋',
  'weight-loss-injections': '⚡',
  'bioidentical-hormone-therapy-bhrt': '⚖️',
  'skin-spa': '✨',
  'lash-spa': '👁️',
  'brow-spa': '🤨',
  'body-spa': '💆',
  'iv-drip-package-deals': '💧',
  'prp-injections': '🩸',
  'vitamin-injections': '💊',
  'glowtox-facial-our-signature': '✨',
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

export default async function PublicBookingPage({
  searchParams,
}: {
  searchParams?: Promise<{ provider?: string }> | { provider?: string };
}) {
  const { categories, services } = await getServicesData();
  const params = searchParams && typeof (searchParams as any).then === 'function'
    ? await (searchParams as Promise<{ provider?: string }>)
    : (searchParams || {});
  const providerQ = params.provider ? `?provider=${encodeURIComponent(params.provider)}` : '';

  // Group services by category
  const servicesByCategory = categories.map((cat) => ({
    ...cat,
    services: services.filter((s) => s.category_id === cat.id),
  }));

  // Featured/popular services
  const popularServices = services.filter((s) => s.is_featured).slice(0, 6);

  // Category colors for visual variety
  const CATEGORY_COLORS: Record<string, string> = {
    'botox': 'from-pink-500 to-rose-500',
    'dermal-fillers': 'from-rose-500 to-pink-500',
    'weight-loss-injections': 'from-emerald-500 to-teal-500',
    'skin-spa': 'from-purple-500 to-violet-500',
    'lash-spa': 'from-indigo-500 to-blue-500',
    'brow-spa': 'from-amber-500 to-orange-500',
    'body-spa': 'from-cyan-500 to-blue-500',
    'iv-drip-package-deals': 'from-blue-500 to-indigo-500',
    'prp-injections': 'from-red-500 to-rose-500',
    'vitamin-injections': 'from-lime-500 to-green-500',
    'bioidentical-hormone-therapy-bhrt': 'from-violet-500 to-purple-500',
    'trigger-point': 'from-orange-500 to-amber-500',
    'anteage': 'from-fuchsia-500 to-pink-500',
    'glowtox-facial-our-signature': 'from-pink-500 to-purple-500',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="h-14 sm:h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-500 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white text-base sm:text-lg">💗</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 text-base sm:text-lg">Hello Gorgeous</span>
                <span className="hidden sm:block text-xs text-pink-600">Oswego, IL</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <a href="tel:6306366193" className="p-2 sm:px-3 sm:py-2 text-gray-600 hover:text-pink-600 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center">
                <span className="text-pink-500">📞</span>
                <span className="hidden sm:inline ml-1 text-sm">(630) 636-6193</span>
              </a>
              <Link 
                href="/portal" 
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full min-h-[44px] flex items-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Compact Hero */}
        <section className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Book Your Appointment
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose a service below. New clients always welcome.
          </p>
        </section>

        {/* Quick Book - Popular Services */}
        {popularServices.length > 0 && (
          <section className="mb-8">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Most Popular</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {popularServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/book/${service.slug}${providerQ}`}
                  className="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-pink-300 hover:bg-pink-50/50 transition-all group min-h-[72px] active:scale-[0.99]"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
                      {service.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {service.duration_minutes} min · {service.price_display}
                    </p>
                  </div>
                  <span className="text-pink-500 shrink-0" aria-hidden>→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Services by Category */}
        <section id="all-services" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              All Services
            </h2>
            <span className="text-sm text-white">{services.length} treatments available</span>
          </div>
          
          {servicesByCategory.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
              <p className="text-gray-600 mb-2">
                No services are available for online booking right now.
              </p>
              <p className="text-gray-500 mb-4">
                Please call or text us to book your appointment.
              </p>
              <a
                href="tel:6306366193"
                className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full font-medium hover:bg-pink-600"
              >
                📞 (630) 636-6193
              </a>
            </div>
          ) : (
            <div className="space-y-8">
              {servicesByCategory.map((category, idx) => (
                category.services.length > 0 && (
                  <div key={category.id} id={category.slug} className="scroll-mt-36">
                    {/* Category Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Category Header - Colorful */}
                      <div className={`bg-gradient-to-r ${CATEGORY_COLORS[category.slug] || 'from-pink-500 to-rose-500'} px-6 py-4`}>
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white text-lg flex items-center gap-3">
                            <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                              {CATEGORY_ICONS[category.slug] || '✨'}
                            </span>
                            {category.name}
                          </h3>
                          <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                            {category.services.length} {category.services.length === 1 ? 'service' : 'services'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Services Grid */}
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {category.services.map((service) => (
                            <Link
                              key={service.id}
                              href={`/book/${service.slug}${providerQ}`}
                              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 rounded-xl transition-all group border border-transparent hover:border-pink-200"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-1">
                                  {service.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className="text-xs text-white bg-white px-2 py-0.5 rounded-full">
                                    🕐 {service.duration_minutes} min
                                  </span>
                                  {service.deposit_required && (
                                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                                      Deposit
                                    </span>
                                  )}
                                  {service.requires_consult && (
                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                      Consult
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 ml-3">
                                <span className="font-bold text-pink-600 whitespace-nowrap">
                                  {service.price_display}
                                </span>
                                <span className="w-8 h-8 bg-pink-100 group-hover:bg-pink-500 text-pink-500 group-hover:text-white rounded-full flex items-center justify-center transition-all">
                                  →
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </section>

        {/* Membership Upsell */}
        {DEFAULT_ONLINE_BOOKING_CONFIG.highlightMemberships && (
          <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-5xl">💎</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">
                  Save 10% on Every Service with Our Membership
                </h3>
                <p className="text-purple-100 mb-4">
                  Join our Hello Gorgeous membership for priority booking, exclusive discounts, and more!
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link
                    href="/membership"
                    className="inline-flex items-center gap-2 bg-white text-purple-600 px-5 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all"
                  >
                    View Membership Plans
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Not Sure Section */}
        <section className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 text-center mb-12">
          <div className="text-4xl mb-4">🤔</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Not sure which treatment is right for you?
          </h3>
          <p className="text-gray-600 mb-6">
            Book a free consultation and our team will create a personalized plan just for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full font-medium hover:bg-pink-600 transition-all"
            >
              ✨ Take the Quiz
            </Link>
            <Link
              href={`/book/consultation-free${providerQ}`}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all border border-gray-200"
            >
              Book Free Consultation
            </Link>
          </div>
        </section>

        {/* Booking Policy Info */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12">
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            📋 Booking & Cancellation Policy
          </h3>
          <div className="text-sm text-amber-800 space-y-2">
            <p>
              <strong>Booking:</strong> You can book appointments up to {DEFAULT_BOOKING_POLICY.maxAdvanceBookingDays / 30} months in advance.
            </p>
            <p>
              <strong>Cancellation:</strong> Please provide at least {DEFAULT_CANCELLATION_POLICY.freeCancellationHours} hours notice to cancel or reschedule your appointment.
            </p>
            <p className="text-xs mt-3 text-amber-700 leading-relaxed">
              {DEFAULT_ONLINE_BOOKING_CONFIG.importantInfoText.split('\n')[0]}
            </p>
          </div>
          {DEFAULT_ONLINE_BOOKING_CONFIG.displayContactNumberForHelp && (
            <p className="text-sm text-amber-800 mt-4">
              Need help? Call or text us at{' '}
              <a href={`tel:${DEFAULT_ONLINE_BOOKING_CONFIG.contactNumber.replace(/\D/g, '')}`} className="font-semibold text-amber-900 underline">
                {DEFAULT_ONLINE_BOOKING_CONFIG.contactNumber}
              </a>
            </p>
          )}
        </section>

        {/* Contact Info */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white text-center shadow-lg shadow-pink-500/20">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📍</span>
            </div>
            <h4 className="font-bold text-lg">Visit Us</h4>
            <p className="text-pink-100 mt-1 text-sm">
              74 W. Washington Street<br />
              Oswego, IL 60543
            </p>
            <a 
              href="https://maps.google.com/?q=74+W+Washington+St+Oswego+IL" 
              target="_blank"
              className="inline-block mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-all"
            >
              Get Directions →
            </a>
          </div>
          <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl p-6 text-white text-center shadow-lg shadow-violet-500/20">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📞</span>
            </div>
            <h4 className="font-bold text-lg">Call or Text</h4>
            <a href="tel:6306366193" className="text-2xl font-bold mt-1 block hover:underline">
              (630) 636-6193
            </a>
            <p className="text-violet-200 text-sm mt-2">We respond within minutes!</p>
          </div>
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 text-white text-center shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🕐</span>
            </div>
            <h4 className="font-bold text-lg">Hours</h4>
            <div className="text-slate-300 mt-1 text-sm space-y-1">
              <p>Mon - Thu: <span className="text-white font-medium">9am - 5pm</span></p>
              <p>Friday: <span className="text-white font-medium">9am - 3pm</span></p>
              <p>Sat - Sun: <span className="text-slate-400">Closed</span></p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                <span className="text-white">💗</span>
              </div>
              <div>
                <p className="font-bold">Hello Gorgeous Med Spa</p>
                <p className="text-sm text-slate-400">Where beauty meets wellness</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-white text-sm">
              © {new Date().getFullYear()} Hello Gorgeous Med Spa. All rights reserved. | Oswego, Illinois
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
