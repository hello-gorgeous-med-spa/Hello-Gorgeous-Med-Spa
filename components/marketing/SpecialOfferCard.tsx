import Link from "next/link";

export type SpecialOfferCardProps = {
  title: string;
  accentLine: string;
  description: string;
  href: string;
  badge?: string;
  variant?: "light" | "dark";
};

export function SpecialOfferCard({
  title,
  accentLine,
  description,
  href,
  badge,
  variant = "light",
}: SpecialOfferCardProps) {
  const isDark = variant === "dark";

  return (
    <Link
      href={href}
      className={
        isDark
          ? "group flex h-full flex-col rounded-3xl border-4 border-black bg-[#151922] p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:border-[#E6007E]"
          : "group flex h-full flex-col rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:border-[#E6007E]"
      }
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3
          className={
            isDark
              ? "text-xl font-black text-white group-hover:text-[#FFB8DC] transition-colors"
              : "text-xl font-black text-black group-hover:text-[#E6007E] transition-colors"
          }
        >
          {title}
        </h3>
        {badge ? (
          <span className="rounded-full border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
            {badge}
          </span>
        ) : null}
      </div>
      <p className={`text-sm font-bold ${isDark ? "text-[#FFB8DC]" : "text-[#E6007E]"}`}>{accentLine}</p>
      <p className={`mt-3 flex-1 text-sm font-medium leading-relaxed ${isDark ? "text-white/70" : "text-black/70"}`}>
        {description}
      </p>
      <span className={`mt-5 text-sm font-bold group-hover:underline ${isDark ? "text-[#FF2D8E]" : "text-[#E6007E]"}`}>
        View details →
      </span>
    </Link>
  );
}
