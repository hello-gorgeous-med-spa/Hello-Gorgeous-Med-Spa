import type { Metadata } from "next";
import CommandCenterClient from "@/components/admin/CommandCenterClient";

export const metadata: Metadata = {
  title: "Command Center | Hello Gorgeous",
  description: "Team Hub, practice overview, and marketing ops",
  robots: { index: false, follow: false },
};

export default function CommandCenterPage() {
  return <CommandCenterClient />;
}
