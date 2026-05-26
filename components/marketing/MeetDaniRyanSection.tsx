import Image from "next/image";
import Link from "next/link";
import { FadeUp, Section } from "@/components/Section";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { DANI_IMAGE, RYAN_IMAGE } from "@/lib/founder-credentials";

function FounderCard({
  image,
  imageAlt,
  heading,
  role,
  credentials,
  body,
  ctaLabel,
  ctaHref,
  delayMs,
}: {
  image: string;
  imageAlt: string;
  heading: string;
  role: string;
  credentials: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  delayMs: number;
}) {
  return (
    <FadeUp delayMs={delayMs}>
      <article className="h-full rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] flex flex-col">
        <div className="relative mx-auto mb-6 h-40 w-40 shrink-0 overflow-hidden rounded-2xl border-4 border-black">
          <Image src={image} alt={imageAlt} fill className="object-cover object-center" sizes="160px" />
        </div>
        <h3 className="text-2xl font-black text-black">{heading}</h3>
        <p className="mt-1 text-sm font-bold uppercase tracking-wider text-[#E6007E]">{role}</p>
        <p className="mt-3 text-sm font-semibold text-black/75">{credentials}</p>
        <p className="mt-4 flex-1 text-black/85 font-medium leading-relaxed">{body}</p>
        <Link
          href={ctaHref}
          className="mt-6 inline-flex items-center gap-1 font-bold text-[#E6007E] hover:text-[#FF2D8E] underline decoration-2 underline-offset-4 decoration-[#E6007E]"
        >
          {ctaLabel}
        </Link>
      </article>
    </FadeUp>
  );
}

export function MeetDaniRyanSection() {
  return (
    <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] via-white to-white">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-center text-xs font-bold uppercase tracking-[0.15em] text-[#E6007E] mb-3 max-w-2xl mx-auto leading-snug">
            {HG_TAGLINE}
          </p>
          <h2 className="text-center text-3xl md:text-4xl font-black text-black mb-4">
            Meet{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              Dani &amp; Ryan
            </span>
          </h2>
          <p className="text-center text-black/75 font-medium max-w-2xl mx-auto mb-10 md:mb-12">
            Real founders. Real credentials. On site every week — not a rented medical director from another state.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          <FounderCard
            image={DANI_IMAGE}
            imageAlt="Danielle Alcala-Glazier, Owner and Founder of Hello Gorgeous Med Spa"
            heading="Meet Dani"
            role="Owner & Founder"
            credentials="Licensed Esthetician, Phlebotomist, CMAA, CNA (RN in progress)"
            body="10+ years owning this practice. Still in the office every day. Started with severe acne at 12, opened my first chair with help from the aunt who raised me, and I'm still here."
            ctaLabel="Read Dani's founder's letter →"
            ctaHref="/blog/founder-letter-morpheus8-solaria-oswego-il"
            delayMs={0}
          />
          <FounderCard
            image={RYAN_IMAGE}
            imageAlt="Ryan Kent, FNP-BC, Medical Director at Hello Gorgeous Med Spa"
            heading="Meet Ryan"
            role="Medical Director"
            credentials="Ryan Kent, FNP-BC — Family Nurse Practitioner, Board-Certified"
            body="Full prescriptive authority in Illinois. On site 7 days a week. Every clinical protocol at Hello Gorgeous — from Botox dosing to GLP-1 weight loss to hormone therapy — goes through me."
            ctaLabel="Meet Ryan →"
            ctaHref="/about#ryan"
            delayMs={80}
          />
        </div>

        <FadeUp delayMs={120}>
          <div className="mt-10 md:mt-12 text-center">
            <p className="text-black/75 font-medium max-w-2xl mx-auto mb-4">
              Having both a male and female practitioner is not just convenient — it is a real advantage for
              comfort, balance, and treatment planning.
            </p>
            <Link
              href="/blog/male-female-practitioners-med-spa-advantage-oswego-il"
              className="inline-flex items-center justify-center rounded-full border-4 border-black bg-white px-6 py-3 text-sm font-bold text-[#E6007E] shadow-[6px_6px_0_0_rgba(230,0,126,0.35)] hover:bg-[#FFF0F7] transition-colors"
            >
              Read why our team works this way →
            </Link>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
