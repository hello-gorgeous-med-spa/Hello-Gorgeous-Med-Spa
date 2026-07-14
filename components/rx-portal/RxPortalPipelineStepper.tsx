"use client";

import {
  RX_PORTAL_PIPELINE_STEPS,
  formatRxPortalStatusTime,
  rxPortalPipelineIndex,
  rxPortalPipelineStepsReached,
  rxPortalSourceLabel,
  type RxPortalOrderSignals,
} from "@/lib/rx-portal/pipeline";

type Props = {
  signals: RxPortalOrderSignals;
  /** e.g. pharmacy_source for footnote */
  pharmacySource?: string | null;
  statusAt?: string | null;
  compact?: boolean;
};

export function RxPortalPipelineStepper({
  signals,
  pharmacySource,
  statusAt,
  compact = false,
}: Props) {
  const reached = rxPortalPipelineStepsReached(signals);
  const activeIdx = rxPortalPipelineIndex(signals);
  const stamp = statusAt ?? null;
  const timeLabel = formatRxPortalStatusTime(stamp);
  const source = rxPortalSourceLabel(pharmacySource);

  return (
    <div className={compact ? "min-w-[260px]" : "min-w-[300px]"}>
      <div className="flex items-start">
        {RX_PORTAL_PIPELINE_STEPS.map((label, i) => {
          const done = reached[i];
          const isLast = i === RX_PORTAL_PIPELINE_STEPS.length - 1;
          const connectorDone = Boolean(reached[i + 1]);

          return (
            <div key={label} className="flex min-w-0 flex-1 flex-col items-center">
              <div className="relative flex w-full items-center justify-center">
                {!isLast ? (
                  <span
                    aria-hidden
                    className={`absolute left-1/2 top-1/2 h-px w-full -translate-y-1/2 border-t ${
                      connectorDone ? "border-[#0B1F33]" : "border-dashed border-slate-300"
                    }`}
                  />
                ) : null}
                <span
                  className={`relative z-[1] flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-black ${
                    done
                      ? "border-[#0B1F33] bg-[#0B1F33] text-white"
                      : "border-slate-300 bg-white text-transparent"
                  }`}
                  title={label}
                >
                  {done ? "✓" : ""}
                </span>
              </div>
              <span
                className={`mt-1.5 text-center text-[8px] font-bold uppercase leading-tight tracking-wide ${
                  i === activeIdx
                    ? "text-[#0B1F33]"
                    : done
                      ? "text-slate-600"
                      : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] font-medium text-slate-500">
        {activeIdx >= 0 ? (
          <>
            [{activeIdx}] {source}
            {timeLabel ? ` · ${timeLabel}` : ""}
          </>
        ) : (
          "Pending payment"
        )}
      </p>
    </div>
  );
}
