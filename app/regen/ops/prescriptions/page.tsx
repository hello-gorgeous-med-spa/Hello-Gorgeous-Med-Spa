'use client';

import { useState, useEffect, useCallback } from 'react';

type PrescriptionStatus = 'awaiting-review' | 'approved' | 'needs-labs' | 'needs-video' | 'denied' | 'sent-to-pharmacy';

interface Prescription {
  id: string;
  intake_id: string;
  patient: {
    name: string;
    email: string;
    age?: number;
    state?: string;
  };
  goal: string;
  requested_medication: string;
  medical_history: {
    conditions?: string[];
    allergies?: string[];
    current_meds?: string[];
  };
  bmi?: number;
  has_labs: boolean;
  lab_date?: string;
  status: PrescriptionStatus;
  created_at: string;
  notes?: string;
}

const STATUS_CONFIG: Record<PrescriptionStatus, { label: string; color: string; icon: string }> = {
  'awaiting-review': { label: 'Awaiting Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: '⏳' },
  'approved': { label: 'Approved', color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: '✓' },
  'needs-labs': { label: 'Needs Labs', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: '🧪' },
  'needs-video': { label: 'Needs Video Visit', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: '📹' },
  'denied': { label: 'Not Approved', color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: '✕' },
  'sent-to-pharmacy': { label: 'Sent to Pharmacy', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30', icon: '💊' },
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | PrescriptionStatus>('awaiting-review');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [processing, setProcessing] = useState(false);

  // Fetch from intakes with status=approved (awaiting Rx review)
  const fetchPrescriptions = useCallback(async () => {
    try {
      // For now, fetch from intakes API - will be separate prescriptions table later
      const res = await fetch('/api/regen/ops/intakes?status=all&limit=50');
      if (res.ok) {
        const data = await res.json();
        // Transform intakes to prescription format
        const rxList: Prescription[] = (data.intakes || []).map((intake: Record<string, unknown>) => ({
          id: intake.id,
          intake_id: intake.id,
          patient: {
            name: intake.name || 'Unknown',
            email: intake.email || '',
            age: intake.age,
            state: intake.state,
          },
          goal: intake.goal || 'Weight Loss',
          requested_medication: mapGoalToMedication(intake.goal as string || 'Weight Loss'),
          medical_history: {
            conditions: intake.medical_history?.conditions || [],
            allergies: intake.allergies || [],
            current_meds: intake.current_medications || [],
          },
          bmi: calculateBMI(intake.weight as string, intake.height as string),
          has_labs: !!(intake.medical_history as Record<string, unknown>)?.recent_labs,
          lab_date: (intake.medical_history as Record<string, unknown>)?.lab_date as string,
          status: mapIntakeStatusToRxStatus(intake.status as string),
          created_at: intake.created_at as string,
          notes: intake.review_notes as string,
        }));
        setPrescriptions(rxList);
      }
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handleAction = async (rx: Prescription, newStatus: PrescriptionStatus, note: string) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/regen/ops/intakes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rx.intake_id,
          status: mapRxStatusToIntakeStatus(newStatus),
          review_notes: note,
        }),
      });
      
      if (res.ok) {
        await fetchPrescriptions();
        setSelectedRx(null);
        setActionNote('');
      }
    } catch (error) {
      console.error('Failed to update prescription:', error);
    } finally {
      setProcessing(false);
    }
  };

  const filteredRx = prescriptions.filter(rx => 
    filter === 'all' || rx.status === filter
  );

  const counts = {
    'awaiting-review': prescriptions.filter(r => r.status === 'awaiting-review').length,
    'needs-labs': prescriptions.filter(r => r.status === 'needs-labs').length,
    'needs-video': prescriptions.filter(r => r.status === 'needs-video').length,
    'approved': prescriptions.filter(r => r.status === 'approved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Prescription Review</h1>
          <p className="text-white/50">Ryan Kent, FNP-BC — Clinical Queue</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-xl border border-teal-500/30">
          <span className="text-2xl">⚕️</span>
          <span className="text-teal-300 font-medium">{counts['awaiting-review']} Awaiting Review</span>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <div className="flex gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-amber-300 font-semibold">Clinical Review Required</p>
            <p className="text-amber-200/70 text-sm">
              Each prescription requires your clinical judgment. Review medical history, contraindications, 
              and request labs or video visit when clinically necessary. Document your rationale.
            </p>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['awaiting-review', 'needs-labs', 'needs-video', 'approved', 'sent-to-pharmacy', 'denied', 'all'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-teal-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {status === 'all' ? 'All' : STATUS_CONFIG[status]?.label || status}
            {status === 'awaiting-review' && counts['awaiting-review'] > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-500 rounded-full text-xs">{counts['awaiting-review']}</span>
            )}
          </button>
        ))}
      </div>

      {/* Prescription Queue */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white/50">Loading prescriptions...</p>
          </div>
        )}

        {!loading && filteredRx.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-4xl mb-4">🎉</p>
            <p className="text-white/70">No prescriptions in this queue</p>
          </div>
        )}

        {filteredRx.map(rx => (
          <div
            key={rx.id}
            className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-teal-500/30 transition-colors cursor-pointer"
            onClick={() => setSelectedRx(rx)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{rx.patient.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[rx.status].color}`}>
                    {STATUS_CONFIG[rx.status].icon} {STATUS_CONFIG[rx.status].label}
                  </span>
                </div>
                <p className="text-white/50 text-sm mb-3">{rx.patient.email}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">Goal:</span>
                    <span className="text-teal-400">{rx.goal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">Medication:</span>
                    <span className="text-white">{rx.requested_medication}</span>
                  </div>
                  {rx.bmi && (
                    <div className="flex items-center gap-2">
                      <span className="text-white/40">BMI:</span>
                      <span className={rx.bmi >= 27 ? 'text-green-400' : 'text-amber-400'}>{rx.bmi.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">Labs:</span>
                    <span className={rx.has_labs ? 'text-green-400' : 'text-amber-400'}>
                      {rx.has_labs ? '✓ On file' : '⚠ Not submitted'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-white/40 text-sm">{timeAgo(rx.created_at)}</p>
                {rx.status === 'awaiting-review' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedRx(rx); }}
                    className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-400 transition-colors"
                  >
                    Review Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedRx && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Clinical Review</h2>
                <button onClick={() => setSelectedRx(null)} className="text-white/50 hover:text-white text-2xl">×</button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/40">Name:</span>
                    <span className="text-white ml-2">{selectedRx.patient.name}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Age:</span>
                    <span className="text-white ml-2">{selectedRx.patient.age || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-white/40">State:</span>
                    <span className={`ml-2 ${selectedRx.patient.state === 'IL' ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedRx.patient.state || 'Unknown'} {selectedRx.patient.state === 'IL' ? '✓' : '⚠'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40">BMI:</span>
                    <span className={`ml-2 ${selectedRx.bmi && selectedRx.bmi >= 27 ? 'text-green-400' : 'text-amber-400'}`}>
                      {selectedRx.bmi?.toFixed(1) || 'Not calculated'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Medical History</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-white/40">Conditions:</span>
                    <span className="text-white ml-2">
                      {selectedRx.medical_history.conditions?.length 
                        ? selectedRx.medical_history.conditions.join(', ') 
                        : 'None reported'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40">Allergies:</span>
                    <span className={`ml-2 ${selectedRx.medical_history.allergies?.length ? 'text-red-400' : 'text-white'}`}>
                      {selectedRx.medical_history.allergies?.length 
                        ? selectedRx.medical_history.allergies.join(', ') 
                        : 'NKDA'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40">Current Medications:</span>
                    <span className="text-white ml-2">
                      {selectedRx.medical_history.current_meds?.length 
                        ? selectedRx.medical_history.current_meds.join(', ') 
                        : 'None'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Requested Treatment */}
              <div className="bg-teal-500/10 rounded-xl p-4 border border-teal-500/30">
                <h3 className="text-teal-300 font-semibold mb-3">Requested Treatment</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-white/40">Goal:</span>
                    <span className="text-white ml-2 font-medium">{selectedRx.goal}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Medication:</span>
                    <span className="text-teal-300 ml-2 font-medium">{selectedRx.requested_medication}</span>
                  </div>
                </div>
              </div>

              {/* Labs Status */}
              <div className={`rounded-xl p-4 border ${selectedRx.has_labs ? 'bg-green-500/10 border-green-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                <h3 className={`font-semibold mb-2 ${selectedRx.has_labs ? 'text-green-300' : 'text-amber-300'}`}>
                  {selectedRx.has_labs ? '✓ Labs Available' : '⚠ Labs Not Submitted'}
                </h3>
                <p className="text-white/70 text-sm">
                  {selectedRx.has_labs 
                    ? `Lab date: ${selectedRx.lab_date || 'On file'}` 
                    : 'Consider requesting metabolic panel before prescribing GLP-1 medications.'}
                </p>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block text-white font-semibold mb-2">Clinical Notes</label>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Document your clinical rationale..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[100px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleAction(selectedRx, 'approved', actionNote)}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-400 transition-colors disabled:opacity-50"
                >
                  ✓ Approve & Send to Pharmacy
                </button>
                <button
                  onClick={() => handleAction(selectedRx, 'needs-labs', actionNote)}
                  disabled={processing}
                  className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-400 transition-colors disabled:opacity-50"
                >
                  🧪 Request Labs
                </button>
                <button
                  onClick={() => handleAction(selectedRx, 'needs-video', actionNote)}
                  disabled={processing}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors disabled:opacity-50"
                >
                  📹 Schedule Video
                </button>
                <button
                  onClick={() => handleAction(selectedRx, 'denied', actionNote)}
                  disabled={processing}
                  className="px-6 py-3 bg-red-500/80 text-white rounded-xl font-semibold hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                  ✕ Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function mapGoalToMedication(goal: string): string {
  const map: Record<string, string> = {
    'Weight Loss': 'Semaglutide or Tirzepatide',
    'Hormones': 'Hormone Therapy (TRT/HRT)',
    'Peptides': 'Peptide Protocol',
    'Sexual Health': 'PT-141 or Sildenafil',
    'Hair': 'Finasteride/Minoxidil',
    'Skincare': 'Tretinoin Protocol',
    'Vitamins': 'Injectable Vitamins',
  };
  return map[goal] || 'To be determined';
}

function mapIntakeStatusToRxStatus(intakeStatus: string): PrescriptionStatus {
  const map: Record<string, PrescriptionStatus> = {
    'pending': 'awaiting-review',
    'under_review': 'awaiting-review',
    'approved': 'sent-to-pharmacy',
    'declined': 'denied',
    'needs_info': 'needs-labs',
    'needs_labs': 'needs-labs',
    'needs_video': 'needs-video',
  };
  return map[intakeStatus] || 'awaiting-review';
}

function mapRxStatusToIntakeStatus(rxStatus: PrescriptionStatus): string {
  const map: Record<PrescriptionStatus, string> = {
    'awaiting-review': 'pending',
    'approved': 'approved',
    'needs-labs': 'needs_labs',
    'needs-video': 'needs_video',
    'denied': 'declined',
    'sent-to-pharmacy': 'approved',
  };
  return map[rxStatus] || 'pending';
}

function calculateBMI(weight: string | undefined, height: string | undefined): number | undefined {
  if (!weight || !height) return undefined;
  
  // Try to parse weight in lbs
  const weightLbs = parseFloat(weight.replace(/[^\d.]/g, ''));
  if (isNaN(weightLbs)) return undefined;
  
  // Try to parse height - could be "5'10" or "70" (inches) or "178" (cm)
  let heightInches: number;
  if (height.includes("'")) {
    const parts = height.match(/(\d+)'(\d+)?/);
    if (parts) {
      heightInches = parseInt(parts[1]) * 12 + (parseInt(parts[2]) || 0);
    } else {
      return undefined;
    }
  } else {
    const h = parseFloat(height.replace(/[^\d.]/g, ''));
    heightInches = h > 100 ? h / 2.54 : h; // Assume cm if > 100
  }
  
  if (isNaN(heightInches) || heightInches === 0) return undefined;
  
  // BMI = (weight in lbs × 703) / (height in inches)²
  return (weightLbs * 703) / (heightInches * heightInches);
}
