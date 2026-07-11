/** Animated science visuals for peptide education landers. */

export const PEPTIDE_SCIENCE_VIDEOS = {
  /** /rx home hero — Animated Science Visuals (2) */
  rxHero: "/videos/peptides/animated-science-visuals-rx-hero.mp4",
  /** /rx "What are peptides?" education band — Animated Science Visuals (4) */
  rxEducation: "/videos/peptides/animated-science-visuals-rx-education.mp4",
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
