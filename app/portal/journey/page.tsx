'use client';

// ============================================================
// TREATMENT JOURNEY TRACKER
// Track progress over time with photos and notes
// ============================================================

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface TreatmentEntry {
  id: string;
  date: string;
  type: 'treatment' | 'photo' | 'note' | 'measurement';
  treatment?: string;
  provider?: string;
  notes?: string;
  photoUrl?: string;
  measurements?: { label: string; value: string }[];
}

// Mock data
const MOCK_JOURNEY: TreatmentEntry[] = [
  {
    id: '1',
    date: '2026-01-15',
    type: 'treatment',
    treatment: 'Botox - Full Face',
    provider: 'Ryan Kent, APRN',
    notes: '40 units total: 20 forehead, 12 glabella, 8 crow\'s feet',
  },
  {
    id: '2',
    date: '2026-01-15',
    type: 'photo',
    photoUrl: '/placeholder.jpg',
    notes: 'Before treatment photo',
  },
  {
    id: '3',
    date: '2025-12-01',
    type: 'treatment',
    treatment: 'HydraFacial Signature',
    provider: 'Danielle Glazier-Alcala',
    notes: 'Added LED therapy. Skin is responding well.',
  },
  {
    id: '4',
    date: '2025-11-15',
    type: 'note',
    notes: 'Starting weight loss program with Semaglutide. Goal: 25 lbs in 6 months.',
  },
  {
    id: '5',
    date: '2025-11-15',
    type: 'measurement',
    measurements: [
      { label: 'Weight', value: '185 lbs' },
      { label: 'Waist', value: '36 inches' },
    ],
  },
  {
    id: '6',
    date: '2025-10-20',
    type: 'treatment',
    treatment: 'Lip Filler - Juvederm',
    provider: 'Ryan Kent, APRN',
    notes: '1 syringe for subtle enhancement',
  },
];

const MOCK_GOALS = [
  { id: 'g1', title: 'Maintain smooth forehead', status: 'active', nextAction: 'Botox touch-up', dueDate: '2026-04-15' },
  { id: 'g2', title: 'Lose 25 lbs', status: 'in_progress', progress: 40, nextAction: 'Weekly check-in', dueDate: '2026-05-15' },
  { id: 'g3', title: 'Clear skin routine', status: 'active', nextAction: 'Monthly HydraFacial', dueDate: '2026-02-01' },
];

export default function JourneyPage() {
  const [journey] = useState(MOCK_JOURNEY);
  const [goals] = useState(MOCK_GOALS);
  const [activeTab, setActiveTab] = useState<'timeline' | 'photos' | 'goals'>('timeline');

  const photos = useMemo(() => journey.filter(e => e.type === 'photo'), [journey]);

  const typeIcons: Record<string, string> = {
    treatment: '💉',
    photo: '📸',
    note: '📝',
    measurement: '📊',
  };

  const typeColors: Record<string, string> = {
    treatment: 'bg-pink-100 border-pink-500',
    photo: 'bg-blue-100 border-blue-500',
    note: 'bg-yellow-100 border-yellow-500',
    measurement: 'bg-green-100 border-green-500',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/portal" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
          ← Back to Portal
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">My Treatment Journey</h1>
        <p className="text-gray-500">Track your progress and see how far you've come</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-pink-500">{journey.filter(e => e.type === 'treatment').length}</p>
          <p className="text-sm text-gray-500">Treatments</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{photos.length}</p>
          <p className="text-sm text-gray-500">Progress Photos</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{goals.length}</p>
          <p className="text-sm text-gray-500">Active Goals</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 py-3 rounded-lg font-medium ${
            activeTab === 'timeline' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex-1 py-3 rounded-lg font-medium ${
            activeTab === 'photos' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Photos
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-3 rounded-lg font-medium ${
            activeTab === 'goals' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Goals
        </button>
      </div>

      {/* Timeline View */}
      {activeTab === 'timeline' && (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {journey.map((entry, index) => (
              <div key={entry.id} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-4 ${typeColors[entry.type]} bg-white z-10`}>
                  {typeIcons[entry.type]}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {entry.treatment && (
                        <h3 className="font-semibold text-gray-900">{entry.treatment}</h3>
                      )}
                      {entry.provider && (
                        <p className="text-sm text-gray-500">with {entry.provider}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {entry.notes && (
                    <p className="text-gray-600 text-sm">{entry.notes}</p>
                  )}

                  {entry.measurements && (
                    <div className="flex gap-4 mt-2">
                      {entry.measurements.map((m, i) => (
                        <div key={i} className="bg-gray-50 rounded px-3 py-1">
                          <span className="text-gray-500 text-sm">{m.label}:</span>{' '}
                          <span className="font-medium text-gray-900">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {entry.photoUrl && (
                    <div className="mt-3 w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-3xl">📸</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos View */}
      {activeTab === 'photos' && (
        <div>
          {photos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <span className="text-5xl mb-4 block">📸</span>
              <p className="text-gray-500 mb-4">No progress photos yet</p>
              <p className="text-sm text-gray-400">
                Ask your provider to take before/after photos at your next visit
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">📸</span>
                    <p className="text-sm text-pink-700">{new Date(photo.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Goals View */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-500">Next: {goal.nextAction}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  goal.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {goal.status === 'in_progress' ? 'In Progress' : 'Active'}
                </span>
              </div>

              {goal.progress !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Due: {new Date(goal.dueDate).toLocaleDateString()}
                </span>
                <Link href="/book" className="text-pink-500 hover:text-pink-600 font-medium">
                  Book Treatment →
                </Link>
              </div>
            </div>
          ))}

          <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-pink-500 hover:text-pink-500 transition-colors">
            + Add New Goal
          </button>
        </div>
      )}

      {/* Add Entry Button */}
      <div className="fixed bottom-24 right-6 lg:bottom-6">
        <button className="w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-pink-600">
          +
        </button>
      </div>
    </div>
  );
}
