import { NextRequest, NextResponse } from "next/server";

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { uploadVideoToStream } from "@/lib/cloudflare-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MB = 200;
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/mov", "video/x-m4v", "video/webm"];

export async function POST(request: NextRequest) {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN;

    if (!accountId || !apiToken) {
      return NextResponse.json(
        { error: "Cloudflare Stream not configured. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_STREAM_API_TOKEN to env." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const title = (formData.get("title") as string) || file.name;
    const description = (formData.get("description") as string) || "";
    const useCase = (formData.get("use_case") as string) || "general";

    if (file.size > MAX_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File must be under ${MAX_MB}MB. Use Cloudflare Stream direct upload for larger files.` },
        { status: 400 }
      );
    }

    const type = file.type || "";
    const ext = file.name.toLowerCase().match(/\.(mp4|mov|m4v|webm)$/)?.[1];
    if (!VIDEO_TYPES.includes(type) && !ext) {
      return NextResponse.json(
        { error: "Unsupported format. Use MP4, MOV, or WebM." },
        { status: 400 }
      );
    }

    const result = await uploadVideoToStream(file, {
      accountId,
      apiToken,
      maxDurationSeconds: 3600,
      filename: file.name,
    });

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase.from("media").insert({
        title,
        description,
        stream_uid: result.uid,
        thumbnail_url: result.thumbnail,
        use_case: useCase,
        metadata: { duration: result.duration, status: result.status },
      });
    }

    return NextResponse.json({
      uid: result.uid,
      thumbnail: result.thumbnail,
      duration: result.duration,
      embedUrl: `https://iframe.videodelivery.net/${result.uid}`,
    });
  } catch (error: unknown) {
    console.error("Stream upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
