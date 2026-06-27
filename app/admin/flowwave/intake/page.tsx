"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { FlowWaveIntakeWorkspace } from "@/components/admin/flowwave/FlowWaveIntakeWorkspace";

function IntakePageInner() {
  const searchParams = useSearchParams();
  return (
    <FlowWaveIntakeWorkspace
      prefillClientId={searchParams.get("client") || ""}
      prefillIntakeId={searchParams.get("intake") || ""}
      prefillAppointmentId={searchParams.get("appointment") || ""}
    />
  );
}

export default function FlowWaveIntakePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-black/50">Loading…</div>}>
      <IntakePageInner />
    </Suspense>
  );
}
