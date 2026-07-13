type PeptideScienceVideoProps = {
  src: string;
  label?: string;
  caption?: string;
  className?: string;
};

export function PeptideScienceVideo({
  src,
  label = "Animated science visual",
  caption,
  className = "",
}: PeptideScienceVideoProps) {
  return (
    <figure
      className={`overflow-hidden rounded-3xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] ${className}`}
    >
      <div className="relative aspect-video w-full">
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/education/peptides-101-not-all-created-equal.webp"
          aria-label={label}
        >
          <source src={src} type="video/mp4" />
        </video>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"
          aria-hidden
        />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
            Hello Gorgeous · Wellness Science
          </p>
          {caption ? (
            <p className="mt-1 text-sm font-semibold text-white/95">{caption}</p>
          ) : null}
        </div>
      </div>
    </figure>
  );
}
