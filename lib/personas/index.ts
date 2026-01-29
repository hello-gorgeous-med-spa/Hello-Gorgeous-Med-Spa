import type { PersonaConfig, PersonaId } from "./types";

import { peppi } from "./peppi";
import { beautox } from "./beautox";
import { fillagrace } from "./fillagrace";
import { founder } from "./founder";
import { ryan } from "./ryan";

export type { PersonaConfig, PersonaId } from "./types";

export const PERSONA_CONFIGS: readonly PersonaConfig[] = [
  peppi,
  beautox,
  fillagrace,
  founder,
  ryan,
] as const;

export const DEFAULT_PERSONA_ID: PersonaId = "peppi";

export function getPersonaConfig(id: PersonaId): PersonaConfig {
  return PERSONA_CONFIGS.find((p) => p.id === id) ?? peppi;
}

export function listPersonaIds(): PersonaId[] {
  return PERSONA_CONFIGS.map((p) => p.id as PersonaId);
}

