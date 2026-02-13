/**
 * Cloudflare Stream API client
 * https://developers.cloudflare.com/stream/
 */

const STREAM_API = "https://api.cloudflare.com/client/v4";

export type StreamUploadResult = {
  uid: string;
  thumbnail?: string;
  duration?: number;
  status?: string;
};

export async function uploadVideoToStream(
  file: File | Blob,
  options: {
    accountId: string;
    apiToken: string;
    maxDurationSeconds?: number;
    filename?: string;
  }
): Promise<StreamUploadResult> {
  const { accountId, apiToken, maxDurationSeconds = 3600, filename = "video.mp4" } = options;

  const formData = new FormData();
  formData.append("file", file, filename);

  const url = `${STREAM_API}/accounts/${accountId}/stream`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body: formData,
  });

  const data = (await res.json()) as {
    success: boolean;
    result?: { uid: string; thumbnail?: string; duration?: number; status?: string };
    errors?: Array<{ message: string }>;
  };

  if (!res.ok || !data.success || !data.result?.uid) {
    const errMsg = data.errors?.[0]?.message || `Stream upload failed: ${res.status}`;
    throw new Error(errMsg);
  }

  return {
    uid: data.result.uid,
    thumbnail: data.result.thumbnail,
    duration: data.result.duration,
    status: data.result.status,
  };
}

/** Embed URL for iframe - https://iframe.videodelivery.net/{uid} */
export function getStreamEmbedUrl(uid: string): string {
  return `https://iframe.videodelivery.net/${uid}`;
}

/** HLS playback URL (for video element src) */
export function getStreamPlaybackUrl(uid: string): string {
  return `https://customer-${process.env.NEXT_PUBLIC_STREAM_CUSTOMER_CODE || "placeholder"}.cloudflarestream.com/${uid}/manifest/video.m3u8`;
}
