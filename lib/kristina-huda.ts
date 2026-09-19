/**
 * Public Kristina Huda, BSN, RN — RN injector. She does not prescribe.
 */

export const KRISTINA_FULL_NAME = "Kristina Huda, BSN, RN";
export const KRISTINA_IMAGE = "/images/team/cinematic/kristina.jpg";
export const KRISTINA_CREDENTIALS =
  "BSN, RN · Illinois-licensed registered nurse · RN injector";

export const KRISTINA_SHORT_BIO =
  "Kristina Huda, BSN, RN is our RN injector at Hello Gorgeous — neuromodulators, fillers, IVs, and wellness support. She does not prescribe.";

export const KRISTINA_BIO_PARAGRAPHS = [
  "Hi, I’m Kristina Huda, BSN, RN.",
  "I became a nurse because I wanted to help people in a real way — and aesthetics is where I get to do that for the long haul. I earned my Bachelor of Science in Nursing at Chamberlain University, graduating Magna Cum Laude, after my Associate of Science at College of DuPage. I am an Illinois-licensed registered nurse, BLS certified through the American Heart Association, and I completed a four-month mentorship in neuromodulators and dermal fillers with The Aesthetic Method — online study, shadow days, and hands-on training. My background also includes IV hydration, vitamin infusions, wellness therapies, and supporting patients through thoughtful, personalized care.",
  "I am so excited to join Hello Gorgeous. This is the kind of practice I have been looking for — a place that already has everything I need to take care of you the right way. Medical-grade, manufacturer product from five vendors… and then some. So when we sit down together, I am not working around shortages or settling. I can offer you the real thing, at the level this work deserves.",
  "If you are in my chair, I will take my time with you. I will listen, consult, and treat with a calm, careful hand — neuromodulators, fillers, IVs, and wellness support — and I will stay with you until you feel clear about the plan. In my spare time I am at seminars, working with mentors, and learning new techniques, because I never want to stop growing for the people I serve.",
  "I am in this with you, not just for one visit. Choose me if you want a nurse who is prepared, present, and genuinely happy to help you any way she can. I will go above and beyond — that is simply how I practice.",
] as const;

export const KRISTINA_PROVIDER_BIO = KRISTINA_BIO_PARAGRAPHS.join("\n\n");

export const KRISTINA_QUOTE =
  "If you sit with me, I will take my time. I want to hear what you see in the mirror — then we will make a plan that fits you.";

export function kristinaPersonJsonLd(siteUrl = "https://www.hellogorgeousmedspa.com") {
  return {
    "@type": "Person" as const,
    "@id": `${siteUrl}/#kristina-huda`,
    name: "Kristina Huda",
    honorificSuffix: "BSN, RN",
    jobTitle: "RN Injector",
    url: `${siteUrl}/meet-the-team#kristina-huda`,
    image: `${siteUrl}${KRISTINA_IMAGE}`,
    description: KRISTINA_SHORT_BIO,
    worksFor: { "@id": `${siteUrl}/#organization` },
  };
}
