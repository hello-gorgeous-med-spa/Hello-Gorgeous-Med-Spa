import { requireHubPageSession } from "@/lib/hub-server-auth";
import HubPageClient from "../HubPageClient";

export default async function HubPage() {
  await requireHubPageSession("/hub");
  return <HubPageClient />;
}
