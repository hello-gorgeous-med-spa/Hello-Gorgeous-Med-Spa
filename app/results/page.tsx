'use client';

// ============================================================
// RESULTS GALLERY
// Showcase before/after photos to build trust
// Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

interface ResultPhoto {
  id: string;
  category: string;
  treatment: string;
  provider: string;
  before_image: string;
  after_image: string;
  description: string;
  days_after: number;
}

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function ResultsPage() {
  const [results, setResults] = useState<ResultPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResult, setSelectedResult] = useState<ResultPhoto | null>(null);

  // Fetch results from database
  useEffect(() => {
    const fetchResults = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('results_gallery')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setResults(data);
        }
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const categories = ['all', ...Array.from(new Set(results.map(r => r.category)))];
  const filteredResults = selectedCategory === 'all' 
    ? results 
    : results.filter(r => r.category === selectedCategory);

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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real Results
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See the transformations achieved by our expert team.
            Real clients, real results.
          </p>
        </div>

        {/* Connection Status */}
        {!isSupabaseConfigured() && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <p className="text-amber-800">
              Connect your database to display results gallery.
              Schedule a consultation to see before/after photos in person.
            </p>
          </div>
        )}

        {/* Category Filter */}
        {results.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-colors capitalize ${
                  selectedCategory === cat
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">📸</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Gallery Coming Soon</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              We're building our gallery of amazing transformations.
              Schedule a consultation to see before/after photos in person!
            </p>
            <Link
              href="/portal/book?service=consultation"
              className="inline-block px-6 py-3 bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600"
            >
              Book Free Consultation
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map(result => (
              <div 
                key={result.id} 
                onClick={() => setSelectedResult(result)}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="grid grid-cols-2">
                  <div className="aspect-square bg-gray-100 relative">
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">Before</div>
                    {/* Before image */}
                  </div>
                  <div className="aspect-square bg-gray-100 relative">
                    <div className="absolute top-2 left-2 px-2 py-1 bg-pink-500 text-white text-xs rounded">After</div>
                    {/* After image */}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{result.treatment}</h3>
                  <p className="text-sm text-gray-500">{result.provider}</p>
                  <p className="text-xs text-gray-400 mt-1">{result.days_after} days after treatment</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <span className="text-4xl block mb-3">👩‍⚕️</span>
            <h3 className="font-semibold text-gray-900 mb-2">Expert Providers</h3>
            <p className="text-gray-600 text-sm">Board-certified nurse practitioners with years of aesthetic experience</p>
          </div>
          <div className="p-6">
            <span className="text-4xl block mb-3">✅</span>
            <h3 className="font-semibold text-gray-900 mb-2">Natural Results</h3>
            <p className="text-gray-600 text-sm">Subtle enhancements that look naturally beautiful</p>
          </div>
          <div className="p-6">
            <span className="text-4xl block mb-3">💯</span>
            <h3 className="font-semibold text-gray-900 mb-2">Satisfaction Guaranteed</h3>
            <p className="text-gray-600 text-sm">Free touch-ups and comprehensive aftercare support</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Transformation?</h2>
          <p className="text-pink-100 mb-6 max-w-lg mx-auto">
            Schedule a free consultation to discuss your goals and see what's possible.
          </p>
          <Link
            href="/portal/book"
            className="inline-block px-8 py-3 bg-white text-pink-600 font-bold rounded-full hover:bg-pink-50 transition-colors"
          >
            Book Free Consultation
          </Link>
        </div>
      </main>

      {/* Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">{selectedResult.treatment}</h2>
              <button 
                onClick={() => setSelectedResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4 p-4">
              <div className="aspect-square bg-gray-100 rounded-lg relative">
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 text-white text-sm rounded">Before</div>
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg relative">
                <div className="absolute top-4 left-4 px-3 py-1 bg-pink-500 text-white text-sm rounded">After</div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100">
              <p className="text-gray-600 mb-4">{selectedResult.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span>{selectedResult.provider}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedResult.days_after} days after</span>
                </div>
                <Link
                  href="/portal/book"
                  className="px-6 py-2 bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600"
                >
                  Book This Treatment
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
