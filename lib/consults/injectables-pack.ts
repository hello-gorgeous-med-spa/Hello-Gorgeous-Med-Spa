import type { ConsultEducationPack } from "@/lib/consults/types";

export const INJECTABLES_CONSULT_PACK: ConsultEducationPack = {
  vertical: "injectables",
  title: "Botox / fillers consult",
  concernDefaults: ["Fine lines / wrinkles", "Lips", "Cheeks / volume", "Jawline"],
  slides: [
    {
      id: "why-hg-inj",
      eyebrow: "Credibility",
      title: "Why Hello Gorgeous for injectables",
      body:
        "NP-directed injectables with mapped units at visit — published per-unit rates, loyalty programs (Alle / ASPIRE where applicable), and natural results over overfilled trends.",
      bullets: [
        "Medical assessment before product and units",
        "Brand options (Botox, Dysport, Jeuveau, fillers) matched to goals",
        "Before/after expectations set in plain language",
      ],
      talkingPoints: [
        "Ask what bothers them in the mirror — map areas before quoting units.",
      ],
    },
    {
      id: "neurotoxin-basics",
      eyebrow: "Neurotoxin",
      title: "How neuromodulators work",
      body:
        "Neurotoxins soften dynamic lines by temporarily reducing muscle movement in treated areas. Onset is typically days; results build over 1–2 weeks. Duration is often ~3–4 months depending on dose, metabolism, and area.",
      bullets: [
        "Units ≠ syringes — we quote by unit and area map",
        "First-time maps are conservative; touch-ups are planned, not rushed",
        "Avoid rubbing / heavy workouts per aftercare",
      ],
    },
    {
      id: "filler-basics",
      eyebrow: "Filler",
      title: "Filler expectations",
      body:
        "Hyaluronic acid fillers restore or enhance volume. Product choice and placement matter more than “more syringes.” Swelling is common early; final shape settles over days to weeks.",
      bullets: [
        "Consent and vascular safety always come first",
        "Quote ranges; finalize after exam",
        "Dissolve / revise policies — set expectations honestly",
      ],
    },
    {
      id: "next-inj",
      eyebrow: "Close",
      title: "Next step: proposal",
      body:
        "Pick a starter path (toxin units, lip filler, or combined) and create a proposal the client can accept and pay.",
      talkingPoints: ["If unsure on units, propose a consult + starter unit block."],
    },
  ],
  paths: [
    {
      id: "botox-starter",
      label: "Botox starter (20 units)",
      summary: "Entry neurotoxin map — adjust units in the proposal builder.",
      serviceIds: ["botox"],
    },
    {
      id: "dysport-starter",
      label: "Dysport starter",
      summary: "Alternative neuromodulator — map units at visit.",
      serviceIds: ["dysport"],
    },
    {
      id: "lip-filler",
      label: "Lip filler (1 syringe)",
      summary: "Single-syringe lip enhancement starting point.",
      serviceIds: ["lip-filler"],
    },
  ],
};
