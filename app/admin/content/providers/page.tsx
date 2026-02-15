// ============================================================
// ADMIN: PROVIDER CONTENT MANAGEMENT
// Admin → Content → Providers
// Upload videos, before/after photos, manage provider profiles
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Provider {
  id: string;
  slug: string;
  name: string;
  credentials?: string;
  bio?: string;
  philosophy?: string;
  headshot_url?: string;
  active: boolean;
}

interface ProviderMedia {
  id: string;
  provider_id: string;
  type: 'video' | 'before_after';
  video_url?: string;
  thumbnail_url?: string;
  video_orientation?: string;
  before_image_url?: string;
  after_image_url?: string;
  title?: string;
  description?: string;
  service_tag?: string;
  featured: boolean;
  consent_confirmed: boolean;
  watermark_enabled: boolean;
}

const SERVICE_TAGS = [
  { id: 'botox', label: 'Botox' },
  { id: 'lip_filler', label: 'Lip Filler' },
  { id: 'dermal_filler', label: 'Dermal Filler' },
  { id: 'prp', label: 'PRP' },
  { id: 'hormone_therapy', label: 'Hormone Therapy' },
  { id: 'weight_loss', label: 'Weight Loss' },
  { id: 'microneedling', label: 'Microneedling' },
  { id: 'laser', label: 'Laser' },
  { id: 'chemical_peel', label: 'Chemical Peel' },
  { id: 'iv_therapy', label: 'IV Therapy' },
];

