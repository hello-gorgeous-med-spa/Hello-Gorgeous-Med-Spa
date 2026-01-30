import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TelehealthContent } from "./TelehealthContent";

export const metadata: Metadata = pageMetadata({
  title: "Telehealth Virtual Visits",
  description:
    "Virtual telehealth appointments with Ryan Kent, FNP-BC at Hello Gorgeous Med Spa. Weight loss consultations, hormone therapy follow-ups, and more from home. HIPAA compliant video visits.",
  path: "/telehealth",
});

export default function TelehealthPage() {
  return <TelehealthContent />;
}
