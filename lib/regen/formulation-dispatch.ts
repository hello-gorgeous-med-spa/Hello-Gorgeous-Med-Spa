/**
 * Formulation Rx / FormuConnect dispatch ticket.
 *
 * Monday operating path: resolve a real catalog SKU, give Ryan/Damara a
 * copy-paste ticket for portal.formuconnect.com. Do not invent a live
 * FormuConnect order API — adapters stay manual until the vendor client lands.
 */

import { RYAN_FULL_NAME } from "@/lib/founder-credentials";
import { formulationCatalogBySku } from "@/lib/formulation-pharmacy-catalog";
import {
  pickFormulationSemaInjectablePack,
  pickFormulationTirzInjectablePack,
  type FormulationGlp1Pack,
} from "@/lib/glp1-formulation-catalog";
import { vendorPortalUrl } from "@/lib/rx-pharmacy-fulfillment/pharmacy-key";
import {
  isTryregenBundleProgram,
  tryregenBundleSheetNames,
} from "@/lib/regen/tryregen-bundles";
import {
  formatSquareShippingAddress,
  type SquareShippingAddress,
} from "@/lib/square/order-shipping-format";

export const FORMULATION_PHARMACY_LABEL = "Formulation Rx";
export const BOOMRX_PHARMACY_LABEL = "BoomRx";

export const FORMUCONNECT_STAFF_PORTAL_URL =
  vendorPortalUrl("formulation") ?? "https://portal.formuconnect.com/login";

export type FormulationTicketStatus = "ready" | "needs_np_sku" | "no_formulation_sku";

export type FormulationTicketLine = {
  sku: string | null;
  productName: string;
  packDescription: string;
  quantity: number;
  sig: string;
  daysSupply: number;
  coldShip: boolean;
  shipNote: string;
};

export type FormulationTicket = {
  status: FormulationTicketStatus;
  pharmacy: typeof FORMULATION_PHARMACY_LABEL | typeof BOOMRX_PHARMACY_LABEL;
  portalUrl: string;
  program: string;
  goal: string;
  lines: FormulationTicketLine[];
  patient: {
    name: string;
    dob: string;
    email: string;
    phone: string;
    shipTo: string;
  };
  orderRef: string;
  notes: string[];
  pasteText: string;
  needsNpSku: boolean;
};

export type FormulationTicketInput = {
  orderRef?: string | null;
  goal?: string | null;
  program?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  items?: unknown;
  intakeData?: Record<string, unknown> | null;
  medicalHistory?: Record<string, unknown> | null;
  shippingAddress?: SquareShippingAddress | Record<string, unknown> | null;
  allergies?: string | null;
};

const DEFAULT_SIG = `Use as directed by ${RYAN_FULL_NAME}`;

/** Fixed Formulation SKUs for /start programs that have one safe default. */
const PROGRAM_SKU: Record<
  string,
  { sku: string; qty?: number; daysSupply?: number; note?: string }
> = {
  b12: { sku: "4041", daysSupply: 30, note: "Olympia B12 Methylcobalamin 10mL · 5mg/mL" },
  biotin: {
    sku: "4039",
    daysSupply: 30,
    note: "Olympia Biotin 10mL · 10mg/mL (Formulation high-concentration vial)",
  },
  glutathione: { sku: "4032", daysSupply: 30, note: "Olympia Glutathione 5mL · 200mg/mL" },
  "nad-injection": {
    sku: "3119",
    daysSupply: 30,
    note: "NAD+ 10mL · 100mg/mL — Ryan may upgrade to 3839 (200mg/mL) if appropriate",
  },
  nad: {
    sku: "3119",
    daysSupply: 30,
    note: "NAD+ 10mL · 100mg/mL — Ryan may upgrade to 3839 (200mg/mL) if appropriate",
  },
  growth: { sku: "2885", daysSupply: 30, note: "Sermorelin injection 6mL · 1.5mg/mL" },
  "libido-women": { sku: "3502", daysSupply: 30, note: "PT-141 (Bremelanotide) 10mL · 2mg/mL" },
};

