'use client';

// ============================================================
// CLIENT PORTAL - TREATMENT HISTORY
// View past treatments and records
// ============================================================

import Link from 'next/link';

const TREATMENT_HISTORY = [
  {
    id: '1',
    date: '2026-01-10',
    service: 'Botox - Forehead & Glabella',
    provider: 'Ryan Kent, RN',
    units: '30 units',
    notes: 'Patient tolerated well. Follow up in 2 weeks.',
    amount: 390,
  },
  {
    id: '2',
    date: '2025-12-15',
    service: 'Initial Consultation',
    provider: 'Danielle Glazier-Alcala',
    units: null,
    notes: 'Discussed treatment goals. Recommended Botox for forehead lines.',
    amount: 0,
  },
  {
    id: '3',
    date: '2025-11-20',
    service: 'Lip Filler - Juvederm',
    provider: 'Ryan Kent, RN',
    units: '1 syringe',
    notes: 'Natural enhancement. Patient happy with results.',
    amount: 650,
  },
];

export default function PortalHistoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Treatment History</h1>
        <p className="text-gray-500">Your complete treatment record</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-pink-500">{TREATMENT_HISTORY.length}</p>
          <p className="text-sm text-gray-500">Total Visits</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-pink-500">30</p>
          <p className="text-sm text-gray-500">Botox Units (YTD)</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-pink-500">$1,040</p>
          <p className="text-sm text-gray-500">Total Spent</p>
        </div>
      </div>

      {/* Treatment Timeline */}
      <div className="space-y-4">
        {TREATMENT_HISTORY.map((treatment, index) => (
          <div
            key={treatment.id}
            className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-400">
                    {new Date(treatment.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  {index === 0 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Most Recent
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{treatment.service}</h3>
                <p className="text-gray-500 text-sm">{treatment.provider}</p>
                {treatment.units && (
                  <p className="text-sm text-pink-500 mt-1">{treatment.units}</p>
                )}
                {treatment.notes && (
                  <p className="text-sm text-gray-600 mt-3 italic">"{treatment.notes}"</p>
                )}
              </div>
              <div className="text-right">
                {treatment.amount > 0 ? (
                  <p className="font-semibold text-gray-900">${treatment.amount}</p>
                ) : (
                  <span className="text-sm text-green-600">Complimentary</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Records */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <h3 className="font-semibold text-blue-900 mb-2">Need Your Records?</h3>
        <p className="text-sm text-blue-800 mb-4">
          You can request a copy of your complete medical records at any time.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
          Request Records
        </button>
      </div>
    </div>
  );
}
