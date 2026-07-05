import Image from "next/image";
import Link from "next/link";

import { REGEN_BRAND, REGEN_LOGO } from "@/lib/regen-brand";

type RegenLogoProps = {
  href?: string;
  className?: string;
  /** Nav lockup height — default h-7 */
  sizeClass?: string;
  width?: number;
  priority?: boolean;
  onClick?: () => void;
};

/** Split RE/GEN wordmark — pink RE + silver GEN, matches Jul 2026 brand lockup on dark nav. */
function RegenMark({
  sizeClass,
  width,
}: {
  sizeClass?: string;
  width?: number;
}) {
  const pink = REGEN_BRAND.pink;
  const style = width
    ? { width, height: (width / REGEN_LOGO.navWidth) * REGEN_LOGO.navHeight }
    : undefined;

  return (
    <svg
      viewBox={`0 0 ${REGEN_LOGO.navWidth} ${REGEN_LOGO.navHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={sizeClass ?? (width ? undefined : "h-8 w-auto")}
      style={style}
      role="img"
      aria-label={REGEN_LOGO.navAlt}
    >
      <title>{REGEN_LOGO.navAlt}</title>
      <text
        x="0"
        y="20"
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="17"
        fontWeight="800"
        letterSpacing="0.08em"
      >
        <tspan fill={pink}>RE</tspan>
        <tspan fill="#ffffff"> GEN</tspan>
      </text>
    </svg>
  );
}

/** Compact logo for site header nav. */
export function RegenNavLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`} aria-hidden>
      <RegenMark sizeClass="h-7 w-auto" />
    </span>
  );
}

export function RegenLogo({
  href = "/rx",
  className = "",
  sizeClass,
  width = 180,
  priority: _priority = false,
  onClick,
}: RegenLogoProps) {
  const mark = <RegenMark sizeClass={sizeClass} width={sizeClass ? undefined : width} />;

  if (!href) {
    return (
      <span className={`inline-block ${className}`} aria-label={REGEN_BRAND.fullName}>
        {mark}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-block transition-opacity hover:opacity-90 ${className}`}
      aria-label={`${REGEN_BRAND.fullName} — prescription care home`}
    >
      {mark}
    </Link>
  );
}

/** Full banner lockup for hero/marketing (PNG with DNA helix art). */
export function RegenBannerLogo({
  href = "/rx",
  className = "",
  width = 280,
  priority = false,
  onClick,
}: RegenLogoProps) {
  const height = Math.round((width / REGEN_LOGO.width) * REGEN_LOGO.height);

  const image = (
    <Image
      src={REGEN_LOGO.primary}
      alt={REGEN_LOGO.alt}
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-auto max-w-full ${className}`}
      style={{ width, height: "auto" }}
    />
  );

  if (!href) {
    return (
      <span className="inline-block" aria-label={REGEN_BRAND.fullName}>
        {image}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-block transition-opacity hover:opacity-90"
      aria-label={`${REGEN_BRAND.fullName} — prescription care home`}
    >
      {image}
    </Link>
  );
}
