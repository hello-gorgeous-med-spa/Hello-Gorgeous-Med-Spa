export type RxVendorBaaStatus = "pending" | "signed" | "expired" | "not_required";

export type RxVendorBaa = {
  id: string;
  vendorKey: string;
  vendorName: string;
  category: string;
  touchesPhi: boolean;
  status: RxVendorBaaStatus;
  signedAt: string | null;
  renewalDue: string | null;
  documentUrl: string | null;
  notes: string | null;
};

export type RxSecurityReviewStatus = "pending" | "in_progress" | "complete" | "remediated";

export type RxSecurityReview = {
  id: string;
  reviewKey: string;
  title: string;
  status: RxSecurityReviewStatus;
  completedAt: string | null;
  vendorName: string | null;
  criticalOpen: number;
  highOpen: number;
  reportUrl: string | null;
  notes: string | null;
};

export type RxLicensedState = {
  stateCode: string;
  licensed: boolean;
  providerName: string | null;
  licenseNumber: string | null;
  expiresAt: string | null;
  notes: string | null;
};

export type RxUatRole = "owner" | "provider" | "front_desk";

export type RxUatSignoff = {
  role: RxUatRole;
  signedByEmail: string;
  signedByName: string | null;
  signedAt: string;
  notes: string | null;
};

export type RxControlledSubstanceConfig = {
  deaVerified: boolean;
  pmpEnabled: boolean;
};

export type RxComplianceGate = {
  id: string;
  ticket: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  href?: string;
};

export type RxComplianceReport = {
  generatedAt: string;
  readyForGoLive: boolean;
  gates: RxComplianceGate[];
  vendorBaas: RxVendorBaa[];
  securityReviews: RxSecurityReview[];
  licensedStates: RxLicensedState[];
  uatSignoffs: RxUatSignoff[];
  controlledSubstances: RxControlledSubstanceConfig;
  infrastructure: import("@/lib/rx-e2e-checklist").RxE2eReport;
};
