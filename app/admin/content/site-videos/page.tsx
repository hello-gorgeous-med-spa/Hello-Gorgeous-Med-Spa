"use client";

import { useEffect, useRef, useState } from "react";

import { useToast } from "@/components/ui/Toast";

const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/mov", "video/x-m4v"];
const MAX_MB = 100;

export default function SiteVideosPage() {
  const { success, error } = useToast();
  const [triggerPointUrl, setTriggerPointUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchConfig() {
    setLoading(true);
    try {
      const res = await fetch("/api/config?category=website");
      const data = await res.json();
      const url = data?.config?.website?.trigger_point_video_url;
      setTriggerPointUrl(typeof url === "string" ? url : null);
    } catch {
      setTriggerPointUrl(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConfig();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!VIDEO_TYPES.includes(file.type) && !file.name.toLowerCase().match(/\.(mp4|mov|m4v)$/)) {
      error("Please select an MP4 or MOV video file.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      error(`File must be under ${MAX_MB}MB. Consider compressing your video.`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("providerSlug", "site");
      formData.append("assetRole", "video");
      formData.append("mediaType", "video");

      const uploadRes = await fetch("/api/uploads/provider-media", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      const url = uploadData.url as string;
      if (!url) throw new Error("No URL returned");

      setSaving(true);
      const configRes = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "website",
          key: "trigger_point_video_url",
          value: url,
          description: "Trigger Point section video on homepage",
        }),
      });

      if (!configRes.ok) {
        const errData = await configRes.json();
        throw new Error(errData.error || "Failed to save");
      }

      setTriggerPointUrl(url);
      success("Trigger Point video uploaded and saved. It will appear on the homepage.");
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setRemoving(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "website",
          key: "trigger_point_video_url",
          value: null,
          description: "Trigger Point section video on homepage",
        }),
      });

      if (!res.ok) throw new Error("Failed to remove");

      setTriggerPointUrl(null);
      success("Trigger Point video removed.");
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : "Failed to remove");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Site Videos</h1>
      <p className="text-slate-600 mb-8">
        Upload MP4 or MOV videos for your website. Videos are stored securely and appear on the public site.
      </p>

      {/* Trigger Point Video */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🎯</span>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Trigger Point Video</h2>
            <p className="text-sm text-slate-500">
              Shown in the Trigger Point Injections section on the homepage
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading…</div>
        ) : (
          <>
            {triggerPointUrl ? (
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
                  <video
                    src={triggerPointUrl}
                    controls
                    className="w-full h-full object-contain"
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500 text-white font-medium cursor-pointer hover:bg-pink-600 transition disabled:opacity-50">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-m4v,.mp4,.mov,.m4v"
                      onChange={handleUpload}
                      className="hidden"
                      disabled={uploading || saving}
                    />
                    {uploading || saving ? "Uploading…" : "Replace Video"}
                  </label>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={removing}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    {removing ? "Removing…" : "Remove Video"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                <p className="text-slate-600 mb-4">No video uploaded yet.</p>
                <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold cursor-pointer hover:opacity-90 transition shadow-lg shadow-pink-500/25">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-m4v,.mp4,.mov,.m4v"
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading || saving}
                  />
                  {uploading || saving ? "Uploading…" : "Upload MP4 Video"}
                </label>
                <p className="text-slate-500 text-sm mt-3">Max {MAX_MB}MB • MP4 or MOV</p>
              </div>
            )}
          </>
        )}
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Videos are compressed and stored in your cloud storage. Changes appear on the homepage within a few seconds.
      </p>
    </div>
  );
}
