export function looksLikeEmergency(text: string) {
  const t = text.toLowerCase();
  return (
    /(chest pain|shortness of breath|trouble breathing|faint|unconscious|stroke|severe headache|vision loss|face droop|slurred speech|anaphyl|swelling of tongue|throat swelling|can't breathe)/i.test(
      t,
    ) ||
    /(severe pain|uncontrolled bleeding|high fever|suicid)/i.test(t)
  );
}

export function postTreatmentRedFlags(text: string) {
  const t = text.toLowerCase();
  return /(severe pain|vision|blanch|dusky|skin turning|necrosis|trouble breathing|swelling tongue|hives|fever|pus|worsening redness spreading)/i.test(
    t,
  );
}

export function complianceFooter() {
  return "Educational only — no diagnosis or individualized medical advice. Book a consultation for personal guidance.";
}

export function ryanSafetyOverrideReply(userText: string) {
  return [
    "I’m Ryan Kent, FNP‑BC (Medical Director).",
    "",
    "Based on what you described, this could be urgent. I can’t diagnose online.",
    "If symptoms are severe, rapidly worsening, or involve breathing, vision changes, chest pain, or signs of an allergic reaction: seek urgent/emergency care now.",
    "",
    `What you wrote: "${userText}"`,
    "",
    complianceFooter(),
  ].join("\n");
}

