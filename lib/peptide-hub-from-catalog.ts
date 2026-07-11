/** Map RE GEN catalog products → /peptides/[slug] education pages. */

const DRUG_KEY_HUB: Record<string, string> = {
  tb500: "tb-500",
  bpc157: "bpc-157",
  ghkcu: "ghk-cu-injectable",
  "cjc-ipamorelin": "cjc-1295-ipamorelin",
  sermorelin: "sermorelin",
  tesamorelin: "tesamorelin",
  motsc: "mots-c",
  epithalon: "epithalon",
  pt141: "pt-141",
  nad: "nad-plus",
  glutathione: "glutathione",
  "semax-selank": "semax",
};

function hubFromProductName(name: string): string | undefined {
  const lower = name.toLowerCase();
  if (lower.includes("bpc") && lower.includes("ghk") && lower.includes("kpv") && lower.includes("tb")) {
    return "recovery-blend";
  }
  if (lower.includes("bpc") && lower.includes("kpv") && lower.includes("tb")) {
    return "heal-blend";
  }
  if (lower.includes("bpc") && lower.includes("tb")) {
    return "recovery-blend";
  }
  if (lower.includes("tesamorelin") && lower.includes("ipamorelin")) {
    return "tesamorelin";
  }
  if (lower.includes("cjc") && lower.includes("ipamorelin")) {
    return "cjc-1295-ipamorelin";
  }
  if (lower.includes("selank") && !lower.includes("semax")) {
    return "selank";
  }
  if (lower.includes("semax") && !lower.includes("selank")) {
    return "semax";
  }
  if (lower.includes("semax") && lower.includes("selank")) {
    return "semax";
  }
  return undefined;
}

export function peptideHubSlugFromCatalog(drugKey: string, productName?: string): string | undefined {
  const fromName = productName ? hubFromProductName(productName) : undefined;
  if (fromName) return fromName;
  return DRUG_KEY_HUB[drugKey];
}
