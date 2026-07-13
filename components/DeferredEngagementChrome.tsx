"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const InstallAppPrompt = dynamic(
  () => import("@/components/InstallAppPrompt").then((m) => m.InstallAppPrompt),
  { ssr: false }
);
const MascotChat = dynamic(
  () => import("@/components/MascotChat").then((m) => m.MascotChat),
  { ssr: false }
);
const VoiceConcierge = dynamic(
  () => import("@/components/VoiceConcierge").then((m) => m.VoiceConcierge),
  { ssr: false }
);

/**
 * Chat / PWA / voice widgets — load after idle so they don't compete with LCP.
 * Sitewide chat = MascotChat only (HelloGorgeousAssistant is a duplicate floater).
 */
export function DeferredEngagementChrome() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 4500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const t = window.setTimeout(enable, 2800);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <InstallAppPrompt />
      <MascotChat />
      <VoiceConcierge />
    </>
  );
}
