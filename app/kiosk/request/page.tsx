import type { Metadata } from "next";
import { Suspense } from "react";
import { KioskRequestForm } from "@/components/kiosk/KioskRequestForm";

export const metadata: Metadata = {
  title: "Peptide Bar request | Hello Gorgeous",
  robots: { index: false, follow: false },
};

export default function KioskRequestPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f4efe6]" />}>
      <KioskRequestForm />
    </Suspense>
  );
}
