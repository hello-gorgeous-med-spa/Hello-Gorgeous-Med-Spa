import Image from "next/image";
import Link from "next/link";

import { REGEN_BRAND, REGEN_LOGO } from "@/lib/regen-brand";

type RegenLogoProps = {
  href?: string;
  className?: string;
  /** Display width in px — height scales from logo aspect ratio */
  width?: number;
  priority?: boolean;
  onClick?: () => void;
};

export function RegenLogo({
  href = "/rx",
  className = "",
  width = 180,
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
