import { NextRequest } from "next/server";
import QRCode from "qrcode";
import { kioskRequestPageUrl, parseKioskRequestIds } from "@/lib/regen/kiosk-request";

export async function GET(request: NextRequest) {
  const ids = parseKioskRequestIds(request.nextUrl.searchParams.get("items"));
  const url = kioskRequestPageUrl(ids);
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#1a1614", light: "#ffffff" },
  });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=120",
    },
  });
}
