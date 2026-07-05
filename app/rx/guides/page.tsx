import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Dosing Guides | RE GEN by Hello Gorgeous Med Spa",
  description:
    "Educational dosing guides for RE GEN peptides, injections, and wellness treatments. Learn about NAD+, Sermorelin, PT-141, Glutathione, and more.",
  path: "/rx/guides",
});

const GUIDES = [
  {
    title: "What is GLP-1?",
    description: "Understanding glucagon-like peptide-1 and weight-management medications",
    category: "Weight Loss",
    href: "/rx/learn/what-is-glp-1",
    isArticle: true,
  },
  {
    title: "What are peptides?",
    description: "Peptide therapy basics, common uses, and provider oversight",
    category: "Peptides",
    href: "/rx/learn/what-are-peptides",
    isArticle: true,
  },
  {
    title: "GLP-1 Side Effect Support",
    description: "Managing common side effects during your weight loss journey",
    category: "Weight Loss",
    file: "glp1-side-effects.pdf",
  },
  {
    title: "Sermorelin Injection",
    description: "Growth hormone support peptide dosing and administration",
    category: "Peptides",
    file: "sermorelin-injection.pdf",
  },
  {
    title: "NAD+ Injection",
    description: "Cellular energy and longevity support",
    category: "Longevity",
    file: "nad-injection.pdf",
  },
  {
    title: "PT-141 (Bremelanotide)",
    description: "Sexual health peptide for intimacy support",
    category: "Sexual Health",
    file: "pt-141-bremelanotide.pdf",
  },
  {
    title: "Glutathione Injection",
    description: "Master antioxidant for detox and skin health",
    category: "Wellness",
    file: "glutathione-injection.pdf",
  },
  {
    title: "Pentadeca Arginate (PDA)",
    description: "Advanced healing and recovery peptide",
    category: "Peptides",
    file: "pentadeca-arginate.pdf",
  },
  {
    title: "Methylene Blue",
    description: "Cognitive support and mitochondrial function",
    category: "Longevity",
    file: "methylene-blue.pdf",
  },
  {
    title: "Low-Dose Naltrexone (LDN)",
    description: "Immune modulation and inflammation support",
    category: "Wellness",
    file: "ldn-low-dose-naltrexone.pdf",
  },
  {
    title: "ATP Mitochondrial Support",
    description: "Cellular energy production enhancement",
    category: "Longevity",
    file: "atp-mitochondrial.pdf",
  },
  {
    title: "Peptide Options Overview",
    description: "Complete guide to available peptide therapies",
    category: "Peptides",
    file: "peptide-options.pdf",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Weight Loss": "bg-pink-100 text-pink-700",
  "Peptides": "bg-purple-100 text-purple-700",
  "Longevity": "bg-blue-100 text-blue-700",
  "Sexual Health": "bg-rose-100 text-rose-700",
  "Wellness": "bg-green-100 text-green-700",
};

export default function RxGuidesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b-2 border-black bg-gradient-to-r from-[#1a1216] to-[#3a2730]">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/rx" className="flex items-center gap-3">
            <img src="/images/regen/regen-logo-white.png" alt="RE GEN" className="h-8" />
          </Link>
          <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-sm text-white/70 hover:text-white">
            {SITE.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E] mb-2">
            Patient Education
          </p>
          <h1 className="font-serif text-4xl font-bold text-black mb-4">
            Dosing Guides
          </h1>
          <p className="text-lg text-black/70 max-w-2xl">
            Learn about your RE GEN treatments with these educational guides from our pharmacy partners.
            Always follow your provider's specific instructions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {GUIDES.map((guide) => {
            const href =
              "href" in guide && guide.href
                ? guide.href
                : `/docs/dosing-guides/${guide.file}`;
            const isExternalPdf = !("isArticle" in guide && guide.isArticle);

            return (
            <a
              key={guide.title}
              href={href}
              {...(isExternalPdf
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex items-start gap-4 rounded-xl border-2 border-black/10 bg-white p-5 hover:border-[#E6007E] hover:shadow-lg transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#FFF0F7] flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E6007E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[guide.category] || "bg-gray-100 text-gray-700"}`}
                  >
                    {guide.category}
                  </span>
                </div>
                <h3 className="font-bold text-black group-hover:text-[#E6007E] transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-black/60 mt-1">{guide.description}</p>
              </div>
              <div className="flex-shrink-0 text-black/30 group-hover:text-[#E6007E] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>
            </a>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-[#FFF0F7] border-2 border-[#E6007E]/20">
          <p className="text-sm text-black/70">
            <strong className="text-black">Important:</strong> These guides are for educational purposes.
            Your specific dosing and protocol will be determined by Ryan Kent, FNP-BC during your telehealth visit.
            Always follow your provider's instructions over general guidelines.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/rx"
            className="inline-flex items-center gap-2 rounded-xl bg-[#E6007E] px-6 py-3 font-bold text-white hover:bg-black transition-colors"
          >
            ← Back to RE GEN
          </Link>
          <a
            href={`tel:${SITE.phone.replace(/-/g, "")}`}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-black px-6 py-3 font-bold text-black hover:bg-black hover:text-white transition-colors"
          >
            Questions? Call {SITE.phone}
          </a>
        </div>
      </div>
    </main>
  );
}
