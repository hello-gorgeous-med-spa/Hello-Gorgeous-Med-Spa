/**
 * In-clinic peptide bar handoff. The kiosk and poster QR open this list
 * on a phone. Prices match the Peptide Bar menu. No wholesale.
 */

export const KIOSK_REQUEST_ORIGIN = "https://www.hellogorgeousmedspa.com";
export const KIOSK_SHIP_USD = 30;

export type KioskRequestItem = {
  id: string;
  name: string;
  spec: string;
  priceUsd: number;
};

export const KIOSK_REQUEST_ITEMS: KioskRequestItem[] = [
  { id: "bpc", name: "BPC-157", spec: "3 mg/mL · 5 mL", priceUsd: 175 },
  { id: "tb500", name: "TB-500", spec: "3 mg/mL · 5 mL", priceUsd: 175 },
  { id: "ghk", name: "GHK-Cu", spec: "10 mg/mL · 5 mL", priceUsd: 175 },
  { id: "pt141", name: "PT-141", spec: "2 mg/mL · 5 mL", priceUsd: 175 },
  { id: "motsc", name: "MOTS-c", spec: "20 mg/mL · 5 mL", priceUsd: 175 },
  { id: "tesa", name: "Tesamorelin", spec: "3 mg/mL · 5 mL", priceUsd: 175 },
  { id: "aod", name: "AOD-9604", spec: "2 mg/mL · 5 mL", priceUsd: 175 },
  { id: "igf", name: "IGF-LR3", spec: "200 mcg/mL · 5 mL", priceUsd: 175 },
  { id: "ta1", name: "Thymosin Alpha-1", spec: "5 mg/mL · 5 mL", priceUsd: 175 },
  { id: "nad", name: "NAD+", spec: "100 mg/mL · 10 mL", priceUsd: 150 },
  { id: "cjc", name: "CJC-1295 / Ipamorelin", spec: "1.2 mg / 2 mg per mL · 5 mL", priceUsd: 200 },
  { id: "blend-bpc-tb", name: "BPC-157 / TB-500", spec: "3 mg / 3 mg per mL · 5 mL", priceUsd: 200 },
  { id: "blend-heal", name: "BPC-157 / KPV / TB-500", spec: "3 mg / 3 mg / 3 mg per mL · 5 mL", priceUsd: 200 },
  { id: "blend-btg", name: "BPC-157 / TB-500 / GHK-Cu", spec: "3 mg / 3 mg / 10 mg per mL · 5 mL", priceUsd: 200 },
  { id: "blend-glow", name: "Recovery Blend", spec: "BPC-157 · GHK-Cu · KPV · TB-500 · 5 mL", priceUsd: 200 },
  { id: "blend-tesa-ipa", name: "Tesamorelin / Ipamorelin", spec: "3 mg / 2 mg per mL · 5 mL", priceUsd: 200 },
  { id: "blend-mots-tesa", name: "MOTS-c / Tesamorelin", spec: "4 mg / 3 mg per mL · 5 mL", priceUsd: 200 },
  { id: "b12m", name: "B12 Methylcobalamin", spec: "5 mg/mL · 10 mL", priceUsd: 180 },
  { id: "micc", name: "MICC lipo", spec: "30 mL", priceUsd: 230 },
  { id: "glut", name: "Glutathione", spec: "200 mg/mL · 30 mL", priceUsd: 208 },
  { id: "biotin", name: "Biotin", spec: "10 mg/mL · 10 mL", priceUsd: 207 },
  { id: "tri", name: "Tri-Immune", spec: "Vitamin C, glutathione, zinc · 30 mL", priceUsd: 215 },
  { id: "bright", name: "Brightening cream", spec: "30 g", priceUsd: 238 },
  { id: "clarity", name: "Clarity acne cream", spec: "30 g", priceUsd: 210 },
  { id: "hair", name: "Minoxidil / finasteride", spec: "30 mL", priceUsd: 210 },
  { id: "ghktop", name: "GHK-Cu topical", spec: "0.25% · 30 mL", priceUsd: 195 },
  { id: "serm", name: "Sermorelin", spec: "6 mL · 1 mg/mL", priceUsd: 188 },
  { id: "ldn", name: "Low-dose naltrexone", spec: "30 capsules", priceUsd: 178 },
  { id: "vitd", name: "Vitamin D3", spec: "50,000 IU/mL · 30 mL · IM only", priceUsd: 210 },
  { id: "sema", name: "Semaglutide", spec: "4-week vial. Dose set after review.", priceUsd: 100 },
  { id: "tirz", name: "Tirzepatide", spec: "4-week vial. Dose set after review.", priceUsd: 187.5 },
  { id: "athlete", name: "Athlete Rebuild", spec: "BPC-157, TB-500, NAD+", priceUsd: 500 },
  { id: "glow", name: "Glow Protocol", spec: "GHK-Cu, Recovery Blend, NAD+", priceUsd: 525 },
  { id: "lean", name: "Lean & Lifted", spec: "Tirzepatide, MOTS-c, CJC-1295 / Ipamorelin", priceUsd: 562.5 },
  { id: "executive", name: "Executive Edge", spec: "NAD+, Semaglutide, BPC-157", priceUsd: 425 },
];

const BY_ID = new Map(KIOSK_REQUEST_ITEMS.map((item) => [item.id, item]));

export function formatKioskPrice(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export function parseKioskRequestIds(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const part of raw.split(",")) {
    const id = part.trim().toLowerCase();
    if (!BY_ID.has(id) || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
    if (ids.length >= 12) break;
  }
  return ids;
}

export function resolveKioskRequestItems(raw: string | null | undefined): KioskRequestItem[] {
  return parseKioskRequestIds(raw).map((id) => BY_ID.get(id)!);
}

export function kioskRequestPageUrl(ids: string[]): string {
  const clean = parseKioskRequestIds(ids.join(","));
  const base = `${KIOSK_REQUEST_ORIGIN}/kiosk/request`;
  return clean.length ? `${base}?items=${clean.join(",")}` : base;
}

export function peptideBarHistory(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const history = raw as Record<string, unknown>;
  if (history.source !== "peptide-bar-kiosk") return raw;
  const idList = Array.isArray(history.kioskItemIds)
    ? history.kioskItemIds.map((id) => String(id)).join(",")
    : "";
  const items = resolveKioskRequestItems(idList);
  const note = typeof history.note === "string" ? history.note.trim().slice(0, 500) : "";
  return {
    source: "peptide-bar-kiosk",
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      spec: item.spec,
      priceUsd: item.priceUsd,
    })),
    shippingUsd: items.length ? KIOSK_SHIP_USD : 0,
    note,
  };
}

export function peptideBarStaffLine(history: unknown): string | undefined {
  if (!history || typeof history !== "object") return undefined;
  const record = history as {
    source?: string;
    items?: { name?: string; priceUsd?: number }[];
    note?: string;
  };
  if (record.source !== "peptide-bar-kiosk") return undefined;
  const lines = (record.items || [])
    .filter((item) => item.name)
    .map((item) =>
      typeof item.priceUsd === "number"
        ? `${item.name} ${formatKioskPrice(item.priceUsd)}`
        : String(item.name),
    );
  const note = typeof record.note === "string" ? record.note.trim() : "";
  if (!lines.length && !note) return undefined;
  const priced = lines.join(" · ");
  const ship = lines.length ? ` Cold ship $${KIOSK_SHIP_USD} once.` : "";
  return [priced, ship.trim(), note ? `Note: ${note}` : ""].filter(Boolean).join(" ");
}
