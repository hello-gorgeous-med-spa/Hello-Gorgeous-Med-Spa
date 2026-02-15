// ============================================================
// SIGNED URL API
// Generate pre-signed upload URLs for large file uploads
// This allows direct upload to Supabase Storage, bypassing
// the 4.5MB serverless function limit
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROVIDER_MEDIA_BUCKET = "provider-media";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      filename,
      contentType,
      providerSlug = "site",
      mediaType = "video",
    } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename and contentType are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
    }

    // Generate a unique path for the file
    const extension = filename.split(".").pop() || "mp4";
    const uniqueId = randomUUID();
    const storagePath = `${providerSlug}/${mediaType}/${uniqueId}.${extension}`;

    // Create a signed upload URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from(PROVIDER_MEDIA_BUCKET)
      .createSignedUploadUrl(storagePath);

    if (error) {
      console.error("Signed URL error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create upload URL" },
        { status: 500 }
      );
    }

    // Get public URL for after upload completes
    const publicUrl = supabase.storage
      .from(PROVIDER_MEDIA_BUCKET)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: storagePath,
      publicUrl: publicUrl.data.publicUrl,
    });
  } catch (error: any) {
    console.error("Signed URL error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
