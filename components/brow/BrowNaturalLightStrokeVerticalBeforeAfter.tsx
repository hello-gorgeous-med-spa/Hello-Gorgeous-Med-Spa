import { NATURAL_LIGHT_STROKE_VERTICAL_BEFORE_AFTER } from "@/data/brow-pmu-seo";

import { BrowBeforeAfterCard } from "./BrowBeforeAfterCard";

type Props = {
  className?: string;
  showCta?: boolean;
};

export function BrowNaturalLightStrokeVerticalBeforeAfter({
  className = "",
  showCta = true,
}: Props) {
  return (
    <BrowBeforeAfterCard
      data={NATURAL_LIGHT_STROKE_VERTICAL_BEFORE_AFTER}
      className={className}
      showCta={showCta}
      aspectClass="aspect-[3/5] sm:aspect-[2/3]"
    />
  );
}
