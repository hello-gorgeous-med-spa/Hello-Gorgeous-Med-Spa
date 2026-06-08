"use client";

import { CLIENT_APP } from "@/lib/client-app";
import { getAppInstallUrl } from "@/lib/app-install-url";

type Props = {
  /** Larger QR for print / get-app page */
  size?: "sm" | "lg";
  className?: string;
};

export function AppGetQrCard({ size = "sm", className = "" }: Props) {
  const installUrl = getAppInstallUrl();
  const qrSrc = `/api/app/qr-code?target=app&utm_medium=${size === "lg" ? "get_app_page" : "app_home"}`;
  const dim = size === "lg" ? 220 : 120;

  return (
    <div
      className={`rounded-2xl p-4 backdrop-blur-sm ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(255,45,142,0.12), rgba(59,130,246,0.08))",
        border: "1px solid rgba(255,45,142,0.35)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 rounded-xl bg-white p-2"
          style={{ boxShadow: "0 4px 20px rgba(230,0,126,0.25)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrSrc}
            alt="Scan to open the Hello Gorgeous app"
            width={dim}
            height={dim}
            className="block"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#FFB8DC" }}>
            Scan to get the app
          </p>
          <p className="mt-1 text-sm font-bold text-white leading-snug">
            {CLIENT_APP.shortName} — in your pocket
          </p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Book · Vitamin Bar · Build Your IV Bag · deals · memberships · rewards. No App Store — add to home screen.
          </p>
          <a
            href={installUrl}
            className="mt-2 inline-block text-xs font-semibold"
            style={{ color: "#FF2D8E" }}
          >
            Or tap: hellogorgeousmedspa.com/app →
          </a>
        </div>
      </div>
    </div>
  );
}
