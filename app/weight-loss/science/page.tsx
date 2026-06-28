import { redirect } from "next/navigation";

import { GLP1_WEIGHT_LOSS_SCIENCE_PATH } from "@/lib/glp1-weight-loss-science";

/** Hers-style path parity: /weight-loss/science → HG science hub */
export default function WeightLossScienceRedirectPage() {
  redirect(GLP1_WEIGHT_LOSS_SCIENCE_PATH);
}
