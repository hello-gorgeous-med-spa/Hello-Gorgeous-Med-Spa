"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export type MascotId = "peppy" | "slim-t" | "harmony";

export type MascotConfig = {
  id: MascotId;
  name: string;
  role: string;
  avatar: string;
  emoji: string;
  greeting: string;
  quickQuestions: string[];
  placeholder: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  headerBgFrom: string;
  headerBgTo: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type MascotChatWidgetProps = {
  mascot: MascotConfig;
  className?: string;
};

export function MascotChatWidget({ mascot, className = "" }: MascotChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: mascot.greeting,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/regen/mascot-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mascotId: mascot.id,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Hmm, I had trouble with that. Try asking another way, or call us at (630) 636-6193!",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Oops! Something went wrong. Feel free to call us at (630) 636-6193 — our team is happy to help!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonStyle = {
    background: `linear-gradient(135deg, ${mascot.gradientFrom}, ${mascot.gradientTo})`,
  };

  const headerStyle = {
    background: `linear-gradient(135deg, ${mascot.headerBgFrom}, ${mascot.headerBgTo})`,
  };

  return (
    <div className={className}>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full px-5 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        aria-label={`Chat with ${mascot.name}`}
      >
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white/20">
          <Image
            src={mascot.avatar}
            alt={mascot.name}
            fill
            className="object-cover object-top"
          />
        </div>
        <span className="font-semibold">Ask {mascot.name}</span>
        {isOpen && (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[400px] flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-2xl" style={{ borderColor: `${mascot.accentColor}40` }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={headerStyle}>
            <div className="relative">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white/30 bg-white/10">
                <Image
                  src={mascot.avatar}
                  alt={mascot.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-current bg-green-400" style={{ borderColor: mascot.headerBgFrom }}></span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">{mascot.name}</h3>
              <p className="text-xs text-white/70">{mascot.role}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="mr-2 mt-1 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={mascot.avatar}
                      alt={mascot.name}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "text-white"
                      : "border border-gray-200 bg-white text-gray-800 shadow-sm"
                  }`}
                  style={message.role === "user" ? buttonStyle : undefined}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="mr-2 mt-1 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={mascot.avatar}
                    alt={mascot.name}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full" style={{ backgroundColor: mascot.accentColor, animationDelay: "0ms" }}></span>
                    <span className="h-2 w-2 animate-bounce rounded-full" style={{ backgroundColor: mascot.accentColor, animationDelay: "150ms" }}></span>
                    <span className="h-2 w-2 animate-bounce rounded-full" style={{ backgroundColor: mascot.accentColor, animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-white px-4 py-3">
              {mascot.quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition hover:bg-opacity-100"
                  style={{
                    borderColor: `${mascot.accentColor}40`,
                    backgroundColor: `${mascot.accentColor}10`,
                    color: mascot.accentColor,
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2 border-t border-gray-200 bg-white p-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mascot.placeholder}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ 
                "--tw-ring-color": `${mascot.accentColor}40`,
              } as React.CSSProperties}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={buttonStyle}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>

          {/* Disclaimer */}
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-center text-[10px] text-gray-400">
            Not medical advice. Book an NP consult for personalized care.
          </div>
        </div>
      )}
    </div>
  );
}

// Pre-configured mascots
export const MASCOT_CONFIGS: Record<MascotId, MascotConfig> = {
  peppy: {
    id: "peppy",
    name: "Peppy",
    role: "Your Peptide Guide",
    avatar: "/images/mascots/peppy-avatar.png",
    emoji: "🧬",
    greeting: "Hey there! I'm Peppy, your science-obsessed peptide guide! Ask me anything about peptides, recovery, longevity, or how to get started. What can I help you with?",
    quickQuestions: [
      "What's the Wolverine Stack?",
      "Best peptide for recovery?",
      "What is NAD+?",
      "How do I get started?",
    ],
    placeholder: "Ask about peptides...",
    gradientFrom: "#3b82f6",
    gradientTo: "#06b6d4",
    accentColor: "#3b82f6",
    headerBgFrom: "#1e3a5f",
    headerBgTo: "#0c4a6e",
  },
  "slim-t": {
    id: "slim-t",
    name: "Slim-T",
    role: "Your Weight Loss Coach",
    avatar: "/images/mascots/slim-t.png",
    emoji: "🔥",
    greeting: "Hey! I'm Slim-T, and I'm all about helping you crush your weight loss goals! Whether it's semaglutide, tirzepatide, or metabolic support — I've got the energy and the answers. What would you like to know?",
    quickQuestions: [
      "Semaglutide vs tirzepatide?",
      "How fast can I lose weight?",
      "What are GLP-1 side effects?",
      "How do I get started?",
    ],
    placeholder: "Ask about weight loss...",
    gradientFrom: "#ef4444",
    gradientTo: "#f97316",
    accentColor: "#ef4444",
    headerBgFrom: "#7f1d1d",
    headerBgTo: "#9a3412",
  },
  harmony: {
    id: "harmony",
    name: "Harmony",
    role: "Your Hormone Balance Guide",
    avatar: "/images/mascots/harmony.png",
    emoji: "💊",
    greeting: "Hi, I'm Harmony! Hormones are the conductors of your body's symphony — when they're balanced, everything works better. Whether you're curious about TRT, HRT, or just want to understand your options, I'm here to help. What's on your mind?",
    quickQuestions: [
      "What is TRT?",
      "Signs of low testosterone?",
      "HRT for women explained",
      "How do I get started?",
    ],
    placeholder: "Ask about hormones...",
    gradientFrom: "#ec4899",
    gradientTo: "#a855f7",
    accentColor: "#ec4899",
    headerBgFrom: "#701a52",
    headerBgTo: "#581c87",
  },
};
