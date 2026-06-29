"use client";

import Link from "next/link";

import {
  LABS_HUB_SUBNAV,
  MEDICAL_HUB_PRIMARY,
  type LabsHubSubnavItem,
  type MedicalHubNavItem,
} from "@/lib/medical-hub-nav";

function NavArrow() {
  return (
    <span className="text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-neutral-700" aria-hidden>
      →
    </span>
  );
}

function PrimaryNavCard({ item }: { item: MedicalHubNavItem }) {
  const className =
    "group flex h-full flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm";

  const inner = (
    <>
      <div>
        <p className="text-[15px] font-semibold text-neutral-900">{item.label}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{item.description}</p>
      </div>
      <p className="mt-4 text-sm font-medium text-neutral-700">
        Get started <NavArrow />
      </p>
    </>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {inner}
    </Link>
  );
}

export function MedicalHubNavGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {MEDICAL_HUB_PRIMARY.map((item) => (
        <PrimaryNavCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function LabsHubSubnav({
  items = LABS_HUB_SUBNAV,
  className = "",
}: {
  items?: LabsHubSubnavItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Labs page sections"
      className={`sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-md ${className}`}
    >
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
