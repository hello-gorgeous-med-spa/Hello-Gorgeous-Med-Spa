import Link from "next/link";

import { HOMEPAGE_MEDICAL_ANCHOR } from "@/lib/homepage-buyer-paths";
import { CLIENT_APP } from "@/lib/client-app";
import { GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";
import { RX_ONLINE_GUIDE_PATH } from "@/lib/rx-online-guide";

import { HomepageMedicalStickyBar } from "./HomepageMedicalStickyBar";
import { HomepageShopRxFinder } from "./HomepageShopRxFinder";

const MORE_MEDICAL = [
  { href: RX_ONLINE_GUIDE_PATH, label: "Online refill guide" },
  { href: "/iv-therapy", label: "IV therapy" },
  { href: "/vitamin-bar", label: "Vitamin bar" },
  { href: GENTLEMENS_CLUB_PATH, label: "Men's TRT" },
  { href: "/rx", label: "Full RX catalog" },
  { href: "/medical", label: "Medical hub" },
  { href: `${CLIENT_APP.path}?rx=1`, label: "Hello Gorgeous app" },
] as const;

/** Product finder + footer links — below founder content; not between hero sections. */
export function HomepageMedicalLane() {
  return (
    <div id={HOMEPAGE_MEDICAL_ANCHOR} className="scroll-mt-20">
      <HomepageShopRxFinder />
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-6 pb-20 md:pb-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            Also explore
          </span>
          {MORE_MEDICAL.map((link, i) => (
            <span key={link.href} className="flex items-center gap-4">
              {i > 0 ? (
                <span className="hidden text-neutral-300 sm:inline" aria-hidden>
                  ·
                </span>
              ) : null}
              <Link
                href={link.href}
                className="font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>
      <HomepageMedicalStickyBar sectionId={HOMEPAGE_MEDICAL_ANCHOR} />
    </div>
  );
}
