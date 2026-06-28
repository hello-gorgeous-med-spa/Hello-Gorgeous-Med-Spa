import { redirect } from "next/navigation";

import { GENTLEMENS_CLUB_TESTOSTERONE_PATH } from "@/lib/gentlemens-club-testosterone";

export const revalidate = 3600;

export default function MensHormonesPage() {
  redirect(GENTLEMENS_CLUB_TESTOSTERONE_PATH);
}
