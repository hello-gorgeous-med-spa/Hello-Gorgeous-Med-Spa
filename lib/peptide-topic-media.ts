/** Animated science visuals for peptide education landers. */

export const PEPTIDE_SCIENCE_VIDEOS = {
  primary: "/videos/peptides/animated-science-visuals.mp4",
  alternate: "/videos/peptides/animated-science-visuals-alt.mp4",
} as const;

function slugHash(slug: string): number {
  return slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

/** Hero + secondary science band — alternates the two clips per topic. */
export function peptideTopicVideos(slug: string): { hero: string; science: string } {
  const flip = slugHash(slug) % 2 === 1;
  return {
    hero: flip ? PEPTIDE_SCIENCE_VIDEOS.primary : PEPTIDE_SCIENCE_VIDEOS.alternate,
    science: flip ? PEPTIDE_SCIENCE_VIDEOS.alternate : PEPTIDE_SCIENCE_VIDEOS.primary,
  };
}
