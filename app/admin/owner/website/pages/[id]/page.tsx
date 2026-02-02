'use client';

// ============================================================
// PAGE EDITOR - OWNER MODE CMS
// Section-based page builder - NO DEV REQUIRED
// ============================================================

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import OwnerLayout from '../../../layout-wrapper';

interface Section {
  id: string;
  type: string;
  content: Record<string, any>;
  visible: boolean;
}

interface Page {
  id: string;
  slug: string;
  title: string;
  status: string;
  visibility: string;
  template: string;
  meta_title: string;
  meta_description: string;
  og_image_url: string;
  no_index: boolean;
  sections: Section[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

interface PageVersion {
  id: string;
  version_number: number;
  title: string;
  created_at: string;
  change_summary: string;
}

const SECTION_TYPES = {
  hero: { name: 'Hero', icon: '🎯', color: 'purple' },
  services_grid: { name: 'Services Grid', icon: '🏥', color: 'blue' },
  pricing: { name: 'Pricing Cards', icon: '💰', color: 'green' },
  providers: { name: 'Provider Bios', icon: '👩‍⚕️', color: 'pink' },
  testimonials: { name: 'Testimonials', icon: '⭐', color: 'yellow' },
  faq: { name: 'FAQ', icon: '❓', color: 'orange' },
  promo_banner: { name: 'Promo Banner', icon: '🎉', color: 'red' },
  booking: { name: 'Booking Widget', icon: '📅', color: 'indigo' },
  text: { name: 'Text Block', icon: '📝', color: 'gray' },
  image: { name: 'Image', icon: '🖼️', color: 'cyan' },
  video: { name: 'Video', icon: '🎬', color: 'rose' },
  gallery: { name: 'Gallery', icon: '📸', color: 'teal' },
  contact: { name: 'Contact Section', icon: '📞', color: 'emerald' },
  cta: { name: 'CTA Block', icon: '🔗', color: 'violet' },
  divider: { name: 'Divider', icon: '➖', color: 'slate' },
};

export default function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const pageId = resolvedParams.id;

  const [page, setPage] = useState<Page | null>(null);
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings' | 'history'>('content');
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const fetchPage = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cms/pages?id=${pageId}&versions=true`);
      const data = await res.json();
      
      if (data.page) {
        setPage({
          ...data.page,
          sections: data.page.sections || [],
        });
        setVersions(data.versions || []);
      }
    } catch (err) {
      console.error('Failed to fetch page:', err);
      setMessage({ type: 'error', text: 'Failed to load page' });
    } finally {
      setIsLoading(false);
    }
  };

  const savePage = async () => {
    if (!page) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/cms/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: page.id,
          title: page.title,
          slug: page.slug,
          meta_title: page.meta_title,
          meta_description: page.meta_description,
          og_image_url: page.og_image_url,
          no_index: page.no_index,
          sections: page.sections,
          visibility: page.visibility,
          template: page.template,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Page saved!' });
        setHasChanges(false);
        fetchPage(); // Refresh to get new version
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save page' });
    } finally {
      setIsSaving(false);
    }
  };

  const publishPage = async () => {
    if (!page) return;

    // Save first if there are changes
    if (hasChanges) await savePage();

    try {
      const res = await fetch('/api/cms/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: page.id, action: 'publish' }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Page published!' });
        fetchPage();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to publish' });
    }
  };

  const addSection = (type: string) => {
    if (!page) return;
    
    const newSection: Section = {
      id: crypto.randomUUID(),
      type,
      content: getDefaultContent(type),
      visible: true,
    };

    setPage({
      ...page,
      sections: [...page.sections, newSection],
    });
    setShowAddSection(false);
    setHasChanges(true);
    setEditingSection(newSection.id);
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    if (!page) return;

    setPage({
      ...page,
      sections: page.sections.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    });
    setHasChanges(true);
  };

  const removeSection = (sectionId: string) => {
    if (!page) return;
    if (!window.confirm('Remove this section?')) return;

    setPage({
      ...page,
      sections: page.sections.filter(s => s.id !== sectionId),
    });
    setHasChanges(true);
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!page) return;

    const idx = page.sections.findIndex(s => s.id === sectionId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === page.sections.length - 1) return;

    const newSections = [...page.sections];
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newSections[idx], newSections[newIdx]] = [newSections[newIdx], newSections[idx]];

    setPage({ ...page, sections: newSections });
    setHasChanges(true);
  };

  const restoreVersion = async (versionId: string) => {
    if (!page) return;
    if (!window.confirm('Restore this version? Current changes will be lost.')) return;

    try {
      const res = await fetch('/api/cms/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: page.id, action: 'restore_version', version_id: versionId }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Version restored!' });
        fetchPage();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to restore version' });
    }
  };

  if (isLoading) {
    return (
      <OwnerLayout title="Loading..." description="">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin text-4xl">📄</div>
        </div>
      </OwnerLayout>
    );
  }

  if (!page) {
    return (
      <OwnerLayout title="Page Not Found" description="">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">This page could not be found.</p>
          <Link href="/admin/owner/website/pages" className="text-purple-600">
            ← Back to Pages
          </Link>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout 
      title={`Edit: ${page.title}`} 
      description={`/${page.slug}`}
    >
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right">×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/owner/website/pages" className="text-gray-400 hover:text-gray-600">
            ← Back
          </Link>
          <input
            type="text"
            value={page.title}
            onChange={(e) => { setPage({ ...page, title: e.target.value }); setHasChanges(true); }}
            className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none"
          />
          <span className={`text-xs px-2 py-1 rounded ${
            page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {page.status}
          </span>
          {hasChanges && (
            <span className="text-xs text-amber-600">• Unsaved changes</span>
          )}
        </div>
        <div className="flex gap-3">
          <a
            href={`/${page.slug}`}
            target="_blank"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            👁️ Preview
          </a>
          <button
            onClick={savePage}
            disabled={isSaving || !hasChanges}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={publishPage}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {page.status === 'published' ? 'Update Live' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {(['content', 'seo', 'settings', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm capitalize ${
              activeTab === tab 
                ? 'border-b-2 border-purple-500 text-purple-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Tab - Section Builder */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          {/* Sections List */}
          {page.sections.map((section, idx) => (
            <div
              key={section.id}
              className={`bg-white rounded-xl border ${!section.visible ? 'opacity-50' : ''} ${
                editingSection === section.id ? 'border-purple-500 ring-2 ring-purple-100' : ''
              }`}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{SECTION_TYPES[section.type as keyof typeof SECTION_TYPES]?.icon || '📦'}</span>
                  <div>
                    <h3 className="font-medium">{SECTION_TYPES[section.type as keyof typeof SECTION_TYPES]?.name || section.type}</h3>
                    <p className="text-xs text-gray-400">Section {idx + 1}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={idx === page.sections.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => updateSection(section.id, { visible: !section.visible })}
                    className={`p-1 ${section.visible ? 'text-green-500' : 'text-gray-400'}`}
                  >
                    {section.visible ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <button
                    onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                    className="p-1 text-gray-400 hover:text-purple-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => removeSection(section.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Section Editor */}
              {editingSection === section.id && (
                <div className="p-4 bg-gray-50">
                  <SectionEditor
                    type={section.type}
                    content={section.content}
                    onChange={(content) => updateSection(section.id, { content })}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Add Section Button */}
          <button
            onClick={() => setShowAddSection(true)}
            className="w-full p-4 border-2 border-dashed rounded-xl text-gray-400 hover:text-purple-600 hover:border-purple-300"
          >
            + Add Section
          </button>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
            <div className="flex items-center">
              <span className="text-gray-400 mr-1">/</span>
              <input
                type="text"
                value={page.slug}
                onChange={(e) => { setPage({ ...page, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }); setHasChanges(true); }}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              type="text"
              value={page.meta_title || ''}
              onChange={(e) => { setPage({ ...page, meta_title: e.target.value }); setHasChanges(true); }}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder={page.title}
            />
            <p className="text-xs text-gray-400 mt-1">{(page.meta_title || page.title).length}/60 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              value={page.meta_description || ''}
              onChange={(e) => { setPage({ ...page, meta_description: e.target.value }); setHasChanges(true); }}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="Brief description for search engines..."
            />
            <p className="text-xs text-gray-400 mt-1">{(page.meta_description || '').length}/160 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
            <input
              type="text"
              value={page.og_image_url || ''}
              onChange={(e) => { setPage({ ...page, og_image_url: e.target.value }); setHasChanges(true); }}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={page.no_index}
              onChange={(e) => { setPage({ ...page, no_index: e.target.checked }); setHasChanges(true); }}
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-700">No Index (hide from search engines)</label>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
            <select
              value={page.visibility}
              onChange={(e) => { setPage({ ...page, visibility: e.target.value }); setHasChanges(true); }}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="public">Public</option>
              <option value="hidden">Hidden (direct link only)</option>
              <option value="gated">Gated (requires login)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select
              value={page.template}
              onChange={(e) => { setPage({ ...page, template: e.target.value }); setHasChanges(true); }}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="default">Default</option>
              <option value="landing">Landing Page</option>
              <option value="service">Service Page</option>
              <option value="blog">Blog Post</option>
            </select>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border">
          {versions.length > 0 ? (
            <div className="divide-y">
              {versions.map(version => (
                <div key={version.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Version {version.version_number}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(version.created_at).toLocaleString()}
                      </p>
                      {version.change_summary && (
                        <p className="text-xs text-gray-400 mt-1">{version.change_summary}</p>
                      )}
                    </div>
                    <button
                      onClick={() => restoreVersion(version.id)}
                      className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No version history yet. Save changes to create versions.
            </div>
          )}
        </div>
      )}

      {/* Add Section Modal */}
      {showAddSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add Section</h2>
              <button onClick={() => setShowAddSection(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(SECTION_TYPES).map(([type, info]) => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="p-4 border rounded-xl text-left hover:border-purple-300 hover:bg-purple-50"
                >
                  <span className="text-2xl block mb-2">{info.icon}</span>
                  <p className="font-medium">{info.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}

// Section Editor Component
function SectionEditor({ 
  type, 
  content, 
  onChange 
}: { 
  type: string; 
  content: Record<string, any>; 
  onChange: (content: Record<string, any>) => void;
}) {
  const updateContent = (key: string, value: any) => {
    onChange({ ...content, [key]: value });
  };

  // Render different editors based on section type
  switch (type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input
              type="text"
              value={content.headline || ''}
              onChange={(e) => updateContent('headline', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
            <input
              type="text"
              value={content.subheadline || ''}
              onChange={(e) => updateContent('subheadline', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
            <input
              type="text"
              value={content.image_url || ''}
              onChange={(e) => updateContent('image_url', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
              <input
                type="text"
                value={content.cta_text || ''}
                onChange={(e) => updateContent('cta_text', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA URL</label>
              <input
                type="text"
                value={content.cta_url || ''}
                onChange={(e) => updateContent('cta_url', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={content.content || ''}
              onChange={(e) => updateContent('content', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={6}
            />
          </div>
        </div>
      );

    case 'services_grid':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={content.title || 'Our Services'}
              onChange={(e) => updateContent('title', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
              <select
                value={content.columns || 3}
                onChange={(e) => updateContent('columns', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={content.show_prices ?? true}
                onChange={(e) => updateContent('show_prices', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700">Show Prices</label>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-sm text-gray-500">
          <p>Configure this {type} section.</p>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      );
  }
}

// Helper function for default content
function getDefaultContent(type: string): Record<string, any> {
  switch (type) {
    case 'hero':
      return { headline: 'Welcome', subheadline: '', cta_text: 'Book Now', cta_url: '/book' };
    case 'text':
      return { title: '', content: '', alignment: 'left' };
    case 'services_grid':
      return { title: 'Our Services', columns: 3, show_prices: true };
    case 'testimonials':
      return { title: 'What Our Clients Say', display: 'carousel' };
    case 'faq':
      return { title: 'Frequently Asked Questions', items: [] };
    case 'contact':
      return { show_map: true, show_hours: true };
    case 'booking':
      return { title: 'Schedule Your Appointment' };
    default:
      return {};
  }
}
