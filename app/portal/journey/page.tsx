'use client';

// ============================================================
// TREATMENT JOURNEY TRACKER
// Track progress over time - Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';


interface TreatmentEntry {
  id: string;
  date: string;
  type: 'treatment' | 'photo' | 'note' | 'measurement';
  treatment?: string;
  provider?: string;
  notes?: string;
}

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white rounded ${className}`} />;
}

export default function JourneyPage() {
  const [entries, setEntries] = useState<TreatmentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Journey data - placeholder until client auth is implemented
  useEffect(() => {
    // Journey entries will load when logged in
    setEntries([]);
    setLoading(false);
  }, []);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'treatment': return '💉';
      case 'photo': return '📷';
      case 'note': return '📝';
      case 'measurement': return '📏';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">My Treatment Journey</h1>
          <p className="text-black">Track your progress over time</p>
        </div>
        <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors">
          + Add Note
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <span className="text-4xl">✨</span>
          <div>
            <h2 className="text-xl font-bold">Your Beauty Journey</h2>
            <p className="text-purple-100">
              Track treatments, add progress photos, and see how far you've come!
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-black overflow-hidden">
        <div className="px-6 py-4 border-b border-black">
          <h3 className="font-semibold text-black">Treatment Timeline</h3>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-5xl block mb-4">🌟</span>
            <h3 className="font-semibold text-black mb-2">Start Your Journey</h3>
            <p className="text-black mb-4">
              Your treatment history will appear here after your first appointment.
            </p>
            <Link
              href="/portal/book"
              className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-pink-600 transition-colors"
            >
              Book Your First Treatment
            </Link>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-white" />

            <div className="divide-y divide-gray-100">
              {entries.map((entry, index) => (
                <div key={entry.id} className="relative px-6 py-4 flex gap-4">
                  {/* Icon */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-xl flex-shrink-0">
                    {getTypeIcon(entry.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-black">{entry.treatment || 'Entry'}</h4>
                        <p className="text-sm text-black">
                          {entry.provider && `${entry.provider} • `}
                          {formatDate(entry.date)}
                        </p>
                        {entry.notes && (
                          <p className="text-sm text-black mt-2">{entry.notes}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                        entry.type === 'treatment' ? 'bg-pink-100 text-pink-700' :
                        entry.type === 'photo' ? 'bg-blue-100 text-blue-700' :
                        entry.type === 'note' ? 'bg-purple-100 text-purple-700' :
                        'bg-white text-black'
                      }`}>
                        {entry.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features Coming Soon */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-semibold text-black mb-4">Coming Soon</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex gap-3">
            <span className="text-2xl">📷</span>
            <div>
              <p className="font-medium text-black">Progress Photos</p>
              <p className="text-sm text-black">Upload before/after photos</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">📏</span>
            <div>
              <p className="font-medium text-black">Measurements</p>
              <p className="text-sm text-black">Track weight loss journey</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-medium text-black">Goals</p>
              <p className="text-sm text-black">Set and track beauty goals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
