'use client';

// ============================================================
// AFTERCARE INSTRUCTIONS MANAGEMENT
// Create and manage post-treatment care instructions by service
// ============================================================

import { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

interface AftercareTemplate {
  id: string;
  service_id: string | null;
  name: string;
  content: string;
  send_via: 'email' | 'sms' | 'both';
  send_delay_minutes: number;
  is_active: boolean;
  service_name?: string;
}

interface Service {
  id: string;
  name: string;
}

export default function AftercarePage() {
  const toast = useToast();
  const [templates, setTemplates] = useState<AftercareTemplate[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AftercareTemplate | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    service_id: '',
    name: '',
    content: '',
    send_via: 'email' as 'email' | 'sms' | 'both',
    send_delay_minutes: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [templatesRes, servicesRes] = await Promise.all([
        fetch('/api/aftercare/templates'),
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

  const handleEdit = (template: AftercareTemplate) => {
    setEditingTemplate(template);
    setForm({
      service_id: template.service_id || '',
      name: template.name,
      content: template.content,
      send_via: template.send_via,
      send_delay_minutes: template.send_delay_minutes,
      is_active: template.is_active,
    });
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingTemplate(null);
    setForm({
      service_id: '',
      name: '',
      content: `# Aftercare Instructions

Thank you for your visit to Hello Gorgeous Med Spa!

## Post-Treatment Care

- Avoid touching the treated area for 4-6 hours
- Stay hydrated
- Avoid strenuous exercise for 24 hours
- Apply ice if needed to reduce swelling

## Contact Us

If you have any questions or concerns, please call us at (555) 123-4567.

We look forward to seeing you again!`,
      send_via: 'email',
      send_delay_minutes: 0,
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
        ? `/api/aftercare/templates/${editingTemplate.id}`
        : '/api/aftercare/templates';
      
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
      const res = await fetch(`/api/aftercare/templates/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Template deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete template');
    }
  };

  const handleToggleActive = async (template: AftercareTemplate) => {
    try {
      await fetch(`/api/aftercare/templates/${template.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...template, is_active: !template.is_active }),
      });
      fetchData();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const [seeding, setSeeding] = useState(false);

  const handleSeedTemplates = async () => {
    if (!confirm('This will add professional aftercare templates for common services. Continue?')) return;
    
    setSeeding(true);
    try {
      const res = await fetch('/api/aftercare/templates/seed', { method: 'POST' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success(`Added ${data.count} aftercare templates!`);
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
          <h1 className="text-2xl font-bold text-black">Aftercare Instructions</h1>
          <p className="text-black">Auto-send post-treatment care instructions to clients</p>
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
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            + New Template
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-blue-800 text-sm">
          <strong>How it works:</strong> When an appointment is marked as completed, the client automatically receives 
          aftercare instructions based on the service they received. You can create service-specific templates or use 
          a default template for all services.
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
            <span className="text-4xl mb-4 block">📝</span>
            <p className="text-black">No aftercare templates yet</p>
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
                    {template.send_delay_minutes === 0 ? ' Immediately' : ` After ${template.send_delay_minutes} min`}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">
                {editingTemplate ? 'Edit Template' : 'New Aftercare Template'}
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
                  placeholder="e.g., Botox Aftercare"
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
                <p className="text-xs text-black mt-1">
                  Leave empty to use as default for services without specific templates
                </p>
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
                  <label className="block text-sm font-medium text-black mb-1">Send Delay</label>
                  <select
                    value={form.send_delay_minutes}
                    onChange={(e) => setForm({ ...form, send_delay_minutes: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  >
                    <option value="0">Immediately</option>
                    <option value="30">30 minutes after</option>
                    <option value="60">1 hour after</option>
                    <option value="120">2 hours after</option>
                    <option value="1440">Next day</option>
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
                  placeholder="# Aftercare Instructions..."
                />
                <p className="text-xs text-black mt-1">
                  Use Markdown for formatting. Variables: {'{client_name}'}, {'{service_name}'}, {'{provider_name}'}
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-black text-pink-500"
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
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
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
