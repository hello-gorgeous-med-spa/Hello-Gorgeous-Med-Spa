import Image from "next/image";

/** Crop branded education sheets to the vial + title hero (top of portrait art). */
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
        className="object-cover object-top scale-[1.28] origin-top"
        sizes="(max-width: 640px) 50vw, 33vw"
      />
    </div>
  );
}
