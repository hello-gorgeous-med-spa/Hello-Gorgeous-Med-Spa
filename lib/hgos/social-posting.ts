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

export interface SocialPostInput {
  message: string;
  link?: string;
  imageUrl?: string;
}

export interface ChannelResult {
  ok: boolean;
  id?: string;
  error?: string;
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
    // STANDARD + callToAction — OFFER requires `event` + offer fields per GBP API; link-only posts must not use OFFER.
    const body: Record<string, unknown> = {
      languageCode: "en-US",
      summary: message,
      topicType: "STANDARD",
    };
    if (link) {
      body.callToAction = {
        actionType: "LEARN_MORE",
        url: link.startsWith("http") ? link : `https://${link}`,
      };
    }
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
      const err = (await res.json()) as { error?: { message?: string } };
      return { ok: false, error: err.error?.message ?? res.statusText };
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
  channels: SocialChannel[]
): Promise<Record<SocialChannel, ChannelResult | undefined>> {
  const results: Record<string, ChannelResult | undefined> = {};
  const pageId = process.env.META_PAGE_ID;
  const pageToken = process.env.META_PAGE_ACCESS_TOKEN;
  const igAccountId = process.env.META_INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const googleAccountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
  const googleLocationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

  if (channels.includes("facebook")) {
    if (pageId && pageToken) {
      results.facebook = await postToFacebook(pageId, pageToken, input);
    } else {
      results.facebook = { ok: false, error: "META_PAGE_ID and META_PAGE_ACCESS_TOKEN required." };
    }
  }
  if (channels.includes("instagram")) {
    if (igAccountId && pageToken) {
      results.instagram = await postToInstagram(igAccountId, pageToken, input);
    } else {
      results.instagram = {
        ok: false,
        error: "META_INSTAGRAM_BUSINESS_ACCOUNT_ID and META_PAGE_ACCESS_TOKEN required.",
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
