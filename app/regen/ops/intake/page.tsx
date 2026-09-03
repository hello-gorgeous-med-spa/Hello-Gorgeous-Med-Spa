'use client';

import { useState } from 'react';

interface IntakeSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  goal: 'weight-loss' | 'hormones' | 'peptides' | 'sexual-health' | 'hair' | 'skincare' | 'vitamins';
  submitted: string;
  status: 'pending' | 'approved' | 'needs-info' | 'rejected';
  medicalInfo: {
    age: number;
    weight: string;
    height: string;
    conditions: string[];
    medications: string[];
    allergies: string[];
  };
  notes?: string;
}

const GOAL_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  'weight-loss': { label: 'Weight Loss', color: 'bg-teal-500/20 text-teal-300', icon: '⚖️' },
  'hormones': { label: 'Hormone Therapy', color: 'bg-purple-500/20 text-purple-300', icon: '🧬' },
  'peptides': { label: 'Peptides', color: 'bg-pink-500/20 text-pink-300', icon: '💉' },
  'sexual-health': { label: 'Sexual Health', color: 'bg-red-500/20 text-red-300', icon: '❤️' },
  'hair': { label: 'Hair Restoration', color: 'bg-amber-500/20 text-amber-300', icon: '💇' },
  'skincare': { label: 'Skincare', color: 'bg-blue-500/20 text-blue-300', icon: '✨' },
  'vitamins': { label: 'Vitamin Injectables', color: 'bg-green-500/20 text-green-300', icon: '💊' },
};

