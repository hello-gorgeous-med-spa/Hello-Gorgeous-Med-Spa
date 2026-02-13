"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { UploadArea } from "./UploadArea";
import { Controls } from "./Controls";

const SimulationCanvas = dynamic(() => import("./SimulationCanvas").then((m) => ({ default: m.SimulationCanvas })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16">
      <div className="w-10 h-10 border-2 border-[#E6007E]/40 border-t-[#E6007E] rounded-full animate-spin" />
    </div>
  ),
});
import type { SimulationLevel } from "@/utils/lipMorph";
import { BOOKING_URL } from "@/lib/flows";

export function LipStudio() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [level, setLevel] = useState<SimulationLevel>("original");
  const [consent, setConsent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setLevel("original");
    setIsProcessing(true);
    setFaceDetected(null);
  }, [imageSrc]);

  const handleLandmarksDetected = useCallback((detected: boolean) => {
    setFaceDetected(detected);
    setIsProcessing(false);
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

      {!imageSrc ? (
        <UploadArea
          onFileSelect={handleFileSelect}
          disabled={!consent}
          isProcessing={false}
        />
      ) : (
        <>
          <div className="space-y-4">
            <Controls value={level} onChange={setLevel} />
            <SimulationCanvas
              imageSrc={imageSrc}
              level={level}
              onLandmarksDetected={handleLandmarksDetected}
            />
          </div>

          <p className="text-[#5E5E66] text-xs text-center">
            Simulation for educational purposes only. Results vary based on anatomy and provider
            technique.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
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
              }}
              className="py-4 px-10 rounded-md border border-[#EAE4E8] text-[#111111] font-medium hover:bg-[#FDF7FA] transition"
            >
              Try Different Photo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
