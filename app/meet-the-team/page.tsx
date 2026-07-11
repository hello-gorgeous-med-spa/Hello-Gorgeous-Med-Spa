import type { Metadata } from "next";

import { MeetTheTeamPageContent } from "@/components/team/MeetTheTeamPageContent";
import { MEET_THE_TEAM_SEO_DESCRIPTION, meetTheTeamJsonLd } from "@/lib/team-members";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Meet the Team | Michelle Colby, Marissa Murray & Jen Vokoun",
  description: MEET_THE_TEAM_SEO_DESCRIPTION,
  path: "/meet-the-team",
  keywords: [
    "Hello Gorgeous Med Spa team",
    "Michelle Colby Hello Gorgeous",
    "Marissa Murray esthetician Oswego",
    "Laura Witt Hello Gorgeous",
    "Jen Vokoun permanent makeup Oswego",
    "med spa staff Oswego IL",
    "lash artist Oswego",
    "microblading artist Oswego",
    "front desk Hello Gorgeous",
  ],
});

export default function MeetTheTeamPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "Meet the Team", url: `${SITE.url}/meet-the-team` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(meetTheTeamJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <MeetTheTeamPageContent />
    </>
  );
}
