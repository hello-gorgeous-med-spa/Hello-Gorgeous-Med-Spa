"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Provider {
  id: string;
  slug: string;
  name: string;
  credentials: string;
  role: string;
  bio: string;
  philosophy: string;
  headshot_url: string;
  booking_url: string;
  telehealth_enabled: boolean;
  active: boolean;
  display_order: number;
}

interface ProviderMedia {
  id: string;
  provider_id: string;
  type: "video" | "before_after";
  video_url?: string;
  video_thumbnail_url?: string;
  video_orientation?: string;
  before_image_url?: string;
  after_image_url?: string;
  service_tag?: string;
  title?: string;
  description?: string;
  featured: boolean;
  consent_confirmed: boolean;
  watermarked: boolean;
  display_order: number;
  status: "draft" | "published" | "archived";
}

interface ServiceTag {
  slug: string;
  name: string;
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [media, setMedia] = useState<ProviderMedia[]>([]);
  const [serviceTags, setServiceTags] = useState<ServiceTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "videos" | "results">("details");
  const [uploading, setUploading] = useState(false);

  // Fetch providers
  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/providers");
      const data = await res.json();
      setProviders(data.providers || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch media for selected provider
  const fetchMedia = useCallback(async (providerId: string) => {
    try {
      const res = await fetch(`/api/admin/providers/${providerId}/media`);
      const data = await res.json();
      setMedia(data.media || []);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  }, []);

  // Fetch service tags
  const fetchServiceTags = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/provider-service-tags");
      const data = await res.json();
      setServiceTags(data.tags || []);
    } catch (error) {
      console.error("Error fetching service tags:", error);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
    fetchServiceTags();
  }, [fetchProviders, fetchServiceTags]);

  useEffect(() => {
    if (selectedProvider) {
      fetchMedia(selectedProvider.id);
    }
  }, [selectedProvider, fetchMedia]);

  const handleProviderUpdate = async (updates: Partial<Provider>) => {
    if (!selectedProvider) return;
    try {
      const res = await fetch(`/api/admin/providers/${selectedProvider.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedProvider(data.provider);
        fetchProviders();
      }
    } catch (error) {
      console.error("Error updating provider:", error);
    }
  };

  const handleMediaUpload = async (type: "video" | "before_after", files: FileList) => {
    if (!selectedProvider || files.length === 0) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("folder", `providers/${selectedProvider.slug}`);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();

      // Create media record
      const mediaData: Partial<ProviderMedia> = {
        type,
        status: "draft",
        consent_confirmed: false,
      };

      if (type === "video") {
        mediaData.video_url = url;
      } else {
        mediaData.before_image_url = url;
      }

      const res = await fetch(`/api/admin/providers/${selectedProvider.id}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mediaData),
      });

