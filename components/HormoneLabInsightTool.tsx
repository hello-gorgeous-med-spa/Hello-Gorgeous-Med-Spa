"use client";

import { useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { FadeUp } from "./Section";
import { BOOKING_URL } from "@/lib/flows";

const DISCLAIMER_TEXT =
  "This tool provides educational information only and does not diagnose, treat, or replace medical advice. Always consult your licensed healthcare provider.";

type Step = "disclaimer" | "upload" | "processing" | "results" | "error";

export function HormoneLabInsightTool() {
  const [step, setStep] = useState<Step>("disclaimer");
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAcceptDisclaimer = useCallback(() => {
    if (!disclaimerAccepted) return;
    setStep("upload");
  }, [disclaimerAccepted]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    const ext = (selectedFile.name || "").toLowerCase().split(".").pop();
    if (!["pdf", "jpg", "jpeg", "png"].includes(ext || "")) {
      setError("Only PDF, JPG, and PNG files are supported.");
      setStep("error");
      return;
    }
    setFile(selectedFile);
    setError(null);
    setStep("upload");
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file || !disclaimerAccepted) return;
    setLoading(true);
    setStep("processing");
    setError(null);

    const formData = new FormData();
    formData.append("labFile", file);
    formData.append("disclaimerAccepted", "true");

    try {
      const res = await fetch("/api/analyze-lab", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed.");
      }
      setInsights(data.insights || "");
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  }, [file, disclaimerAccepted]);

  const handleReset = useCallback(() => {
    setStep("disclaimer");
    setDisclaimerAccepted(false);
    setFile(null);
    setInsights(null);
    setError(null);
  }, []);

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-white" data-site="public">
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full border border-black text-[#FF2D8E] text-sm font-medium mb-4">
              🧪 AI-Powered Education
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#FF2D8E] mb-3">
              Upload Your Hormone Labs. Get Smarter Questions.
            </h2>
            <p className="text-[#000000]/80 max-w-2xl mx-auto">
              AI-powered educational insights to help you have a more informed conversation with your doctor.
            </p>
          </div>
        </FadeUp>

        <div className="rounded-2xl border-2 border-black/10 bg-[#FFFFFF]/50 p-6 md:p-8 shadow-md">
          {/* Step 1: Disclaimer Modal */}
          {step === "disclaimer" && (
            <FadeUp>
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-[#000000] text-sm leading-relaxed">{DISCLAIMER_TEXT}</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disclaimerAccepted}
                    onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-black text-[#FF2D8E] focus:ring-[#FF2D8E]"
                  />
                  <span className="text-[#000000] text-sm">
                    I understand this tool provides educational information only and does not diagnose, treat, or replace medical advice. I will consult my healthcare provider.
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleAcceptDisclaimer}
                  disabled={!disclaimerAccepted}
                  className="w-full py-4 px-6 bg-[#FF2D8E] text-white font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  I Accept — Continue
                </button>
              </div>
            </FadeUp>
          )}

          {/* Step 2: Upload */}
          {step === "upload" && (
            <FadeUp>
              <div className="space-y-6">
                <LabUploadArea
                  onFileSelect={handleFileSelect}
                  selectedFile={file}
                  onClear={() => setFile(null)}
                  disabled={loading}
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="flex-1 py-4 px-6 bg-[#FF2D8E] text-white font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Analyze My Labs
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-4 px-6 border border-black/20 text-[#000000] font-semibold rounded-full hover:bg-black/5 transition"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </FadeUp>
          )}

          {/* Step 3: Processing */}
          {step === "processing" && (
            <FadeUp>
              <div className="flex flex-col items-center justify-center py-16 gap-6">
                <div className="w-14 h-14 border-3 border-[#FF2D8E]/30 border-t-[#FF2D8E] rounded-full animate-spin" />
                <p className="text-[#000000]/80 font-medium">Analyzing your labs...</p>
                <p className="text-[#000000]/80 text-sm">This usually takes 30–45 seconds.</p>
              </div>
            </FadeUp>
          )}

          {/* Step 4: Results */}
          {step === "results" && insights && (
            <FadeUp>
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#000000]">Your Educational Insights</h3>
                <div
                  className="prose prose-sm max-w-none prose-headings:text-[#FF2D8E] prose-p:text-[#000000] prose-li:text-[#000000] prose-strong:text-[#000000]"
                  data-site="public"
                >
                  <ReactMarkdown>{insights}</ReactMarkdown>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <p className="text-xs text-[#000000]/80 mb-4 italic">{DISCLAIMER_TEXT}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={`${BOOKING_URL}?service=biote-hormone-therapy`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-4 px-6 bg-[#FF2D8E] text-white font-bold rounded-full text-center hover:opacity-90 transition"
                    >
                      Book Hormone Consultation
                    </a>
                    <a
                      href="/services/biote-hormone-therapy"
                      className="py-4 px-6 border border-black/20 text-[#000000] font-semibold rounded-full text-center hover:bg-black/5 transition"
                    >
                      Learn About Hormone Therapy
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="py-4 px-6 text-[#000000]/80 font-medium rounded-full hover:bg-black/5 transition"
                    >
                      Analyze Another Lab
                    </button>
                  </div>
                </div>
              </div>
            </FadeUp>
          )}

          {/* Error */}
          {step === "error" && (
            <FadeUp>
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-4 px-6 bg-[#FF2D8E] text-white font-bold rounded-full hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </div>
            </FadeUp>
          )}
        </div>
      </div>
    </section>
  );
}

interface LabUploadAreaProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

function LabUploadArea({ onFileSelect, selectedFile, onClear, disabled }: LabUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChooseDifferent = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClear();
      inputRef.current?.click();
    },
    [onClear]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      const f = e.dataTransfer.files[0];
      if (f) onFileSelect(f);
    },
    [onFileSelect, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) onFileSelect(f);
      e.target.value = "";
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[#FF2D8E]/50 hover:bg-[#FFFFFF]/50"}
        border-[#FF2D8E]/30 bg-[#FFFFFF]/30
      `}
      onClick={() => !disabled && !selectedFile && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      {selectedFile ? (
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl">📄</span>
          <p className="text-[#000000] font-semibold">{selectedFile.name}</p>
          <p className="text-[#000000]/80 text-sm">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          <button
            type="button"
            onClick={handleChooseDifferent}
            className="text-[#FF2D8E] font-medium text-sm hover:underline"
          >
            Choose different file
          </button>
        </div>
      ) : (
        <>
          <div className="text-4xl mb-3">🧪</div>
          <p className="text-[#000000] font-semibold mb-1">Upload your lab report</p>
          <p className="text-[#000000]/80 text-sm">Drag and drop or click to select. PDF, JPG, or PNG.</p>
        </>
      )}
    </div>
  );
}
