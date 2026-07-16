import type { Metadata } from "next";

import FrontDeskPhoneAssistant from "@/components/staff/FrontDeskPhoneAssistant";

export const metadata: Metadata = {
  title: "Front Desk Assistant | Hello Gorgeous Staff",
  description: "Quick phone answers for menu, pricing, booking, and RE GEN — staff only.",
  robots: "noindex, nofollow",
};

export default function StaffAssistantPage() {
  return <FrontDeskPhoneAssistant />;
}