// Default providers (until DB is seeded)
const DEFAULT_PROVIDERS: Provider[] = [
  { id: '1', slug: 'danielle', name: 'Danielle', credentials: 'RN, BSN, Aesthetic Injector', active: true },
  { id: '2', slug: 'ryan', name: 'Ryan', credentials: 'PA-C, Medical Provider', active: true },
];

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>(DEFAULT_PROVIDERS);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [media, setMedia] = useState<ProviderMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'videos' | 'beforeafter'>('profile');

  // Upload modals
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Video form
  const [videoForm, setVideoForm] = useState({
    video_url: '', thumbnail_url: '', title: '', description: '',
    service_tag: '', video_orientation: 'horizontal', featured: false,
  });

  // Before/After form
  const [photoForm, setPhotoForm] = useState({
    before_image_url: '', after_image_url: '', title: '', description: '',
    service_tag: '', consent_confirmed: false, watermark_enabled: true, featured: false,
  });

  // Profile form
  const [profileForm, setProfileForm] = useState({
    credentials: '', bio: '', philosophy: '', headshot_url: '',
  });

  const fetchMedia = useCallback(async (providerId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/provider-media?provider_id=${providerId}&consent_only=false`);
      const data = await res.json();
      setMedia(data.media || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      fetchMedia(selectedProvider.id);
      setProfileForm({
        credentials: selectedProvider.credentials || '',
        bio: selectedProvider.bio || '',
        philosophy: selectedProvider.philosophy || '',
        headshot_url: selectedProvider.headshot_url || '',
      });
    }
  }, [selectedProvider, fetchMedia]);

  const handleUploadVideo = async () => {
    if (!selectedProvider || !videoForm.video_url) {
      alert('Video URL is required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/provider-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: selectedProvider.id,
          type: 'video',
          ...videoForm,
        }),
      });
      if (res.ok) {
        setShowVideoModal(false);
        setVideoForm({ video_url: '', thumbnail_url: '', title: '', description: '', service_tag: '', video_orientation: 'horizontal', featured: false });
        fetchMedia(selectedProvider.id);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to upload');
      }
    } catch (err) {
      alert('Failed to upload');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedProvider || !photoForm.before_image_url || !photoForm.after_image_url) {
      alert('Both before and after images are required');
      return;
    }
    if (!photoForm.consent_confirmed) {
      alert('You must confirm client consent before uploading before/after photos');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/provider-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: selectedProvider.id,
          type: 'before_after',
          ...photoForm,
        }),
      });
      if (res.ok) {
        setShowPhotoModal(false);
        setPhotoForm({ before_image_url: '', after_image_url: '', title: '', description: '', service_tag: '', consent_confirmed: false, watermark_enabled: true, featured: false });
        fetchMedia(selectedProvider.id);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to upload');
      }
    } catch (err) {
      alert('Failed to upload');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Delete this media?')) return;
    try {
      await fetch(`/api/provider-media?id=${id}`, { method: 'DELETE' });
      if (selectedProvider) fetchMedia(selectedProvider.id);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFeatured = async (mediaItem: ProviderMedia) => {
    try {
      await fetch('/api/provider-media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: mediaItem.id, featured: !mediaItem.featured }),
      });
      if (selectedProvider) fetchMedia(selectedProvider.id);
    } catch (err) {
      console.error(err);
    }
  };

  const videos = media.filter(m => m.type === 'video');
  const photos = media.filter(m => m.type === 'before_after');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <span className="text-3xl">👩‍⚕️</span>
          Provider Management
        </h1>
        <p className="text-gray-500 mt-1">Manage provider profiles, videos, and before/after galleries</p>
      </div>

      {!selectedProvider ? (
        /* Provider List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider)}
              className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-2xl font-bold text-pink-500">
                  {provider.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                  <p className="text-sm text-gray-500">{provider.credentials}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${provider.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {provider.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </button>
          ))}
          {/* Add Provider */}
          <button className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <span className="text-2xl mr-2">+</span> Add Provider
          </button>
        </div>
      ) : (
        /* Provider Detail View */
        <div>
          <button
            onClick={() => setSelectedProvider(null)}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
          >
            <span className="mr-2">←</span> Back to Providers
          </button>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Provider Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-3xl font-bold text-pink-500">
                  {selectedProvider.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProvider.name}</h2>
                  <p className="text-gray-500">{selectedProvider.credentials}</p>
                </div>
              </div>
              <Link
                href={`/providers/${selectedProvider.slug}`}
                target="_blank"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                View Public Page →
              </Link>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {[
                  { id: 'profile', label: 'Profile', icon: '📝' },
                  { id: 'videos', label: 'Videos', icon: '🎬', count: videos.length },
                  { id: 'beforeafter', label: 'Before/After', icon: '📸', count: photos.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-pink-500 text-pink-500'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.icon} {tab.label} {tab.count !== undefined && <span className="text-gray-400">({tab.count})</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credentials</label>
                    <input
                      type="text"
                      value={profileForm.credentials}
                      onChange={(e) => setProfileForm({ ...profileForm, credentials: e.target.value })}
                      placeholder="e.g., RN, BSN, Aesthetic Injector"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      rows={4}
                      placeholder="Provider biography..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Philosophy</label>
                    <textarea
                      value={profileForm.philosophy}
                      onChange={(e) => setProfileForm({ ...profileForm, philosophy: e.target.value })}
                      rows={3}
                      placeholder="Treatment philosophy quote..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Headshot URL</label>
                    <input
                      type="text"
                      value={profileForm.headshot_url}
                      onChange={(e) => setProfileForm({ ...profileForm, headshot_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <button className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 font-medium">
                    Save Profile
                  </button>
                </div>
              )}

              {/* Videos Tab */}
              {activeTab === 'videos' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Videos</h3>
                    <button
                      onClick={() => setShowVideoModal(true)}
                      className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 flex items-center gap-2"
                    >
                      + Upload Video
                    </button>
                  </div>
                  {loading ? (
                    <div className="animate-pulse"><div className="h-40 bg-gray-100 rounded-xl" /></div>
                  ) : videos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <span className="text-4xl block mb-4">🎬</span>
                      <p className="text-gray-500">No videos uploaded yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {videos.map((v) => (
                        <div key={v.id} className="bg-gray-50 rounded-xl overflow-hidden border">
                          <div className="aspect-video bg-gray-200 flex items-center justify-center text-4xl text-gray-400">▶</div>
                          <div className="p-4">
                            <p className="font-medium text-gray-900">{v.title || 'Untitled'}</p>
                            <p className="text-sm text-gray-500">{v.service_tag || 'No tag'}</p>
                            <div className="flex gap-2 mt-3">
                              <button onClick={() => toggleFeatured(v)} className={`text-sm px-2 py-1 rounded ${v.featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                ⭐ Featured
                              </button>
                              <button onClick={() => handleDeleteMedia(v.id)} className="text-sm px-2 py-1 bg-red-50 text-red-600 rounded">Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Before/After Tab */}
              {activeTab === 'beforeafter' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Before/After Gallery</h3>
                    <button
                      onClick={() => setShowPhotoModal(true)}
                      className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 flex items-center gap-2"
                    >
                      + Upload Before/After
                    </button>
                  </div>
                  {loading ? (
                    <div className="animate-pulse"><div className="h-40 bg-gray-100 rounded-xl" /></div>
                  ) : photos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <span className="text-4xl block mb-4">📸</span>
                      <p className="text-gray-500">No before/after photos yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {photos.map((p) => (
                        <div key={p.id} className="bg-gray-50 rounded-xl overflow-hidden border">
                          <div className="flex aspect-[2/1]">
                            <div className="w-1/2 bg-gray-200 flex items-center justify-center text-xs text-gray-400">Before</div>
                            <div className="w-1/2 bg-pink-100 flex items-center justify-center text-xs text-pink-400">After</div>
                          </div>
                          <div className="p-4">
                            <p className="font-medium text-gray-900">{p.title || 'Untitled'}</p>
                            <p className="text-sm text-gray-500">{p.service_tag?.replace('_', ' ') || 'No tag'}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className={`text-xs px-2 py-1 rounded ${p.consent_confirmed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {p.consent_confirmed ? '✓ Consent' : '⚠ No Consent'}
                              </span>
                              <button onClick={() => toggleFeatured(p)} className={`text-sm px-2 py-1 rounded ${p.featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                ⭐
                              </button>
                              <button onClick={() => handleDeleteMedia(p.id)} className="text-sm px-2 py-1 bg-red-50 text-red-600 rounded">Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Upload Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b flex justify-between">
              <h2 className="text-xl font-bold">Upload Video</h2>
              <button onClick={() => setShowVideoModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Video URL *</label>
                <input type="text" value={videoForm.video_url} onChange={e => setVideoForm({...videoForm, video_url: e.target.value})} placeholder="https://..." className="w-full px-4 py-2 border rounded-xl"/>
                <p className="text-xs text-gray-500 mt-1">Upload to cloud storage (Cloudflare, AWS, etc) and paste URL</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                <input type="text" value={videoForm.thumbnail_url} onChange={e => setVideoForm({...videoForm, thumbnail_url: e.target.value})} placeholder="https://..." className="w-full px-4 py-2 border rounded-xl"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input type="text" value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} placeholder="Video title" className="w-full px-4 py-2 border rounded-xl"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={videoForm.description} onChange={e => setVideoForm({...videoForm, description: e.target.value})} rows={2} className="w-full px-4 py-2 border rounded-xl"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Tag</label>
                  <select value={videoForm.service_tag} onChange={e => setVideoForm({...videoForm, service_tag: e.target.value})} className="w-full px-4 py-2 border rounded-xl">
                    <option value="">Select...</option>
                    {SERVICE_TAGS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Orientation</label>
                  <select value={videoForm.video_orientation} onChange={e => setVideoForm({...videoForm, video_orientation: e.target.value})} className="w-full px-4 py-2 border rounded-xl">
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical (Reels)</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={videoForm.featured} onChange={e => setVideoForm({...videoForm, featured: e.target.checked})} className="w-4 h-4 rounded"/>
                <span className="text-sm">Featured video</span>
              </label>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowVideoModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button onClick={handleUploadVideo} disabled={!videoForm.video_url || saving} className="px-6 py-2 bg-pink-500 text-white rounded-xl disabled:opacity-50">
                {saving ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Before/After Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b flex justify-between">
              <h2 className="text-xl font-bold">Upload Before/After</h2>
              <button onClick={() => setShowPhotoModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Before Image URL *</label>
                  <input type="text" value={photoForm.before_image_url} onChange={e => setPhotoForm({...photoForm, before_image_url: e.target.value})} placeholder="https://..." className="w-full px-4 py-2 border rounded-xl"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">After Image URL *</label>
                  <input type="text" value={photoForm.after_image_url} onChange={e => setPhotoForm({...photoForm, after_image_url: e.target.value})} placeholder="https://..." className="w-full px-4 py-2 border rounded-xl"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input type="text" value={photoForm.title} onChange={e => setPhotoForm({...photoForm, title: e.target.value})} placeholder="e.g., Lip Filler - 1 syringe" className="w-full px-4 py-2 border rounded-xl"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={photoForm.description} onChange={e => setPhotoForm({...photoForm, description: e.target.value})} rows={2} className="w-full px-4 py-2 border rounded-xl"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Service Tag</label>
                <select value={photoForm.service_tag} onChange={e => setPhotoForm({...photoForm, service_tag: e.target.value})} className="w-full px-4 py-2 border rounded-xl">
                  <option value="">Select...</option>
                  {SERVICE_TAGS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <label className="flex items-start gap-3">
                  <input type="checkbox" checked={photoForm.consent_confirmed} onChange={e => setPhotoForm({...photoForm, consent_confirmed: e.target.checked})} className="w-5 h-5 rounded mt-0.5"/>
                  <div>
                    <span className="font-medium text-yellow-800">Client Consent Confirmed *</span>
                    <p className="text-sm text-yellow-700 mt-1">I confirm that written consent has been obtained from the client to use these photos for marketing purposes.</p>
                  </div>
                </label>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={photoForm.watermark_enabled} onChange={e => setPhotoForm({...photoForm, watermark_enabled: e.target.checked})} className="w-4 h-4 rounded"/>
                  <span className="text-sm">Add watermark</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={photoForm.featured} onChange={e => setPhotoForm({...photoForm, featured: e.target.checked})} className="w-4 h-4 rounded"/>
                  <span className="text-sm">Featured</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowPhotoModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button onClick={handleUploadPhoto} disabled={!photoForm.before_image_url || !photoForm.after_image_url || !photoForm.consent_confirmed || saving} className="px-6 py-2 bg-pink-500 text-white rounded-xl disabled:opacity-50">
                {saving ? 'Uploading...' : 'Upload Photos'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
