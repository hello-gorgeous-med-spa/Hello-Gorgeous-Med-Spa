'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface IntakeSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  goal: string;
  created_at: string;
  status: string;
  medical_history: {
    age?: number;
    weight?: string;
    height?: string;
    conditions?: string[];
    medications?: string[];
    allergies?: string[];
  };
  review_notes?: string;
  amount_paid?: number;
}

const GOAL_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  'weight-loss': { label: 'Weight Loss', color: 'bg-teal-500/20 text-teal-300', icon: '⚖️' },
  'glp1': { label: 'Weight Loss (GLP-1)', color: 'bg-teal-500/20 text-teal-300', icon: '⚖️' },
  'hormones': { label: 'Hormone Therapy', color: 'bg-purple-500/20 text-purple-300', icon: '🧬' },
  'hrt': { label: 'Hormone Therapy', color: 'bg-purple-500/20 text-purple-300', icon: '🧬' },
  'peptides': { label: 'Peptides', color: 'bg-pink-500/20 text-pink-300', icon: '💉' },
  'sexual-health': { label: 'Sexual Health', color: 'bg-red-500/20 text-red-300', icon: '❤️' },
  'hair': { label: 'Hair Restoration', color: 'bg-amber-500/20 text-amber-300', icon: '💇' },
  'skincare': { label: 'Skincare', color: 'bg-blue-500/20 text-blue-300', icon: '✨' },
  'vitamins': { label: 'Vitamin Injectables', color: 'bg-green-500/20 text-green-300', icon: '💊' },
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  approved: 'bg-green-500/20 text-green-300 border-green-500/30',
  under_review: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  needs_info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  needs_labs: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  needs_video: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  declined: 'bg-red-500/20 text-red-300 border-red-500/30',
  awaiting_payment: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export default function IntakeQueuePage() {
  const [submissions, setSubmissions] = useState<IntakeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('pending');
  const [selectedIntake, setSelectedIntake] = useState<IntakeSubmission | null>(null);
  const [noteText, setNoteText] = useState('');
  const [updating, setUpdating] = useState(false);

  const supabase = createClientComponentClient();

  // Fetch intakes from database
  useEffect(() => {
    fetchIntakes();
  }, []);

  async function fetchIntakes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('regen_intakes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching intakes:', error);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  }

  const filteredSubmissions = submissions.filter(
    (s) => filter === 'all' || s.status === filter
  );

  async function updateStatus(id: string, status: string, note?: string) {
    setUpdating(true);
    
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    
    if (note) {
      updateData.review_notes = note;
    }

    const { error } = await supabase
      .from('regen_intakes')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating intake:', error);
      alert('Failed to update status');
    } else {
      // Refresh the list
      await fetchIntakes();
      setSelectedIntake(null);
      setNoteText('');
    }
    setUpdating(false);
  }

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        <span className="ml-3 text-white/50">Loading intakes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Intake Queue</h1>
          <p className="text-white/50">
            {submissions.length} total • {pendingCount} pending review
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchIntakes}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            ↻ Refresh
          </button>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-xl border border-pink-500/30">
              <span className="animate-pulse text-pink-400">●</span>
              <span className="text-pink-300 font-medium">{pendingCount} awaiting review</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 bg-white/5 rounded-xl p-1.5 overflow-x-auto">
        {[
          { id: 'all', label: 'All' },
          { id: 'pending', label: 'Pending' },
          { id: 'needs_labs', label: 'Needs Labs' },
          { id: 'needs_video', label: 'Needs Video' },
          { id: 'approved', label: 'Approved' },
          { id: 'declined', label: 'Declined' },
        ].map((tab) => {
          const count = tab.id === 'all' 
            ? submissions.length 
            : submissions.filter((s) => s.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                filter === tab.id
                  ? 'bg-teal-500 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  filter === tab.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((intake) => {
          const goalInfo = GOAL_LABELS[intake.goal] || { label: intake.goal, color: 'bg-gray-500/20 text-gray-300', icon: '📋' };
          const statusColor = STATUS_COLORS[intake.status] || STATUS_COLORS.pending;
          
          return (
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
                    {intake.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold text-lg">{intake.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                        {intake.status.replace(/_/g, ' ')}
                      </span>
                      {intake.amount_paid && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                          💳 ${intake.amount_paid}
                        </span>
                      )}
                    </div>
                    <p className="text-white/50 text-sm">{intake.email} • {intake.phone || 'No phone'}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${goalInfo.color}`}>
                        {goalInfo.icon} {goalInfo.label}
                      </span>
                      <span className="text-white/40 text-xs">Submitted {timeAgo(intake.created_at)}</span>
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
              {intake.medical_history && (
                <div className="mt-4 p-4 bg-white/5 rounded-xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-white/40">Age</p>
                      <p className="text-white">{intake.medical_history.age || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-white/40">Weight</p>
                      <p className="text-white">{intake.medical_history.weight || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-white/40">Conditions</p>
                      <p className="text-white">{intake.medical_history.conditions?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-white/40">Medications</p>
                      <p className="text-white">{intake.medical_history.medications?.length || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {intake.review_notes && (
                <div className="mt-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <p className="text-amber-300 text-sm">📝 {intake.review_notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12 bg-white/5 rounded-2xl">
          <p className="text-white/50 text-lg">No intakes in this queue</p>
          <p className="text-white/30 text-sm mt-1">
            {filter === 'pending' ? 'No pending reviews - you\'re all caught up!' : 'No matching intakes found'}
          </p>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[selectedIntake.status] || STATUS_COLORS.pending}`}>
                    {selectedIntake.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-white/50">{selectedIntake.email} • {selectedIntake.phone || 'No phone'}</p>
                {selectedIntake.amount_paid && (
                  <p className="text-green-400 mt-1">💳 Paid: ${selectedIntake.amount_paid}</p>
                )}
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
            {selectedIntake.medical_history && (
              <div className="space-y-4 mb-6">
                <h3 className="text-white font-semibold">Medical Information</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-white/40 text-sm">Age</p>
                    <p className="text-white text-xl font-semibold">{selectedIntake.medical_history.age || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-white/40 text-sm">Weight</p>
                    <p className="text-white text-xl font-semibold">{selectedIntake.medical_history.weight || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-white/40 text-sm">Height</p>
                    <p className="text-white text-xl font-semibold">{selectedIntake.medical_history.height || 'N/A'}</p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-white/40 text-sm mb-2">Medical Conditions</p>
                  {selectedIntake.medical_history.conditions?.length ? (
                    <ul className="space-y-1">
                      {selectedIntake.medical_history.conditions.map((c, i) => (
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
                  {selectedIntake.medical_history.medications?.length ? (
                    <ul className="space-y-1">
                      {selectedIntake.medical_history.medications.map((m, i) => (
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
                  {selectedIntake.medical_history.allergies?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedIntake.medical_history.allergies.map((a, i) => (
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
            )}

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
                  disabled={updating}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-400 hover:to-green-500 transition-all disabled:opacity-50"
                >
                  {updating ? 'Saving...' : '✓ Approve & Send to Pharmacy'}
                </button>
                <button
                  onClick={() => updateStatus(selectedIntake.id, 'needs_labs', noteText)}
                  disabled={updating}
                  className="flex-1 py-3 rounded-xl bg-purple-500/20 text-purple-300 font-semibold hover:bg-purple-500/30 transition-all border border-purple-500/30 disabled:opacity-50"
                >
                  🧪 Request Labs
                </button>
                <button
                  onClick={() => updateStatus(selectedIntake.id, 'needs_video', noteText)}
                  disabled={updating}
                  className="py-3 px-6 rounded-xl bg-cyan-500/20 text-cyan-300 font-semibold hover:bg-cyan-500/30 transition-all border border-cyan-500/30 disabled:opacity-50"
                >
                  📹 Video Visit
                </button>
                <button
                  onClick={() => updateStatus(selectedIntake.id, 'declined', noteText)}
                  disabled={updating}
                  className="py-3 px-6 rounded-xl bg-red-500/20 text-red-300 font-semibold hover:bg-red-500/30 transition-all border border-red-500/30 disabled:opacity-50"
                >
                  ✕ Decline
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
