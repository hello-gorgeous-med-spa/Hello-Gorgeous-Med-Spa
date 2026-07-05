import Image from "next/image";
import Link from "next/link";

import { FLOWWAVE_BRAND, FLOWWAVE_LOGO } from "@/lib/flowwave-brand";
import { FLOWWAVE_PATH } from "@/lib/flowwave-marketing";

type FlowWaveLogoProps = {
  href?: string;
  className?: string;
  sizeClass?: string;
  width?: number;
  priority?: boolean;
  onClick?: () => void;
};

/** Real STEMWAVE banner — center crop for header nav. */
export function FlowWaveNavLogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-block h-8 w-[6.25rem] shrink-0 overflow-hidden rounded-md ${className}`}
      aria-hidden
    >
      <Image
        src={FLOWWAVE_LOGO.primary}
        alt=""
        width={FLOWWAVE_LOGO.width}
        height={FLOWWAVE_LOGO.height}
        priority
        className="absolute left-1/2 top-[48%] h-[2.75rem] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
      />
    </span>
  );
}

export function FlowWaveLogo({
  href = FLOWWAVE_PATH,
  className = "",
  width = 320,
  priority = false,
  onClick,
}: FlowWaveLogoProps) {
  const height = Math.round((width / FLOWWAVE_LOGO.width) * FLOWWAVE_LOGO.height);

  const image = (
    <Image
      src={FLOWWAVE_LOGO.primary}
      alt={FLOWWAVE_LOGO.navAlt}
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-auto max-w-full ${className}`}
      style={{ width, height: "auto" }}
    />
  );

  if (!href) {
    return (
      <span className="inline-block" aria-label={FLOWWAVE_LOGO.navAlt}>
        {image}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-block transition-opacity hover:opacity-90 ${className}`}
      aria-label={`${FLOWWAVE_BRAND.stemwaveMark} ${FLOWWAVE_BRAND.descriptor} — Hello Gorgeous Med Spa`}
    >
      {image}
    </Link>
  );
}
