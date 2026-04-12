import { BUSINESS_TIMEZONE } from "@/lib/business-timezone";

/** YYYY-MM-DD for "today" in America/Chicago. */
export function getBusinessTodayDateString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: BUSINESS_TIMEZONE });
}
