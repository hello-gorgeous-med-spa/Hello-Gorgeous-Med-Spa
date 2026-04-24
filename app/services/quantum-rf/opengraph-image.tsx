import {
  altForVariant,
  hgContourSocialImageResponse,
  HG_OG_CONTENT_TYPE,
  HG_OG_SIZE,
} from "@/lib/og/hg-contour-og-image";

export const alt = altForVariant("quantumService");
export const size = HG_OG_SIZE;
export const contentType = HG_OG_CONTENT_TYPE;

export default async function Image() {
  return hgContourSocialImageResponse("quantumService");
}
