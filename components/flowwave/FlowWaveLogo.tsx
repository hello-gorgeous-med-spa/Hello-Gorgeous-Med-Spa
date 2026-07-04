import Link from "next/link";

import { FLOWWAVE_BRAND, FLOWWAVE_LOGO } from "@/lib/flowwave-brand";
import { FLOWWAVE_PATH } from "@/lib/flowwave-marketing";

type FlowWaveLogoProps = {
  href?: string;
  className?: string;
  /** Nav lockup height in Tailwind units — default h-7 */
  sizeClass?: string;
  onClick?: () => void;
};

/** Shockwave rings + split FLOW/WAVE wordmark — matches RE GEN nav energy on dark chrome. */
function FlowWaveMark({ sizeClass = "h-7 w-auto" }: { sizeClass?: string }) {
  const pink = FLOWWAVE_BRAND.pink;

  return (
    <svg
      viewBox={`0 0 ${FLOWWAVE_LOGO.width} ${FLOWWAVE_LOGO.height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={sizeClass}
      role="img"
      aria-label={FLOWWAVE_LOGO.navAlt}
    >
      <title>{FLOWWAVE_LOGO.navAlt}</title>

      {/* Shockwave icon — pulse rings + acoustic wave */}
      <g transform="translate(14,14)">
        <circle cx="0" cy="0" r="2.4" fill={pink} />
        <circle cx="0" cy="0" r="6.5" fill="none" stroke={pink} strokeWidth="1.6" opacity="0.85" />
        <circle cx="0" cy="0" r="10.5" fill="none" stroke={pink} strokeWidth="1.3" opacity="0.55" />
        <circle cx="0" cy="0" r="13.5" fill="none" stroke={pink} strokeWidth="1" opacity="0.32" />
        <path
          d="M-11 1 C-7 -5 -3 -5 0 1 C3 -5 7 -5 11 1"
          fill="none"
          stroke={pink}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Wordmark — white FLOW + pink WAVE (RE GEN split treatment) */}
      <text
        x="32"
        y="19.5"
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="15.5"
        fontWeight="800"
        letterSpacing="0.1em"
      >
        <tspan fill="#ffffff">FLOW</tspan>
        <tspan fill={pink}>WAVE</tspan>
      </text>
    </svg>
  );
}

/** Compact logo for site header nav. */
export function FlowWaveNavLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`} aria-hidden>
      <FlowWaveMark />
    </span>
  );
}

export function FlowWaveLogo({
  href = FLOWWAVE_PATH,
  className = "",
  sizeClass = "h-8 w-auto",
  onClick,
}: FlowWaveLogoProps) {
  const mark = <FlowWaveMark sizeClass={sizeClass} />;

  if (!href) {
    return (
      <span className={`inline-block ${className}`} aria-label={FLOWWAVE_LOGO.navAlt}>
        {mark}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-block transition-opacity hover:opacity-90 ${className}`}
      aria-label={`${FLOWWAVE_BRAND.name} ${FLOWWAVE_BRAND.descriptor} — Hello Gorgeous Med Spa`}
    >
      {mark}
    </Link>
  );
}
