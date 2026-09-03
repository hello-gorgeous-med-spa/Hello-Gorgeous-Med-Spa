'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  status: 'active' | 'pending' | 'paused';
  lastOrder: string;
  totalSpent: number;
  joinDate: string;
}

const SAMPLE_PATIENTS: Patient[] = [
  { id: 'P001', name: 'Sarah Mitchell', email: 'sarah.m@email.com', phone: '(630) 555-0101', program: 'Weight Loss', status: 'active', lastOrder: '2 days ago', totalSpent: 1247, joinDate: 'Aug 15, 2026' },
  { id: 'P002', name: 'Michael Rodriguez', email: 'mrodriguez@email.com', phone: '(630) 555-0102', program: 'Hormone Therapy', status: 'active', lastOrder: '1 week ago', totalSpent: 892, joinDate: 'Jul 28, 2026' },
  { id: 'P003', name: 'Jennifer Lee', email: 'jlee@email.com', phone: '(630) 555-0103', program: 'Weight Loss', status: 'pending', lastOrder: 'Never', totalSpent: 0, joinDate: 'Sep 1, 2026' },
  { id: 'P004', name: 'David Kim', email: 'dkim@email.com', phone: '(630) 555-0104', program: 'Peptides', status: 'active', lastOrder: '5 days ago', totalSpent: 520, joinDate: 'Aug 1, 2026' },
  { id: 'P005', name: 'Amanda Thompson', email: 'athompson@email.com', phone: '(630) 555-0105', program: 'Hair Restoration', status: 'paused', lastOrder: '3 weeks ago', totalSpent: 245, joinDate: 'Jun 15, 2026' },
  { id: 'P006', name: 'Robert Chen', email: 'rchen@email.com', phone: '(630) 555-0106', program: 'Weight Loss', status: 'active', lastOrder: '1 day ago', totalSpent: 1890, joinDate: 'May 20, 2026' },
  { id: 'P007', name: 'Emily Johnson', email: 'ejohnson@email.com', phone: '(630) 555-0107', program: 'Anti-Aging', status: 'active', lastOrder: '4 days ago', totalSpent: 680, joinDate: 'Aug 10, 2026' },
  { id: 'P008', name: 'Lisa Martinez', email: 'lmartinez@email.com', phone: '(630) 555-0108', program: 'Hormone Therapy', status: 'pending', lastOrder: 'Never', totalSpent: 0, joinDate: 'Sep 2, 2026' },
];

const STATUS_COLORS = {
  active: 'bg-green-500/20 text-green-300 border-green-500/30',
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  paused: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

const PROGRAM_COLORS: Record<string, string> = {
  'Weight Loss': 'bg-teal-500/20 text-teal-300',
  'Hormone Therapy': 'bg-purple-500/20 text-purple-300',
  'Peptides': 'bg-pink-500/20 text-pink-300',
  'Hair Restoration': 'bg-amber-500/20 text-amber-300',
  'Anti-Aging': 'bg-blue-500/20 text-blue-300',
};

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'paused'>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = SAMPLE_PATIENTS.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.email.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search);
    const matchesFilter = filter === 'all' || patient.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Patients</h1>
          <p className="text-white/50">{SAMPLE_PATIENTS.length} total patients</p>
        </div>
        <Link
          href="/regen/ops/patients/new"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-400 hover:to-teal-500 transition-all flex items-center gap-2"
        >
          <span>+</span> Add Patient
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full px-4 py-3 pl-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex gap-2 bg-white/5 rounded-xl p-1">
          {(['all', 'active', 'pending', 'paused'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                filter === status
                  ? 'bg-teal-500 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
          <p className="text-green-400 text-2xl font-bold">
            {SAMPLE_PATIENTS.filter((p) => p.status === 'active').length}
          </p>
          <p className="text-white/50 text-sm">Active</p>
        </div>
        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
          <p className="text-amber-400 text-2xl font-bold">
            {SAMPLE_PATIENTS.filter((p) => p.status === 'pending').length}
          </p>
          <p className="text-white/50 text-sm">Pending</p>
        </div>
        <div className="bg-slate-500/10 rounded-xl p-4 border border-slate-500/20">
          <p className="text-slate-400 text-2xl font-bold">
            {SAMPLE_PATIENTS.filter((p) => p.status === 'paused').length}
          </p>
          <p className="text-white/50 text-sm">Paused</p>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Program</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Last Order</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white/50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                        {patient.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-medium">{patient.name}</p>
                        <p className="text-white/50 text-sm">{patient.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${PROGRAM_COLORS[patient.program] || 'bg-white/10 text-white/70'}`}>
                      {patient.program}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[patient.status]}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/70 text-sm">{patient.lastOrder}</td>
                  <td className="px-6 py-4 text-white font-medium">${patient.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Message patient
                        }}
                        className="p-2 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                        title="Message"
                      >
                        💬
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // New order
                        }}
                        className="p-2 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-colors"
                        title="New Order"
                      >
                        📦
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50 text-lg">No patients found</p>
          <p className="text-white/30 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="bg-slate-800 rounded-3xl p-8 max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  {selectedPatient.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPatient.name}</h2>
                  <p className="text-white/50">{selectedPatient.email}</p>
                  <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[selectedPatient.status]}`}>
                    {selectedPatient.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-white/50 text-sm">Phone</p>
                <p className="text-white font-medium">{selectedPatient.phone}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-white/50 text-sm">Program</p>
                <p className="text-white font-medium">{selectedPatient.program}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-white/50 text-sm">Member Since</p>
                <p className="text-white font-medium">{selectedPatient.joinDate}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-white/50 text-sm">Total Spent</p>
                <p className="text-teal-400 font-bold text-xl">${selectedPatient.totalSpent.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-400 hover:to-teal-500 transition-all flex items-center justify-center gap-2">
                <span>📦</span> New Order
              </button>
              <button className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <span>💬</span> Message
              </button>
              <button className="flex-1 py-3 rounded-xl bg-pink-500/20 text-pink-300 font-semibold hover:bg-pink-500/30 transition-all flex items-center justify-center gap-2">
                <span>💰</span> Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
