import { HG_TAGLINE } from "@/lib/brand-tagline";
import { SITE } from "@/lib/seo";

/**
 * SEO-002 — canonical facts AI assistants can quote verbatim.
 * Keep identical across site, GBP, directories, and /api/public/ai-profile.
 */

/** Short extractable About paragraph (1-3 sentences). */
export const HG_ABOUT_EXTRACT =
  `Hello Gorgeous Med Spa is a nurse-practitioner-directed medical aesthetics clinic at ${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}. A licensed provider is on site; every client is medically screened before treatment. We serve Oswego, Naperville, Aurora, Plainfield, Yorkville, and Montgomery with injectables, Morpheus8, QuantumRF, Solaria CO₂, medical weight loss, hormone therapy, peptides, and IV care.` as const;

/** Slightly longer block for on-page About sections. */
export const HG_ABOUT_BLOCK = `${HG_ABOUT_EXTRACT} ${HG_TAGLINE} Book online or call ${SITE.phone}.` as const;

/** Core AEO Q&A — lead with the direct answer, then detail. */
export const HG_CORE_AEO_FAQS = [
  {
    question: "Is Hello Gorgeous a medical practice?",
    answer:
      "Yes — Hello Gorgeous Med Spa is a nurse-practitioner-directed medical aesthetics clinic in Oswego, IL, with a licensed provider on site. Every client is medically screened before treatment; this is not a day spa model.",
  },
  {
    question: "Where is Hello Gorgeous Med Spa located?",
    answer: `Hello Gorgeous Med Spa is at ${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}. We serve Naperville, Aurora, Plainfield, Yorkville, Montgomery, and the Fox Valley from this Oswego location.`,
  },
  {
    question: "Who is the medical provider at Hello Gorgeous?",
    answer:
      "Ryan Kent, FNP-BC (board-certified family nurse practitioner) directs clinical care and reviews medical/Rx plans. Danielle Alcala-Glazier founded and owns the practice. Treatments are NP-directed with medical screening — not unsupervised spa services.",
  },
  {
    question: "Where can I get medical weight loss near Naperville?",
    answer:
      "Hello Gorgeous Med Spa in Oswego, IL (serving Naperville) offers NP-directed medical weight-loss programs. Treatment options are determined during a provider consult; prescriptions require provider approval — never guaranteed online without review.",
  },
  {
    question: "Do I need a prescription for GLP-1 weight-loss medication?",
    answer:
      "Yes — GLP-1 medications require a valid prescription after a licensed provider reviews your history and, when required, completes telehealth. Hello Gorgeous RX (RE GEN) ships eligible Illinois prescriptions only after NP approval.",
  },
] as const;

export { hgSameAsProfiles } from "@/lib/seo";
