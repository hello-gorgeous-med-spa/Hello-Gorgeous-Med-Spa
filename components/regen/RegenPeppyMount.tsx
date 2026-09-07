"use client";

import { usePathname } from "next/navigation";

import { PeppyChat } from "@/components/regen/PeppyChat";

export function RegenPeppyMount() {
  const pathname = usePathname() || "";
  if (pathname.includes("/ops") || pathname.includes("/affiliates")) return null;
  return <PeppyChat surface="client" />;
}
