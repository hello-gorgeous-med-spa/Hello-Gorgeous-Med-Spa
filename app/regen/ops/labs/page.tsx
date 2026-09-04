'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0a0a0a',
};

type LabStatus = 'pending_payment' | 'ordered' | 'processing' | 'uploaded' | 'results_ready' | 'reviewed' | 'approved' | 'expired';

interface LabRecord {
  id: string;
  patient_email: string;
  patient_name: string;
  lab_type: string;
  required_for: string;
  status: LabStatus;
  lab_file_url?: string;
  lab_date?: string;
  lab_provider?: string;
  panel_id?: string;
  fullscript_order_id?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  values_within_range?: boolean;
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<LabStatus, { label: string; color: string; icon: string }> = {
  'pending_payment': { label: 'Pending Payment', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: '💳' },
  'ordered': { label: 'Ordered', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: '📋' },
  'processing': { label: 'Processing', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: '⏳' },
  'uploaded': { label: 'Uploaded - Needs Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: '📄' },
  'results_ready': { label: 'Results Ready', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: '🧪' },
  'reviewed': { label: 'Reviewed', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30', icon: '👁️' },
  'approved': { label: 'Approved', color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: '✓' },
  'expired': { label: 'Expired', color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: '⚠️' },
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function LabReviewPage() {
  const [labs, setLabs] = useState<LabRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'needs_review' | 'approved'>('needs_review');
  const [selectedLab, setSelectedLab] = useState<LabRecord | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [valuesInRange, setValuesInRange] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchLabs = useCallback(async () => {
    try {
      const res = await fetch('/api/regen/ops/labs');
      if (res.ok) {
        const data = await res.json();
        setLabs(data.labs || []);
      }
    } catch (error) {
      console.error('Failed to fetch labs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  const handleReview = async (lab: LabRecord, approved: boolean) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/regen/ops/labs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: lab.id,
          status: approved ? 'approved' : 'reviewed',
          review_notes: reviewNotes,
          values_within_range: valuesInRange,
        }),
      });

      if (res.ok) {
        await fetchLabs();
        setSelectedLab(null);
        setReviewNotes('');
        setValuesInRange(null);
      }
    } catch (error) {
      console.error('Failed to update lab:', error);
    } finally {
      setProcessing(false);
    }
  };

  const filteredLabs = labs.filter(lab => {
    if (filter === 'needs_review') {
      return ['uploaded', 'results_ready'].includes(lab.status);
    }
    if (filter === 'approved') {
      return lab.status === 'approved';
    }
    return true;
  });

  const needsReviewCount = labs.filter(l => ['uploaded', 'results_ready'].includes(l.status)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Lab Results Review</h1>
          <p className="text-white/50">Review patient lab work before approving treatment</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
          <span className="text-2xl">🧪</span>
          <span className="text-purple-300 font-medium">{needsReviewCount} Needs Review</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'needs_review', label: 'Needs Review', count: needsReviewCount },
          { id: 'approved', label: 'Approved' },
          { id: 'all', label: 'All Labs' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.id
                ? 'bg-teal-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-500 rounded-full text-xs">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Lab Queue */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white/50">Loading labs...</p>
          </div>
        )}

        {!loading && filteredLabs.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-4xl mb-4">🎉</p>
            <p className="text-white/70">No labs in this queue</p>
          </div>
        )}

        {filteredLabs.map(lab => (
          <div
            key={lab.id}
            className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-teal-500/30 transition-colors cursor-pointer"
            onClick={() => setSelectedLab(lab)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{lab.patient_name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[lab.status].color}`}>
                    {STATUS_CONFIG[lab.status].icon} {STATUS_CONFIG[lab.status].label}
                  </span>
                </div>
                <p className="text-white/50 text-sm mb-3">{lab.patient_email}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">Type:</span>
                    <span className="text-teal-400">{lab.lab_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">For:</span>
                    <span className="text-white">{lab.required_for}</span>
                  </div>
                  {lab.lab_date && (
                    <div className="flex items-center gap-2">
                      <span className="text-white/40">Lab Date:</span>
                      <span className="text-white">{new Date(lab.lab_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {lab.lab_file_url && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">📄 File attached</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-white/40 text-sm">{timeAgo(lab.created_at)}</p>
                {['uploaded', 'results_ready'].includes(lab.status) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedLab(lab); }}
                    className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-400 transition-colors"
                  >
                    Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedLab && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Lab Review</h2>
                <button onClick={() => setSelectedLab(null)} className="text-white/50 hover:text-white text-2xl">×</button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Patient</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/40">Name:</span>
                    <span className="text-white ml-2">{selectedLab.patient_name}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Email:</span>
                    <span className="text-white ml-2">{selectedLab.patient_email}</span>
                  </div>
                </div>
              </div>

              {/* Lab Info */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Lab Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/40">Type:</span>
                    <span className="text-teal-400 ml-2">{selectedLab.lab_type}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Required For:</span>
                    <span className="text-white ml-2">{selectedLab.required_for}</span>
                  </div>
                  {selectedLab.lab_date && (
                    <div>
                      <span className="text-white/40">Lab Date:</span>
                      <span className="text-white ml-2">{new Date(selectedLab.lab_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedLab.lab_provider && (
                    <div>
                      <span className="text-white/40">Provider:</span>
                      <span className="text-white ml-2">{selectedLab.lab_provider}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* View Lab File */}
              {selectedLab.lab_file_url && (
                <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                  <h3 className="text-purple-300 font-semibold mb-3">📄 Lab Results File</h3>
                  <a
                    href={selectedLab.lab_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition-colors"
                  >
                    Open Lab Results →
                  </a>
                </div>
              )}

              {/* Values in Range? */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Are values within acceptable range?</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="valuesInRange"
                      checked={valuesInRange === true}
                      onChange={() => setValuesInRange(true)}
                      className="w-5 h-5"
                      style={{ accentColor: BRAND.teal }}
                    />
                    <span className="text-green-400">Yes, in range</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="valuesInRange"
                      checked={valuesInRange === false}
                      onChange={() => setValuesInRange(false)}
                      className="w-5 h-5"
                      style={{ accentColor: BRAND.pink }}
                    />
                    <span className="text-red-400">No, out of range</span>
                  </label>
                </div>
              </div>

              {/* Review Notes */}
              <div>
                <label className="block text-white font-semibold mb-2">Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Document any findings or concerns..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[100px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleReview(selectedLab, true)}
                  disabled={processing || valuesInRange === null}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-400 transition-colors disabled:opacity-50"
                >
                  ✓ Approve Labs
                </button>
                <button
                  onClick={() => handleReview(selectedLab, false)}
                  disabled={processing}
                  className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50"
                >
                  👁️ Mark as Reviewed (Needs Follow-up)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
