'use client';

// ============================================================
// PROVIDER CHARTING - Quick Access to Clinical Notes
// Redirects to admin charting with provider-friendly context
// ============================================================

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ProviderChartingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment');
  const clientId = searchParams.get('client');

  // If appointment or client specified, redirect to admin charting
  useEffect(() => {
    if (appointmentId) {
      router.push(`/admin/charting?appointment=${appointmentId}`);
    } else if (clientId) {
      router.push(`/admin/charting?client=${clientId}`);
    }
  }, [appointmentId, clientId, router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clinical Charting</h1>
        <p className="text-gray-500">Document patient visits and treatments</p>
      </div>

      {/* Quick Start Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/admin/charting"
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center group-hover:bg-pink-200 transition-colors">
              <span className="text-3xl">📝</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">New Chart Note</h2>
              <p className="text-gray-500">Start documenting a visit</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Create a new SOAP note with injection details, photos, and treatment documentation.
          </p>
        </Link>

        <Link
          href="/provider/patients"
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <span className="text-3xl">🔍</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Find Patient</h2>
              <p className="text-gray-500">Look up existing charts</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Search for a patient to view their history, previous notes, and photos.
          </p>
        </Link>
      </div>

      {/* Chart Templates */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Quick Templates</h2>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Botox/Dysport', icon: '💉', color: 'bg-pink-50 hover:bg-pink-100' },
            { name: 'Dermal Filler', icon: '💋', color: 'bg-rose-50 hover:bg-rose-100' },
            { name: 'IV Therapy', icon: '💧', color: 'bg-blue-50 hover:bg-blue-100' },
            { name: 'Weight Loss', icon: '⚡', color: 'bg-green-50 hover:bg-green-100' },
            { name: 'Facial', icon: '✨', color: 'bg-purple-50 hover:bg-purple-100' },
            { name: 'Laser', icon: '🔆', color: 'bg-amber-50 hover:bg-amber-100' },
            { name: 'PRP', icon: '🩸', color: 'bg-red-50 hover:bg-red-100' },
            { name: 'Consultation', icon: '🗣️', color: 'bg-gray-50 hover:bg-gray-100' },
          ].map((template) => (
            <Link
              key={template.name}
              href={`/admin/charting?template=${template.name.toLowerCase().replace(/\//g, '-')}`}
              className={`p-4 rounded-xl ${template.color} transition-colors text-center`}
            >
              <span className="text-2xl block mb-2">{template.icon}</span>
              <span className="text-sm font-medium text-gray-700">{template.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Charts */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Charts</h2>
          <Link href="/admin/charts" className="text-sm text-pink-600 hover:text-pink-700">
            View All →
          </Link>
        </div>
        <div className="p-8 text-center text-gray-500">
          <p>Your recent chart notes will appear here.</p>
          <p className="text-sm mt-1">Start a new chart or search for a patient above.</p>
        </div>
      </div>
    </div>
  );
}
