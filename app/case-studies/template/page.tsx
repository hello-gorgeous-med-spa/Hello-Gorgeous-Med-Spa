import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/components/case-studies/CaseStudyTemplate";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Case Study Template | Hello Gorgeous Med Spa",
  description:
    "Reusable educational template for publishing approved before/after treatment case studies at Hello Gorgeous Med Spa.",
  path: "/case-studies/template",
});

export default function CaseStudyTemplatePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <CaseStudyTemplate
        title="Case Study Template: [Service] for [Concern]"
        concern="[Describe baseline concern without identifying patient details.]"
        treatmentPlan="[Outline staged plan and rationale.]"
        sessions="[Example: 3 sessions over 12 weeks.]"
        timeline="[Example: early response at 2-4 weeks, final settle at 3-6 months.]"
        recovery="[List expected downtime range and practical aftercare priorities.]"
        providerNotes="[Explain candidacy reasoning, treatment boundaries, and why this plan was selected.]"
        combinationTreatments="[If used, explain sequence and timing. If not used, note why.]"
        ctaHref="/book"
      />
    </main>
  );
}
