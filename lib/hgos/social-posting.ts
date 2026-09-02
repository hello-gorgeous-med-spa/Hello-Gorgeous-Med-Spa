// ============================================================
// SOCIAL POSTING — Facebook, Instagram, Google Business
// Tell the agent what to post → posts to selected channels.
// Env: META_* for FB/IG. Google: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
// GOOGLE_REFRESH_TOKEN, GOOGLE_BUSINESS_ACCOUNT_ID, GOOGLE_BUSINESS_LOCATION_ID.
// ============================================================

const META_GRAPH = "https://graph.facebook.com/v21.0";
const META_IG_GRAPH = "https://graph.facebook.com/v21.0";
const GOOGLE_MYBUSINESS = "https://mybusiness.googleapis.com/v4";

export type SocialChannel = "facebook" | "instagram" | "google";

/** Which Meta Page to post to. `regen` → RE GEN dedicated Page env vars. */
export type SocialMetaBrand = "default" | "regen";

export interface SocialPostInput {
  message: string;
  link?: string;
  imageUrl?: string;
}

export interface SocialPostOptions {
  metaBrand?: SocialMetaBrand;
}

type MetaAccount = {
  id?: string;
  name?: string;
  access_token?: string;
  instagram_business_account?: { id?: string };
};

function metaEnvForBrand(brand: SocialMetaBrand): {
  pageId?: string;
  candidatePageIds: string[];
  pageToken?: string;
  igAccountId?: string;
} {
  const uniqueIds = (...ids: Array<string | undefined>) =>
    [...new Set(ids.map((id) => id?.trim()).filter((id): id is string => Boolean(id)))];

  if (brand === "regen") {
    return {
      pageId: process.env.META_REGEN_PAGE_ID,
      candidatePageIds: uniqueIds(process.env.META_REGEN_PAGE_ID),
      pageToken:
        process.env.META_REGEN_PAGE_ACCESS_TOKEN ||
        process.env.META_PAGE_ACCESS_TOKEN ||
        process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
      igAccountId:
        process.env.META_REGEN_INSTAGRAM_BUSINESS_ACCOUNT_ID ||
        process.env.META_REGEN_IG_ACCOUNT_ID,
    };
  }
  return {
    // FACEBOOK_PAGE_ID is the Hello Gorgeous Med Spa Page Danielle maintains.
    // META_PAGE_ID can be a stale Graph/profile id and must not win by accident.
    pageId: process.env.FACEBOOK_PAGE_ID || process.env.META_PAGE_ID,
    candidatePageIds: uniqueIds(process.env.FACEBOOK_PAGE_ID, process.env.META_PAGE_ID),
    pageToken:
      process.env.FACEBOOK_PAGE_ACCESS_TOKEN || process.env.META_PAGE_ACCESS_TOKEN,
    igAccountId:
      process.env.META_INSTAGRAM_BUSINESS_ACCOUNT_ID ||
      process.env.META_IG_ACCOUNT_ID ||
      process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
  };
}

function accountMatchesBrand(account: MetaAccount, brand: SocialMetaBrand): boolean {
  const name = (account.name || "").trim();
  const isRegen = /\bre\s*-?\s*gen\b/i.test(name);
  if (brand === "regen") return isRegen;
  return /hello gorgeous/i.test(name) && !isRegen;
}

function pickAccountForBrand(
  accounts: MetaAccount[],
  candidatePageIds: string[],
  brand: SocialMetaBrand
): MetaAccount | undefined {
  for (const id of candidatePageIds) {
    const hit = accounts.find((account) => account.id === id);
    if (hit && accountMatchesBrand(hit, brand)) return hit;
  }
  return accounts.find((account) => accountMatchesBrand(account, brand));
}

export interface ChannelResult {
  ok: boolean;
  id?: string;
  error?: string;
  pageName?: string;
}

