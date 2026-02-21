'use client';

// ============================================================
// ADMIN PROVIDERS CONTENT MANAGEMENT
// Upload videos, before/after photos for provider profiles
// ============================================================

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Provider {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  credentials: string;
  headshot_url?: string;
  color: string;
}

interface ProviderMedia {
  id: string;
  provider_id: string;
  type: 'video' | 'before_after' | 'intro_video';
  video_url?: string;
  video_thumbnail_url?: string;
  video_duration?: number;
  video_orientation?: string;
  before_image_url?: string;
  after_image_url?: string;
  title?: string;
  description?: string;
  service_tag?: string;
  caption?: string;
  alt_text?: string;
  featured: boolean;
  display_order: number;
  consent_confirmed: boolean;
  consent_date?: string;
  watermark_enabled: boolean;
  is_active: boolean;
  created_at: string;
}

interface ServiceTag {
  name: string;
  display_name: string;
  category: string;
}

const DEFAULT_SERVICE_TAGS: ServiceTag[] = [
  { name: 'botox', display_name: 'Botox', category: 'Injectables' },
  { name: 'lip_filler', display_name: 'Lip Filler', category: 'Injectables' },
  { name: 'dermal_filler', display_name: 'Dermal Filler', category: 'Injectables' },
  { name: 'prp', display_name: 'PRP', category: 'Regenerative' },
  { name: 'hormone_therapy', display_name: 'Hormone Therapy', category: 'Wellness' },
  { name: 'weight_loss', display_name: 'Weight Loss', category: 'Wellness' },
  { name: 'microneedling', display_name: 'Microneedling', category: 'Skin' },
  { name: 'laser', display_name: 'Laser', category: 'Skin' },
  { name: 'co2_laser', display_name: 'CO₂ Laser', category: 'Skin' },
  { name: 'chemical_peel', display_name: 'Chemical Peel', category: 'Skin' },
  { name: 'hydrafacial', display_name: 'HydraFacial', category: 'Skin' },
];

const DEFAULT_PROVIDERS: Provider[] = [
  {
    id: 'a8f2e9d1-4b7c-4e5a-9f3d-2c1b8a7e6f5d',
    name: 'Danielle Glazier-Alcala',
    first_name: 'Danielle',
    last_name: 'Glazier-Alcala',
    credentials: 'FNP-BC',
    headshot_url: '/images/team/danielle-glazier-alcala.jpg',
    color: '#FF2D8E',
  },
  {
    id: 'b7e6f872-3628-418a-aefb-aca2101f7cb2',
    name: 'Ryan Kent',
    first_name: 'Ryan',
    last_name: 'Kent',
    credentials: 'FNP-C',
    headshot_url: '/images/team/ryan-kent.jpg',
    color: '#2D63A4',
  },
];

