'use client';

// ============================================================
// PROVIDER MEDIA MANAGEMENT
// Upload/manage videos and before/after photos
// ============================================================

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Provider {
  id: string;
  name: string;
  slug: string;
}

interface MediaItem {
  id: string;
  provider_id: string;
  type: 'video' | 'before_after';
  video_url: string | null;
  video_thumbnail_url: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  title: string | null;
  description: string | null;
  service_tag: string | null;
  is_featured: boolean;
  consent_confirmed: boolean;
  has_watermark: boolean;
  display_order: number;
}

interface ServiceTag {
  id: string;
  name: string;
  slug: string;
}

export default function ProviderMediaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const providerId = resolvedParams.id;

  const [provider, setProvider] = useState<Provider | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [serviceTags, setServiceTags] = useState<ServiceTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'before_after'>('videos');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'before_after'>('video');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, [providerId]);

  const fetchData = async () => {
    try {
      const [providerRes, mediaRes, tagsRes] = await Promise.all([
        fetch(`/api/providers?id=${providerId}`),
        fetch(`/api/providers/media?provider_id=${providerId}`),
        fetch('/api/service-tags'),
      ]);

      const providerData = await providerRes.json();
      const mediaData = await mediaRes.json();
      const tagsData = await tagsRes.json();

      setProvider(providerData.provider);
      setMedia(mediaData.media || []);
      setServiceTags(tagsData.tags || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (data: Partial<MediaItem>) => {
    try {
      const res = await fetch('/api/providers/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, provider_id: providerId }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Media uploaded!' });
        fetchData();
        setShowUploadModal(false);
      } else {
        const result = await res.json();
        setMessage({ type: 'error', text: result.error || 'Failed to upload' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to upload media' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media item?')) return;

    try {
      const res = await fetch(`/api/providers/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Media deleted' });
        fetchData();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
  };

  const handleToggleFeatured = async (item: MediaItem) => {
    try {
      await fetch('/api/providers/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_featured: !item.is_featured }),
      });
      fetchData();
    } catch {
      setMessage({ type: 'error', text: 'Failed to update' });
    }
  };

  const videos = media.filter((m) => m.type === 'video');
  const beforeAfters = media.filter((m) => m.type === 'before_after');

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Provider not found</p>
        <Link href="/admin/content/providers" className="text-[#E6007E] hover:underline mt-2 block">
          ← Back to providers
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/content/providers" className="text-[#E6007E] hover:underline text-sm">
          ← Back to providers
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          Media for {provider.name}
        </h1>
        <p className="text-gray-500">Upload and manage videos and before/after photos</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'videos'
              ? 'text-[#E6007E] border-b-2 border-[#E6007E]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🎬 Videos ({videos.length})
        </button>
        <button
          onClick={() => setActiveTab('before_after')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'before_after'
              ? 'text-[#E6007E] border-b-2 border-[#E6007E]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📸 Before/After ({beforeAfters.length})
        </button>
      </div>

      {/* Upload Button */}
      <button
        onClick={() => {
          setUploadType(activeTab === 'videos' ? 'video' : 'before_after');
          setShowUploadModal(true);
        }}
        className="mb-6 px-5 py-2.5 bg-[#E6007E] text-white rounded-xl hover:bg-[#E6007E]/90 font-medium"
      >
        + Upload {activeTab === 'videos' ? 'Video' : 'Before/After'}
      </button>

      {/* Videos Grid */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                {item.video_thumbnail_url ? (
                  <Image src={item.video_thumbnail_url} alt={item.title || ''} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
                )}
                {item.is_featured && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-[#E6007E] text-white text-xs rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{item.title || 'Untitled'}</h3>
                {item.service_tag && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-[#E6007E]/10 text-[#E6007E] text-xs rounded">
                    {item.service_tag}
                  </span>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className="flex-1 text-xs px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {item.is_featured ? '★ Unfeature' : '☆ Feature'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {videos.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No videos uploaded yet
            </div>
          )}
        </div>
      )}

      {/* Before/After Grid */}
      {activeTab === 'before_after' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beforeAfters.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-2 gap-0.5 bg-gray-200">
                <div className="relative aspect-square bg-gray-100">
                  {item.before_image_url ? (
                    <Image src={item.before_image_url} alt="Before" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">Before</div>
                  )}
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 text-white text-xs rounded">
                    Before
                  </span>
                </div>
                <div className="relative aspect-square bg-gray-100">
                  {item.after_image_url ? (
                    <Image src={item.after_image_url} alt="After" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">After</div>
                  )}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#E6007E] text-white text-xs rounded">
                    After
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{item.title || 'Untitled'}</h3>
                {item.service_tag && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-[#E6007E]/10 text-[#E6007E] text-xs rounded">
                    {item.service_tag}
                  </span>
                )}
                <div className="mt-2 text-xs text-green-600">
                  ✓ Consent Confirmed
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className="flex-1 text-xs px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {item.is_featured ? '★ Unfeature' : '☆ Feature'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {beforeAfters.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No before/after photos uploaded yet
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          type={uploadType}
          serviceTags={serviceTags}
          providerId={providerId}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}

// Upload Modal with file upload support
function UploadModal({
  type,
  serviceTags,
  providerId,
  onClose,
  onUpload,
}: {
  type: 'video' | 'before_after';
  serviceTags: ServiceTag[];
  providerId: string;
  onClose: () => void;
  onUpload: (data: Partial<MediaItem>) => void;
}) {
  const [formData, setFormData] = useState({
    type,
    title: '',
    description: '',
    service_tag: '',
    video_url: '',
    video_thumbnail_url: '',
    before_image_url: '',
    after_image_url: '',
    consent_confirmed: false,
    has_watermark: true,
    is_featured: false,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleFileUpload = async (file: File, fieldName: string) => {
    setUploading(true);
    setUploadProgress(`Uploading ${file.name}...`);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('providerId', providerId);
      formData.append('type', file.type.startsWith('video/') ? 'video' : 'image');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.error) {
        alert(data.error);
        return;
      }

      setFormData((prev: any) => ({ ...prev, [fieldName]: data.url }));
      setUploadProgress('Upload complete!');
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(''), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'before_after' && !formData.consent_confirmed) {
      alert('Client consent must be confirmed before uploading before/after photos');
      return;
    }
    onUpload(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {type === 'video' ? 'Upload Video' : 'Upload Before/After'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Lip Filler Treatment"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E6007E]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E6007E]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Tag</label>
            <select
              value={formData.service_tag}
              onChange={(e) => setFormData({ ...formData, service_tag: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E6007E]"
            >
              <option value="">Select a service...</option>
              {serviceTags.map((tag) => (
                <option key={tag.id} value={tag.slug}>{tag.name}</option>
              ))}
            </select>
          </div>

          {type === 'video' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video_url')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E6007E]"
                />
                {formData.video_url && <p className="text-xs text-green-600 mt-1">✓ Video uploaded</p>}
                <p className="text-xs text-gray-500 mt-1">Or paste URL below</p>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E6007E] mt-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.video_thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, video_thumbnail_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E6007E]"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Before Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'before_image_url')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {formData.before_image_url && <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">After Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'after_image_url')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {formData.after_image_url && <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent_confirmed}
                    onChange={(e) => setFormData({ ...formData, consent_confirmed: e.target.checked })}
                    className="mt-1 w-5 h-5 text-[#E6007E] border-gray-300 rounded focus:ring-[#E6007E]"
                  />
                  <span className="text-sm text-yellow-800">
                    <strong>Client consent confirmed</strong><br />
                    I confirm that written consent has been obtained from the client for the use of these images.
                  </span>
                </label>
              </div>
            </>
          )}

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-[#E6007E] border-gray-300 rounded focus:ring-[#E6007E]"
              />
              <span className="text-sm text-gray-700">Mark as featured</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-[#E6007E] text-white rounded-lg hover:bg-[#E6007E]/90 disabled:opacity-50"
            >
              {uploading ? uploadProgress : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
