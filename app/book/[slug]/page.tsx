// ============================================================
// PUBLIC SERVICE BOOKING PAGE
// No login required - book specific service
// URL: /book/[service-slug]
// ============================================================

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import type { Metadata } from 'next';
import BookingForm from './BookingForm';

interface Props {
  params: { slug: string };
}

async function getService(slug: string) {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: service, error } = await supabase
      .from('services')
      .select('*, service_categories(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (error || !service) {
      return null;
    }

    return service;
  } catch (error) {
    console.error('Error loading service:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params.slug);
  
  if (!service) {
    return { title: 'Service Not Found | Hello Gorgeous Med Spa' };
  }

  return {
    title: `Book ${service.name} | Hello Gorgeous Med Spa`,
    description: service.short_description || `Book ${service.name} at Hello Gorgeous Med Spa in Oswego, IL.`,
  };
}

export default async function ServiceBookingPage({ params }: Props) {
  const service = await getService(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/book" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <span>←</span>
            <span className="text-sm">Back to Services</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">💗</span>
            <span className="font-semibold text-gray-900">Hello Gorgeous</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Service Info */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-pink-600 font-medium mb-1">
                {service.service_categories?.name || 'Treatment'}
              </p>
              <h1 className="text-2xl font-bold text-gray-900">
                {service.name}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-pink-600">
                {service.price_display}
              </p>
              <p className="text-sm text-gray-500">
                {service.duration_minutes} minutes
              </p>
            </div>
          </div>
          
          {service.short_description && (
            <p className="text-gray-600 mb-4">
              {service.short_description}
            </p>
          )}

          {/* Alerts */}
          {service.requires_consult && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> This service requires a consultation for new clients. 
                If this is your first time, we'll schedule a quick consult first.
              </p>
            </div>
          )}

          {service.deposit_required && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-800 text-sm">
                <strong>Deposit Required:</strong> A ${service.deposit_amount || 50} deposit is required to secure your appointment.
              </p>
            </div>
          )}
        </section>

        {/* Booking Form */}
        <BookingForm service={service} />

        {/* Help */}
        <section className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Questions? We're here to help!
          </p>
          <div className="flex items-center justify-center gap-4">
            <a 
              href="tel:6306366193" 
              className="text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              📞 (630) 636-6193
            </a>
            <span className="text-gray-300">|</span>
            <a 
              href="mailto:hello@hellogorgeousmedspa.com" 
              className="text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              ✉️ Email Us
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
