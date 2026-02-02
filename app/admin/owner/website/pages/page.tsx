'use client';

// ============================================================
// PAGE MANAGER - OWNER MODE CMS
// Create, edit, publish pages - NO DEV REQUIRED
// ============================================================

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import OwnerLayout from '../../layout-wrapper';

interface Page {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  visibility: string;
  template: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const TEMPLATES = [
  { id: 'default', name: 'Default', description: 'Standard page layout' },
  { id: 'landing', name: 'Landing Page', description: 'Full-width hero, conversion focused' },
  { id: 'service', name: 'Service Page', description: 'Treatment/service detail' },
  { id: 'blog', name: 'Blog Post', description: 'Article layout with sidebar' },
];

// Wrapper component for Suspense boundary
export default function PagesManagerPage() {
  return (
    <Suspense fallback={
      <OwnerLayout title="Pages" description="Create and manage website pages">
        <div className="p-8 text-center">
          <div className="animate-spin text-4xl mb-4">📄</div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </OwnerLayout>
    }>
      <PagesManagerContent />
    </Suspense>
  );
}

function PagesManagerContent() {
  const searchParams = useSearchParams();
  const showNew = searchParams.get('new') === 'true';
  
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(showNew);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Create form
  const [createForm, setCreateForm] = useState({
    title: '',
    slug: '',
    template: 'default',
  });

  useEffect(() => {
    fetchPages();
  }, [statusFilter]);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      
      const res = await fetch(`/api/cms/pages?${params}`);
      const data = await res.json();
      setPages(data.pages || []);
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!createForm.title) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/cms/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: createForm.title,
          slug: createForm.slug || createForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          template: createForm.template,
          status: 'draft',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Page created!' });
        setShowCreateModal(false);
        setCreateForm({ title: '', slug: '', template: 'default' });
        fetchPages();
        
        // Redirect to editor
        window.location.href = `/admin/owner/website/pages/${data.page.id}`;
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create page' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to create page' });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (pageId: string) => {
    try {
      const res = await fetch('/api/cms/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pageId, action: 'publish' }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Page published!' });
        fetchPages();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to publish' });
    }
  };

  const handleUnpublish = async (pageId: string) => {
    try {
      const res = await fetch('/api/cms/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pageId, action: 'unpublish' }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Page unpublished' });
        fetchPages();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to unpublish' });
    }
  };

  const handleArchive = async (pageId: string) => {
    if (!window.confirm('Archive this page? It will no longer be visible.')) return;

    try {
      const res = await fetch('/api/cms/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pageId, action: 'archive' }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Page archived' });
        fetchPages();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to archive' });
    }
  };

  const filteredPages = pages.filter(page => {
    if (searchTerm && !page.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !page.slug.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-gray-100 text-gray-600';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'archived': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <OwnerLayout title="Pages" description="Create and manage website pages">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right">×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Create Page
        </button>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin text-4xl mb-4">📄</div>
            <p className="text-gray-500">Loading pages...</p>
          </div>
        ) : filteredPages.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">PAGE</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">URL</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">STATUS</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">TEMPLATE</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">UPDATED</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPages.map(page => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/owner/website/pages/${page.id}`} className="font-medium hover:text-purple-600">
                      {page.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm text-gray-500">/{page.slug}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(page.status)}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{page.template}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(page.updated_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <Link
                        href={`/admin/owner/website/pages/${page.id}`}
                        className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Edit
                      </Link>
                      {page.status === 'draft' ? (
                        <button
                          onClick={() => handlePublish(page.id)}
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Publish
                        </button>
                      ) : page.status === 'published' ? (
                        <button
                          onClick={() => handleUnpublish(page.id)}
                          className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                        >
                          Unpublish
                        </button>
                      ) : null}
                      {page.status !== 'archived' && (
                        <button
                          onClick={() => handleArchive(page.id)}
                          className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          Archive
                        </button>
                      )}
                      {page.status === 'published' && (
                        <a
                          href={`/${page.slug}`}
                          target="_blank"
                          className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <span className="text-4xl block mb-3">📄</span>
            <h3 className="font-medium text-gray-700 mb-1">No pages yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first page to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              + Create Page
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Page</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title *</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm(prev => ({ 
                    ...prev, 
                    title: e.target.value,
                    slug: prev.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Botox Treatments"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">/</span>
                  <input
                    type="text"
                    value={createForm.slug}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="botox-treatments"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setCreateForm(prev => ({ ...prev, template: template.id }))}
                      className={`p-3 border rounded-lg text-left ${
                        createForm.template === template.id ? 'border-purple-500 bg-purple-50' : ''
                      }`}
                    >
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !createForm.title}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Page'}
              </button>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
