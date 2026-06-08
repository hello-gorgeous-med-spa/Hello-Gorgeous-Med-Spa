"use client";

import { useCallback, useEffect, useState } from "react";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "hg-app-install-dismissed";
const DISMISS_DAYS = 14;

export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function useClientManifest(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
    const originalHref = manifestLink?.href;

    if (manifestLink) {
      manifestLink.href = "/client-manifest.json";
    } else {
      manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      manifestLink.href = "/client-manifest.json";
      document.head.appendChild(manifestLink);
    }

    return () => {
      if (manifestLink && originalHref) {
        manifestLink.href = originalHref;
      }
    };
  }, [enabled]);
}

export function usePwaInstall(options?: {
  registerServiceWorker?: boolean;
  useClientManifest?: boolean;
}) {
  const registerServiceWorker = options?.registerServiceWorker ?? false;
  const useClientManifestFlag = options?.useClientManifest ?? false;

  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useClientManifest(useClientManifestFlag);

  useEffect(() => {
    if (isStandalonePwa()) {
      setInstalled(true);
    }
  }, []);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!registerServiceWorker || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/app-sw.js", { scope: "/" }).catch(() => {});
  }, [registerServiceWorker]);

  const promptInstall = useCallback(async () => {
    if (!deferred) return false;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    return outcome === "accepted";
  }, [deferred]);

  return {
    canInstall: !!deferred && !installed,
    installed,
    isIos: isIosDevice(),
    promptInstall,
  };
}

export function useInstallDismissal() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if (!raw) {
        setDismissed(false);
        return;
      }
      const parsed = JSON.parse(raw) as { until?: number };
      setDismissed(typeof parsed.until === "number" && Date.now() < parsed.until);
    } catch {
      setDismissed(false);
    }
  }, []);

  const dismiss = useCallback(() => {
    const until = Date.now() + DISMISS_DAYS * 86_400_000;
    localStorage.setItem(DISMISS_KEY, JSON.stringify({ until }));
    setDismissed(true);
  }, []);

  return { dismissed, dismiss };
}
