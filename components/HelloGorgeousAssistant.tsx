"use client";

// ============================================================
// HELLO GORGEOUS MASCOT CHAT WIDGET
// Uses Business Memory for answers; Book now + Call us always visible.
// ============================================================

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { SITE } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I’m the Hello Gorgeous assistant. Ask me about services, hours, or booking — or use the buttons below to book or call us.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat/widget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();
      const reply = typeof data?.reply === "string" ? data.reply : "I’m here to help. You can book online or call us anytime.";
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: "Something went wrong. You can book at the link below or call us — we’re here to help!" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => handleSend(question);

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

          {/* Book now / Call us */}
          <div className="flex gap-2 p-3 border-b border-gray-100 shrink-0">
            <a
              href={bookingHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-pink-500 text-white text-center text-sm font-medium hover:bg-pink-600 transition-colors"
            >
              Book now
            </a>
            <a
              href={telHref}
              className="flex-1 py-2.5 rounded-xl bg-gray-800 text-white text-center text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              Call us
            </a>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 shrink-0">
              <p className="text-xs text-gray-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 p-3 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                ↑
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
