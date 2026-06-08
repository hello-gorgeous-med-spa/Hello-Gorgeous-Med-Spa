import { SITE } from "@/lib/seo";
import { CLIENT_APP } from "@/lib/client-app";

/** Canonical URL encoded in print / in-spa QR codes for the client app. */
export function getAppInstallUrl(options?: {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): string {
  const url = new URL(CLIENT_APP.path, SITE.url);
  url.searchParams.set("utm_source", options?.utmSource ?? "qr");
  url.searchParams.set("utm_medium", options?.utmMedium ?? "scan");
  url.searchParams.set("utm_campaign", options?.utmCampaign ?? "app_install");
  return url.toString();
}
