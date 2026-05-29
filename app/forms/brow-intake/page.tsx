import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Brow Consultation & Intake | Hello Gorgeous Med Spa",
  description:
    "Complete your brow PMU consultation intake — health history, technique preferences, shape selection, and consent. Oswego, IL.",
  robots: { index: false, follow: false },
};

/** Full-page wizard HTML — avoids iframe blocked by X-Frame-Options on production. */
const FORM_SRC = "/forms/brow-consultation-intake.html";

export default function BrowIntakePage() {
  redirect(FORM_SRC);
}
