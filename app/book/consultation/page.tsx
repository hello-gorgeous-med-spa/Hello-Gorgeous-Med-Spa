// ============================================================
// PUBLIC CONSULTATION BOOKING
// Free consultation — client chooses Ryan NP or Danielle (CNA/RN)
// URL: /book/consultation
// ============================================================

import { Suspense } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import type { Metadata } from 'next';
import BookingForm from '../[slug]/BookingForm';

const CONSULTATION_SERVICE = {
  id: 'consultation',
  name: 'Free Consultation',
  slug: 'consultation',
  duration_minutes: 30,
  price_display: 'Free',
  deposit_required: false,
  deposit_amount: null,
  requires_consult: false,
};

export const metadata: Metadata = {
  title: 'Book Free Consultation | Hello Gorgeous Med Spa',
  description: 'Book a free consultation with Ryan Kent, FNP-BC or Danielle Alcala. Personalized treatment plan. Oswego, IL. Serving Naperville, Aurora, Plainfield.',
  openGraph: {
    title: 'Book Free Consultation | Hello Gorgeous Med Spa',
    description: 'Choose Ryan NP or Danielle — free consultation to create your personalized plan.',
    url: `${SITE.url}/book/consultation`,
  },
};

export default function ConsultationBookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white">
      <header className="bg-white border-b border-black sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/book" className="flex items-center gap-2 text-black hover:text-black">
            <span>←</span>
            <span className="text-sm">Back to Services</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">💗</span>
            <span className="font-semibold text-black">Hello Gorgeous</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 scroll-mt-20" id="main-content">
        <section className="bg-white rounded-2xl border border-black p-6 mb-6">
          <p className="text-sm text-pink-600 font-medium mb-1">Consultation</p>
          <h1 className="text-2xl font-bold text-black">
            Free Consultation
          </h1>
          <p className="text-black mt-2">
            Not sure which treatment is right for you? Book a free consultation and our team will create a personalized plan. Choose your provider below.
          </p>
          <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
            <p className="text-2xl font-bold text-pink-600">Free</p>
            <p className="text-sm text-black">30 minutes</p>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm font-medium text-black mb-1">Choose your provider</p>
            <p className="text-sm text-black">
              <strong>Ryan Kent, FNP-BC</strong> — Medical aesthetics, injectables, weight loss, hormone therapy, IV therapy.<br />
              <strong>Danielle Alcala</strong> — Lashes, brows, facials, skin treatments, injectables, laser.
            </p>
          </div>
        </section>

        <Suspense fallback={<div className="animate-pulse rounded-xl h-64 bg-gray-100" />}>
          <BookingForm service={CONSULTATION_SERVICE} />
        </Suspense>

        <section className="mt-8 text-center">
          <p className="text-black text-sm mb-2">Questions? We&apos;re here to help!</p>
          <div className="flex items-center justify-center gap-4">
            <a href="tel:6306366193" className="text-pink-600 hover:text-pink-700 font-medium text-sm">
              📞 (630) 636-6193
            </a>
            <span className="text-black">|</span>
            <a href={`mailto:${SITE.email}`} className="text-pink-600 hover:text-pink-700 font-medium text-sm">
              ✉️ Email Us
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
