"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  orderRef: string;
};

/** Polls until Square payment settles, then reloads intake. */
export function PaymentPendingRefresh({ orderRef }: Props) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const tick = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    const poll = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/regen/order-status?ref=${encodeURIComponent(orderRef)}`);
        const data = await res.json().catch(() => ({}));
        if (data?.order?.paid) {
          router.refresh();
        }
      } catch {
        /* keep polling */
      }
    }, 3000);

    return () => {
      window.clearInterval(tick);
      window.clearInterval(poll);
    };
  }, [orderRef, router]);

  return (
    <div className="text-center max-w-md">
      <h1 className="text-2xl font-bold mb-4">Confirming your payment…</h1>
      <p className="text-white/60 mb-4">
        Square sometimes takes a few seconds. We&apos;re checking order{" "}
        <span className="font-mono text-[#FF2D8E]">{orderRef}</span>
        {seconds > 0 ? ` (${seconds}s)` : ""}.
      </p>
      <p className="text-sm text-white/45 mb-6">
        This page refreshes automatically. You can also tap below.
      </p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-black text-white"
      >
        Check again
      </button>
    </div>
  );
}