export default function AdminProvidersContentPage() {
  const [providers, setProviders] = useState<Provider[]>(DEFAULT_PROVIDERS);
  const [media, setMedia] = useState<ProviderMedia[]>([]);
  const [serviceTags, setServiceTags] = useState<ServiceTag[]>(DEFAULT_SERVICE_TAGS);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'before_after'>('videos');
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState<ProviderMedia | null>(null);
  const [uploadType, setUploadType] = useState<'video' | 'before_after' | 'intro_video'>('video');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch providers
      const providersRes = await fetch('/api/providers').catch(() => null);
      if (providersRes?.ok) {
        const data = await providersRes.json();
        if (data.providers?.length) {
          setProviders(data.providers);
        }
      }

      // Fetch all media (admin view)
      const mediaRes = await fetch('/api/provider-media?admin=true').catch(() => null);
      if (mediaRes?.ok) {
        const data = await mediaRes.json();
        setMedia(data.media || []);
        if (data.serviceTags?.length) {
          setServiceTags(data.serviceTags);
        }
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = selectedProvider
    ? media.filter(m => m.provider_id === selectedProvider)
    : media;

  const videos = filteredMedia.filter(m => m.type === 'video' || m.type === 'intro_video');
  const beforeAfters = filteredMedia.filter(m => m.type === 'before_after');

  const handleSaveMedia = async (formData: Partial<ProviderMedia>) => {
    try {
      const method = editingMedia ? 'PUT' : 'POST';
      const body = editingMedia ? { ...formData, id: editingMedia.id } : formData;

      const res = await fetch('/api/provider-media', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(editingMedia ? 'Media updated successfully!' : 'Media uploaded successfully!');
        setShowUploadModal(false);
        setEditingMedia(null);
        fetchData();
      } else {
        setError(data.error || 'Failed to save media');
      }
    } catch (e) {
      setError('Failed to save media');
    }
  };

  const handleDeleteMedia = async (mediaItem: ProviderMedia) => {
    if (!confirm('Are you sure you want to delete this media? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/provider-media?id=${mediaItem.id}&permanent=true`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccess('Media deleted successfully!');
        setMedia(media.filter(m => m.id !== mediaItem.id));
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete media');
      }
    } catch (e) {
      setError('Failed to delete media');
    }
  };

  const handleToggleActive = async (mediaItem: ProviderMedia) => {
    try {
      const res = await fetch('/api/provider-media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: mediaItem.id,
          is_active: !mediaItem.is_active,
        }),
      });

      if (res.ok) {
        setMedia(media.map(m => 
          m.id === mediaItem.id ? { ...m, is_active: !m.is_active } : m
        ));
      }
    } catch (e) {
      setError('Failed to update media');
    }
  };

  const handleToggleFeatured = async (mediaItem: ProviderMedia) => {
    try {
      const res = await fetch('/api/provider-media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: mediaItem.id,
          featured: !mediaItem.featured,
        }),
      });

      if (res.ok) {
        setMedia(media.map(m => 
          m.id === mediaItem.id ? { ...m, featured: !m.featured } : m
        ));
      }
    } catch (e) {
      setError('Failed to update media');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between items-center">
          <p className="text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="text-red-500">✕</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
          <p className="text-green-700">{success}</p>
          <button onClick={() => setSuccess(null)} className="text-green-500">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Providers Media</h1>
          <p className="text-gray-600">Upload videos and before/after photos for provider profiles</p>
        </div>
        <button
          onClick={() => {
            setEditingMedia(null);
            setShowUploadModal(true);
          }}
          className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black transition-colors"
        >
          + Upload Media
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Videos</p>
          <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Before/After Photos</p>
          <p className="text-2xl font-bold text-gray-900">{beforeAfters.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold text-green-600">{media.filter(m => m.is_active).length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Featured</p>
          <p className="text-2xl font-bold text-pink-600">{media.filter(m => m.featured).length}</p>
        </div>
      </div>

      {/* Provider Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedProvider(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !selectedProvider
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Providers
        </button>
        {providers.map(provider => (
          <button
            key={provider.id}
            onClick={() => setSelectedProvider(provider.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedProvider === provider.id
                ? 'text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            style={selectedProvider === provider.id ? { backgroundColor: provider.color } : {}}
          >
            {provider.first_name}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'videos'
                ? 'border-[#FF2D8E] text-[#FF2D8E]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('before_after')}
            className={`py-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'before_after'
                ? 'border-[#FF2D8E] text-[#FF2D8E]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Before/After ({beforeAfters.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'videos' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No videos uploaded yet</p>
              <button
                onClick={() => {
                  setUploadType('video');
                  setShowUploadModal(true);
                }}
                className="mt-4 text-[#FF2D8E] font-medium hover:underline"
              >
                Upload your first video
              </button>
            </div>
          ) : (
            videos.map(video => {
              const provider = providers.find(p => p.id === video.provider_id);
              return (
                <div 
                  key={video.id}
                  className={`bg-white rounded-xl border overflow-hidden ${
                    !video.is_active ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative aspect-video bg-gray-100">
                    {video.video_thumbnail_url ? (
                      <Image
                        src={video.video_thumbnail_url}
                        alt={video.title || 'Video thumbnail'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-4xl">🎬</span>
                      </div>
                    )}
                    {video.type === 'intro_video' && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                        Intro
                      </span>
                    )}
                    {video.featured && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                    {!video.is_active && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-gray-600 text-white text-xs rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: provider?.color || '#ccc' }}
                      />
                      <span className="text-sm text-gray-500">{provider?.first_name}</span>
                    </div>
                    <h3 className="font-medium text-gray-900">{video.title || 'Untitled'}</h3>
                    {video.service_tag && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded-full">
                        {serviceTags.find(t => t.name === video.service_tag)?.display_name || video.service_tag}
                      </span>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          setEditingMedia(video);
                          setUploadType(video.type as any);
                          setShowUploadModal(true);
                        }}
                        className="flex-1 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(video)}
                        className="py-1.5 px-2 text-sm text-amber-600 hover:bg-amber-50 rounded"
                        title={video.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        {video.featured ? '⭐' : '☆'}
                      </button>
                      <button
                        onClick={() => handleToggleActive(video)}
                        className={`py-1.5 px-2 text-sm rounded ${
                          video.is_active 
                            ? 'text-gray-600 hover:bg-gray-100' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={video.is_active ? 'Hide' : 'Publish'}
                      >
                        {video.is_active ? '👁' : '👁‍🗨'}
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(video)}
                        className="py-1.5 px-2 text-sm text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'before_after' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {beforeAfters.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No before/after photos uploaded yet</p>
              <button
                onClick={() => {
                  setUploadType('before_after');
                  setShowUploadModal(true);
                }}
                className="mt-4 text-[#FF2D8E] font-medium hover:underline"
              >
                Upload your first before/after
              </button>
            </div>
          ) : (
            beforeAfters.map(item => {
              const provider = providers.find(p => p.id === item.provider_id);
              return (
                <div 
                  key={item.id}
                  className={`bg-white rounded-xl border overflow-hidden ${
                    !item.is_active ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/2 relative overflow-hidden">
                        {item.before_image_url && (
                          <Image src={item.before_image_url} alt="Before" fill className="object-cover" />
                        )}
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">Before</span>
                      </div>
                      <div className="w-1/2 relative overflow-hidden border-l-2 border-white">
                        {item.after_image_url && (
                          <Image src={item.after_image_url} alt="After" fill className="object-cover" />
                        )}
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#FF2D8E] text-white text-xs rounded">After</span>
                      </div>
                    </div>
                    {item.featured && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                    {!item.is_active && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-gray-600 text-white text-xs rounded-full">
                        Hidden
                      </span>
                    )}
                    {!item.consent_confirmed && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        ⚠️ No Consent
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: provider?.color || '#ccc' }}
                      />
                      <span className="text-sm text-gray-500">{provider?.first_name}</span>
                    </div>
                    <h3 className="font-medium text-gray-900">{item.title || 'Before & After'}</h3>
                    {item.service_tag && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded-full">
                        {serviceTags.find(t => t.name === item.service_tag)?.display_name || item.service_tag}
                      </span>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          setEditingMedia(item);
                          setUploadType('before_after');
                          setShowUploadModal(true);
                        }}
                        className="flex-1 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className="py-1.5 px-2 text-sm text-amber-600 hover:bg-amber-50 rounded"
                      >
                        {item.featured ? '⭐' : '☆'}
                      </button>
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`py-1.5 px-2 text-sm rounded ${
                          item.is_active ? 'text-gray-600 hover:bg-gray-100' : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {item.is_active ? '👁' : '👁‍🗨'}
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(item)}
                        className="py-1.5 px-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Compliance Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-800 mb-2">⚠️ Compliance Requirements</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Before/after photos require confirmed client consent before publishing</li>
          <li>• All photos must have proper watermarks enabled</li>
          <li>• Results disclaimer is automatically shown on the public page</li>
          <li>• Consent confirmation and date are logged for compliance records</li>
        </ul>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <MediaUploadModal
          media={editingMedia}
          providers={providers}
          serviceTags={serviceTags}
          uploadType={uploadType}
          setUploadType={setUploadType}
          onClose={() => {
            setShowUploadModal(false);
            setEditingMedia(null);
          }}
          onSave={handleSaveMedia}
          selectedProvider={selectedProvider}
        />
      )}
    </div>
  );
}

// Upload/Edit Modal Component
function MediaUploadModal({
  media,
  providers,
  serviceTags,
  uploadType,
  setUploadType,
  onClose,
  onSave,
  selectedProvider,
}: {
  media: ProviderMedia | null;
  providers: Provider[];
  serviceTags: ServiceTag[];
  uploadType: 'video' | 'before_after' | 'intro_video';
  setUploadType: (type: 'video' | 'before_after' | 'intro_video') => void;
  onClose: () => void;
  onSave: (data: Partial<ProviderMedia>) => void;
  selectedProvider: string | null;
}) {
  const [formData, setFormData] = useState<Partial<ProviderMedia>>(
    media || {
      provider_id: selectedProvider || providers[0]?.id,
      type: uploadType,
      title: '',
      description: '',
      caption: '',
      service_tag: '',
      featured: false,
      consent_confirmed: false,
      watermark_enabled: true,
      is_active: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, type: uploadType });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {media ? 'Edit Media' : 'Upload Media'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Media Type */}
          {!media && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
              <div className="flex gap-2">
                {[
                  { value: 'video', label: '🎬 Video' },
                  { value: 'intro_video', label: '👋 Intro Video' },
                  { value: 'before_after', label: '📸 Before/After' },
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setUploadType(option.value as any);
                      setFormData({ ...formData, type: option.value as any });
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      uploadType === option.value
                        ? 'bg-[#FF2D8E] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider *</label>
            <select
              value={formData.provider_id || ''}
              onChange={(e) => setFormData({ ...formData, provider_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              required
            >
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}, {provider.credentials}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Lip Filler Transformation"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {/* Video Fields */}
          {(uploadType === 'video' || uploadType === 'intro_video') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
                <input
                  type="url"
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://storage.example.com/video.mp4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Upload to your CDN/storage and paste the URL here</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.video_thumbnail_url || ''}
                  onChange={(e) => setFormData({ ...formData, video_thumbnail_url: e.target.value })}
                  placeholder="https://storage.example.com/thumbnail.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                <select
                  value={formData.video_orientation || 'horizontal'}
                  onChange={(e) => setFormData({ ...formData, video_orientation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="horizontal">Horizontal (16:9)</option>
                  <option value="vertical">Vertical (9:16)</option>
                  <option value="square">Square (1:1)</option>
                </select>
              </div>
            </>
          )}

          {/* Before/After Fields */}
          {uploadType === 'before_after' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Before Image URL *</label>
                <input
                  type="url"
                  value={formData.before_image_url || ''}
                  onChange={(e) => setFormData({ ...formData, before_image_url: e.target.value })}
                  placeholder="https://storage.example.com/before.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">After Image URL *</label>
                <input
                  type="url"
                  value={formData.after_image_url || ''}
                  onChange={(e) => setFormData({ ...formData, after_image_url: e.target.value })}
                  placeholder="https://storage.example.com/after.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <textarea
                  value={formData.caption || ''}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Brief description of the results..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Consent Checkbox - REQUIRED */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.consent_confirmed || false}
                    onChange={(e) => setFormData({ ...formData, consent_confirmed: e.target.checked })}
                    className="mt-1 h-4 w-4 text-pink-500 rounded border-gray-300 focus:ring-pink-500"
                    required
                  />
                  <div>
                    <span className="font-medium text-amber-800">Client Consent Confirmed *</span>
                    <p className="text-sm text-amber-700 mt-1">
                      I confirm that written consent has been obtained from the client 
                      to publish these before/after photos for marketing purposes.
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.watermark_enabled !== false}
                    onChange={(e) => setFormData({ ...formData, watermark_enabled: e.target.checked })}
                    className="h-4 w-4 text-pink-500 rounded border-gray-300 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">Enable watermark on images</span>
                </label>
              </div>
            </>
          )}

          {/* Service Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Tag</label>
            <select
              value={formData.service_tag || ''}
              onChange={(e) => setFormData({ ...formData, service_tag: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select a service...</option>
              {serviceTags.map(tag => (
                <option key={tag.name} value={tag.name}>
                  {tag.display_name} ({tag.category})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about this media..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Featured Toggle */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-pink-500 rounded border-gray-300 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">⭐ Mark as Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
            >
              {media ? 'Save Changes' : 'Upload Media'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
