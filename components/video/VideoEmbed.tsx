type VideoEmbedProps = {
  embedUrl: string;
  title: string;
  className?: string;
};

export function VideoEmbed({ embedUrl, title, className }: VideoEmbedProps) {
  return (
    <iframe
      className={className ?? "h-full w-full"}
      src={embedUrl}
      title={title}
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      loading="lazy"
    />
  );
}
