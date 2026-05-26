import { POWDER_BROWS_BEFORE_AFTER } from "@/data/brow-microblading-care";

import { BrowBeforeAfterCard } from "./BrowBeforeAfterCard";

type Props = {
  className?: string;
  showCta?: boolean;
};

export function BrowPowderBeforeAfter({ className = "", showCta = true }: Props) {
  return (
    <BrowBeforeAfterCard
      data={POWDER_BROWS_BEFORE_AFTER}
      className={className}
      showCta={showCta}
    />
  );
}
