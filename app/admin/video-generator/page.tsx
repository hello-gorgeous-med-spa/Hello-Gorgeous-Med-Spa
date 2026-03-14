"use client";

import { useState, useEffect, useRef } from "react";

interface VideoTemplate {
  id: string;
  name: string;
  description: string;
}

interface GeneratedVideo {
  id: string;
  name: string;
  service: string;
  format: string;
  createdAt: string;
  status: "pending" | "rendering" | "completed" | "failed";
  url?: string;
  caption?: string;
}

interface LibraryVideo {
  id: string;
  name: string;
  service: string;
  format: string;
  url: string;
  caption?: string;
  thumbnail_url?: string;
  duration?: number;
  file_size?: number;
  status: string;
  created_at: string;
}

interface LibraryImage {
  id: string;
  name: string;
  url: string;
  category: string;
  tags: string[];
  source: string;
  width?: number;
  height?: number;
  file_size?: number;
  is_favorite: boolean;
  use_count: number;
  created_at: string;
}

const IMAGE_CATEGORIES = [
  { id: "all", name: "All Images", icon: "🖼️" },
  { id: "before-after", name: "Before/After", icon: "✨" },
  { id: "hero", name: "Hero Images", icon: "🌟" },
  { id: "branding", name: "Branding", icon: "💎" },
  { id: "treatments", name: "Treatments", icon: "💉" },
  { id: "equipment", name: "Equipment", icon: "🔧" },
  { id: "lifestyle", name: "Lifestyle", icon: "🌸" },
  { id: "uploads", name: "My Uploads", icon: "📤" },
];

interface VoicePreset {
  id: string;
  name: string;
  description: string;
}

const VOICE_PRESETS: VoicePreset[] = [
  { id: "rachel", name: "Rachel", description: "Calm, professional female" },
  { id: "bella", name: "Bella", description: "Warm, friendly female" },
  { id: "charlotte", name: "Charlotte", description: "Elegant, sophisticated female" },
  { id: "elli", name: "Elli", description: "Young, energetic female" },
  { id: "josh", name: "Josh", description: "Deep, authoritative male" },
  { id: "adam", name: "Adam", description: "Professional male" },
];

const SERVICE_TEMPLATES: VideoTemplate[] = [
  { id: "solaria", name: "Solaria CO2 Laser", description: "Fractional laser resurfacing promo" },
  { id: "stretchmarks", name: "Stretch Mark Treatment", description: "Body resurfacing & collagen promo" },
  { id: "botox", name: "Botox", description: "Anti-wrinkle treatment promo" },
  { id: "morpheus8", name: "Morpheus8", description: "RF microneedling promo" },
  { id: "weightloss", name: "Weight Loss", description: "Semaglutide/Tirzepatide promo" },
  { id: "fillers", name: "Dermal Fillers", description: "Lip & facial filler promo" },
  { id: "prf", name: "PRF Hair Restoration", description: "Hair regrowth promo" },
  { id: "iv", name: "IV Therapy", description: "Vitamin infusion promo" },
  { id: "custom", name: "Custom Service", description: "Create your own promo" },
];

const DEFAULT_BENEFITS: Record<string, string[]> = {
  solaria: ["Stimulates collagen production", "Reduces fine lines & wrinkles", "Improves skin texture", "Minimal downtime"],
  stretchmarks: ["Penetrates deep into dermis", "Stimulates collagen remodeling", "40-70% visible improvement", "Works where creams fail"],
  botox: ["Reduces fine lines & wrinkles", "Quick 15-minute treatment", "No downtime required", "Results last 3-4 months"],
  morpheus8: ["Tightens loose skin", "Reduces fat & cellulite", "Stimulates collagen", "Minimal downtime"],
  weightloss: ["FDA-approved medication", "Average 15-20% weight loss", "Reduces appetite naturally", "Physician supervised"],
  fillers: ["Instant volume restoration", "Smooths lines & wrinkles", "Enhances lips & cheeks", "Results last 12-18 months"],
  prf: ["Uses your own platelets", "Stimulates hair follicles", "No surgery required", "Natural-looking results"],
  iv: ["Immediate hydration", "Boost energy levels", "Enhance immunity", "Fast 30-45 min treatment"],
  custom: ["Benefit One", "Benefit Two", "Benefit Three", "Benefit Four"],
};

