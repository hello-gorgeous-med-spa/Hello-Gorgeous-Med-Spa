'use client';

// ============================================================
// CHART NOTE EDITOR
// Full SOAP editor with voice dictation support
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import for voice dictation (no SSR)
const VoiceDictation = dynamic(
  () => import('@/components/charting/VoiceDictation'),
  { ssr: false }
);

interface ChartNote {
  id: string;
  client_id: string | null;
  appointment_id: string | null;
  service_id: string | null;
  template_id: string | null;
  status: 'draft' | 'final' | 'locked' | 'amended';
  note_type: string;
  title: string | null;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  procedure_details: any;
  icd10_codes: string[];
  cpt_codes: string[];
  client_name?: string;
  created_at: string;
}

export default function EditChartNotePage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  const [note, setNote] = useState<ChartNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showVoice, setShowVoice] = useState(false);
  const [activeField, setActiveField] = useState<'subjective' | 'objective' | 'assessment' | 'plan'>('subjective');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    note_type: 'soap',
  });

  // Fetch note
  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await fetch(`/api/chart-notes/${noteId}`);
        const data = await res.json();
        
        if (data.note) {
          setNote(data.note);
          setFormData({
            title: data.note.title || '',
            subjective: data.note.subjective || '',
            objective: data.note.objective || '',
            assessment: data.note.assessment || '',
            plan: data.note.plan || '',
            note_type: data.note.note_type || 'soap',
          });
        }
      } catch (err) {
        console.error('Failed to fetch note:', err);
        setMessage({ type: 'error', text: 'Failed to load note' });
      } finally {
        setLoading(false);
      }
    }

    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  // Handle voice transcript
  const handleVoiceTranscript = useCallback((text: string, targetField?: string) => {
    const field = targetField || activeField;
    if (field === 'subjective' || field === 'objective' || field === 'assessment' || field === 'plan') {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field] ? `${prev[field]}\n${text}` : text,
      }));
    }
  }, [activeField]);

  // Save note
  const handleSave = async (finalize: boolean = false) => {
    setSaving(true);
    setMessage(null);

    try {
      const updateData: any = {
        id: noteId,
        title: formData.title || null,
        subjective: formData.subjective || null,
        objective: formData.objective || null,
        assessment: formData.assessment || null,
        plan: formData.plan || null,
        note_type: formData.note_type,
      };

      if (finalize) {
        updateData.status = 'final';
      }

      const res = await fetch('/api/chart-notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ 
          type: 'success', 
          text: finalize ? 'Note finalized!' : 'Draft saved!' 
        });
        if (finalize) {
          setTimeout(() => router.push('/charting'), 1500);
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save note' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#FF2D8E] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-black">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-black mb-4">Note not found</p>
          <Link href="/charting" className="text-pink-600 hover:text-pink-700">
            ← Back to Charting Hub
          </Link>
        </div>
      </div>
    );
  }

  // Can't edit finalized notes
  if (note.status !== 'draft') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-xl text-black mb-2">This note is {note.status}</p>
          <p className="text-black mb-4">Finalized notes cannot be edited. You can create an amendment if changes are needed.</p>
          <Link href="/charting" className="text-pink-600 hover:text-pink-700">
            ← Back to Charting Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-black px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/charting" className="text-black hover:text-black">
              ← Back
            </Link>
            <div>
              <h1 className="text-xl font-bold text-black">
                Edit Chart Note
              </h1>
              {note.client_name && (
                <p className="text-sm text-black">Client: {note.client_name}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVoice(!showVoice)}
              className={`px-3 py-2 rounded-lg font-medium flex items-center gap-2 ${
                showVoice 
                  ? 'bg-pink-100 text-pink-700' 
                  : 'bg-white text-black hover:bg-white'
              }`}
            >
              🎤 Voice Dictation
            </button>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
              DRAFT
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mx-6 mt-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex gap-6 p-6">
        {/* Main Editor */}
        <div className="flex-1 space-y-4">
          {/* Title */}
          <div className="bg-white rounded-xl border border-black p-4">
            <label className="block text-sm font-medium text-black mb-2">
              Title / Summary
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Botox Treatment - Glabella & Forehead"
              className="w-full px-3 py-2 border border-black rounded-lg"
            />
          </div>

          {/* SOAP Fields */}
          {['subjective', 'objective', 'assessment', 'plan'].map((field) => (
            <div 
              key={field}
              className={`bg-white rounded-xl border-2 p-4 transition-colors ${
                activeField === field ? 'border-pink-300' : 'border-black'
              }`}
              onClick={() => setActiveField(field as any)}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-black flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    field === 'subjective' ? 'bg-[#FF2D8E]' :
                    field === 'objective' ? 'bg-blue-500' :
                    field === 'assessment' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`}>
                    {field.charAt(0).toUpperCase()}
                  </span>
                  <span className="capitalize">{field}</span>
                  <span className="text-black font-normal">
                    {field === 'subjective' && '- Patient description'}
                    {field === 'objective' && '- Clinical observations'}
                    {field === 'assessment' && '- Clinical impression'}
                    {field === 'plan' && '- Treatment plan'}
                  </span>
                </label>
                {activeField === field && showVoice && (
                  <span className="text-xs text-pink-600">🎤 Voice active</span>
                )}
              </div>
              <textarea
                value={formData[field as keyof typeof formData] as string}
                onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                placeholder={
                  field === 'subjective' ? 'Chief complaint, patient history, concerns...' :
                  field === 'objective' ? 'Physical exam findings, measurements, observations...' :
                  field === 'assessment' ? 'Diagnosis, clinical impression, treatment rationale...' :
                  'Treatment performed, follow-up plan, patient education...'
                }
                rows={5}
                className="w-full px-3 py-2 border border-black rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        {/* Right Sidebar - Voice Dictation */}
        {showVoice && (
          <div className="w-80">
            <div className="sticky top-6">
              <VoiceDictation
                onTranscript={handleVoiceTranscript}
                targetField={activeField}
              />
              
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium mb-2">💡 Voice Dictation Tips</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Click a field to set where text will be inserted</li>
                  <li>• Say "period" or "comma" for punctuation</li>
                  <li>• Speak clearly at a normal pace</li>
                  <li>• Review and edit text after insertion</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="text-sm text-black">
            Last saved: {new Date(note.created_at).toLocaleString()}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/charting"
              className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
            >
              Cancel
            </Link>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !note.client_id}
              className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50"
              title={!note.client_id ? 'Client required to finalize' : ''}
            >
              {saving ? 'Saving...' : 'Save & Finalize'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
