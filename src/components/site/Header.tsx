"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { WideContainer } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

const nav = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/about", label: "About", icon: "✨" },
  { href: "/services", label: "Services", icon: "💉" },
  { href: "/contact", label: "Contact", icon: "📍" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/90 backdrop-blur-xl">
      <WideContainer className="py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black text-sm font-bold">
              HG
            </span>
            <span className="text-lg font-semibold text-white hidden sm:block">
              {site.name}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

              return (
                <div key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={
                      isActive
                        ? "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-pink-400 bg-white/5"
                        : "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-white/70 hover:text-white hover:bg-white/5"
                    }
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              aria-label="Search"
              type="button"
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="18"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <div className="hidden md:flex items-center gap-2">
              <Link
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                href="/contact"
              >
                Contact
              </Link>
              <Button asChild shape="rounded" variant="gradient">
                <Link href="/book">Book Now</Link>
              </Button>
            </div>

            <button
              className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              type="button"
              aria-label="Open menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(true)}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </WideContainer>

      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl lg:hidden">
          <div className="border-b border-white/10">
            <WideContainer className="py-4 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black text-sm font-bold">
                  HG
                </span>
                <span className="text-lg font-semibold text-white">{site.name}</span>
              </Link>
              <button
                className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                type="button"
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </WideContainer>
          </div>

          <WideContainer className="py-10">
            <div className="grid gap-2">
              {nav.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={
                      isActive
                        ? "flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 text-pink-400 text-lg font-semibold"
                        : "flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-white/80 hover:text-white text-lg font-semibold transition"
                    }
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col gap-4">
              <Button asChild variant="gradient" shape="pill" className="w-full justify-center">
                <Link href="/book" onClick={() => setIsOpen(false)}>
                  Book Now
                </Link>
              </Button>
              <Button asChild variant="outline" shape="pill" className="w-full justify-center">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>
              </Button>
            </div>
          </WideContainer>
        </div>
      ) : null}
    </header>
  );
}

