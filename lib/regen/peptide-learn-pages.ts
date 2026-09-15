/**
 * Client-facing learn-more copy for /peptides/[slug].
 * Educational only — no dosing recipes, no outcome guarantees, no pharmacy name.
 * Status always comes from the showcase grid, not this file.
 */

import { FORMULATION_PEPTIDE_REVIEWED } from "@/lib/regen/formulation-peptide-formulary";
import {
  findShowcaseCard,
  peptideLearnHref,
  type PeptideShowcaseCard,
} from "@/lib/regen/peptide-showcase-grid";

export type PeptideLearnInterest = {
  n: string;
  title: string;
  body: string;
  bullets: string[];
};

export type PeptideLearnFaq = { q: string; a: string };

export type PeptideLearnCopy = {
  tagline: string;
  what: string;
  delivery: string;
  why: string[];
  interests: PeptideLearnInterest[];
  animal: { lead: string; bullets: string[] };
  human: { lead: string; bullets: string[] };
  legal: string;
  instead?: { label: string; href: string }[];
  faqs: PeptideLearnFaq[];
};

export type PeptideLearnPage = PeptideLearnCopy & {
  card: PeptideShowcaseCard;
};

const SERMORELIN = peptideLearnHref("sermorelin");
const TESAMORELIN = peptideLearnHref("tesamorelin");
const GHK = peptideLearnHref("ghk-cu");
const NAD = peptideLearnHref("nad");
const GLP1 = peptideLearnHref("custom-glp1");
const BPC = peptideLearnHref("bpc-157");
const TB500 = peptideLearnHref("tb-500");

function faqs(
  name: string,
  extra: PeptideLearnFaq[],
  orderable: boolean,
): PeptideLearnFaq[] {
  return [
    {
      q: `What is ${name}?`,
      a: extra[0]?.a ?? `${name} is a compound Illinois patients ask RE GEN about. A licensed Illinois clinician decides whether anything in this category belongs in a plan.`,
    },
    {
      q: `Is ${name} FDA-approved?`,
      a: orderable
        ? `Compounded ${name} is not an FDA-approved finished drug. When RE GEN can request it, it is because a documented §503A basis exists for that bulk substance or an approved-drug component — and a licensed Illinois clinician still has to decide it is appropriate for you.`
        : `${name} is not FDA-approved, and RE GEN does not have a lawful §503A pathway to request it as a compounded medication today. A committee vote is not approval.`,
    },
    {
      q: `Can I get ${name} at RE GEN in Oswego?`,
      a: orderable
        ? `Start a visit. We serve Illinois patients from 74 W. Washington St in Oswego. A licensed Illinois clinician reviews history and goals. If they prescribe, a licensed 503A pharmacy compounds it and it ships. If they do not prescribe, we refund the therapy charge.`
        : `You can start a visit to talk about your goal. We will not compound ${name} today. We will show you what is carried instead — and we will say no rather than gray-market a vial.`,
    },
    ...extra.slice(1),
    {
      q: "Do you promise results?",
      a: "No. Educational pages explain why people ask and what the research landscape looks like. Individual response varies. Compounded medications are not FDA-approved, and a request is not a guaranteed prescription.",
    },
  ];
}

