import { staticFile } from "remotion";
import assetManifest from "../../public/assets/assets.json";

type AssetCategory = "logos" | "devices" | "treatments" | "clients" | "backgrounds" | "audio";

/**
 * Resolve an asset by category and key name from the asset manifest.
 * Returns a staticFile() path ready for use in <Img> or <Audio>.
 *
 * Usage:
 *   const src = useAsset("devices", "morpheus8-burst");
 *   <Img src={src} />
 */
export function useAsset(category: AssetCategory, key: string): string {
  const categoryMap = assetManifest[category] as Record<string, string> | undefined;
  if (!categoryMap) {
    console.warn(`[useAsset] Unknown category: ${category}`);
    return "";
  }
  const path = categoryMap[key];
  if (!path) {
    console.warn(`[useAsset] Asset not found: ${category}/${key}`);
    return "";
  }
  return staticFile(path);
}

/**
 * List all asset keys in a category.
 */
export function listAssets(category: AssetCategory): string[] {
  const categoryMap = assetManifest[category] as Record<string, string> | undefined;
  return categoryMap ? Object.keys(categoryMap) : [];
}
