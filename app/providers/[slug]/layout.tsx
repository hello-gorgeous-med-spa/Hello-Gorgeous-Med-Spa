import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ClinicalReview } from "@/components/ClinicalReview";
import {
  NpScopePanel,
  OversightModelPanel,
} from "@/components/providers/ClinicalAuthorityPanels";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";
import {
  DANI_FULL_NAME,
  RYAN_FULL_NAME,
  RYAN_PROVIDER_BIO,
  ryanPersonJsonLd,
} from "@/lib/founder-credentials";
import {
  medicalDirectorPersonJsonLd,
  NP_ON_SITE_DAYS_PER_WEEK,
} from "@/lib/medical-authority";
import { DANIELLE_CREDENTIALS, RYAN_CREDENTIALS } from "@/lib/provider-credentials";
import { breadcrumbJsonLd, pageMetadata, SITE } from "@/lib/seo";

const FALLBACK_PROVIDERS: Record<
  string,
  { name: string; title: string; credentials: string; description: string }
> = {
  danielle: {
    name: DANI_FULL_NAME,
    title: "Owner & Founder",
    credentials: DANIELLE_CREDENTIALS,
    description:
      "Meet Danielle Alcala-Glazier — Licensed Esthetician and founder of Hello Gorgeous Med Spa in Oswego, IL. 10+ years serving Naperville, Aurora & Plainfield.",
  },
  ryan: {
    name: RYAN_FULL_NAME,
    title: "On-Site Nurse Practitioner · FNP-BC",
    credentials: RYAN_CREDENTIALS,
    description:
      "Meet Ryan Kent, FNP-BC — board-certified Family Nurse Practitioner at Hello Gorgeous Med Spa in Oswego, IL. On site 6 days a week with full Illinois prescriptive authority under Medical Director Dr. Mukesh Arora, MD.",
  },
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let providerName = "Provider";
  let providerTitle = "";
  let providerCredentials = "";
  let description =
    "Meet our team at Hello Gorgeous Med Spa in Oswego, IL. View credentials, results, and book your appointment.";

  try {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("providers")
        .select("first_name, last_name, title, credentials, short_bio")
        .eq("slug", slug)
        .single();

      if (data) {
        providerName = `${data.first_name} ${data.last_name || ""}`.trim();
        providerTitle = data.title || "";
        providerCredentials = data.credentials || "";
        if (data.short_bio) {
          description = data.short_bio;
        }
      }
    }
  } catch {
    // Use fallback
  }

  const fallback = FALLBACK_PROVIDERS[slug];
  if (providerName === "Provider" && fallback) {
    providerName = fallback.name;
    providerTitle = fallback.title;
    providerCredentials = fallback.credentials;
    description = fallback.description;
  } else if (fallback && providerName !== "Provider") {
    description = fallback.description;
  }

  const title =
    slug === "danielle"
      ? "Danielle Alcala-Glazier | Owner, Hello Gorgeous Med Spa Oswego IL"
      : `${providerName}${providerCredentials ? `, ${providerCredentials}` : ""} | Hello Gorgeous Med Spa`;

  return {
    ...pageMetadata({
      title,
      description,
      path: slug === "danielle" ? "/about" : `/providers/${slug}`,
      keywords: [
        providerName,
        `${providerName} med spa Oswego`,
        "Hello Gorgeous Med Spa",
        "med spa Oswego IL",
        "Naperville med spa",
        providerTitle,
      ],
    }),
    openGraph: {
      type: "profile",
      images: [
        {
          url:
            slug === "ryan"
              ? `${SITE.url}/images/providers/ryan-kent-clinic.jpg`
              : `${SITE.url}/images/team/danielle.png`,
          width: 1200,
          height: 630,
          alt: `${providerName} at Hello Gorgeous Med Spa`,
        },
      ],
    },
  };
}

export default async function ProviderLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  if (slug === "danielle") {
    redirect("/about");
  }

  if (slug !== "ryan") {
    return <>{children}</>;
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "About Dani & Ryan", url: `${SITE.url}/about` },
    { name: RYAN_FULL_NAME, url: `${SITE.url}/providers/ryan` },
  ]);

  const reviewer = ryanPersonJsonLd({ profileUrl: `${SITE.url}/providers/ryan` });

  const profileSchema = {
    "@context": "https://schema.org",
    "@graph": [
      reviewer,
      medicalDirectorPersonJsonLd(SITE.url),
      {
        "@type": "ProfilePage",
        "@id": `${SITE.url}/providers/ryan#webpage`,
        url: `${SITE.url}/providers/ryan`,
        name: `${RYAN_FULL_NAME} | Hello Gorgeous Med Spa`,
        description: RYAN_PROVIDER_BIO.replace(/\n\n/g, " ").slice(0, 320),
        mainEntity: { "@id": reviewer["@id"] },
        isPartOf: { "@id": `${SITE.url}/#website` },
        about: { "@id": `${SITE.url}/#organization` },
      },
      breadcrumb,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      {children}
      {/**
       * Server-rendered so the credential story is in the initial HTML — the profile
       * body above fetches from the providers API on the client.
       */}
      <section className="border-t-4 border-black bg-gradient-to-b from-[#FFF0F7] via-white to-white py-16">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
              Clinical authority
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-black sm:text-4xl">
              {RYAN_FULL_NAME}, in the building{" "}
              <span className="text-[#E6007E]">{NP_ON_SITE_DAYS_PER_WEEK} days a week</span>
            </h2>
          </div>
          <NpScopePanel />
          <OversightModelPanel activeProfile="np" />
          <ClinicalReview />
        </div>
      </section>
    </>
  );
}
