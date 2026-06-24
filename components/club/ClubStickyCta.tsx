"use client";

import Link from "next/link";

import type { ClubStickyCtaConfig } from "@/lib/club-start-here";
import { SITE } from "@/lib/seo";

const PINK = "#FF2D8E";
const SMS_HREF = `sms:${SITE.phone.replace(/\D/g, "")}`;

export function ClubStickyCta({ config }: { config: ClubStickyCtaConfig }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t-4 border-black bg-[#0a0a0a] p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(255,45,142,0.15)] md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-1.5">
        <Link
          href={config.screenerHref}
          className="flex min-h-[48px] items-center justify-center rounded-lg border-2 border-[#FF2D8E]/50 bg-[#FF2D8E]/10 px-1 text-[0.65rem] font-bold uppercase leading-tight tracking-tight text-[#FFB8DC]"
        >
          {config.screenerLabel}
        </Link>
        <Link
          href={config.bookHref}
          className="flex min-h-[48px] items-center justify-center rounded-lg py-2.5 text-[0.7rem] font-bold uppercase tracking-wide text-white"
          style={{ background: `linear-gradient(90deg, ${PINK}, #E6007E)` }}
        >
          {config.bookLabel}
        </Link>
        <a
          href={SMS_HREF}
          className="flex min-h-[48px] items-center justify-center rounded-lg border-2 border-white/30 text-[0.7rem] font-bold uppercase tracking-wide text-white/90"
        >
          {config.textLabel}
        </a>
      </div>
    </div>
  );
}