const NEEDS_NP_PROGRAMS = new Set([
  "hrt-women",
  "hrt-men",
  "ed",
  "tretinoin",
  "tretinoin-ha",
  "hydroquinone",
  "ghk-cu",
  "cleartone",
  "clarity",
  "refine-pm",
  "lumineye",
  "fin-minox-foam",
  "fin-minox-solution",
  "advanced-hair",
  "oral-minox",
]);

const ITEM_PROGRAM_HINTS: Array<{ pattern: RegExp; program: string }> = [
  { pattern: /tirzepatide/i, program: "tirzepatide" },
  { pattern: /semaglutide/i, program: "semaglutide" },
  { pattern: /\bb12\b|methylcobalamin/i, program: "b12" },
  { pattern: /biotin/i, program: "biotin" },
  { pattern: /glutathione/i, program: "glutathione" },
  { pattern: /\bnad\+?\b/i, program: "nad-injection" },
  { pattern: /sermorelin|growth & energy|cjc/i, program: "growth" },
  { pattern: /pt-?141|bremelanotide|women.?s desire/i, program: "libido-women" },
  { pattern: /bpc-157 \/ tb-500|bpc-157 \/ tb-500 \/ ghk|recovery blend|full recovery|heal blend|skin repair|focus blend|radiance pair|nad \+ sermorelin|peak performance/i, program: "boomrx-blend" },
  { pattern: /bpc|tb-?500|recovery stack/i, program: "bpc-tb" },
  { pattern: /women.?s hrt|estrogen|progesterone/i, program: "hrt-women" },
  { pattern: /\btrt\b|testosterone|men.?s (hrt|trt)/i, program: "hrt-men" },
  { pattern: /sildenafil|tadalafil|men.?s performance|\bed\b/i, program: "ed" },
];

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function str(value: unknown): string {
  return String(value ?? "").trim();
}

function firstItemName(items: unknown): string {
  if (!Array.isArray(items)) return "";
  for (const raw of items) {
    const item = asRecord(raw);
    const name = str(item?.name);
    if (name && !/shipping/i.test(name)) return name;
  }
  return "";
}

function allItemNames(items: unknown): string {
  if (!Array.isArray(items)) return "";
  return items
    .map((raw) => str(asRecord(raw)?.name))
    .filter((name) => name && !/shipping/i.test(name))
    .join(" ");
}

function isBoomRxComposedBundle(input: FormulationTicketInput): boolean {
  const names = allItemNames(input.items);
  const hasNad = /\bnad\+?\b/i.test(names);
  const hasSerm = /sermorelin/i.test(names);
  const hasGlut = /glutathione/i.test(names);
  return (hasNad && hasSerm) || (hasNad && hasGlut);
}

function inferProgram(input: FormulationTicketInput): string {
  const history = input.medicalHistory || {};
  const intake = input.intakeData || {};
  const explicit =
    str(input.program) ||
    str(history.program) ||
    str(intake.program) ||
    str(asRecord(intake.formulationTicket)?.program);
  if (explicit) return explicit;

  if (history.tirzepatide || intake.tirzepatide) return "tirzepatide";

  if (isBoomRxComposedBundle(input)) return "boomrx-blend";

  const blob = [allItemNames(input.items) || firstItemName(input.items), str(input.goal)].join(" ");
  for (const hint of ITEM_PROGRAM_HINTS) {
    if (hint.pattern.test(blob)) return hint.program;
  }

  const goal = str(input.goal).toLowerCase();
  if (goal === "weight-loss" || goal === "glp1") return "semaglutide";
  if (goal === "vitamins") return "b12";
  if (goal === "bundles") return "boomrx-blend";
  if (goal === "peptides") return "growth";
  if (goal === "hormones" || goal === "hrt") return "hrt-women";
  if (goal === "sexual-health") return "ed";
  if (goal === "hair") return "advanced-hair";
  if (goal === "skincare") return "tretinoin";
  return goal || "unknown";
}

