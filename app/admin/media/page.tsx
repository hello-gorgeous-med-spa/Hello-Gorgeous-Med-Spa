"use client";

import { useEffect, useRef, useState } from "react";

import { StreamVideo } from "@/components/StreamVideo";
import { useToast } from "@/components/ui/Toast";

type MediaRecord = {
  id: string;
  title: string;
  description: string | null;
  stream_uid: string;
  thumbnail_url: string | null;
  use_case: string | null;
  created_at: string;
};

const USE_CASES = [
  { value: "trigger_point", label: "Trigger Point (Homepage)" },
  { value: "hero", label: "Hero Background" },
  { value: "testimonial", label: "Before/After Testimonial" },
  { value: "educational", label: "Educational / Explainer" },
  { value: "general", label: "General" },
];

export default function AdminMediaPage() {
  const { success, error } = useToast();
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [useCase, setUseCase] = useState("trigger_point");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchMedia() {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(data.media || []);
    } catch {
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMedia();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      error("Select a video file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);
      formData.append("description", description);
      formData.append("use_case", useCase);

      const res = await fetch("/api/uploads/stream", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      success("Video uploaded to Cloudflare Stream. It will appear on the site.");
      setTitle("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchMedia();

      // Also save to config for trigger_point so existing TriggerPointSection can use it
      if (useCase === "trigger_point" && data.uid) {
        await fetch("/api/config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: "website",
            key: "trigger_point_stream_uid",
            value: data.uid,
            description: "Cloudflare Stream UID for Trigger Point video",
          }),
        });
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-black mb-2">Media Library</h1>
      <p className="text-black mb-8">
        Upload videos to Cloudflare Stream. Videos are optimized, streamed via CDN, and embedded across the site.
      </p>

      <div className="mb-8 p-4 rounded-xl bg-white border border-black text-black text-sm">
        <p className="font-medium mb-1">Setup required</p>
        <p>
          Add <code className="bg-white px-1 rounded">CLOUDFLARE_ACCOUNT_ID</code> and{" "}
          <code className="bg-white px-1 rounded">CLOUDFLARE_STREAM_API_TOKEN</code> to Vercel env vars.
        </p>
      </div>

      {/* Upload form */}
      <form onSubmit={handleUpload} className="mb-12 p-6 bg-white rounded-2xl border border-black shadow-sm">
        <h2 className="text-lg font-semibold text-black mb-4">Upload Video</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Video file (MP4, MOV, max 200MB)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/x-m4v,video/webm,.mp4,.mov,.m4v,.webm"
              required
              className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 file:font-medium hover:file:bg-pink-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trigger Point Injection Demo"
              className="w-full px-4 py-2 rounded-lg border border-black text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Use case</label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-black text-black"
            >
              {USE_CASES.map((uc) => (
                <option key={uc.value} value={uc.value}>
                  {uc.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-black text-black"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload to Stream"}
          </button>
        </div>
      </form>

      {/* Media list */}
      <div>
        <h2 className="text-lg font-semibold text-black mb-4">Videos</h2>
        {loading ? (
          <p className="text-black">Loading…</p>
        ) : media.length === 0 ? (
          <p className="text-black">No videos yet. Upload one above.</p>
        ) : (
          <div className="space-y-6">
            {media.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-white border border-black shadow-sm flex flex-col md:flex-row gap-4"
              >
                <div className="md:w-64 flex-shrink-0 rounded-lg overflow-hidden bg-black">
                  <StreamVideo uid={m.stream_uid} loading="lazy" className="w-full h-full min-h-[140px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-black">{m.title}</h3>
                  {m.description && <p className="text-sm text-black mt-1">{m.description}</p>}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded bg-white text-black text-xs">
                      {m.use_case || "general"}
                    </span>
                    <span className="text-xs text-black">UID: {m.stream_uid}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
