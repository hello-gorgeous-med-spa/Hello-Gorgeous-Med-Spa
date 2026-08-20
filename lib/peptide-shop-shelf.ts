/**
 * The Peptide Shop — curated /rx shelf from the standalone RE GEN shop mock.
 * Prices are BoomRx wholesale × 2.5 (same as the client catalog). GLP-1 uses
 * published program from-prices. No client cart — every card starts intake.
 */

import { boomrxConsumerMonthlyUsd } from "@/lib/boomrx-consumer-pricing";
import { GLP1_INTAKE_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { getPeptideBoomRxCatalogEntry } from "@/lib/peptide-boomrx-catalog";
import { GLP1_RETAIL_PROGRAM, getPeptideRetailMonthlyUsd } from "@/lib/peptide-retail-pricing";
import { protocolPath, isPublishedProtocolDrugKey, FLAGSHIP_PROTOCOL_PATHS } from "@/lib/regen/catalog/protocol-pages";

const IMG = "/images/peptide-shop";

function peptideIntake(peptide: string) {
  const params = new URLSearchParams({
    peptide,
    type: "new",
    source: "peptide-shop",
  });
  return `${PEPTIDE_REQUEST_PATH}?${params.toString()}`;
}

function glp1Intake(productName: string) {
  const params = new URLSearchParams({
    type: "new",
    productName,
    source: "peptide-shop",
  });
  return `${GLP1_INTAKE_PATH}?${params.toString()}`;
}

function fromVial(menuId: string, fallbackWholesale: number) {
  const row = getPeptideBoomRxCatalogEntry(menuId);
  return boomrxConsumerMonthlyUsd(row?.wholesalePerVialUsd ?? fallbackWholesale);
}

function learnHref(drugKey: string) {
  if (FLAGSHIP_PROTOCOL_PATHS[drugKey]) return FLAGSHIP_PROTOCOL_PATHS[drugKey];
  return isPublishedProtocolDrugKey(drugKey) ? protocolPath(drugKey) : undefined;
}

export type PeptideShopCard = {
  name: string;
  tag?: string;
  spec: string;
  expect: string;
  image: string;
  imageAlt: string;
  href: string;
  learnHref?: string;
  fromUsd?: number;
  pricedAtConsult?: boolean;
};

export type PeptideShopSection = {
  id: string;
  title: string;
  intro?: string;
  cards: PeptideShopCard[];
};

export const PEPTIDE_SHOP_NAV = [
  { href: "#glp1", label: "Weight Loss" },
  { href: "#growth", label: "Growth Hormone" },
  { href: "#repair", label: "Repair" },
  { href: "#cognitive", label: "Cognitive" },
  { href: "#longevity", label: "Longevity" },
  { href: "#skin", label: "Skin" },
  { href: "#immune", label: "Immune" },
  { href: "#hormone", label: "Hormone" },
  { href: "#pain", label: "Pain" },
] as const;

export const PEPTIDE_SHOP_BEFORE = [
  "Every order is reviewed by Ryan Kent, FNP-BC before it ships — nothing is approved automatically",
  "Cycling matters: most peptides are dosed for a defined stretch (e.g. 8 weeks on / 8 weeks off), not continuously",
  "Store vials refrigerated and reconstitute/handle exactly as instructed at your consult",
  "Tell your provider about any current medications, conditions, or prior peptide use",
] as const;

export const PEPTIDE_SHOP_FAQS = [
  {
    q: "How is a peptide different from a typical medication?",
    a: "Peptides are naturally occurring signaling molecules — short amino-acid chains your body already produces and recognizes. Rather than blocking or forcing a process, they nudge existing pathways (like GH release or tissue repair) to work more efficiently.",
  },
  {
    q: "Why are some peptides sold as blends?",
    a: "Certain peptides work synergistically — for example, GHK-Cu and BPC-157 both support tissue repair through different mechanisms, so combining them can compound the benefit. Your provider will confirm a blend fits your goals before approving it.",
  },
  {
    q: "Do I take these forever, or in cycles?",
    a: "Most peptides are dosed for a defined cycle (commonly 8 weeks on / 8 weeks off) rather than continuously, to preserve their effectiveness and let your body's own signaling reset. Your protocol sheet will specify your exact schedule.",
  },
  {
    q: "How do I know which vial is right for me?",
    a: "Start with a consult. Ryan Kent, FNP-BC reviews your goals, history, and labs, then recommends a specific peptide or blend and dosing schedule before anything is approved for order.",
  },
] as const;

const BLEND_WHOLESALE = 80;
const SINGLE_WHOLESALE = 70;
const NAD_WHOLESALE = 60;
const GENERIC_VIAL = "/images/regen/catalog/regen-generic-injectable.jpg";
const GENERIC_ORAL = "/images/regen/catalog/regen-generic-oral.jpg";

function vial(file: string) {
  if (file.startsWith("/")) return file;
  return `${IMG}/${file}`;
}

function shopCard(opts: {
  name: string;
  spec: string;
  expect: string;
  href: string;
  image: string;
  tag?: string;
  learnKey?: string;
  menuId?: string;
  wholesale?: number;
  fromUsd?: number;
  pricedAtConsult?: boolean;
}): PeptideShopCard {
  const fromUsd = opts.pricedAtConsult
    ? undefined
    : (opts.fromUsd ?? fromVial(opts.menuId ?? "", opts.wholesale ?? SINGLE_WHOLESALE));
  return {
    name: opts.name,
    tag: opts.tag,
    spec: opts.spec,
    expect: opts.expect,
    image: opts.image,
    imageAlt: `${opts.name} — Hello Gorgeous RX`,
    href: opts.href,
    learnHref: opts.learnKey ? learnHref(opts.learnKey) : undefined,
    fromUsd,
    pricedAtConsult: opts.pricedAtConsult,
  };
}

export const PEPTIDE_SHOP_SECTIONS: PeptideShopSection[] = [
  {
    id: "glp1",
    title: "Weight Loss Peptides",
    intro:
      "Weekly GLP-1 protocols and metabolic peptides — dose set by your NP after labs, not a cart.",
    cards: [
      shopCard({
        name: "Tirzepatide",
        tag: "GLP-1 / GIP",
        spec: "Weekly injection · dose titrated at consult",
        expect: "Dual GIP/GLP-1 protocol for appetite and metabolic support under NP supervision.",
        image: vial("tirzepatide.png"),
        href: glp1Intake("Tirzepatide"),
        learnKey: "tirzepatide",
        fromUsd: GLP1_RETAIL_PROGRAM.tirzepatideFromUsd,
      }),
      shopCard({
        name: "Semaglutide",
        tag: "GLP-1",
        spec: "Weekly injection · dose titrated at consult",
        expect: "GLP-1 receptor agonist for appetite control and metabolic health.",
        image: vial("semaglutide.png"),
        href: glp1Intake("Semaglutide"),
        learnKey: "semaglutide",
        fromUsd: GLP1_RETAIL_PROGRAM.semaglutideFromUsd,
      }),
      shopCard({
        name: "AOD-9604",
        spec: "2mg/mL · 5mL vial · cycle set at consult",
        expect: "A fat-metabolism fragment often paired with a broader weight-management plan.",
        image: vial("aod-9604.png"),
        href: peptideIntake("aod-9604"),
        menuId: "aod-9604",
      }),
      shopCard({
        name: "Matched at consult",
        spec: "Provider-selected",
        expect: "Additional metabolic options are matched to your labs and goals — nothing is picked off a shelf.",
        image: GENERIC_VIAL,
        href: glp1Intake("Weight loss"),
        pricedAtConsult: true,
      }),
    ],
  },
  {
    id: "growth",
    title: "Muscle & Growth Hormone",
    intro:
      "Peptides that encourage your own growth-hormone rhythm — lean mass, sleep, recovery, and body composition.",
    cards: [
      shopCard({
        name: "Ipamorelin",
        spec: "GH pulse · cycle set at consult",
        expect: "A selective GH-releasing peptide, often stacked with CJC-1295.",
        image: vial("cjc-ipamorelin.png"),
        href: peptideIntake("ipamorelin"),
        menuId: "ipamorelin",
        wholesale: BLEND_WHOLESALE,
      }),
      shopCard({
        name: "Sermorelin",
        spec: "1.5mg/mL · cycle set at consult",
        expect: "GHRH analog for natural GH signaling, sleep quality, and recovery.",
        image: "/images/regen/catalog/sermorelin.png",
        href: peptideIntake("sermorelin"),
        learnKey: "sermorelin",
        menuId: "sermorelin",
        wholesale: 60,
      }),
      shopCard({
        name: "Tesamorelin",
        spec: "3mg/mL · 5mL vial",
        expect: "GHRH analog used in body-composition protocols under NP supervision.",
        image: vial("tesamorelin.png"),
        href: peptideIntake("tesamorelin"),
        learnKey: "tesamorelin",
        menuId: "tesamorelin",
      }),
      shopCard({
        name: "Tesamorelin / Ipamorelin",
        tag: "Blend",
        spec: "3mg / 2mg per mL · 5mL vial",
        expect: "Pairs visceral-fat-focused GH release with a clean GH pulse.",
        image: vial("tesamorelin-ipamorelin.png"),
        href: peptideIntake("tesamorelin"),
        wholesale: BLEND_WHOLESALE,
      }),
      shopCard({
        name: "CJC-1295 / Ipamorelin",
        tag: "Blend",
        spec: "1mg / 1mg per mL · 5mL vial",
        expect: "The GH stack clients ask for most — sleep, recovery, and lean composition.",
        image: vial("cjc-ipamorelin.png"),
        href: peptideIntake("cjc-ipamorelin"),
        learnKey: "cjc-ipamorelin",
        menuId: "cjc-1295",
        wholesale: BLEND_WHOLESALE,
      }),
      shopCard({
        name: "MOTS-c / Tesamorelin",
        tag: "Blend",
        spec: "2mg / 3mg per mL · 5mL vial",
        expect: "Mitochondrial signaling plus GH support for metabolic and energy goals.",
        image: vial("mots-tesamorelin.png"),
        href: peptideIntake("mots-c"),
        wholesale: BLEND_WHOLESALE,
      }),
    ],
  },
  {
    id: "repair",
    title: "Tissue Repair & Healing",
    intro:
      "BPC-157, TB-500, GHK-Cu, and KPV — studied for tissue comfort, gut lining, and recovery after training or injury.",
    cards: [
      shopCard({
        name: "BPC-157 (injectable)",
        spec: "3mg/mL · 5mL vial",
        expect: "Our most-requested repair peptide for muscle, tendon, ligament, and gut support.",
        image: vial("bpc-157.png"),
        href: peptideIntake("bpc-157"),
        learnKey: "bpc157",
        menuId: "bpc-157",
      }),
      shopCard({
        name: "BPC-157 (oral)",
        spec: "Capsules · needle-free",
        expect: "Oral delivery when injections are not the right fit — often used for gut-lining support.",
        image: GENERIC_ORAL,
        href: peptideIntake("bpc-157-caps"),
        menuId: "bpc-157-caps",
        fromUsd: getPeptideRetailMonthlyUsd("bpc-157-caps") ?? 115,
      }),
      shopCard({
        name: "TB-500",
        spec: "3mg/mL · 5mL vial",
        expect: "Supports flexibility and soft-tissue recovery; frequently paired with BPC-157.",
        image: vial("tb-500.png"),
        href: peptideIntake("tb-500"),
        learnKey: "tb500",
        menuId: "tb-500",
      }),
      shopCard({
        name: "GHK-Cu",
        spec: "10mg/mL · 5mL vial",
        expect: "Copper peptide for collagen support, skin renewal, and wound-healing protocols.",
        image: vial("ghk-cu.png"),
        href: peptideIntake("ghk-cu"),
        menuId: "ghk-cu",
      }),
      shopCard({
        name: "KPV",
        spec: "Compounded vial · cycle set at consult",
        expect: "Anti-inflammatory tripeptide used for gut, skin, and recovery comfort.",
        image: GENERIC_VIAL,
        href: peptideIntake("kpv"),
        menuId: "kpv",
      }),
      shopCard({
        name: "Cardiogen",
        spec: "Cycle set at consult",
        expect: "A cardiovascular tissue-support peptide — matched only when your NP says it fits.",
        image: GENERIC_VIAL,
        href: peptideIntake("cardiogen"),
        menuId: "cardiogen",
      }),
      shopCard({
        name: "BPC-157 / TB-500",
        tag: "Blend",
        spec: "3mg / 3mg per mL · 5mL vial",
        expect: "The classic recovery stack for muscle, tendon, and ligament healing.",
        image: vial("bpc-tb.png"),
        href: peptideIntake("bpc-157"),
        wholesale: BLEND_WHOLESALE,
      }),
      shopCard({
        name: "HEAL Blend",
        tag: "Blend",
        spec: "BPC-157 / KPV / TB-500 · 5mL",
        expect: "Tissue repair plus gut or skin inflammation support in one vial.",
        image: vial("heal-blend.png"),
        href: peptideIntake("heal-blend"),
        menuId: "heal-blend",
        wholesale: BLEND_WHOLESALE,
      }),
      shopCard({
        name: "Recovery Blend",
        tag: "Blend",
        spec: "BPC-157 / GHK-Cu / KPV / TB-500 · 5mL",
        expect: "Our most complete repair stack — four peptides, one provider-reviewed vial.",
        image: vial("recovery-blend.png"),
        href: peptideIntake("recovery-blend"),
        menuId: "recovery-blend",
        wholesale: BLEND_WHOLESALE,
      }),
    ],
  },
  {
    id: "cognitive",
    title: "Cognitive / Stress / Sleep",
    intro: "Focus, calm, and sleep-support peptides — prescribed only after your NP reviews your history.",
    cards: [
      shopCard({
        name: "Selank",
        spec: "Compounded vial · cycle set at consult",
        expect: "Studied for calm, stress resilience, and mental clarity.",
        image: GENERIC_VIAL,
        href: peptideIntake("selank"),
        menuId: "selank",
      }),
      shopCard({
        name: "Semax",
        spec: "Compounded vial · cycle set at consult",
        expect: "Nootropic peptide studied for focus, memory, and mental performance.",
        image: GENERIC_VIAL,
        href: peptideIntake("semax"),
        menuId: "semax",
      }),
      shopCard({
        name: "DSIP",
        spec: "Often stacked · cycle set at consult",
        expect: "Delta sleep-inducing peptide used in restorative-sleep protocols — not a nightly default.",
        image: GENERIC_VIAL,
        href: peptideIntake("dsip"),
        menuId: "dsip",
        wholesale: BLEND_WHOLESALE,
      }),
      shopCard({
        name: "Methylene Blue",
        spec: "Low-dose capsules",
        expect: "Mitochondrial and cognitive support. Tell your NP about every antidepressant — interactions matter.",
        image: GENERIC_ORAL,
        href: peptideIntake("methylene-blue"),
        menuId: "methylene-blue",
      }),
    ],
  },
  {
    id: "longevity",
    title: "Longevity",
    intro: "Cellular energy, mitochondrial support, and healthy-aging peptides under NP supervision.",
    cards: [
      shopCard({
        name: "Epithalon",
        spec: "Compounded vial · short cycles",
        expect: "Research peptide studied for sleep-wake rhythm and cellular-aging pathways.",
        image: GENERIC_VIAL,
        href: peptideIntake("epithalon"),
        menuId: "epithalon",
      }),
      shopCard({
        name: "MOTS-c",
        spec: "2mg/mL · 5mL vial",
        expect: "Mitochondrial peptide studied for metabolic health and exercise capacity.",
        image: vial("mots-tesamorelin.png"),
        href: peptideIntake("mots-c"),
        menuId: "mots-c",
      }),
      shopCard({
        name: "NAD+",
        spec: "100mg/mL · 10mL vial",
        expect: "Coenzyme for cellular energy and DNA repair — many clients notice clearer energy within days.",
        image: vial("nad-plus.png"),
        href: peptideIntake("nad-plus"),
        learnKey: "nad",
        menuId: "nad-plus",
        wholesale: NAD_WHOLESALE,
      }),
    ],
  },
  {
    id: "skin",
    title: "Skin Health / Blends",
    intro: "Collagen, glow, and repair stacks — often paired with in-office treatments.",
    cards: [
      shopCard({
        name: "Glow Blend",
        tag: "Blend",
        spec: "BPC-157 / TB-500 / GHK-Cu · 5mL",
        expect: "Skin and healing blend for collagen support, tissue repair, and visible glow.",
        image: vial("glow-blend.png"),
        href: peptideIntake("k-glow"),
        menuId: "k-glow",
        wholesale: BLEND_WHOLESALE,
      }),
      shopCard({
        name: "Recovery Blend",
        tag: "Blend",
        spec: "GHK-Cu / KPV / BPC-157 / TB-500 · 5mL",
        expect: "Advanced skin and anti-inflammatory stack for radiance plus repair.",
        image: vial("recovery-blend.png"),
        href: peptideIntake("recovery-blend"),
        menuId: "recovery-blend",
        wholesale: BLEND_WHOLESALE,
      }),
      shopCard({
        name: "CJC-1295 / Ipamorelin",
        tag: "Blend",
        spec: "1mg / 1mg per mL · 5mL vial",
        expect: "GH-release blend also used in anti-aging and recovery protocols.",
        image: vial("cjc-ipamorelin.png"),
        href: peptideIntake("cjc-ipamorelin"),
        learnKey: "cjc-ipamorelin",
        menuId: "cjc-1295",
        wholesale: BLEND_WHOLESALE,
      }),
    ],
  },
  {
    id: "immune",
    title: "Immune",
    intro: "Immune-modulating peptides — used when your NP decides they belong in the plan, not as a daily default.",
    cards: [
      shopCard({
        name: "LL-37",
        spec: "2mg/mL · used when appropriate",
        expect: "Antimicrobial peptide studied for immune defense. Timing is a medical decision.",
        image: GENERIC_VIAL,
        href: peptideIntake("ll-37"),
        menuId: "ll-37",
      }),
      shopCard({
        name: "Thymosin Alpha-1",
        spec: "5mg/mL · cycle set at consult",
        expect: "Immune-modulating peptide used under NP supervision for resilience protocols.",
        image: GENERIC_VIAL,
        href: peptideIntake("thymosin-a1"),
        menuId: "thymosin-a1",
      }),
      shopCard({
        name: "TB-500",
        spec: "3mg/mL · 5mL vial",
        expect: "Also used in systemic healing and inflammation-control protocols.",
        image: vial("tb-500.png"),
        href: peptideIntake("tb-500"),
        learnKey: "tb500",
        menuId: "tb-500",
      }),
    ],
  },
  {
    id: "hormone",
    title: "Hormone & Vitality",
    intro: "Hormone-axis and intimacy peptides — prescribed after history and labs, never from a dropdown.",
    cards: [
      shopCard({
        name: "Gonadorelin",
        spec: "1mg/mL · per NP plan",
        expect: "GnRH analog used for natural hormone signaling and fertility support.",
        image: GENERIC_VIAL,
        href: peptideIntake("gonadorelin"),
        menuId: "gonadorelin",
        wholesale: 50,
      }),
      shopCard({
        name: "HCG",
        spec: "Vial · per NP plan",
        expect: "Supports testicular function and fertility during hormone therapy.",
        image: "/images/gentlemens-club/add-ons/hcg.png",
        href: peptideIntake("hcg"),
        menuId: "hcg",
      }),
      shopCard({
        name: "Kisspeptin",
        spec: "1mg/mL · as directed",
        expect: "Upstream reproductive-hormone signal — matched at consult.",
        image: GENERIC_VIAL,
        href: peptideIntake("kisspeptin"),
        menuId: "kisspeptin",
      }),
      shopCard({
        name: "Oxytocin",
        spec: "Compounded · as directed",
        expect: "Used in mood, bonding, and recovery protocols when clinically appropriate.",
        image: GENERIC_VIAL,
        href: peptideIntake("oxytocin"),
        menuId: "oxytocin",
      }),
      shopCard({
        name: "PT-141",
        spec: "2mg/mL · as needed",
        expect: "Melanocortin agonist for desire and arousal in women and men.",
        image: vial("pt-141.png"),
        href: peptideIntake("pt-141"),
        learnKey: "pt141",
        menuId: "pt-141",
      }),
    ],
  },
  {
    id: "pain",
    title: "Pain / Inflammation",
    intro: "Comfort and inflammation-support options — your NP decides if they belong beside a repair protocol.",
    cards: [
      shopCard({
        name: "ARA-290",
        spec: "Cycle set at consult",
        expect: "Peptide studied for neuropathic comfort and tissue protection.",
        image: GENERIC_VIAL,
        href: peptideIntake("ara-290"),
        menuId: "ara-290",
      }),
      shopCard({
        name: "Curcumin (injectable)",
        spec: "Compounded vial",
        expect: "Bioavailable anti-inflammatory support for joints, recovery, and systemic comfort.",
        image: GENERIC_VIAL,
        href: peptideIntake("curcumin"),
        menuId: "curcumin",
      }),
    ],
  },
];
