import { HELLO_GORGEOUS_SERVICES, type SeedService } from "@/lib/proposals/seed-services";
import {
  EXOSOME_HEALING_ADDON,
  isExosomeHealingAddonId,
  serviceSuggestsExosomeAddon,
} from "@/lib/proposals/vitamin-injections";

export type DiscountType = "percentage" | "dollar" | "package" | "membership" | "custom" | "none";

export type ProposalService = SeedService & { quantity: number };

export type ProposalTimelineItem = {
  month: number;
  services: string[];
};

export type ProposalOption = {
  name: string;
  services: ProposalService[];
  discountType: DiscountType;
  /** % value, $ off, or custom final price when discountType is "custom" */
  discountValue: number;
  timeline: ProposalTimelineItem[];
};

/** Neurotoxin / unit-priced injectables — quantity means units, not sessions. */
export function isPerUnitService(service: Pick<SeedService, "unit">): boolean {
  return /per\s*unit/i.test(service.unit || "");
}

export function defaultQuantityForService(service: Pick<SeedService, "unit" | "id">): number {
  if (isPerUnitService(service)) return 20;
  return 1;
}

export function serviceLineTotal(service: Pick<ProposalService, "price" | "quantity">): number {
  return service.price * service.quantity;
}

/** Client/staff-facing line: "Botox — 20 units × $10 = $200" */
export function formatProposalServiceLine(service: ProposalService): string {
  const lineTotal = serviceLineTotal(service);
  if (isPerUnitService(service)) {
    const units = service.quantity;
    return `${service.name} — ${units} unit${units === 1 ? "" : "s"} × $${service.price} = $${lineTotal.toFixed(2)}`;
  }
  if (service.quantity > 1) {
    return `${service.name} (${service.quantity}) — $${lineTotal.toFixed(2)}`;
  }
  return `${service.name} — $${lineTotal.toFixed(2)}`;
}

export const NEUROTOXIN_UNIT_PRESETS = [20, 24, 30, 40, 50, 60] as const;

export function calculateSubtotal(services: ProposalService[]): number {
  return services.reduce((sum, service) => sum + serviceLineTotal(service), 0);
}

export function calculateDiscount(subtotal: number, discountType: DiscountType, discountValue: number): number {
  if (discountType === "percentage") return subtotal * (Math.max(0, discountValue) / 100);
  if (discountType === "dollar") return Math.min(Math.max(0, discountValue), subtotal);
  if (discountType === "membership") return subtotal * 0.1;
  if (discountType === "custom") {
    const customTotal = Math.max(0, discountValue);
    return Math.max(0, subtotal - customTotal);
  }
  return 0;
}

export function calculateTotal(option: ProposalOption): number {
  const subtotal = calculateSubtotal(option.services);
  if (option.discountType === "custom") {
    return Math.max(0, option.discountValue);
  }
  const discount = calculateDiscount(subtotal, option.discountType, option.discountValue);
  return Math.max(0, subtotal - discount);
}

export function calculateMonthlyPayment(total: number, months = 24): number {
  if (months <= 0) return total;
  return total / months;
}

export function discountLabel(option: ProposalOption): string {
  switch (option.discountType) {
    case "percentage":
      return `${option.discountValue}% off`;
    case "dollar":
      return `$${option.discountValue.toFixed(0)} off`;
    case "custom":
      return "Custom price";
    case "membership":
      return "Membership 10%";
    case "package":
      return "Package pricing";
    default:
      return "No discount";
  }
}

export function generateTimeline(services: ProposalService[]): ProposalTimelineItem[] {
  if (!services.length) return [];

  // Unit-priced injectables (e.g. 40 units of Botox) are not multi-month session counts.
  const sessionServices = services.filter((service) => !isPerUnitService(service));
  if (!sessionServices.length) {
    return [{ month: 1, services: services.map((service) => service.id) }];
  }

  const maxSessions = Math.max(...sessionServices.map((service) => service.quantity));
  const timeline: ProposalTimelineItem[] = [];

  for (let month = 1; month <= maxSessions; month += 1) {
    const monthServices = sessionServices
      .filter((service) => service.quantity >= month)
      .map((service) => service.id);
    if (month === 1) {
      for (const service of services) {
        if (isPerUnitService(service) && !monthServices.includes(service.id)) {
          monthServices.push(service.id);
        }
      }
    }
    if (monthServices.length) timeline.push({ month, services: monthServices });
  }

  return timeline;
}

