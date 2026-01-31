'use client';

// ============================================================
// PROVIDER SCHEDULE PAGE
// View and manage provider's daily schedule
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

const TODAY_APPOINTMENTS = [
  {
    id: '1',
    time: '9:00 AM',
    endTime: '9:30 AM',
    client: 'Jennifer Martinez',
    service: 'Botox - Forehead',
    status: 'checked-in',
    notes: 'Returning client, 20 units last time',
  },
  {
    id: '2',
    time: '10:00 AM',
    endTime: '10:45 AM',
    client: 'Sarah Johnson',
    service: 'Lip Filler - Juvederm',
    status: 'confirmed',
    notes: 'First time filler',
  },
  {
    id: '3',
    time: '11:30 AM',
    endTime: '12:00 PM',
    client: 'Emily Chen',
    service: 'Botox Touch-up',
    status: 'confirmed',
    notes: null,
  },
  {
    id: '4',
    time: '1:00 PM',
    endTime: '1:30 PM',
    client: null,
    service: 'LUNCH BREAK',
    status: 'blocked',
    notes: null,
  },
  {
    id: '5',
    time: '2:00 PM',
    endTime: '3:00 PM',
    client: 'Amanda Wilson',
    service: 'Full Face Consultation',
    status: 'pending',
    notes: 'New client, referred by Jennifer M.',
  },
  {
    id: '6',
    time: '3:30 PM',
    endTime: '4:15 PM',
    client: 'Lisa Thompson',
    service: 'Cheek Filler',
    status: 'confirmed',
    notes: 'Voluma, 2 syringes planned',
  },
];

export default function ProviderSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const statusColors: Record<string, string> = {
    'checked-in': 'bg-green-100 text-green-700 border-green-200',
    'confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
    'pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'blocked': 'bg-gray-100 text-gray-500 border-gray-200',
    'completed': 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-500">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-lg"
          />
          <Link
            href="/provider/chart/new"
            className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600"
          >
            + New Chart
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Today's Patients</p>
          <p className="text-2xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Checked In</p>
          <p className="text-2xl font-bold text-green-600">1</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-purple-600">0</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Next Available</p>
          <p className="text-2xl font-bold text-gray-900">4:30 PM</p>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Today's Appointments</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {TODAY_APPOINTMENTS.map((apt) => (
            <div
              key={apt.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                apt.status === 'blocked' ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Time */}
                <div className="w-24 flex-shrink-0">
                  <p className="font-semibold text-gray-900">{apt.time}</p>
                  <p className="text-sm text-gray-400">{apt.endTime}</p>
                </div>

                {/* Details */}
                <div className="flex-1">
                  {apt.client ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{apt.client}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[apt.status]}`}>
                          {apt.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600">{apt.service}</p>
                      {apt.notes && (
                        <p className="text-sm text-gray-400 mt-1">📝 {apt.notes}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400 italic">{apt.service}</p>
                  )}
                </div>

                {/* Actions */}
                {apt.client && (
                  <div className="flex items-center gap-2">
                    {apt.status === 'checked-in' && (
                      <Link
                        href={`/provider/chart/new?client=${apt.id}`}
                        className="px-3 py-1.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600"
                      >
                        Start Chart
                      </Link>
                    )}
                    {apt.status === 'confirmed' && (
                      <button className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600">
                        Check In
                      </button>
                    )}
                    <Link
                      href={`/provider/clients/${apt.id}`}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-sm rounded-lg"
                    >
                      View Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
