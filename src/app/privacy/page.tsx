import type { Metadata } from "next";

import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for Hello Gorgeous Med Spa.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <SiteJsonLd />
      <Section>
        <Container>
          <div className="prose prose-invert max-w-none">
            <h1>Privacy Policy</h1>
            <p>
              This Privacy Policy is a template. Replace the content with your finalized
              policy and any required disclosures (cookies, analytics, SMS/email marketing,
              booking providers, etc.).
            </p>
            <h2>Information We Collect</h2>
            <p>
              Contact details you submit via forms, booking tools, or integrations (email,
              phone, and message content).
            </p>
            <h2>How We Use Information</h2>
            <p>
              To respond to inquiries, schedule appointments, provide services, and improve
              the website experience.
            </p>
            <h2>Analytics</h2>
            <p>
              We may use analytics tools (e.g., GA4) to understand site performance and
              improve content.
            </p>
            <h2>Contact</h2>
            <p>
              If you have questions about this policy, contact us through the Contact page.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

