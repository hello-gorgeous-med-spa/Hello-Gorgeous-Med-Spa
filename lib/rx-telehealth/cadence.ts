import { RX_TELEHEALTH_CADENCE_DAYS } from "@/lib/rx-supply-cycle";

/** Configurable NP telehealth recheck window (HGRX-061). Default 90 days. */
export function rxTelehealthCadenceDays(): number {
  const raw = process.env.RX_TELEHEALTH_CADENCE_DAYS;
  if (raw != null && raw.trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return Math.round(n);
  }
  return RX_TELEHEALTH_CADENCE_DAYS;
}
