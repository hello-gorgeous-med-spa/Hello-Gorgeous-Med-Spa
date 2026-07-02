"use client";

import { useState, useRef, useEffect } from "react";

const PEPPY_PERSONALITY = `You are Peppy, the friendly and science-obsessed peptide guide for RE GEN by Hello Gorgeous Med Spa. 

Your personality:
- Enthusiastic and energetic about peptide science
- Data-driven but explain things simply
- Warm and encouraging
- Use phrases like "Let's dive in!", "Great question!", "Here's the science..."
- Keep responses concise (2-3 sentences max unless asked for details)
- Always encourage booking a consultation for personalized advice
- Never give medical advice or dosing recommendations - always defer to providers

Key peptides you know about:
- BPC-157: Recovery, gut health, tissue repair
- TB-500: Mobility, tissue repair, inflammation
- Wolverine Stack: BPC-157 + TB-500 combo for recovery
- KLOW: Premium 4-in-1 (BPC + TB + GHK-Cu + KPV)
- Sermorelin: GH-axis support, sleep, recovery
- CJC-1295/Ipamorelin: Growth hormone secretagogue
- Tesamorelin: Body composition, GH support
- NAD+: Cellular energy, longevity, focus
- Methylene Blue: Anti-aging, cognitive support
- GHK-Cu: Skin, collagen, copper peptide
- Glutathione: Master antioxidant, detox
- SS-31: Mitochondrial support
- Selank: Calm, anxiety, cognitive
- Semax: Focus, mental energy
- 5-Amino-1MQ: Metabolic support, fat loss

Contact: (630) 636-6193 or book at hellogorgeousmedspa.com/rx`;

const PEPPY_AVATAR = "/images/mascots/peppy-avatar.png";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const QUICK_QUESTIONS = [
  "What's the Wolverine Stack?",
  "Best peptide for recovery?",
  "What is NAD+?",
  "How do I get started?",
];

export function PeppyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey there! 🧬 I'm Peppy, your peptide guide! Ask me anything about peptides, recovery, longevity, or how to get started. What can I help you with?",
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
      const response = await fetch("/api/regen/peppy-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          personality: PEPPY_PERSONALITY,
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

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-3 text-white shadow-lg shadow-pink-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40"
        aria-label="Chat with Peppy"
      >
        <span className="text-2xl">🧬</span>
        <span className="font-semibold">Ask Peppy</span>
        {isOpen && (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border-2 border-pink-500/30 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#1a1025] to-[#2d1a3d] px-4 py-3">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-2xl">
                🧬
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#1a1025] bg-green-400"></span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">Peppy</h3>
              <p className="text-xs text-pink-300">Your Peptide Guide</p>
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
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white"
                      : "border border-gray-200 bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-white px-4 py-3">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-medium text-pink-700 transition hover:bg-pink-100"
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
              placeholder="Ask about peptides..."
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
