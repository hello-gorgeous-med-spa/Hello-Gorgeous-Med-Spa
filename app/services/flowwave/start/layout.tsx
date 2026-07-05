import type { Metadata } from "next";

import { FLOWWAVE_INTRO_SPECIAL, FLOWWAVE_START_PATH } from "@/lib/flowwave-marketing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `FlowWave Start — Shockwave Intro ${FLOWWAVE_INTRO_SPECIAL.priceLabel} | Hello Gorgeous Oswego`,
  description: `Book FlowWave FOCUS shockwave therapy at Hello Gorgeous Med Spa. Intro ${FLOWWAVE_INTRO_SPECIAL.priceLabel} first session, NP screening, Oswego IL.`,
  path: FLOWWAVE_START_PATH,
});

export default function FlowwaveStartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
