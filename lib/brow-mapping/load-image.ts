/** Load client photos with EXIF orientation when supported; always falls back to plain decode. */

const MAX_ORIENTATION_BYTES = 14 * 1024 * 1024;

function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(",");
  if (comma < 0) throw new Error("Invalid data URL");
  const header = dataUrl.slice(0, comma);
  const mime = /data:([^;]+)/.exec(header)?.[1] ?? "image/jpeg";
  const b64 = dataUrl.slice(comma + 1);
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

async function loadPlainSrc(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not decode image"));
    img.src = src;
  });
  if (img.naturalWidth < 1 || img.naturalHeight < 1) {
    await img.decode?.().catch(() => {});
  }
  if (img.naturalWidth < 1 || img.naturalHeight < 1) {
    throw new Error("Image has no dimensions");
  }
  return img;
}

async function orientedFromBlob(blob: Blob): Promise<HTMLImageElement> {
  if (blob.size > MAX_ORIENTATION_BYTES) {
    throw new Error("Skip orientation pass for large file");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" } as ImageBitmapOptions);
  } catch {
    bitmap = await createImageBitmap(blob);
  }

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not create canvas");
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const out = canvas.toDataURL(blob.type?.startsWith("image/") ? blob.type : "image/jpeg", 0.92);
  return loadPlainSrc(out);
}

export async function loadOrientedImageFromFile(file: File): Promise<HTMLImageElement> {
  try {
    return await orientedFromBlob(file);
  } catch {
    const url = URL.createObjectURL(file);
    try {
      return await loadPlainSrc(url);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

export async function loadOrientedImageFromSrc(src: string): Promise<HTMLImageElement> {
  try {
    const blob = src.startsWith("data:") ? dataUrlToBlob(src) : await (await fetch(src)).blob();
    return await orientedFromBlob(blob);
  } catch {
    return loadPlainSrc(src);
  }
}
