import { RX_PUBLIC_DISCLAIMER_LONG, RX_PUBLIC_DISCLAIMER_SHORT } from "@/lib/rx-public-marketing";

type Props = {
  variant?: "banner" | "footnote";
  className?: string;
};

export function RxLegalDisclaimer({ variant = "banner", className = "" }: Props) {
  if (variant === "footnote") {
    return (
      <p className={`text-[11px] leading-relaxed text-black/55 ${className}`.trim()}>
        {RX_PUBLIC_DISCLAIMER_LONG}
      </p>
    );
  }

  return (
    <aside
      className={`border-b border-black/10 bg-[#FFF0F7] px-4 py-3 text-center text-[12px] font-medium leading-relaxed text-black/80 ${className}`.trim()}
      role="note"
    >
      {RX_PUBLIC_DISCLAIMER_SHORT}
    </aside>
  );
}
