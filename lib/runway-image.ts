/** Ratios accepted by `gen4_image` on POST /v1/text_to_image. Safe to import from client UI. */
export const GEN4_IMAGE_RATIOS = [
  "1080:1080",
  "1080:1920",
  "1920:1080",
  "1280:720",
  "720:1280",
] as const;

export type Gen4ImageRatio = (typeof GEN4_IMAGE_RATIOS)[number];

export function isGen4ImageRatio(value: string): value is Gen4ImageRatio {
  return (GEN4_IMAGE_RATIOS as readonly string[]).includes(value);
}
