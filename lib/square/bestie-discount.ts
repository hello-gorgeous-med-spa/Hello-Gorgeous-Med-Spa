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
  checkoutSteps: [
    "Client taps Pre-pay / Checkout in the app (or uses a Square payment link)",
    "On Square's hosted checkout page, tap Add promo code or Discount",
    "Enter BESTIE100 — $100.00 comes off the order",
    "Complete payment on Square (not in the Hello Gorgeous app)",
  ],
  dashboardNote:
    "BESTIE100 is configured in Square Dashboard for checkout redemption. Do not apply discounts in-app — Square checkout is the only client redemption path.",
} as const;
