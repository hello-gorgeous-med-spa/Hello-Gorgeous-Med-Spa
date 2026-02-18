"use client";

import Link from "next/link";

/**
 * 10DLC-compliant SMS disclosure - must appear directly under phone input at point of collection.
 * NO gray text. Minimum 14px. Visible. Not collapsible.
 */
export function SMSDisclosure({
  variant = "dark",
  className = "",
}: {
  /** dark = black bg, white text. light = for light backgrounds */
  variant?: "dark" | "light";
  className?: string;
}) {
  const isDark = variant === "dark";
  const bgClass = isDark ? "bg-[#000000]" : "bg-black/5";
  const textClass = isDark ? "text-white" : "text-black";
  const linkClass = "underline text-[#E6007E] hover:text-[#E6007E]/90";

  return (
    <div
      className={`rounded-lg p-4 text-sm leading-relaxed ${bgClass} ${textClass} mt-3 ${className}`}
      style={{ fontSize: "14px" }}
      role="region"
      aria-label="SMS consent disclosure"
    >
      By providing your phone number, you agree to receive appointment reminders
      and occasional promotional text messages from Hello Gorgeous Med Spa.
      Message frequency varies. Message and data rates may apply. Reply STOP to
      opt out. Reply HELP for help.{" "}
      <Link href="/privacy" className={linkClass}>
        Privacy Policy
      </Link>
      .
    </div>
  );
}

/**
 * Required checkbox when phone is optional or used for marketing opt-in.
 * Unchecked by default.
 */
export function SMSConsentCheckbox({
  checked,
  onChange,
  required = false,
  variant = "light",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  /** light = black text (for light bg). dark = white text (for dark bg) */
  variant?: "light" | "dark";
}) {
  const textClass = variant === "dark" ? "text-white" : "text-black";
  return (
    <label className={`flex items-start gap-2 mt-3 ${textClass} text-sm cursor-pointer`}>
      <input
        type="checkbox"
        required={required}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 accent-[#E6007E] rounded border-black"
      />
      <span>
        I agree to receive text messages from Hello Gorgeous Med Spa as
        described above.
      </span>
    </label>
  );
}
