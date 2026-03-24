/**
 * Official Facebook post embed (plugins/post.php).
 * CSP: `frame-src` must include https://www.facebook.com (see next.config.js).
 */
const DEFAULT_EMBED_SRC =
  "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FHelloGorgeousOswego%2Fposts%2Fpfbid02v2z5nSpxMkH32mzevu1o5Tjj1V8uuHDKyEK5vED8uSty7GZgY2bbLJMLp5ERZMpql&show_text=true&width=500";

export const HELLO_GORGEOUS_FACEBOOK_POST_URL =
  "https://www.facebook.com/HelloGorgeousOswego/posts/pfbid02v2z5nSpxMkH32mzevu1o5Tjj1V8uuHDKyEK5vED8uSty7GZgY2bbLJMLp5ERZMpql";

type FacebookPostEmbedProps = {
  /** Full plugins/post.php URL; defaults to the featured Hello Gorgeous Oswego post. */
  embedSrc?: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
};

export function FacebookPostEmbed({
  embedSrc = DEFAULT_EMBED_SRC,
  title = "Hello Gorgeous Med Spa — Facebook post",
  width = 500,
  height = 735,
  className = "",
}: FacebookPostEmbedProps) {
  return (
    <div className={`w-full max-w-[500px] mx-auto ${className}`.trim()}>
      <iframe
        src={embedSrc}
        width={width}
        height={height}
        className="w-full max-w-full rounded-xl border border-black/10 bg-white shadow-sm"
        style={{ border: "none", overflow: "hidden" }}
        scrolling="no"
        title={title}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
