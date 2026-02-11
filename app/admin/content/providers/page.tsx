"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useToast } from "@/components/ui/Toast";
import type { ProviderServiceTag } from "@/lib/providers/media";

type ProviderRecord = {
  id: string;
  slug?: string | null;
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  credentials?: string | null;
  tagline?: string | null;
  headshot_url?: string | null;
  hero_image_url?: string | null;
  short_bio?: string | null;
  philosophy?: string | null;
  intro_video_url?: string | null;
  booking_url?: string | null;
  color_hex?: string | null;
  is_active?: boolean;
  media_counts?: {
    videos: number;
    results: number;
  };
};

type ProviderMedia = {
  id: string;
  provider_id: string;
  media_type: "video" | "before_after";
  status: "draft" | "published" | "archived";
  service_tag: ProviderServiceTag;
  title: string;
  description?: string | null;
  video_url?: string | null;
  before_image_url?: string | null;
  after_image_url?: string | null;
  thumbnail_url?: string | null;
  alt_text?: string | null;
  duration_seconds?: number | null;
  width?: number | null;
  height?: number | null;
  featured?: boolean;
  consent_confirmed?: boolean;
  watermark_enabled?: boolean;
  sort_order?: number;
  tags?: string[] | null;
};

type UploadResponse = {
  url: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  width?: number;
  height?: number;
};

