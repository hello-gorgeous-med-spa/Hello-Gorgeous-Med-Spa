"use client";

import Link from "next/link";

import { flowWaveIntakeUrl, isFlowWaveAppointment } from "@/lib/flowwave-focus";

type Props = {
  clientId: string;
  appointmentId: string;
  serviceName?: string | null;
  notes?: string | null;
  clientName?: string;
};

export function FlowWaveAppointmentBanner({
  clientId,
  appointmentId,
  serviceName,
  notes,
  clientName,
}: Props) {
  if (!isFlowWaveAppointment(serviceName, notes)) return null;

  const intakeUrl = flowWaveIntakeUrl({ clientId, appointmentId });

  return (
    <div className="rounded-2xl border-4 border-black bg-gradient-to-br from-[#D5E8F5] to-white p-4 shadow-[6px_6px_0_0_rgba(26,95,138,0.35)]">
      <p className="text-xs font-bold uppercase tracking-wider text-[#1A5F8A]">
        FlowWave FOCUS — shockwave therapy
      </p>
      <p className="font-black text-black mt-1">
        Shockwave session{clientName ? ` · ${clientName}` : ""}
      </p>
      <p className="text-sm text-black/70 mt-1">
        Complete intake screening, contraindication check, SOAP note, and session log — synced in
        the portal for Ryan and Danielle.
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        <Link
          href={intakeUrl}
          className="px-4 py-2 rounded-full bg-[#1A5F8A] text-white text-sm font-bold hover:bg-[#134d72]"
        >
          Open FlowWave intake
        </Link>
        <Link
          href={`/admin/clients/${clientId}?tab=flowwave`}
          className="px-4 py-2 rounded-full border-2 border-black text-sm font-bold hover:border-[#1A5F8A]"
        >
          Client FlowWave tab
        </Link>
      </div>
    </div>
  );
}
