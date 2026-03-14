"use client";

import { useState, useEffect } from "react";

interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
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
  voiceoverUrl?: string;
}

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
  { id: "botox", name: "Botox", description: "Anti-wrinkle treatment promo" },
  { id: "morpheus8", name: "Morpheus8", description: "RF microneedling promo" },
  { id: "weightloss", name: "Weight Loss", description: "Semaglutide/Tirzepatide promo" },
  { id: "fillers", name: "Dermal Fillers", description: "Lip & facial filler promo" },
  { id: "prf", name: "PRF Hair Restoration", description: "Hair regrowth promo" },
  { id: "iv", name: "IV Therapy", description: "Vitamin infusion promo" },
  { id: "custom", name: "Custom Service", description: "Create your own promo" },
];

const DEFAULT_BENEFITS: Record<string, string[]> = {
  solaria: [
    "Stimulates collagen production",
    "Reduces fine lines & wrinkles",
    "Improves skin texture",
    "Minimal downtime",
  ],
  botox: [
    "Reduces fine lines & wrinkles",
    "Quick 15-minute treatment",
    "No downtime required",
    "Results last 3-4 months",
  ],
  morpheus8: [
    "Tightens loose skin",
    "Reduces fat & cellulite",
    "Stimulates collagen",
    "Minimal downtime",
  ],
  weightloss: [
    "FDA-approved medication",
    "Average 15-20% weight loss",
    "Reduces appetite naturally",
    "Physician supervised",
  ],
  fillers: [
    "Instant volume restoration",
    "Smooths lines & wrinkles",
    "Enhances lips & cheeks",
    "Results last 12-18 months",
  ],
  prf: [
    "Uses your own platelets",
    "Stimulates hair follicles",
    "No surgery required",
    "Natural-looking results",
  ],
  iv: [
    "Immediate hydration",
    "Boost energy levels",
    "Enhance immunity",
    "Fast 30-45 min treatment",
  ],
  custom: [
    "Benefit One",
    "Benefit Two",
    "Benefit Three",
    "Benefit Four",
  ],
};