const SERVICE_TAG_OPTIONS: { value: ProviderServiceTag; label: string }[] = [
  { value: "botox", label: "Botox" },
  { value: "lip_filler", label: "Lip Filler" },
  { value: "prp", label: "PRP / PRF" },
  { value: "hormone_therapy", label: "Hormone Therapy" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "microneedling", label: "Microneedling" },
  { value: "laser", label: "Laser" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

interface MediaDrawerState {
  open: boolean;
  mode: "create" | "edit";
  mediaType: "video" | "before_after";
  initialData?: ProviderMedia | null;
}

type MediaFormState = {
  title: string;
  description: string;
  service_tag: ProviderServiceTag;
  status: "draft" | "published";
  featured: boolean;
  consent_confirmed: boolean;
  watermark_enabled: boolean;
  sort_order: number;
};

export default function ProvidersContentPage() {
  const { success, error } = useToast();
  const [providers, setProviders] = useState<ProviderRecord[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [providerForm, setProviderForm] = useState<Partial<ProviderRecord>>({});
  const [savingProvider, setSavingProvider] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [media, setMedia] = useState<ProviderMedia[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<"all" | "video" | "before_after">("all");
  const [serviceFilter, setServiceFilter] = useState<ProviderServiceTag | "all">("all");

  const [mediaDrawer, setMediaDrawer] = useState<MediaDrawerState>({
    open: false,
    mode: "create",
    mediaType: "before_after",
  });
  const [mediaForm, setMediaForm] = useState<MediaFormState>({
    title: "",
    description: "",
    service_tag: "other",
    status: "draft",
    featured: false,
    consent_confirmed: false,
    watermark_enabled: true,
    sort_order: 0,
  });
  const videoInputRef = useRef<HTMLInputElement>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const [assetUploading, setAssetUploading] = useState(false);

  const loadProviders = useCallback(async () => {
    try {
      setLoadingProviders(true);
      const res = await fetch("/api/cms/providers");
      const data = await res.json();
      const list: ProviderRecord[] = data.providers || [];
      setProviders(list);
      setSelectedProviderId((current) => current || list[0]?.id || null);
    } catch (err) {
      console.error(err);
      error("Failed to load providers");
    } finally {
      setLoadingProviders(false);
    }
  }, [error]);

  const loadMedia = useCallback(
    async (providerId: string) => {
      try {
        setMediaLoading(true);
        const res = await fetch(`/api/cms/providers/${providerId}/media`);
        const data = await res.json();
        setMedia(data.media || []);
      } catch (err) {
        console.error(err);
        error("Failed to load media");
      } finally {
        setMediaLoading(false);
      }
    },
    [error],
  );

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  useEffect(() => {
    if (selectedProviderId) {
      const provider = providers.find((p) => p.id === selectedProviderId);
      setProviderForm(provider || {});
      loadMedia(selectedProviderId);
    }
  }, [selectedProviderId, providers, loadMedia]);

  const filteredProviders = useMemo(() => {
    if (!searchTerm) return providers;
    const query = searchTerm.toLowerCase();
    return providers.filter((provider) => {
      const name = provider.display_name || `${provider.first_name || ""} ${provider.last_name || ""}`;
      return name.toLowerCase().includes(query) || provider.credentials?.toLowerCase().includes(query);
    });
  }, [providers, searchTerm]);

  const selectedProvider = providers.find((p) => p.id === selectedProviderId) || null;

  async function toggleProviderActive(provider: ProviderRecord) {
    if (!provider.id) return;
    try {
      setProviders((prev) => prev.map((p) => (p.id === provider.id ? { ...p, is_active: !p.is_active } : p)));
      const res = await fetch("/api/cms/providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: provider.id, is_active: !provider.is_active }),
      });
      if (!res.ok) throw new Error();
      success(`${provider.display_name || provider.first_name} updated`);
      await loadProviders();
    } catch {
      error("Failed to update provider");
    }
  }

  async function saveProviderForm(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedProvider || !providerForm.display_name) {
      error("Display name is required");
      return;
    }
    try {
      setSavingProvider(true);
      const payload = {
        id: selectedProvider.id,
        ...providerForm,
      };
      const res = await fetch("/api/cms/providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      success("Provider saved");
      await loadProviders();
    } catch (err) {
      console.error(err);
      error(err instanceof Error ? err.message : "Failed to save provider");
    } finally {
      setSavingProvider(false);
    }
  }

  function openMediaDrawer(mode: "create" | "edit", mediaType: "video" | "before_after", mediaItem?: ProviderMedia) {
    setMediaDrawer({ open: true, mode, mediaType, initialData: mediaItem || null });
    if (mediaItem) {
      setMediaForm({
        title: mediaItem.title,
        description: mediaItem.description || "",
        service_tag: mediaItem.service_tag,
        status: mediaItem.status === "published" ? "published" : "draft",
        featured: mediaItem.featured ?? false,
        consent_confirmed: mediaItem.consent_confirmed ?? false,
        watermark_enabled: mediaItem.watermark_enabled ?? true,
        sort_order: mediaItem.sort_order ?? 0,
      });
    } else {
      setMediaForm({
        title: "",
        description: "",
        service_tag: "other",
        status: "draft",
        featured: false,
        consent_confirmed: false,
        watermark_enabled: true,
        sort_order: 0,
      });
    }
  }

  function closeMediaDrawer() {
    setMediaDrawer((prev) => ({ ...prev, open: false }));
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (beforeInputRef.current) beforeInputRef.current.value = "";
    if (afterInputRef.current) afterInputRef.current.value = "";
  }

  async function uploadAsset(file: File, options: { assetRole: string; mediaType: "video" | "before_after" }): Promise<UploadResponse | null> {
    if (!selectedProvider) return null;
    setAssetUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("providerSlug", selectedProvider.slug || selectedProvider.display_name || "provider");
      formData.append("assetRole", options.assetRole);
      formData.append("mediaType", options.mediaType);
      const res = await fetch("/api/uploads/provider-media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      return data as UploadResponse;
    } finally {
      setAssetUploading(false);
    }
  }

  async function handleMediaSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProvider) return;
    try {
      let payload: Record<string, unknown> = {
        media_type: mediaDrawer.mediaType,
        title: mediaForm.title,
        description: mediaForm.description,
        service_tag: mediaForm.service_tag,
        status: mediaForm.status,
        featured: mediaForm.featured,
        consent_confirmed: mediaForm.consent_confirmed,
        watermark_enabled: mediaForm.watermark_enabled,
        sort_order: mediaForm.sort_order,
      };

      if (mediaDrawer.mode === "create") {
        if (mediaDrawer.mediaType === "video") {
          const file = videoInputRef.current?.files?.[0];
          if (!file) {
            error("Select a video file to upload");
            return;
          }
          const uploaded = await uploadAsset(file, { assetRole: "video", mediaType: "video" });
          if (!uploaded) {
            error("Upload failed, please try again.");
            return;
          }
          payload = {
            ...payload,
            video_url: uploaded.url,
            thumbnail_url: uploaded.thumbnailUrl,
            duration_seconds: uploaded.durationSeconds,
            width: uploaded.width,
            height: uploaded.height,
          };
        } else {
          const beforeFile = beforeInputRef.current?.files?.[0];
          const afterFile = afterInputRef.current?.files?.[0];
          if (!beforeFile || !afterFile) {
            error("Upload both before and after photos");
            return;
          }
          const [beforeUpload, afterUpload] = await Promise.all([
            uploadAsset(beforeFile, { assetRole: "before", mediaType: "before_after" }),
            uploadAsset(afterFile, { assetRole: "after", mediaType: "before_after" }),
          ]);
          if (!beforeUpload || !afterUpload) {
            error("Upload failed, please try again.");
            return;
          }
          payload = {
            ...payload,
            before_image_url: beforeUpload.url,
            after_image_url: afterUpload.url,
            width: afterUpload.width,
            height: afterUpload.height,
          };
        }

        const res = await fetch(`/api/cms/providers/${selectedProvider.id}/media`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create media");
        }
        success("Media uploaded");
      } else if (mediaDrawer.mode === "edit" && mediaDrawer.initialData) {
        const res = await fetch(`/api/cms/providers/${selectedProvider.id}/media`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: mediaDrawer.initialData.id, ...payload }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update media");
        }
        success("Media updated");
      }

      closeMediaDrawer();
      await loadMedia(selectedProvider.id);
    } catch (err) {
      console.error(err);
      error(err instanceof Error ? err.message : "Failed to save media");
    }
  }

  async function deleteMedia(mediaId: string) {
    if (!selectedProvider) return;
    if (!confirm("Archive this media item?")) return;
    try {
      const res = await fetch(`/api/cms/providers/${selectedProvider.id}/media?id=${mediaId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      success("Media archived");
      await loadMedia(selectedProvider.id);
    } catch {
      error("Failed to delete media");
    }
  }

  const visibleMedia = media.filter((item) => {
    if (mediaFilter !== "all" && item.media_type !== mediaFilter) return false;
    if (serviceFilter !== "all" && item.service_tag !== serviceFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-pink-500 font-semibold">Content</p>
          <h1 className="text-3xl font-bold text-gray-900">Provider Media & Authority</h1>
          <p className="text-gray-500">
            Upload headshots, videos, and before/after results for Danielle & Ryan. Everything syncs with the public Providers page.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => openMediaDrawer("create", "before_after")}
            className="px-4 py-2 rounded-lg bg-pink-100 text-pink-700 font-semibold hover:bg-pink-200"
            disabled={!selectedProvider}
          >
            + Upload Results
          </button>
          <button
            onClick={() => openMediaDrawer("create", "video")}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50"
            disabled={!selectedProvider}
          >
            + Upload Video
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[320px,1fr] gap-6">
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search providers"
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
            {loadingProviders && <p className="text-sm text-gray-500">Loading providers…</p>}
            {!loadingProviders &&
              filteredProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProviderId(provider.id)}
                  className={`w-full text-left rounded-2xl border px-4 py-3 transition ${
                    provider.id === selectedProviderId ? "border-pink-400 bg-pink-50" : "border-gray-200 hover:border-pink-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 relative">
                      {provider.headshot_url ? (
                        <Image src={provider.headshot_url} alt={provider.display_name || "Provider"} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">{provider.display_name?.[0] || provider.first_name?.[0] || "👩‍⚕️"}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{provider.display_name || `${provider.first_name} ${provider.last_name}`}</p>
                      <p className="text-xs text-gray-500">{provider.credentials}</p>
                    </div>
                    <div className="flex flex-col text-right text-xs text-gray-500">
                      <span>🎬 {provider.media_counts?.videos ?? 0}</span>
                      <span>📸 {provider.media_counts?.results ?? 0}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${provider.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {provider.is_active ? "Active" : "Hidden"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProviderActive(provider);
                      }}
                      className="text-pink-600 font-semibold"
                    >
                      {provider.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </button>
              ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-8">
          {selectedProvider ? (
            <>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 relative shadow-inner">
                  {selectedProvider.headshot_url ? (
                    <Image src={selectedProvider.headshot_url} alt={selectedProvider.display_name || "Provider"} fill className="object-cover" sizes="96px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">{selectedProvider.display_name?.[0] || "👩‍⚕️"}</div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProvider.display_name}</h2>
                  <p className="text-sm text-gray-500">{selectedProvider.tagline}</p>
                  <p className="text-xs text-gray-400 mt-1">Slug: {selectedProvider.slug || "not set"}</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={saveProviderForm}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Display Name
                    <input
                      type="text"
                      className="rounded-xl border border-gray-200 px-3 py-2"
                      value={providerForm.display_name || ""}
                      onChange={(e) => setProviderForm({ ...providerForm, display_name: e.target.value })}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Slug
                    <input
                      type="text"
                      className="rounded-xl border border-gray-200 px-3 py-2"
                      value={providerForm.slug || ""}
                      onChange={(e) => setProviderForm({ ...providerForm, slug: e.target.value })}
                      placeholder="danielle"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                  Tagline
                  <input
                    type="text"
                    className="rounded-xl border border-gray-200 px-3 py-2"
                    value={providerForm.tagline || ""}
                    onChange={(e) => setProviderForm({ ...providerForm, tagline: e.target.value })}
                    placeholder="Premium injectables & concierge care"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                  Short Bio
                  <textarea
                    className="rounded-xl border border-gray-200 px-3 py-2"
                    rows={3}
                    value={providerForm.short_bio || ""}
                    onChange={(e) => setProviderForm({ ...providerForm, short_bio: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                  Philosophy
                  <textarea
                    className="rounded-xl border border-gray-200 px-3 py-2"
                    rows={3}
                    value={providerForm.philosophy || ""}
                    onChange={(e) => setProviderForm({ ...providerForm, philosophy: e.target.value })}
                  />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Credentials
                    <input
                      type="text"
                      className="rounded-xl border border-gray-200 px-3 py-2"
                      value={providerForm.credentials || ""}
                      onChange={(e) => setProviderForm({ ...providerForm, credentials: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Booking URL
                    <input
                      type="text"
                      className="rounded-xl border border-gray-200 px-3 py-2"
                      value={providerForm.booking_url || ""}
                      onChange={(e) => setProviderForm({ ...providerForm, booking_url: e.target.value })}
                      placeholder="/book?provider=danielle"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Headshot URL
                    <input
                      type="url"
                      className="rounded-xl border border-gray-200 px-3 py-2"
                      value={providerForm.headshot_url || ""}
                      onChange={(e) => setProviderForm({ ...providerForm, headshot_url: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Hero Image URL
                    <input
                      type="url"
                      className="rounded-xl border border-gray-200 px-3 py-2"
                      value={providerForm.hero_image_url || ""}
                      onChange={(e) => setProviderForm({ ...providerForm, hero_image_url: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Intro Video URL
                    <input
                      type="url"
                      className="rounded-xl border border-gray-200 px-3 py-2"
                      value={providerForm.intro_video_url || ""}
                      onChange={(e) => setProviderForm({ ...providerForm, intro_video_url: e.target.value })}
                    />
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50"
                    disabled={savingProvider}
                  >
                    {savingProvider ? "Saving…" : "Save Provider"}
                  </button>
                </div>
              </form>

              <section className="space-y-4">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        mediaFilter === "all" ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setMediaFilter("all")}
                    >
                      All Media
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        mediaFilter === "video" ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setMediaFilter("video")}
                    >
                      Videos
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        mediaFilter === "before_after" ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setMediaFilter("before_after")}
                    >
                      Results
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Filter by service:</span>
                    <select
                      className="rounded-full border border-gray-200 px-3 py-1"
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value as ProviderServiceTag | "all")}
                    >
                      <option value="all">All</option>
                      {SERVICE_TAG_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {mediaLoading && <p className="text-sm text-gray-500">Loading media…</p>}
                {!mediaLoading && visibleMedia.length === 0 && (
                  <div className="border border-dashed border-gray-300 rounded-2xl p-6 text-center text-gray-500">
                    No media yet. Upload a video or before/after to get started.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleMedia.map((item) => (
                    <div key={item.id} className="border rounded-2xl overflow-hidden shadow-sm">
                      <div className="relative aspect-video bg-gray-100">
                        {item.media_type === "video" && item.thumbnail_url ? (
                          <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" sizes="400px" />
                        ) : item.after_image_url ? (
                          <Image src={item.after_image_url} alt={item.title} fill className="object-cover" sizes="400px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">{item.media_type === "video" ? "🎬" : "📸"}</div>
                        )}
                        {item.media_type === "video" && (
                          <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">Video</span>
                        )}
                        {item.featured && (
                          <span className="absolute bottom-2 right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">Featured</span>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              item.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.status === "published" ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100">{SERVICE_TAG_OPTIONS.find((opt) => opt.value === item.service_tag)?.label}</span>
                          {item.consent_confirmed ? (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">Consent on file</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Consent pending</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-3 pt-2">
                          <button
                            type="button"
                            className="text-sm font-semibold text-pink-600"
                            onClick={() => openMediaDrawer("edit", item.media_type, item)}
                          >
                            Edit
                          </button>
                          <button type="button" className="text-sm text-gray-500 hover:text-red-600" onClick={() => deleteMedia(item.id)}>
                            Archive
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <p>Select a provider to manage content.</p>
          )}
        </section>
      </div>

  {mediaDrawer.open && selectedProvider && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-pink-500 font-semibold">Provider media</p>
                <h3 className="text-xl font-bold">
                  {mediaDrawer.mode === "create" ? "Upload" : "Edit"} {mediaDrawer.mediaType === "video" ? "Video" : "Before/After"}
                </h3>
              </div>
              <button onClick={closeMediaDrawer} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleMediaSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                  Title
                  <input
                    type="text"
                    className="rounded-xl border border-gray-200 px-3 py-2"
                    value={mediaForm.title}
                    onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                    required
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                  Service Tag
                  <select
                    className="rounded-xl border border-gray-200 px-3 py-2"
                    value={mediaForm.service_tag}
                    onChange={(e) => setMediaForm({ ...mediaForm, service_tag: e.target.value as ProviderServiceTag })}
                  >
                    {SERVICE_TAG_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                Description
                <textarea
                  className="rounded-xl border border-gray-200 px-3 py-2"
                  rows={3}
                  value={mediaForm.description}
                  onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })}
                />
              </label>
              {mediaDrawer.mediaType === "video" ? (
                mediaDrawer.mode === "create" && (
                  <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                    Video File (MP4, MOV)
                    <input ref={videoInputRef} type="file" accept="video/*" className="rounded-xl border border-dashed border-gray-300 px-3 py-2" />
                  </label>
                )
              ) : (
                mediaDrawer.mode === "create" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                      Before Photo
                      <input ref={beforeInputRef} type="file" accept="image/*" className="rounded-xl border border-dashed border-gray-300 px-3 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                      After Photo
                      <input ref={afterInputRef} type="file" accept="image/*" className="rounded-xl border border-dashed border-gray-300 px-3 py-2" />
                    </label>
                  </div>
                )
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={mediaForm.featured}
                    onChange={(e) => setMediaForm({ ...mediaForm, featured: e.target.checked })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={mediaForm.consent_confirmed}
                    onChange={(e) => setMediaForm({ ...mediaForm, consent_confirmed: e.target.checked })}
                  />
                  Client consent confirmed
                </label>
                {mediaDrawer.mediaType === "before_after" && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={mediaForm.watermark_enabled}
                      onChange={(e) => setMediaForm({ ...mediaForm, watermark_enabled: e.target.checked })}
                    />
                    Watermark photos
                  </label>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                  Status
                  <select
                    className="rounded-xl border border-gray-200 px-3 py-2"
                    value={mediaForm.status}
                    onChange={(e) => setMediaForm({ ...mediaForm, status: e.target.value as "draft" | "published" })}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                  Sort Order
                  <input
                    type="number"
                    className="rounded-xl border border-gray-200 px-3 py-2"
                    value={mediaForm.sort_order}
                    onChange={(e) => setMediaForm({ ...mediaForm, sort_order: Number(e.target.value) })}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeMediaDrawer} className="px-4 py-2 rounded-xl border border-gray-200">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-slate-900 text-white font-semibold disabled:opacity-50"
                  disabled={assetUploading}
                >
                  {assetUploading ? "Uploading…" : mediaDrawer.mode === "create" ? "Upload Media" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
