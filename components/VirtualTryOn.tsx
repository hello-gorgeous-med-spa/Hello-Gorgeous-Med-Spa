"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { FadeUp } from "./Section";
import { BOOKING_URL } from "@/lib/flows";

type Enhancement = {
  id: string;
  name: string;
  icon: string;
  description: string;
  intensity: number;
};

const enhancements: Enhancement[] = [
  {
    id: "lips",
    name: "Lip Enhancement",
    icon: "💋",
    description: "Fuller, more defined lips",
    intensity: 50,
  },
  {
    id: "smooth",
    name: "Smooth Skin",
    icon: "✨",
    description: "Reduce fine lines & texture",
    intensity: 50,
  },
  {
    id: "contour",
    name: "Face Contour",
    icon: "💎",
    description: "Defined cheeks & jawline",
    intensity: 50,
  },
  {
    id: "glow",
    name: "Radiant Glow",
    icon: "🌟",
    description: "Healthy, luminous skin",
    intensity: 50,
  },
  {
    id: "eyes",
    name: "Eye Refresh",
    icon: "👁️",
    description: "Brighter, more awake eyes",
    intensity: 50,
  },
];

export function VirtualTryOn() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeEnhancements, setActiveEnhancements] = useState<Map<string, number>>(
    new Map()
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.onload = () => {
        originalImageRef.current = img;
        setUploadedImage(event.target?.result as string);
        setIsProcessing(false);
        // Reset enhancements
        setActiveEnhancements(new Map());
        setShowComparison(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const toggleEnhancement = (id: string) => {
    const newEnhancements = new Map(activeEnhancements);
    if (newEnhancements.has(id)) {
      newEnhancements.delete(id);
    } else {
      newEnhancements.set(id, 50);
    }
    setActiveEnhancements(newEnhancements);
  };

  const updateIntensity = (id: string, value: number) => {
    const newEnhancements = new Map(activeEnhancements);
    newEnhancements.set(id, value);
    setActiveEnhancements(newEnhancements);
  };

  // Apply CSS filters based on enhancements - DRAMATIC effects
  const getFilterStyle = useCallback(() => {
    let brightness = 100;
    let contrast = 100;
    let saturate = 100;
    let blur = 0;
    let sepia = 0;
    let hueRotate = 0;

    activeEnhancements.forEach((intensity, id) => {
      const factor = intensity / 50; // 0-2 range (at 100% = 2x effect)

      switch (id) {
        case "smooth":
          // Soft, airbrushed skin effect
          blur += 1.5 * factor; // More noticeable smoothing
          brightness += 8 * factor;
          contrast -= 5 * factor; // Softer shadows
          break;
        case "glow":
          // Radiant, glowing skin
          brightness += 20 * factor; // Much brighter
          saturate += 25 * factor; // More vibrant
          sepia += 5 * factor; // Warm golden tone
          break;
        case "contour":
          // Defined, sculpted look
          contrast += 25 * factor; // Strong definition
          brightness += 5 * factor;
          saturate += 10 * factor;
          break;
        case "eyes":
          // Bright, awake eyes
          brightness += 15 * factor;
          contrast += 15 * factor;
          saturate += 15 * factor;
          break;
        case "lips":
          // Fuller, more vibrant lips
          saturate += 40 * factor; // Very saturated/rosy
          hueRotate += 5 * factor; // Slight pink shift
          contrast += 10 * factor;
          break;
      }
    });

    // Clamp values to reasonable ranges
    brightness = Math.min(brightness, 150);
    contrast = Math.max(80, Math.min(contrast, 150));
    saturate = Math.min(saturate, 180);
    blur = Math.min(blur, 3);

    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px) sepia(${sepia}%) hue-rotate(${hueRotate}deg)`,
      transition: "filter 0.5s ease-out",
    };
  }, [activeEnhancements]);

  // Handle comparison slider drag
  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !comparisonRef.current) return;
    const rect = comparisonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setComparisonPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!comparisonRef.current) return;
    const rect = comparisonRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setComparisonPosition(percentage);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const hasEnhancements = activeEnhancements.size > 0;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-black via-purple-950/10 to-black">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
              ✨ AI-Powered Preview
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Virtual{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Try-On
              </span>
            </h2>
            <p className="text-black max-w-xl mx-auto">
              Upload a selfie and preview how treatments could enhance your natural
              beauty. This is a simulation—real results vary.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Upload / Preview Area */}
          <FadeUp delayMs={60}>
            <div className="relative bg-gradient-to-b from-black to-black rounded-3xl p-6 border border-purple-500/20 min-h-[500px] flex flex-col">
              {!uploadedImage ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 transition-all hover:bg-purple-500/5"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition">
                      <span className="text-4xl">📸</span>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold text-lg">
                        Upload Your Selfie
                      </p>
                      <p className="text-black text-sm mt-1">
                        Front-facing photo works best
                      </p>
                    </div>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Sample photos */}
                  <div className="mt-8 text-center">
                    <p className="text-black text-sm mb-3">Or try with a sample:</p>
                    <div className="flex gap-3 justify-center">
                      {[
                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
                        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop&crop=face",
                      ].map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setIsProcessing(true);
                            const img = document.createElement("img");
                            img.crossOrigin = "anonymous";
                            img.onload = () => {
                              originalImageRef.current = img;
                              setUploadedImage(url);
                              setIsProcessing(false);
                            };
                            img.src = url;
                          }}
                          className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/30 hover:border-purple-500 transition hover:scale-110"
                        >
                          <Image
                            src={url}
                            alt={`Sample ${i + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  {/* Image comparison slider */}
                  {showComparison && hasEnhancements ? (
                    <div
                      ref={comparisonRef}
                      className="relative flex-1 rounded-2xl overflow-hidden cursor-ew-resize select-none"
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseMove={handleMouseMove}
                      onTouchMove={handleTouchMove}
                    >
                      {/* Original (left side) */}
                      <div
                        className="absolute inset-0"
                        style={{ clipPath: `inset(0 ${100 - comparisonPosition}% 0 0)` }}
                      >
                        <Image
                          src={uploadedImage}
                          alt="Original"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 text-white text-sm">
                          Before
                        </div>
                      </div>

                      {/* Enhanced (right side) */}
                      <div
                        className="absolute inset-0"
                        style={{ clipPath: `inset(0 0 0 ${comparisonPosition}%)` }}
                      >
                        <Image
                          src={uploadedImage}
                          alt="Enhanced"
                          fill
                          className="object-cover"
                          style={getFilterStyle()}
                        />
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-purple-500/70 text-white text-sm">
                          After
                        </div>
                      </div>

                      {/* Slider handle */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                        style={{ left: `${comparisonPosition}%` }}
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                          <span className="text-black">↔</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex-1 rounded-2xl overflow-hidden">
                      {/* Glow effect behind image when enhanced */}
                      {hasEnhancements && (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-purple-500/30 animate-pulse" />
                      )}
                      <Image
                        src={uploadedImage}
                        alt="Your photo"
                        fill
                        className="object-cover"
                        style={hasEnhancements ? getFilterStyle() : { transition: "filter 0.5s ease-out" }}
                      />
                      {/* Enhancement active indicator */}
                      {hasEnhancements && (
                        <>
                          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium animate-pulse shadow-lg shadow-purple-500/50">
                            ✨ Enhanced Preview
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/70 backdrop-blur-sm border border-purple-500/30">
                            <p className="text-purple-300 text-xs text-center">
                              {activeEnhancements.size} enhancement{activeEnhancements.size > 1 ? "s" : ""} applied • Adjust sliders to see changes
                            </p>
                          </div>
                        </>
                      )}
                      {!hasEnhancements && (
                        <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/70 backdrop-blur-sm border border-black">
                          <p className="text-black text-xs text-center">
                            👈 Select enhancements on the right to see your transformation
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Canvas for processing (hidden) */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Controls below image */}
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImage(null);
                        setActiveEnhancements(new Map());
                        setShowComparison(false);
                      }}
                      className="flex-1 py-3 rounded-xl bg-white border border-black text-white font-medium hover:bg-white transition"
                    >
                      Upload New Photo
                    </button>
                    {hasEnhancements && (
                      <button
                        type="button"
                        onClick={() => setShowComparison(!showComparison)}
                        className="flex-1 py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 font-medium hover:bg-purple-500/30 transition"
                      >
                        {showComparison ? "Hide Comparison" : "Compare Before/After"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-black/80 rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white">Processing image...</p>
                  </div>
                </div>
              )}
            </div>
          </FadeUp>

          {/* Enhancement Controls */}
          <FadeUp delayMs={120}>
            <div className="bg-gradient-to-b from-black to-black rounded-3xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-2">
                Enhancement Options
              </h3>
              <p className="text-black text-sm mb-6">
                Select treatments to preview their potential effects
              </p>

              <div className="space-y-4">
                {enhancements.map((enhancement) => {
                  const isActive = activeEnhancements.has(enhancement.id);
                  const intensity = activeEnhancements.get(enhancement.id) ?? 50;

                  return (
                    <div
                      key={enhancement.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isActive
                          ? "bg-purple-500/10 border-purple-500/30"
                          : "bg-white border-black hover:border-purple-500/20"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleEnhancement(enhancement.id)}
                        className="w-full flex items-center gap-4 text-left"
                        disabled={!uploadedImage}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition ${
                            isActive
                              ? "bg-gradient-to-br from-purple-500 to-pink-500"
                              : "bg-white"
                          }`}
                        >
                          {enhancement.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold">
                            {enhancement.name}
                          </p>
                          <p className="text-black text-sm">
                            {enhancement.description}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                            isActive
                              ? "bg-purple-500 border-purple-400"
                              : "border-black"
                          }`}
                        >
                          {isActive && <span className="text-white text-sm">✓</span>}
                        </div>
                      </button>

                      {/* Intensity slider */}
                      {isActive && (
                        <div className="mt-4 pl-16">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-black">Intensity</span>
                            <span className="text-purple-400 font-bold">{intensity}%</span>
                          </div>
                          <div className="relative">
                            {/* Track background */}
                            <div className="absolute inset-0 h-3 rounded-full bg-white" />
                            {/* Filled track */}
                            <div 
                              className="absolute left-0 top-0 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                              style={{ width: `${intensity}%` }}
                            />
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={intensity}
                              onChange={(e) =>
                                updateIntensity(enhancement.id, Number(e.target.value))
                              }
                              className="relative w-full h-3 rounded-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-black mt-1">
                            <span>Subtle</span>
                            <span>Dramatic</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Treatment mapping */}
              {hasEnhancements && (
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <p className="text-white font-semibold mb-2">
                    Recommended Treatments:
                  </p>
                  <ul className="space-y-1 text-sm">
                    {activeEnhancements.has("lips") && (
                      <li className="text-black">💋 Dermal Fillers (Lips)</li>
                    )}
                    {activeEnhancements.has("smooth") && (
                      <li className="text-black">💉 Botox + Skin Resurfacing</li>
                    )}
                    {activeEnhancements.has("contour") && (
                      <li className="text-black">💎 Cheek & Jawline Fillers</li>
                    )}
                    {activeEnhancements.has("glow") && (
                      <li className="text-black">✨ Glutathione + Vitamin IV</li>
                    )}
                    {activeEnhancements.has("eyes") && (
                      <li className="text-black">👁️ Under-eye Filler + Botox</li>
                    )}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 space-y-3">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-center hover:opacity-90 transition"
                >
                  Book Free Consultation →
                </a>
                <p className="text-black text-xs text-center">
                  * Virtual preview is for illustration only. Actual results depend
                  on individual factors and will be discussed during consultation.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
