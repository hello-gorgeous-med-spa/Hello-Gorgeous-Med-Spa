// Backward-compatible facade.
// Ticket #006 moves locked persona behavior to `lib/personas/*`.
import type { PersonaId } from "./personas/types";
import { DEFAULT_PERSONA_ID, PERSONA_CONFIGS } from "./personas";
import { PERSONA_UI } from "./personas/ui";

export type { PersonaConfig, PersonaId } from "./personas/types";
export { DEFAULT_PERSONA_ID, PERSONA_CONFIGS, getPersonaConfig, listPersonaIds } from "./personas";
export { PERSONA_UI } from "./personas/ui";

export type Persona = {
  id: PersonaId;
  name: string;
  title: string;
  tagline: string;
  emoji: string;
  tone: string;
  scope: {
    specialties: string[];
    canDo: string[];
    cannotDo: string[];
    safeClose: string;
  };
  video?: {
    mp4?: string;
    webm?: string;
    poster?: string;
  };
  chatStarters: string[];
};

export const PERSONAS: readonly Persona[] = PERSONA_CONFIGS.map((c) => {
  const ui = PERSONA_UI[c.id as PersonaId];
  return {
    id: c.id as PersonaId,
    name: c.displayName,
    title: c.role,
    tagline: ui.tagline,
    emoji: ui.emoji,
    tone: c.tone,
    scope: {
      specialties: c.allowedTopics,
      canDo: c.responseStyleRules,
      cannotDo: c.restrictedTopics,
      safeClose: c.disclaimer,
    },
    video: ui.video,
    chatStarters: ui.chatStarters,
  };
}) as const;

