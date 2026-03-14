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
  solaria: ["Stimulates collagen production", "Reduces fine lines & wrinkles", "Improves skin texture", "Minimal downtime"],
  botox: ["Reduces fine lines & wrinkles", "Quick 15-minute treatment", "No downtime required", "Results last 3-4 months"],
  morpheus8: ["Tightens loose skin", "Reduces fat & cellulite", "Stimulates collagen", "Minimal downtime"],
  weightloss: ["FDA-approved medication", "Average 15-20% weight loss", "Reduces appetite naturally", "Physician supervised"],
  fillers: ["Instant volume restoration", "Smooths lines & wrinkles", "Enhances lips & cheeks", "Results last 12-18 months"],
  prf: ["Uses your own platelets", "Stimulates hair follicles", "No surgery required", "Natural-looking results"],
  iv: ["Immediate hydration", "Boost energy levels", "Enhance immunity", "Fast 30-45 min treatment"],
  custom: ["Benefit One", "Benefit Two", "Benefit Three", "Benefit Four"],
};

interface VideoScene {
  id: string;
  name: string;
  duration: string;
  textOnScreen: string;
  voiceoverScript: string;
}

const DEFAULT_SCENES: Record<string, VideoScene[]> = {
  solaria: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Introducing the future of skin rejuvenation." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Sun damage? Fine lines? Uneven texture?", voiceoverScript: "Tired of sun damage, fine lines, and uneven skin texture?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "SOLARIA CO2 LASER", voiceoverScript: "The Solaria CO2 Fractional Laser delivers dramatic results with minimal downtime." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Benefits appear one by one", voiceoverScript: "Stimulate collagen. Resurface skin. Reduce wrinkles. Improve texture." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL RESULTS", voiceoverScript: "See the transformation for yourself." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "VIP LAUNCH SPECIAL $1,895", voiceoverScript: "Book now at our exclusive launch price of eighteen ninety-five." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa, Oswego Illinois. Call today." },
  ],
  botox: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Smooth away the years." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Wrinkles? Crow's feet? Frown lines?", voiceoverScript: "Don't let wrinkles define your look." },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "BOTOX", voiceoverScript: "Botox delivers natural-looking results in just fifteen minutes." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Quick • No Downtime • Natural", voiceoverScript: "Quick treatment. No downtime. Natural-looking results that last." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL RESULTS", voiceoverScript: "Join thousands of satisfied clients." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "SPECIAL: $10/unit", voiceoverScript: "Now just ten dollars per unit." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Book your appointment today." },
  ],
  morpheus8: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Tighten. Contour. Transform." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Loose skin? Loss of definition?", voiceoverScript: "Is loose skin making you look older than you feel?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "MORPHEUS8", voiceoverScript: "Morpheus8 combines microneedling with radiofrequency for unmatched skin tightening." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Tightens • Contours • Rejuvenates", voiceoverScript: "Tighten loose skin. Reduce fat. Stimulate collagen naturally." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL RESULTS", voiceoverScript: "See the dramatic transformation." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "VIP PRICING AVAILABLE", voiceoverScript: "Ask about our VIP pricing." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Call now." },
  ],
  weightloss: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Transform your body. Transform your life." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Struggling to lose weight?", voiceoverScript: "Tired of diets that don't work?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "MEDICAL WEIGHT LOSS", voiceoverScript: "Our physician-supervised weight loss program uses FDA-approved medication." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "15-20% Weight Loss Average", voiceoverScript: "Clients see an average of fifteen to twenty percent weight loss." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL TRANSFORMATIONS", voiceoverScript: "Real people. Real results." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "NEW PATIENT SPECIAL", voiceoverScript: "Start your transformation today with our new patient special." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Your journey starts now." },
  ],
  fillers: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Restore. Enhance. Define." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Lost volume? Thin lips?", voiceoverScript: "Missing that youthful fullness?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "DERMAL FILLERS", voiceoverScript: "Premium dermal fillers restore volume and enhance your natural beauty." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Lips • Cheeks • Jawline", voiceoverScript: "Enhance lips. Define cheeks. Sculpt your jawline." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "STUNNING RESULTS", voiceoverScript: "See the difference expert injection makes." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "SPRING SPECIAL", voiceoverScript: "Ask about our current special offers." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Book your consultation." },
  ],
  prf: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Regrow your confidence." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Thinning hair? Receding hairline?", voiceoverScript: "Hair loss affecting your confidence?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "PRF HAIR RESTORATION", voiceoverScript: "PRF uses your own growth factors to stimulate natural hair regrowth." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Natural • Non-Surgical • Effective", voiceoverScript: "No surgery. No synthetic ingredients. Just your body's natural healing power." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL REGROWTH", voiceoverScript: "See thicker, healthier hair." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "LIMITED TIME OFFER", voiceoverScript: "Book your treatment package today." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Restore your hair." },
  ],
  iv: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Feel amazing from the inside out." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Tired? Dehydrated? Run down?", voiceoverScript: "Feeling exhausted and run down?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "IV THERAPY", voiceoverScript: "IV Therapy delivers vitamins and hydration directly to your bloodstream." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Energy • Immunity • Recovery", voiceoverScript: "Boost energy. Strengthen immunity. Speed recovery." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "FEEL THE DIFFERENCE", voiceoverScript: "Feel revitalized in just thirty minutes." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "WELLNESS SPECIAL", voiceoverScript: "Try our most popular IV cocktail." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Recharge today." },
  ],
  custom: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Your intro voiceover here." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Problem statement here", voiceoverScript: "Describe the problem your service solves." },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "YOUR SERVICE NAME", voiceoverScript: "Introduce your solution." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Key benefits listed", voiceoverScript: "List the key benefits." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL RESULTS", voiceoverScript: "Show the results." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "SPECIAL OFFER", voiceoverScript: "Present your offer." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Call to action here." },
  ],
};

