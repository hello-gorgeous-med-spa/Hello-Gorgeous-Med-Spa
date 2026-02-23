"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { LeadGate } from "@/components/LeadGate";
import { BOOKING_URL } from "@/lib/flows";
import { trackHarmonyEvent } from "@/lib/hormone-analytics";
import type { HormoneBlueprintOutput } from "@/lib/hormone-types";

const TOTAL_STEPS = 5;

const AGE_RANGES = ["18–29", "30–39", "40–49", "50–59", "60+"];
const BIOLOGICAL_SEX_OPTIONS = ["Female", "Male", "Other / Prefer not to say"];
const MENOPAUSE_OPTIONS = ["Not applicable", "Perimenopause", "Menopause", "Post-menopause", "Unsure"];
const SYMPTOM_OPTIONS = [
  "Fatigue / low energy",
  "Poor sleep",
  "Mood changes / irritability",
  "Weight gain (especially midsection)",
  "Low libido",
  "Brain fog / memory",
  "Hot flashes / night sweats",
  "Hair thinning",
  "Muscle loss / weakness",
  "Joint discomfort",
  "Anxiety / depression",
  "Other",
];
const SCALE_OPTIONS = ["Very poor", "Poor", "Fair", "Good", "Very good"];
const STRESS_OPTIONS = ["Very low", "Low", "Moderate", "High", "Very high"];
const WEIGHT_OPTIONS = ["Losing easily", "Stable", "Slow gain", "Gaining despite effort", "Not sure"];

type IntakeState = {
  age_range: string;
  biological_sex: string;
  menopause_status: string;
  top_symptoms: string[];
  sleep_quality: string;
  energy_level: string;
  weight_change: string;
  stress_level: string;
  prior_hormone_therapy: boolean;
};

const INITIAL_INTAKE: IntakeState = {
  age_range: "",
  biological_sex: "",
  menopause_status: "",
  top_symptoms: [],
  sleep_quality: "",
  energy_level: "",
  weight_change: "",
  stress_level: "",
  prior_hormone_therapy: false,
};

