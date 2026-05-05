import type { Metadata } from "next";
import PrintButton from "../sms-consent/PrintButton";

export const metadata: Metadata = {
  title: "VI Peel Informed Consent | Hello Gorgeous Med Spa",
  description: "Printable informed consent form for VI Peel treatments.",
  robots: "noindex, nofollow",
};

const risks = [
  "Redness, warmth, tightness, dryness, and visible peeling for several days.",
  "Temporary stinging, itching, swelling, or acne-like breakouts during healing.",
  "Uneven pigmentation changes, including temporary darkening or lightening.",
  "Cold sore flare-up in clients with a history of herpes simplex.",
  "Infection, prolonged irritation, scarring, or allergic reaction (rare).",
];

const contraindications = [
  "Pregnant or breastfeeding (unless cleared by your prescribing provider).",
  "Active skin infection, open wounds, eczema flare, sunburn, or dermatitis in treatment area.",
  "Recent isotretinoin use, unless provider has determined treatment is appropriate.",
  "Known allergy or sensitivity to peel ingredients, aspirin/salicylates, phenol, or related compounds.",
  "Recent waxing, depilatory use, laser treatment, or aggressive exfoliation in treatment area.",
];

export default function ViPeelConsentPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-8 print:px-0 print:py-3">
      <div className="mx-auto max-w-3xl">
        <section className="border-2 border-black p-6 print:p-5">
          <header className="border-b-2 border-black pb-4">
            <h1 className="text-2xl font-bold text-black">Hello Gorgeous Med Spa</h1>
            <p className="mt-1 text-sm text-black/80">
              74 W. Washington St, Oswego, IL 60543 - (630) 636-6193
            </p>
            <h2 className="mt-4 text-xl font-semibold text-[#E6007E]">VI Peel Informed Consent</h2>
            <p className="mt-2 text-sm text-black/80">
              Please read this form fully before treatment. Ask questions before signing.
            </p>
          </header>

          <section className="mt-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-black">Treatment overview</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/85">
              VI Peel is a medium-depth chemical peel used to improve tone, texture, acne, discoloration,
              and visible signs of photoaging. The treatment causes controlled exfoliation and peeling.
              Results vary by skin type, skin condition, home care, and adherence to aftercare instructions.
            </p>
          </section>

          <section className="mt-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-black">Possible side effects and risks</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-black/85">
              {risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </section>

          <section className="mt-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-black">Contraindications and precautions</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-black/85">
              {contraindications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-black">Patient acknowledgements</h3>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-black/85">
              <p>
                I understand that chemical peel results cannot be guaranteed and may require a series of
                treatments.
              </p>
              <p>
                I agree to avoid picking, peeling, or scrubbing treated skin and to follow all post-care
                instructions including strict SPF use.
              </p>
              <p>
                I understand that sun exposure, heat, and active skincare products can increase irritation
                and risk of complications during healing.
              </p>
              <p>
                I authorize Hello Gorgeous Med Spa clinical staff to perform the VI Peel treatment and
                related care judged clinically appropriate.
              </p>
            </div>
          </section>

          <section className="mt-6 rounded-md border border-[#E6007E]/40 bg-pink-50 p-4">
            <p className="text-sm font-semibold text-black">Important:</p>
            <p className="mt-1 text-sm leading-relaxed text-black/80">
              Contact the office promptly for severe pain, blistering, drainage, fever, or signs of
              infection after treatment.
            </p>
          </section>

          <section className="mt-6 border-t border-black pt-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-black">Signature</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/85">
              I have read and understand this informed consent. I have had the opportunity to ask
              questions, and all questions have been answered to my satisfaction. I voluntarily consent to
              treatment.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/70">Patient name (print)</p>
                <div className="mt-6 h-8 border-b-2 border-black" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/70">Date of birth</p>
                <div className="mt-6 h-8 border-b-2 border-black" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/70">Patient signature</p>
                <div className="mt-6 h-8 border-b-2 border-black" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/70">Date</p>
                <div className="mt-6 h-8 border-b-2 border-black" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/70">Provider witness</p>
                <div className="mt-6 h-8 border-b-2 border-black" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/70">Treatment area</p>
                <div className="mt-6 h-8 border-b-2 border-black" />
              </div>
            </div>
          </section>
        </section>

        <div className="mt-6 text-center print:hidden">
          <PrintButton />
        </div>
      </div>
    </main>
  );
}
