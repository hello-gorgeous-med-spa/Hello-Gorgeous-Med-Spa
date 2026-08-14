import Link from "next/link";

import {
  MEDICAL_DIRECTOR,
  NP_LICENSURE_FACTS,
  NP_SCOPE_OF_PRACTICE,
  OVERSIGHT_MODEL,
  PRESCRIBING_NP,
} from "@/lib/medical-authority";

const CARD =
  "rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:p-8";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">{children}</p>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm font-medium leading-relaxed text-black/80">
          <span aria-hidden className="mt-[3px] text-[#FF2D8E]">
            ▸
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Scope of practice + licensure for the prescribing NP. Facts come from
 * `lib/medical-authority` so this page can never claim more than the record does.
 */
export function NpScopePanel({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-6 lg:grid-cols-2 ${className}`}>
      <section className={CARD}>
        <Eyebrow>What Ryan treats</Eyebrow>
        <h2 className="mt-2 text-2xl font-black text-black">Scope of practice</h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-black/70">
          Ryan directs the medical side of the practice — the treatments below are planned,
          prescribed, and monitored by him.
        </p>
        <BulletList items={NP_SCOPE_OF_PRACTICE} />
      </section>

      <section className={CARD}>
        <Eyebrow>Credentials</Eyebrow>
        <h2 className="mt-2 text-2xl font-black text-black">Licensure &amp; authority</h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-black/70">
          Every item here is a verifiable fact about how care is delivered at our Oswego clinic.
        </p>
        <BulletList items={NP_LICENSURE_FACTS} />
      </section>
    </div>
  );
}

/**
 * How authority actually flows between the nurse practitioner and the physician
 * Medical Director. Rendered on both provider pages so the two profiles tell one story.
 */
export function OversightModelPanel({
  className = "",
  activeProfile,
}: {
  className?: string;
  /** Which provider page this is on — the other clinician gets a link. */
  activeProfile: "np" | "medical-director";
}) {
  const other = activeProfile === "np" ? MEDICAL_DIRECTOR : PRESCRIBING_NP;

  return (
    <section className={`${CARD} ${className}`}>
      <Eyebrow>Medical oversight</Eyebrow>
      <h2 className="mt-2 text-2xl font-black text-black sm:text-3xl">How oversight works here</h2>
      <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-black/70">
        Medical spas differ in how clinical responsibility is structured. This is ours, in plain
        language.
      </p>

      <ol className="mt-6 space-y-5">
        {OVERSIGHT_MODEL.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span
              aria-hidden
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-sm font-black text-white"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="text-base font-bold text-[#E6007E]">{step.title}</h3>
              <p className="mt-1 text-sm font-medium leading-relaxed text-black/80">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 border-t-4 border-black pt-5 text-sm font-semibold text-black/70">
        {activeProfile === "np" ? "Medical Director: " : "On-site nurse practitioner: "}
        <Link
          href={other.profilePath}
          className="font-bold text-[#E6007E] underline decoration-[#E6007E] decoration-2 underline-offset-2 hover:text-black"
        >
          {other.displayName}
        </Link>
        {" — "}
        {other.roleLine}
      </p>
    </section>
  );
}
