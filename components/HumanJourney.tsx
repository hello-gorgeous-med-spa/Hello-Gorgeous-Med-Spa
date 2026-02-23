"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { LeadGate } from "@/components/LeadGate";
import { BOOKING_URL } from "@/lib/flows";
import { trackJourneyEvent } from "@/lib/journey-analytics";
import type { RoadmapAIOutput } from "@/lib/journey-types";

const CONFIDENCE_LABELS = {
  primary_concern: "What brings you in today?",
  desired_change_level: "How much change are you looking for?",
  experience_level: "Is this your first time with aesthetic treatments?",
  timeline_preference: "When are you hoping to see results?",
  downtime_preference: "How do you feel about downtime?",
  decision_style: "How do you like to make decisions?",
};

type FormState = {
  primary_concern: string;
  desired_change_level: "subtle" | "balanced" | "dramatic";
  experience_level: "first_time" | "experienced";
  timeline_preference: "immediate" | "flexible";
  downtime_preference: "minimal" | "okay_with_downtime";
  decision_style: "cautious" | "ready_now";
};

const INITIAL_FORM: FormState = {
  primary_concern: "",
  desired_change_level: "balanced",
  experience_level: "first_time",
  timeline_preference: "flexible",
  downtime_preference: "minimal",
  decision_style: "cautious",
};

const FADE_IN_KEYFRAMES =
  "@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }";

const JOURNEY_FEATURES = [
  "Answer a few quick questions (concerns, experience, timeline)",
  "Get your personalized HG Roadmap™",
  "See suggested services, order & timeline",
  "Estimated investment range & maintenance plan",
  "Email your results or book a consultation",
];

function useSessionState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.sessionStorage.getItem(key);
      if (!raw) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);
  return [value, setValue];
}

