'use client';

// ============================================================
// ADMIN MEDICATIONS PAGE
// Track medications administered - Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function AdminMedicationsPage() {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ week: 0, month: 0, botoxUnits: 0, fillerSyringes: 0 });

  // Fetch medications from database
  useEffect(() => {
    const fetchMedications = async () => {
      if (false) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('medications_administered')
          .select(`
            *,
            client:clients(first_name, last_name),
            provider:staff(first_name, last_name, title)
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data) {
          setMedications(data);
          // Calculate stats from data
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

          setStats({
            week: data.filter(m => new Date(m.created_at) >= weekAgo).length,
            month: data.filter(m => new Date(m.created_at) >= monthAgo).length,
            botoxUnits: data.filter(m => m.medication_type === 'neurotoxin')
              .reduce((sum, m) => sum + (m.units || 0), 0),
            fillerSyringes: data.filter(m => m.medication_type === 'filler')
              .reduce((sum, m) => sum + (m.syringes || 0), 0),
          });
        }
      } catch (err) {
        console.error('Error fetching medications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
        <p className="text-gray-500">Track medications administered to clients</p>
      </div>

      {/* Connection Status */}
      {false && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          Demo Mode - Connect Supabase to track medications
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">This Week</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{stats.week}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">This Month</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{stats.month}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Botox/Dysport</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-purple-600">{stats.botoxUnits} units</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Filler</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-pink-600">{stats.fillerSyringes} syringes</p>
          )}
        </div>
      </div>

      {/* Medications Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Administrations</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Date</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Client</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Medication</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Provider</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-3"><Skeleton className="w-24 h-4" /></td>
                  <td className="px-5 py-3"><Skeleton className="w-32 h-4" /></td>
                  <td className="px-5 py-3"><Skeleton className="w-28 h-4" /></td>
                  <td className="px-5 py-3"><Skeleton className="w-32 h-4" /></td>
                </tr>
              ))
            ) : medications.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-gray-500">
                  No medications recorded yet
                  <br />
                  <span className="text-sm">Medications are recorded when charting is completed</span>
                </td>
              </tr>
            ) : (
              medications.map((med) => (
                <tr key={med.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-900">{formatDate(med.created_at)}</td>
                  <td className="px-5 py-3 text-gray-900">
                    {med.client?.first_name} {med.client?.last_name}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">{med.medication_name}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {med.provider?.first_name} {med.provider?.last_name}
                    {med.provider?.title && `, ${med.provider.title}`}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Medication tracking is automatically recorded when charting is completed. 
          Complete charts to build medication administration records.
        </p>
      </div>
    </div>
  );
}
