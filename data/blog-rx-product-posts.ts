import type { BlogPost } from "./blog-posts";
import { PRODUCT_OFFER_CATEGORIES } from "@/lib/products-we-offer-cards";
import LEARN from "@/lib/products-we-offer-learn.json";
import { productOfferItemUrl } from "@/lib/products-we-offer-seo";

/** Blog category label for compounded Rx catalog articles (used for /blog?filter=rx). */
export const BLOG_CATEGORY_HELLO_GORGEOUS_RX = "Hello Gorgeous RX" as const;

type LearnEntry = {
  what: string;
  how: string;
  good: string;
  expect: string;
  side: string;
};

type LearnMap = Record<string, LearnEntry[]>;

const learnByCat = LEARN as LearnMap;

const SERVICE_LINK: Record<string, { href: string; label: string }> = {
  weight: { href: "/glp1-weight-loss", label: "medical weight loss and GLP-1 therapy" },
  peptides: { href: "/peptides", label: "peptide therapy at Hello Gorgeous" },
  hormone: { href: "/services/biote-hormone-therapy", label: "hormone optimization and BioTE" },
  antiaging: { href: "/services", label: "our longevity and wellness services" },
  hair: { href: "/services/prf-prp", label: "PRF/PRP and hair restoration options" },
  sexual: { href: "/products-we-offer", label: "our sexual health Rx catalog" },
  wellness: { href: "/services/vitamin-injections", label: "vitamin injections and wellness support" },
};

const RX_TESTIMONIALS = [
  `**Client feedback:** "I appreciate that Hello Gorgeous in Oswego takes time to explain compounded options. Having an NP on site made the whole process feel safe and straightforward." — Client, Aurora area`,
  `**Client feedback:** "Finally a med spa near Plainfield where I could talk through prescriptions without feeling rushed. The Hello Gorgeous team is thorough." — Client, Kendall County`,
  `**Client feedback:** "We drive from Naperville because Hello Gorgeous combines real medical oversight with a personal touch. Rx questions get real answers." — Client, Naperville, IL`,
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function estimateReadMinutes(markdown: string): string {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const m = Math.max(4, Math.min(12, Math.ceil(words / 220)));
  return `${m} min`;
}

function buildContent(params: {
  name: string;
  form: string;
  desc: string;
  catId: string;
  catLabel: string;
  idx: number;
  learn: LearnEntry;
  relatedHref: string;
  relatedLabel: string;
}): string {
  const catalogUrl = productOfferItemUrl(params.catId, params.idx);
  const quote = RX_TESTIMONIALS[params.idx % RX_TESTIMONIALS.length];

  return `# ${params.name} at Hello Gorgeous RX in Oswego, IL

At **Hello Gorgeous Med Spa** in **Oswego, IL** — serving **Naperville**, **Aurora**, **Plainfield**, Yorkville, and the Fox Valley — **Hello Gorgeous RX™** is our clinician-managed compounded prescription program. Below is educational information about **${params.name}** (${params.form}). It is **not** medical advice; eligibility, dosing, and monitoring are always individualized after a consultation.

**On our catalog:** [Jump to ${params.name} on the Hello Gorgeous RX product page](${catalogUrl}).

## What is it?

${params.learn.what}

## How is it taken or used?

${params.learn.how}

## Who might it be appropriate for?

${params.learn.good}

## What to expect

${params.learn.expect}

## Side effects and safety

${params.learn.side}

## ${params.catLabel} at Hello Gorgeous

This medication family sits in our **${params.catLabel}** lineup on the [full Hello Gorgeous RX catalog](/products-we-offer). Whether it is right for you depends on your history, labs, and goals — only your provider can decide.

**Related:** [Learn more about ${params.relatedLabel}](${params.relatedHref}) · [Browse all compounded Rx options](/products-we-offer) · [Book a consultation](/book)

📞 **630-636-6193**  
🌐 **hellogorgeousmedspa.com/book**  
📍 **74 W. Washington Street, Oswego, IL 60543**

${quote}

---

## Frequently Asked Questions

### Do you offer ${params.name} at Hello Gorgeous in Oswego?

We may prescribe compounded therapies including **${params.name}** when medically appropriate and after a full evaluation. Availability depends on your health history, labs, and pharmacy workflow — not every patient is a candidate.

### Is Hello Gorgeous RX the same as buying medication online?

No. **Hello Gorgeous RX** means care under our clinical team in Oswego, IL — with prescriptions issued only when appropriate. We do not sell medications without a provider relationship.

### Do I need a consultation?

Yes. Start with a [consultation](/book) or call **630-636-6193** so we can review your goals and whether this class of therapy fits your plan.

### Where are you located?

**74 W. Washington Street, Oswego, IL 60543.** We welcome clients from Naperville, Aurora, Plainfield, Montgomery, Sugar Grove, and the western suburbs.

### Is this article medical advice?

No. It summarizes common education points only. Always follow your clinician’s instructions and ask questions about risks, benefits, and alternatives.
`;
}

function buildPost(
  catId: string,
  catNavLabel: string,
  idx: number,
  card: { name: string; form: string; desc: string },
  learn: LearnEntry,
  dateStr: string
): BlogPost {
  const slug = `hello-gorgeous-rx-${catId}-${slugify(card.name)}`;
  const related = SERVICE_LINK[catId] ?? {
    href: "/products-we-offer",
    label: "Hello Gorgeous RX compounded options",
  };
  const title = `${card.name} at Hello Gorgeous RX in Oswego, IL | Compounded Options`;
  const metaTitle = `${card.name} | Hello Gorgeous RX Oswego IL | ${catNavLabel}`;
  const metaDescription = `${card.name} (${card.form}) via Hello Gorgeous RX™ in Oswego, IL. Clinician-managed compounded prescriptions for ${catNavLabel.toLowerCase()}. Serving Naperville, Aurora & Plainfield. Book a consult.`;
  const excerpt = `${card.desc.slice(0, 180)}${card.desc.length > 180 ? "…" : ""} Learn how Hello Gorgeous RX in Oswego approaches ${card.name} when prescribed.`;
  const content = buildContent({
    name: card.name,
    form: card.form,
    desc: card.desc,
    catId,
    catLabel: catNavLabel,
    idx,
    learn,
    relatedHref: related.href,
    relatedLabel: related.label,
  });

  return {
    slug,
    title,
    metaTitle,
    metaDescription,
    excerpt,
    category: BLOG_CATEGORY_HELLO_GORGEOUS_RX,
    date: dateStr,
    readTime: estimateReadMinutes(content),
    keywords: [
      `${card.name} Oswego`,
      `${card.name} Hello Gorgeous`,
      "Hello Gorgeous RX",
      "compounded prescriptions Oswego IL",
      catNavLabel,
      "Naperville med spa prescriptions",
      "Aurora IL compounded pharmacy",
    ],
    content,
  };
}

/** One SEO blog article per catalog card; copy is driven by products-we-offer + learn JSON. */
export const rxProductBlogPosts: BlogPost[] = (() => {
  const out: BlogPost[] = [];
  const base = new Date("2026-03-10");
  let dayOffset = 0;

  for (const cat of PRODUCT_OFFER_CATEGORIES) {
    const rows = learnByCat[cat.id];
    if (!rows) continue;

    cat.cards.forEach((card, idx) => {
      const learn = rows[idx];
      if (!learn) return;
      const d = new Date(base);
      d.setDate(d.getDate() + dayOffset);
      dayOffset += 1;
      const dateStr = d.toISOString().slice(0, 10);
      out.push(buildPost(cat.id, cat.navLabel, idx, card, learn, dateStr));
    });
  }

  return out;
})();
