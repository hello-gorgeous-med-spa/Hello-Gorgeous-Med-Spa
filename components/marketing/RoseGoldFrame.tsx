export function RoseGoldFrame({
  children,
  caption,
  className = "",
}: {
  children: React.ReactNode;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`group ${className}`}>
      <div
        className="relative p-[6px] transition duration-500 group-hover:-translate-y-1"
        style={{
          background:
            "linear-gradient(145deg, #F8E6C9 0%, #E8B86D 12%, #C9A227 28%, #B76E79 50%, #E8C4B8 72%, #D4A574 88%, #F7E7CE 100%)",
          borderRadius: 24,
          boxShadow:
            "0 0 0 1px rgba(247,231,206,0.4), 0 18px 48px rgba(183,110,121,0.3), 0 0 36px rgba(201,162,39,0.14)",
        }}
      >
        <div
          className="p-[3px]"
          style={{
            background: "linear-gradient(180deg, #241018 0%, #0a0206 100%)",
            borderRadius: 19,
          }}
        >
          <div className="relative overflow-hidden rounded-[16px] bg-black">{children}</div>
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3.5 flex items-center justify-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#E8C4B8]">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#C9A227]/75" aria-hidden />
          {caption}
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#C9A227]/75" aria-hidden />
        </figcaption>
      ) : null}
    </figure>
  );
}
