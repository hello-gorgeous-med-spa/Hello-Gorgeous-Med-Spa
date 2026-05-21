/** SEO landing content for treatments competitors rank for but HG pages were thin / unindexed. */

export type TreatmentSeoConfig = {
  slug: string;
  pagePath: string;
  bookQuery: string;
  badge?: string;
  localityLine: string;
  h1Lead: string;
  h1Accent: string;
  heroSub: string;
  heroBody: string;
  priceFrom: string;
  heroImage: string;
  heroImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  procedureName: string;
  alternateNames: string[];
  treats: { icon: string; title: string; desc: string }[];
  whyUs: string[];
  relatedLinks: { label: string; href: string }[];
  faqs: { question: string; answer: string }[];
};

export const sculptraBiostimulatorSeo: TreatmentSeoConfig = {
  slug: "sculptra-biostimulator",
  pagePath: "/services/sculptra-biostimulator",
  bookQuery: "sculptra",
  badge: "Biostimulator · Collagen Banking",
  localityLine: "Oswego · Naperville · Aurora · Plainfield",
  h1Lead: "Sculptra & Biostimulator",
  h1Accent: "Collagen You Build — Not Just Fill",
  heroSub: "Gradual, natural volume from the inside out.",
  heroBody:
    "At Hello Gorgeous Med Spa in Oswego, IL, we offer FDA-approved biostimulators including Sculptra® (PLLA) for clients who want long-lasting collagen support — cheeks, temples, jawline, and global facial harmony. Medical oversight by Ryan Kent, FNP-BC, seven days a week.",
  priceFrom: "Consult for personalized quote",
  heroImage: "/images/services/hg-dermal-fillers.png",
  heroImageAlt:
    "Sculptra biostimulator consultation at Hello Gorgeous Med Spa Oswego IL — collagen-stimulating injectable treatment",
  metaTitle:
    "Sculptra & Biostimulator Injectables in Oswego, IL | Hello Gorgeous Med Spa",
  metaDescription:
    "Sculptra and collagen biostimulator treatments in Oswego, IL. Gradual volume, skin quality & jawline support — not instant filler. Hello Gorgeous Med Spa. Free consult. Naperville, Aurora, Fox Valley.",
  procedureName: "Sculptra Biostimulator Treatment",
  alternateNames: [
    "Sculptra Oswego",
    "biostimulator Oswego IL",
    "PLLA filler Oswego",
    "collagen stimulator Naperville",
    "Sculptra med spa Illinois",
  ],
  treats: [
    { icon: "✨", title: "Temple & Midface Hollowing", desc: "Restore structure that age-related fat loss creates — gradually." },
    { icon: "🎯", title: "Jawline & Lower Face", desc: "Support a sharper contour when skin laxity is the real issue." },
    { icon: "💎", title: "Skin Quality Over Time", desc: "Biostimulators improve firmness and glow as collagen rebuilds." },
    { icon: "🔄", title: "HA + Biostimulator Plans", desc: "We often combine instant HA refinement with long-game collagen." },
    { icon: "👩‍⚕️", title: "NP-Led Assessment", desc: "Ryan Kent, FNP-BC, on site daily — not a remote medical director." },
    { icon: "📍", title: "10+ Years in Oswego", desc: "Family-owned practice — not a revolving injector door." },
  ],
  whyUs: [
    "We tell you when Sculptra is the right tool — and when HA filler or Morpheus8 is smarter.",
    "Series-based planning with realistic timelines (results build over weeks, not hours).",
    "Same team for injectables, lasers, and skin tightening under one roof.",
  ],
  relatedLinks: [
    { label: "Dermal fillers", href: "/services/dermal-fillers" },
    { label: "Morpheus8 Burst", href: "/morpheus8-burst-oswego-il" },
    { label: "Injectables hub", href: "/injectables" },
    { label: "Book consultation", href: "/book" },
  ],
  faqs: [
    {
      question: "What is a biostimulator like Sculptra?",
      answer:
        "Biostimulators such as Sculptra (PLLA) signal your body to produce new collagen over time. Unlike hyaluronic acid fillers that add immediate volume, results develop gradually across a series of treatments.",
    },
    {
      question: "How is Sculptra different from Botox or filler?",
      answer:
        "Botox relaxes muscles. HA fillers add instant volume. Sculptra stimulates collagen — ideal when the goal is skin quality, structure, and longevity rather than a same-day plump.",
    },
    {
      question: "Who is a good candidate for Sculptra in Oswego?",
      answer:
        "Adults with volume loss, skin laxity, or hollowing who want natural, progressive improvement. A consultation at Hello Gorgeous in Oswego, IL determines candidacy and series length.",
    },
    {
      question: "How many Sculptra sessions will I need?",
      answer:
        "Most plans involve a series spaced several weeks apart. Your provider maps zones, product amount, and maintenance based on anatomy and goals.",
    },
    {
      question: "Does Hello Gorgeous offer Sculptra near Naperville and Aurora?",
      answer:
        "Yes. We are at 74 W Washington St, Oswego, IL 60543 — convenient to Naperville, Aurora, Plainfield, Yorkville, and Montgomery.",
    },
  ],
};

