import type { Metadata } from "next";

import { Bpc157RefillScreening } from "@/components/regen/Bpc157RefillScreening";
import { BPC157_REFILL_PATH } from "@/lib/regen/bpc-157-refill-screening";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "BPC-157 Refill Screening | REGEN RX",
    description:
      "Existing REGEN RX patients: complete BPC-157 refill screening for provider review. Red-flag answers hold the refill. Not a prescription.",
    path: BPC157_REFILL_PATH,
  }),
  robots: { index: false, follow: false },
};

export default function Bpc157RefillPage() {
  return <Bpc157RefillScreening />;
}