const STATUS_COLORS = {
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  approved: 'bg-green-500/20 text-green-300 border-green-500/30',
  'needs-info': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const SAMPLE_INTAKES: IntakeSubmission[] = [
  {
    id: 'INT-001',
    name: 'Emily Johnson',
    email: 'emily.j@email.com',
    phone: '(630) 555-0201',
    goal: 'weight-loss',
    submitted: '30 minutes ago',
    status: 'pending',
    medicalInfo: {
      age: 38,
      weight: '185 lbs',
      height: '5\'6"',
      conditions: ['High blood pressure (controlled)', 'Pre-diabetes'],
      medications: ['Lisinopril 10mg'],
      allergies: ['Penicillin'],
    },
  },
  {
    id: 'INT-002',
    name: 'Robert Chen',
    email: 'rchen@email.com',
    phone: '(630) 555-0202',
    goal: 'hormones',
    submitted: '2 hours ago',
    status: 'pending',
    medicalInfo: {
      age: 52,
      weight: '195 lbs',
      height: '5\'10"',
      conditions: ['Low testosterone (diagnosed)'],
      medications: ['None'],
      allergies: ['None'],
    },
  },
  {
    id: 'INT-003',
    name: 'Lisa Martinez',
    email: 'lisa.m@email.com',
    phone: '(630) 555-0203',
    goal: 'peptides',
    submitted: '4 hours ago',
    status: 'pending',
    medicalInfo: {
      age: 45,
      weight: '145 lbs',
      height: '5\'4"',
      conditions: ['None'],
      medications: ['Multivitamin'],
      allergies: ['Shellfish'],
    },
  },
  {
    id: 'INT-004',
    name: 'James Wilson',
    email: 'jwilson@email.com',
    phone: '(630) 555-0204',
    goal: 'weight-loss',
    submitted: '1 day ago',
    status: 'needs-info',
    medicalInfo: {
      age: 42,
      weight: '220 lbs',
      height: '5\'11"',
      conditions: ['Type 2 Diabetes'],
      medications: ['Metformin 500mg'],
      allergies: ['None'],
    },
    notes: 'Need A1C results from last 3 months',
  },
];

export default function IntakeQueuePage() {
  const [submissions, setSubmissions] = useState(SAMPLE_INTAKES);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'needs-info' | 'rejected'>('pending');
  const [selectedIntake, setSelectedIntake] = useState<IntakeSubmission | null>(null);
  const [noteText, setNoteText] = useState('');

  const filteredSubmissions = submissions.filter(
    (s) => filter === 'all' || s.status === filter
  );

  const updateStatus = (id: string, status: IntakeSubmission['status'], note?: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status, notes: note || s.notes } : s
      )
    );
    setSelectedIntake(null);
    setNoteText('');
  };

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Intake Queue</h1>
          <p className="text-white/50">
            {pendingCount} pending review{pendingCount !== 1 ? 's' : ''}
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-xl border border-pink-500/30">
            <span className="animate-pulse text-pink-400">●</span>
            <span className="text-pink-300 font-medium">{pendingCount} awaiting review</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 bg-white/5 rounded-xl p-1.5 overflow-x-auto">
        {[
          { id: 'all', label: 'All', count: submissions.length },
          { id: 'pending', label: 'Pending', count: submissions.filter((s) => s.status === 'pending').length },
          { id: 'needs-info', label: 'Needs Info', count: submissions.filter((s) => s.status === 'needs-info').length },
          { id: 'approved', label: 'Approved', count: submissions.filter((s) => s.status === 'approved').length },
          { id: 'rejected', label: 'Rejected', count: submissions.filter((s) => s.status === 'rejected').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              filter === tab.id
                ? 'bg-teal-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                filter === tab.id ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((intake) => (
          <div
            key={intake.id}
            className={`bg-white/5 rounded-2xl p-6 border transition-all cursor-pointer hover:bg-white/10 ${
              intake.status === 'pending' ? 'border-pink-500/30' : 'border-white/10'
            }`}
            onClick={() => setSelectedIntake(intake)}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {intake.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-semibold text-lg">{intake.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[intake.status]}`}>
                      {intake.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm">{intake.email} • {intake.phone}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${GOAL_LABELS[intake.goal].color}`}>
                      {GOAL_LABELS[intake.goal].icon} {GOAL_LABELS[intake.goal].label}
                    </span>
                    <span className="text-white/40 text-xs">Submitted {intake.submitted}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {intake.status === 'pending' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(intake.id, 'approved');
                      }}
                      className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-400 transition-colors"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIntake(intake);
                      }}
                      className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Review
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Medical Summary */}
            <div className="mt-4 p-4 bg-white/5 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-white/40">Age</p>
                  <p className="text-white">{intake.medicalInfo.age} years</p>
                </div>
                <div>
                  <p className="text-white/40">Weight</p>
                  <p className="text-white">{intake.medicalInfo.weight}</p>
                </div>
                <div>
                  <p className="text-white/40">Conditions</p>
                  <p className="text-white">{intake.medicalInfo.conditions.length || 'None'}</p>
                </div>
                <div>
                  <p className="text-white/40">Medications</p>
                  <p className="text-white">{intake.medicalInfo.medications.length || 'None'}</p>
                </div>
              </div>
            </div>

            {intake.notes && (
              <div className="mt-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-amber-300 text-sm">📝 {intake.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50 text-lg">No submissions in this queue</p>
          <p className="text-white/30 text-sm mt-1">Great job staying on top of intakes!</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedIntake && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedIntake(null)}
        >
          <div
            className="bg-slate-800 rounded-3xl p-8 max-w-3xl w-full border border-white/20 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{selectedIntake.name}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[selectedIntake.status]}`}>
                    {selectedIntake.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-white/50">{selectedIntake.email} • {selectedIntake.phone}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${GOAL_LABELS[selectedIntake.goal].color}`}>
                  {GOAL_LABELS[selectedIntake.goal].icon} {GOAL_LABELS[selectedIntake.goal].label}
                </span>
              </div>
              <button
                onClick={() => setSelectedIntake(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Medical Details */}
            <div className="space-y-4 mb-6">
              <h3 className="text-white font-semibold">Medical Information</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-white/40 text-sm">Age</p>
                  <p className="text-white text-xl font-semibold">{selectedIntake.medicalInfo.age}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-white/40 text-sm">Weight</p>
                  <p className="text-white text-xl font-semibold">{selectedIntake.medicalInfo.weight}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-white/40 text-sm">Height</p>
                  <p className="text-white text-xl font-semibold">{selectedIntake.medicalInfo.height}</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-white/40 text-sm mb-2">Medical Conditions</p>
                {selectedIntake.medicalInfo.conditions.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedIntake.medicalInfo.conditions.map((c, i) => (
                      <li key={i} className="text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        {c}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white/50">None reported</p>
                )}
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-white/40 text-sm mb-2">Current Medications</p>
                {selectedIntake.medicalInfo.medications.filter(m => m !== 'None').length > 0 ? (
                  <ul className="space-y-1">
                    {selectedIntake.medicalInfo.medications.filter(m => m !== 'None').map((m, i) => (
                      <li key={i} className="text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        {m}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white/50">None</p>
                )}
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-white/40 text-sm mb-2">Allergies</p>
                {selectedIntake.medicalInfo.allergies.filter(a => a !== 'None').length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedIntake.medicalInfo.allergies.filter(a => a !== 'None').map((a, i) => (
                      <span key={i} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                        ⚠️ {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/50">None reported</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Notes for Patient / Internal</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add notes (e.g., 'Need lab results', 'Schedule follow-up call')"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[100px]"
              />
            </div>

            {/* Actions */}
            {selectedIntake.status === 'pending' && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => updateStatus(selectedIntake.id, 'approved')}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-400 hover:to-green-500 transition-all"
                >
                  ✓ Approve & Create Patient
                </button>
                <button
                  onClick={() => updateStatus(selectedIntake.id, 'needs-info', noteText)}
                  className="flex-1 py-3 rounded-xl bg-blue-500/20 text-blue-300 font-semibold hover:bg-blue-500/30 transition-all border border-blue-500/30"
                >
                  📝 Request More Info
                </button>
                <button
                  onClick={() => updateStatus(selectedIntake.id, 'rejected', noteText)}
                  className="py-3 px-6 rounded-xl bg-red-500/20 text-red-300 font-semibold hover:bg-red-500/30 transition-all border border-red-500/30"
                >
                  ✕ Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
