"use client";

import React from "react";

export type LeadGateSource = "face_blueprint" | "journey" | "hormone" | "lip_studio";

export interface LeadGateProps {
  source: LeadGateSource;
  featureName: string;
  onUnlock: () => void;
  children?: React.ReactNode;
  unlocked?: boolean;
  features?: string[];
  heroTitle?: string;
  heroSubtitle?: string;
}

/** Email wall overlay — disabled. The page content shows immediately. */
export function LeadGate({ children }: LeadGateProps) {
  return <>{children ?? null}</>;
}
