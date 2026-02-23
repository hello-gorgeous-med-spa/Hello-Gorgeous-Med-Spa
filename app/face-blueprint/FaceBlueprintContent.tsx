"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LeadGate } from "@/components/LeadGate";
import { FaceBlueprintCanvas } from "@/components/face/FaceBlueprintCanvas";
import { trackFaceEvent } from "@/lib/face-analytics";
import { BOOKING_URL } from "@/lib/flows";
import type { FaceServiceId, FaceIntensityLevel, FaceBlueprintAIOutput } from "@/lib/face-types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png";

const SERVICES: { id: FaceServiceId; label: string }[] = [
  { id: "botox_smoothing", label: "Botox smoothing" },
  { id: "lip_filler_volume", label: "Lip filler volume" },
  { id: "chin_projection", label: "Chin projection" },
  { id: "jawline_contour", label: "Jawline contour" },
  { id: "undereye_correction", label: "Under-eye correction" },
  { id: "co2_texture_smoothing", label: "CO₂ texture smoothing" },
];

const INTENSITY_OPTIONS: { value: FaceIntensityLevel; label: string }[] = [
  { value: "subtle", label: "Subtle" },
  { value: "balanced", label: "Balanced" },
  { value: "dramatic", label: "Dramatic" },
];

export function FaceBlueprintContent() {
  const searchParams = useSearchParams();
  const roadmapSessionId = searchParams.get("roadmap_session_id") || undefined;

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<FaceServiceId[]>([]);
  const [intensityLevel, setIntensityLevel] = useState<FaceIntensityLevel>("balanced");
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [comparePosition, setComparePosition] = useState(50);
  const [consentGiven, setConsentGiven] = useState(false);

  const [blueprintStatus, setBlueprintStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [blueprint, setBlueprint] = useState<FaceBlueprintAIOutput | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [blueprintError, setBlueprintError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (roadmapSessionId) {
      fetch(`/api/face/roadmap-prefill?session_id=${encodeURIComponent(roadmapSessionId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.recommended_services?.length) {
            setSelectedServices((prev) => {
              const next = [...prev];
              for (const id of data.recommended_services) {
                if (!next.includes(id)) next.push(id);
              }
              return next.slice(0, 20);
            });
          }
        })
        .catch(() => {});
    }
  }, [roadmapSessionId]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setUploadError("Please use JPG or PNG only.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setUploadError("Image must be under 5MB.");
      return;
    }
    trackFaceEvent("face_upload_started", {});
    const url = URL.createObjectURL(file);
    setImageSrc(url);
  }, []);

  const toggleService = useCallback((id: FaceServiceId) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const getBlueprint = useCallback(async () => {
    setBlueprintStatus("loading");
    setBlueprintError(null);
    trackFaceEvent("face_simulation_generated", {});
    try {
      const res = await fetch("/api/face/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selected_services: selectedServices,
          intensity_level: intensityLevel,
          roadmap_session_id: roadmapSessionId || null,
          consent_given: consentGiven,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBlueprintStatus("error");
        setBlueprintError(data?.error || "Something went wrong.");
        return;
      }
      setBlueprint({
        aesthetic_summary: data.aesthetic_summary,
        recommended_priority_order: data.recommended_priority_order || [],
        estimated_investment_range: data.estimated_investment_range || "To be reviewed during consult",
        confidence_message: data.confidence_message || "",
      });
      setSessionId(data.session_id ?? null);
      setBlueprintStatus("success");
      trackFaceEvent("face_blueprint_saved", { session_id: data.session_id });
    } catch {
      setBlueprintStatus("error");
      setBlueprintError("Network error. Please try again.");
    }
  }, [selectedServices, intensityLevel, roadmapSessionId, consentGiven]);

  const sendEmail = useCallback(async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !sessionId) return;
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/face/email-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailStatus("error");
        return;
      }
      setEmailStatus("sent");
    } catch {
      setEmailStatus("error");
    }
  }, [sessionId, email]);

  const handleBookClick = useCallback(() => {
    trackFaceEvent("face_blueprint_booked", { session_id: sessionId ?? undefined });
  }, [sessionId]);

  return (
    <LeadGate source="face_blueprint" featureName="HG Face Blueprint™" onUnlock={() => {}}>
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <p className="text-[#FF2D8D] text-sm font-semibold uppercase tracking-wider mb-2">
            HG Face Blueprint™
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight">
            See your aesthetic potential
          </h1>
          <p className="mt-3 text-black/80 text-lg max-w-xl">
            Upload a selfie, select treatments, and get a personalized blueprint. No pressure—just clarity before your consultation.
          </p>
        </div>
      </section>

      {/* Upload + Preview */}
      <section className="bg-gradient-to-b from-white to-pink-50/20 py-10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-6">
          <h2 className="text-xl font-semibold text-black">Upload your photo</h2>
          {!imageSrc ? (
            <label className="block rounded-xl border-2 border-dashed border-[#FF2D8D]/40 bg-white/80 p-8 text-center cursor-pointer hover:border-[#FF2D8D]/60 transition-colors">
              <input
                type="file"
                accept={ACCEPT}
                className="sr-only"
                onChange={handleFile}
              />
              <span className="text-[#FF2D8D] font-medium">Choose a selfie (JPG or PNG, max 5MB)</span>
              <p className="text-black/50 text-sm mt-2">Front-facing, good lighting</p>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => { setImageSrc(null); setBlueprint(null); setBlueprintStatus("idle"); }}
                  className="text-sm text-[#FF2D8D] hover:underline"
                >
                  Change photo
                </button>
                <label className="flex items-center gap-2 text-sm text-black cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLandmarks}
                    onChange={(e) => setShowLandmarks(e.target.checked)}
                  />
                  Show landmark overlay
                </label>
              </div>
              {uploadError && (
                <p className="text-[#FF2D8D] text-sm">{uploadError}</p>
              )}
              <FaceBlueprintCanvas
                imageSrc={imageSrc}
                selectedServices={selectedServices}
                intensityLevel={intensityLevel}
                showLandmarks={showLandmarks}
                comparePosition={comparePosition}
                onLandmarksDetected={() => {}}
              />
              <div className="flex items-center gap-3">
                <span className="text-xs text-black/60">Before</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={comparePosition}
                  onChange={(e) => setComparePosition(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none bg-black/10 accent-[#FF2D8D]"
                />
                <span className="text-xs text-black/60">After</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Service grid */}
      <section className="py-10 border-t border-black/5">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <h2 className="text-xl font-semibold text-black mb-4">Select treatments</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleService(s.id)}
                className={`rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                  selectedServices.includes(s.id)
                    ? "border-[#FF2D8D] bg-[#FF2D8D]/10 text-black"
                    : "border-black/15 bg-white text-black/80 hover:border-[#FF2D8D]/40"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Intensity */}
      <section className="py-6 border-t border-black/5">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <h2 className="text-xl font-semibold text-black mb-4">Intensity</h2>
          <div className="flex flex-wrap gap-3">
            {INTENSITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setIntensityLevel(opt.value)}
                className={`rounded-lg border-2 px-5 py-2.5 text-sm font-medium ${
                  intensityLevel === opt.value
                    ? "border-[#FF2D8D] bg-[#FF2D8D]/10 text-black"
                    : "border-black/15 bg-white text-black/80 hover:border-[#FF2D8D]/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Consent + Get Blueprint */}
      <section className="py-10 border-t border-black/5">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-black/80">
              I confirm I have read the disclaimer. My photo is for simulation only and will not be stored unless I consent.
            </span>
          </label>
          <button
            type="button"
            onClick={getBlueprint}
            disabled={blueprintStatus === "loading"}
            className="rounded-lg bg-[#FF2D8D] text-white font-semibold px-6 py-3 hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {blueprintStatus === "loading" ? "Generating…" : "Get my blueprint"}
          </button>
          {blueprintError && (
            <p className="text-[#FF2D8D] text-sm">{blueprintError}</p>
          )}
        </div>
      </section>

      {/* AI Summary */}
      {blueprint && (
        <section className="py-10 bg-pink-50/30 border-t border-black/5">
          <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-6">
            <h2 className="text-xl font-semibold text-black">Your blueprint</h2>
            <div className="rounded-xl bg-white border border-black/10 p-6 space-y-4">
              <p className="text-black/90 leading-relaxed">{blueprint.aesthetic_summary}</p>
              {blueprint.recommended_priority_order?.length > 0 && (
                <p className="text-sm">
                  <strong>Suggested order:</strong>{" "}
                  {blueprint.recommended_priority_order.join(" → ")}
                </p>
              )}
              <p className="text-sm">
                <strong>Estimated investment:</strong>{" "}
                {blueprint.estimated_investment_range}
              </p>
              <p className="text-sm text-black/70">{blueprint.confidence_message}</p>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleBookClick}
                className="rounded-lg bg-[#FF2D8D] text-white font-semibold px-6 py-3 hover:opacity-90"
              >
                Book consultation
              </a>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Email my blueprint"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-black/20 px-4 py-2 text-sm w-56"
                />
                <button
                  type="button"
                  onClick={sendEmail}
                  disabled={emailStatus === "sending" || emailStatus === "sent"}
                  className="rounded-lg border-2 border-[#FF2D8D] text-[#FF2D8D] font-medium px-4 py-2 text-sm hover:bg-[#FF2D8D]/10 disabled:opacity-60"
                >
                  {emailStatus === "sending" ? "Sending…" : emailStatus === "sent" ? "Sent" : "Email results"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="py-8 border-t border-black/5">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <p className="text-xs text-black/50">
            Results vary by individual. All treatments performed by licensed medical professionals. Client consent on file. This tool is for education only and is not a substitute for an in-person consultation.
          </p>
        </div>
      </section>
    </div>
    </LeadGate>
  );
}
