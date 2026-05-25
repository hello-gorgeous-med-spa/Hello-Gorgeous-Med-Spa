/** Load client photos with EXIF orientation applied (phone uploads). */

export async function loadOrientedImageFromSrc(src: string): Promise<HTMLImageElement> {
  if (typeof window === "undefined") {
    throw new Error("loadOrientedImageFromSrc is browser-only");
  }

  const res = await fetch(src);
  const blob = await res.blob();

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
  } catch {
    bitmap = await createImageBitmap(blob);
  }

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create orientation canvas");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const dataUrl = canvas.toDataURL(blob.type || "image/jpeg", 0.92);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not load oriented image"));
    img.src = dataUrl;
  });
  return img;
}
