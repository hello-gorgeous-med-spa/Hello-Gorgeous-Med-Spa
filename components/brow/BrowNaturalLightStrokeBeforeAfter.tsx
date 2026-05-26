import { NATURAL_LIGHT_STROKE_BROWS_BEFORE_AFTER } from "@/data/brow-pmu-seo";

import { BrowBeforeAfterCard } from "./BrowBeforeAfterCard";

type Props = {
  className?: string;
  showCta?: boolean;
};

export function BrowNaturalLightStrokeBeforeAfter({ className = "", showCta = true }: Props) {
  return (
    <BrowBeforeAfterCard
      data={NATURAL_LIGHT_STROKE_BROWS_BEFORE_AFTER}
      className={className}
      showCta={showCta}
      aspectClass="aspect-[3/4] sm:aspect-[3/4]"
    />
  );
}
