import { redirect } from "next/navigation";

import { GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";

export const revalidate = 3600;

export default function MensHormonesPage() {
  redirect(`${GENTLEMENS_CLUB_PATH}#hormones`);
}
