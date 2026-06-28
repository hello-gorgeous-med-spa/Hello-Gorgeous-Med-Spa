import { redirect } from "next/navigation";

import { GLP1_WEIGHT_LOSS_MEMBERSHIP_PATH } from "@/lib/glp1-weight-loss-membership";

/** Hers-style path parity: /weight-loss/membership */
export default function WeightLossMembershipRedirectPage() {
  redirect(GLP1_WEIGHT_LOSS_MEMBERSHIP_PATH);
}
