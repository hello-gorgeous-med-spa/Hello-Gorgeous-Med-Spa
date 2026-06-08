"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CLIENT_APP } from "@/lib/client-app";
import { useInstallDismissal, usePwaInstall } from "@/lib/hooks/use-pwa-install";
import { trifectaAccent, trifectaButtonGradient } from "@/lib/trifecta-tokens";

export function InstallAppPrompt() {
  const { canInstall, installed, isIos, promptInstall } = usePwaInstall({
    registerServiceWorker: true,
    useClientManifest: true,
  });
  const { dismissed, dismiss } = useInstallDismissal();
  const [showInstructions, setShowInstructions] = useState(false);
  const [busy, setBusy] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const visible = !installed && !dismissed && (canInstall || isIos || isMobile);

  if (!visible) return null;

  async function handleInstall() {
    if (canInstall) {
      setBusy(true);
      try {
        const accepted = await promptInstall();
        if (accepted) dismiss();
      } finally {
        setBusy(false);
      }
      return;
    }

    if (isIos) {
      setShowInstructions(true);
      return;
    }

    window.location.href = CLIENT_APP.path;
  }

  return (
    <>
      <div
        className="fixed z-[45] max-w-sm max-md:bottom-20 max-md:left-3 max-md:right-3 md:bottom-6 md:right-6"
        role="region"
        aria-label="Install Hello Gorgeous app"
      >
        <div
          className="rounded-2xl p-4 shadow-2xl backdrop-blur-md"
          style={{
            backgroundColor: "rgba(10, 10, 10, 0.92)",
            border: `1px solid ${trifectaAccent(0).border}`,
            boxShadow: `0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
              style={{
                background: trifectaButtonGradient(trifectaAccent(0)),
                border: "1px solid rgba(255,255,255,0.15)",
              }}
              aria-hidden="true"
            >
              📱
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: trifectaAccent(1).subtitle }}>
                Free client app
              </p>
              <p className="mt-0.5 text-sm font-bold leading-snug text-white">
                Add Hello Gorgeous to your home screen
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">
                Book, Vitamin Bar, check-in &amp; rewards — one tap away.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleInstall()}
                  disabled={busy}
                  className="rounded-xl px-3.5 py-2 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-60"
                  style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}
                >
                  {busy ? "Adding…" : canInstall ? "Add to Home Screen" : isIos ? "How to Add" : "Open App"}
                </button>
                <Link
                  href={CLIENT_APP.path}
                  className="rounded-xl border px-3.5 py-2 text-xs font-bold transition hover:bg-white/5"
                  style={{ borderColor: trifectaAccent(2).border, color: trifectaAccent(2).subtitle }}
                >
                  Preview →
                </Link>
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 rounded-lg p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
              aria-label="Dismiss install prompt"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {showInstructions ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 sm:items-center"
          onClick={() => setShowInstructions(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-ios-title"
        >
          <div
            className="w-full max-w-md rounded-2xl p-5 backdrop-blur-md sm:p-6"
            style={{
              backgroundColor: "rgba(16, 16, 20, 0.96)",
              border: `1px solid ${trifectaAccent(1).border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="install-ios-title" className="text-lg font-bold text-white">
              Add to Home Screen (iPhone/iPad)
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex gap-3">
                <span className="font-black" style={{ color: trifectaAccent(0).subtitle }}>1.</span>
                <span>
                  Open{" "}
                  <Link href={CLIENT_APP.path} className="font-semibold underline" style={{ color: trifectaAccent(0).subtitle }}>
                    {CLIENT_APP.path}
                  </Link>{" "}
                  in Safari.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-black" style={{ color: trifectaAccent(1).subtitle }}>2.</span>
                <span>
                  Tap the <strong className="text-white">Share</strong> button{" "}
                  <span aria-hidden="true">(□↑)</span> at the bottom of the screen.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-black" style={{ color: trifectaAccent(2).subtitle }}>3.</span>
                <span>
                  Scroll and tap <strong className="text-white">Add to Home Screen</strong>, then tap{" "}
                  <strong className="text-white">Add</strong>.
                </span>
              </li>
            </ol>
            <div className="mt-5 flex gap-2">
              <Link
                href={CLIENT_APP.path}
                className="flex-1 rounded-xl py-3 text-center text-sm font-bold text-white"
                style={{ background: trifectaButtonGradient(trifectaAccent(0)) }}
              >
                Open App
              </Link>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className="rounded-xl border px-4 py-3 text-sm font-bold text-white/70"
                style={{ borderColor: "rgba(255,255,255,0.15)" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
