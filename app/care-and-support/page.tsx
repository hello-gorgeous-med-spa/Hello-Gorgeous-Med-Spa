import type { Metadata } from "next";

import { CareAndSupport } from "@/components/CareAndSupport";
import { Section } from "@/components/Section";
import { FAQ, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Care & Support",
  description:
    "Post-treatment education and reassurance, with clear red-flag escalation—calm, compliant, and human-first.",
  path: "/care-and-support",
});

const faqs: FAQ[] = [
  {
    question: "Is the “Is this normal?” checker a diagnosis?",
    answer:
      "No. It’s educational only. If anything feels severe, rapidly worsening, or urgent, seek urgent/emergency care and contact your provider.",
  },
  {
    question: "What happens if I mention red flags?",
    answer:
      "The system switches to a clinical safety tone and encourages contacting the clinic or seeking urgent care when appropriate.",
  },
];

export default function CareAndSupportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black" />
        <div className="relative z-10">
          <CareAndSupport />
        </div>
      </Section>
    </>
  );
}

