"use client";

import {
  RX_PORTAL_PIPELINE_STEPS,
  rxPortalPipelineStepsReached,
  type RxPortalOrderSignals,
} from "@/lib/rx-portal/pipeline";

export function RxPortalPipelineStepper({ signals }: { signals: RxPortalOrderSignals }) {
  const reached = rxPortalPipelineStepsReached(signals);
  const activeIdx = reached.lastIndexOf(true);

  return (
    <div className="min-w-[220px]">
      <div className="flex items-center gap-0.5">
        {RX_PORTAL_PIPELINE_STEPS.map((label, i) => {
          const done = reached[i];
          const isActive = i === activeIdx;
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-2 w-full rounded-sm ${
                  done ? (isActive ? "bg-teal-500" : "bg-teal-400/80") : "bg-slate-200"
                }`}
                title={label}
              />
              <span
                className={`text-[8px] font-semibold uppercase tracking-tight ${
                  done ? "text-teal-700" : "text-slate-400"
                }`}
              >
                {label.slice(0, 4)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-1 text-[10px] text-slate-500">
        {activeIdx >= 0 ? RX_PORTAL_PIPELINE_STEPS[activeIdx] : "Pending"}
      </p>
    </div>
  );
}
