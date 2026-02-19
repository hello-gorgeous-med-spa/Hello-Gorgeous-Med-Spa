"use client";

import Image from "next/image";
import type { PersonaId } from "@/lib/personas/types";
import { PERSONA_UI } from "@/lib/personas/ui";
import { getPersonaConfig } from "@/lib/personas/index";
import { useChatOpen } from "@/components/ChatOpenContext";
import { mascotImages } from "@/lib/media";

const ASSISTANTS: { id: PersonaId; specialty: string }[] = [
  { id: "peppi", specialty: "Fullscript & Olympia" },
  { id: "beau-tox", specialty: "Botox • Jeuveau • Dysport" },
  { id: "filla-grace", specialty: "Revanesse Fillers" },
  { id: "harmony", specialty: "Biote Hormones" },
  { id: "founder", specialty: "Hello Gorgeous" },
  { id: "ryan", specialty: "Medical & Telehealth" },
];

function getMascotAvatar(id: PersonaId): string {
  const m = mascotImages[id];
  return m?.portrait || `/images/characters/${id === "beau-tox" ? "beau" : id}.png`;
}

export function AIAssistantsSection() {
  const { openChat } = useChatOpen();

  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Hello Gorgeous{" "}
            <span className="text-[#E6007E]">AI</span>
          </h2>
          <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Meet your on-demand guides. Each assistant is specialized in a different area—from peptides and weight loss to Botox, fillers, hormones, and our care philosophy. Choose who to chat with for answers that fit exactly what you are looking for.
          </p>
          <p className="mt-4 text-sm text-white/70 max-w-xl mx-auto">
            Education only. Not medical advice. Book a consultation for personalized care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ASSISTANTS.map(({ id, specialty }) => {
            const config = getPersonaConfig(id);
            const ui = PERSONA_UI[id];
            const avatar = getMascotAvatar(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => openChat(id)}
                className="group text-left bg-white rounded-2xl border-2 border-white/10 overflow-hidden hover:border-[#E6007E]/50 hover:shadow-xl hover:shadow-[#E6007E]/10 transition-all duration-300 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/5 flex-shrink-0 ring-2 ring-black/5 group-hover:ring-[#E6007E]/30 transition-all">
                    <Image
                      src={avatar}
                      alt={config.displayName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#E6007E] text-base">
                      {specialty}
                    </p>
                    <p className="text-black text-sm mt-1 line-clamp-2">
                      {ui.tagline}
                    </p>
                    <span className="inline-block mt-3 text-xs font-medium text-black/60 group-hover:text-[#E6007E] transition-colors">
                      Chat with {config.displayName}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-white/60 text-sm mt-10">
          Tap any card to open the chat. Your guide is ready to help.
        </p>
      </div>
    </section>
  );
}