export function HumanJourney() {
  const [form, setForm] = useSessionState<FormState>("hg.journey.form", INITIAL_FORM);
  const [roadmap, setRoadmap] = useState<RoadmapAIOutput | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailForSend, setEmailForSend] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    trackJourneyEvent("journey_started", {});
  }, []);

  const generateRoadmap = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/journey/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_concern: form.primary_concern.trim(),
          desired_change_level: form.desired_change_level,
          experience_level: form.experience_level,
          timeline_preference: form.timeline_preference,
          downtime_preference: form.downtime_preference,
          decision_style: form.decision_style,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data?.error || "Something went wrong");
        return;
      }
      setRoadmap(data.roadmap);
      setSessionId(data.session_id ?? null);
      setStatus("success");
      trackJourneyEvent("roadmap_generated", { session_id: data.session_id ?? undefined });
    } catch (e) {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }, [form]);

  const sendEmail = useCallback(async () => {
    const email = emailForSend.trim().toLowerCase();
    if (!email) return;
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/journey/email-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailStatus("error");
        return;
      }
      setEmailStatus("sent");
      trackJourneyEvent("roadmap_emailed", { session_id: sessionId });
    } catch {
      setEmailStatus("error");
    }
  }, [sessionId, emailForSend]);

  const handleBookClick = useCallback(() => {
    trackJourneyEvent("roadmap_booked", { session_id: sessionId ?? undefined });
  }, [sessionId]);

  return (
    <LeadGate
      source="journey"
      featureName="Your Journey"
      onUnlock={() => {}}
      features={JOURNEY_FEATURES}
      heroTitle="Feel clear before you commit"
      heroSubtitle="A short flow to help you feel confident. No medical advice. No pressure. Just clarity—then your personalized HG Roadmap™."
    >
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <p className="text-[#FF2D8E] text-lg font-semibold mb-3 tracking-wide uppercase">
            Your Journey
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-black">
            Feel clear before you <span className="text-[#FF2D8E]">commit</span>
          </h1>
          <p className="mt-4 text-lg text-black/80 max-w-xl">
            A short flow to help you feel confident. No medical advice. No pressure. Just clarity.
          </p>
        </div>
      </div>

      {/* Confidence Check form */}
      <div className="bg-gradient-to-b from-white to-pink-50/30 py-12">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <div className="rounded-2xl border-2 border-black/10 bg-white p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h2 className="text-xl font-bold text-black">Confidence Check™</h2>
                    <p className="text-sm text-black/60">Quick questions to personalize your roadmap</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1">
                      {CONFIDENCE_LABELS.primary_concern}
                    </label>
                    <textarea
                      value={form.primary_concern}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, primary_concern: e.target.value }))
                      }
                      className="w-full min-h-[100px] rounded-xl border-2 border-black/20 px-4 py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#FF2D8E] transition-colors resize-none"
                      placeholder="e.g. forehead lines, wanting to feel like myself again, dull skin…"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-1">
                      {CONFIDENCE_LABELS.desired_change_level}
                    </label>
                    <select
                      value={form.desired_change_level}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          desired_change_level: e.target.value as FormState["desired_change_level"],
                        }))
                      }
                      className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E] transition-colors"
                    >
                      <option value="subtle">Subtle</option>
                      <option value="balanced">Balanced</option>
                      <option value="dramatic">Dramatic</option>
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">
                        {CONFIDENCE_LABELS.experience_level}
                      </label>
                      <select
                        value={form.experience_level}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            experience_level: e.target.value as FormState["experience_level"],
                          }))
                        }
                        className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E] transition-colors"
                      >
                        <option value="first_time">First time</option>
                        <option value="experienced">Experienced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">
                        {CONFIDENCE_LABELS.timeline_preference}
                      </label>
                      <select
                        value={form.timeline_preference}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            timeline_preference: e.target.value as FormState["timeline_preference"],
                          }))
                        }
                        className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E] transition-colors"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">
                        {CONFIDENCE_LABELS.downtime_preference}
                      </label>
                      <select
                        value={form.downtime_preference}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            downtime_preference: e.target
                              .value as FormState["downtime_preference"],
                          }))
                        }
                        className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E] transition-colors"
                      >
                        <option value="minimal">Minimal</option>
                        <option value="okay_with_downtime">Okay with some downtime</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">
                        {CONFIDENCE_LABELS.decision_style}
                      </label>
                      <select
                        value={form.decision_style}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            decision_style: e.target.value as FormState["decision_style"],
                          }))
                        }
                        className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E] transition-colors"
                      >
                        <option value="cautious">I like to take my time</option>
                        <option value="ready_now">I'm ready to move</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={generateRoadmap}
                      disabled={status === "loading"}
                      className="w-full py-4 px-6 rounded-xl bg-[#FF2D8E] text-white font-bold text-lg hover:bg-[#FF2D8E]/90 disabled:opacity-60 transition-all shadow-lg shadow-[#FF2D8E]/20"
                    >
                      {status === "loading" ? "Generating your roadmap…" : "Generate My Roadmap"}
                    </button>
                    {status === "error" && (
                      <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border-2 border-black/10 bg-pink-50/50 p-6">
                <h3 className="font-bold text-black mb-2">What you'll get</h3>
                <ul className="space-y-2 text-black/80 text-sm">
                  <li>• Personalized service suggestions</li>
                  <li>• Suggested order & timeline</li>
                  <li>• Estimated investment range</li>
                  <li>• Maintenance plan</li>
                  <li>• Option to email or book</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HG Roadmap™ result */}
      {status === "success" && roadmap ? (
        <div
          className="py-12 animate-in fade-in duration-500"
          style={{ animation: "fadeIn 0.5s ease-out" }}
        >
          <style dangerouslySetInnerHTML={{ __html: FADE_IN_KEYFRAMES }} />
          <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-10">
            {/* Section 1: Roadmap header */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF2D8E]">
                Your HG Roadmap™
              </h2>
              <p className="mt-3 text-lg text-black/80 max-w-2xl mx-auto">
                {roadmap.confidence_message}
              </p>
            </div>

            {/* Section 2: Treatment plan cards */}
            <div>
              <h3 className="text-xl font-bold text-black mb-4">Your treatment plan</h3>
              <div className="grid gap-4">
                {roadmap.recommended_services
                  .slice()
                  .sort((a, b) => a.priority_order - b.priority_order)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap items-start gap-3 p-5 rounded-2xl border-2 border-black/10 bg-white hover:border-[#FF2D8E]/30 transition-colors"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF2D8E] text-white flex items-center justify-center text-sm font-bold">
                        {item.priority_order}
                      </span>
                      <div>
                        <p className="font-bold text-black">{item.service}</p>
                        <p className="text-black/70 text-sm mt-0.5">{item.reason}</p>
                      </div>
                    </div>
                  ))}
            </div>
            </div>

            {/* Section 3 & 4: Timeline + Investment */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border-2 border-black/10 bg-white">
                <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wide mb-1">
                  Timeline
                </h3>
                <p className="text-xl font-bold text-[#FF2D8E]">
                  {roadmap.estimated_sessions} · {roadmap.timeline_estimate}
                </p>
              </div>
              <div className="p-6 rounded-2xl border-2 border-black/10 bg-white">
                <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wide mb-1">
                  Estimated investment
                </h3>
                <p className="text-xl font-bold text-[#FF2D8E]">{roadmap.estimated_cost_range}</p>
              </div>
            </div>

            {/* Section 5: Maintenance */}
            {roadmap.maintenance_plan && (
              <div className="p-6 rounded-2xl border-2 border-black/10 bg-pink-50/50">
                <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wide mb-1">
                  Maintenance
                </h3>
                <p className="text-black">{roadmap.maintenance_plan}</p>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-sm text-black/60 text-center max-w-2xl mx-auto">
              This plan is educational and must be reviewed by a licensed provider at Hello
              Gorgeous.
            </p>

            {/* CTAs: when sessionId exists, go via redirect so we can set cookie and later set conversion_status = booked */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={sessionId ? `/api/journey/redirect-to-booking?session_id=${sessionId}` : BOOKING_URL}
                target={sessionId ? undefined : "_blank"}
                rel={sessionId ? undefined : "noopener noreferrer"}
                onClick={handleBookClick}
                className="inline-flex justify-center py-4 px-8 rounded-xl bg-[#FF2D8E] text-white font-bold hover:bg-[#FF2D8E]/90 transition shadow-lg shadow-[#FF2D8E]/20"
              >
                Book My Consultation
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.print();
                }}
                className="inline-flex justify-center py-4 px-8 rounded-xl border-2 border-black text-black font-semibold hover:bg-black/5 transition"
              >
                Download My Plan
              </a>
            </div>

            {/* Email my results */}
            <div className="max-w-md mx-auto p-6 rounded-2xl border-2 border-black/10 bg-white">
              <h3 className="font-bold text-black mb-2">Email my results</h3>
              {emailStatus === "sent" ? (
                <p className="text-[#FF2D8E] font-medium">✓ Sent to your email.</p>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={emailForSend}
                    onChange={(e) => setEmailForSend(e.target.value)}
                    className="flex-1 rounded-xl border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#FF2D8E]"
                  />
                  <button
                    type="button"
                    onClick={sendEmail}
                    disabled={emailStatus === "sending"}
                    className="py-3 px-5 rounded-xl bg-black text-white font-semibold hover:bg-black/80 disabled:opacity-60"
                  >
                    {emailStatus === "sending" ? "Sending…" : "Send"}
                  </button>
                </div>
              )}
              {emailStatus === "error" && (
                <p className="mt-2 text-sm text-red-600">Could not send. Try again.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Journey links */}

      <div className="bg-white py-12 border-t border-black/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-2xl font-bold text-black mb-6">Explore more</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/fix-what-bothers-me"
              className="px-5 py-2.5 rounded-xl border-2 border-black/20 text-black font-medium hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition"
            >
              Fix What Bothers Me
            </Link>
            <Link
              href="/conditions"
              className="px-5 py-2.5 rounded-xl border-2 border-black/20 text-black font-medium hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition"
            >
              Conditions We Treat
            </Link>
            <Link
              href="/botox-calculator"
              className="px-5 py-2.5 rounded-xl border-2 border-black/20 text-black font-medium hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition"
            >
              Botox Calculator
            </Link>
            <Link
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#FF2D8E] text-white font-medium hover:bg-[#FF2D8E]/90 transition"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
    </LeadGate>
  );
}