function readTirz(input: FormulationTicketInput): {
  weeklyMg: number | null;
  termDays: number;
  vials: number;
} {
  const history = input.medicalHistory || {};
  const intake = input.intakeData || {};
  const tirz =
    asRecord(history.tirzepatide) ||
    asRecord(intake.tirzepatide) ||
    asRecord(input.items && Array.isArray(input.items) ? input.items[0] : null);

  const weeklyMg = Number(tirz?.weeklyMg ?? tirz?.weekly_mg);
  const termDays = Number(tirz?.termDays ?? tirz?.term_days ?? 30) || 30;
  const vials = Number(tirz?.vials ?? 0);

  return {
    weeklyMg: Number.isFinite(weeklyMg) && weeklyMg > 0 ? weeklyMg : null,
    termDays,
    vials: Number.isFinite(vials) && vials > 0 ? vials : 0,
  };
}

function vialsFromItems(items: unknown): number {
  if (!Array.isArray(items)) return 0;
  for (const raw of items) {
    const item = asRecord(raw);
    const vials = Number(item?.vials);
    if (Number.isFinite(vials) && vials > 0) return vials;
    const qty = Number(item?.qty ?? item?.quantity);
    const name = str(item?.name);
    if (Number.isFinite(qty) && qty > 0 && /tirz|sema|vial/i.test(name) && !/shipping/i.test(name)) {
      return qty;
    }
  }
  return 0;
}

function packGlp1Vials(
  pick: (vials: number) => FormulationGlp1Pack | null,
  vialCount: number,
): FormulationGlp1Pack[] {
  const vials = Math.max(1, Math.round(vialCount));
  const exact = pick(vials);
  if (exact) return [exact];

  const packs: FormulationGlp1Pack[] = [];
  let remaining = vials;
  while (remaining > 0) {
    const take = Math.min(5, remaining);
    const pack = pick(take);
    if (!pack) break;
    packs.push(pack);
    remaining -= take;
  }
  return packs;
}

function lineFromSku(
  sku: string,
  qty: number,
  daysSupply: number,
  fallbackName: string,
): FormulationTicketLine {
  const catalog = formulationCatalogBySku(sku);
  return {
    sku,
    productName: catalog?.product || fallbackName,
    packDescription: [catalog?.size, catalog?.concentration].filter(Boolean).join(" · "),
    quantity: qty,
    sig: DEFAULT_SIG,
    daysSupply,
    coldShip: Boolean(catalog?.flags?.some((f) => /cold/i.test(f))),
    shipNote: catalog?.flags?.join(" · ") || "Confirm ship method in FormuConnect",
  };
}

function lineFromPack(pack: FormulationGlp1Pack, daysSupply: number): FormulationTicketLine {
  return {
    sku: pack.sku,
    productName: pack.productName,
    packDescription: `${pack.packDescription} · ${pack.concentration}`,
    quantity: 1,
    sig: DEFAULT_SIG,
    daysSupply,
    coldShip: pack.coldShip,
    shipNote: pack.shipNote,
  };
}

function shipToText(input: FormulationTicketInput): string {
  const square = formatSquareShippingAddress(input.shippingAddress as SquareShippingAddress);
  if (square) return square;

  const history = input.medicalHistory || {};
  const intake = input.intakeData || {};
  const shipping = asRecord(history.shipping) || asRecord(intake.shipping) || {};
  const street = str(shipping.street1 || shipping.line1 || shipping.address);
  const street2 = str(shipping.street2 || shipping.line2);
  const city = str(shipping.city);
  const state = str(shipping.state) || "IL";
  const zip = str(shipping.zip || shipping.postalCode);
  return [street, street2, [city, state, zip].filter(Boolean).join(", ")].filter(Boolean).join("\n");
}

function dobFrom(input: FormulationTicketInput): string {
  const history = input.medicalHistory || {};
  const intake = input.intakeData || {};
  return (
    str(history.dob) ||
    str(history.dateOfBirth) ||
    str(intake.dob) ||
    str(intake.dateOfBirth) ||
    ""
  );
}

