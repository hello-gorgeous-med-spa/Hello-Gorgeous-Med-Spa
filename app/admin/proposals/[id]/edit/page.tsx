"use client";

import { useParams } from "next/navigation";
import { ProposalBuilder } from "@/components/admin/ProposalBuilder";

export default function EditProposalPage() {
  const params = useParams<{ id: string }>();
  const proposalId = typeof params.id === "string" ? params.id : "";

  if (!proposalId) {
    return <div className="p-8 text-sm font-semibold text-red-600">Missing proposal id.</div>;
  }

  return <ProposalBuilder proposalId={proposalId} />;
}
