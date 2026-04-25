import type { Metadata } from "next";
import { PublicHgForm } from "@/components/forms/PublicHgForm";
import { INTAKE_FORM_PARAM_OPTIONS } from "@/lib/consent-iframe-by-slug";
import { pageMetadata, SITE } from "@/lib/seo";

const INTAKE = "https://hub.hellogorgeousmedspa.com/intake";
const DEFAULT_INTAKE_FORM = "luxora-consent";

const _intakeMeta = pageMetadata({
  title: "Patient Intake & Consent | Hello Gorgeous",
  description:
    "Sign consent and pre-treatment forms on your phone. Chart-ready pipeline for Hello Gorgeous Med Spa, Oswego, IL.",
  path: "/intake",
});

export const metadata: Metadata = {
  ..._intakeMeta,
  openGraph: { ..._intakeMeta.openGraph, url: INTAKE },
};

function resolveIntakeFormSlug(formParam: string | string[] | undefined): string {
  const raw = Array.isArray(formParam) ? formParam[0] : formParam;
  if (raw && INTAKE_FORM_PARAM_OPTIONS.includes(raw)) return raw;
  return DEFAULT_INTAKE_FORM;
}

type IntakePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Hub-only recommended URL: hub.hellogorgeousmedspa.com/intake
 * Optional: `?form=` = luxora-consent | solaria-co2-consent | morpheus8-consent
 * (apex /intake redirects in middleware). Public; no third-party analytics here.
 * Verbatim consent HTML lives under public/docs/ — never paraphrase in React.
 */
export default async function HubIntakePage({ searchParams }: IntakePageProps) {
  const sp = (await searchParams) ?? {};
  const formSlug = resolveIntakeFormSlug(sp.form);

  return (
    <PublicHgForm
      formSlug={formSlug}
      variant="intake"
      aboveFold={
        <div className="max-w-2xl mx-auto text-center mb-8 px-2">
          <p className="text-[#C9A96E] text-xs font-bold uppercase tracking-[0.3em]">Check-in</p>
          <p className="text-white/90 text-sm mt-2">
            This page is the signed, chart-ready intake surface. For education only, see{" "}
            <a className="text-[#FF1493] underline" href={`${SITE.url}/patient-documents`}>
              patient documents
            </a>{" "}
            on the public site.
          </p>
        </div>
      }
    />
  );
}
