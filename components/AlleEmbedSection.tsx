"use client";

import { FadeUp, Section } from "@/components/Section";

/** Optional Allē Rewards embed URL (e.g. Allergan/Allē widget or patient portal). Set in .env as NEXT_PUBLIC_ALLE_EMBED_URL. */
const ALLE_EMBED_URL =
  typeof process.env.NEXT_PUBLIC_ALLE_EMBED_URL === "string" &&
  process.env.NEXT_PUBLIC_ALLE_EMBED_URL.length > 0
    ? process.env.NEXT_PUBLIC_ALLE_EMBED_URL
    : null;

/**
 * Optional custom embed HTML (e.g. iframe or script snippet you built). Set in .env as NEXT_PUBLIC_ALLE_EMBED_HTML.
 * If your snippet includes scripts, add the script host to script-src in next.config.js CSP.
 */
const ALLE_EMBED_HTML =
  typeof process.env.NEXT_PUBLIC_ALLE_EMBED_HTML === "string" &&
  process.env.NEXT_PUBLIC_ALLE_EMBED_HTML.length > 0
    ? process.env.NEXT_PUBLIC_ALLE_EMBED_HTML
    : null;

/** Default Allē program page when no embed URL/HTML is set — so the section always has a clear CTA. */
const ALLE_LEARN_MORE_URL = "https://www.alle.com/points-and-earning";

/**
 * Embed section for the Allē Rewards page.
 * Renders (1) an iframe when NEXT_PUBLIC_ALLE_EMBED_URL is set, or (2) custom HTML when NEXT_PUBLIC_ALLE_EMBED_HTML is set.
 * When neither is set, shows a CTA to the official Allē site and a note for where to add your Cursor-built embed.
 * To add embed code directly in code, edit this file: replace the fallback block below with your iframe/script markup (and allow the origin in next.config.js CSP if needed).
 */
export function AlleEmbedSection() {
  const hasIframe = Boolean(ALLE_EMBED_URL);
  const hasCustomHtml = Boolean(ALLE_EMBED_HTML);
  const showFallback = !hasIframe && !hasCustomHtml;

  return (
    <Section className="bg-white">
      <FadeUp>
        <div className="rounded-2xl border-2 border-black overflow-hidden bg-white">
          <div className="p-4 border-b border-black/10 bg-pink-50/30">
            <h2 className="text-xl font-bold text-[#FF2D8E]">Allē Rewards</h2>
            <p className="mt-1 text-black/80 text-sm">
              Use the tool below to check your rewards, enroll, or learn more.
            </p>
          </div>
          <div className="relative w-full min-h-[400px] md:min-h-[500px]">
            {hasIframe && (
              <iframe
                src={ALLE_EMBED_URL!}
                title="Allē Rewards – Hello Gorgeous Med Spa"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                allow="fullscreen"
              />
            )}
            {!hasIframe && hasCustomHtml && (
              <div
                className="w-full h-full min-h-[400px] md:min-h-[500px] [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:min-h-[400px]"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: ALLE_EMBED_HTML! }}
              />
            )}
            {showFallback && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-pink-50/20">
                <p className="text-black/80 text-center max-w-md mb-6">
                  Earn points on Botox®, Juvederm®, Kybella®, Latisse®, SkinMedica® and more. Enroll or check your balance on Allē.
                </p>
                <a
                  href={ALLE_LEARN_MORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2D8E] text-white font-semibold px-8 py-4 hover:bg-[#E6007E] transition-colors"
                >
                  Go to Allē Rewards
                  <span aria-hidden>→</span>
                </a>
                <p className="mt-8 text-xs text-black/50 text-center max-w-lg">
                  To show the embed you built here, set <code className="bg-black/5 px-1 rounded">NEXT_PUBLIC_ALLE_EMBED_URL</code> or <code className="bg-black/5 px-1 rounded">NEXT_PUBLIC_ALLE_EMBED_HTML</code> in .env, or paste your embed code in <code className="bg-black/5 px-1 rounded">components/AlleEmbedSection.tsx</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </FadeUp>
    </Section>
  );
}
