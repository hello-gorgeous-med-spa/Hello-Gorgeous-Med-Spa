"use client";

// ============================================================
// HELLO GORGEOUS MASCOT CHAT WIDGET
// Chat + voice (mic → her knowledge) + Book now (live) + Call us.
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { SITE } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";
import { MASCOT_WELCOME, MASCOT_INTRO_VIDEO_PATH, MASCOT_INTRO_VIDEO_FALLBACK, MASCOT_SCRIPT } from "@/lib/mascot";
import { MascotBookingFlow } from "@/components/MascotBookingFlow";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
}
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

const MASCOT_SRC = "/images/characters/hello-gorgeous-mascot.png";

type Message = { id: string; role: "user" | "assistant"; content: string };

const QUICK_QUESTIONS = [
  "What services do you offer?",
  "How do I book?",
  "What are your hours?",
];

function getBookingHref(): string {
  if (typeof window !== "undefined") {
    return BOOKING_URL.startsWith("http") ? BOOKING_URL : `${window.location.origin}${BOOKING_URL.startsWith("/") ? "" : "/"}${BOOKING_URL}`;
  }
  return BOOKING_URL.startsWith("http") ? BOOKING_URL : `${SITE.url}${BOOKING_URL.startsWith("/") ? "" : "/"}${BOOKING_URL}`;
}

