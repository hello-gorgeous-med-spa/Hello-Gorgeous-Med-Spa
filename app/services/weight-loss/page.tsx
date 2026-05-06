import type { Metadata } from "next";
import Link from "next/link";
import { ProofConversionSection } from "@/components/services/ProofConversionSection";
import { ServiceTestimonialsPlaceholder } from "@/components/services/ServiceTestimonialsPlaceholder";
import { ServiceVideoTranscriptSection } from "@/components/services/ServiceVideoTranscriptSection";
import { GLP1_WEIGHT_LOSS_FAQS } from "@/lib/glp1-weight-loss-faqs";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PAGE_PATH = "/services/weight-loss";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const WEIGHT_LOSS_FAQS = [
  ...GLP1_WEIGHT_LOSS_FAQS.slice(0, 8),
  {
    question: "How fast do patients typically notice changes?",
    answer:
      "Most patients notice appetite control and reduced food noise in the first few weeks. Scale and body-composition changes usually become clearer over the first 8-12 weeks when dosing, protein intake, hydration, and activity are consistent.",
  },
  {
    question: "Can weight-loss treatment be paired with skin tightening?",
    answer:
      "Yes. For patients concerned about loose skin during fat loss, we often coordinate treatment timing with Morpheus8 or Quantum RF. Your provider decides sequence based on goals, anatomy, and downtime preferences.",
  },
  {
    question: "Who supervises treatment at Hello Gorgeous?",
    answer:
      "Care is medically supervised by our clinical team, including licensed nurse practitioners. We review history, candidacy, and response at follow-ups, then adjust plan details as needed for safety and sustainability.",
  },
  {
    question: "What does treatment usually cost?",
    answer:
      "Program pricing depends on medication selection, dosing phase, and required follow-up support. We review total plan cost during consultation so expectations are clear before treatment starts.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Weight Loss Clinic in Oswego, IL | GLP-1 Medical Weight Loss | Hello Gorgeous Med Spa",
  description:
    "GLP-1 medical weight loss in Oswego, IL with provider-supervised semaglutide and tirzepatide options. Serving Naperville, Aurora, Plainfield, and Yorkville. Consultation required.",
  path: PAGE_PATH,
  keywords: [
    "weight loss clinic Oswego IL",
    "GLP-1 weight loss near Naperville",
    "semaglutide weight loss Oswego",
    "tirzepatide clinic Aurora IL",
    "medical weight loss Plainfield IL",
  ],
});