async function resolveMetaPostingContext(
  brand: SocialMetaBrand,
  pageId: string | undefined,
  candidatePageIds: string[],
  token: string | undefined,
  igBusinessAccountId: string | undefined
): Promise<{
  pageId?: string;
  pageToken?: string;
  igBusinessAccountId?: string;
  pageName?: string;
  error?: string;
}> {
  if (!token) {
    return { pageId, pageToken: token, igBusinessAccountId };
  }

  try {
    // If token is a user token, this returns page-scoped tokens and linked IG ids.
    const res = await fetch(
      `${META_GRAPH}/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${encodeURIComponent(
        token
      )}`
    );
    const payload = (await res.json()) as { data?: MetaAccount[]; error?: { message?: string } };

    if (payload.error || !Array.isArray(payload.data) || payload.data.length === 0) {
      return { pageId, pageToken: token, igBusinessAccountId };
    }

    const matched = pickAccountForBrand(payload.data, candidatePageIds, brand);

    if (!matched?.id) {
      const available = payload.data
        .map((account) => account.name?.trim())
        .filter(Boolean)
        .join(", ");
      const wanted = brand === "regen" ? "Re Gen RX" : "Hello Gorgeous Med Spa";
      return {
        pageId,
        pageToken: token,
        igBusinessAccountId,
        error: `Facebook token can post to ${available || "no Pages"}, but none matched ${wanted}.`,
      };
    }

    return {
      pageId: matched.id,
      pageToken: matched.access_token || token,
      igBusinessAccountId: igBusinessAccountId || matched.instagram_business_account?.id,
      pageName: matched.name?.trim(),
    };
  } catch {
    // Fall back to existing env vars if Meta lookup fails.
    return { pageId, pageToken: token, igBusinessAccountId };
  }
}

/** Which Facebook Page a post would hit. Does not publish. */
export async function inspectMetaPostingTarget(brand: SocialMetaBrand = "default"): Promise<{
  brand: SocialMetaBrand;
  pageName?: string;
  ok: boolean;
  error?: string;
}> {
  const env = metaEnvForBrand(brand);
  const meta = await resolveMetaPostingContext(
    brand,
    env.pageId,
    env.candidatePageIds,
    env.pageToken,
    env.igAccountId
  );
  if (meta.error) {
    return { brand, pageName: meta.pageName, ok: false, error: meta.error };
  }
  return {
    brand,
    pageName: meta.pageName,
    ok: Boolean(meta.pageId && meta.pageToken),
    error: meta.pageId && meta.pageToken ? undefined : "Facebook Page ID or access token missing.",
  };
}

/** Post to Facebook Page (feed or photo). */
export async function postToFacebook(
  pageId: string,
  pageAccessToken: string,
  input: SocialPostInput
): Promise<ChannelResult> {
  const { message, link, imageUrl } = input;
  try {
    if (imageUrl) {
      const res = await fetch(`${META_GRAPH}/${pageId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: imageUrl,
          caption: message,
          access_token: pageAccessToken,
        }),
      });
      const data = (await res.json()) as { id?: string; post_id?: string; error?: { message: string } };
      if (data.error) return { ok: false, error: data.error.message };
      return { ok: true, id: data.post_id || data.id };
    }
    const res = await fetch(`${META_GRAPH}/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        ...(link && { link }),
        access_token: pageAccessToken,
      }),
    });
    const data = (await res.json()) as { id?: string; error?: { message: string } };
    if (data.error) return { ok: false, error: data.error.message };
    return { ok: true, id: data.id };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return { ok: false, error: err };
  }
}

/** Post to Instagram Business (image required). Two-step: create container then publish. */
export async function postToInstagram(
  igBusinessAccountId: string,
  pageAccessToken: string,
  input: SocialPostInput
): Promise<ChannelResult> {
  const { message, imageUrl } = input;
  if (!imageUrl) {
    return { ok: false, error: "Instagram feed posts require an image URL." };
  }
  try {
    const createRes = await fetch(`${META_IG_GRAPH}/${igBusinessAccountId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: message,
        access_token: pageAccessToken,
      }),
    });
    const createData = (await createRes.json()) as { id?: string; error?: { message: string } };
    if (createData.error) return { ok: false, error: createData.error.message };
    const containerId = createData.id;
    if (!containerId) return { ok: false, error: "No container ID returned" };

    const publishRes = await fetch(`${META_IG_GRAPH}/${igBusinessAccountId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: pageAccessToken,
      }),
    });
    const publishData = (await publishRes.json()) as { id?: string; error?: { message: string } };
    if (publishData.error) return { ok: false, error: publishData.error.message };
    return { ok: true, id: publishData.id };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return { ok: false, error: err };
  }
}

/** Get Google OAuth2 access token from refresh token. */
async function getGoogleAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = (await res.json()) as { access_token?: string; error?: string };
  return data.access_token ?? null;
}

