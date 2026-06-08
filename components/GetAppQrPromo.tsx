"use client";

import Link from "next/link";

import { CLIENT_APP } from "@/lib/client-app";
import { getAppInstallUrl } from "@/lib/app-install-url";

const APP_FEATURES = [
  "Book Botox, facials, Morpheus8 & more",
  "Build Your IV Bag from $89",
  "Vitamin Bar · deals · gift cards · rewards",
  "Add to home screen — no App Store",
] as const;

type Props = {
  qrSize?: number;
  /** utm_medium for QR scan tracking */
  utmMedium?: string;
  theme?: "light" | "dark";
  layout?: "row" | "stack";
  className?: string;
};

export function GetAppQrPromo({
  qrSize = 140,
  utmMedium = "website",
  theme = "light",
  layout = "row",
  className = "",
}: Props) {
  const installUrl = getAppInstallUrl({ utmMedium, utmCampaign: "get_app_qr" });
  const qrSrc = `/api/app/qr-code?target=app&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=get_app_qr`;
  const isDark = theme === "dark";
  const isStack = layout === "stack";

  return (
    <div
      className={`${isStack ? "flex flex-col items-center text-center" : "flex items-start gap-4 sm:gap-6"} ${className}`}
    >
      <div
        className={`shrink-0 rounded-2xl border-4 border-black bg-white p-2.5 shadow-[6px_6px_0_0_rgba(230,0,126,0.35)] ${
          isStack ? "mx-auto" : ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt="Scan QR code to open the Hello Gorgeous app"
          width={qrSize}
          height={qrSize}
          className="block"
        />
      </div>

      <div className={`min-w-0 ${isStack ? "mt-4 max-w-sm" : "flex-1"}`}>
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-[#FFB8DC]" : "text-[#E6007E]"}`}
        >
          Scan to get the app
        </p>
        <p className={`mt-1 text-lg sm:text-xl font-black leading-snug ${isDark ? "text-white" : "text-black"}`}>
          {CLIENT_APP.shortName} — in your pocket
        </p>
        <ul className={`mt-3 space-y-1.5 text-left text-xs sm:text-sm ${isDark ? "text-white/70" : "text-black/75"}`}>
          {APP_FEATURES.map((f) => (
            <li key={f} className="flex gap-2">
              <span className={`shrink-0 font-bold ${isDark ? "text-[#FF2D8E]" : "text-[#E6007E]"}`}>▸</span>
              {f}
            </li>
          ))}
        </ul>
        <div className={`mt-4 flex flex-wrap gap-2 ${isStack ? "justify-center" : ""}`}>
          <Link
            href={CLIENT_APP.path}
            className="inline-flex items-center rounded-full border-2 border-black px-4 py-2 text-xs font-bold text-white transition hover:brightness-110"
            style={{ background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 100%)" }}
          >
            Open app →
          </Link>
          <a
            href={installUrl}
            className={`inline-flex items-center rounded-full border-2 px-4 py-2 text-xs font-bold transition ${
              isDark
                ? "border-white/30 text-white hover:border-[#FFB8DC]"
                : "border-black bg-white text-black hover:border-[#E6007E] hover:text-[#E6007E]"
            }`}
          >
            hellogorgeousmedspa.com/app
          </a>
        </div>
      </div>
    </div>
  );
}