export default function WeightLossServicePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Weight Loss", url: PAGE_URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(WEIGHT_LOSS_FAQS, PAGE_URL)) }}
      />

      <main className="bg-white">
        <section className="border-b-4 border-black bg-gradient-to-br from-black via-[#1a0a14] to-[#2d1020] py-16 text-white md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FFB8DC]">Hello Gorgeous Medical Weight Loss</p>
            <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
              GLP-1 Weight Loss
              <span className="block bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                with Real Clinical Supervision
              </span>
            </h1>
            <p className="mt-5 max-w-3xl text-base text-white/85 md:text-lg">
              We build medically supervised plans for adults in Oswego and nearby communities who want structured, sustainable fat loss.
              Every plan starts with candidacy review, labs where appropriate, and clear follow-up cadence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book?service=weight-loss-therapy" className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white">
                Book consultation
              </Link>
              <Link href="/contact" className="rounded-lg border-2 border-white px-6 py-3 font-semibold text-white">
                Contact clinical team
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b-2 border-black bg-white py-14 md:py-16">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
            <article className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <h2 className="text-2xl font-black text-black">Provider Perspective</h2>
              <p className="mt-3 text-black/80">
                Our clinicians use GLP-1 therapy as part of a full medical plan, not a quick-medication shortcut. The goal is controlled, sustainable
                fat loss with symptom management, nutrition support, and objective progress tracking.
              </p>
              <p className="mt-3 text-black/80">
                Patients doing best long-term are the ones who pair medication with resistance training, protein intake, and check-ins we can actually act on.
              </p>
            </article>
            <article className="rounded-3xl border-4 border-black bg-[#FFF0F7] p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.15)]">
              <h2 className="text-2xl font-black text-black">Local Weight Loss Care</h2>
              <p className="mt-3 text-black/80">
                Looking for a GLP-1 weight loss clinic near Oswego or Naperville? Hello Gorgeous treats patients from Oswego, Naperville, Aurora, Plainfield,
                Yorkville, and Montgomery with in-person care and practical follow-up.
              </p>
              <p className="mt-3 text-black/80">
                If loose skin becomes part of your concern during fat loss, we can discuss
                {" "}
                <Link href="/services/morpheus8" className="font-semibold text-[#E6007E] underline underline-offset-2">Morpheus8</Link>
                {" "}or{" "}
                <Link href="/services/quantum-rf" className="font-semibold text-[#E6007E] underline underline-offset-2">Quantum RF</Link>
                {" "}as combination options when clinically appropriate.
              </p>
            </article>
          </div>
        </section>

        <section className="border-b-2 border-black py-14 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-black text-black">What Patients Typically Notice</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Early changes (weeks 1-6)",
                  body: "Reduced appetite noise, easier meal control, and early scale changes. Energy and GI tolerance vary by dose phase.",
                },
                {
                  title: "Visible body changes (weeks 8-16)",
                  body: "More noticeable waist and clothing-fit changes. We monitor response and adjust treatment only as needed.",
                },
                {
                  title: "Final-phase refinement",
                  body: "As weight loss progresses, some patients add skin-tightening treatments for contour support and confidence.",
                },
                {
                  title: "Why results vary",
                  body: "Sleep, protein intake, training consistency, baseline metabolic health, and medication tolerance all influence speed and total response.",
                },
              ].map((item) => (
                <article key={item.title} className="rounded-2xl border-2 border-black bg-white p-5">
                  <h3 className="text-lg font-bold text-[#E6007E]">{item.title}</h3>
                  <p className="mt-2 text-black/80">{item.body}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 text-sm text-black/70">
              Compare options:{" "}
              <Link href="/compare/glp1-vs-traditional-weight-loss" className="font-semibold text-[#E6007E] underline underline-offset-2">
                GLP-1 vs traditional weight loss programs
              </Link>
              .
            </p>
          </div>
        </section>

        <ProofConversionSection
          serviceName="GLP-1 Weight Loss"
          concerns={[
            "Difficulty sustaining calorie deficit despite effort",
            "Persistent appetite dysregulation or food noise",
            "Metabolic risk factors requiring medical oversight",
            "Need for structured follow-up and dose management",
          ]}
          resultStages={[
            {
              title: "Early phase (weeks 1-6)",
              body: "Appetite control may improve first, with body-weight and measurement changes typically becoming clearer over subsequent weeks.",
            },
            {
              title: "Final phase (months 3+)",
              body: "Sustainable progress is usually judged over months with dose titration, nutrition compliance, and monitoring.",
            },
          ]}
          variabilityFactors={[
            "Medication tolerance and adherence",
            "Sleep, protein intake, and activity quality",
            "Baseline metabolic health profile",
            "Consistency with follow-up and behavior changes",
          ]}
          combinationGuidance="When body-shape or skin-laxity concerns emerge during fat loss, staged contour or tightening plans with Morpheus8 or Quantum RF may be discussed."
          ctaHref="/book?service=weight-loss-therapy"
          ctaLabel="Book weight loss consultation"
        />

        <ServiceVideoTranscriptSection
          serviceName="GLP-1 Weight Loss"
          videoTitle="Provider Q&A: GLP-1 Weight Loss Planning"
          videoEmbedUrl="https://www.youtube.com/embed/loJOgWGCkK8?rel=0"
          summary="Educational provider overview of candidacy, timeline expectations, side-effect management, and when combination body-support plans are considered."
          transcript={[
            "GLP-1 plans are medically supervised and adjusted over time rather than set once and forgotten.",
            "Early appetite and behavior changes often appear before full body-composition shifts.",
            "Results vary by adherence, baseline metabolism, and dose tolerance.",
            "For loose-skin concerns during fat loss, staged contour options can be discussed at follow-up.",
          ]}
          relatedLinks={[
            { label: "Quantum RF", href: "/services/quantum-rf" },
            { label: "Morpheus8", href: "/services/morpheus8" },
            { label: "GLP-1 vs Traditional Programs", href: "/compare/glp1-vs-traditional-weight-loss" },
          ]}
          pageUrl={`${SITE.url}/services/weight-loss`}
          thumbnailUrl={`${SITE.url}/images/services/hg-weight-loss.png`}
        />

        <ServiceTestimonialsPlaceholder serviceName="GLP-1 Weight Loss" />

        <section className="py-14 md:py-16">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-3xl font-black text-black">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-4">
              {WEIGHT_LOSS_FAQS.map((faq) => (
                <details key={faq.question} className="rounded-xl border-2 border-black/10 bg-white px-5 py-4">
                  <summary className="cursor-pointer text-lg font-bold text-[#E6007E]">{faq.question}</summary>
                  <p className="mt-3 text-black/80">{faq.answer}</p>
                </details>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book?service=weight-loss-therapy" className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white">
                Book weight loss consultation
              </Link>
              <Link href="/services/quantum-rf" className="rounded-lg border-2 border-black px-6 py-3 font-semibold text-black">
                Explore Quantum RF
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
