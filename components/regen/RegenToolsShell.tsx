"use client";

import type { ReactNode } from "react";

import { RegenPublicNav } from "@/components/regen/RegenPublicNav";
import { TOOLS_BRAND } from "@/lib/regen/tools-brand";

export function RegenToolsShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen"
      style={{
        background: "linear-gradient(165deg, #2d1020 0%, #0A0A0A 48%, #0c3d3a 100%)",
        color: TOOLS_BRAND.cream,
      }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 70% 50% at 12% 8%, rgba(233,30,140,0.38), transparent 55%)",
              "radial-gradient(ellipse 55% 45% at 92% 18%, rgba(13,148,136,0.34), transparent 52%)",
              "radial-gradient(ellipse 50% 40% at 50% 100%, rgba(255,45,142,0.2), transparent 55%)",
            ].join(","),
          }}
        />
      </div>
      <RegenPublicNav />
      {children}
    </div>
  );
}
