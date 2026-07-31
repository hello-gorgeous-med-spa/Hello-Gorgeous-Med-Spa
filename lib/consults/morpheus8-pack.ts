import {
  MORPHEUS8_INMODE_STORY,
  MORPHEUS8_WHAT_IT_DOES,
  MORPHEUS8_STEPS,
  MORPHEUS8_MARKETING,
} from "@/lib/morpheus8-marketing";
import type { ConsultEducationPack } from "@/lib/consults/types";

export const MORPHEUS8_CONSULT_PACK: ConsultEducationPack = {
  vertical: "morpheus8",
  title: "Morpheus8 / InMode consult",
  concernDefaults: ["Skin laxity", "Texture", "Jawline / neck", "Body contour"],
  slides: [
    {
      id: "why-inmode",
      eyebrow: MORPHEUS8_INMODE_STORY.eyebrow,
      title: `${MORPHEUS8_INMODE_STORY.title} ${MORPHEUS8_INMODE_STORY.titleAccent}`,
      body: MORPHEUS8_INMODE_STORY.body.join(" "),
      bullets: [...MORPHEUS8_INMODE_STORY.chips],
      talkingPoints: [
        "Lead with verification and process — then show package economics.",
        MORPHEUS8_INMODE_STORY.quote,
      ],
    },
    {
      id: "what-it-does",
      eyebrow: MORPHEUS8_MARKETING.eyebrow,
      title: "What Morpheus8 Burst + Deep does",
      body: MORPHEUS8_MARKETING.subhead,
      bullets: MORPHEUS8_WHAT_IT_DOES.map(
        (item) => `${item.title} (${item.stat} ${item.statLabel}): ${item.body}`
      ),
    },
    {
      id: "downtime",
      eyebrow: "Expectations",
      title: "Downtime & series",
      body:
        "Expect redness and a sandpaper texture for a few days typically. Makeup timing and aftercare matter. Best results usually come from a planned series (often 3), spaced weeks apart — not a single aggressive pass.",
      bullets: MORPHEUS8_STEPS.map((s) => `${s.step}. ${s.title}: ${s.body}`),
    },
    {
      id: "next-m8",
      eyebrow: "Close",
      title: "Next step: proposal",
      body:
        "Recommend a 3-pack, single area, or Transformation package and generate the proposal for deposit.",
    },
  ],
  paths: [
    {
      id: "m8-3pack",
      label: "Morpheus8 3-pack",
      summary: "Series pricing for face/neck remodeling.",
      serviceIds: ["morpheus8-3pack"],
    },
    {
      id: "m8-face",
      label: "Morpheus8 face (single)",
      summary: "Single-session face starting point.",
      serviceIds: ["morpheus8-face"],
    },
    {
      id: "transformation",
      label: "Transformation package",
      summary: "Signature package — Morpheus8 series + Solaria CO₂ (as configured).",
      serviceIds: ["pkg-transformation"],
    },
  ],
};
