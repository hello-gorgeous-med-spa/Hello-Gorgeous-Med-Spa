'use client';

// ============================================================
// ADMIN CONSENTS PAGE  
// Manage consent templates and view signed consents
// FULLY DYNAMIC - Fetches from database
// ============================================================

import { useState, useEffect } from 'react';

interface ConsentTemplate {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  content: string;
  version: number;
  is_active: boolean;
  requires_witness: boolean;
  required_for_services: string[] | null;
  created_at: string;
  updated_at: string;
  signed_count?: number;
}

export default function AdminConsentsPage() {
  const [templates, setTemplates] = useState<ConsentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, totalSigned: 0, expiringSoon: 0 });
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ConsentTemplate | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    name: '',
    slug: '',
    description: '',
    content: '',
    is_active: true,
    requires_witness: false,
    required_for_services: [] as string[],
  });
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Seed default templates
  const handleSeedTemplates = async () => {
    setSeeding(true);
    try {
      const response = await fetch('/api/consents/seed', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        alert(`Loaded ${data.templates?.length || 0} consent templates!`);
        fetchTemplates();
      } else {
        throw new Error(data.error || 'Failed to load templates');
      }
    } catch (err) {
      console.error('Seed error:', err);
      alert('Failed to load default templates. The database table may need to be created first.');
    } finally {
      setSeeding(false);
    }
  };

  // Fetch via API (bypasses RLS)
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/consents');
      const data = await response.json();

      if (data.error && !data.templates) {
        throw new Error(data.error);
      }

      setTemplates(data.templates || []);
      setStats(data.stats || { total: 0, totalSigned: 0, expiringSoon: 0 });
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load consent templates');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (template?: ConsentTemplate) => {
    if (template) {
      setSelectedTemplate(template);
      setEditForm({
        name: template.name,
        slug: template.slug,
        description: template.description || '',
        content: template.content,
        is_active: template.is_active,
        requires_witness: template.requires_witness,
        required_for_services: template.required_for_services || [],
      });
    } else {
      setSelectedTemplate(null);
      setEditForm({
        name: '',
        slug: '',
        description: '',
        content: '',
        is_active: true,
        requires_witness: false,
        required_for_services: [],
      });
    }
    setShowEditModal(true);
  };

  const openPreviewModal = (template: ConsentTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Save via API
  const handleSave = async () => {
    setSaving(true);
    try {
      const method = selectedTemplate ? 'PUT' : 'POST';
      const body = selectedTemplate 
        ? { id: selectedTemplate.id, ...editForm }
        : editForm;

      const response = await fetch('/api/consents', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      setShowEditModal(false);
      fetchTemplates();
    } catch (err) {
      console.error('Save error:', err);
      alert(err instanceof Error ? err.message : 'Failed to save consent template');
    } finally {
      setSaving(false);
    }
  };

  // Delete via API
  const handleDelete = async (template: ConsentTemplate) => {
    if (!confirm(`Are you sure you want to delete "${template.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/consents?id=${template.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete');
      }

      fetchTemplates();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete template');
    }
  };

  // Toggle via API
  const toggleActive = async (template: ConsentTemplate) => {
    try {
      const response = await fetch('/api/consents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: template.id,
          is_active: !template.is_active,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      fetchTemplates();
    } catch (err) {
      console.error('Toggle error:', err);
      alert('Failed to update template status');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Consent Forms</h1>
            <p className="text-black">Loading...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg h-20"></div>
            ))}
          </div>
          <div className="bg-white rounded-xl h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Consent Forms</h1>
          <p className="text-black">Manage consent templates and view signed consents</p>
        </div>
        <button 
          onClick={() => openEditModal()}
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
        >
          + Add Template
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Total Templates</p>
          <p className="text-2xl font-bold text-black">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Total Signed</p>
          <p className="text-2xl font-bold text-green-600">{stats.totalSigned.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Expiring Soon (30 days)</p>
          <p className="text-2xl font-bold text-amber-600">{stats.expiringSoon}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-black">
          <h2 className="font-semibold text-black">Consent Templates</h2>
        </div>
        
        {templates.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-black mb-4">No consent templates found</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleSeedTemplates}
                disabled={seeding}
                className="px-4 py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 disabled:opacity-50"
              >
                {seeding ? 'Loading...' : '✨ Load Default Templates'}
              </button>
              <button
                onClick={() => openEditModal()}
                className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
              >
                Create Custom Template
              </button>
            </div>
            <p className="text-xs text-black mt-3">
              Default templates include: HIPAA, Neurotoxin, Filler, Weight Loss, Photo Release, and more
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {templates.map((template) => (
              <div key={template.id} className="px-5 py-4 flex items-center justify-between hover:bg-white">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-black">{template.name}</p>
                    {!template.is_active && (
                      <span className="px-2 py-0.5 text-xs bg-white text-black rounded-full">
                        Inactive
                      </span>
                    )}
                    {template.requires_witness && (
                      <span className="px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded-full">
                        Witness Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-black">
                    {(template.signed_count || 0).toLocaleString()} signed • 
                    Version {template.version} • 
                    Updated {new Date(template.updated_at).toLocaleDateString()}
                  </p>
                  {template.description && (
                    <p className="text-sm text-black mt-1 truncate max-w-lg">
                      {template.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openPreviewModal(template)}
                    className="px-3 py-1.5 text-sm text-black hover:bg-white rounded-lg transition-colors"
                  >
                    Preview
                  </button>
                  <button 
                    onClick={() => openEditModal(template)}
                    className="px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => toggleActive(template)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      template.is_active 
                        ? 'text-amber-600 hover:bg-amber-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {template.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-black flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black">
                {selectedTemplate ? 'Edit Consent Template' : 'Create Consent Template'}
              </h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-black hover:text-black"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g., Neurotoxin Treatment Consent"
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Slug</label>
                <input
                  type="text"
                  value={editForm.slug}
                  onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                  placeholder="auto-generated-from-name"
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <p className="text-xs text-black mt-1">Leave blank to auto-generate from name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Description</label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Brief description of this consent form"
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Content * (supports Markdown/HTML)</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  placeholder="Enter the full consent form text here..."
                  rows={12}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                    className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-black">Active (available for signing)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.requires_witness}
                    onChange={(e) => setEditForm({ ...editForm, requires_witness: e.target.checked })}
                    className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-black">Requires witness signature</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-black flex items-center justify-between">
              {selectedTemplate && (
                <button
                  onClick={() => {
                    handleDelete(selectedTemplate);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete Template
                </button>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-black hover:bg-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editForm.name || !editForm.content}
                  className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : (selectedTemplate ? 'Save Changes' : 'Create Template')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-black flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-black">{selectedTemplate.name}</h2>
                <p className="text-sm text-black">Version {selectedTemplate.version}</p>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="text-black hover:text-black"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedTemplate.content.replace(/\n/g, '<br>') }}
              />
            </div>

            <div className="px-6 py-4 border-t border-black flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  openEditModal(selectedTemplate);
                }}
                className="px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
              >
                Edit This Template
              </button>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
