import {
  FORM_IMMEDIATE_TEXT_PHONE,
  FORM_IMMEDIATE_TEXT_SMS,
  FORM_STAFF_EMAIL,
} from "@/lib/form-contact";

type Variant = "light" | "dark" | "green";

const variantClass: Record<Variant, string> = {
  light: "text-black/80",
  dark: "text-white/85",
  green: "text-green-700",
};

const linkClass: Record<Variant, string> = {
  light: "font-semibold text-[#E6007E] underline decoration-[#E6007E]/40 underline-offset-2 hover:decoration-[#E6007E]",
  dark: "font-semibold text-[#FFB8DC] underline decoration-[#FFB8DC]/50 underline-offset-2 hover:decoration-[#FFB8DC]",
  green: "font-semibold text-green-800 underline underline-offset-2",
};

type Props = {
  variant?: Variant;
  className?: string;
  /** Extra line above the urgent-contact note (e.g. reference number). */
  lead?: string;
};

export function FormSuccessNotice({ variant = "light", className = "", lead }: Props) {
  const text = variantClass[variant];
  const link = linkClass[variant];

  return (
    <div className={className} role="status" aria-live="polite">
      {lead ? <p className={`text-sm font-medium ${text}`}>{lead}</p> : null}
      <p className={`text-sm font-medium ${text} ${lead ? "mt-2" : ""}`}>
        Thank you — we received your message. For immediate attention, text{" "}
        <a href={FORM_IMMEDIATE_TEXT_SMS} className={link}>
          {FORM_IMMEDIATE_TEXT_PHONE}
        </a>
        . We also monitor{" "}
        <a href={`mailto:${FORM_STAFF_EMAIL}`} className={link}>
          {FORM_STAFF_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
