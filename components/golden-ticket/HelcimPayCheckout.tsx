"use client";

import { useCallback, useEffect, useState } from "react";

const SCRIPT_ID = "helcim-pay-js";
const SCRIPT_SRC = "https://secure.helcim.app/helcim-pay/services/start.js";

declare global {
  interface Window {
    appendHelcimPayIframe?: (checkoutToken: string, allowExit?: boolean) => void;
    removeHelcimPayIframe?: () => void;
  }
}

function loadHelcimScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.appendHelcimPayIframe) return Promise.resolve();
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("HelcimPay script failed")), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("HelcimPay script failed"));
    document.body.appendChild(script);
  });
}

export function HelcimPayCheckout({
  checkoutToken,
  onPaid,
  onClosed,
}: {
  checkoutToken: string;
  onPaid?: () => void;
  onClosed?: () => void;
}) {
  const [error, setError] = useState("");

  const open = useCallback(async () => {
    setError("");
    try {
      await loadHelcimScript();
      if (!window.appendHelcimPayIframe) {
        setError("Helcim checkout could not load. Use the invoice link instead.");
        return;
      }
      window.appendHelcimPayIframe(checkoutToken, true);
    } catch {
      setError("Helcim checkout could not load. Use the invoice link instead.");
    }
  }, [checkoutToken]);

  useEffect(() => {
    const key = `helcim-pay-js-${checkoutToken}`;
    function onMessage(event: MessageEvent) {
      const data = event.data as { eventName?: string; eventStatus?: string } | undefined;
      if (!data || data.eventName !== key) return;
      if (data.eventStatus === "SUCCESS") onPaid?.();
      if (data.eventStatus === "ABORTED" || data.eventStatus === "HIDE") onClosed?.();
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [checkoutToken, onClosed, onPaid]);

  useEffect(() => {
    void open();
  }, [open]);

  if (!error) return null;
  return <p className="mt-3 text-sm text-white/70">{error}</p>;
}
