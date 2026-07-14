"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import {
  portalHomeForSkin,
  type RxPortalRoleSkin,
} from "@/lib/rx-portal/nav";

const SKINS: { id: RxPortalRoleSkin; label: string; blurb: string }[] = [
  {
    id: "provider",
    label: "Provider",
    blurb: "Order history, patients, clinical review & tracking",
  },
  {
    id: "staff",
    label: "Staff",
    blurb: "Place patient orders, invoices, front-desk workflows",
  },
  {
    id: "admin",
    label: "Admin",
    blurb: "Spend reports, pricing, full clinic oversight",
  },
];

function RxPortalLoginInner() {
  const searchParams = useSearchParams();
  const returnToParam = searchParams.get("returnTo");
  const [skin, setSkin] = useState<RxPortalRoleSkin>("provider");

  const home = useMemo(() => portalHomeForSkin(skin), [skin]);
  const returnTo = returnToParam && returnToParam.startsWith("/rx-portal") ? returnToParam : home;

  const loginHref = `/login?staff=1&returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <div className="min-h-screen bg-[#0B1F33] text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <p className="text-center text-[11px] font-bold tracking-[0.25em] uppercase text-teal-300/90">
          Hello Gorgeous RX
        </p>
        <h1 className="mt-2 text-center text-3xl font-black">
          Provider <span className="text-teal-300">Portal</span>
        </h1>
        <p className="mt-2 text-center text-sm text-white/55">
          Use Google Chrome · 256-bit encrypted · HIPAA-ready architecture
        </p>

        <div className="mt-8 flex rounded-xl bg-white/5 p-1 border border-white/10">
          {SKINS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSkin(s.id)}
              className={`flex-1 rounded-lg px-2 py-2.5 text-sm font-bold transition ${
                skin === s.id ? "bg-teal-500 text-[#0B1F33]" : "text-white/70 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-sm text-white/80">
            {SKINS.find((s) => s.id === skin)?.blurb}
          </p>
          <p className="mt-2 text-[11px] text-white/40">
            Same Hello Gorgeous staff login — role skins change your home tabs & shortcuts.
          </p>
        </div>

        <Link
          href={loginHref}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-teal-500 py-3.5 text-sm font-black text-[#0B1F33] hover:bg-teal-400"
        >
          Continue as {SKINS.find((s) => s.id === skin)?.label}
        </Link>

        <p className="mt-6 text-center text-xs text-white/35">
          Already signed in?{" "}
          <Link href={home} className="text-teal-300 hover:underline">
            Go to portal
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RxPortalLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B1F33] flex items-center justify-center text-white/50">
          Loading…
        </div>
      }
    >
      <RxPortalLoginInner />
    </Suspense>
  );
}
