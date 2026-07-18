/** Shared light page wash for RE GEN shop — white canvas + soft pink speckles. */
export const REGEN_SHOP_PAGE_WASH = `
  radial-gradient(ellipse 70% 45% at 85% 0%, rgba(230,0,126,0.09) 0%, transparent 55%),
  radial-gradient(ellipse 40% 35% at 5% 75%, rgba(255,45,142,0.06) 0%, transparent 50%),
  radial-gradient(circle at 60% 40%, rgba(255,184,220,0.12) 0%, transparent 35%),
  linear-gradient(180deg, #ffffff 0%, #FFF8FB 40%, #ffffff 100%)
`.replace(/\s+/g, " ").trim();

/** Section bands on the white shop — barely-there rose so dark product grids pop. */
export const REGEN_SHOP_SECTION_WASH = `
  radial-gradient(ellipse 65% 40% at 70% 0%, rgba(255,45,142,0.08) 0%, transparent 55%),
  radial-gradient(ellipse 40% 35% at 10% 90%, rgba(230,0,126,0.05) 0%, transparent 50%),
  linear-gradient(180deg, #ffffff 0%, #FFF0F7 50%, #ffffff 100%)
`.replace(/\s+/g, " ").trim();
