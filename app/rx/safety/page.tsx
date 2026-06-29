import type { Metadata } from "next";
import Link from "next/link";

import { RegenLogo } from "@/components/regen/RegenLogo";
import { REGEN_BRAND } from "@/lib/regen-brand";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx/safety";

export const metadata: Metadata = pageMetadata({
  title: `Safety Information | ${REGEN_BRAND.fullName}`,
  description:
    "Important safety information for REGEN prescription treatments including GLP-1 weight loss medications, peptide therapy, and hormone therapy.",
  path: PAGE_PATH,
});

export default function RxSafetyPage() {
  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <RegenLogo width={120} />
          <Link
            href="/rx"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            Back to REGEN
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-neutral-900">
          Important Safety Information
        </h1>

        <div className="mt-8 space-y-8 text-neutral-700">
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">GLP-1 Medications</h2>
            <p className="mt-3 leading-relaxed">
              GLP-1 receptor agonists (semaglutide, tirzepatide) are prescription medications 
              for chronic weight management. They should be used alongside a reduced-calorie 
              diet and increased physical activity.
            </p>
            <p className="mt-3 leading-relaxed">
              <strong>Do not use</strong> if you have a personal or family history of medullary 
              thyroid carcinoma (MTC) or Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).
            </p>
            <p className="mt-3 leading-relaxed">
              Common side effects include nausea, diarrhea, vomiting, constipation, and 
              abdominal pain. Serious side effects may include pancreatitis, gallbladder 
              problems, kidney problems, and hypoglycemia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">Peptide Therapy</h2>
            <p className="mt-3 leading-relaxed">
              Peptide therapies are compounded medications that require NP or physician 
              supervision. Treatment protocols are individualized based on your health 
              history, labs, and goals.
            </p>
            <p className="mt-3 leading-relaxed">
              Report any adverse reactions to your provider immediately. Do not share 
              medications with others.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">Hormone Therapy</h2>
            <p className="mt-3 leading-relaxed">
              Hormone replacement therapy (HRT) is prescribed based on lab results and 
              symptom assessment. Regular monitoring is required to ensure safe and 
              effective treatment.
            </p>
            <p className="mt-3 leading-relaxed">
              Discuss your complete medical history with your provider, including any 
              history of blood clots, stroke, heart disease, or hormone-sensitive cancers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">Contact</h2>
            <p className="mt-3 leading-relaxed">
              For questions about your treatment or to report concerns, contact 
              Hello Gorgeous Med Spa at{" "}
              <a href="tel:+16306366193" className="text-neutral-900 underline">
                (630) 636-6193
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <p className="text-sm text-neutral-500">
            This information does not replace medical advice. Always consult with your 
            healthcare provider about treatment options and potential risks.
          </p>
        </div>
      </main>
    </div>
  );
}
