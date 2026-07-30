"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { BUILD_YOUR_PROPOSAL_PATH } from "@/lib/build-your-proposal-marketing";

const STORAGE_KEY = "hg_build_proposal_scroll_cue_dismissed";
const SCROLL_Y_SHOW = 220;

/**
 * Quiet bottom cue on homepage after a little scroll — not a modal, not a badge cluster.
 * Click navigates to /build-your-proposal. Session-dismissible.
 */
export function BuildYourProposalScrollCue() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (pathname !== "/") {
      setShow(false);
      return;
    }
    try {
      setDismissed(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/" || dismissed) return;

    const onScroll = () => {
      setShow(window.scrollY >= SCROLL_Y_SHOW);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, dismissed]);

  if (pathname !== "/" || dismissed || !show) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
      <div className="pointer-events-auto flex max-w-md items-center gap-2 rounded-full border border-black/10 bg-white/95 px-3 py-2 shadow-[0_8px_28px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <Link
          href={BUILD_YOUR_PROPOSAL_PATH}
          className="min-w-0 flex-1 truncate px-2 text-left text-[13px] font-medium text-black/80 hover:text-[#E6007E]"
        >
          Build your treatment proposal{" "}
          <span className="text-[#E6007E]" aria-hidden>
            →
          </span>
        </Link>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            try {
              sessionStorage.setItem(STORAGE_KEY, "1");
            } catch {
              /* ignore */
            }
            setDismissed(true);
            setShow(false);
          }}
          className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-black/40 hover:text-black/70"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
