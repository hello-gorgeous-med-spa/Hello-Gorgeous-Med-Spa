import type { Metadata } from "next";
import { LipStudio } from "@/components/lip/LipStudio";
import { FadeUp } from "@/components/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Lip Enhancement Studio | See Your Look Before You Book | Oswego, IL",
  description:
    "Try our AI lip simulation tool. Upload your photo to preview natural-looking lip enhancement levels. Free, private, client-side only. Book your consultation at Hello Gorgeous Med Spa.",
  path: "/lip-studio",
});

export default function LipStudioPage() {
  return (
    <section className="min-h-screen bg-[#FDF7FA] px-6 py-16 md:px-12 md:py-24">
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-[#FF2D8E]/15 text-[#FF2D8E] text-sm font-medium mb-4">
              💋 Lip Enhancement Studio™
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#000000] mb-3">
              See Your Look{" "}
              <span className="text-[#FF2D8E]">Before You Book</span>
            </h1>
            <p className="text-[#5E5E66] max-w-xl mx-auto">
              Upload your photo for a simulated preview. Select a preset enhancement level to
              explore options. All processing runs in your browser—we never store your images.
            </p>
          </div>
        </FadeUp>
        <FadeUp delayMs={50}>
          <LipStudio />
        </FadeUp>
      </div>
    </section>
  );
}
