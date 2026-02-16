'use client';

// ============================================================
// SPECIAL OFFERS & FLASH SALES PAGE
// Drive urgency and conversions with limited-time deals
// Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';


interface Offer {
  id: string;
  title: string;
  description: string;
  original_price: number;
  sale_price: number;
  savings_percent: number;
  category: string;
  image: string;
  ends_at: string;
  terms: string;
  featured: boolean;
}

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white rounded ${className}`} />;
}

// Countdown timer component
function CountdownTimer({ endsAt }: { endsAt: Date }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = endsAt.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  if (!timeLeft) return <span className="text-red-600">Expired</span>;

  return (
    <div className="flex gap-2 text-center">
      {timeLeft.days > 0 && (
        <div className="bg-black text-white px-2 py-1 rounded">
          <span className="text-xl font-bold">{timeLeft.days}</span>
          <span className="text-xs block">days</span>
        </div>
      )}
      <div className="bg-black text-white px-2 py-1 rounded">
        <span className="text-xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="text-xs block">hrs</span>
      </div>
      <div className="bg-black text-white px-2 py-1 rounded">
        <span className="text-xl font-bold">{timeLeft.mins.toString().padStart(2, '0')}</span>
        <span className="text-xs block">min</span>
      </div>
      <div className="bg-black text-white px-2 py-1 rounded">
        <span className="text-xl font-bold">{timeLeft.secs.toString().padStart(2, '0')}</span>
        <span className="text-xs block">sec</span>
      </div>
    </div>
  );
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Offers - placeholder until offers table is populated
  useEffect(() => {
    // Special offers will load when promotions are added
    setOffers([]);
    setLoading(false);
  }, []);

  const categories = ['all', ...Array.from(new Set(offers.map(o => o.category)))];
  const filteredOffers = selectedCategory === 'all' 
    ? offers 
    : offers.filter(o => o.category === selectedCategory);

  const featuredOffer = offers.find(o => o.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-pink-600">
            Hello Gorgeous
          </Link>
          <Link
            href="/portal/book"
            className="px-6 py-2 bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Special Offers
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Limited-time deals on our most popular treatments. Don't miss out!
          </p>
        </div>

        {/* Connection Status */}
        {false && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <p className="text-amber-800">
              Connect your database to display current offers.
              Call <a href="tel:+16306366193" className="text-pink-600 font-medium">(630) 636-6193</a> for current specials.
            </p>
          </div>
        )}

        {/* Featured Offer */}
        {loading ? (
          <Skeleton className="h-64 mb-8" />
        ) : featuredOffer ? (
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-3xl p-8 mb-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Featured Deal</span>
                <h2 className="text-3xl font-bold mt-4 mb-2">{featuredOffer.title}</h2>
                <p className="text-pink-100 mb-4">{featuredOffer.description}</p>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold">${featuredOffer.sale_price}</span>
                  <span className="text-xl line-through text-pink-200">${featuredOffer.original_price}</span>
                  <span className="px-2 py-1 bg-white/20 rounded text-sm">Save {featuredOffer.savings_percent}%</span>
                </div>
                <Link
                  href="/portal/book"
                  className="inline-block px-8 py-3 bg-white text-pink-600 font-bold rounded-full hover:bg-pink-50 transition-colors"
                >
                  Book Now
                </Link>
              </div>
              <div className="text-center">
                <span className="text-8xl block mb-4">{featuredOffer.image || '✨'}</span>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-sm text-pink-100 mb-2">Ends in:</p>
                  <CountdownTimer endsAt={new Date(featuredOffer.ends_at)} />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Category Filter */}
        {offers.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-colors capitalize ${
                  selectedCategory === cat
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-black hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Offers Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🎁</span>
            <h2 className="text-2xl font-bold text-black mb-2">No Current Offers</h2>
            <p className="text-black mb-6">
              Check back soon for special deals and promotions!
            </p>
            <Link
              href="/services"
              className="inline-block px-6 py-3 bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.filter(o => !o.featured).map(offer => (
              <div key={offer.id} className="bg-white rounded-2xl border border-black overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{offer.image || '✨'}</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
                      Save {offer.savings_percent}%
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">{offer.title}</h3>
                  <p className="text-black text-sm mb-4">{offer.description}</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-black">${offer.sale_price}</span>
                    <span className="text-black line-through">${offer.original_price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <CountdownTimer endsAt={new Date(offer.ends_at)} />
                    <Link
                      href="/portal/book"
                      className="px-4 py-2 bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-black rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Gorgeous?</h2>
          <p className="text-black mb-6">
            Don't miss these amazing deals. Book your appointment today!
          </p>
          <Link
            href="/portal/book"
            className="inline-block px-8 py-3 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-600 transition-colors"
          >
            Book Your Appointment
          </Link>
        </div>
      </main>
    </div>
  );
}
