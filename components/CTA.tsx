"use client";

import Link from "next/link";

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

type Variant = "gradient" | "outline" | "white" | "ghost";

/* Premium Medical Glam — Button System */
const variants: Record<Variant, string> = {
  gradient:
    "bg-hg-pink hover:bg-hg-pinkDeep text-white uppercase tracking-widest px-10 py-4 rounded-md text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg",
  outline:
    "border border-hg-pink text-hg-pink uppercase tracking-widest px-10 py-4 rounded-md text-sm font-semibold transition-all duration-300 ease-out hover:bg-hg-pink hover:text-white hover:-translate-y-[2px] hover:shadow-lg",
  white:
    "bg-white text-hg-dark hover:bg-white uppercase tracking-widest px-10 py-4 rounded-md text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg",
  ghost: "text-black hover:text-white hover:bg-white tracking-wide",
};

export function CTA({
  href,
  children,
  variant = "gradient",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const isExternal = /^https?:\/\//i.test(href);
  const ghost = variant === "ghost";
  const base = ghost
    ? "inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 w-full md:w-auto"
    : "inline-flex items-center justify-center gap-2 min-h-[48px] w-full md:w-auto";
  const classes = cx(base, variants[variant], className);

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
    >
      {children}
    </Link>
  );
}

