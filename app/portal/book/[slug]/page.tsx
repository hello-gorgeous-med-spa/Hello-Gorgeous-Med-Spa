// ============================================================
// SERVICE BOOKING PAGE - Date/Time Selection
// ============================================================

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import BookingForm from './BookingForm';

async function getServiceData(slug: string) {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: service, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories (
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (error || !service) {
      return null;
    }

    // Get location
    const { data: location } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .single();

    return { service, location };
  } catch (error) {
    console.error('Error loading service:', error);
    return null;
  }
}

export default async function ServiceBookingPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getServiceData(params.slug);
  
  if (!data) {
    notFound();
  }

  const { service, location } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-black">
        <Link href="/portal" className="hover:text-pink-600">
          Portal
        </Link>
        <span className="mx-2">/</span>
        <Link href="/portal/book" className="hover:text-pink-600">
          Book
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">{service.name}</span>
      </nav>

      {/* Service Info Card */}
      <section className="bg-white rounded-2xl border border-black overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-pink-100 text-sm mb-1">
                {service.service_categories?.name}
              </p>
              <h1 className="text-2xl font-bold">{service.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{service.price_display}</p>
              <p className="text-pink-100 text-sm">
                {service.duration_minutes} minutes
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Description */}
          {service.short_description && (
            <p className="text-black mb-6">{service.short_description}</p>
          )}

          {/* Requirements */}
          {(service.requires_consult || service.requires_intake || service.deposit_required || service.minimum_age) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <span>⚠️</span> Requirements
              </h3>
              <ul className="space-y-1 text-sm text-amber-700">
                {service.requires_consult && (
                  <li>• Consultation required for first-time patients</li>
                )}
                {service.requires_intake && (
                  <li>• Medical intake form required before appointment</li>
                )}
                {service.requires_consent && (
                  <li>• Treatment consent form required</li>
                )}
                {service.deposit_required && (
                  <li>• ${(service.deposit_amount_cents / 100).toFixed(0)} deposit required to book</li>
                )}
                {service.minimum_age && (
                  <li>• Must be {service.minimum_age}+ years old</li>
                )}
              </ul>
            </div>
          )}

          {/* Location Info */}
          {location && (
            <div className="flex items-start gap-3 text-sm text-black mb-6">
              <span className="text-lg">📍</span>
              <div>
                <p className="font-medium text-black">{location.name}</p>
                <p>{location.address_line1}</p>
                <p>{location.city}, {location.state} {location.postal_code}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Booking Form */}
      <BookingForm 
        service={service} 
        location={location}
      />

      {/* Help */}
      <section className="bg-white rounded-2xl p-6 text-center">
        <p className="text-black mb-3">
          Have questions about this service?
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="tel:630-636-6193"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black text-black hover:bg-white transition-colors text-sm font-medium"
          >
            <span>📞</span> Call Us
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E] text-white hover:bg-black transition-colors text-sm font-medium"
          >
            <span>💬</span> Ask Beau-Tox
          </Link>
        </div>
      </section>
    </div>
  );
}
