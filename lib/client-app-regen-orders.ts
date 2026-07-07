/** Remember RE GEN order refs in the client PWA (no login required). */
export const REGEN_ORDER_REFS_STORAGE_KEY = "hg-regen-order-refs";

export function getStoredRegenOrderRefs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGEN_ORDER_REFS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((v) => String(v || "").trim())
      .filter(Boolean)
      .slice(0, 8);
  } catch {
    return [];
  }
}

export function rememberRegenOrderRef(ref: string): void {
  const normalized = ref.trim();
  if (!normalized || typeof window === "undefined") return;
  const existing = getStoredRegenOrderRefs().filter((r) => r !== normalized);
  localStorage.setItem(
    REGEN_ORDER_REFS_STORAGE_KEY,
    JSON.stringify([normalized, ...existing].slice(0, 8)),
  );
}
