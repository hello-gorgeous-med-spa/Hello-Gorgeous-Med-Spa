import { COMBO_OMBRE_BROWS_BEFORE_AFTER } from "@/data/brow-pmu-seo";

import { BrowBeforeAfterCard } from "./BrowBeforeAfterCard";

type Props = { className?: string; showCta?: boolean };

export function BrowComboOmbreBeforeAfter({ className = "", showCta = true }: Props) {
  return (
    <BrowBeforeAfterCard
      data={COMBO_OMBRE_BROWS_BEFORE_AFTER}
      className={className}
      showCta={showCta}
      aspectClass="aspect-[4/5] sm:aspect-[5/4]"
    />
  );
}
