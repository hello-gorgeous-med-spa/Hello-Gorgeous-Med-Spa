import { redirect } from "next/navigation";

/** Legacy URL — the full Hello Gorgeous app lives at /app */
export default function VitaminBarLegacyPage() {
  redirect("/app?tab=vitamin");
}
