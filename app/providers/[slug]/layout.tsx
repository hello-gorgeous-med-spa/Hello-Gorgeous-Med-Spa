import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/hgos/supabase";
import {
  DANI_FULL_NAME,
} from "@/lib/founder-credentials";
import { DANIELLE_CREDENTIALS } from "@/lib/provider-credentials";
import { pageMetadata, SITE } from "@/lib/seo";

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
  if (slug === "ryan") {
    redirect("/about");
  }

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
          url: `${SITE.url}/images/team/danielle-alcala-glazier-portrait.png`,
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
  if (slug === "danielle" || slug === "ryan") {
    redirect("/about");
  }

  return <>{children}</>;
}
