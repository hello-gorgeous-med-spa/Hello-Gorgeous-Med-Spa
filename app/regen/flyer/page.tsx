import type { Metadata } from "next";
import QRCode from "qrcode";

import { RegenClientFlyer } from "@/components/regen/RegenClientFlyer";
import {
  REGEN_CLIENT_FLYER_PATH,
  REGEN_CLIENT_FLYER_START_URL,
} from "@/lib/regen-client-flyer";

export const metadata: Metadata = {
  title: "REGEN RX client flyer | Hello Gorgeous",
  description:
    "Print-ready REGEN RX handout for Hello Gorgeous clients — programs, bundles, and how to start.",
  robots: { index: false, follow: false },
  alternates: { canonical: REGEN_CLIENT_FLYER_PATH },
};

export default async function RegenClientFlyerPage() {
  const qrDataUrl = await QRCode.toDataURL(REGEN_CLIENT_FLYER_START_URL, {
    width: 512,
    margin: 1,
    color: { dark: "#0A0A0A", light: "#FFFFFF" },
  });

  return <RegenClientFlyer qrDataUrl={qrDataUrl} />;
}
