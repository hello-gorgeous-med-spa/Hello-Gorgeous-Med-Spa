import Image from "next/image";

/** Branded peptide card art — full 16:9 frame, no zoom crop. */
export function PeptidePickerThumbnail({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: `/${string}`;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-video overflow-hidden border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] via-white to-[#FFF0F7] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-contain object-center"
        sizes="(max-width: 640px) 50vw, 33vw"
      />
    </div>
  );
}
