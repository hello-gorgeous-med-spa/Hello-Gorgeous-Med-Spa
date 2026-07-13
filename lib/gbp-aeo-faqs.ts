import { HG_CORE_AEO_FAQS } from "@/lib/aeo-canonical";
import { getCityFivePageCopy } from "@/lib/city-five-page-copy";
import { SITE } from "@/lib/seo";

const TREATMENT_FAQ_TEMPLATES: Record<
  string,
  { howLong?: string; cost?: string; isSafe?: string; candidacy?: string }
> = {
  "botox-dysport-jeuveau": {
    howLong:
      "Most clients see neuromodulator results for about 3–4 months. Hello Gorgeous Med Spa in Oswego, IL uses NP-directed dosing for natural results.",
    cost: "Botox is as low as $9/unit at Hello Gorgeous in Oswego — authentic Allergan product from US distributors only. Exact units and cost are confirmed at your NP-directed consult.",
    isSafe:
      "Yes — Botox is FDA-approved. At Hello Gorgeous Med Spa, injectors use precise NP-supervised dosing after medical screening.",
    candidacy:
      "Adults seeking wrinkle softening who pass medical screening. Pregnancy, certain neuromuscular conditions, and some medications may exclude treatment — we confirm at consult.",
  },
  "weight-loss-therapy": {
    howLong:
      "Many clients notice changes within the first few months on an NP-directed plan. Timelines vary; Hello Gorgeous does not guarantee outcomes.",
    cost: "Medical weight loss programs start at $195/month (lowest injectable GLP-1 dose tier). Hello Gorgeous outlines your plan cost at consult — prescriptions require provider approval.",
    isSafe:
      "Yes when medically appropriate — programs are NP-directed with screening and monitoring. Prescriptions are not dispensed without provider review.",
    candidacy:
      "Adults seeking medically supervised weight loss after history review. Not everyone is a candidate; labs or telehealth may be required.",
  },
  "prf-prp": {
    howLong:
      "PRF/PRP results are often gradual over weeks to months; many protocols use a series. Plans are individualized at Hello Gorgeous in Oswego.",
    cost: "PRF/PRP pricing varies by area. Clear pricing is provided at your Hello Gorgeous consultation.",
    isSafe: "Yes — PRF and PRP use your own blood-derived components under medical protocols at Hello Gorgeous Med Spa.",
  },
  "biote-hormone-therapy": {
    howLong: "Some notice improvements within weeks on an NP-directed hormone plan; responses vary and are not guaranteed.",
    cost: "Costs depend on protocol and labs. Hello Gorgeous outlines pricing at consultation after provider review.",
    isSafe:
      "Hormone therapy at Hello Gorgeous is NP-directed with lab monitoring when indicated — not over-the-counter hormone sales.",
  },
  "hormone-therapy": {
    howLong: "Some notice improvements within weeks on an NP-directed hormone plan; responses vary and are not guaranteed.",
    cost: "Costs depend on protocol and labs. Hello Gorgeous outlines pricing at consultation after provider review.",
    isSafe:
      "Hormone therapy at Hello Gorgeous is NP-directed with lab monitoring when indicated — not over-the-counter hormone sales.",
  },
  "peptide-therapy": {
    howLong:
      "Peptide protocols are individualized; many clients reassess over weeks to months under NP supervision. Outcomes are not guaranteed.",
    cost: "Peptide program pricing depends on the approved protocol. Hello Gorgeous RX reviews every order before fulfillment.",
    isSafe:
      "Peptide therapy at Hello Gorgeous is NP-directed; prescriptions require provider approval and licensed compounding when applicable.",
  },
  "iv-therapy": {
    howLong: "IV drip effects and visit length vary by formula; your Hello Gorgeous provider explains expectations at visit.",
    cost: "IV pricing depends on the drip selected. Menu pricing is confirmed before treatment at our Oswego clinic.",
    isSafe: "IV therapy is administered under medical protocols after screening at Hello Gorgeous Med Spa.",
  },
  "lip-filler": {
    howLong: "Lip filler often lasts 6–12+ months depending on product and metabolism at Hello Gorgeous Med Spa.",
    cost: "Lip filler pricing depends on product and volume; quoted at your Oswego consult.",
    isSafe: "Yes — lip fillers used at Hello Gorgeous are FDA-approved products with conservative, NP-aware dosing.",
  },
  "quantum-rf": {
    howLong:
      "Collagen remodeling after QuantumRF continues for months; Hello Gorgeous discusses series vs single-session plans at consult.",
    cost: "QuantumRF pricing depends on treatment area and package. Contour Lift and related plans are quoted in Oswego after evaluation.",
    isSafe:
      "QuantumRF is performed with medical protocols at Hello Gorgeous — candidacy and settings are confirmed before treatment.",
  },
  "solaria-co2": {
    howLong:
      "Solaria CO₂ downtime and remodeling timelines vary by depth. Hello Gorgeous maps expectations honestly before you book.",
    cost: "Solaria CO₂ fractional laser is $899, with a buy-one-get-one-free area special. Settings and areas are confirmed at your Oswego consult.",
    isSafe:
      "Fractional CO₂ is medical-grade. Not every skin type is a candidate for every setting — Hello Gorgeous screens carefully.",
  },
  "dermal-fillers": {
    howLong: "Filler duration often ranges from several months to over a year depending on product and area.",
    cost: "Dermal filler pricing depends on product and syringes needed; quoted at consult in Oswego.",
    isSafe: "Yes — fillers are FDA-approved products placed after medical screening at Hello Gorgeous Med Spa.",
  },
  "rf-microneedling": {
    howLong: "Many protocols use a series; collagen changes build over weeks. Plans are personalized in Oswego.",
    cost: "Morpheus8 RF microneedling treatments start at $799. Area and series plans are confirmed at consultation.",
    isSafe: "RF microneedling is performed under medical protocols after screening at Hello Gorgeous.",
  },
};