const COPY: Record<string, PeptideLearnCopy> = {
  "custom-glp1": {
    tagline:
      "A clinician-matched GLP-1 plan — labs, dose, and medication chosen for you, not a one-size cart.",
    what: "GLP-1 receptor agonists are a class of medications studied for appetite signaling, gastric emptying, and metabolic health. A custom protocol means the molecule and titration are matched after a licensed Illinois clinician reviews labs, history, and goals — not picked off a shelf.",
    delivery: "Weekly injectable protocols are typical. The exact medication and dose are clinician-directed.",
    why: [
      "Appetite and satiety signaling when a GLP-1 is appropriate",
      "Dose matched to labs and response, not a fixed consumer kit",
      "Semaglutide and tirzepatide options when clinically indicated",
      "Illinois clinician first — then a licensed 503A pharmacy fills what is prescribed",
    ],
    interests: [
      {
        n: "01",
        title: "Matched, not guessed",
        body: "People ask for a custom protocol when a branded copay is not the right door, or when they want a clinician to choose the molecule after labs rather than buying a named vial first.",
        bullets: [
          "History, medications, and goals reviewed before any invoice",
          "Titration is a clinical decision, not a cart setting",
          "If it is not appropriate, we will say so",
        ],
      },
      {
        n: "02",
        title: "Appetite and metabolic support",
        body: "GLP-1 pathways are involved in satiety and glycemic signaling. We frame that as a researched tool in a medical visit — not a guaranteed amount of weight lost.",
        bullets: [
          "No promised number on the scale",
          "Side-effect counseling belongs in the visit",
          "Lifestyle still matters",
        ],
      },
      {
        n: "03",
        title: "Illinois practice, real pharmacy",
        body: "RE GEN is the prescription door of Hello Gorgeous in Oswego. Medication comes from a licensed 503A compounding pharmacy when prescribed — not a research-chemical site.",
        bullets: [
          "Patient-specific compounding when a lawful basis exists",
          "Shipping after the clinician decides",
          "Refund of the therapy charge if they do not prescribe",
        ],
      },
    ],
    animal: {
      lead: "The GLP-1 class has a large published literature, including extensive animal work on appetite and metabolic pathways.",
      bullets: [
        "Receptor biology is well described",
        "Preclinical work informed later human programs",
        "That is not the same as a compounded product being FDA-approved",
      ],
    },
    human: {
      lead: "Brand-name GLP-1 medicines have large human trials. Compounded versions are a different regulatory object — prepared for an individual patient when a clinician and pharmacy can lawfully do so.",
      bullets: [
        "We do not treat compounded GLP-1 as identical to a branded drug",
        "A licensed Illinois clinician decides if any protocol fits",
        "Outcomes vary; we do not promise a result",
      ],
    },
    legal:
      "RE GEN only requests a GLP-1 protocol where a documented basis exists and a licensed Illinois clinician decides it is appropriate. Compounded medications are not FDA-approved finished drugs.",
    faqs: faqs("a custom GLP-1 protocol", [
      { q: "What is a custom GLP-1 protocol?", a: "It is a clinician-directed plan using a GLP-1 class medication when appropriate — molecule and titration chosen after review, not a consumer kit." },
      { q: "Semaglutide or tirzepatide?", a: "That is a clinical decision. You can also read the individual pages and start a visit with a preference. The clinician still decides." },
    ], true),
  },
  semaglutide: {
    tagline: "A GLP-1 receptor agonist used in appetite and metabolic protocols when a clinician decides it fits.",
    what: "Semaglutide is a glucagon-like peptide-1 receptor agonist. Brand-name products in this class are FDA-approved for specific indications. Compounded semaglutide is a different preparation: patient-specific, not an FDA-approved finished drug, and only requested when a lawful basis and a clinician decision both exist.",
    delivery: "Weekly injection is the usual conversation. Dose is clinician-titrated.",
    why: [
      "GLP-1 receptor signaling involved in appetite and gastric emptying",
      "Widely discussed in medical weight-management visits",
      "Titration belongs with a licensed clinician, not a forum protocol",
      "Compounded only when the visit supports it",
    ],
    interests: [
      {
        n: "01",
        title: "Appetite signaling",
        body: "People ask about semaglutide because GLP-1 pathways influence satiety. We will not promise how much weight anyone will lose.",
        bullets: ["Clinician-titrated", "GI side effects are part of counseling", "Not a substitute for medical history"],
      },
      {
        n: "02",
        title: "Not the branded pen",
        body: "A compounded vial is not the same product as an FDA-approved injector pen. We say that out loud so the visit is honest.",
        bullets: ["Different regulatory status", "Patient-specific compounding", "No substitution claims"],
      },
      {
        n: "03",
        title: "The visit still decides",
        body: "Requesting a protocol starts intake. A licensed Illinois clinician can decline. If they decline, we refund the therapy charge.",
        bullets: ["Illinois patients", "Licensed 503A pharmacy when prescribed", "No gray-market sourcing"],
      },
    ],
    animal: {
      lead: "GLP-1 biology is supported by a large preclinical literature.",
      bullets: ["Receptor and metabolic pathway studies", "Informed later human development", "Does not make a compounded product FDA-approved"],
    },
    human: {
      lead: "Brand-name semaglutide has large human trials for labeled uses. Compounded semaglutide does not inherit that label.",
      bullets: ["We do not copy branded marketing claims onto a compound", "Your clinician decides if any protocol is appropriate", "Results are not guaranteed"],
    },
    legal:
      "Available to request at RE GEN when a licensed Illinois clinician decides it is appropriate and a 503A pharmacy can lawfully prepare it. Compounded medications are not FDA-approved.",
    faqs: faqs("semaglutide", [
      { q: "What is semaglutide?", a: "A GLP-1 receptor agonist discussed in metabolic and appetite protocols. Brand-name products exist; compounded semaglutide is a separate, patient-specific preparation when prescribed." },
      { q: "How is it given?", a: "Usually as a weekly injection when prescribed. Exact dose and titration are clinical decisions — we do not publish a DIY schedule." },
    ], true),
  },
  tirzepatide: {
    tagline: "A dual GIP/GLP-1 protocol when a licensed Illinois clinician confirms the plan.",
    what: "Tirzepatide acts on GIP and GLP-1 receptors. Brand-name products are FDA-approved for specific indications. A compounded request is not those products. RE GEN treats it as a clinician-directed protocol with a lawful compounding conversation — or we do not send it.",
    delivery: "Weekly injection when prescribed. Monthly requests are a starting conversation, not a locked dose.",
    why: [
      "Dual incretin signaling is why people ask",
      "Dose and molecule still belong to the clinician",
      "Not a DIY stack with other peptides from the internet",
      "Invoice only after a prescription decision",
    ],
    interests: [
      {
        n: "01",
        title: "Dual pathway interest",
        body: "GIP plus GLP-1 is the scientific reason this molecule is in so many conversations. Interest is not a result.",
        bullets: ["Satiety and metabolic signaling in the literature", "No promised outcome", "Side-effect counseling in the visit"],
      },
      {
        n: "02",
        title: "Compounded is not the brand",
        body: "We will not imply that a compounded vial is the approved brand. That distinction is part of informed consent.",
        bullets: ["Different regulatory object", "Patient-specific when lawful", "Clinician still decides"],
      },
      {
        n: "03",
        title: "Start with a visit",
        body: "Pick a monthly request if you already have a preference. The licensed Illinois clinician confirms or changes the plan.",
        bullets: ["Oswego practice, Illinois patients", "Refund if not prescribed", "No research-chemical vials"],
      },
    ],
    animal: {
      lead: "Incretin biology has a substantial preclinical base.",
      bullets: ["GIP and GLP-1 receptor research", "Does not equal a compounded FDA approval", "Mechanisms are not promises"],
    },
    human: {
      lead: "Brand-name tirzepatide has large human programs. Compounded tirzepatide does not wear that label.",
      bullets: ["We do not transplant brand claims onto a compound", "Individual response varies", "A request is not a prescription"],
    },
    legal:
      "Available to request when a licensed Illinois clinician decides it is appropriate. Compounded medications are not FDA-approved finished drugs.",
    faqs: faqs("tirzepatide", [
      { q: "What is tirzepatide?", a: "A dual GIP/GLP-1 receptor agonist. Brand-name products exist for labeled uses. Compounded tirzepatide is requested only after a clinician decision and a lawful compounding basis." },
      { q: "Why does the from-price look different from semaglutide?", a: "Published starting points differ by program and vial math. The visit confirms what is actually prescribed. Shipping is separate." },
    ], true),
  },
  "weight-loss-options": {
    tagline: "Other metabolic tools are matched at consult — nothing is picked off a shelf.",
    what: "Not every metabolic visit is a named GLP-1. Some patients need a different conversation: contraindications, prior intolerance, hormone overlap, or a plan that is not a peptide at all. This card exists so the menu stays honest.",
    delivery: "Provider-matched after history and labs. There is no cart SKU for “additional options.”",
    why: [
      "GLP-1s are not the only metabolic conversation",
      "Contraindications and intolerances matter",
      "Hormone and nutrition overlap is common",
      "A consult can be the right first step",
    ],
    interests: [
      {
        n: "01",
        title: "When the named vial is not the answer",
        body: "If a GLP-1 is not appropriate, the visit should still have somewhere to go. That is this page.",
        bullets: ["Clinician-directed alternatives", "No fake SKU", "Honesty over a hard sell"],
      },
      {
        n: "02",
        title: "Labs before shopping",
        body: "Metabolic plans that skip history are how people end up with the wrong tool.",
        bullets: ["Medications and GI history matter", "We will not diagnose on a marketing page", "Start a visit or book a consult"],
      },
      {
        n: "03",
        title: "Related reading",
        body: "If you already know you want a GLP-1 conversation, start on those pages instead.",
        bullets: ["Custom protocol", "Semaglutide", "Tirzepatide"],
      },
    ],
    animal: {
      lead: "Metabolic peptide research spans several molecules. Most of the public conversation over-indexes on two brand names.",
      bullets: ["Class effects are not interchangeable", "Animal data is not a shopping list", "The visit is the filter"],
    },
    human: {
      lead: "Human evidence is strongest for labeled GLP-1 medicines. Everything else is a clinician judgment call.",
      bullets: ["We do not invent a protocol in copy", "No guaranteed metabolic outcome", "Illinois clinician decides"],
    },
    legal:
      "This is an education and consult door, not a product. A licensed Illinois clinician decides what, if anything, is appropriate.",
    instead: [
      { label: "Custom GLP-1 protocol", href: GLP1 },
      { label: "Semaglutide", href: peptideLearnHref("semaglutide") },
      { label: "Tirzepatide", href: peptideLearnHref("tirzepatide") },
    ],
    faqs: faqs("additional metabolic options", [
      { q: "What are additional options?", a: "Metabolic tools matched at consult when a named GLP-1 is not the automatic answer. There is no separate cart item." },
      { q: "Should I book a consult or start a request?", a: "If you want to talk first, book a consult. If you already prefer a GLP-1, start on that protocol page." },
    ], true),
  },
  gonadorelin: {
    tagline: "A GnRH analog discussed in testosterone-support and fertility-preservation plans during TRT.",
    what: "Gonadorelin is a gonadotropin-releasing hormone analog. In clinician-directed TRT conversations it is sometimes used when the goal is to support downstream signaling rather than only replacing testosterone. It is not a DIY fertility drug and not a result promise.",
    delivery: "Route and schedule are clinician-directed. We do not publish a home protocol.",
    why: [
      "GnRH signaling sits upstream of LH/FSH",
      "Asked about during TRT when testicular function is part of the plan",
      "Not a substitute for a full hormone evaluation",
      "Available to request — clinician still decides",
    ],
    interests: [
      {
        n: "01",
        title: "TRT support conversations",
        body: "People ask about gonadorelin when they want the visit to include testicular signaling, not only a replacement dose.",
        bullets: ["Part of a hormone plan, not a standalone miracle", "History and labs first", "No fertility guarantee"],
      },
      {
        n: "02",
        title: "Not kisspeptin",
        body: "Kisspeptin is a different molecule and currently has no lawful §503A pathway at RE GEN. Do not treat them as interchangeable.",
        bullets: ["Different signal", "Different legal status", "Ask us what is carried"],
      },
      {
        n: "03",
        title: "Illinois clinician first",
        body: "Hormone peptides are easy to misuse. The visit exists to prevent that.",
        bullets: ["Licensed Illinois clinician", "Compounded only if prescribed", "Refund if declined"],
      },
    ],
    animal: {
      lead: "GnRH analog biology is described in endocrine literature, including animal models of gonadotropin release.",
      bullets: ["Upstream reproductive-hormone signaling", "Not a license to self-inject", "Mechanisms are not outcomes"],
    },
    human: {
      lead: "Clinical use is clinician-directed and indication-specific. This page does not diagnose hypogonadism or infertility.",
      bullets: ["Labs and history in the visit", "No promised sperm or testosterone number", "Compounded ≠ FDA-approved finished drug"],
    },
    legal:
      "Available to request as part of a hormone visit. A licensed Illinois clinician decides. Compounded medications are not FDA-approved.",
    faqs: faqs("gonadorelin", [
      { q: "What is gonadorelin?", a: "A GnRH analog discussed in some TRT and fertility-preservation plans. It is not interchangeable with kisspeptin or hCG." },
      { q: "Will it preserve fertility on TRT?", a: "That is a clinical question, not a marketing promise. The visit reviews goals and options. We do not guarantee fertility outcomes." },
    ], true),
  },
  hcg: {
    tagline: "Discussed for testicular function and hormonal balance during therapy when prescribed.",
    what: "Human chorionic gonadotropin (hCG) mimics LH signaling. In men on TRT it is sometimes used when a clinician wants to support testicular function. It is a real hormone product conversation — not a peptide meme — and it still requires a prescription decision.",
    delivery: "Clinician-directed injections when prescribed. No public dosing table.",
    why: [
      "LH-receptor signaling",
      "Common TRT adjunct question",
      "Not an automatic add-on to every testosterone plan",
      "Available to request through a hormone visit",
    ],
    interests: [
      {
        n: "01",
        title: "During TRT",
        body: "People ask about hCG because exogenous testosterone can suppress the axis. Whether hCG belongs in the plan is a clinician call.",
        bullets: ["Not automatic", "Labs matter", "No testicular-size or fertility guarantee"],
      },
      {
        n: "02",
        title: "Not a weight-loss drug",
        body: "Historic “hCG diet” marketing is not how RE GEN uses this page. We will not sell that story.",
        bullets: ["No starvation-diet protocol", "Hormone visit, not a fad", "Evidence-honest"],
      },
      {
        n: "03",
        title: "Sourced as a prescription",
        body: "If prescribed, it is filled through a licensed pharmacy pathway — not a research vial.",
        bullets: ["Illinois clinician", "Patient-specific when compounded", "Refund if not prescribed"],
      },
    ],
    animal: {
      lead: "Gonadotropin biology is well described in animal endocrine models.",
      bullets: ["LH-mimetic signaling", "Does not justify unsupervised use", "Not a diet peptide"],
    },
    human: {
      lead: "hCG has established clinical uses in reproductive medicine. Off-label wellness use still needs a clinician.",
      bullets: ["We do not diagnose on this page", "No promised hormone numbers", "Visit first"],
    },
    legal:
      "Available to request in a hormone visit when a licensed Illinois clinician decides it is appropriate.",
    faqs: faqs("hCG", [
      { q: "What is hCG?", a: "Human chorionic gonadotropin — an LH-receptor agonist used in clinician-directed reproductive and TRT-adjunct conversations." },
      { q: "Is this the hCG diet?", a: "No. RE GEN will not run a calorie-restriction hCG diet. This page is a hormone-therapy education door." },
    ], true),
  },
  kisspeptin: {
    tagline: "An upstream reproductive-hormone signal — no lawful §503A pathway at RE GEN today.",
    what: "Kisspeptin is a neuropeptide that sits upstream of GnRH. It is scientifically interesting for reproductive endocrinology. Interest is not a compounding basis. RE GEN will not request it until a documented lawful pathway exists.",
    delivery: "Not orderable. There is no RE GEN vial, capsule, or nasal spray for kisspeptin today.",
    why: [
      "Upstream of GnRH / LH / FSH",
      "Asked about in fertility and TRT forums",
      "Not nominated into a lawful 503A pathway we can use",
      "We would rather say no than gray-market it",
    ],
    interests: [
      {
        n: "01",
        title: "Why people ask",
        body: "Kisspeptin research is about the brain’s reproductive pulse generator. That is a real scientific story. It is not a product we can send.",
        bullets: ["Neuropeptide signaling", "Not interchangeable with gonadorelin", "Not a fertility guarantee in any case"],
      },
      {
        n: "02",
        title: "What we can discuss instead",
        body: "Hormone visits can still cover TRT-support tools that do have a pathway, when a clinician decides they fit.",
        bullets: ["Gonadorelin", "hCG", "A full hormone evaluation"],
      },
      {
        n: "03",
        title: "How RE GEN handles “no”",
        body: "Peptide credibility is saying no on the same page that explains the science.",
        bullets: ["No research-chemical workaround", "No “ask the pharmacy anyway”", "Status can change if FDA creates a basis"],
      },
    ],
    animal: {
      lead: "Kisspeptin literature includes substantial animal work on GnRH pulse generation and reproductive onset.",
      bullets: ["Upstream reproductive signaling", "Does not create a 503A basis", "Animal data is not a clinic vial"],
    },
    human: {
      lead: "Human research exists in reproductive endocrinology. That still does not make it compoundable at RE GEN today.",
      bullets: ["Limited as a compounding conversation", "Not orderable", "Do not buy “research” kisspeptin online"],
    },
    legal:
      "No lawful §503A pathway at this time. Not nominated / no bulk-eligibility we can use. We will not compound kisspeptin.",
    instead: [
      { label: "Gonadorelin", href: peptideLearnHref("gonadorelin") },
      { label: "hCG", href: peptideLearnHref("hcg") },
    ],
    faqs: faqs("kisspeptin", [
      { q: "What is kisspeptin?", a: "A neuropeptide that helps trigger GnRH release. Scientifically interesting. Not orderable at RE GEN today." },
      { q: "Can I bring my own vial?", a: "No. We do not inject or supervise gray-market peptides. Start a visit to talk about what is carried." },
    ], false),
  },
  oxytocin: {
    tagline: "Needle-free oxytocin for clinician-directed mood, connection, and recovery protocols.",
    what: "Oxytocin is a native peptide hormone involved in social bonding, lactation physiology, and stress-response conversations. Compounded troches, sublingual, and nasal forms exist so a clinician can choose a route a patient will actually use. It is not a personality transplant.",
    delivery: "Troches, sublingual RDTs, and nasal spray when prescribed.",
    why: [
      "Native bonding-and-stress hormone",
      "Needle-free routes people will actually take",
      "Sometimes paired in sexual-health plans",
      "Monograph / approved-drug basis for compounding conversations",
    ],
    interests: [
      {
        n: "01",
        title: "Connection and stress conversations",
        body: "People ask about oxytocin because of its role in social and affiliative signaling. We will not promise better relationships.",
        bullets: ["Clinician-directed", "Not a mood cure", "History and medications matter"],
      },
      {
        n: "02",
        title: "Sexual-health pairing",
        body: "Oxytocin sometimes appears next to PT-141 in intimate-health visits. That stack is a clinician decision.",
        bullets: ["Separate molecules", "Separate consents", "No guaranteed libido outcome"],
      },
      {
        n: "03",
        title: "A form you will use",
        body: "Troche and nasal options exist because adherence is part of whether a plan is real.",
        bullets: ["Needle-free when prescribed", "From-price plus shipping", "Illinois clinician first"],
      },
    ],
    animal: {
      lead: "Oxytocin biology is extensively described in animal models of bonding, stress, and social behavior.",
      bullets: ["Native peptide hormone", "Behavioral models do not equal a promised feeling", "Route still matters"],
    },
    human: {
      lead: "Oxytocin has established obstetric uses. Wellness and intimate-health compounding is a different, clinician-directed conversation.",
      bullets: ["Compounded forms are not the labor-induction product by default", "No promised mood or relationship outcome", "Visit first"],
    },
    legal:
      "Lawful compounding conversation on a monograph / approved-drug basis. A licensed Illinois clinician still decides. Compounded medications are not FDA-approved finished wellness drugs.",
    faqs: faqs("oxytocin", [
      { q: "What is oxytocin?", a: "A native peptide hormone involved in bonding, lactation physiology, and stress-response research. Compounded needle-free forms are requested when a clinician decides they fit." },
      { q: "Is it a love drug?", a: "No. That framing is marketing. We treat it as a hormone with a real biology and no guaranteed emotional result." },
    ], true),
  },
  "pt-141": {
    tagline: "A melanocortin agonist used in sexual-health protocols for men and women — injectable and needle-free.",
    what: "PT-141 (bremelanotide) acts on melanocortin receptors in the central nervous system. An FDA-approved branded product exists for a specific indication in premenopausal women. Compounded PT-141 is requested only with a documented clinical difference and a licensed Illinois clinician’s decision. It is not the same mechanism as a PDE5 tablet.",
    delivery: "Injection, sublingual, and nasal combinations when prescribed.",
    why: [
      "Central desire signaling — not primarily blood-flow mechanics",
      "Asked about by men and women",
      "Approved-drug-component pathway, plus the copy rule",
      "Needle-free options when a clinician chooses them",
    ],
    interests: [
      {
        n: "01",
        title: "Desire, not just hydraulics",
        body: "PDE5 medicines help many people and fail others. PT-141 is in the conversation when the gap is desire signaling.",
        bullets: ["Different receptor family", "Not a Viagra substitute claim", "No promised arousal outcome"],
      },
      {
        n: "02",
        title: "Women and men",
        body: "A branded bremelanotide product is labeled for a specific female indication. Men also ask. The visit is individualized.",
        bullets: ["Sex-specific counseling", "Nausea is a known counseling point in this class", "Clinician decides"],
      },
      {
        n: "03",
        title: "The copy rule",
        body: "Because an approved product exists, a compounded version needs a documented, patient-specific clinical difference — different strength, route, or a removed allergen, for example.",
        bullets: ["Not “essentially a copy” by default", "Documented per patient", "We will not skip that gate"],
      },
    ],
    animal: {
      lead: "Melanocortin-receptor research includes animal models of sexual behavior and appetite.",
      bullets: ["MC4R interest in the literature", "Animal behavior is not a clinic promise", "Class effects include nausea in humans"],
    },
    human: {
      lead: "Bremelanotide has human data in its labeled product. Compounded PT-141 does not automatically inherit that label.",
      bullets: ["Copy rule still applies", "Outcomes vary", "Informed consent in the visit"],
    },
    legal:
      "Approved-drug-component pathway. The finished preparation still has to clear the “essentially a copy” rule with a documented clinical difference. Compounded medications are not FDA-approved.",
    faqs: faqs("PT-141", [
      { q: "What is PT-141?", a: "Bremelanotide — a melanocortin agonist discussed for desire and arousal. An FDA-approved branded product exists for a specific use. Compounded PT-141 is a separate, patient-specific request when lawful." },
      { q: "Is it the same as sildenafil?", a: "No. PDE5 medicines act on blood flow. PT-141 acts centrally on melanocortin receptors. They are not interchangeable." },
    ], true),
  },
  ipamorelin: {
    tagline: "A selective GH-releasing peptide people want to stack with CJC-1295 — no lawful §503A pathway today.",
    what: "Ipamorelin is a growth-hormone secretagogue (GHRP class) studied for a relatively clean GH pulse in research settings. It is one of the most-asked GH peptides. It is also not something RE GEN can lawfully request as a compounded medication today.",
    delivery: "Not orderable. No RE GEN ipamorelin vial or blend.",
    why: [
      "Selective ghrelin-receptor / GHRP interest",
      "Often marketed with CJC-1295",
      "Not nominated into a pathway we can use",
      "Sermorelin and tesamorelin are the GH conversations we can actually have",
    ],
    interests: [
      {
        n: "01",
        title: "Why it is famous",
        body: "Forum culture treats ipamorelin as the “clean GH pulse.” Fame is not a compounding basis.",
        bullets: ["GHRP class", "Often stacked in marketing with CJC-1295", "Stack is also not orderable here"],
      },
      {
        n: "02",
        title: "What we carry instead",
        body: "GHRH analogs with a documented basis — sermorelin, and tesamorelin when the copy rule can be met.",
        bullets: ["Sermorelin", "Tesamorelin", "Not a secret ipamorelin workaround"],
      },
      {
        n: "03",
        title: "No gray-market GH stack",
        body: "We will not reconstitute a research vial in the studio or look the other way.",
        bullets: ["No “bring your own”", "No blend with tesamorelin", "Ask us what is carried"],
      },
    ],
    animal: {
      lead: "Ipamorelin has preclinical secretagogue literature.",
      bullets: ["GH pulse in research models", "Does not create 503A eligibility", "Selective does not mean approved"],
    },
    human: {
      lead: "Human data exist in limited clinical research contexts. That is not a green light to compound it at RE GEN.",
      bullets: ["Not orderable", "Do not buy research ipamorelin", "Read sermorelin instead"],
    },
    legal:
      "Not nominated / no lawful §503A pathway at this time. We will not compound ipamorelin or ipamorelin blends.",
    instead: [
      { label: "Sermorelin", href: SERMORELIN },
      { label: "Tesamorelin", href: TESAMORELIN },
    ],
    faqs: faqs("ipamorelin", [
      { q: "What is ipamorelin?", a: "A selective GH-releasing peptide. Frequently marketed. Not orderable at RE GEN today." },
      { q: "Can you do CJC/ipamorelin?", a: "No. Neither CJC-1295 nor ipamorelin has a lawful pathway here. See sermorelin." },
    ], false),
  },
  sermorelin: {
    tagline: "A GHRH analog that signals the body’s own GH release — our most-requested peptide.",
    what: "Sermorelin is a growth-hormone-releasing hormone (GHRH) analog. It is a fragment of the native GHRH sequence and has an approved-drug-component history. RE GEN requests it as a sterile injection (and other routes when prescribed) because a documented §503A basis exists — and because patients actually use it.",
    delivery: "Injection 1 and 1.5 mg/mL; sublingual troches, RDTs, and triturates when prescribed.",
    why: [
      "Signals endogenous GH rather than replacing GH",
      "Approved-drug-component pathway",
      "Most-requested peptide in the RE GEN catalog",
      "Routes people will actually take",
    ],
    interests: [
      {
        n: "01",
        title: "Own-GH signaling",
        body: "People ask for sermorelin when they want a GHRH analog rather than a GHRP that we cannot compound, or rather than GH replacement itself.",
        bullets: ["GHRH analog", "Not ipamorelin", "Not a guaranteed body-composition result"],
      },
      {
        n: "02",
        title: "Sleep, recovery, lean-mass conversations",
        body: "GH physiology touches sleep architecture, recovery, and body composition. Conversations are not outcomes.",
        bullets: ["Individual response varies", "Labs and history in the visit", "No “anti-aging cure” copy"],
      },
      {
        n: "03",
        title: "How we actually send it",
        body: "Sterile injection is the backbone. Needle-free forms exist when a clinician chooses them.",
        bullets: ["From-price plus shipping", "Clinician decides", "Refund if not prescribed"],
      },
    ],
    animal: {
      lead: "GHRH analog physiology is described in animal GH-axis models.",
      bullets: ["Pituitary GH release signaling", "Not the same as exogenous GH", "Preclinical data is not a promise"],
    },
    human: {
      lead: "Sermorelin has a clinical history as a diagnostic and therapeutic GHRH analog. Compounded preparations are still not FDA-approved finished products by default.",
      bullets: ["Approved-drug-component basis", "Copy and clinical-difference analysis still belongs in the chart when relevant", "No guaranteed IGF-1 or aesthetic result"],
    },
    legal:
      "Lawful pathway as a component of an FDA-approved drug. A licensed Illinois clinician still decides. Compounded medications are not FDA-approved.",
    faqs: faqs("sermorelin", [
      { q: "What is sermorelin?", a: "A GHRH analog that signals the pituitary to release growth hormone. It is RE GEN’s most-requested peptide when a clinician decides it fits." },
      { q: "Is it the same as CJC-1295 or ipamorelin?", a: "No. Those do not have a lawful pathway here. Sermorelin is the GHRH analog we can actually discuss as a compounded request." },
    ], true),
  },
  tesamorelin: {
    tagline: "A GHRH analog with an FDA-approved reference product — compounded only with a documented clinical difference.",
    what: "Tesamorelin is a GHRH analog. A branded product is FDA-approved for a specific indication (HIV-associated lipodystrophy / visceral adipose reduction in that label). Compounding tesamorelin is only on the table when a patient-specific clinical difference is documented so the preparation is not “essentially a copy.”",
    delivery: "Sterile injection 5 mg/mL when prescribed.",
    why: [
      "GHRH analog with a labeled reference product",
      "Visceral-fat conversations in the literature",
      "Copy rule is the gate",
      "Not a casual “GH stack” add-on",
    ],
    interests: [
      {
        n: "01",
        title: "Why clinicians know the name",
        body: "Tesamorelin’s labeled use is specific. Wellness patients still ask about visceral fat and GH signaling. The visit has to respect the label and the copy rule.",
        bullets: ["Not a general fat-loss guarantee", "Not interchangeable with sermorelin", "Documented difference required to compound"],
      },
      {
        n: "02",
        title: "The copy rule, in plain language",
        body: "If a finished compound is essentially a copy of a commercially available drug, 503A compounding is restricted. A different strength, form, or a removed allergen can be the clinical difference — it has to be real and written.",
        bullets: ["Per patient, not assumed", "We will not skip documentation", "Sometimes the answer is sermorelin instead"],
      },
      {
        n: "03",
        title: "No ipamorelin blend",
        body: "Tesamorelin / ipamorelin combo vials are not orderable because ipamorelin has no pathway.",
        bullets: ["See the blend page", "We will not sneak ipamorelin in", "Sermorelin is the usual alternative conversation"],
      },
    ],
    animal: {
      lead: "GHRH analog and visceral-fat research includes animal and mechanistic work.",
      bullets: ["GH axis signaling", "Does not waive the copy rule", "Not a spot-reduction promise"],
    },
    human: {
      lead: "The branded product has human data for its labeled indication. Compounded tesamorelin is a narrower, documented-difference conversation.",
      bullets: ["We do not advertise off-label miracles", "Clinician and pharmacist gates both apply", "Outcomes vary"],
    },
    legal:
      "Approved-drug-component pathway, gated by the “essentially a copy” rule. Compounded only with a documented, patient-specific clinical difference. Compounded medications are not FDA-approved.",
    faqs: faqs("tesamorelin", [
      { q: "What is tesamorelin?", a: "A GHRH analog with an FDA-approved branded product for a specific indication. Compounded tesamorelin requires a documented clinical difference." },
      { q: "Can you blend it with ipamorelin?", a: "No. Ipamorelin has no lawful §503A pathway at RE GEN." },
    ], true),
  },
  "tesamorelin-ipamorelin": {
    tagline: "A popular forum stack — ipamorelin has no lawful pathway, so this blend is not orderable.",
    what: "Marketing likes combining a GHRH analog with a GHRP. Tesamorelin plus ipamorelin is that idea in a vial. Because ipamorelin cannot be compounded on our pathway, the blend cannot either.",
    delivery: "Not orderable.",
    why: [
      "GHRH + GHRP is a common marketing stack",
      "Ipamorelin blocks the blend",
      "Tesamorelin alone is a separate, copy-rule conversation",
      "Sermorelin is the usual lawful GHRH alternative",
    ],
    interests: [
      {
        n: "01",
        title: "Why the stack exists in ads",
        body: "GHRH and GHRP hit the GH axis at different points. That is a real pharmacology story. It is not a vial we can send.",
        bullets: ["Two different molecules", "One of them has no pathway", "Blend fails with it"],
      },
      {
        n: "02",
        title: "What we can actually discuss",
        body: "Tesamorelin alone when the copy rule is met. Sermorelin when that is the better GHRH analog for the patient.",
        bullets: ["Tesamorelin page", "Sermorelin page", "No secret combo"],
      },
      {
        n: "03",
        title: "Honesty as the product",
        body: "A clinic that will sell you a blocked blend is not a clinic you want on GH.",
        bullets: ["We will not compound it", "We will explain why", "Start a visit for what is carried"],
      },
    ],
    animal: {
      lead: "Stacking secretagogues is common in preclinical and forum literature.",
      bullets: ["Does not legalize ipamorelin", "Does not waive 503A", "Not a protocol we run"],
    },
    human: {
      lead: "There is no RE GEN human program for this blend because we cannot lawfully prepare it.",
      bullets: ["Not orderable", "Do not buy a research combo vial", "Read the single-agent pages"],
    },
    legal:
      "Ipamorelin has no lawful §503A pathway, so this blend is not orderable. Tesamorelin as a single agent remains a copy-rule conversation.",
    instead: [
      { label: "Tesamorelin", href: TESAMORELIN },
      { label: "Sermorelin", href: SERMORELIN },
    ],
    faqs: faqs("a tesamorelin / ipamorelin blend", [
      { q: "What is this blend?", a: "A GHRH analog plus a GHRP, marketed as a GH stack. RE GEN cannot compound it because ipamorelin has no lawful pathway." },
      { q: "Can you just send tesamorelin?", a: "Sometimes, when the copy rule is documented. See the tesamorelin page." },
    ], false),
  },
  "cjc-1295-no-dac": {
    tagline: "A GHRH analog often asked with ipamorelin — not nominated, no lawful §503A pathway.",
    what: "CJC-1295 without DAC (sometimes discussed as a modified GRF 1-29) is a GHRH analog with a shorter activity window than the DAC version. It is a staple of online GH stacks. It is not something RE GEN can lawfully compound today.",
    delivery: "Not orderable.",
    why: [
      "GHRH analog interest",
      "Usually marketed with ipamorelin",
      "Not nominated / no pathway we can use",
      "Sermorelin is the GHRH analog we can discuss",
    ],
    interests: [
      {
        n: "01",
        title: "DAC vs no DAC, briefly",
        body: "DAC (Drug Affinity Complex) extends half-life. “No DAC” is the shorter-acting analog people pulse. Neither version is orderable here.",
        bullets: ["Different pharmacokinetics in research talk", "Same legal answer today", "See the With DAC page too"],
      },
      {
        n: "02",
        title: "The stack is also blocked",
        body: "CJC/ipamorelin 2X blends are not orderable.",
        bullets: ["Ipamorelin has no pathway", "CJC-1295 has no pathway", "Sermorelin instead"],
      },
      {
        n: "03",
        title: "What “not nominated” means",
        body: "Without a monograph, approved-drug component, or 503A bulks-list placement, there is no bulk-eligibility gate to walk through.",
        bullets: ["Absence of a ban is not a basis", "We will not compound it", "Status can change only with a real basis"],
      },
    ],
    animal: {
      lead: "Modified GRF analogs have preclinical GH-axis literature.",
      bullets: ["Not 503A eligibility", "Not a clinic vial", "Do not confuse research catalogs with pharmacies"],
    },
    human: {
      lead: "Limited clinical research does not create a compounding pathway at RE GEN.",
      bullets: ["Not orderable", "No DIY reconstitution advice", "Read sermorelin"],
    },
    legal:
      "Not nominated / no lawful §503A pathway at this time. We will not compound CJC-1295 (with or without DAC).",
    instead: [
      { label: "Sermorelin", href: SERMORELIN },
      { label: "CJC-1295 With DAC", href: peptideLearnHref("cjc-1295-dac") },
    ],
    faqs: faqs("CJC-1295 without DAC", [
      { q: "What is CJC-1295 No DAC?", a: "A shorter-acting GHRH analog in research and forum culture. Not orderable at RE GEN." },
      { q: "Is the DAC version different legally?", a: "No. Neither version has a lawful pathway here today." },
    ], false),
  },
  "cjc-1295-dac": {
    tagline: "An extended-half-life GHRH analog — same legal answer as No DAC: not orderable.",
    what: "CJC-1295 with DAC was designed for a longer GH-stimulating window. It is still a GHRH analog without a lawful §503A bulk-eligibility basis we can use. Longer half-life does not change the compounding answer.",
    delivery: "Not orderable.",
    why: [
      "Extended-half-life GHRH analog in research talk",
      "Not nominated / no pathway",
      "Often confused with sermorelin",
      "Sermorelin is the lawful GHRH conversation",
    ],
    interests: [
      {
        n: "01",
        title: "Why DAC was invented",
        body: "Binding to albumin (the DAC idea) is a half-life trick. It is clever chemistry. It is not a 503A ticket.",
        bullets: ["Pharmacokinetic story", "Legal story is still no", "See No DAC page"],
      },
      {
        n: "02",
        title: "Not sermorelin",
        body: "Patients mix the names because both are GHRH-related. Only sermorelin has a documented basis we can use today.",
        bullets: ["Different molecules", "Different legal status", "Read sermorelin"],
      },
      {
        n: "03",
        title: "No stacks",
        body: "DAC CJC plus ipamorelin is equally blocked.",
        bullets: ["2X blend page", "Tesamorelin/ipamorelin blend page", "We will not compound either"],
      },
    ],
    animal: {
      lead: "Long-acting GHRH analog work exists in preclinical literature.",
      bullets: ["Half-life extension is not approval", "Not orderable", "No research-chemical sourcing"],
    },
    human: {
      lead: "Limited human research does not open 503A compounding at RE GEN.",
      bullets: ["Not orderable", "Do not pulse a research vial", "Ask for what is carried"],
    },
    legal:
      "Not nominated / no lawful §503A pathway at this time. We will not compound CJC-1295 With DAC.",
    instead: [
      { label: "Sermorelin", href: SERMORELIN },
      { label: "CJC-1295 No DAC", href: peptideLearnHref("cjc-1295-no-dac") },
    ],
    faqs: faqs("CJC-1295 with DAC", [
      { q: "What is CJC-1295 With DAC?", a: "A longer-acting GHRH analog. Not orderable at RE GEN today." },
      { q: "Can I request sermorelin instead?", a: "Yes — that is the GHRH analog with a documented basis. A clinician still decides." },
    ], false),
  },
  selank: {
    tagline: "A tuftsin-derived peptide studied for calm and clarity — no lawful §503A pathway today.",
    what: "Selank is a synthetic peptide derived from tuftsin, studied in anxiolytic and nootropic research, much of it from outside the U.S. regulatory system. RE GEN will not compound it until a documented 503A basis exists.",
    delivery: "Not orderable. No nasal spray or injectable from RE GEN.",
    why: [
      "Calm and mental-clarity conversations",
      "Often paired with Semax in marketing",
      "No lawful pathway here today",
      "We will not sell a “research” nasal",
    ],
    interests: [
      {
        n: "01",
        title: "Why people ask",
        body: "Stress, focus, and immune-adjacent claims follow Selank around the internet. Claims are not a compounding basis.",
        bullets: ["Anxiolytic research interest", "Not an FDA-approved anxiolytic", "Not orderable"],
      },
      {
        n: "02",
        title: "Semax is a different legal file",
        body: "Semax was PCAC-recommended in July 2026. Selank was not in that recommended set. Neither is orderable today.",
        bullets: ["Recommendation ≠ available", "Different molecules", "See the Semax page"],
      },
      {
        n: "03",
        title: "What we can discuss",
        body: "Cognitive and sleep visits can still cover carried tools when a clinician decides they fit.",
        bullets: ["NAD+", "Methylene blue (with interaction counseling)", "A consult"],
      },
    ],
    animal: {
      lead: "Selank has preclinical literature on stress and immune modulation.",
      bullets: ["Mostly non-U.S. research traditions", "Not 503A eligibility", "Not a clinic nasal"],
    },
    human: {
      lead: "Human data are limited and not a U.S. compounding green light.",
      bullets: ["Not orderable", "Do not import research peptides", "Ask what is carried"],
    },
    legal: "No lawful §503A pathway at this time. We will not compound Selank.",
    instead: [
      { label: "Semax", href: peptideLearnHref("semax") },
      { label: "NAD+", href: NAD },
    ],
    faqs: faqs("Selank", [
      { q: "What is Selank?", a: "A tuftsin-derived peptide studied for calm and cognition. Not orderable at RE GEN." },
      { q: "Is it like a benzo?", a: "No, and we will not analogize it that way. It is not an FDA-approved anxiolytic and we cannot compound it." },
    ], false),
  },
  semax: {
    tagline: "A nootropic peptide PCAC recommended for the 503A bulks list — not orderable yet.",
    what: "Semax is a ACTH(4-10) analog studied for cognitive and neuroprotective research. In July 2026, FDA’s Pharmacy Compounding Advisory Committee recommended it for the 503A bulks list. A recommendation is advice to FDA. It is not listing, not rulemaking, and not a vial we can send.",
    delivery: "Not orderable today. No RE GEN Semax nasal or injectable.",
    why: [
      "Focus, memory, and neuroprotection conversations",
      "PCAC recommended listing in July 2026",
      "FDA has not completed listing / rulemaking",
      "We add on confirmation, not on a vote",
    ],
    interests: [
      {
        n: "01",
        title: "Why people want it",
        body: "Nootropic marketing is loud. The molecule has a real research story. We will not oversell either.",
        bullets: ["Cognitive research interest", "Not a study-drug promise", "Not orderable today"],
      },
      {
        n: "02",
        title: "What the July 2026 vote actually did",
        body: "PCAC recommended six peptides, including Semax. Emideltide (DSIP) was not recommended. None of the six became compoundable the next morning.",
        bullets: ["Advisory only", "Rulemaking still required", "See the peptides hub legal grid"],
      },
      {
        n: "03",
        title: "If FDA lists it later",
        body: "If FDA places Semax on the 503A bulks list and the other gates are clear, we will add it with its basis — not before.",
        bullets: ["We will update this page", "No gray-market bridge", "Ask us what is carried now"],
      },
    ],
    animal: {
      lead: "Semax has a preclinical neurobiology literature.",
      bullets: ["Cognitive and stress models", "Not a U.S. approval", "Not orderable"],
    },
    human: {
      lead: "Human studies exist, especially outside U.S. commercial channels. PCAC review is not the same as FDA listing.",
      bullets: ["Limited as a U.S. compounding basis today", "No promised cognitive result", "Do not buy research Semax"],
    },
    legal:
      "PCAC recommended Semax for the 503A bulks list in July 2026. That is not a green light. Not orderable at RE GEN until FDA acts and a lawful basis is confirmed.",
    instead: [
      { label: "NAD+", href: NAD },
      { label: "Selank", href: peptideLearnHref("selank") },
    ],
    faqs: faqs("Semax", [
      { q: "What is Semax?", a: "A peptide studied in cognitive and neuroprotective research. PCAC recommended it for the 503A bulks list in July 2026. Not orderable yet." },
      { q: "Didn’t the committee approve it?", a: "Committees recommend. FDA lists — after rulemaking. A vote is not a vial." },
    ], false),
  },
  dsip: {
    tagline: "Delta sleep-inducing peptide — PCAC reviewed it in July 2026 and did not recommend it.",
    what: "DSIP (emideltide) is a peptide historically studied for sleep architecture. In July 2026 PCAC reviewed it for the 503A bulks list and did not recommend it. RE GEN will not compound it.",
    delivery: "Not orderable. Not a nightly peptide we can send.",
    why: [
      "Sleep and recovery conversations",
      "PCAC: not recommended",
      "No pathway to compound",
      "Sleep visits can still be honest without this molecule",
    ],
    interests: [
      {
        n: "01",
        title: "Why the name is tempting",
        body: "“Delta sleep-inducing” sounds like a product. The review outcome is the opposite of a product.",
        bullets: ["Sleep research history", "Not recommended for the bulks list", "Not orderable"],
      },
      {
        n: "02",
        title: "Different from the six that were recommended",
        body: "BPC-157, TB-500, KPV, MOTS-c, Semax, and Epitalon were recommended. DSIP was not. None of those six are orderable yet either.",
        bullets: ["Recommendation still is not listing", "Non-recommendation is a hard no today", "Do not gray-market a sleep peptide"],
      },
      {
        n: "03",
        title: "What we can talk about",
        body: "Sleep and stress goals can still go through a visit. We will not pretend DSIP is the tool.",
        bullets: ["Consult", "NAD+ when appropriate", "No DSIP workaround"],
      },
    ],
    animal: {
      lead: "DSIP has older preclinical sleep literature.",
      bullets: ["Not a modern 503A basis", "PCAC did not recommend listing", "Not orderable"],
    },
    human: {
      lead: "Human evidence is limited. The advisory committee’s non-recommendation is the operational fact for this page.",
      bullets: ["Not orderable", "No sleep-score promise in any case", "Do not buy research DSIP"],
    },
    legal:
      "Reviewed by PCAC in July 2026 and not recommended. No lawful §503A pathway. We will not compound DSIP / emideltide.",
    instead: [{ label: "NAD+", href: NAD }],
    faqs: faqs("DSIP", [
      { q: "What is DSIP?", a: "Delta sleep-inducing peptide (emideltide). PCAC did not recommend it for the 503A bulks list in July 2026. Not orderable." },
      { q: "Can I take it as needed, not nightly?", a: "We cannot compound it at all — continuous or as-needed. The legal answer is no." },
    ], false),
  },
  "methylene-blue": {
    tagline: "Low-dose methylene blue for clinician-directed mitochondrial and cognitive support — drug interactions matter.",
    what: "Methylene blue is a long-used dye and medication, not a classic “peptide,” but it sits on cognitive/mitochondrial menus because of redox and MAO-related pharmacology. The important sentence is not the hype: it can interact dangerously with serotonergic antidepressants. A clinician has to see the med list.",
    delivery: "Low-dose, clinician-directed when prescribed. Not a DIY nootropic.",
    why: [
      "Mitochondrial / redox conversations",
      "Cognitive-support interest",
      "Serotonergic interaction risk is real",
      "Available to request only through a visit",
    ],
    interests: [
      {
        n: "01",
        title: "Why it is on a peptide menu",
        body: "Patients group it with NAD+ and nootropics. Chemically it is not a peptide. Clinically it still needs a visit.",
        bullets: ["Redox / mitochondrial interest", "Not a peptide chain", "Honesty about the category"],
      },
      {
        n: "02",
        title: "The interaction that matters",
        body: "Methylene blue has MAO-A inhibitory activity. Combined with SSRIs, SNRIs, or other serotonergic drugs it can contribute to serotonin syndrome. This is a hard stop without clinician review.",
        bullets: ["Bring your medication list", "We will not shrug this off", "Sometimes the answer is no"],
      },
      {
        n: "03",
        title: "Not a biohacker vial",
        body: "Fish-tank and industrial dyes are not medications. If it is prescribed, it is a pharmaceutical-grade conversation.",
        bullets: ["No Amazon dye", "Clinician-directed dose if any", "No cognitive guarantee"],
      },
    ],
    animal: {
      lead: "Methylene blue has a large preclinical literature in mitochondrial and neurologic models.",
      bullets: ["Mechanistic interest", "Does not erase interaction risk", "Not a promised IQ change"],
    },
    human: {
      lead: "Methylene blue has established medical uses at various doses. Low-dose wellness use is a clinician-directed, interaction-aware conversation — not a supplement aisle.",
      bullets: ["Med-list review is mandatory", "No guaranteed focus result", "Compounded/dispensed only if prescribed"],
    },
    legal:
      "Available to request through a consult or visit when a licensed Illinois clinician decides it is appropriate. Drug-interaction screening is part of that decision.",
    faqs: faqs("methylene blue", [
      { q: "What is methylene blue?", a: "A medication/dye with mitochondrial and MAO-related pharmacology. It is not a peptide. Low-dose use still requires a clinician because of interaction risk." },
      { q: "I take an antidepressant. Can I still request it?", a: "Tell the clinician. Serotonergic combinations can be dangerous. The honest answer may be no." },
    ], true),
  },
  epithalon: {
    tagline: "A telomerase-associated peptide PCAC recommended — not approval, not orderable today.",
    what: "Epithalon (epitalon) is a tetrapeptide associated with pineal and telomerase research. PCAC recommended it for the 503A bulks list in July 2026. RE GEN will not compound it until FDA listing and the other gates are actually done.",
    delivery: "Not orderable. No short-cycle vial from us today.",
    why: [
      "Longevity and telomere conversations",
      "PCAC recommended listing July 2026",
      "Vote ≠ available",
      "NAD+ is a longevity-adjacent tool we can actually discuss",
    ],
    interests: [
      {
        n: "01",
        title: "Why longevity forums love it",
        body: "Telomerase and pineal signaling make for a powerful story. Stories are not prescriptions.",
        bullets: ["Cellular-aging research interest", "Not an immortality peptide", "Not orderable"],
      },
      {
        n: "02",
        title: "The July 2026 vote",
        body: "Recommended along with BPC-157, TB-500, KPV, MOTS-c, and Semax. None of them are orderable at RE GEN today.",
        bullets: ["Advisory committee only", "Rulemaking remains", "We add on confirmation"],
      },
      {
        n: "03",
        title: "What we can do now",
        body: "Longevity visits can still cover carried mitochondrial and metabolic tools when appropriate.",
        bullets: ["NAD+", "GLP-1 conversation if that is the real goal", "Consult"],
      },
    ],
    animal: {
      lead: "Epitalon has preclinical aging and telomerase-associated literature.",
      bullets: ["Mostly non-U.S. research traditions", "Not a 503A listing yet", "Not orderable"],
    },
    human: {
      lead: "Human evidence is limited. A PCAC recommendation is not human-use approval.",
      bullets: ["Not orderable today", "No telomere-length promise in any case", "Do not buy research epitalon"],
    },
    legal:
      "PCAC recommended Epitalon for the 503A bulks list in July 2026. Not orderable until FDA acts. A vote is not a green light.",
    instead: [{ label: "NAD+", href: NAD }],
    faqs: faqs("Epithalon", [
      { q: "What is Epithalon?", a: "A tetrapeptide in longevity research (also spelled epitalon). PCAC recommended listing in July 2026. Not orderable at RE GEN yet." },
      { q: "Will you add it after the vote?", a: "After FDA listing and a confirmed lawful basis — not after a committee vote alone." },
    ], false),
  },
  "mots-c": {
    tagline: "A mitochondrial peptide PCAC recommended — not orderable until FDA lists it.",
    what: "MOTS-c is a mitochondrial-encoded peptide studied for metabolic and exercise-related signaling. PCAC recommended it for the 503A bulks list in July 2026. RE GEN will not compound it on a vote.",
    delivery: "Not orderable today.",
    why: [
      "Metabolic and exercise-performance conversations",
      "Mitochondrial signaling research",
      "PCAC recommended, FDA has not listed",
      "NAD+ is the mitochondrial conversation we can have now",
    ],
    interests: [
      {
        n: "01",
        title: "Why athletes ask",
        body: "Metabolic flexibility and exercise models made MOTS-c famous. Fame is not availability.",
        bullets: ["Mitochondrial peptide", "Not a legal workout drug", "Not orderable"],
      },
      {
        n: "02",
        title: "July 2026",
        body: "Recommended with several other peptides. Recommendation is not rulemaking.",
        bullets: ["Advisory only", "We will not gray-market a bridge", "Check this page later for FDA action"],
      },
      {
        n: "03",
        title: "Carried mitochondrial support",
        body: "NAD+ protocols exist when a clinician decides they fit.",
        bullets: ["NAD+ page", "GLP-1 if weight is the real goal", "Consult"],
      },
    ],
    animal: {
      lead: "MOTS-c has preclinical metabolic and exercise literature.",
      bullets: ["Mitochondrial signaling", "Not 503A listing yet", "Not orderable"],
    },
    human: {
      lead: "Human data are still emerging. PCAC recommendation is not approval.",
      bullets: ["Not orderable", "No performance guarantee in any case", "Do not buy research MOTS-c"],
    },
    legal:
      "PCAC recommended MOTS-c for the 503A bulks list in July 2026. Not orderable at RE GEN until FDA acts.",
    instead: [
      { label: "NAD+", href: NAD },
      { label: "Custom GLP-1", href: GLP1 },
    ],
    faqs: faqs("MOTS-c", [
      { q: "What is MOTS-c?", a: "A mitochondrial-encoded peptide studied in metabolic research. PCAC recommended listing in July 2026. Not orderable yet." },
      { q: "Is it a GLP-1?", a: "No. Different biology. If weight is the goal, read the GLP-1 pages." },
    ], false),
  },
  nad: {
    tagline: "A coenzyme used in cellular-energy protocols when a licensed Illinois clinician decides it belongs.",
    what: "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme, not a classic peptide, central to redox metabolism. Levels are discussed in aging literature. RE GEN treats injectable NAD+ as a clinician-directed protocol — not a spa drip slogan and not a guaranteed energy personality.",
    delivery: "Injectable vial when prescribed. IV conversations are separate and clinician-directed.",
    why: [
      "Cellular energy and redox metabolism",
      "Healthy-aging protocols when appropriate",
      "Often grouped with peptide longevity menus",
      "Available to request through an energy visit",
    ],
    interests: [
      {
        n: "01",
        title: "Energy without a miracle claim",
        body: "People feel depleted and want a mitochondrial story. We will talk about that story and still not promise a specific energy result.",
        bullets: ["Coenzyme biology is real", "Response varies", "Sleep and meds still matter"],
      },
      {
        n: "02",
        title: "Not a peptide, still on this grid",
        body: "Patients look for NAD+ next to Epithalon and MOTS-c. Those two are not orderable. NAD+ can be a visit.",
        bullets: ["Different legal files", "Do not substitute research peptides", "Clinician decides"],
      },
      {
        n: "03",
        title: "How the request works",
        body: "Start an energy visit. If prescribed, you pay the invoice and it ships. If not, we refund the therapy charge.",
        bullets: ["Illinois patients", "Licensed pharmacy pathway", "No crash-IV marketing"],
      },
    ],
    animal: {
      lead: "NAD+ metabolism has an enormous preclinical aging and metabolic literature.",
      bullets: ["Redox coenzyme", "Animal longevity models are not a human guarantee", "Mechanisms ≠ outcomes"],
    },
    human: {
      lead: "NAD+ precursors and IV/injectable NAD+ are widely discussed; high-quality outcome data for wellness indications are mixed. We will not oversell.",
      bullets: ["Clinician-directed if used", "No guaranteed clarity or lifespan claim", "Compounded/dispensed product is not an FDA-approved anti-aging drug"],
    },
    legal:
      "Available to request when a licensed Illinois clinician decides it is appropriate. Compounded medications are not FDA-approved finished drugs.",
    faqs: faqs("NAD+", [
      { q: "What is NAD+?", a: "A coenzyme essential to cellular energy metabolism. It is not a peptide. Injectable protocols are clinician-directed when prescribed." },
      { q: "Is this the same as NMN or NR?", a: "Those are oral precursors sold as supplements in other channels. This page is about a clinician-directed NAD+ protocol, not a supplement aisle." },
    ], true),
  },
  "bpc-157": {
    tagline:
      "The most-asked repair peptide — PCAC recommended listing in July 2026, and it is still not orderable.",
    what: "BPC-157 (Body Protection Compound-157) is a synthetic 15–amino-acid sequence related to a gastric protein fragment. It has been studied — mostly in animals — for soft-tissue repair, gut lining models, and recovery from injury or training stress. RE GEN will explain that science and still will not compound it until FDA creates a lawful §503A basis.",
    delivery:
      "Not orderable as an injectable or oral from RE GEN today. Research shops and “clinic vials of uncertain origin” are not a workaround we will use.",
    why: [
      "Soft-tissue repair conversations (tendon, ligament, muscle)",
      "Gut and GI-protection research history",
      "Often paired with TB-500 in marketing stacks",
      "PCAC recommended the 503A bulks list in July 2026 — not a green light",
    ],
    interests: [
      {
        n: "01",
        title: "Soft tissue repair",
        body: "Animal research has examined BPC-157 in muscle, tendon, ligament, and bone-adjacent models. Proposed ideas include angiogenesis and growth-factor signaling at an injury site. Human evidence is limited. That is the honest paragraph.",
        bullets: [
          "Studied in tendon, ligament, and muscle models",
          "Human trials are not the bulk of the literature",
          "We will not promise faster healing",
        ],
      },
      {
        n: "02",
        title: "Gut & GI interest",
        body: "The gastric origin story is why oral BPC-157 gets asked about for gut-focused goals. Oral and injectable share the same bulk-eligibility problem today.",
        bullets: [
          "GI models in animals",
          "Oral form does not dodge 503A",
          "See the oral BPC-157 page",
        ],
      },
      {
        n: "03",
        title: "Recovery & inflammation talk",
        body: "Athletes ask about training stress, nagging injuries, and post-procedure recovery. We frame BPC-157 as a researched question, not a treatment we can send.",
        bullets: [
          "Not a diagnosis of your injury",
          "Not a WADA-friendly assumption for tested athletes",
          "Rehab, rest, and carried tools still exist",
        ],
      },
    ],
    animal: {
      lead: "The bulk of BPC-157 literature is preclinical — largely rodent models of tendon, muscle, gut, and vascular injury.",
      bullets: [
        "Consistent signals across several tissue types in animals",
        "Proposed mechanisms: angiogenesis, growth-factor signaling, nitric-oxide pathways",
        "Animal data does not always translate",
        "Hundreds of papers are still not a human approval",
      ],
    },
    human: {
      lead: "Published human trials are limited. Case reports and clinic anecdotes are not randomized trials. Long-term human safety databases are small.",
      bullets: [
        "Limited published human trials",
        "Patient-reported stories are not RCTs",
        "No specific result promised — including on this page",
        "Not orderable at RE GEN today, so there is no RE GEN human protocol to quote",
      ],
    },
    legal:
      "BPC-157 is not FDA-approved. It has no lawful §503A pathway at RE GEN today. FDA’s Pharmacy Compounding Advisory Committee recommended it for the 503A bulks list on July 23, 2026. PCAC only advises. Listing still needs FDA action and rulemaking. The “essentially a copy” gate would still apply later. We add on confirmation, not on a vote.",
    instead: [
      { label: "Sermorelin — GHRH analog we can request", href: SERMORELIN },
      { label: "GHK-Cu topical", href: GHK },
      { label: "TB-500 status", href: TB500 },
      { label: "BPC-157 oral", href: peptideLearnHref("bpc-157-oral") },
    ],
    faqs: faqs("BPC-157", [
      {
        q: "What is BPC-157?",
        a: "A synthetic 15–amino-acid peptide related to a gastric protein fragment, studied mostly in animals for tissue repair and GI models. It is not FDA-approved and not orderable at RE GEN today.",
      },
      {
        q: "Didn’t FDA’s committee just approve it?",
        a: "No. In July 2026 PCAC recommended BPC-157 for the 503A bulks list. That is advice. FDA has not listed it, and rulemaking is still required. We will not compound it until that basis exists.",
      },
      {
        q: "Can I get BPC-157 near Naperville or Oswego?",
        a: "You can start a RE GEN visit in our Oswego practice and we will tell you the legal status in person. We will not sell you BPC-157 today. We will show you what is carried for recovery-adjacent goals.",
      },
      {
        q: "Is oral different from injectable?",
        a: "Different delivery idea — same bulk-eligibility rule. Oral is not a loophole. See the oral page.",
      },
      {
        q: "Is it the same as TB-500?",
        a: "No. Different molecules, often stacked in marketing. Both are under FDA review for 503A listing and neither is orderable here today.",
      },
    ], false),
  },
  "bpc-157-oral": {
    tagline: "Needle-free BPC-157 is the same legal file as the injectable — not orderable today.",
    what: "Oral BPC-157 is marketed for gut-lining goals because the parent sequence is gastric. Stomach enzymes destroy most peptides; this molecule is discussed as unusually stable in acid in research settings. None of that creates a 503A pathway. If we cannot compound the bulk substance, we cannot compound the capsule either.",
    delivery: "Not orderable as tablets, capsules, or liquids from RE GEN today.",
    why: [
      "Gut-focused marketing",
      "Needle-free preference",
      "Same bulk-eligibility rule as injectable",
      "PCAC recommendation is not a capsule",
    ],
    interests: [
      {
        n: "01",
        title: "Why oral gets its own card",
        body: "People who will not inject still want the molecule. Honesty requires a separate card with the same no.",
        bullets: ["Gut-target conversations in research", "Not a loophole", "See injectable BPC-157 for the full evidence layout"],
      },
      {
        n: "02",
        title: "Stability is not legality",
        body: "Gastric stability is a chemistry talking point. 503A is a statute talking point. We need the statute.",
        bullets: ["No oral workaround", "No “research capsule” we will endorse", "July 2026 vote still is not listing"],
      },
      {
        n: "03",
        title: "Gut goals we can actually discuss",
        body: "A visit can cover carried tools and referrals. It will not include oral BPC-157 today.",
        bullets: ["Clinician-directed plan", "No promised GI outcome", "Start a visit anyway if that is the goal"],
      },
    ],
    animal: {
      lead: "GI injury and protection models are a large part of the BPC-157 animal literature.",
      bullets: ["Gut models in rodents", "Not a human capsule approval", "Not orderable"],
    },
    human: {
      lead: "Human oral data are limited. The compounding answer does not change with the route.",
      bullets: ["Not orderable", "No gut-lining guarantee", "Do not buy oral research BPC"],
    },
    legal:
      "Same bulk-eligibility status as injectable BPC-157. PCAC recommended listing in July 2026. Not orderable at RE GEN until FDA acts.",
    instead: [
      { label: "BPC-157 (injectable status)", href: BPC },
      { label: "GHK-Cu topical", href: GHK },
    ],
    faqs: faqs("oral BPC-157", [
      { q: "What is oral BPC-157?", a: "A needle-free form discussed for gut-focused goals. It is not orderable at RE GEN. The bulk substance has no lawful §503A pathway today." },
      { q: "If I swallow it, is it legal?", a: "Route does not create bulk eligibility. We will not compound oral BPC-157 until the same FDA basis exists as for the injectable." },
    ], false),
  },
  "tb-500": {
    tagline: "A thymosin-beta-4 fragment used in repair marketing — PCAC recommended, not orderable yet.",
    what: "TB-500 is the name usually used for a fragment of thymosin beta-4, a peptide involved in actin regulation and tissue-repair research. It is the other half of “Wolverine” stacks with BPC-157. PCAC recommended it for the 503A bulks list in July 2026. RE GEN will not compound it until FDA lists it and the other gates are clear.",
    delivery: "Not orderable. No TB-500 vial or blend from RE GEN today.",
    why: [
      "Soft-tissue and systemic healing conversations",
      "Often paired with BPC-157 in ads",
      "PCAC recommended July 2026",
      "Vote ≠ vial",
    ],
    interests: [
      {
        n: "01",
        title: "Repair marketing vs repair evidence",
        body: "Actin-binding and cell-migration ideas show up in the literature. Human outcome claims on Instagram are not that literature.",
        bullets: ["Tissue-repair research interest", "Limited human trials", "No promised recovery time"],
      },
      {
        n: "02",
        title: "Stacks we will not send",
        body: "Wolverine, Glow, and Klow blends all fail because TB-500 and/or BPC-157 are not orderable.",
        bullets: ["Wolverine blend page", "Glow / Klow pages", "GHK-Cu topical can stand alone"],
      },
      {
        n: "03",
        title: "Tested athletes",
        body: "Peptide status with anti-doping codes is the athlete’s problem to check. We will not wink at a banned-substance workaround.",
        bullets: ["Ask your sport’s body", "We still cannot compound it", "Honesty first"],
      },
    ],
    animal: {
      lead: "Thymosin beta-4 / TB-500 literature includes animal models of wound healing and inflammation.",
      bullets: ["Actin and cell-migration mechanisms in research", "Not 503A listing yet", "Not orderable"],
    },
    human: {
      lead: "Human evidence is limited. PCAC recommendation is not approval.",
      bullets: ["Not orderable at RE GEN", "No healing-time promise", "Do not buy research TB-500"],
    },
    legal:
      "No lawful §503A pathway yet. PCAC recommended TB-500 for the 503A bulks list on July 23, 2026. Not orderable until FDA acts.",
    instead: [
      { label: "BPC-157 status", href: BPC },
      { label: "GHK-Cu topical", href: GHK },
      { label: "Thymosin Beta-4 card", href: peptideLearnHref("thymosin-beta-4") },
    ],
    faqs: faqs("TB-500", [
      { q: "What is TB-500?", a: "A thymosin beta-4 fragment discussed in tissue-repair research. PCAC recommended 503A listing in July 2026. Not orderable at RE GEN yet." },
      { q: "Is it the same as BPC-157?", a: "No. Different molecules. Both are under review and both are not orderable here today." },
    ], false),
  },
  "ghk-cu": {
    tagline: "Copper tripeptide for skin and scalp — eligible on non-injectable routes only.",
    what: "GHK-Cu is a copper-binding tripeptide found in human plasma and studied for collagen, wound, and skin-remodeling biology. RE GEN can discuss it as a topical (solution, foam, cream) because the eligible route is non-injectable. Injectable GHK-Cu is not on this pathway.",
    delivery: "Topical solution, foam, and cream when prescribed. Not an injectable from this pathway.",
    why: [
      "Collagen and skin-remodeling conversations",
      "Scalp and hair-adjacent topical use",
      "Lawful on non-injectable routes",
      "Blends that add BPC-157 or TB-500 are not orderable",
    ],
    interests: [
      {
        n: "01",
        title: "Skin quality, honestly",
        body: "People want glow, texture, and post-procedure support. We will not promise a facelift in a dropper.",
        bullets: ["Topical copper peptide", "Clinician-directed if prescribed", "No guaranteed “glow”"],
      },
      {
        n: "02",
        title: "Why not injectable?",
        body: "Route limits apply. The eligible conversation at RE GEN is topical. If a blend card promised injectable GHK-Cu plus BPC/TB-500, that blend is not orderable.",
        bullets: ["Topical only on this pathway", "Glow/Klow blends blocked by other ingredients", "Request GHK-Cu on its own"],
      },
      {
        n: "03",
        title: "Hair and scalp",
        body: "Copper-peptide topicals appear in hair-restoration compounding menus. That is still a clinician plan, not a miracle foam.",
        bullets: ["See dermatology compounding too", "From-price plus shipping", "Illinois clinician first"],
      },
    ],
    animal: {
      lead: "GHK-Cu has preclinical literature on wound healing, collagen, and antioxidant signaling.",
      bullets: ["Skin and tissue models", "Not an injectable green light here", "Mechanisms ≠ a promised photo result"],
    },
    human: {
      lead: "Cosmetic and compounding topical use is common; rigorous outcome claims should stay modest.",
      bullets: ["Topical eligibility is the legal point", "No guaranteed collagen number", "Compounded topical is not an FDA-approved drug"],
    },
    legal:
      "Eligible for non-injectable (e.g. topical) routes under the monograph / 503A bulks framework we use. Injectable GHK-Cu is not covered under this pathway. Compounded medications are not FDA-approved.",
    faqs: faqs("GHK-Cu", [
      { q: "What is GHK-Cu?", a: "A copper tripeptide studied in skin and wound biology. At RE GEN it is a topical conversation, not an injectable." },
      { q: "Can I get Glow Blend instead?", a: "Glow Blend includes BPC-157 and TB-500, which are not orderable. Request topical GHK-Cu on its own." },
    ], true),
  },
  kpv: {
    tagline: "An anti-inflammatory tripeptide PCAC recommended — not orderable until FDA lists it.",
    what: "KPV is a tripeptide fragment of alpha-MSH studied for anti-inflammatory and barrier-related research, including gut and skin models. PCAC recommended it for the 503A bulks list in July 2026. RE GEN will not compound it on a vote.",
    delivery: "Not orderable.",
    why: [
      "Gut, skin, and recovery-comfort conversations",
      "Alpha-MSH fragment research",
      "PCAC recommended July 2026",
      "Klow Blend is blocked because KPV (and others) are not orderable",
    ],
    interests: [
      {
        n: "01",
        title: "Why it is on repair menus",
        body: "Anti-inflammatory signaling is the pitch. Evidence is still largely preclinical. Availability is still no.",
        bullets: ["Barrier and inflammation models", "Not a diagnosis of colitis or eczema", "Not orderable"],
      },
      {
        n: "02",
        title: "Blends",
        body: "Klow Blend stacks GHK-Cu / KPV / BPC-157 / TB-500. Three of those four are not orderable. The blend is not orderable.",
        bullets: ["Request topical GHK-Cu alone", "See Klow page", "No partial gray-market stack"],
      },
      {
        n: "03",
        title: "After FDA, maybe",
        body: "If listing happens, we will add KPV with its basis. Until then, this page stays a no.",
        bullets: ["Confirmation, not a vote", "We will update copy", "Start a visit for carried options"],
      },
    ],
    animal: {
      lead: "KPV has preclinical anti-inflammatory and barrier literature.",
      bullets: ["Gut and skin models", "Not listing yet", "Not orderable"],
    },
    human: {
      lead: "Human data are limited. PCAC recommendation is not approval.",
      bullets: ["Not orderable", "No inflammation-score promise", "Do not buy research KPV"],
    },
    legal:
      "PCAC recommended KPV for the 503A bulks list on July 23, 2026. Not orderable at RE GEN until FDA acts.",
    instead: [
      { label: "GHK-Cu topical", href: GHK },
      { label: "Klow Blend status", href: peptideLearnHref("klow-blend") },
    ],
    faqs: faqs("KPV", [
      { q: "What is KPV?", a: "A tripeptide fragment of alpha-MSH studied for inflammation and barrier models. PCAC recommended listing in July 2026. Not orderable yet." },
      { q: "Can you put it in a glow blend?", a: "No. Blends that include KPV, BPC-157, or TB-500 are not orderable." },
    ], false),
  },
  cardiogen: {
    tagline: "A cardio-protective peptide in marketing decks — no lawful §503A pathway at RE GEN.",
    what: "Cardiogen is marketed as a bioregulator peptide for heart tissue resilience, often next to TB-500. Whatever the research story, RE GEN has no lawful 503A basis to compound it and will not.",
    delivery: "Not orderable.",
    why: [
      "Cardiac-resilience marketing",
      "Sometimes stacked with TB-500 in ads",
      "No pathway we can use",
      "We will not play cardiology on a peptide menu",
    ],
    interests: [
      {
        n: "01",
        title: "Why it appears on grids",
        body: "Complete menus include the names people screenshot. Completeness is not availability.",
        bullets: ["Asked-about", "Not carried", "Not a cardiac treatment claim"],
      },
      {
        n: "02",
        title: "Chest pain is not a peptide visit",
        body: "Cardiac symptoms need appropriate medical care. This page will not delay that.",
        bullets: ["Not emergency care", "Not a substitute for cardiology", "Call 911 for acute symptoms"],
      },
      {
        n: "03",
        title: "Repair peptides we can actually discuss",
        body: "Today that list does not include Cardiogen, BPC-157, or TB-500. GHK-Cu topical and sermorelin remain lawful conversations when they fit.",
        bullets: ["GHK-Cu", "Sermorelin", "Consult"],
      },
    ],
    animal: {
      lead: "Bioregulator peptide literature is mixed in quality and often preclinical.",
      bullets: ["Not a 503A basis here", "Not orderable", "Not a heart-disease treatment"],
    },
    human: {
      lead: "There is no RE GEN clinical program for Cardiogen because we cannot lawfully prepare it.",
      bullets: ["Not orderable", "No cardiac outcome claim", "Seek appropriate cardiac care when needed"],
    },
    legal: "No lawful §503A pathway at this time. We will not compound Cardiogen.",
    instead: [
      { label: "GHK-Cu topical", href: GHK },
      { label: "Sermorelin", href: SERMORELIN },
    ],
    faqs: faqs("Cardiogen", [
      { q: "What is Cardiogen?", a: "A peptide name that appears on repair menus. RE GEN has no lawful pathway to compound it." },
      { q: "I have heart disease. Should I start this?", a: "No. This is not cardiac treatment. Talk to your cardiologist. We will not compound Cardiogen." },
    ], false),
  },
  "wolverine-blend": {
    tagline: "BPC-157 / TB-500 in one vial — both lack a lawful pathway, so the blend is not orderable.",
    what: "“Wolverine” is marketing shorthand for stacking two repair peptides. Each component is still waiting on FDA action after the July 2026 PCAC recommendations. A blend cannot be more legal than its parts.",
    delivery: "Not orderable.",
    why: [
      "Most-asked repair stack",
      "Both molecules under FDA review",
      "Recommendation is not availability",
      "We will not send a combo research vial",
    ],
    interests: [
      {
        n: "01",
        title: "Why the nickname stuck",
        body: "Healing-factor branding is effective advertising. It is not a monograph.",
        bullets: ["BPC-157 + TB-500", "Both not orderable", "See the single-agent pages"],
      },
      {
        n: "02",
        title: "July 2026 does not unlock the stack",
        body: "Both were recommended. Neither is listed. The blend stays closed.",
        bullets: ["PCAC advises", "FDA lists later, maybe", "We wait for confirmation"],
      },
      {
        n: "03",
        title: "What we can request today",
        body: "Not this. Sermorelin or topical GHK-Cu when they fit the actual goal.",
        bullets: ["Sermorelin", "GHK-Cu topical", "A recovery visit without a blocked stack"],
      },
    ],
    animal: {
      lead: "Each component has preclinical repair literature. Stacking them in a vial does not change 503A.",
      bullets: ["Not orderable", "Not a healing guarantee", "Not WADA-cleared by a nickname"],
    },
    human: {
      lead: "There is no RE GEN Wolverine protocol because we cannot lawfully prepare it.",
      bullets: ["Not orderable", "Do not buy a research combo", "Read BPC-157 and TB-500 pages"],
    },
    legal:
      "BPC-157 and TB-500 both lack a lawful §503A pathway today. The blend is not orderable. PCAC recommendations in July 2026 are not a green light.",
    instead: [
      { label: "BPC-157", href: BPC },
      { label: "TB-500", href: TB500 },
      { label: "Sermorelin", href: SERMORELIN },
    ],
    faqs: faqs("Wolverine Blend", [
      { q: "What is Wolverine Blend?", a: "Marketing language for BPC-157 plus TB-500. Neither is orderable at RE GEN today, so the blend is not either." },
      { q: "If FDA lists both, will you make the blend?", a: "Only if each bulk substance is actually eligible and the finished preparation is permissible. We will not pre-sell that." },
    ], false),
  },
  "glow-blend": {
    tagline: "GHK-Cu / BPC-157 / TB-500 — the blend is not orderable. Topical GHK-Cu can stand alone.",
    what: "Glow Blend is a skin-and-repair marketing stack. Two of the three ingredients have no lawful 503A pathway today. We will not compound the blend. We will discuss topical GHK-Cu on its own.",
    delivery: "Blend not orderable. GHK-Cu topical is a separate request.",
    why: [
      "Skin “glow” plus repair branding",
      "BPC-157 and TB-500 are not orderable",
      "GHK-Cu topical remains eligible",
      "Honesty over a pretty name",
    ],
    interests: [
      {
        n: "01",
        title: "What the name is selling",
        body: "Collagen, healing, and radiance in one vial. Two-thirds of that vial is not legal to compound here today.",
        bullets: ["See GHK-Cu page", "See BPC-157 and TB-500 status", "No injectable glow stack"],
      },
      {
        n: "02",
        title: "Skin goals we can actually compound",
        body: "Dermatology compounding and topical GHK-Cu when a clinician decides they fit.",
        bullets: ["Dermatology hub", "GHK-Cu topical", "No BPC skin injections"],
      },
      {
        n: "03",
        title: "Klow is not a loophole",
        body: "Adding KPV makes the legal file worse, not better.",
        bullets: ["Klow page", "KPV page", "Still not orderable"],
      },
    ],
    animal: {
      lead: "Each ingredient has its own preclinical story. The blend does not inherit a 503A basis.",
      bullets: ["Not orderable as a blend", "Do not inject a research glow vial", "Topical GHK-Cu is the lawful skin peptide conversation"],
    },
    human: {
      lead: "No RE GEN Glow Blend program, because we cannot lawfully prepare it.",
      bullets: ["Not orderable", "No radiance guarantee in any case", "Request GHK-Cu topical instead"],
    },
    legal:
      "BPC-157 and TB-500 are not orderable. The blend is not orderable. Topical GHK-Cu can be requested on its own.",
    instead: [
      { label: "GHK-Cu topical", href: GHK },
      { label: "Klow Blend status", href: peptideLearnHref("klow-blend") },
    ],
    faqs: faqs("Glow Blend", [
      { q: "What is Glow Blend?", a: "GHK-Cu plus BPC-157 plus TB-500. The blend is not orderable at RE GEN. Topical GHK-Cu can be requested alone." },
      { q: "Can you drop the illegal parts and send GHK-Cu?", a: "Yes — that is the GHK-Cu topical page, not this blend." },
    ], false),
  },
  "klow-blend": {
    tagline: "GHK-Cu / KPV / BPC-157 / TB-500 — four names, one legal no.",
    what: "Klow Blend adds KPV to the Glow idea. KPV, BPC-157, and TB-500 are all in the PCAC-recommended-but-not-listed bucket. The blend cannot be compounded. Topical GHK-Cu remains the piece with a pathway.",
    delivery: "Blend not orderable.",
    why: [
      "Advanced “repair + glow + calm” marketing",
      "Three of four ingredients not orderable",
      "Same July 2026 vote story",
      "GHK-Cu topical can be requested alone",
    ],
    interests: [
      {
        n: "01",
        title: "Why it is on the grid twice",
        body: "It shows up under repair and under skin because that is how patients screenshot menus. One legal file.",
        bullets: ["Same blend", "Same no", "GHK-Cu still yes as topical"],
      },
      {
        n: "02",
        title: "KPV does not unlock BPC",
        body: "Adding another unlisted peptide does not create a basis for the first two.",
        bullets: ["KPV page", "BPC-157 page", "TB-500 page"],
      },
      {
        n: "03",
        title: "What to request instead",
        body: "Topical GHK-Cu, or a dermatology visit for compounded topicals that are actually eligible.",
        bullets: ["GHK-Cu", "Dermatology hub", "Consult"],
      },
    ],
    animal: {
      lead: "Four preclinical stories stacked in a vial still fail 503A if three ingredients have no pathway.",
      bullets: ["Not orderable", "Not an anti-inflammatory guarantee", "Do not buy a research Klow"],
    },
    human: {
      lead: "No RE GEN Klow program.",
      bullets: ["Not orderable", "No skin or gut promise", "Request what is carried"],
    },
    legal:
      "Contains peptides without a lawful pathway. Not orderable as a blend. PCAC recommendations are not a green light. Topical GHK-Cu can be requested on its own.",
    instead: [
      { label: "GHK-Cu topical", href: GHK },
      { label: "Glow Blend status", href: peptideLearnHref("glow-blend") },
      { label: "KPV status", href: peptideLearnHref("kpv") },
    ],
    faqs: faqs("Klow Blend", [
      { q: "What is Klow Blend?", a: "GHK-Cu, KPV, BPC-157, and TB-500. Not orderable at RE GEN. Request topical GHK-Cu alone if skin is the goal." },
      { q: "Is it more legal than Glow because KPV was recommended?", a: "No. Recommendation is not listing, and the blend still contains multiple substances without a pathway." },
    ], false),
  },
  "ara-290": {
    tagline: "An EPO-derived peptide in neuropathic-pain marketing — no lawful §503A pathway.",
    what: "ARA-290 (cibinetide) is derived from erythropoietin structure and studied for neuropathic pain and tissue-protection research. It is not something RE GEN can lawfully compound today, and we will not treat this page as pain-clinic advertising.",
    delivery: "Not orderable.",
    why: [
      "Neuropathic-pain conversations",
      "EPO-derived tissue-protection research",
      "No 503A pathway we can use",
      "Pain goals still deserve a real visit — without this molecule",
    ],
    interests: [
      {
        n: "01",
        title: "Why it is on pain menus",
        body: "Innate-repair-receptor ideas made it a research celebrity. Celebrity is not a vial.",
        bullets: ["Neuropathic-pain research interest", "Not a diagnosis of your nerve pain", "Not orderable"],
      },
      {
        n: "02",
        title: "Pain is not a peptide we will fake",
        body: "If you are in pain, you need appropriate evaluation. We will not gray-market ARA-290 while you wait.",
        bullets: ["Consult for carried options", "No promised pain score", "Emergency symptoms need emergency care"],
      },
      {
        n: "03",
        title: "Curcumin injectable is a different card",
        body: "That is a clinician-directed anti-inflammatory conversation with a different legal file.",
        bullets: ["Curcumin page", "Not interchangeable", "Clinician decides"],
      },
    ],
    animal: {
      lead: "ARA-290 has preclinical neuropathic and tissue-protection literature.",
      bullets: ["Not 503A eligibility here", "Not orderable", "Not a pain cure"],
    },
    human: {
      lead: "Human development exists in other lanes. It does not open compounding at RE GEN.",
      bullets: ["Not orderable", "No neuropathic-pain guarantee", "Do not buy research ARA-290"],
    },
    legal: "No lawful §503A pathway at this time. We will not compound ARA-290.",
    instead: [{ label: "Curcumin (injectable)", href: peptideLearnHref("curcumin") }],
    faqs: faqs("ARA-290", [
      { q: "What is ARA-290?", a: "Cibinetide — an EPO-derived peptide studied in neuropathic-pain research. Not orderable at RE GEN." },
      { q: "Can you help with pain another way?", a: "Start a visit or consult. We will not compound ARA-290. A clinician can talk about what is carried." },
    ], false),
  },
  curcumin: {
    tagline: "Injectable curcumin as a clinician-directed anti-inflammatory conversation — not a spice-rack protocol.",
    what: "Curcumin is the studied constituent of turmeric. Oral absorption is famously poor; injectable compounding is how some clinics put it into a medical visit. It is not a peptide. It is still a clinician decision, and it is not a promised arthritis cure.",
    delivery: "Clinician-directed injectable when prescribed. Course length is not a DIY schedule on this page.",
    why: [
      "Systemic inflammation conversations",
      "Joint-comfort interest",
      "Bioavailability is the reason people ask for injectable",
      "Available to request through a visit",
    ],
    interests: [
      {
        n: "01",
        title: "Why injectable, not golden milk",
        body: "Oral curcumin has a bioavailability problem. That is a real PK story. It is not a guarantee that an injection will fix pain.",
        bullets: ["Clinician-directed if used", "Not a food claim", "No promised joint result"],
      },
      {
        n: "02",
        title: "Not ARA-290",
        body: "Different molecule, different legal file. Curcumin can be a visit. ARA-290 cannot.",
        bullets: ["See ARA-290 status", "Do not stack research peptides for pain", "Med-list review matters"],
      },
      {
        n: "03",
        title: "Anticoagulants and bile issues",
        body: "Turmeric/curcumin conversations include bleeding risk and gallbladder history. Bring the med list.",
        bullets: ["Clinician screening", "Sometimes the answer is no", "Refund if not prescribed"],
      },
    ],
    animal: {
      lead: "Curcumin has a very large preclinical anti-inflammatory literature.",
      bullets: ["Mechanistic abundance", "Translation to humans is the hard part", "Not a cure claim"],
    },
    human: {
      lead: "Human data for oral curcumin are mixed; injectable compounding is a narrower clinic practice. We will not oversell.",
      bullets: ["Clinician-directed", "No guaranteed pain reduction", "Compounded injectable is not an FDA-approved pain drug"],
    },
    legal:
      "Available to request when a licensed Illinois clinician decides it belongs in the plan. Compounded medications are not FDA-approved.",
    faqs: faqs("injectable curcumin", [
      { q: "What is injectable curcumin?", a: "A clinician-directed anti-inflammatory conversation using curcumin in an injectable compounded form when prescribed. It is not a peptide and not a spice supplement." },
      { q: "Can I just take turmeric instead?", a: "You can discuss supplements with your own clinician. This page is about a prescription compounding visit, not grocery turmeric." },
    ], true),
  },
  "cjc-ipamorelin": {
    tagline: "The classic 2X GH stack — both molecules lack a lawful pathway.",
    what: "2X Blend (CJC-1295 / ipamorelin) is the default GH stack on a thousand landing pages. Neither bulk substance has a lawful §503A pathway at RE GEN. The blend is not orderable. Sermorelin is the GHRH analog we can actually discuss.",
    delivery: "Not orderable.",
    why: [
      "Most-copied GH marketing stack",
      "CJC-1295: no pathway",
      "Ipamorelin: no pathway",
      "Sermorelin is the honest replacement conversation",
    ],
    interests: [
      {
        n: "01",
        title: "Why every menu had this",
        body: "GHRH plus GHRP is pharmacologically tidy. Tidy is not legal.",
        bullets: ["See CJC pages", "See ipamorelin page", "See sermorelin page"],
      },
      {
        n: "02",
        title: "DAC or no DAC, still no",
        body: "Changing the CJC variant does not add ipamorelin eligibility.",
        bullets: ["No DAC page", "With DAC page", "Both not orderable"],
      },
      {
        n: "03",
        title: "What we request instead",
        body: "Sermorelin, or tesamorelin when the copy rule is documented.",
        bullets: ["Sermorelin", "Tesamorelin", "No secret 2X"],
      },
    ],
    animal: {
      lead: "Stacking GHRH and GHRP is common in research talk.",
      bullets: ["Not 503A", "Not orderable", "Not a lean-mass promise"],
    },
    human: {
      lead: "No RE GEN 2X program.",
      bullets: ["Not orderable", "Do not buy a research blend", "Read sermorelin"],
    },
    legal:
      "Neither CJC-1295 nor ipamorelin has a lawful §503A pathway. We will not compound this blend.",
    instead: [
      { label: "Sermorelin", href: SERMORELIN },
      { label: "Ipamorelin status", href: peptideLearnHref("ipamorelin") },
    ],
    faqs: faqs("CJC / ipamorelin 2X blend", [
      { q: "What is the 2X blend?", a: "CJC-1295 plus ipamorelin, marketed as a GH stack. Not orderable at RE GEN." },
      { q: "Is sermorelin the same thing?", a: "No, but it is the GHRH analog with a documented basis we can discuss. A clinician still decides." },
    ], false),
  },
  "ll-37": {
    tagline: "A host-defense peptide asked about in illness — no lawful §503A pathway.",
    what: "LL-37 is a cathelicidin antimicrobial peptide involved in innate immunity. Illness-only marketing is still marketing. RE GEN cannot lawfully compound it and will not offer it “when you are sick.”",
    delivery: "Not orderable — during illness or otherwise.",
    why: [
      "Acute immune-defense conversations",
      "Antimicrobial peptide research",
      "No 503A pathway",
      "Infection still needs appropriate medical care",
    ],
    interests: [
      {
        n: "01",
        title: "Why people text us when they are sick",
        body: "Innate-immunity science is compelling when you have a virus. Compelling is not compoundable.",
        bullets: ["Not an antibiotic substitute", "Not orderable", "See actual medical care for infection"],
      },
      {
        n: "02",
        title: "TA-1 is also no",
        body: "Thymosin Alpha-1 is a different immune modulator and also has no pathway here.",
        bullets: ["TA-1 page", "Neither is a flu peptide we can send", "Do not stack research immune vials"],
      },
      {
        n: "03",
        title: "What we will do",
        body: "Tell you no, and help you start a visit for carried wellness tools after you are appropriately evaluated.",
        bullets: ["No gray-market LL-37", "No “just this once”", "Honesty is the immune protocol"],
      },
    ],
    animal: {
      lead: "LL-37 has substantial innate-immunity preclinical literature.",
      bullets: ["Not 503A eligibility", "Not orderable", "Not an infection treatment we sell"],
    },
    human: {
      lead: "Human research exists; it does not open compounding at RE GEN. This page is not infectious-disease care.",
      bullets: ["Not orderable", "Seek appropriate care for infection", "Do not delay antibiotics for a research peptide"],
    },
    legal: "No lawful §503A pathway at this time. We will not compound LL-37.",
    instead: [{ label: "Thymosin Alpha-1 status", href: peptideLearnHref("thymosin-alpha-1") }],
    faqs: faqs("LL-37", [
      { q: "What is LL-37?", a: "A cathelicidin host-defense peptide. Not orderable at RE GEN, including during illness." },
      { q: "I’m sick — can you overnight it?", a: "No. We cannot compound it. Get appropriate medical care for infection." },
    ], false),
  },
  "thymosin-alpha-1": {
    tagline: "An immune-modulator peptide — not nominated, no lawful §503A pathway.",
    what: "Thymosin alpha-1 (TA-1, thymalfasin) has a real pharmaceutical history in some countries as an immune modulator. In the U.S. 503A compounding lane RE GEN uses, it is not nominated into a pathway we can use. We will not compound it.",
    delivery: "Not orderable.",
    why: [
      "T-cell / immune-modulator conversations",
      "“When sick, twice a week” marketing",
      "Not nominated / no pathway here",
      "Not a substitute for vaccines or indicated antivirals",
    ],
    interests: [
      {
        n: "01",
        title: "Why immune menus include it",
        body: "Thymic peptide research is decades old. U.S. compounding eligibility is a different question.",
        bullets: ["Immune-modulator interest", "Not orderable at RE GEN", "Not a COVID protocol we sell"],
      },
      {
        n: "02",
        title: "Not TB-500",
        body: "Thymosin alpha-1 and thymosin beta-4 / TB-500 are different molecules with different legal files. Both are no for us today, for different reasons.",
        bullets: ["TA-1: not nominated", "TB-500: PCAC recommended, not listed", "Neither is orderable"],
      },
      {
        n: "03",
        title: "Illness still needs real care",
        body: "Do not wait on a peptide landing page if you have an infection or are immunocompromised without a physician.",
        bullets: ["Appropriate medical care first", "We will not gray-market TA-1", "Start a visit for carried tools later"],
      },
    ],
    animal: {
      lead: "Thymosin alpha-1 has preclinical immune-modulation literature.",
      bullets: ["Not 503A eligibility here", "Not orderable", "Not a vaccine replacement"],
    },
    human: {
      lead: "Thymalfasin is used in some countries as a drug. That does not create a 503A basis for RE GEN today.",
      bullets: ["Not orderable", "No immune-score promise", "Do not buy research TA-1"],
    },
    legal: "Not nominated / no lawful §503A pathway at this time. We will not compound thymosin alpha-1.",
    instead: [
      { label: "LL-37 status", href: peptideLearnHref("ll-37") },
      { label: "TB-500 status", href: TB500 },
    ],
    faqs: faqs("thymosin alpha-1", [
      { q: "What is thymosin alpha-1?", a: "An immune-modulator peptide (thymalfasin). Not nominated into a lawful 503A pathway RE GEN can use. Not orderable." },
      { q: "Is it the same as TB-500?", a: "No. Different thymosin. Different legal status. Neither is orderable here today." },
    ], false),
  },
  "thymosin-beta-4": {
    tagline: "Thymosin beta-4 is the parent story; TB-500 is the fragment people shop — same operational no today.",
    what: "Thymosin beta-4 is a native peptide involved in actin regulation. TB-500 is the fragment name on most clinic menus. PCAC recommended TB-500 for the 503A bulks list in July 2026. Until FDA lists it, RE GEN will not compound thymosin beta-4 or TB-500.",
    delivery: "Not orderable.",
    why: [
      "Systemic healing and inflammation-control conversations",
      "Parent molecule vs TB-500 fragment naming",
      "PCAC recommended the fragment for listing",
      "Still not orderable",
    ],
    interests: [
      {
        n: "01",
        title: "Name confusion, on purpose",
        body: "Vendors blur TB-4 and TB-500. We put both cards on the grid so the no is visible either way you search.",
        bullets: ["See TB-500 page for the fragment evidence layout", "Same compounding answer", "No systemic healing vial today"],
      },
      {
        n: "02",
        title: "Not thymosin alpha-1",
        body: "Different peptide, different legal reason for no.",
        bullets: ["TA-1 page", "Do not stack thymosins from research sites", "Ask what is carried"],
      },
      {
        n: "03",
        title: "Repair tools we can discuss",
        body: "Sermorelin and topical GHK-Cu when they actually fit the goal.",
        bullets: ["Sermorelin", "GHK-Cu topical", "Consult"],
      },
    ],
    animal: {
      lead: "Thymosin beta-4 has a broad preclinical repair literature; TB-500 is discussed as an active fragment.",
      bullets: ["Not listing yet", "Not orderable", "Not a healing-time promise"],
    },
    human: {
      lead: "Human evidence remains limited. PCAC recommendation of TB-500 is not approval of either name.",
      bullets: ["Not orderable", "Do not buy research TB-4", "Read the TB-500 page"],
    },
    legal:
      "No lawful §503A pathway yet. PCAC recommended TB-500 in July 2026. Not orderable until FDA acts. We will not compound thymosin beta-4 / TB-500.",
    instead: [
      { label: "TB-500", href: TB500 },
      { label: "Sermorelin", href: SERMORELIN },
      { label: "GHK-Cu topical", href: GHK },
    ],
    faqs: faqs("thymosin beta-4", [
      { q: "What is thymosin beta-4?", a: "A native actin-regulating peptide. TB-500 is the fragment name on most menus. Neither is orderable at RE GEN today." },
      { q: "Did PCAC approve it?", a: "PCAC recommended TB-500 for the 503A bulks list in July 2026. That is not FDA listing and not a vial." },
    ], false),
  },
};

export function getPeptideLearnPage(slug: string): PeptideLearnPage | undefined {
  const card = findShowcaseCard(slug);
  const copy = COPY[slug];
  if (!card || !copy) return undefined;
  return { card, ...copy };
}

export function peptideLearnCanonical(slug: string) {
  return `https://tryregenrx.com/peptides/${slug}`;
}

export const PEPTIDE_LEARN_REVIEWED = FORMULATION_PEPTIDE_REVIEWED;
