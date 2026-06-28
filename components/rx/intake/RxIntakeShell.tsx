import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { SITE } from "@/lib/seo";

export const RX_INTAKE_BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  roseText: "#FFB8DC",
  dark: "#1a0812",
} as const;

export type RxIntakeNavLink = {
  href: string;
  label: string;
  highlight?: boolean;
  external?: boolean;
};

export function RxIntakeNav({ links }: { links: RxIntakeNavLink[] }) {
  return (
    <div className="border-b-2 border-black bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="font-serif text-lg font-semibold text-black hover:text-[#E6007E]">
          <span className="text-[#E6007E]">Hello Gorgeous</span>
          <span className="ml-2 font-sans text-sm font-medium text-black/70">RX™</span>
        </Link>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
          {links.map((link, i) => (
            <span key={link.href} className="inline-flex items-center gap-2">
              {i > 0 && <span className="text-black/30">|</span>}
              {link.external ? (
                <a
                  href={link.href}
                  className={
                    link.highlight
                      ? "font-semibold text-[#E6007E] hover:underline"
                      : "text-black/70 hover:text-[#E6007E]"
                  }
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className={
                    link.highlight
                      ? "font-semibold text-[#E6007E] hover:underline"
                      : "text-black/70 hover:text-[#E6007E]"
                  }
                >
                  {link.label}
                </Link>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export type RxIntakeHeroProps = {
  pill: string;
  locality?: string;
  title: string;
  titleAccent: string;
  body: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
};

export function RxIntakeHero({ pill, locality, title, titleAccent, body, imageSrc, imageAlt }: RxIntakeHeroProps) {
  return (
    <section className="relative overflow-hidden border-b-4 border-black bg-[#1a0812]">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 15% 40%, rgba(230,0,126,0.45), transparent 60%), radial-gradient(ellipse 50% 60% at 90% 80%, rgba(255,45,142,0.3), transparent 55%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div
          className={`grid items-center gap-10 ${imageSrc ? "lg:grid-cols-[1.05fr_0.95fr] lg:gap-12" : ""}`}
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
              {pill}
            </span>
            {locality && (
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">{locality}</p>
            )}
            <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-5xl">
              <span className="text-white">{title} </span>
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {titleAccent}
              </span>
            </h1>
            <div className="mt-4 max-w-xl text-base font-medium leading-relaxed text-[#FFB8DC]/95 md:text-lg">
              {body}
            </div>
          </div>
          {imageSrc && imageAlt && (
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.45)]">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={1024}
                  height={682}
                  priority
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 90vw, 480px"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function RxIntakeTrustStrip() {
  return (
    <div className="rounded-2xl border-2 border-black/10 bg-white/80 px-4 py-3 text-center text-xs text-black/60 backdrop-blur-sm">
      <p>
        <strong className="text-black">Ryan Kent, FNP-BC</strong> · Hello Gorgeous Med Spa · Oswego, IL
      </p>
      <p className="mt-1">
        Secure intake · HIPAA-aware · Questions?{" "}
        <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="font-semibold text-[#E6007E]">
          {SITE.phone}
        </a>
      </p>
    </div>
  );
}

export function RxIntakeLegalFooter() {
  return (
    <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-black/50">
      By continuing you agree we may contact you at the information you provide. See our{" "}
      <Link href="/privacy" className="text-[#E6007E] underline">
        Privacy Policy
      </Link>
      .
    </p>
  );
}

export function RxIntakeShell({
  navLinks,
  hero,
  children,
  maxWidthClass = "max-w-5xl",
}: {
  navLinks: RxIntakeNavLink[];
  hero: RxIntakeHeroProps;
  children: ReactNode;
  maxWidthClass?: string;
}) {
  return (
    <main className="relative min-h-screen text-black">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% -5%, rgba(230,0,126,0.12) 0%, transparent 55%),
            linear-gradient(180deg, #FFF0F7 0%, #ffffff 30%, #fafafa 100%)
          `,
        }}
        aria-hidden
      />
      <RxIntakeNav links={navLinks} />
      <RxIntakeHero {...hero} />
      <div className={`mx-auto ${maxWidthClass} space-y-8 px-4 py-10 md:py-14`}>{children}</div>
    </main>
  );
}
