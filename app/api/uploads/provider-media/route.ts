import { promises as fs } from "fs";

import { NextRequest, NextResponse } from "next/server";

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import {
  PROVIDER_MEDIA_BUCKET,
  assertFileSize,
  compressProviderVideo,
  createStoragePath,
  generateImageSeoAlt,
  processProviderImage,
  writeBufferToTempFile,
} from "@/lib/providers/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UploadResponse = {
  url: string;
  path: string;
  bytes: number;
  width?: number;
  height?: number;
  durationSeconds?: number;
  thumbnailUrl?: string;
  thumbnailPath?: string;
  blurDataUrl?: string;
  /** SEO: generated alt tag for treatment + city */
  altText?: string;
};

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/mov", "video/x-m4v"];

async function safeUnlink(filePath?: string | null) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore
  }
}

function extensionFromName(name?: string | null) {
  if (!name || !name.includes(".")) return "bin";
  return name.split(".").pop() || "bin";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const providerSlug = (formData.get("providerSlug") as string) || "provider";
    const assetRole = (formData.get("assetRole") as string) || "before";
    const watermark = formData.get("watermark") !== "false";
    const serviceTag = (formData.get("serviceTag") as string) || "";
    const treatmentName = (formData.get("treatmentName") as string) || "medical aesthetics";

    const buffer = Buffer.from(await file.arrayBuffer());
    assertFileSize(buffer);

    const contentType = file.type || "application/octet-stream";
    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
    }
    const storage = supabase.storage.from(PROVIDER_MEDIA_BUCKET);

    if (VIDEO_TYPES.includes(contentType)) {
      const tempInput = await writeBufferToTempFile(buffer, extensionFromName(file.name));
      const compression = await compressProviderVideo(tempInput);
      const videoBuffer = await fs.readFile(compression.filepath);

      const videoPath = createStoragePath({ providerSlug, mediaType: "video", extension: "mp4" });
      const upload = await storage.upload(videoPath, videoBuffer, {
        contentType: "video/mp4",
        upsert: true,
      });
      if (upload.error) throw upload.error;

      const videoPublic = storage.getPublicUrl(videoPath);

      let thumbnailUrl: string | undefined;
      if (compression.thumbnailPath) {
        const thumbBuffer = await fs.readFile(compression.thumbnailPath);
        const thumbPath = createStoragePath({ providerSlug, mediaType: "thumbnail", extension: "jpg" });
        const thumbUpload = await storage.upload(thumbPath, thumbBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });
        if (thumbUpload.error) throw thumbUpload.error;
        thumbnailUrl = storage.getPublicUrl(thumbPath).data.publicUrl;
        await safeUnlink(compression.thumbnailPath);
      }

      await Promise.all([safeUnlink(tempInput), safeUnlink(compression.filepath)]);

      return NextResponse.json({
        url: videoPublic.data.publicUrl,
        path: videoPath,
        bytes: compression.sizeInBytes,
        width: compression.width,
        height: compression.height,
        durationSeconds: compression.durationSeconds,
        thumbnailUrl,
      } satisfies UploadResponse);
    }

    if (!IMAGE_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const processed = await processProviderImage(buffer, { enableWatermark: watermark });
    const extension = contentType === "image/png" ? "png" : "webp";
    const seoSlug =
      serviceTag && treatmentName
        ? `${(treatmentName || serviceTag).toLowerCase().replace(/\s+/g, "-")}-oswego-hello-gorgeous`
        : undefined;
    const storagePath = createStoragePath({
      providerSlug,
      mediaType: assetRole === "after" ? "after" : "before",
      extension,
      seoSlug,
    });

    const upload = await storage.upload(storagePath, processed.buffer, {
      contentType: contentType === "image/png" ? "image/png" : "image/webp",
      upsert: true,
    });
    if (upload.error) throw upload.error;

    const publicData = storage.getPublicUrl(storagePath);
    const altText = generateImageSeoAlt({
      treatment: treatmentName || (serviceTag ? serviceTag.replace(/_/g, " ") : "treatment"),
      city: "Oswego IL",
      brand: "Hello Gorgeous Med Spa",
    });

    return NextResponse.json({
      url: publicData.data.publicUrl,
      path: storagePath,
      bytes: processed.buffer.byteLength,
      width: processed.width,
      height: processed.height,
      blurDataUrl: processed.blurDataUrl,
      altText,
    } satisfies UploadResponse);
  } catch (error: any) {
    console.error("Provider media upload error:", error);
    return NextResponse.json({ error: error?.message || "Upload failed" }, { status: 500 });
  }
}
