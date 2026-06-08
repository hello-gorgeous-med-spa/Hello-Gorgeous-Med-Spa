"use client";

import { GetAppQrPromo } from "@/components/GetAppQrPromo";

type Props = {
  size?: "sm" | "lg";
  className?: string;
};

export function AppGetQrCard({ size = "sm", className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl p-4 backdrop-blur-sm ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(255,45,142,0.12), rgba(59,130,246,0.08))",
        border: "1px solid rgba(255,45,142,0.35)",
      }}
    >
      <GetAppQrPromo
        qrSize={size === "lg" ? 220 : 120}
        utmMedium={size === "lg" ? "get_app_page" : "app_home"}
        theme="dark"
        layout="row"
      />
    </div>
  );
}
