import { HELLO_GORGEOUS_SERVICES, type SeedService } from "@/lib/proposals/seed-services";

export type DiscountType = "percentage" | "dollar" | "package" | "membership";

export type ProposalService = SeedService & { quantity: number };

export type ProposalTimelineItem = {
  month: number;
  services: string[];
};

export type ProposalOption = {
  name: string;
  services: ProposalService[];
  discountType: DiscountType;
  discountValue: number;
  timeline: ProposalTimelineItem[];
};

export function calculateSubtotal(services: ProposalService[]): number {
  return services.reduce((sum, service) => sum + service.price * service.quantity, 0);
}

export function calculateDiscount(subtotal: number, discountType: DiscountType, discountValue: number): number {
  if (discountType === "percentage") return subtotal * (discountValue / 100);
  if (discountType === "dollar") return Math.min(discountValue, subtotal);
  if (discountType === "membership") return subtotal * 0.1;
  return 0;
}

export function calculateTotal(option: ProposalOption): number {
  const subtotal = calculateSubtotal(option.services);
  const discount = calculateDiscount(subtotal, option.discountType, option.discountValue);
  return Math.max(0, subtotal - discount);
}

export function calculateMonthlyPayment(total: number, months = 24): number {
  if (months <= 0) return total;
  return total / months;
}

export function generateTimeline(services: ProposalService[]): ProposalTimelineItem[] {
  if (!services.length) return [];

  const maxSessions = Math.max(...services.map((service) => service.quantity));
  const timeline: ProposalTimelineItem[] = [];

  for (let month = 1; month <= maxSessions; month += 1) {
    const monthServices = services.filter((service) => service.quantity >= month).map((service) => service.id);
    if (monthServices.length) timeline.push({ month, services: monthServices });
  }

  return timeline;
}

export function autoGenerateOptions(selectedServices: ProposalService[]): ProposalOption[] {
  const essentialServices = selectedServices.map((service) => ({ ...service }));

  const recommendedServices = essentialServices.map((service) => ({ ...service }));
  if (recommendedServices.some((service) => service.id.startsWith("morpheus8"))) {
    const prpService = HELLO_GORGEOUS_SERVICES.find((service) => service.id === "prp-facial");
    if (prpService && !recommendedServices.some((service) => service.id === prpService.id)) {
      recommendedServices.push({ ...prpService, quantity: 1 });
    }
  }

  const vipServices = recommendedServices.map((service) => ({ ...service }));
  vipServices.push({
    id: "skincare-kit",
    name: "Medical-Grade Skincare Kit",
    category: "Retail",
    price: 200,
    unit: "per kit",
    quantity: 1,
    description: "Home care support bundle.",
  });

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
