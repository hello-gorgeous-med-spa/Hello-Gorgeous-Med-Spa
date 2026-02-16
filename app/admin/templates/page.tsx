'use client';

// ============================================================
// MESSAGE TEMPLATES PAGE
// Edit email and SMS templates
// ============================================================

import { useState, useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  category: string;
  subject: string | null;
  body: string;
  variables: string[];
  is_active: boolean;
}

const CATEGORIES = [
  { id: 'reminder', name: 'Reminders', icon: '⏰' },
  { id: 'confirmation', name: 'Confirmations', icon: '✅' },
  { id: 'follow_up', name: 'Follow-ups', icon: '💌' },
  { id: 'marketing', name: 'Marketing', icon: '📣' },
  { id: 'custom', name: 'Custom', icon: '✏️' },
];

const VARIABLE_HELP = {
  clientName: 'Client\'s first name',
  time: 'Appointment time (e.g., 2:00 PM)',
  date: 'Appointment date (e.g., Monday, Jan 15)',
  serviceName: 'Service name (e.g., Botox)',
  providerName: 'Provider name (e.g., Danielle)',
  promoCode: 'Promo code',
  promoDetails: 'Promotion details',
  lastVisitDate: 'Client\'s last visit date',
};

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editForm, setEditForm] = useState({ name: '', subject: '', body: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'email' | 'sms'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', type: 'sms' as 'email' | 'sms', category: 'custom', subject: '', body: '' });

  // Load templates
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/message-templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save template
  const handleSave = async () => {
    if (!selectedTemplate) return;
    setSaving(true);
    try {
      const res = await fetch('/api/message-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTemplate.id,
          name: editForm.name,
          subject: editForm.subject || null,
          body: editForm.body,
        }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Template saved!' });
        fetchTemplates();
        // Update local state
        setTemplates(prev => prev.map(t => 
          t.id === selectedTemplate.id 
            ? { ...t, name: editForm.name, subject: editForm.subject, body: editForm.body }
            : t
        ));
      } else {
        setMessage({ type: 'error', text: 'Failed to save template' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save template' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Create new template
  const handleCreate = async () => {
    if (!newTemplate.name || !newTemplate.body) return;
    setSaving(true);
    try {
      const res = await fetch('/api/message-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTemplate.name,
          type: newTemplate.type,
          category: newTemplate.category,
          subject: newTemplate.subject || null,
          body: newTemplate.body,
          variables: [],
        }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Template created!' });
        setShowAddModal(false);
        setNewTemplate({ name: '', type: 'sms', category: 'custom', subject: '', body: '' });
        fetchTemplates();
      } else {
        setMessage({ type: 'error', text: 'Failed to create template' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to create template' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Insert variable into body
  const insertVariable = (variable: string) => {
    const newBody = editForm.body + `{{${variable}}}`;
    setEditForm({ ...editForm, body: newBody });
  };

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  // Group by category
  const groupedTemplates = CATEGORIES.map(cat => ({
    ...cat,
    templates: filteredTemplates.filter(t => t.category === cat.id),
  })).filter(g => g.templates.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Message Templates</h1>
          <p className="text-black">Customize your email and SMS messages</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-black rounded-lg"
          >
            <option value="all">All Messages</option>
            <option value="email">Email Only</option>
            <option value="sms">SMS Only</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
          >
            + New Template
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="lg:col-span-1 space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl border border-black p-8 text-center text-black">
              Loading templates...
            </div>
          ) : groupedTemplates.length === 0 ? (
            <div className="bg-white rounded-xl border border-black p-8 text-center text-black">
              No templates found
            </div>
          ) : (
            groupedTemplates.map(group => (
              <div key={group.id} className="bg-white rounded-xl border border-black overflow-hidden">
                <div className="px-4 py-3 bg-white border-b border-black">
                  <h3 className="font-medium text-black">{group.icon} {group.name}</h3>
                </div>
                <div className="divide-y divide-black">
                  {group.templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setEditForm({
                          name: template.name,
                          subject: template.subject || '',
                          body: template.body,
                        });
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-white transition-colors ${
                        selectedTemplate?.id === template.id ? 'bg-pink-50 border-l-4 border-[#FF2D8E]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          template.type === 'email' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {template.type.toUpperCase()}
                        </span>
                        <span className="font-medium text-black text-sm">{template.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {!selectedTemplate ? (
            <div className="bg-white rounded-xl border border-black p-12 text-center text-black">
              <span className="text-4xl mb-4 block">📝</span>
              <p>Select a template to edit</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-black overflow-hidden">
              <div className="px-6 py-4 border-b border-black flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-black">Edit Template</h2>
                  <p className="text-sm text-black">{selectedTemplate.type === 'email' ? 'Email' : 'SMS'} • {selectedTemplate.category}</p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Template Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>

                {/* Subject (email only) */}
                {selectedTemplate.type === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Subject Line</label>
                    <input
                      type="text"
                      value={editForm.subject}
                      onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-black rounded-lg"
                      placeholder="Enter email subject..."
                    />
                  </div>
                )}

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Message Body
                    {selectedTemplate.type === 'sms' && (
                      <span className="text-black font-normal ml-2">({editForm.body.length}/160 chars)</span>
                    )}
                  </label>
                  <textarea
                    value={editForm.body}
                    onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                    rows={selectedTemplate.type === 'email' ? 10 : 4}
                    className="w-full px-4 py-2 border border-black rounded-lg font-mono text-sm"
                  />
                </div>

                {/* Variables */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Insert Variable</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(VARIABLE_HELP).map(([key, desc]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => insertVariable(key)}
                        className="px-3 py-1.5 text-sm bg-white hover:bg-white rounded-lg text-black"
                        title={desc}
                      >
                        {`{{${key}}}`}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-black mt-2">Click a variable to add it to your message. Variables will be replaced with actual values when sent.</p>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Preview</label>
                  <div className="p-4 bg-white rounded-lg border border-black">
                    {selectedTemplate.type === 'email' && editForm.subject && (
                      <p className="font-semibold text-black mb-2">
                        {editForm.subject.replace(/\{\{(\w+)\}\}/g, (_, v) => `[${v}]`)}
                      </p>
                    )}
                    <p className="text-black whitespace-pre-wrap">
                      {editForm.body.replace(/\{\{(\w+)\}\}/g, (_, v) => `[${v}]`)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Template Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">New Template</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Template Name *</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  placeholder="e.g., Holiday Sale SMS"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Type</label>
                  <select
                    value={newTemplate.type}
                    onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  >
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Category</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {newTemplate.type === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Subject</label>
                  <input
                    type="text"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Message Body *</label>
                <textarea
                  value={newTemplate.body}
                  onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  placeholder="Enter your message..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg">Cancel</button>
              <button
                onClick={handleCreate}
                disabled={saving || !newTemplate.name || !newTemplate.body}
                className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
