/** REGEN RX “now live” launch — notify Square GLP-1 clients and share on social. */

export const REGEN_NOW_LIVE_PATH = "/now-live";
export const REGEN_NOW_LIVE_URL = "https://tryregenrx.com/now-live";
export const REGEN_NOW_LIVE_START_URL = "https://tryregenrx.com/start?goal=weight-loss";
export const REGEN_NOW_LIVE_FLYER = "/images/marketing/regen-now-live.jpg";
export const REGEN_NOW_LIVE_FLYER_ABS = `https://tryregenrx.com${REGEN_NOW_LIVE_FLYER}`;

export const REGEN_SQUARE_GLP1_LAUNCH_CAMPAIGN = "regen_square_glp1_launch";

export const REGEN_NOW_LIVE_STEPS = [
  { n: "01", title: "Explore & request", body: "Start online. No in-clinic visit required." },
  { n: "02", title: "Clinician review", body: "A licensed Illinois clinician reviews every request." },
  { n: "03", title: "Pay clinic invoice", body: "If approved, we send a PayConex clinic invoice." },
  { n: "04", title: "Pharmacy ships", body: "A licensed pharmacy ships to your Illinois door." },
] as const;

export function regenNowLiveSms(firstName: string) {
  const name = firstName.trim() || "there";
  return `Hi ${name}, Hello Gorgeous: REGEN RX is live. Order GLP-1 online — clinician reviews, then we ship. ${REGEN_NOW_LIVE_URL} Reply STOP to opt out.`;
}

export const REGEN_NOW_LIVE_IG = `REGEN RX is live.

Your wellness. Your schedule.

Same Hello Gorgeous clinic in Oswego. Licensed Illinois clinicians. Delivery to your door.

1. Explore & request
2. Clinician review
3. Pay the clinic invoice
4. Pharmacy ships

Illinois adults 21+. $30 shipping. Approval required. Compounded medication is not FDA-approved.

Start at tryregenrx.com/now-live`;

export const REGEN_NOW_LIVE_FB = `REGEN RX by Hello Gorgeous Med Spa is live.

You can request GLP-1 and other protocols online. A licensed Illinois clinician still reviews every request. If they approve, you pay a clinic invoice and a licensed pharmacy ships to your Illinois door. No card typed on the website.

Illinois adults 21+. $30 shipping. A request is not a guaranteed prescription.

tryregenrx.com/now-live
hellogorgeousmedspa.com`;

export const REGEN_NOW_LIVE_GBP = `REGEN RX is live — order online from Hello Gorgeous Med Spa. Licensed Illinois clinician review, then pharmacy delivery. Illinois 21+. tryregenrx.com/now-live`;