export function HelloGorgeousAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: MASCOT_WELCOME,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState<{ message: string } | null>(null);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackContact, setFeedbackContact] = useState("");
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [introVideoError, setIntroVideoError] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceTranscriptRef = useRef("");

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    synthRef.current = window.speechSynthesis;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.volume = 1;
    const voices = synthRef.current.getVoices();
    const voice = voices.find((v) => v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Female") || v.name.includes("Google US English"));
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  }, []);

  const handleSend = useCallback(async (text: string = input, options?: { speakReply?: boolean }) => {
    const trimmed = typeof text === "string" ? text.trim() : "";
    if (!trimmed) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    const speakReply = options?.speakReply ?? false;

    try {
      const res = await fetch("/api/chat/widget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      const reply = typeof data?.reply === "string" ? data.reply : "I’m here to help. You can book online or call us anytime.";
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: reply },
      ]);
      if (speakReply) speak(reply);
      if (data?.needsFeedback) setPendingFeedback({ message: trimmed });
    } catch {
      const errMsg = "Something went wrong. You can book at the link below or call us — we're here to help!";
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: errMsg },
      ]);
      if (speakReply) speak(errMsg);
    } finally {
      setIsTyping(false);
    }
  }, [input, speak]);

  const startListening = useCallback(() => {
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) return;
    voiceTranscriptRef.current = "";
    const recognition = new SR() as SpeechRecognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      voiceTranscriptRef.current = t;
    };
    recognition.onend = () => {
      setIsListening(false);
      const text = voiceTranscriptRef.current.trim();
      if (text) handleSend(text, { speakReply: true });
    };
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [handleSend]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const handleQuickQuestion = (question: string) => handleSend(question);

  const sendFeedbackToOwner = useCallback(async () => {
    if (!pendingFeedback?.message) return;
    try {
      const res = await fetch("/api/mascot/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: pendingFeedback.message,
          contactName: feedbackName.trim() || undefined,
          contactEmail: feedbackContact.trim().includes("@") ? feedbackContact.trim() : undefined,
          contactPhone: feedbackContact.trim().includes("@") ? undefined : feedbackContact.trim(),
        }),
      });
      const data = await res.json();
      const msg = data?.message || "Done! Danielle will get this.";
      setMessages((prev) => [...prev, { id: String(Date.now()), role: "assistant", content: msg }]);
      setPendingFeedback(null);
      setFeedbackName("");
      setFeedbackContact("");
    } catch {
      setMessages((prev) => [...prev, { id: String(Date.now()), role: "assistant", content: "Something went wrong sending that. Please call us and we'll help you right away." }]);
    }
  }, [pendingFeedback, feedbackName, feedbackContact]);

  const bookingHref = getBookingHref();
  const phone = SITE.phone;
  const telHref = `tel:${phone.replace(/\D/g, "")}`;

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center overflow-hidden bg-white border-2 border-pink-200 hover:scale-105 transition-transform z-50 ${isOpen ? "hidden" : ""}`}
        aria-label="Chat with Hello Gorgeous"
      >
        <Image
          src={MASCOT_SRC}
          alt="Hello Gorgeous"
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-pink-100">
          {/* Header with mascot */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/20 shrink-0">
                <Image
                  src={MASCOT_SRC}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="text-white font-semibold">Hello Gorgeous</p>
                <p className="text-pink-100 text-xs">Ask me anything • Book or call below</p>
                <button type="button" onClick={() => { const next = !showIntroVideo; setShowIntroVideo(next); if (!next) setIntroVideoError(false); }} className="text-pink-100 hover:text-white text-xs underline ml-1">Watch intro</button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/90 hover:text-white text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Book now (live) / Call us */}
          <div className="flex gap-2 p-3 border-b border-black shrink-0">
            <button
              type="button"
              onClick={() => setShowBookingFlow(true)}
              className="flex-1 py-2.5 rounded-xl bg-[#FF2D8E] text-white text-center text-sm font-medium hover:bg-black transition-colors"
            >
              Book now
            </button>
            <a
              href={telHref}
              className="flex-1 py-2.5 rounded-xl bg-black text-white text-center text-sm font-medium hover:bg-black transition-colors"
            >
              Call us
            </a>
          </div>
          <p className="px-3 pb-2 text-center">
            <a
              href={bookingHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-pink-600 hover:underline"
            >
              Or book on our full page →
            </a>
          </p>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {showIntroVideo && (
              <div className="rounded-xl overflow-hidden bg-pink-50 border border-pink-100 mb-3">
                <video
                  key={introVideoError ? "fallback" : "primary"}
                  src={introVideoError ? MASCOT_INTRO_VIDEO_FALLBACK : MASCOT_INTRO_VIDEO_PATH}
                  controls
                  className="w-full"
                  playsInline
                  onError={() => setIntroVideoError(true)}
                />
                <div className="p-3 text-sm text-black space-y-2">
                  <p className="font-medium text-pink-800">Meet your assistant — Danielle’s mini me</p>
                  <p>{MASCOT_SCRIPT.whoSheIs}</p>
                  <p>{MASCOT_SCRIPT.whatSheCanDo}</p>
                  <p className="text-xs text-black">{MASCOT_SCRIPT.howToUseHer}</p>
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-[#FF2D8E] text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            {pendingFeedback && (
              <div className="rounded-xl border-2 border-pink-200 bg-pink-50 p-3 space-y-2">
                <p className="text-xs font-medium text-pink-800">Send to Danielle</p>
                <p className="text-sm text-black line-clamp-2">&ldquo;{pendingFeedback.message}&rdquo;</p>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  className="w-full rounded-lg border border-black px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Email or phone for callback (optional)"
                  value={feedbackContact}
                  onChange={(e) => setFeedbackContact(e.target.value)}
                  className="w-full rounded-lg border border-black px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={sendFeedbackToOwner} className="flex-1 py-2 rounded-lg bg-[#FF2D8E] text-white text-sm font-medium hover:bg-black">Send to owner</button>
                  <button type="button" onClick={() => { setPendingFeedback(null); setFeedbackName(""); setFeedbackContact(""); }} className="py-2 px-3 rounded-lg bg-white text-black text-sm hover:bg-white">Cancel</button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 shrink-0">
              <p className="text-xs text-black mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3 py-1.5 bg-white hover:bg-white rounded-full text-xs text-black"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input + voice */}
          <div className="border-t border-black p-3 shrink-0">
            {(isListening || isSpeaking) && (
              <p className="text-xs text-pink-600 mb-1 text-center">
                {isListening ? "Listening…" : "Speaking…"}
                {isSpeaking && (
                  <button type="button" onClick={stopSpeaking} className="ml-2 underline">Stop</button>
                )}
              </p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2 items-center"
            >
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={isTyping || isSpeaking}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isListening ? "bg-red-500 text-white animate-pulse" : "bg-white text-black hover:bg-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={isListening ? "Stop listening" : "Talk to assistant"}
                title={isListening ? "Stop listening" : "Tap to speak"}
              >
                🎤
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-black rounded-full text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-[#FF2D8E] text-white rounded-full flex items-center justify-center hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                ↑
              </button>
            </form>
          </div>
        </div>
      )}

      {/* In-chat booking flow: live appointment on schedule */}
      {showBookingFlow && (
        <MascotBookingFlow
          onClose={() => setShowBookingFlow(false)}
          onSuccess={() => {
            setMessages((prev) => [
              ...prev,
              {
                id: `booked-${Date.now()}`,
                role: "assistant",
                content: "You're all set! Your appointment is on the schedule. We'll send confirmation and reminders to your email and phone.",
              },
            ]);
          }}
        />
      )}
    </>
  );
}
