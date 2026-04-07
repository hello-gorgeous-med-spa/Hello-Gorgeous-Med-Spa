/**
 * "No Prior Authorization" / Hello Gorgeous clinical book — marketing + checkout helpers.
 * Digital purchase: create a Payment Link or Online Store item in Square Dashboard, paste URL in env.
 */

export const THE_BOOK = {
  slugPath: "/the-book",
  /** Public sneak peek (full scroll experience) — can stay on brand domain or external */
  sneakPeekUrl: "https://nopriorauthorization.com/book",
  title: "Hello Gorgeous — The Book",
  subtitle: "The Book Your Provider Never Handed You",
  description:
    "24 chapters on skin, lasers, injectables, GLP-1s, hormones, peptides, and your right to understand the science — written by a provider who refuses to let patients leave uninformed.",
  author: "Danielle Alcala",
  authorRole: "Founder · Hello Gorgeous Med Spa · Oswego, IL",
  stats: [
    { label: "Chapters", value: "24" },
    { label: "Clinical visuals", value: "60+" },
    { label: "Parts", value: "6" },
    { label: "Years in practice", value: "10+" },
  ],
  parts: [
    {
      n: "01",
      title: "Your Skin",
      bullets: [
        "How skin actually works — the 5 layers",
        "Fitzpatrick type and why it changes everything",
        "Facials, peels, and what each treatment can reach",
      ],
    },
    {
      n: "02",
      title: "Lasers & devices",
      bullets: [
        "Wavelengths, chromophores, selective photothermolysis",
        "Major laser types decoded — IPL, CO₂, Nd:YAG, RF",
        "Morpheus8 Burst, Solaria CO₂, Quantum RF — why we chose them",
      ],
    },
    {
      n: "03",
      title: "Injectables",
      bullets: [
        "What neuromodulators actually do — and cannot do",
        "Filler as architecture, not “volume for volume”",
        "How to vet a safe injector",
      ],
    },
    {
      n: "04",
      title: "Your body",
      bullets: [
        "GLP-1 medications — the clinical picture",
        "Body contouring: surgery vs devices",
        "Muscle loss, skin laxity, and support during rapid weight loss",
      ],
    },
    {
      n: "05",
      title: "Hormones & labs",
      bullets: [
        "Hormones and your skin",
        "Reading labs — normal vs optimal",
        "IV therapy & injections — what holds up in evidence",
      ],
    },
    {
      n: "06",
      title: "Wellness",
      bullets: [
        "Peptide therapy — BPC-157, Sermorelin, GHK-Cu and context",
        "Clean beauty — evidence vs fear marketing",
        "Men’s health & aesthetics",
      ],
    },
  ],
  whoItsFor: [
    {
      emoji: "💉",
      title: "Before your first laser or filler",
      text: "Walk in knowing what to ask — and which answers should make you stay or leave.",
    },
    {
      emoji: "🧪",
      title: 'When labs say “normal” but you feel wrong',
      text: "A roadmap for the panels and patterns providers often skip.",
    },
    {
      emoji: "💊",
      title: "On GLP-1 medications",
      text: "Protein, training, skin laxity, and aesthetic support — in one place.",
    },
    {
      emoji: "👨",
      title: "Men who want straight answers",
      text: "Hormones, skin, aesthetics — without judgment.",
    },
    {
      emoji: "🔬",
      title: "In your 40s — skin and energy feel different",
      text: "Connect perimenopause, hormones, and what you see in the mirror — with evidence, not fear.",
    },
    {
      emoji: "🌿",
      title: "Clean beauty without the fear marketing",
      text: "Which ingredient concerns are evidence-based — and which are theater.",
    },
  ],
} as const;

/** Square Payment Link or Online Store checkout URL for the digital edition. */
export function getBookSquareCheckoutUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_BOOK_SQUARE_CHECKOUT_URL?.trim();
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) return null;
  return raw;
}
