import { normalizeToE164 } from "@/lib/phone-e164";

/** Dani / staff PSTN transfer target for AI concierge (E.164). */
export function getConciergeTransferE164(): string {
  const raw =
    process.env.AI_CONCIERGE_TRANSFER_E164?.trim() ||
    process.env.AI_CONCIERGE_TRANSFER_PHONE?.trim() ||
    "+16308813398";
  return normalizeToE164(raw) ?? "+16308813398";
}
