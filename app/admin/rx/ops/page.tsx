import type { Metadata } from "next";

import { RxOpsConsole } from "@/components/rx-ops/RxOpsConsole";

export const metadata: Metadata = {
  title: "RX Ops Console | Hello Gorgeous RX",
  description:
    "Unified prescription operations — requests, formulary, refills, payments, and clinical review for RE GEN.",
  robots: { index: false, follow: false },
};

export default function RxOpsConsolePage() {
  return <RxOpsConsole />;
}
