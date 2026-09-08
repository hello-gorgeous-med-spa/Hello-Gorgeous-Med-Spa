import type { CSSProperties } from "react";

import {
  REGEN_TELEHEALTH_BOOKING_URL,
  REGEN_TELEHEALTH_CTA,
} from "@/lib/regen/telehealth-consult";

const PINK = "#E91E8C";

type Props = {
  className?: string;
  label?: string;
  style?: CSSProperties;
};

/** Opens Ryan's Square Medical Visit calendar in a new tab. */
export function RegenTelehealthBookButton({ className, label, style }: Props) {
  return (
    <a
      href={REGEN_TELEHEALTH_BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {label ?? REGEN_TELEHEALTH_CTA}
    </a>
  );
}

export const regenTelehealthButtonStyle: CSSProperties = {
  display: "inline-block",
  padding: "14px 32px",
  background: `linear-gradient(135deg, ${PINK} 0%, #c4157a 100%)`,
  color: "#fff",
  fontSize: 16,
  fontWeight: 700,
  borderRadius: 12,
  textDecoration: "none",
};
