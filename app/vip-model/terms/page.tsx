import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";
import ReactMarkdown from "react-markdown";
import { SITE } from "@/lib/seo";
import { CTA } from "@/components/CTA";
import { VIP_MODEL_SQUARE_URL } from "@/lib/flows";

const BASE_URL = SITE.url;
const PAGE_URL = `${BASE_URL}/vip-model/terms`;

export const metadata: Metadata = {
  title: "VIP Model Program — Terms & Conditions | Hello Gorgeous Med Spa",
  description:
    "Terms, conditions, and program description for the VIP Model Program. $250 deposit, treatment schedule, pricing tiers, and policies.",
  openGraph: {
    title: "VIP Model Program — Terms & Conditions",
    description: "Full terms and conditions for the VIP Model Program at Hello Gorgeous Med Spa.",
    type: "website",
    url: PAGE_URL,
  },
  alternates: { canonical: PAGE_URL },
};

function getTermsContent(): string {
  try {
    const path = join(process.cwd(), "docs/VIP-MODEL-PROGRAM-TERMS-AND-DESCRIPTION.md");
    return readFileSync(path, "utf-8");
  } catch {
    return "";
  }
}

export default function VIPModelTermsPage() {
  const content = getTermsContent();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-4 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">VIP Model Program</h1>
            <p className="text-white/80 text-sm">Terms, Conditions & Program Description</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/vip-model"
              className="text-sm font-semibold text-[#FF2D8E] hover:underline"
            >
              ← Back to VIP Model
            </Link>
            <CTA href={VIP_MODEL_SQUARE_URL} variant="gradient" className="px-6 py-2 text-sm">
              Reserve Now
            </CTA>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {content ? (
          <div className="prose prose-lg max-w-none prose-headings:text-black prose-headings:font-bold prose-p:text-black/90 prose-li:text-black/90 prose-strong:text-black">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-black mt-0 mb-6">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold text-[#FF2D8E] mt-10 mb-4 pb-2 border-b-2 border-[#FF2D8E]/30">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-bold text-black mt-6 mb-3">{children}</h3>
                ),
                p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
                ),
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-black">{children}</strong>
                ),
                hr: () => <hr className="my-8 border-black/10" />,
                a: ({ href, children }) => (
                  <Link
                    href={href || "#"}
                    className="text-[#FF2D8E] hover:underline font-medium"
                  >
                    {children}
                  </Link>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-black/70">Terms and conditions document could not be loaded.</p>
        )}

        <div className="mt-12 pt-8 border-t border-black/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link href="/vip-model" className="text-[#FF2D8E] font-semibold hover:underline">
            ← Back to VIP Model Program
          </Link>
          <CTA href={VIP_MODEL_SQUARE_URL} variant="gradient" className="px-10 py-4">
            Reserve Your Spot — $250 Deposit
          </CTA>
        </div>
      </article>
    </div>
  );
}