function buildPasteText(ticket: Omit<FormulationTicket, "pasteText">): string {
  const lines = ticket.lines.length
    ? ticket.lines
        .map((line, i) =>
          [
            ticket.lines.length > 1 ? `LINE ${i + 1}` : "RX LINE",
            `SKU: ${line.sku || "RYAN MUST PICK"}`,
            `Product: ${line.productName}`,
            line.packDescription ? `Pack: ${line.packDescription}` : null,
            `Qty: ${line.quantity}`,
            `Sig: ${line.sig}`,
            `Days supply: ${line.daysSupply}`,
            line.coldShip ? `Ship: ${line.shipNote || "Cold ship · next day"}` : `Ship: ${line.shipNote}`,
          ]
            .filter(Boolean)
            .join("\n"),
        )
        .join("\n\n")
    : "RX LINE\nSKU: RYAN MUST PICK";

  return [
    ticket.pharmacy === BOOMRX_PHARMACY_LABEL ? "BOOMRX / WELLSYNC" : "FORMULATION / FORMUCONNECT",
    `Pharmacy: ${ticket.pharmacy}`,
    `Order: ${ticket.orderRef || "—"}`,
    `Program: ${ticket.program}`,
    `Status: ${ticket.status}`,
    "",
    `Patient: ${ticket.patient.name || "—"}`,
    `DOB: ${ticket.patient.dob || "—"}`,
    `Phone: ${ticket.patient.phone || "—"}`,
    `Email: ${ticket.patient.email || "—"}`,
    `Ship to:\n${ticket.patient.shipTo || "MISSING — get address before placing"}`,
    "",
    lines,
    "",
    ticket.notes.length ? `Staff notes:\n- ${ticket.notes.join("\n- ")}` : null,
    ticket.pharmacy === BOOMRX_PHARMACY_LABEL
      ? "After placing in BoomRx: mark Pharmacy ordered on this order."
      : "After placing in FormuConnect: mark Pharmacy ordered on this order.",
  ]
    .filter((block) => block != null)
    .join("\n");
}

