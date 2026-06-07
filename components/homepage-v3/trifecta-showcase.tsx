"use client";

import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ShowcaseAccent = {
  border: string;
  subtitle: string;
  bullet: string;
  badgeBg: string;
  buttonFrom: string;
  buttonTo: string;
};

export const SHOWCASE_ACCENTS: ShowcaseAccent[] = [
  {
    border: "rgba(236, 72, 153, 0.3)",
    subtitle: "#f472b6",
    bullet: "#ec4899",
    badgeBg: "#ec4899",
    buttonFrom: "#ec4899",
    buttonTo: "#db2777",
  },
  {
    border: "rgba(59, 130, 246, 0.3)",
    subtitle: "#60a5fa",
    bullet: "#3b82f6",
    badgeBg: "#3b82f6",
    buttonFrom: "#3b82f6",
    buttonTo: "#6366f1",
  },
  {
    border: "rgba(245, 158, 11, 0.3)",
    subtitle: "#fbbf24",
    bullet: "#f59e0b",
    badgeBg: "linear-gradient(to right, #f59e0b, #f97316)",
    buttonFrom: "#f59e0b",
    buttonTo: "#f97316",
  },
];

const ShowcaseVisibilityContext = createContext(true);

export function useShowcaseVisible() {
  return useContext(ShowcaseVisibilityContext);
}

export function useShowcaseVisibility(threshold = 0.1) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { sectionRef, isVisible };
}

type ShowcaseSectionProps = {
  id?: string;
  pill: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function TrifectaShowcaseSection({
  id,
  pill,
  title,
  description,
  children,
  footer,
  className = "",
}: ShowcaseSectionProps) {
  const { sectionRef, isVisible } = useShowcaseVisibility();

  return (
    <section
      id={id}
      ref={sectionRef}
      style={{ backgroundColor: "#000000" }}
      className={`relative overflow-hidden py-20 md:py-28 ${className}`.trim()}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-96 w-96 rounded-full blur-[100px]"
          style={{ backgroundColor: "rgba(236, 72, 153, 0.1)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full blur-[100px]"
          style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(245, 158, 11, 0.05)" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div
          className={`mb-12 text-center transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#ffffff",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: "#ec4899" }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: "#ec4899" }}
              />
            </span>
            <span className="text-xs uppercase tracking-wider">{pill}</span>
          </div>

          <h2 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl" style={{ color: "#ffffff" }}>
            {title}
          </h2>

          <p className="mx-auto max-w-2xl text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
            {description}
          </p>
        </div>

        <ShowcaseVisibilityContext.Provider value={isVisible}>
          <div className={isVisible ? "" : "opacity-0"}>{children}</div>
        </ShowcaseVisibilityContext.Provider>

        {footer ? (
          <div
            className={`mt-16 text-center transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export type TrifectaStyleCardProps = {
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  href: string;
  image: string;
  imageAlt: string;
  badge?: string;
  imageContain?: boolean;
  accent: ShowcaseAccent;
  visible?: boolean;
  delayMs?: number;
};

export function TrifectaStyleCard({
  title,
  subtitle,
  description,
  bullets,
  href,
  image,
  imageAlt,
  badge,
  imageContain,
  accent,
  visible: visibleProp,
  delayMs = 0,
}: TrifectaStyleCardProps) {
  const visibleFromContext = useShowcaseVisible();
  const visible = visibleProp ?? visibleFromContext;
  const displayBullets = bullets.slice(0, 3);

  return (
    <div
      className={`group relative transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <div
        className="relative h-full overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
        style={{ backgroundColor: "rgba(24, 24, 27, 0.8)", border: `1px solid ${accent.border}` }}
      >
        <div className={`relative h-56 overflow-hidden ${imageContain ? "bg-zinc-900" : ""}`}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            className={`${imageContain ? "object-contain p-3" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(24, 24, 27, 1) 0%, rgba(24, 24, 27, 0.3) 50%, transparent 100%)",
            }}
          />
          {badge ? (
            <div className="absolute right-4 top-4 z-10">
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg"
                style={{
                  background: accent.badgeBg,
                  color: "#ffffff",
                }}
              >
                {badge}
              </span>
            </div>
          ) : null}
        </div>

        <div className="relative -mt-4 px-6 pb-6">
          <div className="mb-4">
            <h3 className="mb-1 text-2xl font-bold" style={{ color: "#ffffff" }}>
              {title}
            </h3>
            <p className="text-sm font-semibold" style={{ color: accent.subtitle }}>
              {subtitle}
            </p>
          </div>

          <p className="mb-5 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {description}
          </p>

          {displayBullets.length > 0 ? (
            <ul className="mb-6 space-y-2">
              {displayBullets.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent.bullet }} />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          <Link
            href={href}
            className="block w-full rounded-xl px-6 py-3 text-center font-semibold transition-all duration-300 hover:shadow-lg"
            style={{
              background: `linear-gradient(to right, ${accent.buttonFrom}, ${accent.buttonTo})`,
              color: "#ffffff",
            }}
          >
            <span className="flex items-center justify-center gap-2">
              Learn More
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
