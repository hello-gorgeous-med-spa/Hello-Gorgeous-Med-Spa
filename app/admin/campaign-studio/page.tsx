"use client";

import { useState, useRef } from "react";
import { CAMPAIGN_TEMPLATES, BRAND_CONFIG, CampaignTemplate } from "@/lib/brand-config";

interface GeneratedCampaign {
  headline: string;
  subheadline: string;
  hooks: string[];
  benefits: string[];
  cta: string;
  instagramCaption: string;
  tiktokCaption: string;
  facebookCaption: string;
  hashtags: string[];
  targetAudience: string;
  tone: string;
}

interface GeneratedImages {
  images: string[];
}

export default function CampaignStudioPage() {
  // Main state
  const [prompt, setPrompt] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [selectedService, setSelectedService] = useState("");
  
  // Generated content
  const [campaign, setCampaign] = useState<GeneratedCampaign | null>(null);
  const [hooks, setHooks] = useState<string[]>([]);
  const [selectedHook, setSelectedHook] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  
  // Loading states
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  
  // Video settings
  const [videoFormat, setVideoFormat] = useState<"vertical" | "square" | "horizontal">("vertical");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  
  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishPlatforms, setPublishPlatforms] = useState({
    instagram: false,
    facebook: false,
    tiktok: false,
    youtube: false,
  });

  const selectTemplate = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setSelectedService(template.service);
    setPrompt(template.defaultPrompt);
    setHooks(template.hooks);
    setCampaign({
      headline: template.name,
      subheadline: "",
      hooks: template.hooks,
      benefits: template.benefits,
      cta: template.cta,
      instagramCaption: "",
      tiktokCaption: "",
      facebookCaption: "",
      hashtags: [],
      targetAudience: "",
      tone: template.style,
    });
  };

  const generateFullCampaign = async () => {
    if (!prompt) return;
    setIsGeneratingCampaign(true);
    try {
      const response = await fetch("/api/ai/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, service: selectedService, type: "full" }),
      });
      const data = await response.json();
      if (data.success) {
        setCampaign(data.data);
        setHooks(data.data.hooks || []);
      }
    } catch (error) {
      console.error("Failed to generate campaign:", error);
    }
    setIsGeneratingCampaign(false);
  };

  const generateHooks = async () => {
    if (!prompt) return;
    setIsGeneratingHooks(true);
    try {
      const response = await fetch("/api/ai/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, service: selectedService, type: "hooks" }),
      });
      const data = await response.json();
      if (data.success) {
        setHooks(data.data);
      }
    } catch (error) {
      console.error("Failed to generate hooks:", error);
    }
    setIsGeneratingHooks(false);
  };

  const generateImages = async () => {
    if (!prompt || !campaign?.headline) return;
    setIsGeneratingImages(true);
    try {
      const response = await fetch("/api/ai/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: selectedService || "med spa treatment",
          headline: campaign.headline,
          offer: campaign.cta,
          style: campaign.tone || "luxury",
          format: videoFormat,
          count: 4,
        }),
      });
      const data: GeneratedImages = await response.json();
      if (data.images) {
        setImages(data.images);
        setSelectedImage(data.images[0]);
      }
    } catch (error) {
      console.error("Failed to generate images:", error);
    }
    setIsGeneratingImages(false);
  };

  const generateVideo = async () => {
    if (!campaign) return;
    setIsGeneratingVideo(true);
    try {
      const response = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: selectedService || "custom",
          format: videoFormat,
          props: {
            serviceName: campaign.headline,
            headline: selectedHook || campaign.hooks[0] || campaign.headline,
            subheadline: campaign.subheadline,
            benefits: campaign.benefits,
            clinicName: BRAND_CONFIG.name,
            address: BRAND_CONFIG.location.address,
            city: `${BRAND_CONFIG.location.city}, ${BRAND_CONFIG.location.state}`,
            phone: BRAND_CONFIG.contact.phone,
            website: BRAND_CONFIG.contact.website,
            brandColor: BRAND_CONFIG.colors.primary,
            promoLabel: campaign.cta,
          },
        }),
      });
      const data = await response.json();
      if (data.videoUrl) {
        setGeneratedVideoUrl(data.videoUrl);
      } else if (data.jobId) {
        // Poll for completion
        pollVideoStatus(data.jobId);
      }
    } catch (error) {
      console.error("Failed to generate video:", error);
      setIsGeneratingVideo(false);
    }
  };

  const pollVideoStatus = async (jobId: string) => {
    const maxAttempts = 60;
    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/render-video?jobId=${jobId}`);
        const data = await res.json();
        if (data.job?.status === "completed") {
          clearInterval(poll);
          setGeneratedVideoUrl(data.job.videoUrl);
          setIsGeneratingVideo(false);
        } else if (data.job?.status === "failed" || attempts >= maxAttempts) {
          clearInterval(poll);
          setIsGeneratingVideo(false);
        }
      } catch {
        clearInterval(poll);
        setIsGeneratingVideo(false);
      }
    }, 3000);
  };

  const publishToSocial = async () => {
    if (!generatedVideoUrl) return;
    setIsPublishing(true);
    
    const platforms = Object.entries(publishPlatforms)
      .filter(([, enabled]) => enabled)
      .map(([platform]) => platform);

    for (const platform of platforms) {
      try {
        await fetch("/api/social/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform,
            videoUrl: generatedVideoUrl,
            caption: platform === "tiktok" 
              ? campaign?.tiktokCaption 
              : platform === "facebook" 
              ? campaign?.facebookCaption 
              : campaign?.instagramCaption,
          }),
        });
      } catch (error) {
        console.error(`Failed to post to ${platform}:`, error);
      }
    }
    
    setIsPublishing(false);
    alert("Campaign published!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ✨ AI Campaign Studio
          </h1>
          <p className="text-gray-400 mt-2">
            Generate complete social media campaigns in under 60 seconds
          </p>
        </div>

        {/* Main Prompt Box - Like Canva */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              What will you create today?
            </h2>
          </div>
          
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your campaign idea... (e.g., 'Tirzepatide weight loss VIP launch with special pricing')"
              className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none resize-none text-lg"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            <button
              onClick={generateFullCampaign}
              disabled={!prompt || isGeneratingCampaign}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-400 hover:to-purple-400 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isGeneratingCampaign ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>🚀 Generate Campaign</>
              )}
            </button>
            <button
              onClick={generateHooks}
              disabled={!prompt || isGeneratingHooks}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all disabled:opacity-50"
            >
              {isGeneratingHooks ? "..." : "🎯 Generate Hooks"}
            </button>
            <button
              onClick={generateImages}
              disabled={!campaign || isGeneratingImages}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all disabled:opacity-50"
            >
              {isGeneratingImages ? "..." : "🖼️ Generate Images"}
            </button>
            <button
              onClick={generateVideo}
              disabled={!campaign || isGeneratingVideo}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all disabled:opacity-50"
            >
              {isGeneratingVideo ? "..." : "🎬 Generate Video"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Templates & Settings */}
          <div className="space-y-6">
            {/* Campaign Templates */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                📋 Quick Templates
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {CAMPAIGN_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      selectedTemplate?.id === template.id
                        ? "bg-pink-500/30 border-pink-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    } border`}
                  >
                    <span className="text-xl">{template.icon}</span>
                    <div className="text-sm text-white font-medium mt-1">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Format */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">📐 Video Format</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "vertical", name: "Reel", icon: "📱", ratio: "9:16" },
                  { id: "square", name: "Feed", icon: "⬜", ratio: "1:1" },
                  { id: "horizontal", name: "Wide", icon: "🖥️", ratio: "16:9" },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setVideoFormat(format.id as "vertical" | "square" | "horizontal")}
                    className={`p-3 rounded-xl text-center transition-all ${
                      videoFormat === format.id
                        ? "bg-pink-500/30 border-pink-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    } border`}
                  >
                    <span className="text-xl">{format.icon}</span>
                    <div className="text-xs text-white mt-1">{format.name}</div>
                    <div className="text-xs text-gray-400">{format.ratio}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Hooks */}
            {hooks.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">🎯 Viral Hooks</h3>
                <div className="space-y-2">
                  {hooks.map((hook, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedHook(hook)}
                      className={`w-full p-3 rounded-xl text-left transition-all text-sm ${
                        selectedHook === hook
                          ? "bg-pink-500/30 border-pink-500 text-white"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      } border`}
                    >
                      "{hook}"
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Middle Column - Generated Content */}
          <div className="space-y-6">
            {/* Campaign Preview */}
            {campaign && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">📝 Campaign Content</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-pink-400 uppercase tracking-wide">Headline</label>
                    <div className="text-white font-bold text-xl mt-1">{campaign.headline}</div>
                  </div>
                  
                  {campaign.subheadline && (
                    <div>
                      <label className="text-xs text-pink-400 uppercase tracking-wide">Subheadline</label>
                      <div className="text-gray-300 mt-1">{campaign.subheadline}</div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-pink-400 uppercase tracking-wide">Benefits</label>
                    <ul className="mt-1 space-y-1">
                      {campaign.benefits.map((benefit, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                          <span className="text-pink-400">✓</span> {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label className="text-xs text-pink-400 uppercase tracking-wide">Call to Action</label>
                    <div className="mt-1 px-4 py-2 bg-pink-500 text-white rounded-lg inline-block font-medium">
                      {campaign.cta}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Images */}
            {images.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">🖼️ AI Images</h3>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === img ? "border-pink-500" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                      {selectedImage === img && (
                        <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                          <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs">Selected</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Social Captions */}
            {campaign?.instagramCaption && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">📱 Social Captions</h3>
                <div className="space-y-4">
                  {[
                    { platform: "Instagram", caption: campaign.instagramCaption, icon: "📸" },
                    { platform: "TikTok", caption: campaign.tiktokCaption, icon: "🎵" },
                    { platform: "Facebook", caption: campaign.facebookCaption, icon: "👥" },
                  ].map((item) => (
                    <div key={item.platform} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">{item.icon} {item.platform}</span>
                        <button
                          onClick={() => copyToClipboard(item.caption)}
                          className="text-xs text-pink-400 hover:text-pink-300"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">{item.caption}</p>
                    </div>
                  ))}
                  
                  {campaign.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {campaign.hashtags.map((tag, i) => (
                        <span key={i} className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview & Publish */}
          <div className="space-y-6">
            {/* Video Preview */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">🎬 Video Preview</h3>
              
              {isGeneratingVideo ? (
                <div className="aspect-[9/16] bg-black/50 rounded-xl flex flex-col items-center justify-center">
                  <svg className="animate-spin h-12 w-12 text-pink-500 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-gray-400">Generating video...</p>
                  <p className="text-gray-500 text-sm">This takes ~60 seconds</p>
                </div>
              ) : generatedVideoUrl ? (
                <div className="space-y-4">
                  <video
                    src={generatedVideoUrl}
                    controls
                    className="w-full rounded-xl"
                  />
                  <a
                    href={generatedVideoUrl}
                    download
                    className="block w-full py-3 bg-pink-500 hover:bg-pink-600 text-white text-center rounded-xl font-medium transition-colors"
                  >
                    📥 Download Video
                  </a>
                </div>
              ) : (
                <div className="aspect-[9/16] bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-xl flex flex-col items-center justify-center border border-dashed border-white/20">
                  <span className="text-4xl mb-2">🎬</span>
                  <p className="text-gray-400 text-sm">Video preview will appear here</p>
                </div>
              )}
            </div>

            {/* Publish Panel */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">📤 Publish Campaign</h3>
              
              <div className="space-y-3 mb-4">
                {[
                  { id: "instagram", name: "Instagram Reel", icon: "📸" },
                  { id: "facebook", name: "Facebook Reel", icon: "👥" },
                  { id: "tiktok", name: "TikTok", icon: "🎵" },
                  { id: "youtube", name: "YouTube Shorts", icon: "▶️" },
                ].map((platform) => (
                  <label
                    key={platform.id}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={publishPlatforms[platform.id as keyof typeof publishPlatforms]}
                      onChange={(e) =>
                        setPublishPlatforms((prev) => ({
                          ...prev,
                          [platform.id]: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded accent-pink-500"
                    />
                    <span className="text-xl">{platform.icon}</span>
                    <span className="text-white">{platform.name}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={publishToSocial}
                disabled={!generatedVideoUrl || isPublishing || !Object.values(publishPlatforms).some(Boolean)}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-pink-400 hover:to-purple-400 transition-all disabled:opacity-50"
              >
                {isPublishing ? "Publishing..." : "🚀 Publish Campaign"}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">📊 Campaign Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">{hooks.length}</div>
                  <div className="text-xs text-gray-400">Hooks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{images.length}</div>
                  <div className="text-xs text-gray-400">Images</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">{campaign?.benefits.length || 0}</div>
                  <div className="text-xs text-gray-400">Benefits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{generatedVideoUrl ? 1 : 0}</div>
                  <div className="text-xs text-gray-400">Videos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
