"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  CONFIDENCE_CHECK_QUESTIONS,
  buildConfidenceSummary,
  type ConfidenceCheckAnswer,
} from "@/lib/care-modules";
import { complianceFooter } from "@/lib/guardrails";

const JOURNEY_LINKS = [
  { href: "/fix-what-bothers-me", label: "Fix What Bothers Me", icon: "💗" },
  { href: "/virtual-consultation", label: "Virtual Consultation", icon: "🖥️", badge: "FREE" },
  { href: "/conditions", label: "Conditions We Treat", icon: "✨" },
  { href: "/explore-care", label: "Explore Care Options", icon: "🔍" },
  { href: "/understand-your-body", label: "Understand Your Body", icon: "📚" },
  { href: "/telehealth", label: "Telehealth", icon: "🖥️" },
  { href: "/lip-studio", label: "Lip Enhancement Studio", icon: "✨" },
  { href: "/botox-calculator", label: "Botox Calculator", icon: "💉" },
];

function useSessionState<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => {
    if (typeof window === "undefined") return initial;
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  React.useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export function HumanJourney() {
  const [answers, setAnswers] = useSessionState<ConfidenceCheckAnswer>("hg.journey.answers", {
    bother: "",
    changeStyle: "unsure",
    firstTime: "unsure",
    timeframe: "just-researching",
    downtimeComfort: "unsure",
    decisionStyle: "i-need-guidance",
  });
  const [summary, setSummary] = useSessionState<string | null>("hg.journey.summary", null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <p className="text-[#E6007E] text-lg md:text-xl font-semibold mb-4 tracking-wide uppercase">
                Your Journey
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Feel clear before you{" "}
                <span className="text-[#E6007E]">commit</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
                A short, human-first flow to help you feel confident. No medical advice. No pressure. Just clarity.
              </p>
            </FadeUp>
            <FadeUp delayMs={100}>
              <div className="relative">
                <Image
                  src="/images/services/hg-consultation-setup.png"
                  alt="Hello Gorgeous consultation experience"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </div>

      {/* Journey Links Grid */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                Explore Your <span className="text-[#E6007E]">Journey</span>
              </h2>
              <p className="mt-4 text-black/70 max-w-2xl mx-auto">
                Choose how you want to start. Every path leads to clarity.
              </p>
            </div>
          </FadeUp>
          
          <FadeUp delayMs={50}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {JOURNEY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-black/10 bg-white hover:border-[#E6007E] hover:shadow-lg transition-all duration-300 group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{link.icon}</span>
                  <span className="text-sm font-semibold text-black text-center group-hover:text-[#E6007E]">{link.label}</span>
                  {link.badge && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold bg-[#E6007E] text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Confidence Check Section */}
      <div className="bg-gradient-to-b from-white to-pink-50/50 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Form */}
            <div className="lg:col-span-7">
              <FadeUp>
                <div className="rounded-2xl border-2 border-black bg-white p-6 md:p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">✨</span>
                    <div>
                      <h3 className="text-xl font-bold text-black">Confidence Check™</h3>
                      <p className="text-sm text-black/60">5-7 quick questions</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Question 1 - Free text */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        {CONFIDENCE_CHECK_QUESTIONS[0].label}
                      </label>
                      <p className="text-xs text-black/60 mb-2">{CONFIDENCE_CHECK_QUESTIONS[0].helper}</p>
                      <textarea
                        value={answers.bother}
                        onChange={(e) => setAnswers((p) => ({ ...p, bother: e.target.value }))}
                        className="w-full min-h-[100px] rounded-xl bg-white border-2 border-black/20 px-4 py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#E6007E] transition-colors resize-none"
                        placeholder="Example: my forehead lines, feeling less like myself, dull skin…"
                      />
                    </div>

                    {/* Questions 2 & 3 */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          {CONFIDENCE_CHECK_QUESTIONS[1].label}
                        </label>
                        <select
                          value={answers.changeStyle}
                          onChange={(e) =>
                            setAnswers((p) => ({
                              ...p,
                              changeStyle: e.target.value as ConfidenceCheckAnswer["changeStyle"],
                            }))
                          }
                          className="w-full rounded-xl bg-white border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#E6007E] transition-colors"
                        >
                          <option value="subtle">Subtle</option>
                          <option value="noticeable">Noticeable</option>
                          <option value="unsure">Unsure</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          {CONFIDENCE_CHECK_QUESTIONS[2].label}
                        </label>
                        <select
                          value={answers.firstTime}
                          onChange={(e) =>
                            setAnswers((p) => ({ ...p, firstTime: e.target.value as ConfidenceCheckAnswer["firstTime"] }))
                          }
                          className="w-full rounded-xl bg-white border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#E6007E] transition-colors"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                          <option value="unsure">Unsure</option>
                        </select>
                      </div>
                    </div>

                    {/* Questions 4 & 5 */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          {CONFIDENCE_CHECK_QUESTIONS[3].label}
                        </label>
                        <select
                          value={answers.timeframe}
                          onChange={(e) =>
                            setAnswers((p) => ({ ...p, timeframe: e.target.value as ConfidenceCheckAnswer["timeframe"] }))
                          }
                          className="w-full rounded-xl bg-white border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#E6007E] transition-colors"
                        >
                          <option value="asap">ASAP</option>
                          <option value="2-4weeks">2–4 weeks</option>
                          <option value="1-3months">1–3 months</option>
                          <option value="just-researching">Just researching</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          {CONFIDENCE_CHECK_QUESTIONS[4].label}
                        </label>
                        <select
                          value={answers.downtimeComfort}
                          onChange={(e) =>
                            setAnswers((p) => ({
                              ...p,
                              downtimeComfort: e.target.value as ConfidenceCheckAnswer["downtimeComfort"],
                            }))
                          }
                          className="w-full rounded-xl bg-white border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#E6007E] transition-colors"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="unsure">Unsure</option>
                        </select>
                      </div>
                    </div>

                    {/* Question 6 */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        {CONFIDENCE_CHECK_QUESTIONS[5].label}
                      </label>
                      <select
                        value={answers.decisionStyle}
                        onChange={(e) =>
                          setAnswers((p) => ({
                            ...p,
                            decisionStyle: e.target.value as ConfidenceCheckAnswer["decisionStyle"],
                          }))
                        }
                        className="w-full rounded-xl bg-white border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#E6007E] transition-colors"
                      >
                        <option value="i-need-guidance">I need guidance</option>
                        <option value="i-just-want-options">I want options</option>
                        <option value="i-know-what-i-want">I know what I want</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="px-8 py-4 rounded-xl bg-[#E6007E] hover:bg-pink-600 text-white font-semibold transition-all"
                      onClick={() => setSummary(buildConfidenceSummary(answers))}
                    >
                      Generate Summary
                    </button>
                    <CTA href={BOOKING_URL} variant="outline">
                      Book Consultation
                    </CTA>
                    <button
                      type="button"
                      className="px-6 py-4 rounded-xl border-2 border-black/20 text-black/70 hover:border-black hover:text-black font-semibold transition-all"
                      onClick={() => {
                        setSummary(null);
                        setAnswers({
                          bother: "",
                          changeStyle: "unsure",
                          firstTime: "unsure",
                          timeframe: "just-researching",
                          downtimeComfort: "unsure",
                          decisionStyle: "i-need-guidance",
                        });
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-5">
              <FadeUp delayMs={100}>
                <div className="rounded-2xl border-2 border-black bg-white overflow-hidden shadow-lg sticky top-24">
                  <div className="p-5 bg-black text-white">
                    <h3 className="text-lg font-bold">Your Summary</h3>
                    <p className="mt-1 text-xs text-white/70">{complianceFooter()}</p>
                  </div>
                  
                  <div className="p-6 min-h-[200px]">
                    {summary ? (
                      <p className="text-black/80 whitespace-pre-wrap leading-relaxed">{summary}</p>
                    ) : (
                      <p className="text-black/50 italic">
                        Answer the questions and tap &quot;Generate Summary&quot; to see a calm, plain-language recap.
                      </p>
                    )}
                  </div>
                  
                  <div className="p-5 border-t border-black/10 bg-pink-50/50">
                    <div className="flex flex-col gap-3">
                      <CTA href={BOOKING_URL} variant="gradient" className="w-full">
                        Book Online
                      </CTA>
                      <CTA href="/care-engine" variant="outline" className="w-full">
                        Explore Care Engine™
                      </CTA>
                      <CTA href="/contact" variant="outline" className="w-full">
                        Talk to Us First
                      </CTA>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA with VIP Card */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div className="text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Start Your{" "}
                  <span className="text-[#E6007E]">Transformation?</span>
                </h2>
                <p className="text-lg text-white/80 mb-8">
                  Book your consultation today and experience the Hello Gorgeous difference. 
                  No pressure, just personalized care designed around you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={BOOKING_URL}
                    className="inline-flex items-center justify-center bg-[#E6007E] text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all"
                  >
                    Book Consultation
                  </Link>
                  <a
                    href="tel:630-636-6193"
                    className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all"
                  >
                    Call (630) 636-6193
                  </a>
                </div>
              </div>
            </FadeUp>
            <FadeUp delayMs={100}>
              <Image
                src="/images/services/hg-vip-membership-card.png"
                alt="Hello Gorgeous VIP Membership"
                width={500}
                height={350}
                className="rounded-2xl shadow-2xl"
              />
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
