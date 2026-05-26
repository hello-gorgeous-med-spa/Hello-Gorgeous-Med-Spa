import { HG_TAGLINE } from "@/lib/brand-tagline";

type Props = {
  className?: string;
  /** compact = single line for tight spaces */
  variant?: "default" | "compact";
};

export function BrandTaglineStrip({ className = "", variant = "default" }: Props) {
  if (variant === "compact") {
    return (
      <p
        className={`text-[11px] sm:text-xs font-bold text-[#E6007E] tracking-wide text-center leading-snug ${className}`}
      >
        {HG_TAGLINE}
      </p>
    );
  }

  return (
    <div
      className={`w-full border-b-2 border-black bg-gradient-to-r from-[#FFF0F7] via-white to-[#FFF0F7] ${className}`}
      role="note"
      aria-label={HG_TAGLINE}
    >
      <div className="mx-auto max-w-7xl px-4 py-2.5 text-center">
        <p className="text-xs sm:text-sm font-bold text-[#8B4A4A] leading-snug max-w-4xl mx-auto">
          <span className="text-[#E6007E] mr-1" aria-hidden>
            ✦
          </span>
          {HG_TAGLINE}
          <span className="text-[#E6007E] ml-1" aria-hidden>
            ✦
          </span>
        </p>
      </div>
    </div>
  );
}