      if (res.ok) {
        fetchMedia(selectedProvider.id);
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleMediaUpdate = async (mediaId: string, updates: Partial<ProviderMedia>) => {
    if (!selectedProvider) return;
    try {
      const res = await fetch(`/api/admin/providers/${selectedProvider.id}/media/${mediaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchMedia(selectedProvider.id);
      }
    } catch (error) {
      console.error("Error updating media:", error);
    }
  };

  const handleMediaDelete = async (mediaId: string) => {
    if (!selectedProvider || !confirm("Delete this media?")) return;
    try {
      const res = await fetch(`/api/admin/providers/${selectedProvider.id}/media/${mediaId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchMedia(selectedProvider.id);
      }
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-black">Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Provider Management</h1>
            <p className="text-black/60 mt-1">Manage provider profiles, videos, and results</p>
          </div>
          <Link
            href="/admin/content"
            className="text-[#E6007E] font-semibold hover:underline"
          >
            ← Back to Content
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Provider List */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-black mb-4">Providers</h2>
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedProvider?.id === provider.id
                    ? "border-[#E6007E] bg-[#E6007E]/5"
                    : "border-black/10 hover:border-black/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black/10">
                    {provider.headshot_url && (
                      <Image
                        src={provider.headshot_url}
                        alt={provider.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-black">{provider.name}</p>
                    <p className="text-sm text-black/60">{provider.role}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs rounded ${
                      provider.active
                        ? "bg-green-100 text-green-800"
                        : "bg-black/10 text-black/60"
                    }`}
                  >
                    {provider.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Provider Details */}
          <div className="md:col-span-3">
            {selectedProvider ? (
              <div className="border border-black/10 rounded-xl p-6">
                {/* Tabs */}
                <div className="flex gap-4 border-b border-black/10 pb-4 mb-6">
                  {(["details", "videos", "results"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === tab
                          ? "bg-[#E6007E] text-white"
                          : "text-black/60 hover:text-black"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={selectedProvider.name}
                          onChange={(e) =>
                            handleProviderUpdate({ name: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-black/20 rounded-lg text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          Credentials
                        </label>
                        <input
                          type="text"
                          value={selectedProvider.credentials || ""}
                          onChange={(e) =>
                            handleProviderUpdate({ credentials: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-black/20 rounded-lg text-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={selectedProvider.role || ""}
                        onChange={(e) =>
                          handleProviderUpdate({ role: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-black/20 rounded-lg text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Bio
                      </label>
                      <textarea
                        value={selectedProvider.bio || ""}
                        onChange={(e) =>
                          handleProviderUpdate({ bio: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-black/20 rounded-lg text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Philosophy
                      </label>
                      <textarea
                        value={selectedProvider.philosophy || ""}
                        onChange={(e) =>
                          handleProviderUpdate({ philosophy: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-black/20 rounded-lg text-black"
                      />
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProvider.active}
                          onChange={(e) =>
                            handleProviderUpdate({ active: e.target.checked })
                          }
                          className="w-5 h-5 accent-[#E6007E]"
                        />
                        <span className="text-black font-medium">Active</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProvider.telehealth_enabled}
                          onChange={(e) =>
                            handleProviderUpdate({
                              telehealth_enabled: e.target.checked,
                            })
                          }
                          className="w-5 h-5 accent-[#E6007E]"
                        />
                        <span className="text-black font-medium">
                          Telehealth Enabled
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Videos Tab */}
                {activeTab === "videos" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-black">
                        Videos ({media.filter((m) => m.type === "video").length})
                      </h3>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="video/mp4,video/quicktime"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files && handleMediaUpload("video", e.target.files)
                          }
                        />
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#E6007E] text-white rounded-lg font-semibold hover:opacity-90">
                          {uploading ? "Uploading..." : "+ Upload Video"}
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {media
                        .filter((m) => m.type === "video")
                        .map((video) => (
                          <div
                            key={video.id}
                            className="border border-black/10 rounded-lg p-3"
                          >
                            <div className="relative aspect-[9/16] bg-black/5 rounded-lg overflow-hidden mb-3">
                              {video.video_thumbnail_url ? (
                                <img
                                  src={video.video_thumbnail_url}
                                  alt={video.title || "Video"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <svg className="w-12 h-12 text-black/30" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              )}
                              <span
                                className={`absolute top-2 left-2 px-2 py-0.5 text-xs rounded ${
                                  video.status === "published"
                                    ? "bg-green-500 text-white"
                                    : "bg-black/50 text-white"
                                }`}
                              >
                                {video.status}
                              </span>
                            </div>

                            <input
                              type="text"
                              placeholder="Title"
                              value={video.title || ""}
                              onChange={(e) =>
                                handleMediaUpdate(video.id, { title: e.target.value })
                              }
                              className="w-full px-2 py-1 text-sm border border-black/10 rounded mb-2 text-black"
                            />

                            <select
                              value={video.service_tag || ""}
                              onChange={(e) =>
                                handleMediaUpdate(video.id, { service_tag: e.target.value })
                              }
                              className="w-full px-2 py-1 text-sm border border-black/10 rounded mb-2 text-black"
                            >
                              <option value="">Select service...</option>
                              {serviceTags.map((tag) => (
                                <option key={tag.slug} value={tag.slug}>
                                  {tag.name}
                                </option>
                              ))}
                            </select>

                            <div className="flex items-center gap-2 mb-2">
                              <label className="flex items-center gap-1 text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={video.featured}
                                  onChange={(e) =>
                                    handleMediaUpdate(video.id, { featured: e.target.checked })
                                  }
                                  className="accent-[#E6007E]"
                                />
                                <span className="text-black">Featured</span>
                              </label>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleMediaUpdate(video.id, {
                                    status: video.status === "published" ? "draft" : "published",
                                  })
                                }
                                className={`flex-1 px-2 py-1 text-xs rounded font-semibold ${
                                  video.status === "published"
                                    ? "bg-black/10 text-black"
                                    : "bg-[#E6007E] text-white"
                                }`}
                              >
                                {video.status === "published" ? "Unpublish" : "Publish"}
                              </button>
                              <button
                                onClick={() => handleMediaDelete(video.id)}
                                className="px-2 py-1 text-xs rounded bg-red-500 text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Results Tab */}
                {activeTab === "results" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-black">
                        Before/After ({media.filter((m) => m.type === "before_after").length})
                      </h3>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files && handleMediaUpload("before_after", e.target.files)
                          }
                        />
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#E6007E] text-white rounded-lg font-semibold hover:opacity-90">
                          {uploading ? "Uploading..." : "+ Upload Before Image"}
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {media
                        .filter((m) => m.type === "before_after")
                        .map((result) => (
                          <div
                            key={result.id}
                            className="border border-black/10 rounded-lg p-3"
                          >
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="relative aspect-square bg-black/5 rounded-lg overflow-hidden">
                                {result.before_image_url ? (
                                  <img
                                    src={result.before_image_url}
                                    alt="Before"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-xs text-black/40">
                                    Before
                                  </div>
                                )}
                              </div>
                              <div className="relative aspect-square bg-black/5 rounded-lg overflow-hidden">
                                {result.after_image_url ? (
                                  <img
                                    src={result.after_image_url}
                                    alt="After"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <label className="flex items-center justify-center h-full text-xs text-[#E6007E] cursor-pointer hover:bg-black/10">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        if (!e.target.files?.length) return;
                                        setUploading(true);
                                        try {
                                          const formData = new FormData();
                                          formData.append("file", e.target.files[0]);
                                          formData.append("folder", `providers/${selectedProvider.slug}`);
                                          const res = await fetch("/api/upload", {
                                            method: "POST",
                                            body: formData,
                                          });
                                          if (res.ok) {
                                            const { url } = await res.json();
                                            handleMediaUpdate(result.id, { after_image_url: url });
                                          }
                                        } finally {
                                          setUploading(false);
                                        }
                                      }}
                                    />
                                    + After
                                  </label>
                                )}
                              </div>
                            </div>

                            <span
                              className={`inline-block px-2 py-0.5 text-xs rounded mb-2 ${
                                result.status === "published"
                                  ? "bg-green-500 text-white"
                                  : "bg-black/20 text-black"
                              }`}
                            >
                              {result.status}
                            </span>

                            <select
                              value={result.service_tag || ""}
                              onChange={(e) =>
                                handleMediaUpdate(result.id, { service_tag: e.target.value })
                              }
                              className="w-full px-2 py-1 text-sm border border-black/10 rounded mb-2 text-black"
                            >
                              <option value="">Select service...</option>
                              {serviceTags.map((tag) => (
                                <option key={tag.slug} value={tag.slug}>
                                  {tag.name}
                                </option>
                              ))}
                            </select>

                            <input
                              type="text"
                              placeholder="Caption"
                              value={result.description || ""}
                              onChange={(e) =>
                                handleMediaUpdate(result.id, { description: e.target.value })
                              }
                              className="w-full px-2 py-1 text-sm border border-black/10 rounded mb-2 text-black"
                            />

                            <label className="flex items-center gap-2 mb-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={result.consent_confirmed}
                                onChange={(e) =>
                                  handleMediaUpdate(result.id, { consent_confirmed: e.target.checked })
                                }
                                className="accent-[#E6007E]"
                              />
                              <span className="text-xs text-black">
                                Client consent confirmed (required to publish)
                              </span>
                            </label>

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  if (!result.consent_confirmed && result.status !== "published") {
                                    alert("Client consent must be confirmed before publishing");
                                    return;
                                  }
                                  handleMediaUpdate(result.id, {
                                    status: result.status === "published" ? "draft" : "published",
                                  });
                                }}
                                disabled={!result.consent_confirmed && result.status !== "published"}
                                className={`flex-1 px-2 py-1 text-xs rounded font-semibold ${
                                  result.status === "published"
                                    ? "bg-black/10 text-black"
                                    : result.consent_confirmed
                                    ? "bg-[#E6007E] text-white"
                                    : "bg-black/10 text-black/40 cursor-not-allowed"
                                }`}
                              >
                                {result.status === "published" ? "Unpublish" : "Publish"}
                              </button>
                              <button
                                onClick={() => handleMediaDelete(result.id)}
                                className="px-2 py-1 text-xs rounded bg-red-500 text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-black/10 rounded-xl p-12 text-center">
                <p className="text-black/60">Select a provider to manage their profile</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
