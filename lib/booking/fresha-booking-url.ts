import { BOOKING_URL } from "@/lib/flows";

/**
 * Fresha org booking URL with optional per-service deep link (`serviceId` query param).
 * Square Appointments is not used for public booking — payments stay on Square POS.
 */
export function freshaBookingUrlForService(freshaServiceId?: string | null): string {
  const u = new URL(BOOKING_URL);
  if (freshaServiceId?.trim()) {
    u.searchParams.set("serviceId", freshaServiceId.trim());
  }
  return u.toString();
}

/** @deprecated Use `freshaBookingUrlForService`. Kept for imports migrating off Square. */
export const bookingUrlForService = freshaBookingUrlForService;
