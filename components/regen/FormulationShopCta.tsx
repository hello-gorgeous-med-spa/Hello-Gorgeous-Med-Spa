import Link from "next/link";

import {
  formulationFromLabel,
  formulationShippingLabel,
  formulationShop,
  formulationStartHref,
  type FormulationShopId,
} from "@/lib/regen/formulation-client-pricing";
import {
  REGEN_TELEHEALTH_PATH,
  regenTelehealthPriceLabel,
} from "@/lib/regen/telehealth-consult";

export function FormulationShopCta({
  id,
  compact = false,
}: {
  id: FormulationShopId;
  compact?: boolean;
}) {
  const item = formulationShop(id);
  return (
    <div className={compact ? "mt-4 border-t border-[#E5E7EB] pt-4" : "mt-5 border-t border-[#E5E7EB] pt-4"}>
      <p className="text-xl font-bold text-[#E91E8C]">{formulationFromLabel(id)}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">
        {compact
          ? `${formulationShippingLabel()} · clinician decides`
          : `${item.pack} · ${formulationShippingLabel()} · a licensed Illinois clinician still decides. If they prescribe, you pay this invoice. If they don't, we refund.`}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={formulationStartHref(id)}
          className="rounded-full bg-[#E91E8C] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          {item.inOffice ? "Request for the studio →" : "Request this protocol →"}
        </Link>
        {compact ? null : (
          <Link
            href={REGEN_TELEHEALTH_PATH}
            className="rounded-full border-2 border-[#0D9488] px-4 py-2 text-sm font-bold text-[#0D9488] hover:bg-[#F0FDFA]"
          >
            Book a consult · {regenTelehealthPriceLabel()}
          </Link>
        )}
      </div>
    </div>
  );
}