export function HarmonyAI() {
  const [step, setStep] = useState(1);
  const [intake, setIntake] = useState<IntakeState>(INITIAL_INTAKE);
  const [blueprint, setBlueprint] = useState<HormoneBlueprintOutput | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailForSend, setEmailForSend] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    trackHarmonyEvent("hormone_assessment_started", {});
  }, []);

  const generateBlueprint = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/hormone/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...intake,
          uploaded_labs_url: null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data?.error || "Something went wrong");
        return;
      }
      setBlueprint(data.blueprint);
      setSessionId(data.session_id ?? null);
      setStatus("success");
      trackHarmonyEvent("hormone_blueprint_generated", { session_id: data.session_id ?? undefined });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }, [intake]);

  const sendEmail = useCallback(async () => {
    const email = emailForSend.trim().toLowerCase();
    if (!email || !sessionId) return;
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/hormone/email-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, email }),
      });
      if (!res.ok) {
        setEmailStatus("error");
        return;
      }
      setEmailStatus("sent");
      trackHarmonyEvent("hormone_blueprint_emailed", { session_id: sessionId });
    } catch {
      setEmailStatus("error");
    }
  }, [sessionId, emailForSend]);

  const handleBookClick = useCallback(() => {
    trackHarmonyEvent("hormone_blueprint_booked", { session_id: sessionId ?? undefined });
  }, [sessionId]);

  const toggleSymptom = (s: string) => {
    setIntake((p) => ({
      ...p,
      top_symptoms: p.top_symptoms.includes(s)
        ? p.top_symptoms.filter((x) => x !== s)
        : [...p.top_symptoms, s],
    }));
  };

  const progressPct = (step / TOTAL_STEPS) * 100;

  return (
    <LeadGate source="hormone" featureName="Harmony AI™" onUnlock={() => {}}>
    <div className="rounded-2xl border-2 border-black/10 bg-white overflow-hidden">
      <div className="h-2 bg-pink-100">
        <div
          className="h-full bg-[#FF2D8E] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {status !== "success" ? (
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#FF2D8E] mb-1">Harmony AI™</h3>
          <p className="text-sm text-black/60 mb-6">Step {step} of {TOTAL_STEPS}</p>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Age range</label>
                <select
                  value={intake.age_range}
                  onChange={(e) => setIntake((p) => ({ ...p, age_range: e.target.value }))}
                  className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E]"
                >
                  <option value="">Select</option>
                  {AGE_RANGES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Biological sex</label>
                <select
                  value={intake.biological_sex}
                  onChange={(e) => setIntake((p) => ({ ...p, biological_sex: e.target.value }))}
                  className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E]"
                >
                  <option value="">Select</option>
                  {BIOLOGICAL_SEX_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Menopause status</label>
                <select
                  value={intake.menopause_status}
                  onChange={(e) => setIntake((p) => ({ ...p, menopause_status: e.target.value }))}
                  className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E]"
                >
                  <option value="">Select</option>
                  {MENOPAUSE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Select all that apply</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SYMPTOM_OPTIONS.map((s) => (
                  <label key={s} className="flex items-center gap-2 p-3 rounded-xl border-2 border-black/10 hover:border-[#FF2D8E]/30 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={intake.top_symptoms.includes(s)}
                      onChange={() => toggleSymptom(s)}
                      className="rounded border-black/30 text-[#FF2D8E] focus:ring-[#FF2D8E]"
                    />
                    <span className="text-sm text-black">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Sleep quality</label>
                <select
                  value={intake.sleep_quality}
                  onChange={(e) => setIntake((p) => ({ ...p, sleep_quality: e.target.value }))}
                  className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E]"
                >
                  <option value="">Select</option>
                  {SCALE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Energy level</label>
                <select
                  value={intake.energy_level}
                  onChange={(e) => setIntake((p) => ({ ...p, energy_level: e.target.value }))}
                  className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E]"
                >
                  <option value="">Select</option>
                  {SCALE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Weight change (recent)</label>
                <select
                  value={intake.weight_change}
                  onChange={(e) => setIntake((p) => ({ ...p, weight_change: e.target.value }))}
                  className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E]"
                >
                  <option value="">Select</option>
                  {WEIGHT_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Stress level</label>
                <select
                  value={intake.stress_level}
                  onChange={(e) => setIntake((p) => ({ ...p, stress_level: e.target.value }))}
                  className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E]"
                >
                  <option value="">Select</option>
                  {STRESS_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Prior hormone therapy?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="prior"
                      checked={intake.prior_hormone_therapy === true}
                      onChange={() => setIntake((p) => ({ ...p, prior_hormone_therapy: true }))}
                      className="text-[#FF2D8E] focus:ring-[#FF2D8E]"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="prior"
                      checked={intake.prior_hormone_therapy === false}
                      onChange={() => setIntake((p) => ({ ...p, prior_hormone_therapy: false }))}
                      className="text-[#FF2D8E] focus:ring-[#FF2D8E]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <p className="text-sm text-black/60">Lab upload coming soon. You can share labs at your consultation.</p>
              <button
                type="button"
                onClick={generateBlueprint}
                disabled={status === "loading"}
                className="w-full py-4 px-6 rounded-xl bg-[#FF2D8E] text-white font-bold text-lg hover:bg-[#FF2D8E]/90 disabled:opacity-60 transition-all"
              >
                {status === "loading" ? "Generating your blueprint…" : "Generate My Hormone Blueprint"}
              </button>
              {status === "error" && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
            </div>
          )}

          {step < 5 && step >= 1 && (
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="px-4 py-2 rounded-xl border-2 border-black/20 text-black font-medium hover:bg-black/5"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
                className="px-6 py-2 rounded-xl bg-[#FF2D8E] text-white font-semibold hover:bg-[#FF2D8E]/90"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : blueprint ? (
        <div className="p-6 md:p-8 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-[#FF2D8E] mb-2">{blueprint.blueprint_title}</h2>
          <p className="text-black/80 mb-6">{blueprint.confidence_message}</p>

          {blueprint.likely_patterns?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wide mb-2">Likely hormonal pattern</h3>
              <ul className="list-disc list-inside text-black space-y-1">
                {blueprint.likely_patterns.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {typeof blueprint.severity_score === "number" && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wide mb-2">Severity score</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-4 bg-pink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF2D8E] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, blueprint.severity_score))}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-black">{blueprint.severity_score}/100</span>
              </div>
            </div>
          )}

          {blueprint.recommended_labs?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wide mb-2">Recommended labs</h3>
              <ul className="list-disc list-inside text-black space-y-0.5">
                {blueprint.recommended_labs.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          )}

          {blueprint.recommended_protocol?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wide mb-2">Optimization pathway</h3>
              <div className="space-y-3">
                {blueprint.recommended_protocol.map((p, i) => (
                  <div key={i} className="p-3 rounded-xl border-2 border-black/10 bg-pink-50/30">
                    <p className="font-semibold text-black">{p.therapy}</p>
                    <p className="text-sm text-black/70">{p.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl border-2 border-black/10">
              <p className="text-xs font-semibold text-black/60 uppercase">Timeline</p>
              <p className="text-black font-medium">{blueprint.timeline_expectation || "—"}</p>
            </div>
            <div className="p-4 rounded-xl border-2 border-black/10">
              <p className="text-xs font-semibold text-black/60 uppercase">Investment range</p>
              <p className="text-black font-medium">{blueprint.estimated_investment_range || "To be reviewed at consultation"}</p>
            </div>
          </div>

          <p className="text-sm text-black/60 mb-6">
            This is an educational insight and not a medical diagnosis. Must be reviewed by a licensed provider.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBookClick}
              className="inline-flex justify-center py-3 px-6 rounded-xl bg-[#FF2D8E] text-white font-bold hover:bg-[#FF2D8E]/90"
            >
              Book Consultation
            </a>
            <div className="flex gap-2 items-center">
              <input
                type="email"
                placeholder="Email my blueprint"
                value={emailForSend}
                onChange={(e) => setEmailForSend(e.target.value)}
                className="flex-1 rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E] text-sm"
              />
              <button
                type="button"
                onClick={sendEmail}
                disabled={emailStatus === "sending"}
                className="py-3 px-5 rounded-xl bg-black text-white font-semibold hover:bg-black/80 disabled:opacity-60 text-sm"
              >
                {emailStatus === "sending" ? "Sending…" : "Send"}
              </button>
            </div>
            {emailStatus === "sent" && <span className="text-[#FF2D8E] font-medium">✓ Sent</span>}
            {emailStatus === "error" && <span className="text-red-600 text-sm">Send failed. Try again.</span>}
          </div>
          <p className="mt-4 text-xs text-black/50">Save to Dashboard coming soon.</p>
        </div>
      ) : null}
    </div>
    </LeadGate>
  );
}
