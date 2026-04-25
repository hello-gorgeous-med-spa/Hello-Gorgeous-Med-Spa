import { requireHubPageSession } from "@/lib/hub-server-auth";

export const dynamic = "force-dynamic";

export default async function HubProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireHubPageSession("/hub");
  return children;
}