export default function VideoGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("solaria");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  
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
  const [showScriptEditor, setShowScriptEditor] = useState(false);
  const [videoScenes, setVideoScenes] = useState<VideoScene[]>(DEFAULT_SCENES.solaria);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

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
      setVideoScenes(DEFAULT_SCENES[selectedTemplate] || DEFAULT_SCENES.custom);
    }
  }, [selectedTemplate]);

  const updateScene = (sceneId: string, field: "textOnScreen" | "voiceoverScript", value: string) => {
    setVideoScenes((prev) =>
      prev.map((scene) =>
        scene.id === sceneId ? { ...scene, [field]: value } : scene
      )
    );
  };

  const generateFullScript = () => {
    return videoScenes.map((scene) => scene.voiceoverScript).join(" ");
  };

  const handleGenerateAIScript = async () => {
    setIsGeneratingScript(true);
    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName: formData.serviceName,
          headline: formData.headline,
          price: formData.price,
          benefits: formData.benefits,
          promoLabel: formData.promoLabel,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.scenes) {
          setVideoScenes(result.scenes);
        }
      } else {
        alert("Failed to generate script. Using default template.");
      }
    } catch (error) {
      console.error("Error generating script:", error);
      alert("Failed to generate script. Using default template.");
    }
    setIsGeneratingScript(false);
  };

  const handleImageUpload = (type: "before" | "after", file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "before") {
        setBeforeImage(reader.result as string);
      } else {
        setAfterImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

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
        const scriptToUse = formData.customVoiceScript || generateFullScript();
        const voiceResponse = await fetch("/api/generate-voiceover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service: selectedTemplate,
            voicePreset: formData.voicePreset,
            customText: scriptToUse,
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
            beforeImage,
            afterImage,
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

  const [postingTo, setPostingTo] = useState<string | null>(null);

  const handlePostToSocial = async (videoId: string, platform: "instagram" | "facebook" | "google") => {
    const video = generatedVideos.find((v) => v.id === videoId);
    if (!video || !video.url) {
      alert("Video not ready for posting");
      return;
    }

    setPostingTo(`${videoId}-${platform}`);

    try {
      const response = await fetch("/api/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          videoUrl: video.url,
          caption: video.caption || "",
          serviceName: video.service,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`✅ Successfully posted to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
      } else {
        alert(`❌ Failed to post to ${platform}: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error(`Error posting to ${platform}:`, error);
      alert(`❌ Failed to post to ${platform}. Check console for details.`);
    }

    setPostingTo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-pink-50 to-gray-100 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent mb-2">
            🎬 Video Generator
          </h1>
          <p className="text-pink-600/80 text-lg">
            Create professional marketing videos for your services in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
              <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
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
                        ? "border-pink-500 bg-pink-100 shadow-lg shadow-pink-500/20"
                        : "border-gray-200 hover:border-pink-400/50 bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-gray-800">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customize Content */}
            <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
              <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                Customize Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    Subheadline (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subheadline}
                    onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    Promo Label
                  </label>
                  <input
                    type="text"
                    value={formData.promoLabel}
                    onChange={(e) => setFormData({ ...formData, promoLabel: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    💰 Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400 text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    Original Price (strikethrough)
                  </label>
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  ✨ Benefits (4 bullet points)
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
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                      placeholder={`Benefit ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Before/After Photos */}
            <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
              <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
                Before/After Photos (Optional)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">📸 Before Photo</label>
                  <input
                    ref={beforeInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload("before", e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => beforeInputRef.current?.click()}
                    className={`w-full h-32 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${
                      beforeImage
                        ? "border-green-500 bg-green-50"
                        : "border-pink-300 hover:border-pink-500 bg-pink-50/50"
                    }`}
                  >
                    {beforeImage ? (
                      <>
                        <span className="text-green-600 text-2xl">✓</span>
                        <span className="text-green-600 text-sm">Photo uploaded</span>
                      </>
                    ) : (
                      <>
                        <span className="text-pink-500 text-3xl">+</span>
                        <span className="text-gray-500 text-sm">Click to upload</span>
                      </>
                    )}
                  </button>
                  {beforeImage && (
                    <button
                      onClick={() => setBeforeImage(null)}
                      className="mt-2 text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">📸 After Photo</label>
                  <input
                    ref={afterInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload("after", e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => afterInputRef.current?.click()}
                    className={`w-full h-32 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${
                      afterImage
                        ? "border-green-500 bg-green-50"
                        : "border-pink-300 hover:border-pink-500 bg-pink-50/50"
                    }`}
                  >
                    {afterImage ? (
                      <>
                        <span className="text-green-600 text-2xl">✓</span>
                        <span className="text-green-600 text-sm">Photo uploaded</span>
                      </>
                    ) : (
                      <>
                        <span className="text-pink-500 text-3xl">+</span>
                        <span className="text-gray-500 text-sm">Click to upload</span>
                      </>
                    )}
                  </button>
                  {afterImage && (
                    <button
                      onClick={() => setAfterImage(null)}
                      className="mt-2 text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Video Script Editor */}
            <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                  <span className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">4</span>
                  Video Script Editor
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                    Scene-by-Scene Control
                  </span>
                  <button
                    onClick={() => setShowScriptEditor(!showScriptEditor)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showScriptEditor ? "▼ Hide" : "▶ Show"}
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Control exactly what appears on screen and what the AI voiceover says in each scene.
              </p>

              {showScriptEditor && (
                <div className="space-y-4">
                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={handleGenerateAIScript}
                      disabled={isGeneratingScript}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isGeneratingScript ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>✨ AI Generate Script</>
                      )}
                    </button>
                    <button
                      onClick={() => setVideoScenes(DEFAULT_SCENES[selectedTemplate] || DEFAULT_SCENES.custom)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                    >
                      🔄 Reset to Default
                    </button>
                  </div>

                  {/* Scene Editor */}
                  <div className="space-y-3">
                    {videoScenes.map((scene, index) => (
                      <div key={scene.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="font-medium text-gray-800">{scene.name}</span>
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              {scene.duration}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1 font-medium">
                              📺 Text on Screen
                            </label>
                            <input
                              type="text"
                              value={scene.textOnScreen}
                              onChange={(e) => updateScene(scene.id, "textOnScreen", e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1 font-medium">
                              🎙️ Voiceover Script
                            </label>
                            <input
                              type="text"
                              value={scene.voiceoverScript}
                              onChange={(e) => updateScene(scene.id, "voiceoverScript", e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Full Script Preview */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">📝 Full Voiceover Script Preview</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generateFullScript());
                          alert("Script copied to clipboard!");
                        }}
                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 italic">
                      "{generateFullScript()}"
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Est. duration: ~{Math.ceil(generateFullScript().split(" ").length / 2.5)} seconds
                    </p>
                  </div>
                </div>
              )}

              {!showScriptEditor && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>{videoScenes.length} scenes</strong> configured • Click "Show" to customize each scene's text and voiceover
                  </p>
                </div>
              )}
            </div>

            {/* Format Selection */}
            <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
              <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">5</span>
                Select Format
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "vertical", label: "Vertical", desc: "9:16 Reels/TikTok", icon: "📱" },
                  { id: "square", label: "Square", desc: "1:1 Feed Posts", icon: "⬜" },
                  { id: "horizontal", label: "Horizontal", desc: "16:9 Website", icon: "🖥️" },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setFormData({ ...formData, format: format.id as "vertical" | "square" | "horizontal" })}
                    className={`p-4 rounded-xl border-2 transition-all text-center hover:scale-[1.02] ${
                      formData.format === format.id
                        ? "border-pink-500 bg-pink-100 shadow-lg shadow-pink-500/20"
                        : "border-gray-200 hover:border-pink-400/50 bg-gray-50"
                    }`}
                  >
                    <div className="text-3xl mb-2">{format.icon}</div>
                    <div className="font-medium text-gray-800">{format.label}</div>
                    <div className="text-xs text-gray-500">{format.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Voiceover */}
            <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-purple-600 flex items-center gap-2">
                  <span className="bg-purple-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">6</span>
                  AI Voiceover
                </h2>
                <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                  ElevenLabs
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setFormData({ ...formData, includeVoiceover: !formData.includeVoiceover })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    formData.includeVoiceover ? "bg-purple-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      formData.includeVoiceover ? "translate-x-7" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">Include AI voiceover narration</span>
              </div>

              {formData.includeVoiceover && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">🎙️ Voice</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {VOICE_PRESETS.map((voice) => (
                        <button
                          key={voice.id}
                          onClick={() => setFormData({ ...formData, voicePreset: voice.id })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            formData.voicePreset === voice.id
                              ? "border-purple-500 bg-purple-100"
                              : "border-gray-200 hover:border-purple-400/50 bg-gray-50"
                          }`}
                        >
                          <div className="font-medium text-sm text-gray-800">{voice.name}</div>
                          <div className="text-xs text-gray-500">{voice.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">
                      Custom Script (optional)
                    </label>
                    <textarea
                      value={formData.customVoiceScript}
                      onChange={(e) => setFormData({ ...formData, customVoiceScript: e.target.value })}
                      placeholder="Leave empty to use auto-generated script..."
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none h-24 resize-none text-sm text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <button
                    onClick={handleGenerateVoiceover}
                    disabled={isGeneratingVoiceover}
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
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
              className={`w-full py-5 rounded-2xl font-bold text-xl transition-all shadow-xl ${
                isGenerating
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 hover:from-pink-400 hover:via-pink-500 hover:to-purple-500 shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.01]"
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
            <div className="bg-white rounded-2xl p-6 sticky top-8 border border-pink-200 shadow-lg">
              <h2 className="text-xl font-semibold text-pink-600 mb-4">Generated Videos</h2>

              {generatedVideos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-gray-500">No videos generated yet</p>
                  <p className="text-sm text-gray-400 mt-1">Create your first video above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedVideos.map((video) => (
                    <div key={video.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-800">{video.name}</div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            video.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : video.status === "rendering"
                              ? "bg-yellow-100 text-yellow-600"
                              : video.status === "failed"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {video.status === "rendering" ? "⏳ Rendering..." : video.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        {video.format} • {new Date(video.createdAt).toLocaleTimeString()}
                      </div>

                      {video.status === "completed" && (
                        <div className="space-y-2">
                          <button
                            onClick={() => video.url && window.open(video.url, "_blank")}
                            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 py-2 rounded-xl text-sm font-medium transition-all"
                          >
                            ⬇️ Download Video
                          </button>
                          <button
                            onClick={() => video.caption && copyCaption(video.caption)}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl text-sm font-medium transition-colors"
                          >
                            📋 Copy Caption
                          </button>

                          {/* Social Media Post Buttons */}
                          <div className="pt-2 border-t border-gray-200 mt-2">
                            <p className="text-xs text-gray-500 mb-2 text-center">Post to Social Media</p>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => handlePostToSocial(video.id, "instagram")}
                                disabled={postingTo === `${video.id}-instagram`}
                                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-400 hover:via-pink-400 hover:to-orange-400 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {postingTo === `${video.id}-instagram` ? "..." : "📸 IG"}
                              </button>
                              <button
                                onClick={() => handlePostToSocial(video.id, "facebook")}
                                disabled={postingTo === `${video.id}-facebook`}
                                className="bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {postingTo === `${video.id}-facebook` ? "..." : "📘 FB"}
                              </button>
                              <button
                                onClick={() => handlePostToSocial(video.id, "google")}
                                disabled={postingTo === `${video.id}-google`}
                                className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 hover:from-blue-400 hover:via-green-400 hover:to-yellow-400 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {postingTo === `${video.id}-google` ? "..." : "🔍 Google"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {video.status === "rendering" && (
                        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full w-1/2 animate-pulse" />
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
