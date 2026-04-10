import { redirect } from "next/navigation";
import { requireHubPageSession } from "@/lib/hub-server-auth";

/** Hub root always opens the classic Command Center (static HTML UI). */
export default async function HubPage() {
  await requireHubPageSession("/hub");
  redirect("/hub/classic");
}