export function resolveFormulationTicket(input: FormulationTicketInput): FormulationTicket {
  const program = inferProgram(input);
  const goal = str(input.goal);
  const notes: string[] = [];
  let status: FormulationTicketStatus = "ready";
  let pharmacy: FormulationTicket["pharmacy"] = FORMULATION_PHARMACY_LABEL;
  const lines: FormulationTicketLine[] = [];

  if (program === "tirzepatide") {
    const tirz = readTirz(input);
    const vials = tirz.vials || vialsFromItems(input.items) || 1;
    const packs = packGlp1Vials(pickFormulationTirzInjectablePack, vials);
    if (!packs.length) {
      status = "needs_np_sku";
      notes.push(`Could not map ${vials} tirzepatide vial(s) to a Formulation pack (2498–2502).`);
    } else {
      for (const pack of packs) lines.push(lineFromPack(pack, tirz.termDays));
      if (tirz.weeklyMg != null) {
        notes.push(
          `Requested ${tirz.weeklyMg} mg/week × ${tirz.termDays} days · ${vials} × 1 mL @ 12.5 mg/mL. Compounded tirzepatide is not FDA-approved.`,
        );
      }
      notes.push("Cold ship · next day only.");
    }
  } else if (program === "semaglutide") {
    const vials = vialsFromItems(input.items) || 1;
    const packs = packGlp1Vials(pickFormulationSemaInjectablePack, vials);
    if (!packs.length) {
      status = "needs_np_sku";
      notes.push(`Could not map ${vials} semaglutide vial(s) to a Formulation pack (2488–2493).`);
    } else {
      for (const pack of packs) lines.push(lineFromPack(pack, 30));
      notes.push("Default starter pack unless Ryan writes a different vial count. Compounded semaglutide is not FDA-approved.");
      notes.push("Cold ship · next day only.");
    }
  } else if (program === "bpc-tb" || program === "boomrx-blend" || isTryregenBundleProgram(program)) {
    pharmacy = BOOMRX_PHARMACY_LABEL;
    const mapped = tryregenBundleSheetNames(program);
    const fromItems = Array.isArray(input.items)
      ? input.items
          .map((raw) => str(asRecord(raw)?.name))
          .filter((name) => name && !/shipping/i.test(name))
      : [];
    const productNames = mapped.length
      ? mapped
      : fromItems.length
        ? fromItems
        : [firstItemName(input.items) || "BPC-157 / TB-500"];
    for (const productName of productNames) {
      lines.push({
        sku: null,
        productName,
        packDescription: "BoomRx July 2026 sheet — paste this product name",
        quantity: 1,
        sig: DEFAULT_SIG,
        daysSupply: 30,
        coldShip: true,
        shipNote: "Cold ship · one pharmacy ship",
      });
    }
    notes.push(
      "Ryan prescribed if clinically appropriate. Place these exact BoomRx sheet products in the BoomRx portal. Not a Formulation / FormuConnect SKU.",
    );
  } else if (PROGRAM_SKU[program]) {
    const mapped = PROGRAM_SKU[program];
    lines.push(lineFromSku(mapped.sku, mapped.qty ?? 1, mapped.daysSupply ?? 30, program));
    if (mapped.note) notes.push(mapped.note);
  } else if (NEEDS_NP_PROGRAMS.has(program) || program === "unknown") {
    status = "needs_np_sku";
    if (program === "ed") {
      notes.push(
        "Men's performance: Ryan picks Sildenafil (9138 = 100mg × 30) or Tadalafil (9253 = 20mg × 30) — no default dose.",
      );
    } else if (program.startsWith("hrt")) {
      notes.push("HRT/TRT has no safe default SKU. Ryan picks the Formulation hormone SKU after labs/visit.");
    } else {
      notes.push("Ryan must pick the Formulation SKU in the catalog before Damara places this in FormuConnect.");
    }
  } else {
    status = "needs_np_sku";
    notes.push(`No automatic Formulation SKU for program “${program}”. Ryan picks the SKU.`);
  }

  if (input.allergies) {
    notes.push(`Allergies on file: ${input.allergies}`);
  }

  const ticket: Omit<FormulationTicket, "pasteText"> = {
    status,
    pharmacy,
    portalUrl:
      pharmacy === BOOMRX_PHARMACY_LABEL
        ? vendorPortalUrl("boomrx") ?? "https://portal.boomrx.com/en-US/boomrx/prescriptions"
        : FORMUCONNECT_STAFF_PORTAL_URL,
    program,
    goal,
    lines,
    patient: {
      name: str(input.customerName),
      dob: dobFrom(input),
      email: str(input.customerEmail),
      phone: str(input.customerPhone),
      shipTo: shipToText(input),
    },
    orderRef: str(input.orderRef),
    notes,
    needsNpSku: status !== "ready",
  };

  return { ...ticket, pasteText: buildPasteText(ticket) };
}

export function formulationTicketSnapshot(ticket: FormulationTicket) {
  return {
    status: ticket.status,
    program: ticket.program,
    pharmacy: ticket.pharmacy,
    needsNpSku: ticket.needsNpSku,
    sku: ticket.lines[0]?.sku ?? null,
    productName: ticket.lines[0]?.productName ?? null,
    quantity: ticket.lines[0]?.quantity ?? 1,
    pasteText: ticket.pasteText,
    generatedAt: new Date().toISOString(),
  };
}

export function mergeIntakeWithFormulationTicket(
  existing: Record<string, unknown> | null | undefined,
  ticket: FormulationTicket,
): Record<string, unknown> {
  return {
    ...(existing || {}),
    formulationTicket: formulationTicketSnapshot(ticket),
  };
}

export function enrichOrderItemsWithFormulationSku(
  items: unknown,
  ticket: FormulationTicket,
): unknown {
  if (!Array.isArray(items) || !ticket.lines[0]?.sku) return items;
  const primary = ticket.lines[0];
  return items.map((raw) => {
    const item = asRecord(raw);
    if (!item) return raw;
    if (/shipping/i.test(str(item.name))) return raw;
    return {
      ...item,
      formulationSku: item.formulationSku ?? primary.sku,
      formulationProduct: item.formulationProduct ?? primary.productName,
    };
  });
}
