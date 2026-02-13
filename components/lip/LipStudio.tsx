"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { UploadArea } from "./UploadArea";
import { Controls } from "./Controls";
import {
  trackLipStudioUploadInitiated,
  trackLipStudioSimulationSelected,
  trackLipStudioCTAClick,
  trackLipStudioTimeSpent,
} from "@/lib/lip-studio-analytics";
import type { SimulationLevel } from "@/utils/lipMorph";
import { BOOKING_URL } from "@/lib/flows";

const SimulationCanvas = dynamic(() => import("./SimulationCanvas").then((m) => ({ default: m.SimulationCanvas })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16">
      <div className="w-10 h-10 border-2 border-[#E6007E]/40 border-t-[#E6007E] rounded-full animate-spin" />
    </div>
  ),
});

const DEMO_IMAGE = "/images/hg-botox-face-neck.png";

export function LipStudio() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [level, setLevel] = useState<SimulationLevel>("original");
  const [consent, setConsent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null);
  const [showPeakEmotionCTA, setShowPeakEmotionCTA] = useState(false);
  const sessionStartRef = useRef<number>(Date.now());

  const handleLevelChange = useCallback((newLevel: SimulationLevel) => {
    setLevel(newLevel);
    trackLipStudioSimulationSelected(newLevel);
    if (newLevel === "one" || newLevel === "oneHalf") {
      setShowPeakEmotionCTA(true);
    }
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    trackLipStudioUploadInitiated();
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setLevel("original");
    setIsProcessing(true);
    setFaceDetected(null);
    setShowPeakEmotionCTA(false);
  }, [imageSrc]);

  const handleLandmarksDetected = useCallback((detected: boolean) => {
    setFaceDetected(detected);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    return () => {
      const seconds = (Date.now() - sessionStartRef.current) / 1000;
      if (seconds > 5) trackLipStudioTimeSpent(seconds);
    };
  }, []);

  const handleCTAClick = useCallback((source: "primary" | "peak_emotion") => {
    trackLipStudioCTAClick(source);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Disclaimer before upload */}
      <div className="rounded-xl bg-[#FDF7FA] border border-[#E6007E]/20 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-[#E6007E]/50 text-[#E6007E] focus:ring-[#E6007E]"
          />
          <span className="text-[#111111] text-sm">
            I understand this is a simulated preview only. Results are for educational purposes and
            will vary based on anatomy and provider technique.
          </span>
        </label>
      </div>

      {/* P3: See a Real Example First */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#111111]">See a Real Example First</h3>
        <Controls value={level} onChange={handleLevelChange} />
        <SimulationCanvas
          imageSrc={DEMO_IMAGE}
          level={level}
          onLandmarksDetected={() => {}}
        />
      </div>

      {/* Now try yours */}
      <div className="space-y-4 pt-4 border-t border-[#EAE4E8]">
        <h3 className="text-lg font-semibold text-[#111111]">Now try yours</h3>
        {!imageSrc ? (
          <UploadArea
            onFileSelect={handleFileSelect}
            disabled={!consent}
            isProcessing={false}
          />
        ) : (
          <>
            <Controls value={level} onChange={handleLevelChange} />
            <SimulationCanvas
              imageSrc={imageSrc}
              level={level}
              onLandmarksDetected={handleLandmarksDetected}
            />

            <p className="text-[#5E5E66] text-xs text-center">
              Simulation for educational purposes only. Results vary based on anatomy and provider
              technique.
            </p>

            {/* P7: Peak emotion CTA - show after 1 or 1.5 syringe */}
            {showPeakEmotionCTA && (
              <div className="rounded-xl bg-[#FDF7FA] border border-[#E6007E]/20 p-6 text-center">
                <p className="text-[#111111] font-medium mb-4">Love this look?</p>
                <Link
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleCTAClick("peak_emotion")}
                  className="inline-flex justify-center items-center py-3 px-8 rounded-md bg-[#E6007E] hover:bg-[#B0005F] text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Schedule your personalized consultation
                </Link>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCTAClick("primary")}
                className="inline-flex justify-center items-center py-4 px-10 rounded-md bg-[#E6007E] hover:bg-[#B0005F] text-white font-semibold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Book Lip Consultation
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (imageSrc) URL.revokeObjectURL(imageSrc);
                  setImageSrc(null);
                  setLevel("original");
                  setFaceDetected(null);
                  setShowPeakEmotionCTA(false);
                }}
                className="py-4 px-10 rounded-md border border-[#EAE4E8] text-[#111111] font-medium hover:bg-[#FDF7FA] transition"
              >
                Try Different Photo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
