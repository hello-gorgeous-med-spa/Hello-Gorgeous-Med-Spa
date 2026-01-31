'use client';

// ============================================================
// ADMIN CLIENT DETAIL PAGE
// Full client profile with history and actions
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

// Mock data
const MOCK_CLIENT = {
  id: 'c1',
  firstName: 'Jennifer',
  lastName: 'Martinez',
  email: 'jennifer.martinez@email.com',
  phone: '(630) 555-1234',
  dateOfBirth: '1985-03-15',
  gender: 'female',
  address: '123 Main Street',
  city: 'Oswego',
  state: 'IL',
  zip: '60543',
  emergencyContact: 'Michael Martinez',
  emergencyPhone: '(630) 555-9999',
  createdAt: '2024-06-15',
  referralSource: 'Instagram',
  membershipStatus: 'active',
  membershipType: 'Annual',
  membershipSince: '2025-01-01',
  freeServiceAvailable: true,
  
  // Medical
  allergies: ['Lidocaine'],
  medications: ['Synthroid 50mcg daily'],
  medicalConditions: ['Hypothyroidism'],
  
  // Stats
  totalVisits: 12,
  totalSpent: 4250,
  avgTicket: 354,
  lastVisit: '2026-01-31',
  
  tags: ['VIP', 'Botox Regular'],
};

const MOCK_APPOINTMENTS = [
  { id: 'a1', date: '2026-01-31', time: '9:00 AM', service: 'Botox - Full Face', provider: 'Ryan Kent, APRN', status: 'completed', amount: 450 },
  { id: 'a2', date: '2025-12-15', time: '10:00 AM', service: 'Lip Filler', provider: 'Ryan Kent, APRN', status: 'completed', amount: 650 },
  { id: 'a3', date: '2025-10-20', time: '2:00 PM', service: 'Botox - Full Face', provider: 'Ryan Kent, APRN', status: 'completed', amount: 400 },
  { id: 'a4', date: '2025-08-15', time: '11:00 AM', service: 'Glass Glow Facial', provider: 'Staff', status: 'completed', amount: 175 },
];

const MOCK_PAYMENTS = [
  { id: 'p1', date: '2026-01-31', amount: 450, method: 'Credit Card', status: 'paid', service: 'Botox - Full Face' },
  { id: 'p2', date: '2025-12-15', amount: 650, method: 'Credit Card', status: 'paid', service: 'Lip Filler' },
  { id: 'p3', date: '2025-10-20', amount: 400, method: 'Credit Card', status: 'paid', service: 'Botox - Full Face' },
];

const MOCK_CONSENTS = [
  { id: 'con1', name: 'General Treatment Consent', status: 'valid', signedAt: '2025-01-01' },
  { id: 'con2', name: 'Neurotoxin Consent', status: 'valid', signedAt: '2025-01-01' },
  { id: 'con3', name: 'Dermal Filler Consent', status: 'valid', signedAt: '2025-12-15' },
  { id: 'con4', name: 'HIPAA Privacy Notice', status: 'valid', signedAt: '2025-01-01' },
];

