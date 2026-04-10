import type { Transaction } from "plaid";

const HG = {
  equipment: "Equipment & Supplies",
  software: "Software & Subscriptions",
  marketing: "Marketing & Advertising",
  rent: "Rent & Utilities",
  cc: "Credit Card Bills",
  staff: "Staff & Contractors",
  other: "Other",
} as const;

/** Map Plaid personal_finance_category → Hub expense categories (HG_DEV_PLAID_001). */
export function mapPlaidToHgCategory(txn: Transaction): string {
  const p = (txn.personal_finance_category?.primary || "").toUpperCase();
  const d = (txn.personal_finance_category?.detailed || "").toUpperCase();

  if (p === "FOOD_AND_DRINK" || d.includes("RESTAURANT")) return HG.marketing;
  if (p === "SHOPS") {
    if (d.includes("COSMETICS") || d.includes("PHARMAC")) return HG.equipment;
    return HG.equipment;
  }
  if (p === "TRAVEL" || d.includes("AIRLINE") || d.includes("HOTEL")) return HG.other;
  if (p === "GENERAL_SERVICES" && d.includes("SUBSCRIPTION")) return HG.software;
  if (p === "SERVICE" && d.includes("SUBSCRIPTION")) return HG.software;
  if (p === "LOAN_PAYMENTS" || d.includes("CREDIT_CARD")) return HG.cc;
  if (p === "TRANSFER" && d.includes("PAYROLL")) return HG.staff;
  if (p === "RENT_AND_UTILITIES") return HG.rent;
  if (p === "INCOME") return HG.other;

  return HG.other;
}
