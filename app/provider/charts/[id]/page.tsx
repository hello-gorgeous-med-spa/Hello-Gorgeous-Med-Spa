'use client';

// ============================================================
// VIEW CHART PAGE
// Display a specific patient chart
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

const MOCK_CHART = {
  id: '1',
  clientId: 'c1',
  clientName: 'Jennifer Martinez',
  clientDOB: '1985-03-15',
  appointmentId: 'apt1',
  date: '2026-01-30',
  time: '10:00 AM',
  provider: 'Ryan Kent, RN',
  service: 'Botox - Full Face',
  status: 'signed',
  
  // SOAP Notes
  subjective: 'Patient presents for routine Botox treatment. Reports satisfaction with previous results. No new concerns or symptoms. Desires treatment of forehead, glabella, and crow\'s feet areas.',
  objective: 'Skin in good condition. No active lesions or infections at treatment sites. Moderate dynamic rhytids noted in forehead, glabella, and lateral orbital areas.',
  assessment: 'Appropriate candidate for neurotoxin treatment. No contraindications identified.',
  plan: 'Botox treatment as outlined. Follow up in 2 weeks for assessment. Patient to avoid strenuous activity for 24 hours.',
  
  // Treatment Details
  treatment: {
    product: 'Botox (onabotulinumtoxinA)',
    lot: 'C3456B',
    expiration: '2026-06-15',
    totalUnits: 28,
    areas: [
      { name: 'Forehead', units: 10 },
      { name: 'Glabella', units: 12 },
      { name: 'Crow\'s Feet', units: 6 },
    ],
  },
  
  // Vitals (if taken)
  vitals: {
    bp: '118/76',
    pulse: '72',
    temp: null,
  },
  
  // Photos
  photos: {
    before: [],
    after: [],
  },
  
  // Internal Notes
  internalNotes: 'Patient is VIP member. Very pleasant. Prefers ice before injections.',
  
  // Signature
  signedBy: 'Ryan Kent, RN',
  signedAt: '2026-01-30 10:45 AM',
};

export default function ViewChartPage({ params }: { params: { id: string } }) {
  const [chart] = useState(MOCK_CHART);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/provider/charts"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Charts
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Patient Chart</h1>
          <p className="text-gray-500">
            {chart.clientName} • {new Date(chart.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {chart.status === 'signed' ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              ✓ Signed
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
              Pending Signature
            </span>
          )}
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Print
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Export PDF
          </button>
        </div>
      </div>

      {/* Chart Content */}
      <div className="space-y-6">
        {/* Patient Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Patient Information</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Patient Name</p>
              <p className="font-medium">{chart.clientName}</p>
            </div>
            <div>
              <p className="text-gray-500">Date of Birth</p>
              <p className="font-medium">{new Date(chart.clientDOB).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Provider</p>
              <p className="font-medium">{chart.provider}</p>
            </div>
            <div>
              <p className="text-gray-500">Service</p>
              <p className="font-medium">{chart.service}</p>
            </div>
            <div>
              <p className="text-gray-500">Date of Service</p>
              <p className="font-medium">{chart.date} at {chart.time}</p>
            </div>
            {chart.vitals.bp && (
              <div>
                <p className="text-gray-500">Vitals</p>
                <p className="font-medium">BP: {chart.vitals.bp} | P: {chart.vitals.pulse}</p>
              </div>
            )}
          </div>
        </div>

        {/* SOAP Notes */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Clinical Notes (SOAP)</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-indigo-600 mb-1">Subjective</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{chart.subjective}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-indigo-600 mb-1">Objective</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{chart.objective}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-indigo-600 mb-1">Assessment</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{chart.assessment}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-indigo-600 mb-1">Plan</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{chart.plan}</p>
            </div>
          </div>
        </div>

        {/* Treatment Details */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Treatment Details</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <p className="text-gray-500">Product</p>
              <p className="font-medium">{chart.treatment.product}</p>
            </div>
            <div>
              <p className="text-gray-500">Lot Number</p>
              <p className="font-medium">{chart.treatment.lot}</p>
            </div>
            <div>
              <p className="text-gray-500">Expiration</p>
              <p className="font-medium">{chart.treatment.expiration}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Injection Sites</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Area</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-600">Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chart.treatment.areas.map((area, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{area.name}</td>
                    <td className="px-4 py-2 text-right">{area.units}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-2">Total</td>
                  <td className="px-4 py-2 text-right">{chart.treatment.totalUnits} units</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Internal Notes */}
        {chart.internalNotes && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="font-semibold text-amber-900 mb-2">Internal Notes (Staff Only)</h2>
            <p className="text-amber-800 text-sm">{chart.internalNotes}</p>
          </div>
        )}

        {/* Signature */}
        {chart.status === 'signed' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Electronically Signed</p>
                <p className="font-semibold text-green-900">{chart.signedBy}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">Signed At</p>
                <p className="font-medium text-green-900">{chart.signedAt}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4">
          <Link
            href={`/provider/clients/${chart.clientId}`}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            View Patient Profile →
          </Link>
          <div className="flex gap-3">
            <Link
              href={`/provider/chart/new?client=${chart.clientId}`}
              className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600"
            >
              New Chart for Patient
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
