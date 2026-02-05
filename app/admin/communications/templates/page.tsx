// ============================================================
// MESSAGE TEMPLATES - Quick Reply Templates for 2-Way Messaging
// Save time with pre-written responses
// ============================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  category: string;
  message: string;
  isActive: boolean;
}

const DEFAULT_TEMPLATES: Template[] = [
  // Appointment Confirmations
  {
    id: '1',
    name: 'Appointment Confirmation',
    category: 'appointments',
    message: "Hi {{firstName}}! Just confirming your appointment at 2pm today. Reply YES to confirm or call us at (331) 717-7545 to reschedule. See you soon! 💕",
    isActive: true,
  },
  {
    id: '2',
    name: 'Appointment Reminder - Tomorrow',
    category: 'appointments',
    message: "Hi {{firstName}}! This is a friendly reminder about your appointment tomorrow at {{time}}. Please arrive 5-10 minutes early. Reply CONFIRM or call to reschedule.",
    isActive: true,
  },
  {
    id: '3',
    name: 'Appointment Rescheduled',
    category: 'appointments',
    message: "Hi {{firstName}}! Your appointment has been rescheduled to {{date}} at {{time}}. Reply YES to confirm. Questions? Call us at (331) 717-7545.",
    isActive: true,
  },
  // Post-Treatment Care
  {
    id: '4',
    name: 'Post-Filler Check-in',
    category: 'aftercare',
    message: "Hi {{firstName}}! How are you feeling after your filler treatment? Some swelling is normal for 2-3 days. Ice and ibuprofen can help. Let us know if you have any concerns! 💕",
    isActive: true,
  },
  {
    id: '5',
    name: 'Post-Botox Check-in',
    category: 'aftercare',
    message: "Hi {{firstName}}! Your Botox should start taking effect in 3-5 days with full results at 2 weeks. Remember: no lying down for 4 hours, no facials for 24 hours. Questions? Text back!",
    isActive: true,
  },
  {
    id: '6',
    name: 'Post-Treatment General',
    category: 'aftercare',
    message: "Hi {{firstName}}! Hope you're loving your results! Remember to follow your aftercare instructions. If you have any questions or concerns, don't hesitate to reach out. 💕",
    isActive: true,
  },
  // Pre-Treatment Reminders
  {
    id: '7',
    name: 'Pre-Treatment Reminder - Retinol',
    category: 'pretreatment',
    message: "Hi {{firstName}}! Quick reminder to stop using retinol and any harsh skincare products 3 days before your appointment. See you soon!",
    isActive: true,
  },
  {
    id: '8',
    name: 'Pre-Treatment Reminder - Blood Thinners',
    category: 'pretreatment',
    message: "Hi {{firstName}}! Please avoid aspirin, ibuprofen, and alcohol for 24 hours before your treatment to minimize bruising. If you take prescription blood thinners, please call us.",
    isActive: true,
  },
  // FAQ Responses
  {
    id: '9',
    name: 'Swelling After Filler',
    category: 'faq',
    message: "Hi {{firstName}}! Yes, swelling after filler is completely normal and can last 2-5 days. Ice packs and sleeping elevated can help. If swelling persists beyond a week or you have concerns, please call us.",
    isActive: true,
  },
  {
    id: '10',
    name: 'Botox Results Timeline',
    category: 'faq',
    message: "Great question! Botox takes 3-5 days to start working and reaches full effect at about 2 weeks. We recommend a follow-up at 2 weeks to assess results. Want to schedule that now?",
    isActive: true,
  },
  {
    id: '11',
    name: 'Lip Filler Pain/Numbing',
    category: 'faq',
    message: "We always apply topical numbing cream before lip filler, so you'll be very comfortable! The procedure takes about 20-30 minutes. Most clients say it's much easier than they expected! 💕",
    isActive: true,
  },
  // Scheduling
  {
    id: '12',
    name: 'Last-Minute Opening',
    category: 'scheduling',
    message: "Hi {{firstName}}! We had a last-minute cancellation for {{time}}. If that works, I can add you to the schedule. Let me know!",
    isActive: true,
  },
  {
    id: '13',
    name: 'Reschedule Request',
    category: 'scheduling',
    message: "Hi {{firstName}}! We're happy to help reschedule. What day/time works best for you? We have openings {{availableTimes}}.",
    isActive: true,
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: '📋' },
  { id: 'appointments', name: 'Appointments', icon: '📅' },
  { id: 'aftercare', name: 'Aftercare', icon: '💊' },
  { id: 'pretreatment', name: 'Pre-Treatment', icon: '⚠️' },
  { id: 'faq', name: 'FAQ Responses', icon: '❓' },
  { id: 'scheduling', name: 'Scheduling', icon: '🗓️' },
];

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (message: string) => {
    navigator.clipboard.writeText(message);
    alert('Template copied to clipboard!');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/admin/messages" className="hover:text-pink-600">Messages</Link>
            <span>→</span>
            <span>Templates</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-3xl">📝</span>
            Message Templates
          </h1>
          <p className="text-gray-500 mt-1">Quick reply templates for common patient communications</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium flex items-center gap-2"
        >
          <span>➕</span> Add Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Templates</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{templates.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{templates.filter(t => t.isActive).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{CATEGORIES.length - 1}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Time Saved</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">~2hrs/day</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div className="p-3 flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-pink-100 text-pink-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <span className="text-xs text-gray-500 capitalize">{template.category}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                template.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {template.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
                {template.message}
              </div>
            </div>

            <div className="px-4 pb-4 flex items-center gap-2">
              <button
                onClick={() => handleCopy(template.message)}
                className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                📋 Copy
              </button>
              <button
                onClick={() => setEditingTemplate(template)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <span className="text-5xl">📭</span>
          <h3 className="text-lg font-semibold text-gray-900 mt-4">No templates found</h3>
          <p className="text-gray-500 mt-1">Try a different search or category</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">Edit Template</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingTemplate.category}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={editingTemplate.message}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {'{{firstName}}'}, {'{{time}}'}, {'{{date}}'} for personalization
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingTemplate.isActive}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, isActive: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t));
                  setEditingTemplate(null);
                }}
                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
