"use client";

import Link from "next/link";

import {
  clinicSaleUrlForAppointment,
  isWeightLossRxAppointment,
} from "@/lib/rx-clinic-appointment";

type Props = {
  clientId: string;
  appointmentId: string;
  serviceName?: string | null;
  notes?: string | null;
  clientName?: string;
};

export function ClinicRxAppointmentBanner({
  clientId,
  appointmentId,
  serviceName,
  notes,
  clientName,
}: Props) {
  if (!isWeightLossRxAppointment(serviceName, notes)) return null;

  const saleUrl = clinicSaleUrlForAppointment({ clientId, appointmentId });
  const refillUrl = clinicSaleUrlForAppointment({ clientId, appointmentId, refill: true });

  return (
    <div className="rounded-2xl border-4 border-black bg-gradient-to-br from-rose-50 to-white p-4 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
      <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">
        Hello Gorgeous RX — in clinic
      </p>
      <p className="font-black text-black mt-1">
        Weight loss consult{clientName ? ` · ${clientName}` : ""}
      </p>
      <p className="text-sm text-black/70 mt-1">
        Charge meds at the desk, ship to their home — no clinic inventory. Pricing auto-calculates
        from your tier table.
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        <Link
          href={saleUrl}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white text-sm font-bold"
        >
          Start clinic RX sale
        </Link>
        <Link
          href={refillUrl}
          className="px-4 py-2 rounded-full border-2 border-black text-sm font-bold hover:border-[#E6007E]"
        >
          Refill same dose
        </Link>
        <Link
          href={`/admin/clients/${clientId}?tab=rx`}
          className="px-4 py-2 rounded-full border-2 border-black/20 text-sm font-bold text-black/70 hover:border-[#E6007E]"
        >
          Client RX tab
        </Link>
      </div>
    </div>
  );
}
