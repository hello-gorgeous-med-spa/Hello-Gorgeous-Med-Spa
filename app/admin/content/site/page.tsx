'use client';

// ============================================================
// ADMIN: CONTENT MANAGEMENT SYSTEM (CMS)
// Edit website copy without code deployment
// ============================================================

import { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/ui';

interface ContentBlock {
  id?: string;
  key: string;
  label: string;
  page: string;
  content: Record<string, any>;
  content_type: string;
  is_active: boolean;
  updated_at?: string;
}

const PAGES = [
  { id: 'global', label: 'Global (All Pages)' },
  { id: 'homepage', label: 'Homepage' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
  { id: 'booking', label: 'Booking' },
];

const CONTENT_TYPES = [
  { id: 'text', label: 'Text' },
  { id: 'rich_text', label: 'Rich Text' },
  { id: 'json', label: 'JSON (Multiple Fields)' },
  { id: 'image', label: 'Image URL' },
  { id: 'link', label: 'Link' },
];

// Default content blocks to show in UI
const DEFAULT_BLOCKS: ContentBlock[] = [
  {
    key: 'homepage_hero',
    label: 'Homepage Hero Section',
    page: 'homepage',
    content: {
      headline: 'Luxury Aesthetics. Real Results.',
      subheadline: 'Medical-grade treatments delivered with care',
      cta_text: 'Book Now',
      cta_link: '/book',
    },
    content_type: 'json',
    is_active: true,
  },
  {
    key: 'homepage_tagline',
    label: 'Homepage Tagline',
    page: 'homepage',
    content: {
      text: 'Where Science Meets Beauty',
    },
    content_type: 'text',
    is_active: true,
  },
  {
    key: 'contact_info',
    label: 'Contact Information',
    page: 'global',
    content: {
      phone: '630-636-6193',
      text_phone: '630-881-3398',
      email: 'hellogorgeousskin@yahoo.com',
      address: '74 W. Washington Street, Oswego, IL 60543',
    },
    content_type: 'json',
    is_active: true,
  },
  {
    key: 'business_hours',
    label: 'Business Hours',
    page: 'global',
    content: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 7:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'By Appointment',
      sunday: 'Closed',
    },
    content_type: 'json',
    is_active: true,
  },
  {
    key: 'announcement_banner',
    label: 'Announcement Banner',
    page: 'global',
    content: {
      text: "Can't get in with your doctor? We have same-day appointments!",
      link: '/book',
      link_text: 'Book Now',
      is_visible: true,
      bg_color: '#FF2D8E',
    },
    content_type: 'json',
    is_active: true,
  },
  {
    key: 'footer_disclaimer',
    label: 'Footer Disclaimer',
    page: 'global',
    content: {
      text: 'Medical spa services vary by provider, eligibility, and treatment plan.',
    },
    content_type: 'text',
    is_active: true,
  },
];

export default function CMSPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>(DEFAULT_BLOCKS);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state for editing
  const [editForm, setEditForm] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/cms');
      const data = await res.json();
      
      if (data.content && typeof data.content === 'object') {
        // Convert map to array, merging with defaults
        const contentArray: ContentBlock[] = [];
        const loadedKeys = new Set<string>();

        // Add loaded content
        Object.entries(data.content).forEach(([key, value]: [string, any]) => {
          loadedKeys.add(key);
          contentArray.push({
            id: value._meta?.id,
            key,
            label: value._meta?.label || key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
            page: value._meta?.page || 'global',
            content: value,
            content_type: 'json',
            is_active: true,
            updated_at: value._meta?.updated_at,
          });
        });

        // Add defaults that weren't loaded
        DEFAULT_BLOCKS.forEach(block => {
          if (!loadedKeys.has(block.key)) {
            contentArray.push(block);
          }
        });

        setBlocks(contentArray);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlocks = selectedPage === 'all' 
    ? blocks 
    : blocks.filter(b => b.page === selectedPage);

  const openEdit = (block: ContentBlock) => {
    setEditingBlock(block);
    setEditForm(block.content);
    setMessage(null);
  };

  const openAdd = () => {
    setEditingBlock(null);
    setEditForm({});
    setShowAddModal(true);
    setMessage(null);
  };

  const saveContent = async () => {
    if (!editingBlock && !showAddModal) return;

    setSaving(true);
    setMessage(null);

    try {
      const isNew = showAddModal && !editingBlock?.id;
      const endpoint = '/api/cms';
      const method = isNew ? 'POST' : 'PUT';

      const body = isNew ? {
        key: editForm.key || `custom_${Date.now()}`,
        page: editForm.page || 'global',
        content: editForm,
        label: editForm.label || 'Custom Content',
        content_type: editForm.content_type || 'json',
      } : {
        id: editingBlock?.id,
        key: editingBlock?.key,
        content: editForm,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      setMessage({ type: 'success', text: 'Content saved!' });
      await fetchContent();

      setTimeout(() => {
        setEditingBlock(null);
        setShowAddModal(false);
        setMessage(null);
      }, 1000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save content' });
    } finally {
      setSaving(false);
    }
  };

  const renderContentEditor = () => {
    if (!editingBlock && !showAddModal) return null;

    const content = editForm;
    const contentType = editingBlock?.content_type || 'json';

    return (
      <div className="space-y-4">
        {contentType === 'text' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={content.text || ''}
              onChange={(e) => setEditForm({ ...content, text: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              rows={4}
            />
          </div>
        ) : (
          // JSON editor - render each field
          Object.entries(content).forEach(([key, value]) => {
            if (key.startsWith('_')) return null; // Skip meta fields
          }),
          Object.entries(content)
            .filter(([key]) => !key.startsWith('_'))
            .map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                {typeof value === 'boolean' ? (
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...content, [key]: !value })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      value ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      value ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                ) : typeof value === 'string' && value.length > 100 ? (
                  <textarea
                    value={value}
                    onChange={(e) => setEditForm({ ...content, [key]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    rows={3}
                  />
                ) : (
                  <input
                    type="text"
                    value={String(value || '')}
                    onChange={(e) => setEditForm({ ...content, [key]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                )}
              </div>
            ))
        )}

        {/* Add new field button */}
        <button
          type="button"
          onClick={() => {
            const fieldName = prompt('Enter field name (e.g., subtitle):');
            if (fieldName) {
              setEditForm({ ...content, [fieldName]: '' });
            }
          }}
          className="text-sm text-pink-600 hover:text-pink-700"
        >
          + Add Field
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Content (CMS)</h1>
          <p className="text-gray-600">Loading content...</p>
        </div>
        <div className="bg-white rounded-xl border p-8 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Content (CMS)</h1>
          <p className="text-gray-600">
            Edit website text, banners, and content without code deployment
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700"
        >
          + Add Content Block
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-medium text-blue-900">No Developer Needed</p>
            <p className="text-sm text-blue-700">
              Changes you make here update the website instantly. No code deployment required.
            </p>
          </div>
        </div>
      </div>

      {/* Page Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedPage('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            selectedPage === 'all' 
              ? 'bg-pink-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Pages
        </button>
        {PAGES.map(page => (
          <button
            key={page.id}
            onClick={() => setSelectedPage(page.id)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedPage === page.id 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        {filteredBlocks.map(block => (
          <div
            key={block.key}
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
          >
            <div className="p-4 flex items-center justify-between border-b bg-gray-50">
              <div>
                <h3 className="font-semibold text-gray-900">{block.label}</h3>
                <p className="text-sm text-gray-500">
                  Page: {PAGES.find(p => p.id === block.page)?.label || block.page}
                  {block.updated_at && ` • Last updated: ${new Date(block.updated_at).toLocaleDateString()}`}
                </p>
              </div>
              <button
                onClick={() => openEdit(block)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
              >
                Edit
              </button>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-600 space-y-1">
                {Object.entries(block.content)
                  .filter(([key]) => !key.startsWith('_'))
                  .slice(0, 4)
                  .map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-medium text-gray-500 min-w-[120px]">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="truncate">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value).substring(0, 100)}
                      </span>
                    </div>
                  ))}
                {Object.keys(block.content).filter(k => !k.startsWith('_')).length > 4 && (
                  <p className="text-gray-400 italic">
                    +{Object.keys(block.content).filter(k => !k.startsWith('_')).length - 4} more fields
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredBlocks.length === 0 && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <p className="text-gray-500">No content blocks for this page yet.</p>
            <button
              onClick={openAdd}
              className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              + Add Content Block
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {(editingBlock || showAddModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBlock ? `Edit: ${editingBlock.label}` : 'Add Content Block'}
              </h2>
              <button
                onClick={() => { setEditingBlock(null); setShowAddModal(false); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Message */}
            {message && (
              <div className={`mx-6 mt-4 p-3 rounded-lg text-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {renderContentEditor()}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => { setEditingBlock(null); setShowAddModal(false); }}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveContent}
                disabled={saving}
                className="px-6 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
