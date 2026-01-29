import type { Metadata } from "next";

import { PersonaHub } from "@/components/PersonaHub";
import { Section } from "@/components/Section";
import { PERSONAS } from "@/lib/personas";
import { FAQ, SITE, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

function peopleJsonLd() {
  return PERSONAS.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.title,
    description: p.tagline,
    worksFor: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
    },
  }));
}

function pageFaqs(): FAQ[] {
  // Simple safe FAQ seeds so schema is valid and compliant.
  return [
    {
      question: "Is the chat medical advice?",
      answer:
        "No. The chat is for educational purposes only and does not provide diagnosis or individualized medical advice. Please book a consultation for personal guidance.",
    },
    {
      question: "Can I switch experts?",
      answer:
        "Yes. Select an expert card at any time to change tone and knowledge scope, while keeping one unified chat experience.",
    },
    {
      question: "How do I book a consultation?",
      answer:
        "Use the Book page to schedule. If you have questions first, contact us and we’ll guide you to the right service.",
    },
  ];
}

export const metadata: Metadata = pageMetadata({
  title: "Meet the Experts",
  description:
    "Meet the Hello Gorgeous Med Spa experts—persona-based education, credibility clips, and a unified AI chat with safe scope limits.",
  path: "/meet-the-team",
});

export default function MeetTheTeamPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(pageFaqs())) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(peopleJsonLd()) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black" />
        <div className="relative z-10">
          <PersonaHub />
        </div>
      </Section>
    </>
  );
}

