"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { PersonaId } from "@/lib/personas/types";
import { PERSONA_UI } from "@/lib/personas/ui";
import { getPersonaConfig } from "@/lib/personas/index";
import { useChatOpen } from "@/components/ChatOpenContext";
import { FULLSCRIPT_DISPENSARY_URL } from "@/lib/flows";
import { mascotImages, getMascotVideoSrc } from "@/lib/media";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  personaId?: PersonaId;
  recommendedCollection?: { id: string; title: string; fullscript_url: string };
};

function getMascotAvatar(id: PersonaId): string {
  const m = mascotImages[id];
  return m?.portrait || `/images/characters/${id === "beau-tox" ? "beau" : id}.png`;
}

const mascots: { id: PersonaId; name: string; color: string; specialty: string }[] = [
  { id: "peppi", name: "Peppi", color: "from-fuchsia-400 to-pink-400", specialty: "Fullscript & Olympia" },
  { id: "beau-tox", name: "Beau-Tox", color: "from-purple-500 to-pink-500", specialty: "Botox • Jeuveau • Dysport" },
  { id: "filla-grace", name: "Filla Grace", color: "from-pink-400 to-rose-400", specialty: "Revanesse Fillers" },
  { id: "harmony", name: "Harmony", color: "from-rose-500 to-pink-500", specialty: "Biote Hormones" },
  { id: "founder", name: "Danielle", color: "from-pink-600 to-pink-500", specialty: "Hello Gorgeous" },
  { id: "ryan", name: "Dr. Ryan", color: "bg-[#FF2D8E]", specialty: "Medical & Telehealth" },
];

function getSupplementsOpeningMessage(clickedSupplement?: string): string {
  if (clickedSupplement) {
    return `${clickedSupplement} is often used to support various wellness goals — like sleep, energy, gut health, or recovery.\n\nI can help you decide if it might be appropriate for you, and if so, direct you to high-quality options available through Fullscript.\n\nWhat are you hoping to improve?`;
  }
  return `I can help you figure out which supplements may support your goals — like sleep, energy, gut health, immunity, or stress.\n\nWhen appropriate, I'll guide you to Fullscript, where Hello Gorgeous provides access to professional-grade, practitioner-recommended supplements.\n\nWhat are you hoping to improve?`;
}

function getInitialMessages(personaId: PersonaId, initialContext: { source?: string; clicked_supplement?: string } | null): Message[] {
  const id = "welcome";
  const supplementsSource = initialContext?.source === "homepage_supplements" || initialContext?.source === "client_portal";
  if (personaId === "peppi" && supplementsSource) {
    return [
      {
        id,
        role: "assistant",
        content: getSupplementsOpeningMessage(initialContext.clicked_supplement),
        personaId: "peppi",
      },
    ];
  }
  const cfg = getPersonaConfig(personaId);
  const ui = PERSONA_UI[personaId];
  return [
    {
      id,
      role: "assistant",
      content: `Hi! I'm ${cfg.displayName}. ${ui.tagline} How can I help you today?`,
      personaId,
    },
  ];
}

