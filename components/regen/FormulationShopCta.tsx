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

export function FormulationShopCta({ id }: { id: FormulationShopId }) {
  const item = formulationShop(id);
  return (
    <div className="mt-5 border-t border-[#eee6d8] pt-4">
      <p className="text-2xl font-bold text-[#E91E8C]">{formulationFromLabel(id)}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#6b7a75]">
        {item.pack} · {formulationShippingLabel()} · a licensed Illinois clinician still
        decides. If they prescribe, you pay this invoice. If they don&apos;t, we refund.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={formulationStartHref(id)}
          className="rounded-full bg-[#E91E8C] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          {item.inOffice ? "Request for the studio →" : "Request this protocol →"}
        </Link>
        <Link
          href={REGEN_TELEHEALTH_PATH}
          className="rounded-full border border-[#13241f] px-4 py-2 text-sm font-bold text-[#13241f] hover:bg-white"
        >
          Book a consult · {regenTelehealthPriceLabel()}
        </Link>
      </div>
    </div>
  );
}
