import {
  FORM_IMMEDIATE_TEXT_PHONE,
  FORM_IMMEDIATE_TEXT_SMS,
  FORM_IMMEDIATE_TEXT_TEL,
} from "@/lib/form-contact";

/** RX portal / care team text line (Danielle — matches GBP CMS). */
export const RX_CARE_TEXT_PHONE = FORM_IMMEDIATE_TEXT_PHONE;
export const RX_CARE_TEXT_SMS = FORM_IMMEDIATE_TEXT_SMS;
export const RX_CARE_TEXT_TEL = FORM_IMMEDIATE_TEXT_TEL;
export const RX_CARE_TEXT_DISPLAY = "(630) 881-3398";

export function rxCareTextHint(prefix = "Try again or text"): string {
  return `${prefix} ${RX_CARE_TEXT_DISPLAY}.`;
}
