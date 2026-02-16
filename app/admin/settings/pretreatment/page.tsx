'use client';

// ============================================================
// PRE-TREATMENT INSTRUCTIONS MANAGEMENT
// Create and manage pre-appointment care instructions by service
// ============================================================

import { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

interface PretreatmentTemplate {
  id: string;
  service_id: string | null;
  name: string;
  content: string;
  send_via: 'email' | 'sms' | 'both';
  send_delay_hours: number;
  is_active: boolean;
  service_name?: string;
}

interface Service {
  id: string;
  name: string;
}

export default function PretreatmentPage() {
  const toast = useToast();
  const [templates, setTemplates] = useState<PretreatmentTemplate[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PretreatmentTemplate | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    service_id: '',
    name: '',
    content: '',
    send_via: 'email' as 'email' | 'sms' | 'both',
    send_delay_hours: 24,
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [templatesRes, servicesRes] = await Promise.all([
        fetch('/api/pretreatment/templates'),
        fetch('/api/services'),
      ]);
      
      const templatesData = await templatesRes.json();
      const servicesData = await servicesRes.json();
      
      setTemplates(templatesData.templates || []);
      setServices(servicesData.services || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: PretreatmentTemplate) => {
    setEditingTemplate(template);
    setForm({
      service_id: template.service_id || '',
      name: template.name,
      content: template.content,
      send_via: template.send_via,
      send_delay_hours: template.send_delay_hours,
      is_active: template.is_active,
    });
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingTemplate(null);
    setForm({
      service_id: '',
      name: '',
      content: `# Pre-Appointment Instructions

Hi {client_name}! Your {service_name} appointment is coming up.

## How to Prepare

### 24-48 Hours Before
- Avoid blood thinners (aspirin, ibuprofen, fish oil)
- Stay well hydrated
- Avoid alcohol

### Day Of
- Come with clean skin (no makeup if facial treatment)
- Wear comfortable clothing
- Bring your ID and payment method

## What to Expect
Your appointment will take approximately [X] minutes.

## Questions?
Call us at (555) 123-4567

We look forward to seeing you!`,
      send_via: 'email',
      send_delay_hours: 24,
      is_active: true,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.content) {
      toast.error('Name and content are required');
      return;
    }

    setSaving(true);
    try {
      const url = editingTemplate 
        ? `/api/pretreatment/templates/${editingTemplate.id}`
        : '/api/pretreatment/templates';
      
      const res = await fetch(url, {
        method: editingTemplate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          service_id: form.service_id || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      toast.success(editingTemplate ? 'Template updated!' : 'Template created!');
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const res = await fetch(`/api/pretreatment/templates/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Template deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete template');
    }
  };

  const handleToggleActive = async (template: PretreatmentTemplate) => {
    try {
      await fetch(`/api/pretreatment/templates/${template.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...template, is_active: !template.is_active }),
      });
      fetchData();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const getDelayLabel = (hours: number) => {
    if (hours === 0) return 'Immediately on booking';
    if (hours === 24) return '24 hours before';
    if (hours === 48) return '2 days before';
    if (hours === 72) return '3 days before';
    if (hours === 168) return '1 week before';
    return `${hours} hours before`;
  };

  const [seeding, setSeeding] = useState(false);

  const handleSeedTemplates = async () => {
    if (!confirm('This will add professional pre-treatment templates for common services. Continue?')) return;
    
    setSeeding(true);
    try {
      const res = await fetch('/api/pretreatment/templates/seed', { method: 'POST' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success(`Added ${data.count} default templates!`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to seed templates');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Pre-Treatment Instructions</h1>
          <p className="text-black">Auto-send appointment prep instructions when clients book</p>
        </div>
        <div className="flex items-center gap-3">
          {templates.length < 5 && (
            <button
              onClick={handleSeedTemplates}
              disabled={seeding}
              className="px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
            >
              {seeding ? 'Loading...' : '✨ Load Default Templates'}
            </button>
          )}
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black transition-colors"
          >
            + New Template
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-blue-800 text-sm">
          <strong>How it works:</strong> When a client books an appointment, they automatically receive 
          pre-treatment instructions based on the service. You can set when to send (immediately, 24hrs before, etc.) 
          and create service-specific templates.
        </p>
      </div>

      {/* Templates List */}
      <div className="bg-white rounded-xl border border-black overflow-hidden">
        <div className="p-4 border-b border-black">
          <h2 className="font-semibold text-black">Templates</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-black">Loading...</div>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center">
            <span className="text-4xl mb-4 block">📋</span>
            <p className="text-black">No pre-treatment templates yet</p>
            <button
              onClick={handleNew}
              className="text-pink-600 font-medium mt-2"
            >
              Create your first template
            </button>
          </div>
        ) : (
          <div className="divide-y divide-black">
            {templates.map((template) => (
              <div key={template.id} className="p-4 hover:bg-white flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-black">{template.name}</h3>
                    {!template.is_active && (
                      <span className="px-2 py-0.5 bg-white text-black text-xs rounded-full">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-black mt-1">
                    {template.service_name || 'All services (default)'} • 
                    Send via {template.send_via} •
                    {' '}{getDelayLabel(template.send_delay_hours)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(template)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      template.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-white text-black'
                    }`}
                  >
                    {template.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="px-3 py-1 text-sm bg-white text-black rounded-lg hover:bg-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">
                {editingTemplate ? 'Edit Template' : 'New Pre-Treatment Template'}
              </h2>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Template Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  placeholder="e.g., Botox Prep Instructions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Service (optional)</label>
                <select
                  value={form.service_id}
                  onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                >
                  <option value="">Default (all services)</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Send Via</label>
                  <select
                    value={form.send_via}
                    onChange={(e) => setForm({ ...form, send_via: e.target.value as any })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">When to Send</label>
                  <select
                    value={form.send_delay_hours}
                    onChange={(e) => setForm({ ...form, send_delay_hours: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  >
                    <option value="0">Immediately on booking</option>
                    <option value="24">24 hours before appointment</option>
                    <option value="48">2 days before</option>
                    <option value="72">3 days before</option>
                    <option value="168">1 week before</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Content (Markdown) *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg font-mono text-sm"
                  rows={12}
                  placeholder="# Pre-Appointment Instructions..."
                />
                <p className="text-xs text-black mt-1">
                  Variables: {'{client_name}'}, {'{service_name}'}, {'{appointment_date}'}, {'{appointment_time}'}
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-black text-[#FF2D8E]"
                />
                <span className="text-sm text-black">Active (send automatically)</span>
              </label>
            </div>

            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
