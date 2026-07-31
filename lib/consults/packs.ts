import type { ConsultEducationPack, ConsultVertical } from "@/lib/consults/types";
import { WEIGHT_LOSS_CONSULT_PACK } from "@/lib/consults/weight-loss-pack";
import { INJECTABLES_CONSULT_PACK } from "@/lib/consults/injectables-pack";
import { MORPHEUS8_CONSULT_PACK } from "@/lib/consults/morpheus8-pack";

const PACKS: Record<ConsultVertical, ConsultEducationPack> = {
  weight_loss: WEIGHT_LOSS_CONSULT_PACK,
  injectables: INJECTABLES_CONSULT_PACK,
  morpheus8: MORPHEUS8_CONSULT_PACK,
  other: {
    vertical: "other",
    title: "General consult",
    concernDefaults: [],
    slides: [
      {
        id: "general",
        title: "Document the consult",
        body: "Capture concerns, notes, and create a custom proposal from the builder.",
      },
    ],
    paths: [
      {
        id: "custom",
        label: "Custom proposal",
        summary: "Open an empty draft proposal and build line items in the editor.",
        serviceIds: [],
      },
    ],
  },
};

export function getConsultPack(vertical: ConsultVertical): ConsultEducationPack {
  return PACKS[vertical] ?? PACKS.other;
}
