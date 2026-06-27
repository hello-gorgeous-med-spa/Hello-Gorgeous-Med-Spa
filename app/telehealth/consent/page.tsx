import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TelehealthConsentForm } from "./TelehealthConsentForm";

export const metadata: Metadata = pageMetadata({
  title: "Telehealth Consent & Authorization",
  description:
    "Authorization to Use & Disclose Medical Information, Consent to Telehealth, and Open Payments Notice for Hello Gorgeous Med Spa patients.",
  path: "/telehealth/consent",
});

export default function TelehealthConsentPage() {
  return <TelehealthConsentForm />;
}