export function MascotChat() {
  const { isOpen, selectedMascot, initialContext, toggleOpen, closeChat, openChat, backToPicker, clearInitialContext } = useChatOpen();
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

  // When context selects a mascot (or we open with context), set initial messages. Only when selectedMascot changes so we don't reset after clearing initialContext on first send.
  const initialContextRef = useRef(initialContext);
  initialContextRef.current = initialContext;
  useEffect(() => {
    if (selectedMascot) {
      setMessages(getInitialMessages(selectedMascot, initialContextRef.current));
    } else {
      setMessages([]);
    }
  }, [selectedMascot]);

  const handleSelectMascot = (id: PersonaId) => {
    openChat(id);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !selectedMascot || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    const contextToSend = initialContext ?? undefined;
    if (contextToSend) clearInitialContext();

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
          ...(contextToSend && { context: contextToSend }),
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
          ...(data.recommendedCollection && { recommendedCollection: data.recommendedCollection }),
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
  const [videoFailed, setVideoFailed] = useState(false);
  const mascotVideoSrc = selectedMascot ? getMascotVideoSrc(selectedMascot, "intro") : null;

  useEffect(() => {
    setVideoFailed(false);
  }, [selectedMascot]);

  return (
    <>
      {/* Floating Button - z-[60] above sticky CTAs */}
      <button
        type="button"
        onClick={() => toggleOpen()}
        className={`fixed bottom-24 md:bottom-6 right-4 z-[60] w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
          isOpen
            ? "bg-[#000000] rotate-0"
            : "bg-gradient-to-br from-pink-500 to-pink-600 hover:scale-110"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <span className="text-white text-2xl">✕</span>
        ) : (
          <div className="relative">
            <span className="text-3xl">💬</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF2D8E] rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat Window - z-[60], light theme for visibility */}
      {isOpen && (
        <div data-mascot-chat className="fixed bottom-36 md:bottom-24 right-4 z-[60] w-[calc(100vw-2rem)] max-w-md bg-white rounded-2xl shadow-2xl ring-2 ring-[#FF2D8E]/30 overflow-hidden flex flex-col max-h-[80vh]">
          {/* Header with mascot image/video */}
          <div className="bg-gradient-to-r from-pink-600 to-pink-500 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {currentMascot ? (
                <>
                  <div className="relative w-14 h-14 rounded-full bg-white/20 overflow-hidden shrink-0 ring-2 ring-white/30">
                    {mascotVideoSrc && !videoFailed ? (
                      <video
                        src={mascotVideoSrc}
                        poster={mascotImages[selectedMascot!]?.portrait}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        onError={() => setVideoFailed(true)}
                      />
                    ) : (
                      <Image
                        src={getMascotAvatar(currentMascot.id)}
                        alt={currentMascot.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-bold">{currentMascot.name}</p>
                    <p className="text-black text-xs">Online • Education only</p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-white font-bold">Hello Gorgeous AI</p>
                  <p className="text-black text-xs">Choose who to chat with</p>
                </div>
              )}
            </div>
            {selectedMascot && (
              <button
                type="button"
                onClick={() => backToPicker()}
                className="text-black hover:text-white text-sm font-medium"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Content */}
          {!selectedMascot ? (
            // Mascot Selection with avatars
            <div className="p-4 overflow-y-auto bg-[#000000]">
              <p className="text-black text-sm mb-4 text-center">
                Choose a team member to chat with:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {mascots.map((mascot) => {
                  const ui = PERSONA_UI[mascot.id];
                  const avatar = getMascotAvatar(mascot.id);
                  return (
                    <button
                      key={mascot.id}
                      type="button"
                      onClick={() => handleSelectMascot(mascot.id)}
                      className="p-3 rounded-xl border border-black bg-white hover:border-[#FF2D8E]/50 hover:bg-[#FF2D8E]/10 transition text-left group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white shrink-0 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={avatar}
                            alt={mascot.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.classList.remove("hidden");
                            }}
                          />
                          <span className="hidden text-xl">{ui.emoji}</span>
                        </div>
                        <span className="text-white font-semibold text-sm">{mascot.name}</span>
                      </div>
                      <p className={`text-xs font-medium mb-1 bg-gradient-to-r ${mascot.color} bg-clip-text text-transparent`}>
                        {mascot.specialty}
                      </p>
                      <p className="text-black text-[10px] line-clamp-2">{ui.tagline}</p>
                    </button>
                  );
                })}
              </div>
              <p className="text-black text-xs text-center mt-4">
                Educational AI • Not medical advice
              </p>
            </div>
          ) : (
            // Chat Interface - light bg for readability
            <>
              <div className="mascot-messages-area flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[420px]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-[#FF2D8E] text-white rounded-br-md"
                          : "mascot-message-bubble rounded-bl-md shadow-sm border border-[#000000]/10"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === "assistant" &&
                      (message.recommendedCollection ? (
                        <a
                          href={message.recommendedCollection.fullscript_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-[#FF2D8E] text-white text-sm font-semibold hover:bg-black transition w-fit"
                        >
                          🛒 View {message.recommendedCollection.title} on Fullscript
                        </a>
                      ) : (
                        message.content.toLowerCase().includes("fullscript") && (
                          <a
                            href={FULLSCRIPT_DISPENSARY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-[#FF2D8E] text-white text-sm font-semibold hover:bg-black transition w-fit"
                          >
                            🛒 View recommended supplements on Fullscript
                          </a>
                        )
                      ))}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-[#000000]/5">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#FF2D8E] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-[#FF2D8E] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-[#FF2D8E] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Starters */}
              {messages.length === 1 && currentUI && (
                <div className="mascot-messages-area px-4 pb-2">
                  <p className="text-[#000000] text-xs mb-2 font-medium">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {currentUI.chatStarters.map((starter) => (
                      <button
                        key={starter}
                        type="button"
                        onClick={() => handleSendMessage(starter)}
                        className="mascot-quick-btn px-3 py-2 rounded-full border text-xs hover:bg-[#FF2D8E]/10 hover:border-[#FF2D8E]/40 transition"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="mascot-input-area p-4 border-t border-[#000000]/15 shrink-0">
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
                    className="flex-1 px-4 py-3 rounded-xl border border-[#000000]/20 text-sm placeholder:text-[#000000]/50 focus:outline-none focus:ring-2 focus:ring-[#FF2D8E]/50 focus:border-[#FF2D8E] disabled:opacity-60"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-4 py-3 rounded-xl bg-[#FF2D8E] text-white font-semibold hover:bg-[#FF2D8E] transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    Send
                  </button>
                </form>
                <p className="text-[#000000]/60 text-xs text-center mt-2">
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