/** Google Business Profile local post (Call-to-Action or summary). */
export async function postToGoogle(
  accountId: string,
  locationId: string,
  input: SocialPostInput,
  accessToken: string
): Promise<ChannelResult> {
  const { message, link, imageUrl } = input;
  try {
    // STANDARD only. OFFER requires `event` + offer; many locations also return INVALID_ARGUMENT for callToAction
    // (LEARN_MORE/BOOK) even though docs allow it — append link into summary instead.
    const url =
      link?.trim() &&
      (link.trim().startsWith("http") ? link.trim() : `https://${link.trim()}`);
    const summary =
      url && !message.includes(url.replace(/^https:\/\//, ""))
        ? `${message}\n\n${url}`
        : message;
    const body: Record<string, unknown> = {
      languageCode: "en-US",
      summary,
      topicType: "STANDARD",
    };
    if (imageUrl) {
      body.media = [{ mediaFormat: "PHOTO", sourceUrl: imageUrl }];
    }
    const res = await fetch(
      `${GOOGLE_MYBUSINESS}/accounts/${accountId}/locations/${locationId}/localPosts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const err = (await res.json()) as {
        error?: { message?: string; status?: string; details?: unknown };
      };
      const details =
        err.error?.details != null ? ` ${JSON.stringify(err.error.details)}` : "";
      return {
        ok: false,
        error: `${err.error?.message ?? res.statusText}${details}`,
      };
    }
    const data = (await res.json()) as { name?: string };
    return { ok: true, id: data.name ?? undefined };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return { ok: false, error: err };
  }
}

/** Post to selected channels. Uses env vars for credentials. */
export async function postToChannels(
  input: SocialPostInput,
  channels: SocialChannel[],
  options?: SocialPostOptions
): Promise<Record<SocialChannel, ChannelResult | undefined>> {
  const results: Record<string, ChannelResult | undefined> = {};
  const brand = options?.metaBrand ?? "default";
  const {
    pageId: configuredPageId,
    candidatePageIds,
    pageToken: configuredPageToken,
    igAccountId: configuredIgAccountId,
  } = metaEnvForBrand(brand);
  const googleAccountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
  const googleLocationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;
  const meta = await resolveMetaPostingContext(
    brand,
    configuredPageId,
    candidatePageIds,
    configuredPageToken,
    configuredIgAccountId
  );
  const pageId = meta.pageId || configuredPageId;
  const pageToken = meta.pageToken || configuredPageToken;
  const igAccountId = meta.igBusinessAccountId || configuredIgAccountId;

  if (channels.includes("facebook")) {
    if (meta.error) {
      results.facebook = { ok: false, error: meta.error, pageName: meta.pageName };
    } else if (pageId && pageToken) {
      results.facebook = await postToFacebook(pageId, pageToken, input);
      results.facebook.pageName = meta.pageName;
    } else {
      results.facebook = {
        ok: false,
        error:
          brand === "regen"
            ? "META_REGEN_PAGE_ID and a Page access token required (META_REGEN_PAGE_ACCESS_TOKEN or META_PAGE_ACCESS_TOKEN)."
            : "FACEBOOK_PAGE_ID (or META_PAGE_ID) and FACEBOOK_PAGE_ACCESS_TOKEN (or META_PAGE_ACCESS_TOKEN) required.",
      };
    }
  }
  if (channels.includes("instagram")) {
    if (meta.error) {
      results.instagram = { ok: false, error: meta.error, pageName: meta.pageName };
    } else if (igAccountId && pageToken) {
      results.instagram = await postToInstagram(igAccountId, pageToken, input);
      results.instagram.pageName = meta.pageName;
    } else {
      results.instagram = {
        ok: false,
        error:
          brand === "regen"
            ? "META_REGEN_INSTAGRAM_BUSINESS_ACCOUNT_ID and a Page access token required."
            : "META_INSTAGRAM_BUSINESS_ACCOUNT_ID and a Page access token (META_PAGE_ACCESS_TOKEN or FACEBOOK_PAGE_ACCESS_TOKEN) required.",
      };
    }
  }
  if (channels.includes("google")) {
    if (googleAccountId && googleLocationId) {
      const accessToken = await getGoogleAccessToken();
      if (!accessToken) {
        results.google = {
          ok: false,
          error:
            "Google OAuth required. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN.",
        };
      } else {
        results.google = await postToGoogle(googleAccountId, googleLocationId, input, accessToken);
      }
    } else {
      results.google = {
        ok: false,
        error: "GOOGLE_BUSINESS_ACCOUNT_ID and GOOGLE_BUSINESS_LOCATION_ID required.",
      };
    }
  }
  return results as Record<SocialChannel, ChannelResult | undefined>;
}
