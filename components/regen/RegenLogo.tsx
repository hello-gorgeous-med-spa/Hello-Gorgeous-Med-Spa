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

/** Split RE/GEN wordmark — nav uses soft-pink GEN so both halves read on pill backgrounds. */
function RegenMark({
  sizeClass,
  width,
  variant = "default",
}: {
  sizeClass?: string;
  width?: number;
  variant?: "nav" | "default";
}) {
  const pink = REGEN_BRAND.pink;
  const genFill = variant === "nav" ? "#FFB8DC" : "#ffffff";
  const vb = variant === "nav" ? REGEN_LOGO.navCompactWidth : REGEN_LOGO.navWidth;
  const style = width
    ? { width, height: (width / vb) * REGEN_LOGO.navHeight }
    : undefined;

  return (
    <svg
      viewBox={`0 0 ${vb} ${REGEN_LOGO.navHeight}`}
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
        fontSize="16"
        fontWeight="800"
        letterSpacing="0.04em"
      >
        <tspan fill={pink}>RE</tspan>
        <tspan fill={genFill}>GEN</tspan>
      </text>
    </svg>
  );
}

/** Real brand logo — center crop of the DNA banner for header nav. */
export function RegenNavLogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-block h-8 w-[5.75rem] shrink-0 overflow-hidden rounded-md ${className}`}
      aria-hidden
    >
      <Image
        src={REGEN_LOGO.primary}
        alt=""
        width={REGEN_LOGO.width}
        height={REGEN_LOGO.height}
        priority
        className="absolute left-1/2 top-[38%] h-[4rem] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
      />
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
