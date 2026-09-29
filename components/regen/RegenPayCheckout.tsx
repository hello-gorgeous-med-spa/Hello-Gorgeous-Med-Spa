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

export type RegenPayBilling = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
};

function FieldRow({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-1 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-3">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-[#333] sm:text-right">
        {required ? <span className="text-[#b00020]">* </span> : null}
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}

const inputClass =
  "h-8 w-full border border-[#8a8a8a] bg-white px-2 text-sm text-[#111] outline-none focus:border-[#0D9488]";

export function RegenPayCheckout({
  orderNumber,
  amountUsd,
  label,
  accountId,
  iframeLib,
  billing,
}: {
  orderNumber: string;
  amountUsd: number;
  label: string;
  accountId: string;
  iframeLib: string;
  billing: RegenPayBilling;
}) {
  const frameRef = useRef<PaymentIFrameHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [firstName, setFirstName] = useState(billing.firstName);
  const [lastName, setLastName] = useState(billing.lastName);
  const [email, setEmail] = useState(billing.email || "");
  const [phone, setPhone] = useState(billing.phone || "");
  const [street, setStreet] = useState(billing.street || "");
  const [city, setCity] = useState(billing.city || "");
  const [state, setState] = useState(billing.state || "IL");
  const [zip, setZip] = useState(billing.zip || "");

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
    if (!firstName.trim() || !lastName.trim()) {
      setError("Enter first and last name as they appear for billing.");
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
            body: JSON.stringify({
              orderNumber,
              eToken,
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: email.trim() || undefined,
              phone: phone.trim() || undefined,
              street: street.trim() || undefined,
              city: city.trim() || undefined,
              state: state.trim() || undefined,
              zip: zip.trim() || undefined,
            }),
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
      <div className="border border-[#c8c8c8] bg-[#f7fbfa] px-4 py-5">
        <p className="text-sm font-semibold text-[#0D9488]">Payment received</p>
        <p className="mt-2 text-sm text-[#444]">
          Thank you. The clinic will send this to the pharmacy after they confirm the post. You do
          not need to do anything else right now.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Script src={iframeLib} strategy="afterInteractive" onLoad={boot} />
      <div className="space-y-3 border-b border-[#c8c8c8] pb-4">
        <FieldRow label="Payment type" required>
          <p className="text-sm text-[#222]">Card · Visa, Mastercard, American Express, Discover</p>
        </FieldRow>
        <FieldRow label="Transaction type" required>
          <input className={inputClass} value="SALE" readOnly />
        </FieldRow>
        <FieldRow label="Total" required>
          <input className={inputClass} value={amountUsd.toFixed(2)} readOnly />
        </FieldRow>
      </div>

      <div className="mt-4 space-y-3 border-b border-[#c8c8c8] pb-4">
        <FieldRow label="Card" required>
          <div id="regen_pay_iframe_host" className="min-h-[220px] bg-white text-[#111]" />
        </FieldRow>
      </div>

      <div className="mt-4 space-y-3 border-b border-[#c8c8c8] pb-4">
        <FieldRow label="First and last name" required>
          <div className="grid grid-cols-2 gap-2">
            <input
              className={inputClass}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
            <input
              className={inputClass}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </div>
        </FieldRow>
        <FieldRow label="Company">
          <input className={inputClass} value="Hello Gorgeous Med Spa · REGEN RX" readOnly />
        </FieldRow>
        <FieldRow label="Phone number" required>
          <input
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </FieldRow>
        <FieldRow label="Email address" required>
          <input
            className={inputClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </FieldRow>
        <FieldRow label="Send receipt">
          <p className="text-sm text-[#222]">Yes — emailed after the charge posts</p>
        </FieldRow>
      </div>

      <div className="mt-4 space-y-3 border-b border-[#c8c8c8] pb-4">
        <FieldRow label="Billing address">
          <input
            className={inputClass}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            autoComplete="street-address"
          />
        </FieldRow>
        <FieldRow label="City">
          <input
            className={inputClass}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="address-level2"
          />
        </FieldRow>
        <FieldRow label="State">
          <div className="grid grid-cols-[80px_1fr] gap-2">
            <input
              className={inputClass}
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
              autoComplete="address-level1"
            />
            <input
              className={inputClass}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP"
              autoComplete="postal-code"
            />
          </div>
        </FieldRow>
        <FieldRow label="Country">
          <input className={inputClass} value="US" readOnly />
        </FieldRow>
      </div>

      <div className="mt-4 space-y-3">
        <FieldRow label="Custom ID">
          <input className={inputClass} value={orderNumber} readOnly />
        </FieldRow>
        <FieldRow label="Description" required>
          <input className={inputClass} value={label} readOnly />
        </FieldRow>
      </div>

      {error ? <p className="mt-4 text-sm text-[#b00020]">{error}</p> : null}

      <button
        type="button"
        disabled={!ready || busy}
        onClick={() => void pay()}
        className="mt-6 h-10 w-full border border-[#111] bg-[#111] text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Processing…" : `Process payment $${amountUsd.toFixed(2)}`}
      </button>
    </div>
  );
}
