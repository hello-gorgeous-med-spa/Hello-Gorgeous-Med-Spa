import type { LibraryVideo } from "@/lib/video-library";

export type RepurposedAsset = {
  quotes: string[];
  faqCandidates: { question: string; answer: string }[];
  clipReferenceIdeas: string[];
  socialCaptionIdeas: string[];
  internalLinkSuggestions: { label: string; href: string }[];
};

function sentenceChunks(text: string): string[] {
  return text
    .split(/[.!?]\s+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

export function buildRepurposePack(video: LibraryVideo): RepurposedAsset {
  const chunks = sentenceChunks(video.transcript);
  const quotes = chunks.slice(0, 3).map((chunk) => `"${chunk}."`);
  const faqCandidates = chunks.slice(0, 2).map((chunk, idx) => ({
    question: `Provider clarification ${idx + 1}: ${video.title}?`,
    answer: `${chunk}.`,
  }));

  return {
    quotes,
    faqCandidates,
    clipReferenceIdeas: [
      "15-30 second clinical explanation clip",
      "FAQ myth-vs-fact clip",
      "Consultation prep mini clip",
    ],
    socialCaptionIdeas: [
      `${video.title}: what patients usually ask first.`,
      `${video.title}: what changes early vs what settles later.`,
      `Concern-based education from Hello Gorgeous clinical team.`,
    ],
    internalLinkSuggestions: video.relatedServices,
  };
}
