import type { Metadata } from "next";
import { PublicHgForm } from "@/components/forms/PublicHgForm";
import { pageMetadata, SITE } from "@/lib/seo";

const INTAKE = "https://hub.hellogorgeousmedspa.com/intake";

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

/**
 * Hub-only recommended URL: hub.hellogorgeousmedspa.com/intake
 * (apex /intake redirects in middleware). Public; no third-party analytics here.
 * Legal/clinical text for Luxora: seed verbatim in `hg_form_templates` — never paraphrase.
 */
export default function HubIntakePage() {
  return (
    <PublicHgForm
      formSlug="luxora-consent"
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
