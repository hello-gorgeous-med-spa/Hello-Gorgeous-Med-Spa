import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Meet the Experts",
  description: "Meet Danielle Alcala and Ryan Kent—licensed providers delivering concierge-level results.",
  path: "/meet-the-team",
});

export default function MeetTheTeamRedirect() {
  redirect("/providers");
}

