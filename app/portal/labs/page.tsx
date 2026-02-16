'use client';

// ============================================================
// HORMONE LAB INSIGHT TOOL
// AI-powered educational insights for clients (Client Portal only)
// ============================================================

import { HormoneLabInsightTool } from '@/components/HormoneLabInsightTool';

export default function PortalLabsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#000000] mb-2">Hormone Lab Insights</h1>
        <p className="text-[#000000]/70">
          Upload your hormone labs for AI-powered educational insights to help you have a more informed conversation with your provider.
        </p>
      </div>
      <HormoneLabInsightTool />
    </div>
  );
}
