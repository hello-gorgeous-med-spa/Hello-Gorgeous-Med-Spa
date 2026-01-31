'use client';

// ============================================================
// SPECIAL OFFERS & FLASH SALES PAGE
// Drive urgency and conversions with limited-time deals
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  savings: number;
  savingsPercent: number;
  category: string;
  image: string;
  endsAt: Date;
  limitedQuantity?: number;
  quantitySold?: number;
  terms: string;
  featured: boolean;
}

// Mock offers
const MOCK_OFFERS: Offer[] = [
  {
    id: 'flash-1',
    title: 'Botox Flash Sale',
    description: '$10/unit Botox - This weekend only! Our lowest price ever.',
    originalPrice: 12,
    salePrice: 10,
    savings: 2,
    savingsPercent: 17,
    category: 'Injectables',
    image: '💉',
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    limitedQuantity: 50,
    quantitySold: 32,
    terms: 'Minimum 20 units. New and existing clients. Cannot combine with other offers.',
    featured: true,
  },
  {
    id: 'offer-2',
    title: 'First-Time Filler Package',
    description: 'Your first syringe of Juvederm at a special intro price.',
    originalPrice: 750,
    salePrice: 549,
    savings: 201,
    savingsPercent: 27,
    category: 'Injectables',
    image: '💋',
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    terms: 'New filler clients only. One per person.',
    featured: false,
  },
  {
    id: 'offer-3',
    title: 'Monthly Glow Membership',
    description: 'First month FREE when you join our VIP membership.',
    originalPrice: 99,
    salePrice: 0,
    savings: 99,
    savingsPercent: 100,
    category: 'Membership',
    image: '✨',
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    terms: '12-month commitment required. First month free, then $99/month.',
    featured: true,
  },
  {
    id: 'offer-4',
    title: 'Weight Loss Starter',
    description: 'First month of Semaglutide at intro pricing.',
    originalPrice: 450,
    salePrice: 299,
    savings: 151,
    savingsPercent: 34,
    category: 'Weight Loss',
    image: '⚡',
    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    terms: 'Includes consultation and first 4 weeks of medication.',
    featured: false,
  },
];

function CountdownTimer({ endsAt }: { endsAt: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = endsAt.getTime() - Date.now();
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  return (
    <div className="flex gap-2 justify-center">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hrs' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' },
      ].map((item) => (
        <div key={item.label} className="bg-gray-900 text-white rounded-lg px-3 py-2 min-w-[50px]">
          <p className="text-xl font-bold text-center">{item.value.toString().padStart(2, '0')}</p>
          <p className="text-xs text-gray-400 text-center">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function OffersPage() {
  const [offers] = useState(MOCK_OFFERS);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const featuredOffers = offers.filter(o => o.featured);
  const regularOffers = offers.filter(o => !o.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-5xl mb-4 block">🔥</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Special Offers & Flash Sales
          </h1>
          <p className="text-xl text-pink-100 mb-8">
            Limited-time deals you don't want to miss. Save big on your favorite treatments.
          </p>
        </div>
      </div>

      {/* Featured Offers */}
      {featuredOffers.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-red-500"
              >
                <div className="bg-red-500 text-white px-4 py-2 text-center">
                  <span className="font-bold">⚡ FLASH SALE - Limited Time!</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-5xl">{offer.image}</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{offer.title}</h2>
                      <p className="text-gray-600">{offer.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-green-600">
                      {offer.salePrice === 0 ? 'FREE' : `$${offer.salePrice}`}
                    </span>
                    <span className="text-xl text-gray-400 line-through">${offer.originalPrice}</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold">
                      Save {offer.savingsPercent}%
                    </span>
                  </div>

                  {offer.limitedQuantity && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Only {offer.limitedQuantity - (offer.quantitySold || 0)} left!</span>
                        <span className="text-red-600 font-medium">{offer.quantitySold} claimed</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${((offer.quantitySold || 0) / offer.limitedQuantity) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Offer ends in:</p>
                    <CountdownTimer endsAt={offer.endsAt} />
                  </div>

                  <button
                    onClick={() => setSelectedOffer(offer)}
                    className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Claim This Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Offers */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">More Great Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{offer.image}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                    {offer.category}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{offer.description}</p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    {offer.salePrice === 0 ? 'FREE' : `$${offer.salePrice}`}
                  </span>
                  <span className="text-gray-400 line-through">${offer.originalPrice}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Save ${offer.savings}</span>
                  <span>Ends {offer.endsAt.toLocaleDateString()}</span>
                </div>

                <button
                  onClick={() => setSelectedOffer(offer)}
                  className="w-full py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
                >
                  View Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Never Miss a Deal 📧
          </h2>
          <p className="text-gray-400 mb-6">
            Be the first to know about flash sales and exclusive offers. 
            VIP subscribers get early access!
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            Plus get 100 bonus reward points just for signing up!
          </p>
        </div>
      </div>

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 text-white">
              <span className="text-5xl mb-4 block">{selectedOffer.image}</span>
              <h2 className="text-2xl font-bold">{selectedOffer.title}</h2>
              <p className="text-pink-100">{selectedOffer.description}</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-4xl font-bold text-green-600">
                  {selectedOffer.salePrice === 0 ? 'FREE' : `$${selectedOffer.salePrice}`}
                </span>
                <span className="text-2xl text-gray-400 line-through">${selectedOffer.originalPrice}</span>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
                <p className="text-green-800 font-bold">You Save ${selectedOffer.savings}!</p>
                <p className="text-green-600 text-sm">That's {selectedOffer.savingsPercent}% off</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Offer expires:</p>
                <CountdownTimer endsAt={selectedOffer.endsAt} />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500">{selectedOffer.terms}</p>
              </div>

              <Link
                href="/book"
                className="block w-full py-3 bg-pink-500 text-white font-bold rounded-lg text-center hover:bg-pink-600"
              >
                Book Now & Claim Deal
              </Link>
              <button
                onClick={() => setSelectedOffer(null)}
                className="block w-full py-3 text-gray-600 font-medium mt-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
