import Link from "next/link";
import { FadeUp, Section } from "@/components/Section";
import {
  INMODE_TRAINING_ATTESTATION,
  type InModeTrainingCertificate,
} from "@/lib/inmode-training-certificates";

function CertificateCard({
  item,
  delayMs,
}: {
  item: InModeTrainingCertificate;
  delayMs: number;
}) {
  return (
    <FadeUp delayMs={delayMs}>
      <a
        href={item.file}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full rounded-2xl border-4 border-black bg-gradient-to-br from-rose-50 to-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)] hover:shadow-[6px_6px_0_0_rgba(230,0,126,0.35)] hover:-translate-y-1 transition-all"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#E6007E] flex items-center justify-center text-white font-bold text-lg">
            📜
          </div>
          <div className="text-xs text-[#E6007E] font-bold uppercase tracking-wider">
            InMode Certificate
          </div>
        </div>
        <h3 className="text-base font-bold text-black group-hover:text-[#E6007E] transition-colors">
          {item.providerName}
        </h3>
        <p className="text-xs text-black/55 mt-0.5">{item.credentialLabel}</p>
        <p className="text-sm text-black/75 mt-2 font-medium">{item.trainingTitle}</p>
        <p className="text-xs text-black/50 mt-2">Completed {item.completedDate}</p>
        <p className="mt-3 text-xs text-[#E6007E] font-semibold">View certificate (PDF) →</p>
      </a>
    </FadeUp>
  );
}

export function InModeTrainingCertificates({
  items,
  title = "InMode certified providers",
  subtitle = "Official training certificates from InMode — click to view the PDF",
  className = "",
  compact = false,
}: {
  items: InModeTrainingCertificate[];
  title?: string;
  subtitle?: string;
  className?: string;
  compact?: boolean;
}) {
  if (items.length === 0) return null;

  const inner = (
    <>
      <FadeUp>
        <div className={compact ? "mb-6" : "text-center mb-12"}>
          {!compact ? (
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E6007E]/10 text-[#E6007E] text-xs font-bold uppercase tracking-wider mb-4">
              Verified Training
            </span>
          ) : null}
          <h2
            className={
              compact
                ? "text-xl md:text-2xl font-black text-black"
                : "text-3xl md:text-4xl font-bold text-black"
            }
          >
            {title}
          </h2>
          <p
            className={
              compact
                ? "text-sm text-black/65 mt-2 max-w-xl"
                : "text-lg text-black/60 mt-4 max-w-2xl mx-auto"
            }
          >
            {subtitle}
          </p>
        </div>
      </FadeUp>

      <div
        className={
          compact
            ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        }
      >
        {items.map((item, idx) => (
          <CertificateCard key={`${item.file}-${item.trainingTitle}`} item={item} delayMs={idx * 60} />
        ))}
      </div>

      <FadeUp delayMs={300}>
        <p className={`text-sm text-black/50 ${compact ? "mt-4" : "text-center mt-8"}`}>
          {INMODE_TRAINING_ATTESTATION}
        </p>
        {compact ? (
          <p className="mt-3 text-sm">
            <Link href="/our-promise" className="font-bold text-[#E6007E] hover:underline">
              See all provider credentials on Our Promise →
            </Link>
          </p>
        ) : null}
      </FadeUp>
    </>
  );

  if (compact) {
    return <div className={className}>{inner}</div>;
  }

  return (
    <Section className={`bg-white py-16 border-t-4 border-black ${className}`.trim()}>
      <div className="max-w-6xl mx-auto px-4 md:px-6">{inner}</div>
    </Section>
  );
}
