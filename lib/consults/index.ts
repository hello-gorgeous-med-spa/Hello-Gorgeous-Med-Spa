export { getConsultPack } from "@/lib/consults/packs";
export { WEIGHT_LOSS_CONSULT_PACK } from "@/lib/consults/weight-loss-pack";
export { INJECTABLES_CONSULT_PACK } from "@/lib/consults/injectables-pack";
export { MORPHEUS8_CONSULT_PACK } from "@/lib/consults/morpheus8-pack";
export {
  evaluateConsultScreening,
  screeningAllowsPropose,
  weightLossBmiPreview,
  WEIGHT_LOSS_SCREEN_FIELDS,
} from "@/lib/consults/screening";
export type * from "@/lib/consults/types";

import { HELLO_GORGEOUS_SERVICES } from "@/lib/proposals/seed-services";
import {
  autoGenerateOptions,
  defaultQuantityForService,
  type ProposalOption,
  type ProposalService,
} from "@/lib/proposals/utils";

export function createPublicConsultId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
}

export function servicesFromIds(serviceIds: string[]): ProposalService[] {
  const services: ProposalService[] = [];
  for (const id of serviceIds) {
    const seed = HELLO_GORGEOUS_SERVICES.find((service) => service.id === id);
    if (!seed) continue;
    services.push({ ...seed, quantity: defaultQuantityForService(seed) });
  }
  return services;
}

export function optionsFromServiceIds(serviceIds: string[]): ProposalOption[] {
  const services = servicesFromIds(serviceIds);
  if (!services.length) {
    return [
      {
        name: "Essential Plan",
        services: [],
        discountType: "none",
        discountValue: 0,
        timeline: [],
      },
    ];
  }
  return autoGenerateOptions(services);
}
