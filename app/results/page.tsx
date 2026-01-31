'use client';

// ============================================================
// RESULTS GALLERY
// Showcase before/after photos to build trust
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface ResultPhoto {
  id: string;
  category: string;
  treatment: string;
  provider: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  daysAfter: number;
}

// Mock data - in production would come from Supabase with consent-approved photos
const MOCK_RESULTS: ResultPhoto[] = [
  {
    id: '1',
    category: 'Injectables',
    treatment: 'Lip Filler',
    provider: 'Ryan Kent, APRN',
    beforeImage: '/placeholder-before.jpg',
    afterImage: '/placeholder-after.jpg',
    description: 'Natural lip enhancement with 1 syringe Juvederm',
    daysAfter: 14,
  },
  {
    id: '2',
    category: 'Injectables',
    treatment: 'Botox',
    provider: 'Ryan Kent, APRN',
    beforeImage: '/placeholder-before.jpg',
    afterImage: '/placeholder-after.jpg',
    description: 'Forehead and frown lines, 40 units',
    daysAfter: 14,
  },
  {
    id: '3',
    category: 'Facials',
    treatment: 'HydraFacial',
    provider: 'Danielle Glazier-Alcala',
    beforeImage: '/placeholder-before.jpg',
    afterImage: '/placeholder-after.jpg',
    description: 'Signature HydraFacial with LED add-on',
    daysAfter: 1,
  },
  {
    id: '4',
    category: 'Weight Loss',
    treatment: 'Semaglutide',
    provider: 'Ryan Kent, APRN',
    beforeImage: '/placeholder-before.jpg',
    afterImage: '/placeholder-after.jpg',
    description: '3 month progress, 28 lbs lost',
    daysAfter: 90,
  },
];

const CATEGORIES = ['All', 'Injectables', 'Facials', 'Weight Loss', 'Skin', 'Body'];

export default function ResultsGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedResult, setSelectedResult] = useState<ResultPhoto | null>(null);
  const [showSlider, setShowSlider] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  const filteredResults = selectedCategory === 'All'
    ? MOCK_RESULTS
    : MOCK_RESULTS.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Real Results, <span className="text-pink-500">Real People</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          See the transformations our clients have achieved at Hello Gorgeous Med Spa. 
          All photos are unedited and shared with consent.
        </p>
        <Link
          href="/book"
          className="inline-block px-8 py-4 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
        >
          Book Your Transformation
        </Link>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-pink-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {filteredResults.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">📸</span>
            <p className="text-gray-500">No results in this category yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                {/* Before/After Comparison */}
                <div 
                  className="relative aspect-square bg-gray-100"
                  onMouseEnter={() => setShowSlider(result.id)}
                  onMouseLeave={() => setShowSlider(null)}
                >
                  {/* Placeholder images - replace with actual photos */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">✨</span>
                      <p className="text-pink-800 font-medium">Before & After</p>
                      <p className="text-pink-600 text-sm">{result.treatment}</p>
                    </div>
                  </div>
                  
                  {/* Slider indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <span className="text-white font-medium">Click to view</span>
                  </div>

                  {/* Labels */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 rounded text-xs font-medium">
                    Before
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 bg-pink-500 text-white rounded text-xs font-medium">
                    After
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs font-medium">
                      {result.category}
                    </span>
                    <span className="text-xs text-gray-500">{result.daysAfter} days after</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{result.treatment}</h3>
                  <p className="text-sm text-gray-500 mt-1">{result.description}</p>
                  <p className="text-xs text-gray-400 mt-2">By {result.provider}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Transformation?</h2>
          <p className="text-pink-100 mb-8 text-lg">
            Book a free consultation and let's create your personalized treatment plan.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/book"
              className="px-8 py-3 bg-white text-pink-600 font-medium rounded-lg hover:bg-pink-50"
            >
              Book Free Consultation
            </Link>
            <a
              href="tel:6306366193"
              className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10"
            >
              Call (630) 636-6193
            </a>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-pink-500">3,400+</p>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-500">5.0★</p>
              <p className="text-gray-600">Google Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-500">10+</p>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-500">#1</p>
              <p className="text-gray-600">In Aurora-Oswego</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedResult.treatment}</h2>
                  <p className="text-gray-500">{selectedResult.description}</p>
                </div>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Before/After Slider */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-medium text-gray-600">Before Photo</p>
                    <p className="text-sm text-gray-500">(Placeholder)</p>
                  </div>
                  <span className="absolute top-3 left-3 px-3 py-1 bg-gray-800 text-white rounded font-medium">
                    Before
                  </span>
                </div>
                <div className="relative aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-medium text-pink-800">After Photo</p>
                    <p className="text-sm text-pink-600">(Placeholder)</p>
                  </div>
                  <span className="absolute top-3 right-3 px-3 py-1 bg-pink-500 text-white rounded font-medium">
                    After
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Treatment</p>
                  <p className="font-medium text-gray-900">{selectedResult.treatment}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{selectedResult.category}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-medium text-gray-900">{selectedResult.provider}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Photo Taken</p>
                  <p className="font-medium text-gray-900">{selectedResult.daysAfter} days after treatment</p>
                </div>
              </div>

              <Link
                href="/book"
                className="block w-full py-3 bg-pink-500 text-white font-medium rounded-lg text-center hover:bg-pink-600"
              >
                Book This Treatment
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
