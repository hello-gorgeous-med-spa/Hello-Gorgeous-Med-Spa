export const REGEN_SQUARE_GLP1_GROUP = "REGEN GLP-1 online shop";
export const REGEN_SQUARE_GLP1_CAMPAIGN = "regen_square_glp1_invite";
export const REGEN_SQUARE_GLP1_SHOP_URL = "https://tryregenrx.com/start?goal=weight-loss";
export const REGEN_SQUARE_GLP1_INVITE_MAX = 25;
export const REGEN_SQUARE_GLP1_COOLDOWN_DAYS = 30;

export function squareGlp1InviteText(firstName: string) {
  const name = firstName.trim() || "there";
  return `Hi ${name}, Hello Gorgeous REGEN: order GLP-1 online (clinician reviews). ${REGEN_SQUARE_GLP1_SHOP_URL} Reply STOP to opt out.`;
}
