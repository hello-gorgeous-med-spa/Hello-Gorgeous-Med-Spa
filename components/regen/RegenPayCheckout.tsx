"use client";

import Script from "next/script";
import { useCallback, useRef, useState } from "react";

type EncryptResult = { eToken?: string; etoken?: string; id?: string };

type PaymentIFrameHandle = {
  encrypt: (opts: {
    success?: (res: EncryptResult) => void;
    failure?: (err: { id?: string; message?: string }) => void;
    invalidInput?: (data: { invalidInputs?: Array<{ message?: string }> }) => void;
  }) => void;
};

declare global {
  interface Window {
    PaymentiFrame?: new (opts: Record<string, unknown>) => PaymentIFrameHandle;
  }
}

export function RegenPayCheckout({
  orderNumber,
  amountUsd,
  label,
  firstName,
  lastName,
  email,
  accountId,
  iframeLib,
}: {
  orderNumber: string;
  amountUsd: number;
  label: string;
  firstName: string;
  lastName: string;
  email?: string;
  accountId: string;
  iframeLib: string;
}) {
  const frameRef = useRef<PaymentIFrameHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const boot = useCallback(() => {
    if (!window.PaymentiFrame) {
      setError("Payment form did not load. Call (630) 636-6193.");
      return;
    }
    frameRef.current = new window.PaymentiFrame({
      create: true,
      iframeId: "regen_pay_iframe",
      settings: {
        account: accountId,
        parentId: "regen_pay_iframe_host",
        lang: "en",
        cvv: "required",
        expy: "single_input",
        layout: "1",
        show_placeholders: true,
        width: "100%",
        height: "220px",
        showFrame: false,
      },
    });
    setReady(true);
  }, [accountId]);

  async function pay() {
    if (!frameRef.current) {
      setError("Payment form is still loading.");
      return;
    }
    setBusy(true);
    setError("");
    frameRef.current.encrypt({
      failure: (err) => {
        setBusy(false);
        setError(err.message || "Could not read the card. Try again.");
      },
      invalidInput: (data) => {
        setBusy(false);
        setError(data.invalidInputs?.[0]?.message || "Check the card number, expiry, and CVV.");
      },
      success: async (res) => {
        const eToken = String(res.eToken || res.etoken || "").trim();
        if (!eToken) {
          setBusy(false);
          setError("Card was not tokenized. Try again.");
          return;
        }
        try {
          const response = await fetch("/api/regen/pay/charge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNumber, eToken }),
          });
          const json = (await response.json()) as { error?: string; transactionId?: string };
          if (!response.ok) {
            setError(json.error || "Payment did not go through.");
            setBusy(false);
            return;
          }
          setDone(true);
        } catch {
          setError("Could not reach the clinic. Call (630) 636-6193.");
        } finally {
          setBusy(false);
        }
      },
    });
  }

  if (done) {
    return (
      <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-6 text-left">
        <p className="text-sm font-semibold text-[#FFB8DC]">Payment received</p>
        <p className="mt-2 text-white/75">
          The clinic will send this to the pharmacy after they confirm the post. You do not need to
          do anything else right now.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 text-left">
      <Script src={iframeLib} strategy="afterInteractive" onLoad={boot} />
      <p className="text-sm text-white/60">
        {label} · {firstName} {lastName}
        {email ? ` · ${email}` : ""}
      </p>
      <p className="mt-1 text-2xl font-black">${amountUsd.toFixed(2)}</p>
      <div
        id="regen_pay_iframe_host"
        className="mt-5 min-h-[220px] rounded-2xl bg-white p-3 text-black"
      />
      {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
      <button
        type="button"
        disabled={!ready || busy}
        onClick={() => void pay()}
        className="mt-5 w-full rounded-full bg-[#E6007E] py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        {busy ? "Charging…" : `Pay $${amountUsd.toFixed(2)}`}
      </button>
      <p className="mt-3 text-xs text-white/45">
        Card is entered on Bluefin. Compounded medication is not FDA-approved. Illinois only.
      </p>
    </div>
  );
}
