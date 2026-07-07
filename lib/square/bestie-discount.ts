/** Live Square production discount — Bestie $100 off program. */
export const BESTIE_SQUARE_DISCOUNT = {
  code: "BESTIE100",
  amountUsd: 100,
  posName: "BESTIE100 — $100 Off Bestie Program",
  discountId: "2BXG7SWEOTWW324Q4G6R2OQI",
  pricingRuleId: "X76RE6GTR57TB3DO6R7B4IDT",
  posSteps: [
    "Ring up the sale in Square POS",
    "Tap Discounts",
    'Search "BESTIE100"',
    "Apply — $100.00 comes off the order",
  ],
  dashboardNote:
    "For customer-enterable codes on Square Online: Dashboard → Items & services → Discounts → Create discount code → BESTIE100",
} as const;
