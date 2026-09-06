import type { Metadata } from "next";

import { RegenGorgeous20Kit } from "@/components/regen/RegenGorgeous20Kit";
import {
  GORGEOUS20_CODE,
  GORGEOUS20_PATH,
  GORGEOUS20_PERCENT,
} from "@/lib/regen-gorgeous20";

export const metadata: Metadata = {
  title: `${GORGEOUS20_CODE} — ${GORGEOUS20_PERCENT}% off your first REGEN RX order`,
  description:
    "Danielle and Ryan Kent, FNP-BC. First REGEN RX order 20% off with GORGEOUS20. Weight loss, hormones, vitamins, and stacks — Illinois patients, consult first.",
  alternates: { canonical: GORGEOUS20_PATH },
  openGraph: {
    title: `GORGEOUS20 — ${GORGEOUS20_PERCENT}% off first REGEN RX order`,
    description: "Same Danielle. Same Ryan. New prescription door. Illinois only.",
    images: ["/images/regen/marketing/dani-ryan-syringes-hero.png"],
  },
};

export default function Gorgeous20Page() {
  return <RegenGorgeous20Kit />;
}
