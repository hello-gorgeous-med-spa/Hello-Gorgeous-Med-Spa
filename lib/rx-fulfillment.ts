/**
 * Hello Gorgeous RX™ fulfillment choice — clinic pickup vs ship.
 *
 * Shared by every RX intake so the option labels stored in
 * hg_form_submissions.responses_json.ship_to_home stay identical across forms
 * and map cleanly to hg_rx_dispatch.ship_to for staff.
 */

import type { IntakeFormField } from "@/lib/hgos/intake-forms";

export const RX_SHIP_FLAT_USD = 30;

export const RX_SHIP_HOME_OPTION = `Ship to me — flat $${RX_SHIP_FLAT_USD}, tracked`;
export const RX_CLINIC_PICKUP_OPTION = "Pick up at our Oswego clinic — no shipping fee";

/**
 * Older GLP-1 refill submissions stored "Yes — ship to my home (cold-chain
 * delivery)" / "No — I will pick up at the spa", so match on intent instead of
 * the exact current label.
 */
export function rxPrefersClinicPickup(raw: unknown): boolean {
  const value = String(raw ?? "").trim().toLowerCase();
  if (!value) return false;
  if (value.startsWith("no")) return true;
  return value.includes("pick up") || value.includes("pickup");
}

export function rxFulfillmentFields(options?: {
  /** Set when the form already collects ZIP on an earlier step. */
  omitZip?: boolean;
  label?: string;
}): IntakeFormField[] {
  const shipOnly = {
    field: "ship_to_home",
    value: RX_SHIP_HOME_OPTION,
  } as const;

  const fields: IntakeFormField[] = [
    {
      id: "ship_to_home",
      type: "radio",
      label: options?.label ?? "After approval, how would you like to receive your medication?",
      required: true,
      options: [RX_SHIP_HOME_OPTION, RX_CLINIC_PICKUP_OPTION],
      helpText:
        "Pick-up is free at 74 W Washington St, Oswego. You are only charged for medication after Ryan approves your protocol.",
    },
    {
      id: "address_line1",
      type: "text",
      label: "Street address",
      required: true,
      placeholder: "123 Main St",
      conditionalOn: shipOnly,
    },
    {
      id: "address_line2",
      type: "text",
      label: "Apt / unit (optional)",
      required: false,
      placeholder: "Apt 2B",
      conditionalOn: shipOnly,
    },
    {
      id: "city",
      type: "text",
      label: "City",
      required: true,
      placeholder: "Oswego",
      conditionalOn: shipOnly,
    },
    {
      id: "state",
      type: "text",
      label: "State",
      required: true,
      placeholder: "IL",
      conditionalOn: shipOnly,
    },
  ];

  if (!options?.omitZip) {
    fields.push({
      id: "zip",
      type: "text",
      label: "ZIP code",
      required: true,
      placeholder: "60543",
      conditionalOn: shipOnly,
    });
  }

  return fields;
}
