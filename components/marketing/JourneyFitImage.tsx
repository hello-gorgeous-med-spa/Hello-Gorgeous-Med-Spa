import Image from "next/image";

/**
 * Equal-height media cell for Journey grids — image always fits inside
 * the frame (no oversized native aspect blowouts).
 */
export function JourneyFitImage({
  src,
  alt,
  className = "",
  aspectClassName = "aspect-[4/3]",
  objectClassName = "object-contain",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  padded = true,
}: {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  objectClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Soft inset for contain-fit education art; off for cover crops. */
  padded?: boolean;
}) {
  const inset = padded && objectClassName.includes("contain") ? "p-2 sm:p-3" : "";
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/14 bg-[#050205] ${aspectClassName} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={`${objectClassName} ${inset}`.trim()}
        sizes={sizes}
      />
    </div>
  );
}