export default function VideoGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("solaria");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  
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
  });
  const [isGeneratingVoiceover, setIsGeneratingVoiceover] = useState(false);

  useEffect(() => {
    const template = SERVICE_TEMPLATES.find((t) => t.id === selectedTemplate);
    if (template && selectedTemplate !== "custom") {
      const serviceNames: Record<string, string> = {
        solaria: "Solaria CO2 Laser",
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

  const handleGenerateVoiceover = async () => {
    setIsGeneratingVoiceover(true);
    try {
      const response = await fetch("/api/generate-voiceover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: selectedTemplate,
          voicePreset: formData.voicePreset,
          customText: formData.customVoiceScript || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Voiceover generated! File: ${result.filename}\nVoice: ${result.voice}`);
      } else {
        const error = await response.json();
        alert(`Failed to generate voiceover: ${error.error}\n${error.hint || ""}`);
      }
    } catch (error) {
      console.error("Error generating voiceover:", error);
      alert("Failed to generate voiceover. Check console for details.");
    }
    setIsGeneratingVoiceover(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    let voiceoverUrl: string | undefined;
    
    if (formData.includeVoiceover) {
      try {
        const voiceResponse = await fetch("/api/generate-voiceover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service: selectedTemplate,
            voicePreset: formData.voicePreset,
            customText: formData.customVoiceScript || undefined,
          }),
        });
        if (voiceResponse.ok) {
          const voiceResult = await voiceResponse.json();
          voiceoverUrl = voiceResult.audioUrl;
        }
      } catch (e) {
        console.error("Voiceover generation failed:", e);
      }
    }
    
    const newVideo: GeneratedVideo = {
      id: `video-${Date.now()}`,
      name: `${formData.serviceName} Promo`,
      service: formData.serviceName,
      format: formData.format,
      createdAt: new Date().toISOString(),
      status: "rendering",
      caption: generateCaption(),
      voiceoverUrl,
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
            voiceoverUrl,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.jobId) {
          const pollForCompletion = async () => {
            const maxAttempts = 40;
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
      console.error("Error generating video:", error);
      setGeneratedVideos((prev) =>
        prev.map((v) =>
          v.id === newVideo.id ? { ...v, status: "failed" } : v
        )
      );
    }

    setIsGenerating(false);
  };

  const generateCaption = () => {
    const captions: Record<string, string> = {
      solaria: `✨ Introducing the Solaria CO2 Fractional Laser at Hello Gorgeous Med Spa! 

🔥 ${formData.promoLabel}: ${formData.price}

📍 74 W Washington St, Oswego, IL
📞 630-636-6193
🌐 hellogorgeousmedspa.com

#SolariaCO2 #LaserResurfacing #MedSpa #Oswego #HelloGorgeous #SkinCare #AntiAging`,

      botox: `💉 Smooth away wrinkles with Botox at Hello Gorgeous!

✨ ${formData.promoLabel}: ${formData.price}

Quick 15-min treatment • No downtime • Results in 3-5 days

📍 74 W Washington St, Oswego, IL
📞 630-636-6193

#Botox #AntiAging #MedSpa #Oswego #HelloGorgeous #WrinkleFree`,

      morpheus8: `🔥 Tighten & contour with Morpheus8!

RF Microneedling technology for:
✅ Skin tightening
✅ Fat reduction
✅ Collagen stimulation

${formData.promoLabel}: ${formData.price}

📍 Hello Gorgeous Med Spa, Oswego IL
📞 630-636-6193

#Morpheus8 #SkinTightening #MedSpa #Oswego #HelloGorgeous`,

      weightloss: `🏃‍♀️ Transform your body with medical weight loss!

${formData.promoLabel}: ${formData.price}

✅ FDA-approved
✅ Average 15-20% weight loss
✅ Physician supervised

📍 Hello Gorgeous Med Spa, Oswego IL
📞 630-636-6193

#WeightLoss #Semaglutide #MedicalWeightLoss #Oswego #HelloGorgeous`,

      fillers: `💋 Restore volume & enhance your features!

${formData.promoLabel}: ${formData.price}

• Lips • Cheeks • Jawline • Under eyes

📍 Hello Gorgeous Med Spa, Oswego IL
📞 630-636-6193

#DermalFillers #LipFiller #MedSpa #Oswego #HelloGorgeous`,

      prf: `🌱 Regrow your hair naturally with PRF!

${formData.promoLabel}: ${formData.price}

Uses your own growth factors • No surgery • Natural results

📍 Hello Gorgeous Med Spa, Oswego IL
📞 630-636-6193

#PRFHair #HairRestoration #MedSpa #Oswego #HelloGorgeous`,

      iv: `💧 Boost your wellness with IV Therapy!

${formData.promoLabel}: ${formData.price}

Hydration • Energy • Immunity • Recovery

📍 Hello Gorgeous Med Spa, Oswego IL
📞 630-636-6193

#IVTherapy #Wellness #MedSpa #Oswego #HelloGorgeous`,
    };

    return captions[selectedTemplate] || captions.solaria;
  };

  const copyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    alert("Caption copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pink-500 mb-2">
            Video Generator
          </h1>
          <p className="text-gray-400">
            Create professional marketing videos for your services in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">1. Select Service</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SERVICE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplate === template.id
                        ? "border-pink-500 bg-pink-500/20"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customize Content */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">2. Customize Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={formData.serviceName}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceName: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) =>
                      setFormData({ ...formData, headline: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Subheadline (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subheadline}
                    onChange={(e) =>
                      setFormData({ ...formData, subheadline: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Promo Label
                  </label>
                  <input
                    type="text"
                    value={formData.promoLabel}
                    onChange={(e) =>
                      setFormData({ ...formData, promoLabel: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Original Price (strikethrough)
                  </label>
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Benefits (4 bullet points)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                      placeholder={`Benefit ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">3. Select Format</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "vertical", label: "Vertical", desc: "9:16 Reels/TikTok", icon: "📱" },
                  { id: "square", label: "Square", desc: "1:1 Feed Posts", icon: "⬜" },
                  { id: "horizontal", label: "Horizontal", desc: "16:9 Website", icon: "🖥️" },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        format: format.id as "vertical" | "square" | "horizontal",
                      })
                    }
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      formData.format === format.id
                        ? "border-pink-500 bg-pink-500/20"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="text-3xl mb-2">{format.icon}</div>
                    <div className="font-medium">{format.label}</div>
                    <div className="text-xs text-gray-400">{format.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Voiceover */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">4. AI Voiceover</h2>
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                  ElevenLabs
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setFormData({ ...formData, includeVoiceover: !formData.includeVoiceover })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.includeVoiceover ? "bg-pink-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      formData.includeVoiceover ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm">Include AI voiceover narration</span>
              </div>

              {formData.includeVoiceover && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Voice</label>
                    <div className="grid grid-cols-2 gap-2">
                      {VOICE_PRESETS.map((voice) => (
                        <button
                          key={voice.id}
                          onClick={() => setFormData({ ...formData, voicePreset: voice.id })}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            formData.voicePreset === voice.id
                              ? "border-purple-500 bg-purple-500/20"
                              : "border-gray-700 hover:border-gray-600"
                          }`}
                        >
                          <div className="font-medium text-sm">{voice.name}</div>
                          <div className="text-xs text-gray-400">{voice.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Custom Script (optional)
                    </label>
                    <textarea
                      value={formData.customVoiceScript}
                      onChange={(e) => setFormData({ ...formData, customVoiceScript: e.target.value })}
                      placeholder="Leave empty to use auto-generated script based on service..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none h-24 resize-none text-sm"
                    />
                  </div>

                  <button
                    onClick={handleGenerateVoiceover}
                    disabled={isGeneratingVoiceover}
                    className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isGeneratingVoiceover ? "Generating..." : "🎙️ Generate Voiceover Only"}
                  </button>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
                isGenerating
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-6 w-6"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating Video...
                </span>
              ) : (
                "🎬 Generate Video"
              )}
            </button>
          </div>

          {/* Right: Generated Videos */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Generated Videos</h2>

              {generatedVideos.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">🎬</div>
                  <p>No videos generated yet</p>
                  <p className="text-sm">Create your first video above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedVideos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{video.name}</div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            video.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : video.status === "rendering"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : video.status === "failed"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-600 text-gray-400"
                          }`}
                        >
                          {video.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-3">
                        {video.format} • {new Date(video.createdAt).toLocaleTimeString()}
                      </div>

                      {video.status === "completed" && (
                        <div className="space-y-2">
                          <button
                            onClick={() => video.url && window.open(video.url, "_blank")}
                            className="w-full bg-pink-500 hover:bg-pink-600 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            ⬇️ Download Video
                          </button>
                          <button
                            onClick={() => video.caption && copyCaption(video.caption)}
                            className="w-full bg-gray-600 hover:bg-gray-500 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            📋 Copy Caption
                          </button>
                        </div>
                      )}

                      {video.status === "rendering" && (
                        <div className="bg-gray-600 rounded-full h-2 overflow-hidden">
                          <div className="bg-pink-500 h-full w-1/2 animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