/**
 * ≥5 extractable Q&As for GBP service×city pages (SEO-001 + SEO-002).
 * Answers lead with the direct fact, then detail (city, NP-directed, compliance).
 * Pass `gbpSlug` (e.g. botox-naperville-il) to prepend owner-approved 5-city PDF FAQs.
 */
export function gbpLocalFaqs(
  serviceName: string,
  cityLabel: string,
  serviceSlug: string,
  gbpSlug?: string,
): Array<{ question: string; answer: string }> {
  const t = TREATMENT_FAQ_TEMPLATES[serviceSlug] || {};
  const cityShort = cityLabel.replace(", IL", "");
  const cityCopyFaqs = gbpSlug ? getCityFivePageCopy(gbpSlug)?.faqs ?? [] : [];
  const items: Array<{ question: string; answer: string }> = [...cityCopyFaqs];

  const seen = new Set(items.map((f) => f.question.toLowerCase()));
  const pushUnique = (question: string, answer: string) => {
    const key = question.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    items.push({ question, answer });
  };

  pushUnique(
    `Do you offer ${serviceName} near ${cityShort}?`,
    `Yes — Hello Gorgeous Med Spa in Oswego, IL offers ${serviceName} for clients from ${cityLabel} and the Fox Valley. Care is NP-directed with medical screening before treatment; call ${SITE.phone} or book online.`,
  );
  pushUnique(
    `Is ${serviceName} at Hello Gorgeous medically supervised?`,
    `Yes — ${serviceName} at Hello Gorgeous is part of an NP-directed medical aesthetics practice in Oswego, IL, not a day spa. A licensed provider model screens clients before treatment.`,
  );
  if (t.howLong) pushUnique(`How long does ${serviceName} last?`, t.howLong);
  if (t.cost) pushUnique(`How much does ${serviceName} cost near ${cityShort}?`, t.cost);
  if (t.isSafe) pushUnique(`Is ${serviceName} safe?`, t.isSafe);
  if (t.candidacy) pushUnique(`Who is a good candidate for ${serviceName}?`, t.candidacy);
  pushUnique(
    "Do I need a consultation first?",
    `Yes — Hello Gorgeous recommends a consult so we can confirm candidacy, set expectations, and build a safe NP-directed plan for clients from ${cityLabel}.`,
  );
  pushUnique(
    "How do I book Hello Gorgeous from " + cityShort + "?",
    `Book online at hellogorgeousmedspa.com/book or call ${SITE.phone}. Our clinic is at ${SITE.address.streetAddress}, Oswego, IL — a short drive from ${cityShort}.`,
  );

  if (items.length < 5) {
    for (const faq of HG_CORE_AEO_FAQS) {
      if (items.length >= 5) break;
      pushUnique(faq.question, faq.answer);
    }
  }
  return items.slice(0, 8);
}
