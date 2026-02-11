"use server";

import { randomUUID } from "crypto";
import { createWriteStream, promises as fs } from "fs";
import path from "path";

import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import sharp from "sharp";

import type { Database } from "@/lib/hgos/supabase/database.types";

export type ProviderServiceTag = Database["public"]["Enums"]["provider_service_tag"];

export const PROVIDER_MEDIA_BUCKET = "provider-media";
export const PROVIDER_MEDIA_MAX_BYTES = 100 * 1024 * 1024; // 100MB hard limit

export const PROVIDER_MEDIA_SERVICE_LABELS: Record<ProviderServiceTag, string> = {
  botox: "Botox / Dysport",
  lip_filler: "Lip Filler",
  prp: "PRP / PRF",
  hormone_therapy: "Hormone Therapy",
  weight_loss: "Weight Loss",
  microneedling: "Microneedling",
  laser: "Laser",
  other: "Aesthetics",
};

export type VideoCompressionResult = {
  filepath: string;
  durationSeconds?: number;
  width?: number;
  height?: number;
  sizeInBytes: number;
  thumbnailPath?: string;
};

export type ImageProcessResult = {
  buffer: Buffer;
  width: number;
  height: number;
  blurDataUrl: string;
};

type BeforeAfterAssets = {
  before: ImageProcessResult;
  after: ImageProcessResult;
};

ffmpeg.setFfmpegPath(ffmpegStatic || undefined);

export function assertFileSize(buffer: Buffer) {
  if (buffer.byteLength > PROVIDER_MEDIA_MAX_BYTES) {
    throw new Error("File exceeds 100MB limit for provider media");
  }
}

export function generateProviderMediaAltText(options: {
  providerName: string;
  serviceTag?: ProviderServiceTag | null;
  headline?: string | null;
}) {
  const { providerName, serviceTag, headline } = options;
  const serviceText = serviceTag ? PROVIDER_MEDIA_SERVICE_LABELS[serviceTag] : "medical aesthetics";
  if (headline) {
    return `${headline} by ${providerName}`;
  }
  return `Before and after ${serviceText.toLowerCase()} by ${providerName}`;
}

export async function processBeforeAfterBuffers(input: {
  before: Buffer;
  after: Buffer;
  watermarkText?: string;
  enableWatermark?: boolean;
}): Promise<BeforeAfterAssets> {
  const { before, after, watermarkText = "Hello Gorgeous Med Spa", enableWatermark = true } = input;
  assertFileSize(before);
  assertFileSize(after);

  const [beforeResult, afterResult] = await Promise.all([
    transformSingleImage(before, enableWatermark ? watermarkText : null),
    transformSingleImage(after, enableWatermark ? watermarkText : null),
  ]);

  return { before: beforeResult, after: afterResult };
}

export async function processProviderImage(buffer: Buffer, options?: { watermarkText?: string; enableWatermark?: boolean }) {
  const { watermarkText = "Hello Gorgeous Med Spa", enableWatermark = true } = options || {};
  assertFileSize(buffer);
  return transformSingleImage(buffer, enableWatermark ? watermarkText : null);
}

async function transformSingleImage(buffer: Buffer, watermarkText: string | null): Promise<ImageProcessResult> {
  let pipeline = sharp(buffer).rotate().resize({
    width: 2400,
    height: 2400,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (watermarkText) {
    const svg = Buffer.from(
      `<svg width="600" height="200">
        <style>.title { fill: #ffffff88; font-size: 48px; font-family: 'Helvetica'; }</style>
        <text x="50%" y="50%" text-anchor="middle" class="title">${watermarkText}</text>
      </svg>`,
    );
    pipeline = pipeline.composite([{ input: svg, gravity: "south" }]);
  }

  const optimized = await pipeline.webp({ quality: 92 }).toBuffer();
  const metadata = await sharp(optimized).metadata();
  const blur = await sharp(optimized).resize(16).toBuffer();

  return {
    buffer: optimized,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

export async function compressProviderVideo(inputPath: string): Promise<VideoCompressionResult> {
  const tempDir = path.join(process.cwd(), ".next", "cache", "provider-media");
  await fs.mkdir(tempDir, { recursive: true });
  const outputPath = path.join(tempDir, `${randomUUID()}.mp4`);
  const thumbnailPath = path.join(tempDir, `${randomUUID()}.jpg`);

  await new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .addOptions(["-preset faster", "-movflags +faststart", "-crf 24", "-vf scale='min(1080,iw)':-2"])
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });

  await new Promise<void>((resolve, reject) => {
    ffmpeg(outputPath)
      .screenshots({
        timestamps: ["50%"],
        filename: path.basename(thumbnailPath),
        folder: tempDir,
        size: "640x?",
      })
      .on("end", resolve)
      .on("error", reject);
  });

  const probe = await probeVideo(outputPath);

  const stats = await fs.stat(outputPath);
  if (stats.size > PROVIDER_MEDIA_MAX_BYTES) {
    throw new Error("Compressed video still exceeds 100MB limit");
  }

  return {
    filepath: outputPath,
    durationSeconds: probe?.format?.duration ? Math.round(probe.format.duration) : undefined,
    width: probe?.streams?.[0]?.width,
    height: probe?.streams?.[0]?.height,
    sizeInBytes: stats.size,
    thumbnailPath,
  };
}

async function probeVideo(filepath: string) {
  return await new Promise<ffmpeg.FfprobeData | null>((resolve, reject) => {
    ffmpeg.ffprobe(filepath, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

export async function writeBufferToTempFile(buffer: Buffer, extension: string) {
  const tempDir = path.join(process.cwd(), ".next", "cache", "provider-media");
  await fs.mkdir(tempDir, { recursive: true });
  const filepath = path.join(tempDir, `${randomUUID()}.${extension.replace(/^\./, "")}`);
  await fs.writeFile(filepath, buffer);
  return filepath;
}

export function createStoragePath(options: {
  providerSlug: string;
  mediaType: "video" | "before" | "after" | "thumbnail";
  extension: string;
}) {
  const { providerSlug, mediaType, extension } = options;
  const safeSlug = providerSlug || "provider";
  return `${safeSlug}/${mediaType}/${randomUUID()}.${extension}`;
}

export async function saveStream(stream: NodeJS.ReadableStream, filepath: string) {
  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await new Promise<void>((resolve, reject) => {
    const writeStream = createWriteStream(filepath);
    stream.pipe(writeStream);
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}
