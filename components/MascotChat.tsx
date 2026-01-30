"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { PersonaId } from "@/lib/personas/types";
import { PERSONA_UI } from "@/lib/personas/ui";
import { getPersonaConfig } from "@/lib/personas/index";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  personaId?: PersonaId;
};

const mascots: { id: PersonaId; name: string; avatar: string; color: string; specialty: string }[] = [
  { id: "peppi", name: "Peppi", avatar: "/images/characters/peppi.png", color: "from-green-500 to-emerald-500", specialty: "Fullscript & Olympia" },
  { id: "beau-tox", name: "Beau-Tox", avatar: "/images/characters/beau.png", color: "from-purple-500 to-pink-500", specialty: "Botox • Jeuveau • Dysport" },
  { id: "filla-grace", name: "Filla Grace", avatar: "/images/characters/filla-grace.png", color: "from-pink-400 to-rose-400", specialty: "Revanesse Fillers" },
  { id: "harmony", name: "Harmony", avatar: "/images/characters/harmony.png", color: "from-amber-500 to-orange-500", specialty: "Biote Hormones" },
  { id: "founder", name: "Danielle", avatar: "/images/characters/founder.png", color: "from-pink-600 to-pink-500", specialty: "Hello Gorgeous" },
  { id: "ryan", name: "Dr. Ryan", avatar: "/images/characters/ryan.png", color: "from-blue-500 to-cyan-500", specialty: "Medical & Telehealth" },
];

export function MascotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMascot, setSelectedMascot] = useState<PersonaId | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && selectedMascot && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, selectedMascot]);

  const handleSelectMascot = (id: PersonaId) => {
    setSelectedMascot(id);
    setMessages([]);
    const ui = PERSONA_UI[id];
    const cfg = getPersonaConfig(id);
    // Add welcome message
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Hi! I'm ${cfg.displayName}. ${ui.tagline} How can I help you today?`,
        personaId: id,
      },
    ]);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !selectedMascot || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: selectedMascot,
          module: "education",
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-reply",
          role: "assistant",
          content: data.reply || "I apologize, I had trouble understanding. Could you rephrase that?",
          personaId: data.personaIdUsed || selectedMascot,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again or call us at 630-636-6193.",
          personaId: selectedMascot,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentMascot = mascots.find((m) => m.id === selectedMascot);
  const currentUI = selectedMascot ? PERSONA_UI[selectedMascot] : null;

  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 md:bottom-6 right-4 z-40 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
          isOpen
            ? "bg-gray-800 rotate-0"
            : "bg-gradient-to-br from-pink-500 to-pink-600 hover:scale-110"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <span className="text-white text-2xl">✕</span>
        ) : (
          <div className="relative">
            <span className="text-3xl">💬</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-44 md:bottom-24 right-4 z-40 w-[calc(100vw-2rem)] max-w-md bg-black border border-pink-500/30 rounded-2xl shadow-2xl shadow-pink-500/20 overflow-hidden flex flex-col max-h-[70vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-pink-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentMascot ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
                    <Image
                      src={currentMascot.avatar}
                      alt={currentMascot.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white font-bold">{currentMascot.name}</p>
                    <p className="text-white/70 text-xs">Online • Education only</p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-white font-bold">Hello Gorgeous AI</p>
                  <p className="text-white/70 text-xs">Choose who to chat with</p>
                </div>
              )}
            </div>
            {selectedMascot && (
              <button
                type="button"
                onClick={() => {
                  setSelectedMascot(null);
                  setMessages([]);
                }}
                className="text-white/70 hover:text-white text-sm"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Content */}
          {!selectedMascot ? (
            // Mascot Selection
            <div className="p-4 overflow-y-auto">
              <p className="text-white/70 text-sm mb-4 text-center">
                Choose a team member to chat with:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {mascots.map((mascot) => {
                  const ui = PERSONA_UI[mascot.id];
                  return (
                    <button
                      key={mascot.id}
                      type="button"
                      onClick={() => handleSelectMascot(mascot.id)}
                      className="p-3 rounded-xl border border-white/10 bg-white/5 hover:border-pink-500/50 hover:bg-pink-500/10 transition text-left group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{ui.emoji}</span>
                        <span className="text-white font-semibold text-sm">{mascot.name}</span>
                      </div>
                      <p className={`text-xs font-medium mb-1 bg-gradient-to-r ${mascot.color} bg-clip-text text-transparent`}>
                        {mascot.specialty}
                      </p>
                      <p className="text-white/40 text-[10px] line-clamp-2">{ui.tagline}</p>
                    </button>
                  );
                })}
              </div>
              <p className="text-white/40 text-xs text-center mt-4">
                Educational AI • Not medical advice
              </p>
            </div>
          ) : (
            // Chat Interface
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-pink-500 text-white rounded-br-md"
                          : "bg-white/10 text-white/90 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Starters */}
              {messages.length === 1 && currentUI && (
                <div className="px-4 pb-2">
                  <p className="text-white/50 text-xs mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {currentUI.chatStarters.map((starter) => (
                      <button
                        key={starter}
                        type="button"
                        onClick={() => handleSendMessage(starter)}
                        className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs hover:bg-pink-500/20 hover:border-pink-500/30 transition"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(input);
                  }}
                  className="flex gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50 text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-4 py-3 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
                <p className="text-white/30 text-xs text-center mt-2">
                  Education only • Not medical advice • Book a consult for personalized care
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
