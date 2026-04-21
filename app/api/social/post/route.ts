import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { postToChannels, type SocialChannel } from "@/lib/hgos/social-posting";
import { SITE } from "@/lib/seo";

// ============================================================
// POST /api/social/post
// 1) Text / image / link: { message, channels[], link?, imageUrl?, scheduledAt? }
//    - With scheduledAt → insert scheduled_social_posts (cron publishes)
//    - Without → post immediately via postToChannels
// 2) Video (legacy): { platform, videoUrl, caption?, serviceName? }
// ============================================================

const SOCIAL_CHANNELS: SocialChannel[] = ["facebook", "instagram", "google"];

function parseChannels(raw: unknown): SocialChannel[] {
  if (!Array.isArray(raw)) return [];
  const out: SocialChannel[] = [];
  for (const c of raw) {
    if (typeof c === "string" && SOCIAL_CHANNELS.includes(c as SocialChannel)) {
      out.push(c as SocialChannel);
    }
  }
  return [...new Set(out)];
}

interface VideoPostRequest {
  platform: "instagram" | "facebook" | "google";
  videoUrl: string;
  caption?: string;
  serviceName?: string;
}

async function postToInstagram(videoUrl: string, caption: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!accessToken || !igAccountId) {
    return { success: false, error: "Instagram credentials not configured" };
  }

  try {
    const fullVideoUrl = videoUrl.startsWith("http")
      ? videoUrl
      : `${process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL}${videoUrl}`;

    const createResponse = await fetch(`https://graph.facebook.com/v18.0/${igAccountId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_type: "REELS",
        video_url: fullVideoUrl,
        caption: caption,
        access_token: accessToken,
      }),
    });

    const createResult = await createResponse.json();

    if (createResult.error) {
      return { success: false, error: createResult.error.message };
    }

    const containerId = createResult.id;

    let status = "IN_PROGRESS";
    let attempts = 0;
    const maxAttempts = 30;

    while (status === "IN_PROGRESS" && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const statusResponse = await fetch(
        `https://graph.facebook.com/v18.0/${containerId}?fields=status_code&access_token=${accessToken}`
      );
      const statusResult = await statusResponse.json();
      status = statusResult.status_code;
      attempts++;
    }

    if (status !== "FINISHED") {
      return { success: false, error: `Video processing failed: ${status}` };
    }

    const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${igAccountId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: accessToken,
      }),
    });

    const publishResult = await publishResponse.json();

    if (publishResult.error) {
      return { success: false, error: publishResult.error.message };
    }

    return { success: true, postId: publishResult.id };
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : String(error);
    return { success: false, error: err };
  }
}

async function postToFacebook(videoUrl: string, caption: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!accessToken || !pageId) {
    return { success: false, error: "Facebook credentials not configured" };
  }

  try {
    const fullVideoUrl = videoUrl.startsWith("http")
      ? videoUrl
      : `${process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL}${videoUrl}`;

    const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_url: fullVideoUrl,
        description: caption,
        access_token: accessToken,
      }),
    });

    const result = await response.json();

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, postId: result.id };
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : String(error);
    return { success: false, error: err };
  }
}

async function postToGoogleBusiness(videoUrl: string, caption: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
  const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

  if (!refreshToken || !clientId || !clientSecret || !accountId) {
    return { success: false, error: "Google Business credentials not configured" };
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const tokenResult = await tokenResponse.json();

    if (!tokenResult.access_token) {
      return { success: false, error: "Failed to refresh Google access token" };
    }

    const accessToken = tokenResult.access_token;

    const fullVideoUrl = videoUrl.startsWith("http")
      ? videoUrl
      : `${process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL}${videoUrl}`;

    const postResponse = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/localPosts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          languageCode: "en-US",
          summary: caption.substring(0, 1500),
          topicType: "STANDARD",
          media: [
            {
              mediaFormat: "VIDEO",
              sourceUrl: fullVideoUrl,
            },
          ],
          callToAction: {
            actionType: "BOOK",
            url: `${SITE.url}/book`,
          },
        }),
      }
    );

    const postResult = await postResponse.json();

    if (postResult.error) {
      return { success: false, error: postResult.error.message };
    }

    return { success: true, postId: postResult.name };
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : String(error);
    return { success: false, error: err };
  }
}