export default function AdminClientDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'payments' | 'clinical' | 'documents'>('overview');
  const client = MOCK_CLIENT;
  const age = new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/clients"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Clients
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {client.firstName[0]}{client.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {client.firstName} {client.lastName}
                </h1>
                {client.membershipStatus === 'active' && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    💎 {client.membershipType} Member
                  </span>
                )}
              </div>
              <p className="text-gray-500">
                {age} years old • Client since {client.createdAt} • {client.totalVisits} visits
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {client.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/appointments/new?client=${client.id}`}
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            Book Appointment
          </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Edit
          </button>
          <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            📞
          </button>
          <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            ✉️
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {client.allergies.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">⚠️</span>
            <span className="font-semibold">Allergies:</span>
            <span>{client.allergies.join(', ')}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Visits</p>
          <p className="text-2xl font-bold text-gray-900">{client.totalVisits}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900">${client.totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Avg Ticket</p>
          <p className="text-2xl font-bold text-gray-900">${client.avgTicket}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Last Visit</p>
          <p className="text-2xl font-bold text-gray-900">{client.lastVisit}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'appointments', label: 'Appointments' },
            { id: 'payments', label: 'Payments' },
            { id: 'clinical', label: 'Clinical' },
            { id: 'documents', label: 'Documents' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Email</p>
                <p className="text-gray-900">{client.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="text-gray-900">{client.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Address</p>
                <p className="text-gray-900">
                  {client.address}<br />
                  {client.city}, {client.state} {client.zip}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="text-gray-900">{client.dateOfBirth} ({age} years old)</p>
              </div>
              <div>
                <p className="text-gray-500">Emergency Contact</p>
                <p className="text-gray-900">{client.emergencyContact}</p>
                <p className="text-gray-500">{client.emergencyPhone}</p>
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recent Appointments</h3>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {MOCK_APPOINTMENTS.slice(0, 3).map((apt) => (
                <div key={apt.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{apt.service}</p>
                    <p className="text-sm text-gray-900">${apt.amount}</p>
                  </div>
                  <p className="text-sm text-gray-500">{apt.date} • {apt.provider}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Membership & Consents */}
          <div className="space-y-6">
            {/* Membership */}
            {client.membershipStatus === 'active' && (
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💎</span>
                  <h3 className="font-semibold">VIP Member</h3>
                </div>
                <p className="text-purple-100 text-sm mb-3">
                  {client.membershipType} since {client.membershipSince}
                </p>
                {client.freeServiceAvailable && (
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm font-medium">Free $75 Service Available</p>
                  </div>
                )}
              </div>
            )}

            {/* Consents */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Consents</h3>
              <div className="space-y-2">
                {MOCK_CONSENTS.map((consent) => (
                  <div key={consent.id} className="flex items-center justify-between py-2">
                    <p className="text-sm text-gray-900">{consent.name}</p>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      ✓ Valid
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Date</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Service</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Provider</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-right px-5 py-3 text-sm font-semibold text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_APPOINTMENTS.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{apt.date}</p>
                    <p className="text-sm text-gray-500">{apt.time}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-900">{apt.service}</td>
                  <td className="px-5 py-3 text-gray-600">{apt.provider}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">${apt.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Date</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Service</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Method</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-right px-5 py-3 text-sm font-semibold text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PAYMENTS.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{payment.date}</td>
                  <td className="px-5 py-3 text-gray-900">{payment.service}</td>
                  <td className="px-5 py-3 text-gray-600">{payment.method}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-green-600">+${payment.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'clinical' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medical Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Medical Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Allergies</p>
                <div className="flex flex-wrap gap-1">
                  {client.allergies.map((allergy) => (
                    <span key={allergy} className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Medications</p>
                <ul className="text-sm text-gray-900 space-y-1">
                  {client.medications.map((med) => (
                    <li key={med}>• {med}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Medical Conditions</p>
                <ul className="text-sm text-gray-900 space-y-1">
                  {client.medicalConditions.map((condition) => (
                    <li key={condition}>• {condition}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Chart History */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Chart History</h3>
              <Link
                href={`/provider/chart/new?client=${client.id}`}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                + New Chart
              </Link>
            </div>
            <div className="space-y-3">
              {MOCK_APPOINTMENTS.filter((a) => a.status === 'completed').slice(0, 4).map((apt) => (
                <Link
                  key={apt.id}
                  href={`/provider/charts/${apt.id}`}
                  className="block border-b border-gray-100 pb-3 last:border-0 hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{apt.service}</p>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      ✓ Signed
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{apt.date} • {apt.provider}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Documents & Forms</h3>
            <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors">
              + Upload Document
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Signed Consents */}
            {MOCK_CONSENTS.map((consent) => (
              <div key={consent.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{consent.name}</p>
                    <p className="text-xs text-gray-500">Signed {consent.signedAt}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Intake Form */}
            <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Medical Intake Form</p>
                  <p className="text-xs text-gray-500">Completed 2025-01-01</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
