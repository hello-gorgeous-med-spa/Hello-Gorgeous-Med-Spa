"use client";

import Link from "next/link";

import { RegenOrderTrackerCard } from "@/components/regen/RegenOrderTrackerCard";
import { RxTelehealthHandoff } from "@/components/rx/intake/RxTelehealthHandoff";
import { CLIENT_APP } from "@/lib/client-app";

type Props = {
  orderRef: string;
  telehealthRequired?: boolean;
};

export function RegenCheckoutCompleteClient({ orderRef, telehealthRequired = true }: Props) {
  return (
    <div className="mx-auto max-w-md text-left space-y-5">
      <RegenOrderTrackerCard orderRef={orderRef} variant="checkout" pollMs={15000} />

      {telehealthRequired ? (
        <>
          <RxTelehealthHandoff orderRef={orderRef} statusHref={`${CLIENT_APP.path}?tab=home`} />
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm text-white/70 leading-relaxed">
            <p className="font-semibold text-white">Book on Square — not Charm</p>
            <p className="mt-2">
              New RE GEN patients should book telehealth on <strong className="text-white">Square</strong>.
              Your confirmation includes the video visit details. You do <strong className="text-white">not</strong>{" "}
              need a Charm patient portal account for this visit.
            </p>
            <p className="mt-2 text-xs text-white/50">
              Charm is our clinical chart behind the scenes — Ryan documents your visit there after your call.
            </p>
          </div>
        </>
      ) : null}

      <Link
        href={`${CLIENT_APP.path}?tab=home`}
        className="block text-center text-sm font-semibold text-[#FF2D8E] underline"
      >
        Open Hello Gorgeous app to track this order →
      </Link>
    </div>
  );
}
