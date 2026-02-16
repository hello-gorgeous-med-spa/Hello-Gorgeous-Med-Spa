'use client';

// ============================================================
// CHARTING HUB - Clinical Documentation Dashboard
// Appointment-optional charting with SOAP notes
// ============================================================

import { useState, useEffect, useCallback } from 'react';
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
  status: 'draft' | 'final' | 'locked' | 'amended';
  note_type: string;
  title: string | null;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  client_name: string | null;
  service_name: string | null;
  created_by_name: string | null;
  created_at: string;
  signed_at: string | null;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Template {
  id: string;
  name: string;
  note_type: string;
  subjective_template?: string;
  objective_template?: string;
  assessment_template?: string;
  plan_template?: string;
}

const NOTE_TYPE_LABELS: Record<string, string> = {
  soap: 'SOAP Note',
  procedure: 'Procedure',
  follow_up: 'Follow-Up',
  consult: 'Consultation',
  phone: 'Phone Note',
  other: 'Other',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  final: 'bg-green-100 text-green-800',
  locked: 'bg-blue-100 text-blue-800',
  amended: 'bg-purple-100 text-purple-800',
};

export default function ChartingHubPage() {
  // State
  const [notes, setNotes] = useState<ChartNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'drafts' | 'today' | 'week'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewNote, setShowNewNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ChartNote | null>(null);
  
  // New note form
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newNote, setNewNote] = useState({
    client_id: '',
    appointment_id: '',
    note_type: 'soap',
    template_id: '',
    title: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Voice dictation state
  const [showVoice, setShowVoice] = useState(false);
  const [activeField, setActiveField] = useState<'subjective' | 'objective' | 'assessment' | 'plan'>('subjective');

  // Handle voice transcript
  const handleVoiceTranscript = useCallback((text: string, targetField?: string) => {
    const field = targetField || activeField;
    if (field === 'subjective' || field === 'objective' || field === 'assessment' || field === 'plan') {
      setNewNote(prev => ({
        ...prev,
        [field]: prev[field as keyof typeof prev] ? `${prev[field as keyof typeof prev]}\n${text}` : text,
      }));
    }
  }, [activeField]);

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/chart-notes?limit=100';
      
      if (filter === 'drafts') {
        url += '&status=draft';
      } else if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        url += `&start_date=${today}T00:00:00`;
      } else if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        url += `&start_date=${weekAgo.toISOString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch('/api/chart-templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    }
  }, []);

  // Search clients
  const searchClients = useCallback(async (query: string) => {
    if (query.length < 2) {
      setClients([]);
      return;
    }
    try {
      const res = await fetch(`/api/clients?search=${encodeURIComponent(query)}&limit=10`);
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error('Failed to search clients:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    fetchTemplates();
  }, [fetchNotes, fetchTemplates]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchClients(clientSearch);
    }, 300);
    return () => clearTimeout(debounce);
  }, [clientSearch, searchClients]);

  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setNewNote(prev => ({
        ...prev,
        template_id: templateId,
        note_type: template.note_type,
        subjective: template.subjective_template || '',
        objective: template.objective_template || '',
        assessment: template.assessment_template || '',
        plan: template.plan_template || '',
      }));
    }
  };

  // Create note
  const handleCreateNote = async (asDraft: boolean) => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/chart-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newNote,
          client_id: newNote.client_id || null,
          appointment_id: newNote.appointment_id || null,
          template_id: newNote.template_id || null,
          status: asDraft ? 'draft' : 'final',
          // created_by will be set from session in a future auth update
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: asDraft ? 'Draft saved!' : 'Note finalized!' });
        setShowNewNote(false);
        setNewNote({
          client_id: '',
          appointment_id: '',
          note_type: 'soap',
          template_id: '',
          title: '',
          subjective: '',
          objective: '',
          assessment: '',
          plan: '',
        });
        fetchNotes();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save note' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save note' });
    } finally {
      setSaving(false);
    }
  };

  // Filter notes by search
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      note.client_name?.toLowerCase().includes(q) ||
      note.title?.toLowerCase().includes(q) ||
      note.subjective?.toLowerCase().includes(q) ||
      note.assessment?.toLowerCase().includes(q)
    );
  });

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-black px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">📋 Charting Hub</h1>
            <p className="text-black text-sm">Clinical documentation • Appointment optional</p>
          </div>
          <button
            onClick={() => setShowNewNote(true)}
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 flex items-center gap-2"
          >
            <span>+</span> New Note
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Filters */}
        <div className="w-64 bg-white border-r border-black min-h-[calc(100vh-80px)] p-4">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Quick Filters */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-black uppercase tracking-wide mb-2">Filters</p>
            {[
              { key: 'all', label: 'All Notes', icon: '📄' },
              { key: 'drafts', label: 'Drafts', icon: '✏️' },
              { key: 'today', label: 'Today', icon: '📅' },
              { key: 'week', label: 'This Week', icon: '🗓️' },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-pink-50 text-pink-700'
                    : 'text-black hover:bg-white'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 p-4 bg-white rounded-lg">
            <p className="text-xs font-semibold text-black uppercase mb-3">Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black">Total Notes</span>
                <span className="font-semibold">{notes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Drafts</span>
                <span className="font-semibold text-yellow-600">
                  {notes.filter(n => n.status === 'draft').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Finalized</span>
                <span className="font-semibold text-green-600">
                  {notes.filter(n => n.status === 'final' || n.status === 'locked').length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 space-y-2">
            <Link
              href="/admin/clients"
              className="block text-sm text-pink-600 hover:text-pink-700"
            >
              → Client Profiles
            </Link>
            <Link
              href="/admin/calendar"
              className="block text-sm text-pink-600 hover:text-pink-700"
            >
              → Calendar
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Message */}
          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Notes List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-black">Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-black">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-black font-medium">No notes found</p>
              <p className="text-black text-sm mt-1">
                {filter === 'drafts' ? 'No draft notes' : 'Create your first chart note'}
              </p>
              <button
                onClick={() => setShowNewNote(true)}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                + New Note
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className="bg-white rounded-xl border border-black p-4 hover:border-pink-300 hover:shadow-sm cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[note.status]}`}>
                          {note.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-black">
                          {NOTE_TYPE_LABELS[note.note_type] || note.note_type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-black">
                        {note.client_name || 'No client assigned'}
                      </h3>
                      {note.title && (
                        <p className="text-sm text-black">{note.title}</p>
                      )}
                      {note.assessment && (
                        <p className="text-sm text-black mt-1 line-clamp-2">
                          {note.assessment}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-black">{formatDate(note.created_at)}</p>
                      {note.created_by_name && (
                        <p className="text-black text-xs">{note.created_by_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Note Modal */}
      {showNewNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-black flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">New Chart Note</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowVoice(!showVoice)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-2 ${
                    showVoice 
                      ? 'bg-pink-100 text-pink-700' 
                      : 'bg-white text-black hover:bg-white'
                  }`}
                >
                  🎤 Voice
                </button>
                <button
                  onClick={() => setShowNewNote(false)}
                  className="text-black hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column - Client & Settings */}
                <div className="space-y-4">
                  {/* Client Search */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Client <span className="text-black">(optional for drafts)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Search by name, email, phone..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                    />
                    {clients.length > 0 && (
                      <div className="mt-2 border border-black rounded-lg max-h-40 overflow-y-auto">
                        {clients.map((client) => (
                          <button
                            key={client.id}
                            onClick={() => {
                              setNewNote(prev => ({ ...prev, client_id: client.id }));
                              setClientSearch(`${client.first_name} ${client.last_name}`);
                              setClients([]);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-white text-sm"
                          >
                            <p className="font-medium">{client.first_name} {client.last_name}</p>
                            <p className="text-xs text-black">{client.email}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    {newNote.client_id && (
                      <p className="mt-1 text-xs text-green-600">✓ Client selected</p>
                    )}
                  </div>

                  {/* Note Type */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Note Type
                    </label>
                    <select
                      value={newNote.note_type}
                      onChange={(e) => setNewNote(prev => ({ ...prev, note_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                    >
                      {Object.entries(NOTE_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Template */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Template
                    </label>
                    <select
                      value={newNote.template_id}
                      onChange={(e) => applyTemplate(e.target.value)}
                      className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                    >
                      <option value="">No template</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Title / Summary
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Botox Treatment - Glabella"
                      value={newNote.title}
                      onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Right Columns - SOAP Fields */}
                <div className="col-span-2 space-y-4">
                  {/* Voice Dictation Panel - shows above fields when enabled */}
                  {showVoice && (
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎤</span>
                          <span className="font-medium text-black">Voice Dictation</span>
                          <span className="text-sm text-black">→ {activeField.charAt(0).toUpperCase() + activeField.slice(1)}</span>
                        </div>
                        <div className="flex gap-1">
                          {(['subjective', 'objective', 'assessment', 'plan'] as const).map((field) => (
                            <button
                              key={field}
                              onClick={() => setActiveField(field)}
                              className={`w-8 h-8 rounded-full text-white text-xs font-bold ${
                                activeField === field ? 'ring-2 ring-offset-2 ring-pink-500' : ''
                              } ${
                                field === 'subjective' ? 'bg-pink-500' :
                                field === 'objective' ? 'bg-blue-500' :
                                field === 'assessment' ? 'bg-green-500' :
                                'bg-purple-500'
                              }`}
                            >
                              {field.charAt(0).toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                      <VoiceDictation
                        onTranscript={handleVoiceTranscript}
                        targetField={activeField}
                        compact={false}
                      />
                    </div>
                  )}

                  {/* Subjective */}
                  <div 
                    onClick={() => setActiveField('subjective')}
                    className={`cursor-pointer transition-all ${activeField === 'subjective' && showVoice ? 'ring-2 ring-pink-300 rounded-lg' : ''}`}
                  >
                    <label className="block text-sm font-medium text-black mb-1">
                      <span className="text-pink-600 font-bold">S</span>ubjective
                      <span className="text-black font-normal ml-2">Patient's description</span>
                      {activeField === 'subjective' && showVoice && <span className="text-pink-500 ml-2">🎤</span>}
                    </label>
                    <textarea
                      value={newNote.subjective}
                      onChange={(e) => setNewNote(prev => ({ ...prev, subjective: e.target.value }))}
                      onFocus={() => setActiveField('subjective')}
                      placeholder="Chief complaint, history, patient's perspective..."
                      rows={4}
                      className="w-full px-3 py-2 border border-black rounded-lg text-sm resize-none text-black"
                    />
                  </div>

                  {/* Objective */}
                  <div 
                    onClick={() => setActiveField('objective')}
                    className={`cursor-pointer transition-all ${activeField === 'objective' && showVoice ? 'ring-2 ring-blue-300 rounded-lg' : ''}`}
                  >
                    <label className="block text-sm font-medium text-black mb-1">
                      <span className="text-blue-600 font-bold">O</span>bjective
                      <span className="text-black font-normal ml-2">Clinical observations</span>
                      {activeField === 'objective' && showVoice && <span className="text-blue-500 ml-2">🎤</span>}
                    </label>
                    <textarea
                      value={newNote.objective}
                      onChange={(e) => setNewNote(prev => ({ ...prev, objective: e.target.value }))}
                      onFocus={() => setActiveField('objective')}
                      placeholder="Physical exam findings, measurements, observations..."
                      rows={4}
                      className="w-full px-3 py-2 border border-black rounded-lg text-sm resize-none text-black"
                    />
                  </div>

                  {/* Assessment */}
                  <div 
                    onClick={() => setActiveField('assessment')}
                    className={`cursor-pointer transition-all ${activeField === 'assessment' && showVoice ? 'ring-2 ring-green-300 rounded-lg' : ''}`}
                  >
                    <label className="block text-sm font-medium text-black mb-1">
                      <span className="text-green-600 font-bold">A</span>ssessment
                      <span className="text-black font-normal ml-2">Clinical impression</span>
                      {activeField === 'assessment' && showVoice && <span className="text-green-500 ml-2">🎤</span>}
                    </label>
                    <textarea
                      value={newNote.assessment}
                      onChange={(e) => setNewNote(prev => ({ ...prev, assessment: e.target.value }))}
                      onFocus={() => setActiveField('assessment')}
                      placeholder="Diagnosis, clinical impression, treatment rationale..."
                      rows={3}
                      className="w-full px-3 py-2 border border-black rounded-lg text-sm resize-none text-black"
                    />
                  </div>

                  {/* Plan */}
                  <div 
                    onClick={() => setActiveField('plan')}
                    className={`cursor-pointer transition-all ${activeField === 'plan' && showVoice ? 'ring-2 ring-purple-300 rounded-lg' : ''}`}
                  >
                    <label className="block text-sm font-medium text-black mb-1">
                      <span className="text-purple-600 font-bold">P</span>lan
                      <span className="text-black font-normal ml-2">Treatment plan</span>
                      {activeField === 'plan' && showVoice && <span className="text-purple-500 ml-2">🎤</span>}
                    </label>
                    <textarea
                      value={newNote.plan}
                      onChange={(e) => setNewNote(prev => ({ ...prev, plan: e.target.value }))}
                      onFocus={() => setActiveField('plan')}
                      placeholder="Treatment performed, follow-up plan, patient education..."
                      rows={4}
                      className="w-full px-3 py-2 border border-black rounded-lg text-sm resize-none text-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-black flex items-center justify-between bg-white">
              <div className="text-sm">
                {newNote.client_id ? (
                  <span className="text-green-600">✅ Client selected - ready to finalize</span>
                ) : (
                  <span className="text-black">💡 Select a client to finalize, or save as draft</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewNote(false)}
                  className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateNote(true)}
                  disabled={saving}
                  className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleCreateNote(false)}
                  disabled={saving || !newNote.client_id}
                  className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Finalize'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Note Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-black flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-black">
                    {selectedNote.client_name || 'Chart Note'}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[selectedNote.status]}`}>
                    {selectedNote.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-black">{formatDate(selectedNote.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-black hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedNote.title && (
                <div>
                  <p className="text-sm font-medium text-black">Title</p>
                  <p className="text-black">{selectedNote.title}</p>
                </div>
              )}

              {selectedNote.subjective && (
                <div className="p-4 bg-pink-50 rounded-lg">
                  <p className="text-sm font-medium text-pink-700 mb-1">Subjective</p>
                  <p className="text-black whitespace-pre-wrap">{selectedNote.subjective}</p>
                </div>
              )}

              {selectedNote.objective && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 mb-1">Objective</p>
                  <p className="text-black whitespace-pre-wrap">{selectedNote.objective}</p>
                </div>
              )}

              {selectedNote.assessment && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-700 mb-1">Assessment</p>
                  <p className="text-black whitespace-pre-wrap">{selectedNote.assessment}</p>
                </div>
              )}

              {selectedNote.plan && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-700 mb-1">Plan</p>
                  <p className="text-black whitespace-pre-wrap">{selectedNote.plan}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-black flex justify-between bg-white">
              <div>
                {selectedNote.status === 'draft' && (
                  <Link
                    href={`/charting/${selectedNote.id}/edit`}
                    className="text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Edit Note →
                  </Link>
                )}
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
