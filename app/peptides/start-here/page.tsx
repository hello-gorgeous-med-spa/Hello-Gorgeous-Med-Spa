import { redirect } from "next/navigation";

import { HELLO_GORGEOUS_RX_START_PATH } from "@/lib/flows";

/** Friendly alias — `/peptides/start-here` → canonical Start Here funnel. */
export default function PeptidesStartHereRedirect() {
  redirect(HELLO_GORGEOUS_RX_START_PATH);
}