async function handleVideoPost(body: VideoPostRequest) {
  const { platform, videoUrl, caption = "", serviceName = "campaign" } = body;

  if (!videoUrl) {
    return NextResponse.json({ success: false, error: "Video URL is required" }, { status: 400 });
  }

  console.log(`[Social Post] Posting ${serviceName} video to ${platform}`);
  console.log(`[Social Post] Video URL: ${videoUrl}`);

  let result: { success: boolean; postId?: string; error?: string };

  switch (platform) {
    case "instagram":
      result = await postToInstagram(videoUrl, caption);
      break;
    case "facebook":
      result = await postToFacebook(videoUrl, caption);
      break;
    case "google":
      result = await postToGoogleBusiness(videoUrl, caption);
      break;
    default:
      return NextResponse.json({ success: false, error: "Invalid platform" }, { status: 400 });
  }

  if (result.success) {
    console.log(`[Social Post] Success! Post ID: ${result.postId}`);
    return NextResponse.json({
      success: true,
      platform,
      postId: result.postId,
      message: `Video posted to ${platform} successfully`,
    });
  }
  console.error(`[Social Post] Failed: ${result.error}`);
  return NextResponse.json({ success: false, error: result.error }, { status: 500 });
}

async function handleTextPost(body: {
  message: string;
  channels: unknown;
  link?: string;
  imageUrl?: string;
  scheduledAt?: string;
}) {
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const channels = parseChannels(body.channels);
  if (channels.length === 0) {
    return NextResponse.json({ error: "channels must include at least one of: facebook, instagram, google" }, { status: 400 });
  }

  const link = typeof body.link === "string" && body.link.trim() ? body.link.trim() : undefined;
  const imageUrl = typeof body.imageUrl === "string" && body.imageUrl.trim() ? body.imageUrl.trim() : undefined;
  const scheduledRaw = typeof body.scheduledAt === "string" ? body.scheduledAt.trim() : "";

  if (scheduledRaw) {
    const scheduledDate = new Date(scheduledRaw);
    if (Number.isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: "Invalid scheduledAt" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured (SUPABASE_SERVICE_ROLE_KEY required to schedule)" },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from("scheduled_social_posts")
      .insert({
        message,
        link: link ?? null,
        image_url: imageUrl ?? null,
        channels,
        scheduled_at: scheduledDate.toISOString(),
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[social/post] scheduled insert:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      scheduled: true,
      id: data.id,
      scheduledAt: scheduledDate.toISOString(),
    });
  }

  const postResults = await postToChannels({ message, link, imageUrl }, channels);
  return NextResponse.json({ results: postResults });
}

function isTextMode(body: Record<string, unknown>): boolean {
  return typeof body.message === "string" && Array.isArray(body.channels);
}

function isVideoMode(body: Record<string, unknown>): boolean {
  return typeof body.videoUrl === "string" && !!body.videoUrl.trim() && typeof body.platform === "string";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (isTextMode(body)) {
      return handleTextPost(body as Parameters<typeof handleTextPost>[0]);
    }

    if (isVideoMode(body)) {
      return handleVideoPost(body as VideoPostRequest);
    }

    return NextResponse.json(
      {
        error:
          'Invalid body. Use { message, channels: ["facebook"|"instagram"|"google"], link?, imageUrl?, scheduledAt? } or { platform, videoUrl, caption } for video.',
      },
      { status: 400 }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : String(error);
    console.error("[Social Post] Error:", error);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}

export async function GET() {
  const hasInstagram = !!(process.env.FACEBOOK_PAGE_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID);
  const hasFacebook = !!(process.env.FACEBOOK_PAGE_ACCESS_TOKEN && process.env.FACEBOOK_PAGE_ID);
  const hasGoogle = !!(
    process.env.GOOGLE_REFRESH_TOKEN &&
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_BUSINESS_ACCOUNT_ID
  );

  const metaText = !!(process.env.META_PAGE_ACCESS_TOKEN && process.env.META_PAGE_ID);

  return NextResponse.json({
    platforms: {
      instagram: { configured: hasInstagram, name: "Instagram" },
      facebook: { configured: hasFacebook, name: "Facebook" },
      google: { configured: hasGoogle, name: "Google Business" },
    },
    textPostingMetaEnv: metaText,
    usage: {
      textSchedule: {
        body: {
          message: "Post copy",
          channels: ["facebook", "instagram", "google"],
          link: "https://...",
          imageUrl: "https://...",
          scheduledAt: "ISO 8601 — omit to post immediately (lib/hgos/social-posting.ts)",
        },
      },
      video: {
        body: {
          platform: "instagram | facebook | google",
          videoUrl: "/videos/your-video.mp4",
          caption: "Your post caption...",
          serviceName: "Service name for logging",
        },
      },
    },
  });
}
