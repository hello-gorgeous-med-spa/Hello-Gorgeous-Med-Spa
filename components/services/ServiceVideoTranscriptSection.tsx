import Link from "next/link";
import { VideoEmbed } from "@/components/video/VideoEmbed";

type RelatedServiceLink = {
  label: string;
  href: string;
};

type ServiceVideoTranscriptSectionProps = {
  serviceName: string;
  videoTitle: string;
  videoEmbedUrl: string;
  summary: string;
  transcript: string[];
  relatedLinks: RelatedServiceLink[];
  pageUrl: string;
  thumbnailUrl?: string;
};

export function ServiceVideoTranscriptSection({
  serviceName,
  videoTitle,
  videoEmbedUrl,
  summary,
  transcript,
  relatedLinks,
  pageUrl,
  thumbnailUrl,
}: ServiceVideoTranscriptSectionProps) {
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: videoTitle,
    description: summary,
    embedUrl: videoEmbedUrl,
    thumbnailUrl: thumbnailUrl ? [thumbnailUrl] : undefined,
    about: serviceName,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    url: pageUrl,
  };

  return (
    <section className="border-y-2 border-black bg-zinc-50 py-14 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-black text-black md:text-4xl">Provider Video + Transcript</h2>
        <p className="mt-2 max-w-3xl text-black/75">
          Educational content only. This does not replace an in-person medical assessment.
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-hidden rounded-2xl border-2 border-black bg-black">
            <div className="relative aspect-video w-full">
              <VideoEmbed embedUrl={videoEmbedUrl} title={videoTitle} className="absolute left-0 top-0 h-full w-full" />
            </div>
          </div>
          <div className="rounded-2xl border-2 border-black bg-white p-5">
            <h3 className="text-xl font-bold text-[#E6007E]">{videoTitle}</h3>
            <p className="mt-2 text-black/80">{summary}</p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-black/60">Related services</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {relatedLinks.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full border border-black/20 px-3 py-1 text-sm font-medium text-[#E6007E]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <article className="mt-5 rounded-2xl border-2 border-black bg-white p-5">
          <h3 className="text-xl font-bold text-[#E6007E]">Transcript (educational excerpt)</h3>
          <div className="mt-3 space-y-2 text-black/80">
            {transcript.map((line, idx) => (
              <p key={`${idx}-${line.slice(0, 20)}`}>{line}</p>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
