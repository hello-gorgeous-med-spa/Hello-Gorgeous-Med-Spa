"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/ai-concierge/calls", label: "Calls" },
  { href: "/admin/ai-concierge/bookings", label: "Bookings" },
  { href: "/admin/ai-concierge/knowledge", label: "Knowledge" },
  { href: "/admin/ai-concierge/analytics", label: "Analytics" },
  { href: "/admin/ai-concierge/settings", label: "Settings" },
];

export default function AiConciergeLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto text-black">
      <div className="mb-4">
        <h1 className="text-xl font-bold">AI Concierge (Sarah)</h1>
        <p className="text-sm text-black/70 mt-1">Twilio voice, Claude, booking requests, staff SMS/email.</p>
        <nav className="flex flex-wrap gap-2 mt-4">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-sm border ${active ? "bg-[#E6007E] text-white border-transparent" : "border-black/15 hover:bg-black/5"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