export const salmonDnaGlassFacialSeo: TreatmentSeoConfig = {
  slug: "salmon-dna-glass-facial",
  pagePath: "/services/salmon-dna-glass-facial",
  bookQuery: "salmon-dna",
  badge: "PDRN · Red Carpet Glow",
  localityLine: "Oswego · Naperville · Aurora · Plainfield",
  h1Lead: "Salmon DNA Glass Facial",
  h1Accent: "Red Carpet Skin in Oswego",
  heroSub: "PDRN-powered regeneration for glass-skin radiance.",
  heroBody:
    "Our VAMP Salmon DNA / Red Carpet Glass Skin protocol at Hello Gorgeous Med Spa in Oswego, IL pairs polydeoxyribonucleotide (PDRN) science with your choice of microneedling, IPL photofacial, or chemical peel — for tone, hydration, and event-ready glow.",
  priceFrom: "Consult for protocol pricing",
  heroImage: "/images/homepage-services/anteage-md-brightening.png",
  heroImageAlt:
    "Salmon DNA glass skin facial regenerative treatment Hello Gorgeous Med Spa Oswego IL PDRN",
  metaTitle:
    "Salmon DNA Glass Facial & PDRN in Oswego, IL | Red Carpet Facial | Hello Gorgeous",
  metaDescription:
    "Salmon DNA glass facial & PDRN skin regeneration in Oswego, IL. Red carpet glow protocol with optional microneedling, IPL or peel. Hello Gorgeous Med Spa — 10+ years in the Fox Valley.",
  procedureName: "Salmon DNA Glass Skin Facial (PDRN)",
  alternateNames: [
    "Salmon DNA facial Oswego",
    "PDRN facial Oswego IL",
    "glass skin facial Naperville",
    "red carpet facial Illinois",
    "salmon sperm facial med spa",
  ],
  treats: [
    { icon: "🧬", title: "PDRN Regeneration", desc: "Salmon DNA extracts support repair signaling and collagen activity." },
    { icon: "✨", title: "Glass-Skin Glow", desc: "Brighter, smoother, more hydrated complexion for events and maintenance." },
    { icon: "💉", title: "+ Microneedling", desc: "Channel PDRN deeper when texture and scars need more than surface care." },
    { icon: "💡", title: "+ IPL Photofacial", desc: "Pair with Lumecca-class IPL when pigment and redness are in the mix." },
    { icon: "🧪", title: "+ Chemical Peel", desc: "Peel option when clarity and cell turnover are the priority." },
    { icon: "🔗", title: "AnteAGE P.E.A.R.L.", desc: "Advanced PDRN + exosome protocols also available in our regenerative menu." },
  ],
  whyUs: [
    "We offer salmon DNA / PDRN facials plus full InMode stack (Morpheus8, Solaria CO₂, Quantum RF) — not just a single device spa.",
    "Danielle has 10+ years in Oswego; Ryan Kent, FNP-BC, provides medical oversight on site.",
    "Protocols are customized — we do not one-size every face.",
  ],
  relatedLinks: [
    { label: "Lumecca IPL photofacial", href: "/services/ipl-photofacial" },
    { label: "AnteAGE regenerative hub", href: "/regenerative-medicine-oswego-il" },
    { label: "RF microneedling", href: "/services/microneedling-rf" },
    { label: "Book consultation", href: "/book" },
  ],
  faqs: [
    {
      question: "What is a salmon DNA facial?",
      answer:
        "It is a regenerative facial using PDRN (polydeoxyribonucleotide), often derived from salmon DNA, to support skin repair, hydration, and glow. At Hello Gorgeous in Oswego, IL, we call it our Glass Skin / Red Carpet protocol.",
    },
    {
      question: "Is salmon DNA the same as Ariessence or P.E.A.R.L.?",
      answer:
        "They are in the same regenerative family (PDRN-forward science). We offer salmon DNA glass facials and AnteAGE P.E.A.R.L. (PDRN + exosomes/biosomes) for clients who want advanced cell-signaling treatments.",
    },
    {
      question: "Can I combine salmon DNA with IPL or microneedling?",
      answer:
        "Yes — that is how our Red Carpet protocol is built. We select the right add-on (microneedling, IPL, or peel) based on your skin goals and timing.",
    },
    {
      question: "Who is a good candidate in Oswego?",
      answer:
        "Clients with dull tone, dehydration, fine texture issues, or pre-event glow goals. We screen for contraindications at a free consultation.",
    },
    {
      question: "Where is Hello Gorgeous located?",
      answer:
        "74 W Washington St, Oswego, IL 60543 — serving Naperville, Aurora, Plainfield, Yorkville, and the western Chicago suburbs.",
    },
  ],
};
