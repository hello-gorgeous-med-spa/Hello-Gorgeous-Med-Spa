import type { PersonaId } from "./types";
import { getPersonaConfig } from "./index";

function includesAny(text: string, tokens: string[]) {
  const t = text.toLowerCase();
  return tokens.some((x) => t.includes(x.toLowerCase()));
}

export function routePersonaId({
  requestedPersonaId,
  userText,
}: {
  requestedPersonaId: PersonaId;
  userText: string;
}): { personaId: PersonaId; reason?: string } {
  const text = userText.toLowerCase();

  // Restricted topics → Ryan (safety anchor)
  const reqCfg = getPersonaConfig(requestedPersonaId);
  if (requestedPersonaId !== "ryan") {
    const restricted = reqCfg.restrictedTopics.map((t) => t.toLowerCase());
    if (includesAny(text, restricted)) {
      return { personaId: "ryan", reason: "restricted_topic_safety" };
    }
  }

  // Peppi: route procedure specifics
  if (requestedPersonaId === "peppi") {
    if (/(botox|dysport|jeuveau|tox)/i.test(text)) return { personaId: "beau-tox", reason: "procedure_specifics_injectables" };
    if (/(filler|lip|cheek|jaw|chin)/i.test(text)) return { personaId: "filla-grace", reason: "procedure_specifics_fillers" };
  }

  // Founder: route treatment questions to appropriate expert
  if (requestedPersonaId === "founder") {
    if (/(botox|dysport|jeuveau|tox)/i.test(text)) return { personaId: "beau-tox", reason: "treatment_question_injectables" };
    if (/(filler|lip|cheek|jaw|chin)/i.test(text)) return { personaId: "filla-grace", reason: "treatment_question_fillers" };
    if (/(contraind|pregnan|breastfeed|medicat|prescript|antibiot|glp|tirzep|semag)/i.test(text)) {
      return { personaId: "ryan", reason: "safety_question" };
    }
  }

  // Beau‑Tox: route anxiety to Peppi; safety to Ryan via restricted topics already
  if (requestedPersonaId === "beau-tox") {
    if (/(scared|anxious|nervous|panic|afraid)/i.test(text)) return { personaId: "peppi", reason: "emotional_reassurance" };
  }

  return { personaId: requestedPersonaId };
}

