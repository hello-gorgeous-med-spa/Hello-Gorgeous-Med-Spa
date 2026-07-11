import Link from "next/link";

export function JourneyEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#FF2D8E]">
      {children}
    </p>
  );
}

export function JourneyPinkBtn({
  href,
  children,
  className = "",
  external,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const cls = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#FF2D8E] px-7 py-3.5 text-base font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-white ${className}`;
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {children}
      </button>
    );
  }
  if (!href) return null;
  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("sms:")) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function JourneyGhostBtn({
  href,
  children,
  className = "",
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full border border-white/45 px-7 py-3.5 text-base font-bold text-white transition hover:-translate-y-0.5 hover:border-[#FF2D8E] hover:text-[#FF2D8E] ${className}`;
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {children}
      </button>
    );
  }
  if (!href) return null;
  const isExternal = href.startsWith("tel:") || href.startsWith("sms:") || href.startsWith("http");
  if (isExternal) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function JourneySectionHead({
  eyebrow,
  title,
  titleAccent,
  description,
  center,
  light,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}) {
  const titleCls = light ? "text-black" : "text-white";
  const descCls = light ? "text-black/70" : "text-white/70";
  return (
    <div className={`max-w-[720px] ${center ? "mx-auto text-center" : ""}`}>
      <JourneyEyebrow>{eyebrow}</JourneyEyebrow>
      <h2 className={`mt-3 font-serif text-[34px] font-bold leading-[1.05] lg:text-[46px] ${titleCls}`}>
        {title}
        {titleAccent ? (
          <>
            {" "}
            <span className="text-[#FF2D8E]">{titleAccent}</span>
          </>
        ) : null}
      </h2>
      {description ? <p className={`mt-4 text-lg leading-relaxed ${descCls}`}>{description}</p> : null}
    </div>
  );
}

export function JourneyCheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[15px] leading-snug text-white/85">
      <span className="shrink-0 font-black text-[#FF2D8E]">✓</span>
      <span>{children}</span>
    </li>
  );
}

export function JourneyTrustBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 bg-[#FF2D8E] px-6 py-4 text-center text-[15px] font-extrabold tracking-wide text-black">
      <span>★★★★★ 5.0 on Fresha · 1,931 reviews</span>
      <span className="hidden sm:inline">·</span>
      <span>#1 Best Med Spa in Oswego</span>
      <span className="hidden sm:inline">·</span>
      <span>Full-authority NP on site</span>
    </div>
  );
}

export function JourneyVideoFrame({
  src,
  label,
  poster,
  className = "",
}: {
  src: string;
  label: string;
  poster?: string;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)] ${className}`}
    >
      <div className="relative aspect-video w-full bg-black">
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          className="absolute inset-0 h-full w-full object-contain"
          aria-label={label}
        />
      </div>
    </div>
  );
}

export function JourneyChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold text-white">
      {children}
    </span>
  );
}

export function JourneyDarkCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export const JOURNEY_HERO_BG =
  "relative overflow-hidden bg-[radial-gradient(90%_70%_at_78%_25%,#2a0820_0%,#12030c_55%,#000_100%)]";

export const JOURNEY_SECTION_BG_A = "bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)]";
export const JOURNEY_SECTION_BG_B = "bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)]";
