"use client";

type StreamVideoProps = {
  /** Cloudflare Stream video UID */
  uid: string;
  /** Optional poster/thumbnail before load */
  poster?: string;
  /** Allow fullscreen */
  allowFullScreen?: boolean;
  /** Allow picture-in-picture */
  allowPictureInPicture?: boolean;
  /** Lazy load */
  loading?: "lazy" | "eager";
  /** Additional class names */
  className?: string;
  /** Aspect ratio container - default aspect-video */
  aspect?: "video" | "square" | "auto";
};

const EMBED_BASE = "https://iframe.videodelivery.net";

export function StreamVideo({
  uid,
  poster,
  allowFullScreen = true,
  allowPictureInPicture = true,
  loading = "lazy",
  className = "",
  aspect = "video",
}: StreamVideoProps) {
  const aspectClass = aspect === "video" ? "aspect-video" : aspect === "square" ? "aspect-square" : "";

  const embedUrl = `${EMBED_BASE}/${uid}?preload=metadata`;

  return (
    <div className={`relative overflow-hidden rounded-xl ${aspectClass} ${className}`}>
      <iframe
        src={embedUrl}
        title="Video"
        loading={loading}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen={allowFullScreen}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
