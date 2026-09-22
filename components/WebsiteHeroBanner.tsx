import Image from "next/image";
import Link from "next/link";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import {
  WEBSITE_HERO_HEIGHT,
  WEBSITE_HERO_IMAGE,
  WEBSITE_HERO_IMAGE_ALT,
  WEBSITE_HERO_WIDTH,
} from "@/lib/website-hero";

type Props = {
  /** Full-bleed public homepage vs compact client-app banner */
  variant?: "home" | "app";
  className?: string;
};

export default function WebsiteHeroBanner({ variant = "home", className = "" }: Props) {
  const isApp = variant === "app";

  return (
    <section
      className={`relative w-full overflow-hidden bg-white ${
        isApp ? "rounded-2xl md:rounded-3xl" : ""
      } ${className}`}
      style={
        isApp
          ? {
              height: "clamp(200px, 52vw, 300px)",
              border: "1px solid rgba(255,45,142,0.35)",
              boxShadow: "0 28px 90px rgba(0,0,0,0.55)",
            }
          : undefined
      }
      aria-label="Hello Gorgeous Medical Spa"
    >
      <h1 className="sr-only">Hello Gorgeous Medical Spa</h1>
      <div
        className={`relative mx-auto w-fit max-w-full ${isApp ? "h-full w-full" : ""}`}
      >
        <Image
          src={WEBSITE_HERO_IMAGE}
          alt={WEBSITE_HERO_IMAGE_ALT}
          width={WEBSITE_HERO_WIDTH}
          height={WEBSITE_HERO_HEIGHT}
          priority
          sizes="100vw"
          className={
            isApp
              ? "absolute inset-0 h-full w-full object-contain object-center"
              : "block h-auto w-auto max-w-full"
          }
          style={isApp ? undefined : { maxHeight: "calc(100dvh - 22rem)" }}
        />
        {/* Graphic already says “Book Your Glow” — this is the real booking hit target. */}
        <Link
          href={PRIMARY_BOOKING_CTA.href}
          className="absolute z-10 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF2D8E]/70"
          style={{
            left: "3.6%",
            bottom: "13.5%",
            width: "21%",
            height: "8.5%",
          }}
        >
          <span className="sr-only">Book your glow — {PRIMARY_BOOKING_CTA.label}</span>
        </Link>
      </div>
    </section>
  );
}