export default function VideoGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("solaria");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<"create" | "videos" | "images">("create");
  const [libraryVideos, setLibraryVideos] = useState<LibraryVideo[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<string>("all");
  
  // Image Library State
  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [imageCategory, setImageCategory] = useState<string>("all");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("uploads");
  const [uploadTags, setUploadTags] = useState("");
  const [selectedImage, setSelectedImage] = useState<LibraryImage | null>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    serviceName: "Solaria CO2 Laser",
    headline: "VIP Launch Special",
    subheadline: "by InMode",
    price: "$1,895",
    originalPrice: "$2,500",
    promoLabel: "Limited Launch Offer",
    benefits: DEFAULT_BENEFITS.solaria,
    format: "vertical" as "vertical" | "square" | "horizontal",
    includeVoiceover: false,
    voicePreset: "rachel",
    customVoiceScript: "",
    qualityPreset: "standard" as "standard" | "high" | "ultra",
    includeCaptions: true,
    videoStyle: "clean" as "clean" | "luxury" | "energetic" | "minimal",
  });

  const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(null);
  const [isGeneratingVoiceover, setIsGeneratingVoiceover] = useState(false);

  const loadLibraryVideos = async () => {
    setIsLoadingLibrary(true);
    try {
      const response = await fetch("/api/video-library");
      if (response.ok) {
        const data = await response.json();
        setLibraryVideos(data.videos || []);
      }
    } catch (error) {
      console.error("Failed to load video library:", error);
    }
    setIsLoadingLibrary(false);
  };

  const loadLibraryImages = async () => {
    setIsLoadingImages(true);
    try {
      const response = await fetch(`/api/image-library?category=${imageCategory}`);
      if (response.ok) {
        const data = await response.json();
        setLibraryImages(data.images || []);
      }
    } catch (error) {
      console.error("Failed to load image library:", error);
    }
    setIsLoadingImages(false);
  };

  const handleLibraryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", uploadName || file.name);
      formData.append("category", uploadCategory);
      formData.append("tags", uploadTags);

      const response = await fetch("/api/image-library/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setShowUploadModal(false);
        setUploadName("");
        setUploadTags("");
        loadLibraryImages();
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image");
    }
    setIsUploadingImage(false);
  };

  const toggleFavorite = async (image: LibraryImage) => {
    try {
      await fetch("/api/image-library", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: image.id, is_favorite: !image.is_favorite }),
      });
      setLibraryImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, is_favorite: !img.is_favorite } : img
        )
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Delete this image from library?")) return;
    try {
      await fetch(`/api/image-library?id=${id}`, { method: "DELETE" });
      setLibraryImages((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const useImageInVideo = (image: LibraryImage, type: "before" | "after") => {
    if (type === "before") {
      setBeforeImage(image.url);
    } else {
      setAfterImage(image.url);
    }
    setActiveTab("create");
  };

  const saveToLibrary = async (video: GeneratedVideo) => {
    try {
      await fetch("/api/video-library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: video.name,
          service: video.service,
          format: video.format,
          url: video.url,
          caption: video.caption,
        }),
      });
      loadLibraryVideos();
    } catch (error) {
      console.error("Failed to save to library:", error);
    }
  };

  const deleteFromLibrary = async (id: string) => {
    if (!confirm("Delete this video from library?")) return;
    try {
      await fetch(`/api/video-library?id=${id}`, { method: "DELETE" });
      setLibraryVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };

  useEffect(() => {
    loadLibraryVideos();
    loadLibraryImages();
  }, []);

  useEffect(() => {
    loadLibraryImages();
  }, [imageCategory]);

  useEffect(() => {
    const template = SERVICE_TEMPLATES.find((t) => t.id === selectedTemplate);
    if (template && selectedTemplate !== "custom") {
      const serviceNames: Record<string, string> = {
        solaria: "Solaria CO2 Laser",
        stretchmarks: "Stretch Mark Treatment",
        botox: "Botox",
        morpheus8: "Morpheus8",
        weightloss: "Semaglutide",
        fillers: "Dermal Fillers",
        prf: "PRF Hair Restoration",
        iv: "IV Therapy",
      };
      setFormData((prev) => ({
        ...prev,
        serviceName: serviceNames[selectedTemplate] || template.name,
        benefits: DEFAULT_BENEFITS[selectedTemplate] || DEFAULT_BENEFITS.custom,
      }));
    }
  }, [selectedTemplate]);

  const generateDefaultScript = () => {
    return `Discover ${formData.serviceName} at Hello Gorgeous Med Spa. ${formData.benefits.join(". ")}. Book your consultation today and experience the transformation. Call 630-636-6193.`;
  };

  const handleGenerateVoiceover = async () => {
    setIsGeneratingVoiceover(true);
    try {
      const script = formData.customVoiceScript || generateDefaultScript();
      const response = await fetch("/api/elevenlabs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: script,
          voiceId: formData.voicePreset,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setVoiceoverUrl(data.audioUrl);
      }
    } catch (error) {
      console.error("Voiceover generation failed:", error);
    }
    setIsGeneratingVoiceover(false);
  };

  const handleImageUpload = (type: "before" | "after", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === "before") {
          setBeforeImage(event.target?.result as string);
        } else {
          setAfterImage(event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    const newVideo: GeneratedVideo = {
      id: `video-${Date.now()}`,
      name: `${formData.serviceName} - ${formData.format}`,
      service: selectedTemplate,
      format: formData.format,
      createdAt: new Date().toISOString(),
      status: "pending",
      caption: `✨ ${formData.headline} ✨\n\n${formData.benefits.map((b) => `• ${b}`).join("\n")}\n\n📞 Book now: 630-636-6193\n🌐 hellogorgeousmedspa.com\n\n#HelloGorgeousMedSpa #${formData.serviceName.replace(/\s+/g, "")} #OswegoIL #MedSpa`,
    };

    setGeneratedVideos((prev) => [newVideo, ...prev]);

    try {
      const response = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: selectedTemplate,
          format: formData.format,
          props: {
            serviceName: formData.serviceName,
            headline: formData.headline,
            subheadline: formData.subheadline,
            price: formData.price,
            originalPrice: formData.originalPrice,
            promoLabel: formData.promoLabel,
            benefits: formData.benefits,
            clinicName: "Hello Gorgeous Med Spa",
            address: "74 W Washington St",
            city: "Oswego, IL",
            phone: "630-636-6193",
            website: "hellogorgeousmedspa.com",
            brandColor: "#E91E8C",
            qualityPreset: formData.qualityPreset,
            videoStyle: formData.videoStyle,
            includeCaptions: formData.includeCaptions,
            voiceoverUrl,
            beforeImage,
            afterImage,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.jobId) {
          const pollForCompletion = () => {
            const maxAttempts = 60;
            let attempts = 0;

            const poll = setInterval(async () => {
              attempts++;
              try {
                const statusRes = await fetch(`/api/render-video?jobId=${result.jobId}`);
                const statusData = await statusRes.json();

                if (statusData.job?.status === "completed") {
                  clearInterval(poll);
                  setGeneratedVideos((prev) =>
                    prev.map((v) =>
                      v.id === newVideo.id
                        ? { ...v, status: "completed", url: statusData.job.videoUrl }
                        : v
                    )
                  );
                  setIsGenerating(false);
                } else if (statusData.job?.status === "failed" || attempts >= maxAttempts) {
                  clearInterval(poll);
                  setGeneratedVideos((prev) =>
                    prev.map((v) =>
                      v.id === newVideo.id ? { ...v, status: "failed" } : v
                    )
                  );
                  setIsGenerating(false);
                }
              } catch (e) {
                console.error("Polling error:", e);
              }
            }, 3000);
          };

          pollForCompletion();
          return;
        }

        setGeneratedVideos((prev) =>
          prev.map((v) =>
            v.id === newVideo.id
              ? { ...v, status: "completed", url: result.videoUrl }
              : v
          )
        );
      } else {
        setGeneratedVideos((prev) =>
          prev.map((v) =>
            v.id === newVideo.id ? { ...v, status: "failed" } : v
          )
        );
      }
    } catch (error) {
      console.error("Video generation error:", error);
      setGeneratedVideos((prev) =>
        prev.map((v) =>
          v.id === newVideo.id ? { ...v, status: "failed" } : v
        )
      );
    }

    setIsGenerating(false);
  };

  const filteredLibraryVideos = libraryFilter === "all" 
    ? libraryVideos 
    : libraryVideos.filter((v) => v.service === libraryFilter);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">
            🎬 Video Generator
          </h1>
          <p className="text-pink-300 mt-2">
            Create professional marketing videos for Hello Gorgeous Med Spa
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "create"
                ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
            }`}
          >
            ✨ Create Video
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeTab === "videos"
                ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
            }`}
          >
            📹 Video Library
            {libraryVideos.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "videos" ? "bg-white/20" : "bg-pink-500/20 text-pink-400"
              }`}>
                {libraryVideos.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeTab === "images"
                ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
            }`}
          >
            🖼️ Image Library
            {libraryImages.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "images" ? "bg-white/20" : "bg-pink-500/20 text-pink-400"
              }`}>
                {libraryImages.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "videos" ? (
          /* Video Library View */
          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Your Video Library</h2>
              <div className="flex gap-2">
                <select
                  value={libraryFilter}
                  onChange={(e) => setLibraryFilter(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl text-sm focus:border-pink-500 focus:outline-none"
                >
                  <option value="all" className="bg-gray-900">All Services</option>
                  {SERVICE_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id} className="bg-gray-900">{t.name}</option>
                  ))}
                </select>
                <button
                  onClick={loadLibraryVideos}
                  disabled={isLoadingLibrary}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
                >
                  {isLoadingLibrary ? "Loading..." : "🔄 Refresh"}
                </button>
              </div>
            </div>

            {filteredLibraryVideos.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📹</div>
                <p className="text-white text-lg">No videos in your library yet</p>
                <p className="text-sm text-pink-300 mt-2">Videos you generate will appear here</p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
                >
                  Create Your First Video
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLibraryVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all"
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-black relative flex items-center justify-center">
                      {video.url ? (
                        <video
                          src={video.url}
                          className="w-full h-full object-cover"
                          muted
                          onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                          onMouseLeave={(e) => {
                            const vid = e.target as HTMLVideoElement;
                            vid.pause();
                            vid.currentTime = 0;
                          }}
                        />
                      ) : (
                        <span className="text-4xl">🎬</span>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
                          {video.format === "vertical" ? "9:16" : video.format === "square" ? "1:1" : "16:9"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-white truncate">{video.name}</h3>
                      <p className="text-xs text-pink-300 mt-1">
                        {new Date(video.created_at).toLocaleDateString()} • {video.service}
                      </p>
                      <div className="flex gap-2 mt-3">
                        {video.url && (
                          <a
                            href={video.url}
                            download
                            className="flex-1 py-2 bg-pink-500 hover:bg-pink-600 text-white text-center rounded-lg text-sm font-medium transition-colors"
                          >
                            📥 Download
                          </a>
                        )}
                        {video.caption && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(video.caption || "");
                              alert("Caption copied!");
                            }}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                            title="Copy caption"
                          >
                            📋
                          </button>
                        )}
                        <button
                          onClick={() => deleteFromLibrary(video.id)}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "images" ? (
          /* Image Library View */
          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Your Image Library</h2>
              <div className="flex gap-2">
                <select
                  value={imageCategory}
                  onChange={(e) => setImageCategory(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl text-sm focus:border-pink-500 focus:outline-none"
                >
                  {IMAGE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-gray-900">{cat.icon} {cat.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm transition-colors"
                >
                  📤 Upload Image
                </button>
                <button
                  onClick={loadLibraryImages}
                  disabled={isLoadingImages}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
                >
                  {isLoadingImages ? "Loading..." : "🔄 Refresh"}
                </button>
              </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Upload Image</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-pink-400 mb-1">Image Name</label>
                      <input
                        type="text"
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        placeholder="e.g., Botox Before After"
                        className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:border-pink-500 focus:outline-none placeholder-white/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-pink-400 mb-1">Category</label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:border-pink-500 focus:outline-none"
                      >
                        {IMAGE_CATEGORIES.filter(c => c.id !== "all").map((cat) => (
                          <option key={cat.id} value={cat.id} className="bg-gray-900">{cat.icon} {cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-pink-400 mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={uploadTags}
                        onChange={(e) => setUploadTags(e.target.value)}
                        placeholder="e.g., botox, before-after, face"
                        className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:border-pink-500 focus:outline-none placeholder-white/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-pink-400 mb-1">Select Image</label>
                      <input
                        ref={imageUploadRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLibraryImageUpload}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:border-pink-500 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-pink-500 file:text-white hover:file:bg-pink-600"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setShowUploadModal(false);
                        setUploadName("");
                        setUploadTags("");
                      }}
                      className="flex-1 py-2 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => imageUploadRef.current?.click()}
                      disabled={isUploadingImage}
                      className="flex-1 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50"
                    >
                      {isUploadingImage ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {libraryImages.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-white text-lg">No images in your library yet</p>
                <p className="text-sm text-pink-300 mt-2">Click "Upload Image" to add your first image</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
                >
                  📤 Upload Your First Image
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {libraryImages
                  .filter(img => imageCategory === "all" || img.category === imageCategory)
                  .map((image) => (
                  <div
                    key={image.id}
                    className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setBeforeImage(image.url);
                              setActiveTab("create");
                            }}
                            className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-100"
                          >
                            Use as Before
                          </button>
                          <button
                            onClick={() => {
                              setAfterImage(image.url);
                              setActiveTab("create");
                            }}
                            className="px-3 py-1.5 bg-pink-500 text-white rounded-lg text-xs font-medium hover:bg-pink-600"
                          >
                            Use as After
                          </button>
                        </div>
                      </div>
                      {image.is_favorite && (
                        <div className="absolute top-2 right-2">
                          <span className="text-yellow-400">⭐</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-white text-sm truncate">{image.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-pink-300">{image.category}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleFavorite(image)}
                            className="text-gray-400 hover:text-yellow-500"
                          >
                            {image.is_favorite ? "⭐" : "☆"}
                          </button>
                          <button
                            onClick={() => deleteImage(image.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select Service */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-pink-500 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                Select Service
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SERVICE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02] ${
                      selectedTemplate === template.id
                        ? "border-pink-500 bg-pink-500/20 shadow-lg shadow-pink-500/20"
                        : "border-white/20 hover:border-pink-400/50 bg-white/5"
                    }`}
                  >
                    <div className="font-medium text-white">{template.name}</div>
                    <div className="text-xs text-pink-300 mt-1">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customize Content */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-pink-500 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                Customize Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-pink-400 mb-1 font-medium">Headline</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none text-white placeholder-white/50"
                    placeholder="VIP Launch Special"
                  />
                </div>
                <div>
                  <label className="block text-sm text-pink-400 mb-1 font-medium">Price</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none text-white placeholder-white/50"
                    placeholder="$1,895"
                  />
                </div>
                <div>
                  <label className="block text-sm text-pink-400 mb-1 font-medium">Original Price</label>
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none text-white placeholder-white/50"
                    placeholder="$2,500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-pink-400 mb-1 font-medium">Promo Label</label>
                  <input
                    type="text"
                    value={formData.promoLabel}
                    onChange={(e) => setFormData({ ...formData, promoLabel: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none text-white placeholder-white/50"
                    placeholder="Limited Launch Offer"
                  />
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-4">
                <label className="block text-sm text-pink-400 mb-2 font-medium">Benefits</label>
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...formData.benefits];
                        newBenefits[index] = e.target.value;
                        setFormData({ ...formData, benefits: newBenefits });
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 focus:border-pink-500 focus:outline-none text-white text-sm placeholder-white/50"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Before/After Images */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-pink-500 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
                Before/After Photos (Optional)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    ref={beforeInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("before", e)}
                    className="hidden"
                  />
                  <button
                    onClick={() => beforeInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-white/30 rounded-xl flex flex-col items-center justify-center hover:border-pink-400 transition-colors bg-white/5"
                  >
                    {beforeImage ? (
                      <img src={beforeImage} alt="Before" className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <span className="text-2xl mb-1">📷</span>
                        <span className="text-sm text-white">Before Photo</span>
                      </>
                    )}
                  </button>
                </div>
                <div>
                  <input
                    ref={afterInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("after", e)}
                    className="hidden"
                  />
                  <button
                    onClick={() => afterInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-white/30 rounded-xl flex flex-col items-center justify-center hover:border-pink-400 transition-colors bg-white/5"
                  >
                    {afterImage ? (
                      <img src={afterImage} alt="After" className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <span className="text-2xl mb-1">✨</span>
                        <span className="text-sm text-white">After Photo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-pink-500 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">4</span>
                Select Format
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "vertical", name: "Reel/TikTok", icon: "📱", ratio: "9:16" },
                  { id: "square", name: "Square", icon: "⬜", ratio: "1:1" },
                  { id: "horizontal", name: "Landscape", icon: "🖥️", ratio: "16:9" },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setFormData({ ...formData, format: format.id as "vertical" | "square" | "horizontal" })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      formData.format === format.id
                        ? "border-pink-500 bg-pink-500/20"
                        : "border-white/20 hover:border-pink-400/50 bg-white/5"
                    }`}
                  >
                    <div className="text-2xl mb-1">{format.icon}</div>
                    <div className="font-medium text-white text-sm">{format.name}</div>
                    <div className="text-xs text-pink-300">{format.ratio}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Style */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-pink-500 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">5</span>
                Video Style & Quality
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm text-pink-400 mb-2 font-medium">Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "clean", name: "Clean Clinic", icon: "🏥" },
                    { id: "luxury", name: "Luxury", icon: "💎" },
                    { id: "energetic", name: "High Energy", icon: "⚡" },
                    { id: "minimal", name: "Minimal", icon: "✨" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setFormData({ ...formData, videoStyle: style.id as "clean" | "luxury" | "energetic" | "minimal" })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.videoStyle === style.id
                          ? "border-pink-500 bg-pink-500/20"
                          : "border-white/20 bg-white/5"
                      }`}
                    >
                      <span className="text-xl">{style.icon}</span>
                      <div className="text-xs text-white mt-1">{style.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-pink-400 mb-2 font-medium">Render Quality</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "standard", name: "Standard", crf: "18" },
                    { id: "high", name: "High", crf: "16" },
                    { id: "ultra", name: "Ultra", crf: "14" },
                  ].map((quality) => (
                    <button
                      key={quality.id}
                      onClick={() => setFormData({ ...formData, qualityPreset: quality.id as "standard" | "high" | "ultra" })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.qualityPreset === quality.id
                          ? "border-pink-500 bg-pink-500/20"
                          : "border-white/20 bg-white/5"
                      }`}
                    >
                      <div className="text-sm font-medium text-white">{quality.name}</div>
                      <div className="text-xs text-pink-300">CRF {quality.crf}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Voiceover */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-pink-500 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">6</span>
                AI Voiceover
                <span className="ml-2 text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full">ElevenLabs</span>
              </h2>
              
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setFormData({ ...formData, includeVoiceover: !formData.includeVoiceover })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    formData.includeVoiceover ? "bg-pink-500" : "bg-gray-600"
                  }`}
                >
                  <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                    formData.includeVoiceover ? "translate-x-7" : "translate-x-0.5"
                  }`} />
                </button>
                <span className="text-sm text-white">Include AI voiceover</span>
              </div>

              {formData.includeVoiceover && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-pink-400 mb-2 font-medium">Voice</label>
                    <div className="grid grid-cols-3 gap-2">
                      {VOICE_PRESETS.map((voice) => (
                        <button
                          key={voice.id}
                          onClick={() => setFormData({ ...formData, voicePreset: voice.id })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            formData.voicePreset === voice.id
                              ? "border-pink-500 bg-pink-500/20"
                              : "border-white/20 bg-white/5"
                          }`}
                        >
                          <div className="font-medium text-white text-sm">{voice.name}</div>
                          <div className="text-xs text-pink-300">{voice.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-pink-400 mb-1 font-medium">Custom Script (Optional)</label>
                    <textarea
                      value={formData.customVoiceScript}
                      onChange={(e) => setFormData({ ...formData, customVoiceScript: e.target.value })}
                      placeholder={generateDefaultScript()}
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none text-white text-sm resize-none placeholder-white/50"
                    />
                  </div>

                  <button
                    onClick={handleGenerateVoiceover}
                    disabled={isGeneratingVoiceover}
                    className="w-full py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isGeneratingVoiceover ? "Generating..." : "🎙️ Generate Voiceover"}
                  </button>

                  {voiceoverUrl && (
                    <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <span>✓</span>
                        <span>Voiceover ready!</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-5 rounded-2xl font-bold text-xl transition-all shadow-xl text-white ${
                isGenerating
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600 shadow-pink-500/30"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating Video (~60 seconds)...
                </span>
              ) : (
                "🎬 Generate Video"
              )}
            </button>
          </div>

          {/* Right: Generated Videos */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 sticky top-8 border border-white/10">
              <h2 className="text-xl font-semibold text-pink-500 mb-4">Generated Videos</h2>

              {generatedVideos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-white">No videos generated yet</p>
                  <p className="text-sm text-pink-300 mt-1">Create your first video above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedVideos.map((video) => (
                    <div key={video.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-white">{video.name}</div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          video.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : video.status === "rendering"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : video.status === "failed"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-white/10 text-gray-400"
                        }`}>
                          {video.status}
                        </span>
                      </div>
                      <div className="text-xs text-pink-300 mb-3">
                        {video.format} • {new Date(video.createdAt).toLocaleString()}
                      </div>
                      
                      {video.status === "completed" && video.url && (
                        <div className="space-y-2">
                          <a
                            href={video.url}
                            download
                            className="block w-full py-2 bg-pink-500 hover:bg-pink-600 text-white text-center rounded-lg text-sm font-medium transition-colors"
                          >
                            📥 Download Video
                          </a>
                          <button
                            onClick={() => saveToLibrary(video)}
                            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            📚 Save to Library
                          </button>
                          {video.caption && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(video.caption || "");
                                alert("Caption copied!");
                              }}
                              className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              📋 Copy Caption
                            </button>
                          )}
                        </div>
                      )}

                      {video.status === "rendering" && (
                        <div className="flex items-center gap-2 text-yellow-400 text-sm">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Rendering in progress...</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