export function autoGenerateOptions(selectedServices: ProposalService[]): ProposalOption[] {
  const essentialServices = selectedServices.map((service) => ({ ...service }));
  const hasFixedPackage = essentialServices.some((service) => service.id.startsWith("pkg-"));
  const wantsExosomes = essentialServices.some((service) => serviceSuggestsExosomeAddon(service.id));
  const hasExosomes = essentialServices.some((service) => isExosomeHealingAddonId(service.id));
  const hasVitaminPlan = essentialServices.some((service) => service.id.startsWith("vitamin-plan-"));

  const recommendedServices = essentialServices.map((service) => ({ ...service }));
  if (
    recommendedServices.some(
      (service) => service.id.startsWith("morpheus8") || service.id.startsWith("pkg-")
    )
  ) {
    const prpService = HELLO_GORGEOUS_SERVICES.find((service) => service.id === "prp-facial");
    if (prpService && !recommendedServices.some((service) => service.id === prpService.id)) {
      recommendedServices.push({ ...prpService, quantity: 1 });
    }
  }
  if (wantsExosomes && !hasExosomes) {
    recommendedServices.push({ ...EXOSOME_HEALING_ADDON, quantity: 1 });
  }
  if (!hasVitaminPlan && wantsExosomes) {
    const plan1 = HELLO_GORGEOUS_SERVICES.find((service) => service.id === "vitamin-plan-1mo");
    if (plan1 && !recommendedServices.some((service) => service.id === plan1.id)) {
      recommendedServices.push({ ...plan1, quantity: 1 });
    }
  }

  const vipServices = recommendedServices.map((service) => ({ ...service }));
  if (!vipServices.some((service) => isExosomeHealingAddonId(service.id)) && wantsExosomes) {
    vipServices.push({ ...EXOSOME_HEALING_ADDON, quantity: 1 });
  }
  const plan2 = HELLO_GORGEOUS_SERVICES.find((service) => service.id === "vitamin-plan-2mo");
  if (plan2 && !vipServices.some((service) => service.id.startsWith("vitamin-plan-"))) {
    vipServices.push({ ...plan2, quantity: 1 });
  } else if (plan2) {
    // Upgrade 1-mo → 2-mo on VIP when a vitamin plan is already present
    const idx = vipServices.findIndex((service) => service.id === "vitamin-plan-1mo");
    if (idx >= 0) vipServices[idx] = { ...plan2, quantity: 1 };
  }
  vipServices.push({
    id: "skincare-kit",
    name: "Medical-Grade Skincare Kit",
    category: "Retail",
    price: 200,
    unit: "per kit",
    quantity: 1,
    description: "Home care support bundle.",
  });

  // Fixed packages already include the deal — start at list/package price (staff can still override).
  if (hasFixedPackage) {
    return [
      {
        name: "Essential Plan",
        services: essentialServices,
        discountType: "package",
        discountValue: 0,
        timeline: generateTimeline(essentialServices),
      },
      {
        name: "Recommended Plan",
        services: recommendedServices,
        discountType: "package",
        discountValue: 0,
        timeline: generateTimeline(recommendedServices),
      },
      {
        name: "VIP Transformation",
        services: vipServices,
        discountType: "package",
        discountValue: 0,
        timeline: generateTimeline(vipServices),
      },
    ];
  }

  return [
    {
      name: "Essential Plan",
      services: essentialServices,
      discountType: "percentage",
      discountValue: 5,
      timeline: generateTimeline(essentialServices),
    },
    {
      name: "Recommended Plan",
      services: recommendedServices,
      discountType: "percentage",
      discountValue: 15,
      timeline: generateTimeline(recommendedServices),
    },
    {
      name: "VIP Transformation",
      services: vipServices,
      discountType: "percentage",
      discountValue: 20,
      timeline: generateTimeline(vipServices),
    },
  ];
}
