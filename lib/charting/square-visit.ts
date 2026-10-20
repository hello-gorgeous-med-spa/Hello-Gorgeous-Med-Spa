export type ChartTemplateGuess = "soap" | "injection" | "iv" | "hormone" | "general";

export function guessChartTemplate(serviceName: string): ChartTemplateGuess {
  const s = serviceName.toLowerCase();
  if (
    /\b(iv|drip|vitamin|b12|b-?complex|biotin|glutathione|gsh|nad|tri-?immune|coq|myers|shot|im )\b/.test(
      s,
    )
  ) {
    return "iv";
  }
  if (
    /\b(botox|dysport|jeuveau|xeomin|filler|juvederm|restylane|rha|lip|tox|sculptra|radiesse|injectable)\b/.test(
      s,
    )
  ) {
    return "injection";
  }
  if (/\b(hormone|hrt|pellet|testosterone|estrogen|progesterone)\b/.test(s)) {
    return "hormone";
  }
  return "soap";
}

export function chicagoTimeLabel(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function squarePaymentLabel(visit: {
  has_payment_today?: boolean;
  likely_unpaid?: boolean;
  price_cents?: number;
}): string {
  if (visit.has_payment_today) return "Paid in Square today";
  if (visit.likely_unpaid) return "Likely unpaid";
  if ((visit.price_cents || 0) > 0) return "Not checked out yet";
  return "No Square price";
}

export function formatSquarePrice(cents?: number | null): string {
  if (!cents || cents <= 0) return "";
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
