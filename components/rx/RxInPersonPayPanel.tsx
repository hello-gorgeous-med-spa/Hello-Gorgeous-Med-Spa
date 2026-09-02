import { SITE } from "@/lib/seo";

type Props = {
  amountLabel?: string;
  kind?: "medication" | "consult";
};

export function RxInPersonPayPanel({ amountLabel, kind = "medication" }: Props) {
  const tel = SITE.phone.replace(/\D/g, "");
  return (
    <div className="mx-auto max-w-sm rounded-xl border-2 border-black bg-white px-4 py-4 text-left shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">Pay in person</p>
      {amountLabel ? (
        <p className="mt-1 text-2xl font-black text-black">{amountLabel}</p>
      ) : null}
      <p className="mt-2 text-sm font-medium text-black/80 leading-relaxed">
        {kind === "consult"
          ? "Square can no longer take this consult fee by text, email, or saved card. Pay on the Terminal at the spa — tap, dip, or swipe."
          : "Square can no longer take prescription payments by text, email, or saved card. Same price — pay on the Terminal at the spa (tap, dip, or swipe)."}
      </p>
      <p className="mt-2 text-xs text-black/60">
        Hello Gorgeous Med Spa · 74 W. Washington St, Oswego ·{" "}
        <a href={`tel:+1${tel}`} className="font-semibold text-[#E6007E] underline">
          ({SITE.phone})
        </a>
      </p>
    </div>
  );
}
